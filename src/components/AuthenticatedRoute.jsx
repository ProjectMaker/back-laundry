import { useState, useEffect } from 'react'
import {Box, Button, Card as UICard, Stack, Typography} from "@mui/material";
import {useMutation} from "@tanstack/react-query";
import { useForm, FormProvider } from 'react-hook-form'
import SaveIcon from "@mui/icons-material/Save"
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { jwtDecode } from 'jwt-decode'
import {signUp, supabase} from "../api/index";

import { TextField } from './Form'
import Header from '../templates/Header'
import {buildSignUpSchema} from "../api/schema";

export const Card = ({children, ...props}) => <UICard variant={'outlined'} {...props}>{children}</UICard>

const SignUp = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(buildSignUpSchema())
  })
  const {mutate, isLoading, data, error} = useMutation({
    mutationFn: ({email, password}) => signUp({email, password}),
    onError: (err) => {
      console.log(err)
    }
  })

  const handleSubmit = async ({email, password}) => {
    await mutate({email, password})
  }
  return (
    <Stack gap={2}>
      <Card>
        <Stack gap={2} flex={1}>
          {
            Boolean(data?.error) && (
              <Box>
                <Typography color={'error'} variant={'caption'}>
                  Email ou password invalides
                </Typography>
              </Box>
            )
          }
          <FormProvider {...form}>
            <TextField label={"Email"} name={'email'} />
            <TextField label={"Password"} name={'password'} type='password' />
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
              <Button
                color={'success'}
                variant={'contained'}
                size={'small'}
                sx={{justifySelf: 'flex-end'}}
                onClick={form.handleSubmit(handleSubmit)}
                startIcon={<SaveIcon />}
              >
                {isLoading ? 'En cours ...' : 'Valider'}
              </Button>
            </Box>
          </FormProvider>
        </Stack>
      </Card>
    </Stack>
  )
}

export default function App({children}) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const handleAuthChange = async (session) => {
    if (session) {
      console.log(jwtDecode(session.access_token))
      const {user_role} = jwtDecode(session.access_token)
      setUser({...session.user, admin: user_role === 'admin'})
    } else {
      setUser(null)
    }
  }

  useEffect(() => {
    setLoading(true)
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => handleAuthChange(session))
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session)
        .then(() => setLoading(false))
        .catch(() => setLoading(false))
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <Typography variant={'h6'}>Chargement ...</Typography>
  } else if (!user || !user.admin) {
    return (<SignUp />)
  }
  else {
    return (
      <Card sx={{flexDirection: 'column'}}>
        <Header />
        {children}
      </Card>
    )
  }
}
