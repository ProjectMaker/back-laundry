import { useMemo, useRef, useEffect } from 'react'
import {Modal, Typography, Stack, Grid, Button, Box, FormControl, IconButton} from '@mui/material'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {FormProvider, useFieldArray, useForm, useFormContext} from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import SaveIcon from "@mui/icons-material/Save.js";
import DeleteIcon from "@mui/icons-material/Delete.js";
import AddBoxIcon from "@mui/icons-material/AddBox.js";
import {APIProvider } from '@vis.gl/react-google-maps';

import { useLaundry, useSaveLaundry, } from '../../api/washmap'
import { useCurrentCoordinate } from '../../api/store'
import {FormGroup, Switch, FormLabel, TextField} from "../../components/Form";

import Autocomplete from "../../components/Autocomplete.jsx";
import { buildPublicLaundrySchema } from "../../api/schema.js";

const Machines = () => {
  const {control, formState} = useFormContext()
  const { fields, append, remove, swap, move, insert } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "machines", // unique name for your Field Array
  });
  return (
    <Stack gap={2} flex={1}>
      {
        fields.map((field, i) => (
          <Stack direction={'row'} key={'field.name'} flex={1} alignItems={'center'}>
            <FormControl sx={{flexGrow: 1}}>
              <TextField
                name={`machines.${i}.weight`}
                label={'Poids'}
                error={!!(formState.errors['machines'] && formState.errors['machines'][i]?.['weight'])}
                helperText={formState.errors['machines'] && formState.errors['machines'][i] ? formState.errors['machines'][i]['weight'].message : null}
              />
            </FormControl>
            <IconButton onClick={() => remove(`machines.${i}.weight`)} color={'warning'}>
              <DeleteIcon />
            </IconButton>

          </Stack>
        ))
      }
      <Button
        variant="contained"
        size={'small'}
        color={'success'}
        onClick={() => append({weight: 0})}
        startIcon={<AddBoxIcon />}
      >
        Ajouter une machine
      </Button>
    </Stack>
  )
}

const PlaceField = ({defaultValue}) => {
  const autocompleteRef = useRef(null)
  const {formState, setValue} = useFormContext()
  const [, setCurrentCoordinate] = useCurrentCoordinate()
  return (
    <Stack gap={1}>
      <FormGroup label={'Adresse'}>
        <Autocomplete
          ref={autocompleteRef}
          defaultValue={defaultValue}
          onClear={() => {
            setValue('coordinate', null)
            setValue('address', null)
          }}
          onClick={({latitude, longitude, address}) => {
            setValue('coordinate', {latitude, longitude})
            setValue('address', address)
            setCurrentCoordinate({address, latitude, longitude})
          }}
        />
      </FormGroup>
      {
        (formState.errors.address || formState.errors.coordinate) &&
        <Typography variant={'caption'} color={'error'}>L'adresse est requise</Typography>
      }
    </Stack>
  )
}
const Form = ({defaultValues, coordinate}) => {

  const navigate = useNavigate()
  const {loading, error, save} = useSaveLaundry(coordinate)
  const formMethods = useForm({
    defaultValues,
    resolver: yupResolver(buildPublicLaundrySchema())
  })

  const handleSubmit = async ({id, address, coordinate, machines, criteria}) => {
    const newLaundry = await save({
      id,
      address,
      coordinate,
      machines: machines.map(({weight}) => weight),
      criteria
    })
    navigate(-1)
  }
  return (
    <FormProvider {...formMethods}>
      <Stack gap={1} flex={1} mt={2}>
        <input type={'hidden'} {...formMethods.register('id')} />
        <input type={'hidden'} {...formMethods.register('coordinate')} />
        <input type={'hidden'} {...formMethods.register('address')} />
        {
          !!error && <Typography variant={'caption'} color={'error'}>{error.message}</Typography>
        }
        <Machines />
        <PlaceField defaultValue={defaultValues}/>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={6}>
            <FormGroup label={'Distributeurs'}>
              <Switch label={'Lessive'} name={'criteria.dispenser_laundry'} />
              <Switch label={'Assouplissant'} name={'criteria.dispenser_softener'} />
              <Switch label={'Produits d\'hygiène'} name={'criteria.dispenser_hygiene_product'}/>
              <Switch label={'Snack'} name={'criteria.dispenser_snack'} />
              <Switch label={'Boissons'} name={'criteria.dispenser_drink'} />
            </FormGroup>
          </Grid>
          <Grid item xs={6}>
            <FormGroup label={'Lockers'}>
              <Switch label={'Amazon'} name={'criteria.locker_amazon'}/>
              <Switch label={'Mondial Relais'} name={'criteria.locker_mondial_relais'} />
              <Switch label={'AliExpress'} name={'criteria.locker_ali_express'}/>
              <Switch label={'Vinted'} name={'criteria.locker_vinted'}/>
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <FormLabel variant={'subtitle2'}>Services à proximité</FormLabel>
          </Grid>
          <Grid item xs={6}>
            <Stack gap={1}>
              <Switch label={'Boissons'} name={'criteria.service_drink'}/>
              <Switch label={'Restauration'} name={'criteria.service_food'}/>
              <Switch label={'Commerces'} name={'criteria.service_business'} />
              <Switch label={'Parc'} name={'criteria.service_park'} />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack gap={1}>
              <Switch label={'Attraction'} name={'criteria.service_attraction'} />
              <Switch label={'Wifi'} name={'criteria.service_wifi'}/>
              <Switch label={'USB'} name={'criteria.service_usb'}/>
            </Stack>
          </Grid>
        </Grid>
        <Box sx={{display: 'flex', justifyContent: 'flex-end'}} gap={2}>
          <Button
            color={'warning'}
            variant={'contained'}
            size={'small'}
            onClick={() => navigate('/washmap')}
          >
            Retour à la liste
          </Button>
          <Button
            color={'success'}
            variant={'contained'}
            size={'small'}
            onClick={formMethods.handleSubmit(handleSubmit)}
            startIcon={<SaveIcon />}
          >
            {loading ? 'En cours ...' : 'Valider'}
          </Button>
        </Box>
      </Stack>
    </FormProvider>
  )
}
const Detail = ({}) => {
  const {id} = useParams()
  const navigate = useNavigate()
  const {state} = useLocation()
  const [currentCoordinate] = useCurrentCoordinate()
  const {data, isLoading} = useLaundry({id})
  const loading = useMemo(() => id !== 'new' && (isLoading || !data), [id, data, isLoading])

  return (loading && !!id)
    ? <Typography variant={'caption'}>Chargement ...</Typography>
    : (
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <Stack flex={1}>
          <Form
            coordinate={currentCoordinate}
            defaultValues={
              !id ? {
                machines: [],
                coordinate: {
                  latitude: currentCoordinate.latitude,
                  longitude: currentCoordinate.longitude
                },
                address: currentCoordinate.address
              } : data
            } />
        </Stack>
      </APIProvider>
    )

}

export default Detail
