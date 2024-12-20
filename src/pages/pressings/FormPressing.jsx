import { useState } from 'react'
import {
  Box,
  FormControl,
  Stack,
  Button,
  Tab,
  Tabs,
  IconButton,
  Typography, MenuItem
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

import { getPressing } from "../../api/pressing";
import useSave, { buildSchema, DEFAULT_PRESSING } from './use-save'
import { TextField } from '../../components/Form'
import ImagePicker from '../../components/ImagePicker'


const Materials = () => {
  const {control, formState} = useFormContext()
  const { fields, append, remove, swap, move, insert } = useFieldArray({
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
const FormPressing = ({pressing}) => {
  const [tab, setTab] = useState(0)
  const {error, loading, save} = useSave()
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: pressing,
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(buildSchema()),
  })
  const handleSubmit = async (values) => {
    await save(values)
    navigate('/pressings')
  }
  return (
    <>
      {
        !!error && <Typography variant={'caption'} color={'error'}>{error.message}</Typography>
      }
      <FormProvider {...form}>
        <Stack gap={2} flex={1} mt={2}>
          <Tabs value={tab} onChange={(e,index) => setTab(index)}>
            <Tab icon={<InfoIcon fontSize={'small'}/>} label="Général"/>
            <Tab icon={<AutoFixHighIcon fontSize={'small'}/>} label="Matériel" />
            <Tab icon={<AddAPhotoIcon fontSize={'small'}/>} label="Photo" />
          </Tabs>
          <Stack mt={2} gap={2}>
            {
              tab === 0 && (
                <>
                  <Stack gap={2} direction={'row'}>
                    <TextField label="Nom" name={'name'} />
                    <TextField name="status" label={"Statut"} select>
                      <MenuItem value={'available'} sx={{ fontSize: '12px' }}>
                        Disponible
                      </MenuItem>
                      <MenuItem value={'reserved'} sx={{ fontSize: '12px' }}>
                        Réservée
                      </MenuItem>
                      <MenuItem value={'sold'} sx={{ fontSize: '12px' }}>
                        Vendu
                      </MenuItem>
                    </TextField>
                  </Stack>
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
          </Stack>
          <Box sx={{display: 'flex', justifyContent: 'flex-end'}} gap={2}>
            <Button
              color={'warning'}
              variant={'contained'}
              size={'small'}
              onClick={() => navigate('/pressings')}
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
    </>
  )
}

const Proxy = () => {
  const {id} = useParams()
  const {data, error, isLoading} = useQuery({
    queryKey: ['pressing', id ? parseInt(id) : null],
    queryFn: () => getPressing(id),
    enabled: !!id
  })
  if (id && isLoading) {
    return <Typography variant={'caption'}>Chargement ...</Typography>
  } else if (error) {
    return <Typography variant={'caption'} color={'error'}>{error.message}</Typography>
  } else {
    return <FormPressing pressing={id ? data : DEFAULT_PRESSING} />
  }
}

export default Proxy
