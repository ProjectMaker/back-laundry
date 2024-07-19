import {useState, forwardRef, useImperativeHandle} from "react";
import {useDebounce} from "use-debounce";
import {useQuery} from "@tanstack/react-query";
import {searchLocations} from "../api/index.js";
import {FormProvider, useForm} from "react-hook-form";
import {TextField} from "./Form";
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps'
import {Stack, Typography, List, ListItem, InputAdornment, IconButton, Button} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

const Autocomplete =  forwardRef(({
  onClick = () => {},
  onClear = () => {},
  defaultValue
}, ref) => {
  const placesLib = useMapsLibrary('places')
  const map = useMap()
  const [selectedItem, setSelectedItem] = useState(defaultValue)
  const [_verbatim, setVerbatim] = useState('')
  const [verbatim] = useDebounce(_verbatim, 500)
  const {isLoading, error, data} = useQuery({
    queryKey: ['locations', verbatim],
    queryFn: () => searchLocations(map, placesLib, verbatim),
    enabled: verbatim.length >= 3
  })
  const form = useForm({
    defaultValues: {
      verbatim: ''
    }
  })
  useImperativeHandle(ref, () => ({
    forceValue: (item) => {
      setSelectedItem(item)
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
              startAdornment: selectedItem ? (
                <InputAdornment position={'start'}>
                  <Button
                    size={'small'}
                    startIcon={<ClearIcon onClick={() => {
                      form.setValue('verbatim', '')
                      setSelectedItem(null)
                      onClear()
                    }} />}
                    color={'success'}
                    variant={'contained'}
                    >
                    {selectedItem.address}
                  </Button>
                </InputAdornment>
              ) : null,
              endAdornment: (
                <InputAdornment position={'end'}>
                  <IconButton
                    size={'small'}
                    onClick={() => {
                      form.setValue('verbatim', '')
                      setSelectedItem(null)
                      onClear()
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
              verbatim.length >= 3 && data?.map(item => (
                <ListItem
                  className={'clickable'}
                  onClick={() => {
                    onClick(item)
                    form.setValue('verbatim', '')
                    setVerbatim('')
                    setSelectedItem(item)
                  }}
                  fontSize={14}
                  key={item.id}
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
