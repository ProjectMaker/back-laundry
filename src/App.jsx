import {
  Stack,
  ThemeProvider,
  Card
} from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Routes, Route, Outlet, BrowserRouter as Router, Navigate } from 'react-router-dom'
import './index.css'
import Theme from './theme'
import Header from './components/HeaderCard'
import Authenticated from './components/AuthenticatedRoute'

import FormLaundry from "./pages/club/FormLaundry"
import List from "./pages/club/List"
import Detail from "./pages/washmap/Detail"
import Washmap from './pages/washmap/Home'

export const client = new QueryClient()


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
      <CssBaseline />
      <Router>
        <ThemeProvider theme={Theme}>
          <Stack
            align='center'
            justifyContent='center'
            alignItems='center'
            gap={4}
            m={4}
          >
            <Routes>
              <Route path={''} element={<Page />}>
                <Route path={'/'} element={<Navigate to={'/laundries'} />} />
                <Route path={'/laundries'} element={<List />} />

                <Route path={'/laundry/:id?'} element={<FormLaundry />} />
                <Route path={'/washmap'} element={<Washmap />}>
                  <Route path={':id'} element={<Detail />} />
                </Route>
                <Route path={'*'} element={<Navigate to={'/laundries'}/>} />
              </Route>
            </Routes>
          </Stack>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
