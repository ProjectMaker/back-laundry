import {
  Stack,
  ThemeProvider,
  Card
} from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClientProvider } from '@tanstack/react-query'
import { RecoilRoot } from 'recoil'
import { Routes, Route, Outlet, BrowserRouter as Router, Navigate } from 'react-router-dom'
import './index.css'
import Theme from './theme'
import Header from './components/HeaderCard'
import Authenticated from './components/AuthenticatedRoute'

import FormLaundry from "./pages/club/FormLaundry"
import List from "./pages/club/List"
import Detail from "./pages/washmap/Detail"
import Washmap from './pages/washmap/Home'
import { client } from './api'


const Page = () => {
  return (
    <Authenticated>
      <Card sx={{flexDirection: 'column'}}>
        <Header />
        <Outlet />
      </Card>
    </Authenticated>
  )
}


function App() {
  return (
    <QueryClientProvider client={client}>
      <RecoilRoot>
        <CssBaseline />
        <Router>
          <ThemeProvider theme={Theme}>
            <Stack
              gap={4}
              m={4}
            >
              <Routes>
                <Route path={''} element={<Page />}>
                  <Route path={'/'} element={<Navigate to={'/laundries'} />} />
                  <Route path={'/laundries'} element={<List />} />

                  <Route path={'/laundry/:id?'} element={<FormLaundry />} />
                  <Route path={'/washmap'} element={<Washmap />} />
                  <Route path={'/washmap/new'} element={<Detail />} />
                  <Route path={'/washmap/:id?'} element={<Detail />} />
                  <Route path={'*'} element={<Navigate to={'/laundries'}/>} />
                </Route>
              </Routes>
            </Stack>
          </ThemeProvider>
        </Router>
      </RecoilRoot>
    </QueryClientProvider>
  )
}

export default App
