import { useCallback, forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// Material
import {
  FormControl,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Grid,
  Card,
  Stack
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// Components
import * as yup from 'yup';
import { useFormik } from 'formik';
import UploadMultiFile from '../upload/UploadMultiFile';

CreateTask.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any
};

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const validationSchema = yup.object({
  name: yup.string('Nombre').required('El nombre es requerido'),
  description: yup.string('Descripcion').required('La descripcion es requerida'),
  hours: yup.number('hours').required('Elige el tiempo'),
  day: yup.string('Fecha').required('La fecha es requerida')
});

const HOURS = [
  { value: 1, label: '1 hr' },
  { value: 2, label: '2 hrs' },
  { value: 3, label: '3 hrs' },
  { value: 4, label: '4 hrs' },
  { value: 5, label: '5 hrs' },
  { value: 6, label: '6 hrs' },
  { value: 7, label: '7 hrs' },
  { value: 8, label: '8 hrs' }
];

export default function CreateTask({ open, close, parentCallback }) {
  const [files, setFiles] = useState([]);
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      hours: '',
      day: null
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      parentCallback(values, files);
      resetForm(formik.initialValues);
      setFiles([]);
    }
  });

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFiles]
  );

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleRemove = (file) => {
    const filteredItems = files.filter((_file) => _file !== file);
    setFiles(filteredItems);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={close}
      aria-describedby="alert-dialog-slide-description"
      fullWidth
      maxWidth={'lg'}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
        <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <DialogTitle>{'NUEVA ACTIVIDAD'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <FormControl>
                      <DatePicker
                        label="Fecha"
                        minDate={new Date(moment().startOf('week').add(1, 'days'))}
                        maxDate={new Date(moment().endOf('week').subtract(1, 'days'))}
                        renderInput={(params) => <TextField size="small" {...params} />}
                        id="day"
                        name="day"
                        value={formik.values.day}
                        onChange={(value) => formik.setFieldValue('day', value)}
                        helperText={formik.touched.day && formik.errors.day}
                      />
                    </FormControl>
                    <FormControl>
                      <TextField
                        id="name"
                        name="name"
                        label="Nombre"
                        value={formik.values.name || ''}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        fullWidth
                        helperText={formik.touched.name && formik.errors.name}
                        size="small"
                      />
                    </FormControl>
                    <FormControl>
                      <TextField
                        id="description"
                        name="description"
                        label="Descripcion"
                        placeholder="Descripcion"
                        fullWidth
                        value={formik.values.description || ''}
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        multiline
                      />
                    </FormControl>
                    <FormControl>
                      <TextField
                        id="hours"
                        name="hours"
                        label="Horas"
                        onChange={formik.handleChange}
                        value={formik.values.hours || ''}
                        select
                        error={formik.touched.hours && Boolean(formik.errors.hours)}
                        fullWidth
                        helperText={formik.touched.hours && formik.errors.hours}
                        size="small"
                      >
                        {HOURS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <UploadMultiFile
                      files={files}
                      onDrop={handleDropMultiFile}
                      onRemove={handleRemove}
                      onRemoveAll={handleRemoveAll}
                    />
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={close}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogActions>
        </form>
      </LocalizationProvider>
    </Dialog>
  );
}
