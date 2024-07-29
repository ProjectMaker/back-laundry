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

import FormLaundry from "./pages/laundries/FormLaundry"
import Laundries from "./pages/laundries/List"
import FormMaterial from "./pages/materials/FormMaterial"
import Materials from './pages/materials/List.jsx'
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
                  <Route path={'/laundries'} element={<Laundries />} />

                  <Route path={'/laundry/:id?'} element={<FormLaundry />} />
                  <Route path={'/materials'} element={<Materials />} />
                  <Route path={'/material/:id?'} element={<FormMaterial />} />
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
