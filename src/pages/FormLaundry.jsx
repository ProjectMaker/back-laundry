import { useState } from 'react'
import {
  Box,
  FormControl,
  Stack,
  Button,
  Tab,
  Tabs,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveIcon from '@mui/icons-material/Save';
import InfoIcon from '@mui/icons-material/Info';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useParams, useNavigate } from 'react-router-dom'
import { FormProvider, useForm, useFormContext, useFieldArray } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { useQuery } from '@tanstack/react-query'

import { getLaundry } from "../api/index.js";
import useSave, { buildSchema, DEFAULT_LAUNDRY } from './use-save'
import Header, { TextField, Card } from '../components/HeaderCard'
import ImagePicker from '../components/ImagePicker'
import Typography from "@mui/material/Typography";


const Materials = () => {
  const {control, formState} = useFormContext()
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "materials", // unique name for your Field Array
  });
  return (
    <Stack gap={2} flex={1}>
      {
        fields.map((field, i) => (
          <Stack direction={'row'} key={'field.name'} flex={1} alignItems={'center'}>
            <FormControl sx={{flexGrow: 1}}>
              <TextField
                name={`materials.${i}.name`}
                label={'Libellé'}
                error={!!(formState.errors['materials'] && formState.errors['materials'][i]?.['name'])}
                helperText={formState.errors['materials'] && formState.errors['materials'][i] ? formState.errors['materials'][i]['name'].message : null}
              />
            </FormControl>
            <IconButton onClick={() => remove(`materials.${i}.name`)} color={'warning'}>
              <DeleteIcon />
            </IconButton>

          </Stack>
        ))
      }
      <Button
        variant="contained"
        size={'small'}
        color={'success'}
        onClick={() => append({name: ''})}
        startIcon={<AddBoxIcon />}
      >
        Ajouter un matériel
      </Button>
    </Stack>
  )
}
const FormLaundry = ({laundry}) => {
  const [tab, setTab] = useState(0)
  const {error, loading, save} = useSave()
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: laundry,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(buildSchema()),
  })
  const handleSubmit = async (values) => {
    const newLaundry = await save(values)
    form.reset(newLaundry)
  }
  return (
    <>
      <Header><Typography variant={'h6'}>Edition</Typography></Header>
      <Card sx={{flexDirection: 'column'}}>
        {
          !!error && <Typography variant={'caption'} color={'error'}>{error.message}</Typography>
        }
        <FormProvider {...form}>
          <Stack gap={2} flex={1}>
            <Tabs value={tab} onChange={(e,index) => setTab(index)}>
              <Tab icon={<InfoIcon fontSize={'small'}/>} label="Général"/>
              <Tab icon={<AutoFixHighIcon fontSize={'small'}/>} label="Matériel" />
              <Tab icon={<AddAPhotoIcon fontSize={'small'}/>} label="Photo" />
            </Tabs>
            {
              tab === 0 && (
                <>
                  <FormControl>
                    <TextField label="Nom" name={'name'} />
                  </FormControl>
                  <Stack gap={2} direction={'row'} flex={1}>
                    <TextField label="Code postal" name={'postal_code'} />
                    <TextField label="Ville" name={'city'} sx={{flexGrow: 1}} />
                  </Stack>
                  <Stack gap={2} direction={'row'} flex={1}>
                    <TextField label="Surface" name={'surface'}/>
                    <TextField label="Prix" name={'price'} />
                    <TextField label="Loyer" name={'rent'} sx={{flexGrow: 1}} />
                  </Stack>
                  <TextField multiline rows={10} name={'description'} label={'Description'} />
                </>
              )
            }
            {
              tab === 1 && (
                <Materials />
              )
            }
            { tab === 2 && (
              <ImagePicker />
            )}
            <Box sx={{display: 'flex', justifyContent: 'flex-end'}} gap={2}>
              <Button
                color={'warning'}
                variant={'contained'}
                size={'small'}
                onClick={() => navigate('/laundries')}
                >
                Retour à la liste
              </Button>
              <Button
                color={'success'}
                variant={'contained'}
                size={'small'}
                onClick={form.handleSubmit(handleSubmit)}
                startIcon={<SaveIcon />}
              >
                {loading ? 'En cours ...' : 'Valider'}
              </Button>
            </Box>
          </Stack>
        </FormProvider>
      </Card>
    </>
  )
}

const Proxy = () => {
  const {id} = useParams()
  const {data, error, isLoading} = useQuery({
    queryKey: ['laundry', id],
    queryFn: () => getLaundry(id),
    enabled: !!id
  })
  if (id && isLoading) {
    return <Header><Typography variant={'h6'}>Chargement ...</Typography></Header>
  } else if (error) {
    return <Header><Typography variant={'caption'} color={'error'}>{error.message}</Typography></Header>
  } else {
    return <FormLaundry laundry={id ? data : DEFAULT_LAUNDRY} />
  }
}

export default Proxy
