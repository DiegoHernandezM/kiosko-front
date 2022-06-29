import * as yup from 'yup';
import esLocale from 'date-fns/locale/es';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// material
import { styled } from '@mui/material/styles';
import { Toolbar, Button, TextField, FormControl, MenuItem } from '@mui/material';
// ----------------------------------------------------------------------

const filters = {
  '& > *': {
    margin: '100px',
    padding: '10px 20px',
    width: '100%'
  }
};

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const validationSchema = yup.object({
  init: yup.date().nullable(),
  end: yup.date().nullable(),
  area: yup.string('Area')
});

// ----------------------------------------------------------------------

Filters.propTypes = {
  parentCallback: PropTypes.any
};

const STATUS = [
  { value: 0, label: 'SELECCIONE' },
  { value: 1, label: 'A TIEMPO' },
  { value: 2, label: 'DESTIEMPO' }
];

export default function Filters({ parentCallback }) {
  const formik = useFormik({
    initialValues: {
      init: null,
      end: null,
      status: 0
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      parentCallback(values);
      resetForm(formik.initialValues);
    }
  });

  return (
    <RootStyle>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
        <form
          className={filters}
          style={{ textAlign: 'center' }}
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <FormControl style={{ margin: '10px', width: '180px' }}>
            <DatePicker
              label="Inicio"
              renderInput={(params) => <TextField size="small" {...params} />}
              id="init"
              name="init"
              value={formik.values.init}
              onChange={(value) => formik.setFieldValue('init', value)}
              helperText={formik.touched.init && formik.errors.init}
            />
          </FormControl>
          <FormControl style={{ margin: '10px', width: '180px' }}>
            <DatePicker
              label="Fin"
              renderInput={(params) => <TextField size="small" {...params} />}
              id="end"
              name="end"
              value={formik.values.end}
              onChange={(value) => formik.setFieldValue('end', value)}
              helperText={formik.touched.end && formik.errors.end}
            />
          </FormControl>
          <FormControl style={{ margin: '10px' }}>
            <TextField
              id="status"
              name="status"
              label="Estado de actividad"
              style={{ width: '200px' }}
              onChange={formik.handleChange}
              value={formik.values.status}
              select
              fullWidth
              size="small"
              helperText={formik.touched.status && formik.errors.status}
            >
              {STATUS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <br />
          <FormControl style={{ margin: '10px' }}>
            <Button variant="contained" type="submit" color="primary">
              Filtrar
            </Button>
          </FormControl>
        </form>
      </LocalizationProvider>
    </RootStyle>
  );
}
