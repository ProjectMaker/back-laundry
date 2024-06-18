import {
  Box,
  Button,
  Stack,
  Typography
} from '@mui/material'
import {
  useMutation
} from '@tanstack/react-query'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'

import { signUp } from "../api/index.js";
import Header, {Card, TextField} from '../components/HeaderCard.jsx'
import { buildSignUpSchema } from './use-save'
import SaveIcon from "@mui/icons-material/Save"

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
    },
    onSuccess: (data) => {

    }
  })

  const handleSubmit = async ({email, password}) => {
    const r = await mutate({email, password})
    console.log(r)
  }
  console.log(error)
  return (
    <Stack gap={2}>
      <Header>
        Authentification
      </Header>
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

export default SignUp
