import {useState, forwardRef, useImperativeHandle} from "react";
import {useDebounce} from "use-debounce";
import {useQuery} from "@tanstack/react-query";
import {searchLocations} from "../api/index.js";
import {FormProvider, useForm} from "react-hook-form";
import {TextField} from "./HeaderCard";
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps'
import {Stack, Typography, List, ListItem, InputAdornment, IconButton} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

const Items = [{
  address: '38 rue de la colombe'
}, {
  address: '121 rue Jean Moulin'
}]

const Autocomplete =  forwardRef(({onClick}, ref) => {
  const placesLib = useMapsLibrary('places')
  const [forced, setForced] = useState(false)
  const map = useMap()
  const [selectedItem, setSelectedItem] = useState(null)
  const [verbatimValue, setVerbatim] = useState('')
  const [verbatim] = useDebounce(verbatimValue, 500)
  const {isLoading, error, data} = useQuery({
    queryKey: ['locations', verbatim],
    queryFn: () => searchLocations(map, placesLib, verbatim),
    enabled: verbatim.length >= 3 && !forced
  })
  const form = useForm({
    defaultValues: {
      verbatim: ''
    }
  })
  useImperativeHandle(ref, () => ({
    forceItem: (item) => {
      setForced(true)
      setSelectedItem(item)
      form.setValue('verbatim', item.address)
    }
  }))
  return (
    <FormProvider {...form}>
      <Stack flex={1} sx={{position: 'relative'}}>
        {
          Boolean(error) && <Typography variant={'caption'} color={'error'}>{error.message}</Typography>
        }
        <Stack flex={1}>
          <TextField
            name={'verbatim'}
            onChange={e => {
              setVerbatim(e.target.value)
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position={'end'}>
                  <IconButton
                    size={'small'}
                    onClick={() => {
                      form.setValue('verbatim', '')
                      setSelectedItem(null)
                      setForced(false)
                    }}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

        </Stack>
        <Stack
          flex={1}
          sx={{position: 'absolute', top: 40, width: '100%', zIndex: 1}}
        >
          <List>
            {
              isLoading && (
                <ListItem><Typography fontSize={14} variant={'caption'}>Recherche en cours</Typography></ListItem>
              )
            }
            {
              !selectedItem && verbatim.length >= 3 && data?.map(item => (
                <ListItem
                  onClick={() => {
                    onClick(item)
                    form.setValue('verbatim', item.address)
                    setSelectedItem(item)
                    setForced(false)
                  }}
                  fontSize={14}
                  key={item.address}
                >
                  <Typography fontSize={14} variant={'caption'}>{item.address}</Typography>
                </ListItem>
              ))
            }
          </List>
        </Stack>
      </Stack>
    </FormProvider>
  )
})

export default Autocomplete
