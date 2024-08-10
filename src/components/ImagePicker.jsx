import {
  Box,
  Stack,
  Typography,
  FormHelperText,
  IconButton,
  Grid,
  useTheme
} from '@mui/material';
import {useFieldArray, useFormContext} from 'react-hook-form'
import { useDropzone } from 'react-dropzone'
import DeleteIcon from '@mui/icons-material/Delete';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const Picture = ({dataURL, onDelete}) => {
  const theme = useTheme()
  return (
    <Box sx={{position: "relative", width: 200, height: 200}}>
      <img src={dataURL} width={200} height={200} />
      <IconButton
        onClick={onDelete}
        color={"warning"}
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: 'white',
          border: `1px solid ${theme.palette.warning.main}`
        }}
      >
        <DeleteIcon fontSize={'small'} />
      </IconButton>
    </Box>
  )
}
const DropZone = ({onDrop}) => {
  const {
    getRootProps,
    getInputProps,
    isDragReject,
    fileRejections
  } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
    },
    minSize: 0
  })

  return (
    <Box
      {...getRootProps()}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        width: '100%',
        height: '100%',
        border: 'dotted 2px #DDD',
        borderRadius: '8px',
      }}
    >
      <input {...getInputProps()} />
      <Stack
        gap={1}
        alignItems="center"
        justifyContent="center"
        color="#DADDE3" //TODO: Use theme ?
      >

          <AddAPhotoIcon color={'success'} />

        <Typography>
          Drop image or click
        </Typography>
        <Stack alignItems="center">
          {isDragReject && (
            <FormHelperText error>
              Une erreur est survenue
            </FormHelperText>
          )}
          {fileRejections.map(({ errors }) =>
            errors.map((e) => <FormHelperText key={e.message} error>{`Erreur lors de l'import: ${e.code}`}</FormHelperText>),
          )}
        </Stack>
      </Stack>
    </Box>
  )
}


const ImagePicker = () => {
  const { fields, append, update } = useFieldArray({
    name: "pictures", // unique name for your Field Array
  });
  const handleDrop = async (files) => {
    await Promise.all(
      files.map(async (file) => {
        const dataUrl = await new Promise(resolve => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            return resolve(reader.result?.toString())
          }
        })
        append({data_url: dataUrl, file})
      })
    )
  }
  return (
    <Stack gap={2}>
      <DropZone onDrop={handleDrop} />
      <Grid container spacing={2}>
        {
          fields.filter(({_deleted}) => !_deleted).map((field, i) => (
            <Grid item xs={6}  key={field.data_url}>
              <Picture
                dataURL={field.data_url}
                onDelete={async () => {
                  const index = fields.findIndex(({uuid}) => uuid === field.uuid)
                  update(index, {...field, _deleted: true})
                }}
              />
            </Grid>
          ))
        }
      </Grid>
    </Stack>
  )
}

export default ImagePicker
