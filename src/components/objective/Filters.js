import * as yup from 'yup';
import moment from 'moment';
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
  init: yup.date().nullable()
});

// ----------------------------------------------------------------------

Filters.propTypes = {
  parentCallback: PropTypes.any
};

const QUARTERS = [
  { value: 1, label: 'ENERO - MARZO' },
  { value: 2, label: 'ABRIL - JUNIO' },
  { value: 3, label: 'JULIO - SEPTIEMBRE' },
  { value: 4, label: 'OCTUBRE - DICIEMBRE' }
];

export default function Filters({ parentCallback }) {
  const currentYear = new Date();
  const formik = useFormik({
    initialValues: {
      year: new Date(),
      quarter: moment().quarter()
    },
    validationSchema,
    onSubmit: (values) => {
      parentCallback(values);
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
              views={['year']}
              minDate={currentYear.setFullYear(currentYear.getFullYear() - 1)}
              label="Año"
              value={formik.values.year}
              onChange={(value) => formik.setFieldValue('year', value)}
              renderInput={(params) => <TextField size="small" {...params} helperText={null} />}
            />
          </FormControl>
          <FormControl style={{ margin: '10px' }}>
            <TextField
              id="quarter"
              name="quarter"
              label="Trimestre"
              style={{ width: '200px' }}
              onChange={formik.handleChange}
              value={formik.values.quarter}
              select
              fullWidth
              size="small"
              helperText={formik.touched.quarter && formik.errors.quarter}
            >
              {QUARTERS.map((option) => (
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
