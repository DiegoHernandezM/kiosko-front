import { useCallback, forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
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
  Stack,
  Slider,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// Components
import * as yup from 'yup';
import { useFormik } from 'formik';
import UploadMultiFile from '../../upload/UploadMultiFile';

CreateObjective.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any
};

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const validationSchema = yup.object({
  name: yup.string('Nombre').required('El nombre es requerido'),
  description: yup.string('Descripcion').required('La descripcion es requerida'),
  quarter: yup.string('Trimestre').required('El trimestre es requerido'),
  weighing: yup.string('Ponderacion'),
  progress: yup.string('Avance')
});

const QUARTERS = [
  { value: 1, label: 'ENERO - MARZO' },
  { value: 2, label: 'ABRIL - JUNIO' },
  { value: 3, label: 'JULIO - SEPTIEMBRE' },
  { value: 4, label: 'OCTUBRE - DICIEMBRE' }
];

const marks = [
  {
    value: 0,
    label: '0'
  },
  {
    value: 100,
    label: '100'
  }
];

const marksProgress = [
  {
    value: 0,
    label: '0 %'
  },
  {
    value: 100,
    label: '100 %'
  }
];

export default function CreateObjective({ open, close, parentCallback }) {
  const [files, setFiles] = useState([]);
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      year: null,
      quarter: '',
      weighing: 0,
      progress: 0
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

  const valuetext = (value) => `${value}%`;

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
          <DialogTitle>{'NUEVO OBJETIVO'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <FormControl>
                      <DatePicker
                        id="year"
                        name="year"
                        views={['year']}
                        minDate={new Date()}
                        label="Año"
                        value={formik.values.year}
                        onChange={(value) => formik.setFieldValue('year', value)}
                        renderInput={(params) => <TextField size="small" {...params} helperText={null} />}
                      />
                    </FormControl>
                    <FormControl>
                      <TextField
                        id="quarter"
                        name="quarter"
                        label="Trimestre"
                        onChange={formik.handleChange}
                        value={formik.values.quarter}
                        select
                        fullWidth
                        size="small"
                        error={formik.touched.quarter && Boolean(formik.errors.quarter)}
                        helperText={formik.touched.quarter && formik.errors.quarter}
                      >
                        {QUARTERS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                    <FormControl>
                      <TextField
                        id="name"
                        name="name"
                        label="Nombre"
                        placeholder="Nombre"
                        fullWidth
                        value={formik.values.name || ''}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
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
                      <Typography variant="body">Ponderacion</Typography>
                      <Slider
                        id="weighing"
                        name="weighing"
                        aria-label="Ponderacion"
                        getAriaValueText={valuetext}
                        onChange={(value) => formik.setFieldValue('weighing', value.target.value)}
                        valueLabelDisplay="auto"
                        step={10}
                        marks={marks}
                        min={0}
                        max={100}
                      />
                    </FormControl>
                    <FormControl>
                      <Typography variant="body">Avance</Typography>
                      <Slider
                        id="progress"
                        name="progress"
                        aria-label="Avance"
                        getAriaValueText={valuetext}
                        onChange={(value) => formik.setFieldValue('progress', value.target.value)}
                        valueLabelDisplay="auto"
                        step={10}
                        marks={marksProgress}
                        min={0}
                        max={100}
                      />
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
