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
      main: '#3B82F6'
    },
    success: {
      main: '#92BC62',
      contrastText: '#FFF'
    },
    warning: {
      main: '#F59E0B',
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
    h1: {
      color: palette.common.black,
      fontSize: 32,
      fontWeight: 700
    },
    h2: {
      color: palette.common.black,
      fontSize: 24,
      fontWeight: 600
    },
    h4: {
      color: palette.common.black,
      fontSize: 12,
      fontWeight: 400
    }
  }),
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          display: 'flex',
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(122,171,212,1) 44%, rgba(255,255,255,1) 100%)'
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        title: ({ theme }) => ({
          color: theme.palette.content.secondary
        })
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(0, 2),
          '&.isActive': {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.grey.dark
          }
        })
      }
    },
    MuiToggleButtonGroup: {
      defaultProps: {
        color: 'primary',
        labelcolor: 'primary'
      },
      styleOverrides: {
        outlined: ({ theme }) => ({
          color: theme.palette.grey.main,
          backgroundColor: theme.palette.common.white
        })
      }
    },
    MuiButton: {
      defaultProps: {
        color: 'primary',
        labelcolor: 'primary',
        disableElevation: true
      },
      styleOverrides: {
        root: ({ ownerState }) => ({
          fontFamily: 'Poppins',
          fontWeight: 500,
          fontSize: '12px',
          textTransform: 'inherit',
          width: 'auto',
          minWidth: ownerState.loading ? 100 : 'auto',
          borderRadius: '6px',
          padding: '6px 14px'
        }),
        contained: ({ theme, ownerState }) => ({
          color: theme.palette[ownerState.color]?.contrastText,
          '&:hover': {
            backgroundColor: theme.palette[ownerState.color]?.dark
          },
          '&:active': {
            backgroundColor: theme.palette[ownerState.color]?.light
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.action.disabled
          }
        }),
        outlined: ({ theme, ownerState }) => ({
          color: theme.palette.grey.main,
          borderColor: theme.palette.grey.light,
          backgroundColor: theme.palette.common.white,
          '&:hover': {
            borderColor: theme.palette.grey.light,
            color: theme.palette[ownerState.color]?.dark
          },
          '&:active': {
            color: theme.palette[ownerState.color]?.light
          }
        }),
        sizeMedium: ({ theme, ownerState }) => ({
          height: '100%',
          minHeight: 40,
          fontSize: 14,
          lineHeight: theme.spacing(4),
          borderRadius: theme.spacing(0.75),
          paddingTop: 0,
          paddingRight: ownerState.endIcon ? theme.spacing(1.5) : theme.spacing(2),
          paddingBottom: 0,
          paddingLeft: ownerState.startIcon ? theme.spacing(1.5) : theme.spacing(2)
        })
      }
    },
    MuiIcon: {
      defaultProps: {
        size: 2
      },
      styleOverrides: {
        root: ({ theme }) => ({
          width: theme.spacing(1),
          height: theme.spacing(1),
          fontSize: 16,
          overflow: 'visible',
          borderRadius: 2
        })
      }
    },
    MuiInputBase: {
      defaultProps: {
        size: 'small'
      },
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.grey[800],
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer'
        })
      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          margin: 0
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          background: '#F6F6F6',
          '& .MuiInputBase-root.Mui-disabled': {
            '& > fieldset': {
              borderColor: '#E5E7EB'
            }
          }
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          padding: 2,
          fontStyle: 'normal'
        }
      }
    },
    MuiTableContainer: {
      defaultProps: {},
      styleOverrides: {
        root: {
          width: 'auto',
          flexGrow: 1,
          border: '1px solid #DAE0E7',
          backgroundColor: '#FEFEFE',
          overflow: 'hidden',
          overflowX: 'auto',
          overflowY: 'auto',
          borderRadius: '8px',
          zIndex: 1
        }
      }
    },
    MuiTableHead: {
      defaultProps: {},
      styleOverrides: {
        root: {}
      }
    },
    MuiTableBody: {
      defaultProps: {},
      styleOverrides: {
        root: {}
      }
    },
    MuiTableRow: {
      defaultProps: {},
      styleOverrides: {
        root: ({ theme }) => ({
          transition: 'all ease-in-out .2s',
          '& th': {
            height: '40px',
            '&:after': {
              top: 0,
              bottom: 0,
              right: 0,
              width: 1,
              height: 40,
              margin: 'auto',
              content: '" "',
              display: 'block',
              position: 'absolute',
              backgroundColor: '#E0E0E0'
            },
            '&:last-child:after': {
              display: 'none'
            }
          },
          '& th.actions': {
            width: '80px'
          },
          '&.active': {
            backgroundColor: theme.palette.grey['100']
          },
          '&:hover': {
            backgroundColor: theme.palette.grey['100']
          }
        })
      }
    },
    MuiTableCell: {
      defaultProps: {},
      styleOverrides: {
        root: {
          fontSize: 12,
          color: '#405060'
        },
        head: () => {
          return {
            fontWeight: 500,
            fontSize: 10,
            color: '#4D4F5B',
            lineHeight: '12px',
            padding: '10px 10px',
            height: '24px',
            textTransform: 'uppercase',
            maxWidth: '250px',
            cursor: 'pointer',
            userSelect: 'none',
            '&:hover': {
              color: '#146bb8'
            }
          }
        },
        body: ({ theme }) => ({
          maxHeight: '40px !important',
          borderBottom: `2px solid ${theme.palette.grey['100']}`,
          padding: '8px 12px',
          color: '#7A8096',
          fontWeight: 400
        })
      }
    },

    MuiTabs: {
      styleOverrides: {
        root: () => ({
          display: 'flex',
          minHeight: '32px !important',
          overflowX: 'auto',
          overflowY: 'hidden',
          margin: '0 0 12px',
          '&.justifyStart .MuiTabs-flexContainer': {
            justifyContent: 'flex-start'
          }
        }),
        flexContainer: ({ theme }) => {
          return {
            display: 'flex',
            gap: theme.spacing(2),
            justifyContent: 'space-between',
            '& > div': {
              padding: 0,
              fontSize: '12px',
              textTransform: 'capitalize',
              textAlign: 'left',
              color: theme.palette.grey['600'],
              border: '1px solid blue',
              '&.MuiTab-root': {
                alignItems: 'flex-start',
                textAlign: 'left',
                minHeight: '32px !important',
                textTransform: 'capitalize',
                border: 0,
                minWidth: 0,
                height: '32px',
                '&:hover': {
                  color: theme.palette.grey['900']
                },
                '&.uppercase': {
                  textTransform: 'uppercase'
                }
              },
              '&.Mui-selected': {
                color: theme.palette.grey['900']
              }
            }
          }
        },
        indicator: () => ({
          bottom: 0
        })
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: () => ({
          '&.MuiDialog-paper': {
            maxWidth: '1400px',
            maxHeight: '800px'
          }
        })
      }
    }
  }
})

export default ThemeCenter
