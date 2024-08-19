import { useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import {
  MenuItem,
  Stack,
  Tabs,
  Tab, Button, Box, Typography
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import SaveIcon from '@mui/icons-material/Save'
import {useQuery} from "@tanstack/react-query";

import { buildMaterialSchema } from '../../api/schema'
import { TextField, DatePicker, Checkbox } from '../../components/Form'

import useSave, { DEFAULT_MATERIAL } from './use-save'
import ImagePicker from '../../components/ImagePicker'

import {getMaterial, calculatePrices} from "../../api/index";


const FormMaterial = ({material: {availability_date, ...material}}) => {
  console.log(material)
  const [tab, setTab] = useState(0)
  const navigate = useNavigate()
  const {error, loading, save} = useSave()
  console.log('default sold', material.sold)
  const form = useForm({
    defaultValues: {availability_date: dayjs(availability_date), ...material},
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: yupResolver(buildMaterialSchema()),
  })

  const handleCalculate = () => {
    const {price, quantity} = form.getValues()
    const {total_price, com, sales_price} = calculatePrices({price, quantity})
    form.setValue('total_price', total_price)
    form.setValue('com', com)
    form.setValue('sales_price', sales_price)
  }

  const handleSubmit = async (values) => {
    await save(values)
    navigate('/materials')
  }

  return (
    <FormProvider {...form}>
      {
        !!error && <Typography variant={'caption'} color={'error'}>{error.message}</Typography>
      }
      <Stack gap={2} flex={1} mt={2}>
        <Tabs value={tab} onChange={(e,index) => setTab(index)}>
          <Tab icon={<InfoIcon fontSize={'small'}/>} label="Général"/>
          <Tab icon={<AddAPhotoIcon fontSize={'small'}/>} label="Photo" />
        </Tabs>
        <Stack mt={2} gap={2}>
          {
            tab === 0 && (
              <>
                <Stack gap={2} direction={'row'}>
                  <TextField name="name" label="Nom" />
                  <TextField name="status" label={"Statut"} select>
                    <MenuItem value={'available'} sx={{ fontSize: '12px' }}>
                      Disponible
                    </MenuItem>
                    <MenuItem value={'reserved'} sx={{ fontSize: '12px' }}>
                      Réservé
                    </MenuItem>
                    <MenuItem value={'sold'} sx={{ fontSize: '12px' }}>
                      Vendu
                    </MenuItem>
                  </TextField>
                </Stack>
                <Stack gap={2} direction={'row'}>
                  <TextField name="brand" label="Marque" />
                  <TextField name="model" label="Model" />
                </Stack>
                <Stack gap={2} direction={'row'}>
                  <TextField name="year" label="Année" />
                  <DatePicker label="Date de disponibilitée" name={'availability_date'} />
                </Stack>
                <Stack gap={2} direction={'row'}>
                  <TextField name="price" onChange={handleCalculate} label="Prix HT" />
                  <TextField name="quantity" onChange={handleCalculate} label="Quantitée" />
                </Stack>
                <Stack gap={2} direction={'row'}>
                  <TextField name="total_price" label="Prix total" disabled/>
                  <TextField name="com" label="Commission" disabled/>
                </Stack>

                <TextField name="sales_price" label="Prix de vente" disabled/>
                <TextField name="infos" label="Informations complémentaires" multiline/>
              </>
            )
          }
          {
            tab === 1 && <ImagePicker />
          }
        </Stack>
        <Box sx={{display: 'flex', justifyContent: 'flex-end'}} gap={2}>
          <Button
            color={'warning'}
            variant={'contained'}
            size={'small'}
            onClick={() => navigate('/materials')}
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
  )
}
const Proxy = () => {
  const {id} = useParams()
  const {data, error, isLoading} = useQuery({
    queryKey: ['material', id ? parseInt(id) : null],
    queryFn: () => getMaterial(id),
    enabled: !!id
  })
  if (id && isLoading) {
    return <Typography variant={'caption'}>Chargement ...</Typography>
  } else if (error) {
    return <Typography variant={'caption'} color={'error'}>{error.message}</Typography>
  } else {
    return <FormMaterial material={id ? data : DEFAULT_MATERIAL} />
  }
}

export default Proxy
