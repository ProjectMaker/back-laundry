import { useState } from 'react'
import {
  Stack,
  ThemeProvider,
  Card,
  CardHeader,
  Avatar
} from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';
import './index.css'
import Theme from './theme'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={Theme}>
        <Stack
          align='center'
          direction='row' spacing={1}
          justifyContent='center'
          alignItems='center'
          m={4}
        >
          <Card
            variant='outlined'
            sx={{
              minWidth: 700
            }}
          >
            <CardHeader
              avatar={
                <Avatar aria-label="recipe">
                  BO
                </Avatar>
              }
              title="Back Office Club Laverie"
            />
          </Card>
        </Stack>
      </ThemeProvider>
    </>
  )
}

export default App
