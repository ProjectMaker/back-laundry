import { createTheme } from '@mui/material/styles'

const ThemeCenter = createTheme({
  palette: {
    type: 'light',
    common: {
      black: '#666',
      white: '#FFF',
      accent: '#3B82F6'
    },
    contrastThreshold: 2,
    tonalOffset: 0.064,
    background: {
      primary: '#F6F7F8'
    },
    content: {
      primary: '#4d4f5b',
      dimmed: '#DADDE3',
      secondary: '#5D5D5D',
      tertiary: '#A2AAB8'
    },
    primary: {
      main: '#0066D3'
    },
    success: {
      main: '#02a84d',
      contrastText: '#FFF'
    },
    warning: {
      main: '#FFB74D',
      contrastText: '#FFF'
    },
    error: {
      main: '#DC2626',
      secondary: '#C10303 ',
      contrastText: '#FFF'
    },
    neutral: {
      300: '#bbb'
    },
    border: {
      primary: '#E5E7EB'
    },
    grey: {
      100: 'hsl(208, 16%, 96%)', // L96
      200: 'hsl(208, 16%, 88%)', // L88
      300: 'hsl(208, 16%, 80%)', // L80
      400: 'hsl(208, 16%, 72%)', // L72
      500: 'hsl(208, 16%, 64%)', // L64
      600: 'hsl(208, 16%, 56%)', // L56
      700: 'hsl(208, 16%, 48%)', // L48
      800: 'hsl(208, 16%, 40%)', // H208 S16 L40
      850: 'hsl(208, 16%, 32%)', // L32
      900: 'hsl(208, 16%, 24%)', // L24
      950: 'hsl(208, 16%, 16%)', // L16
      999: 'hsl(208, 16%, 8%)', // L8
      main: 'hsl(208, 16%, 40%)',
      light: '#DAE0E7',
      dark: '#405060'
    },
    red: {
      600: '#DC2626'
    }
  },
  spacing: 8,
  shape: theme => ({
    borderRadius: theme.spacing(1)
  }),
  typography: palette => ({
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 600,
    fontColor: palette.content.secondary,
    h6: {
      color: palette.content.tertiary
    }
  }),
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '2px 8px',
          textTransform: 'inherit',
          borderRadius: '16px'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        h6: ({theme}) => ({
          color: theme.palette.primary.main
        }),
        subtitle1: ({theme}) => ({
          color: theme.palette.primary.main
        })
      }
    },
    MuiTabs: {
      styleOverrides: {
        flexContainer: ({theme}) => ({
          gap: theme.spacing(2),
        }),
        indicator: ({theme}) => ({
          backgroundColor: theme.palette.success.main
        })
      }
    },
    MuiTab: {
      styleOverrides: {
        root: ({theme}) => ({
          '&.Mui-selected': {
            color: theme.palette.content.primary,
          },
          '&.Mui-selected svg': {
            color: theme.palette.success.main
          }
        }),
        labelIcon: ({theme}) => ({
          padding: 0,
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(.5),
          display: 'flex',
          gap: theme.spacing(1),
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          minHeight: 'inherit'
        })
      }
    },
    MuiCard: {
      styleOverrides: {
        root: ({theme}) => ({
          padding: theme.spacing(2),
          display: 'flex',
          minWidth: 900,
          gap: 16,
        })
      }
    },
    MuiList: {
      styleOverrides: {
        root: ({theme}) => ({
          maxHeight: '200px'
        })
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: ({theme}) => ({
          '&.clickable': {
            cursor: 'pointer'
          },
          //borderRadius: 4,
          border: `1px solid ${theme.palette.grey[300]}`,
          borderTop: 0,
          background: 'white',
          '&.clickable:hover': {
            background: theme.palette.grey[300],
          },
          '&:first-of-type': {
            borderTop: `1px solid ${theme.palette.grey[300]}`,
          }
        })
      }
    }
  }
})

export default ThemeCenter
