import {
  Stack,
  ThemeProvider
} from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Routes, Route, Outlet, BrowserRouter as Router, Navigate } from 'react-router-dom'
import './index.css'
import Theme from './theme'
import Typography from '@mui/material/Typography'
import HeaderCard, {Card} from './components/HeaderCard'
import FormLaundry from "./pages/FormLaundry"
import List from "./pages/List"
import Authenticated from './pages/Authenticated'

export const client = new QueryClient()


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
              <Route path={''} element={<Authenticated><Outlet /></Authenticated>}>
                <Route path={'/'} element={<Navigate to={'/laundries'} />} />
                <Route path={'/laundries'} element={<List />} />

                <Route path={'/laundry/:id?'} element={<FormLaundry />} />
              </Route>
            </Routes>
          </Stack>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
