import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// material
import { Box, Button, Drawer, FormControl, TextField, Typography, MenuItem, IconButton } from '@mui/material';
import { DatePicker } from '@mui/lab';
import { Close } from '@mui/icons-material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// ----------------------------------------------------------------------

AssociateForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  modeAssociate: PropTypes.bool,
  parentCallbackAssociate: PropTypes.any,
  parentCallbackManager: PropTypes.any,
  associate: PropTypes.object,
  manager: PropTypes.object,
  update: PropTypes.bool,
  updateRegister: PropTypes.func,
  areas: PropTypes.array,
  subareas: PropTypes.array,
  onChangeArea: PropTypes.func
};

const TYPE = [
  { value: '', label: 'SELECCIONE' },
  { value: 'manager', label: 'Administrador' },
  { value: 'associate', label: 'Colaborador' }
  // { value: 'associate-manager', label: 'Colaborador y Administrador' }
];

export default function AssociateForm({
  open,
  modeAssociate,
  close,
  parentCallbackAssociate,
  parentCallbackManager,
  associate,
  manager,
  update,
  updateRegister,
  areas,
  subareas,
  onChangeArea
}) {
  const [isManager, setIsManager] = useState(false);
  const validationSchema = yup.object({
    name: yup.string('Nombre').required('El nombre es requerido'),
    lastnames: yup
      .string('Apellidos')
      .when([`${isManager}`], { is: (value) => value === false, then: (s) => s.required('El apellido es requerido') }),
    email: yup
      .string('Correo')
      .when([`${isManager}`], { is: (value) => value === false, then: (s) => s.required('El correo es requerido') }),
    employee: yup.string('No. Empleado').when([`${isManager}`], {
      is: (value) => value === false,
      then: (s) => s.required('El numero de empleado es requerido')
    }),
    entry: yup.string('Fecha de ingreso').when([`${isManager}`], {
      is: (value) => value === false,
      then: (s) => s.required('La fecha de ingreso es requerida')
    }),
    subarea: yup
      .number('Subarea')
      .when([`${isManager}`], { is: (value) => value === false, then: (s) => s.required('Rol es requerido') }),
    type: yup.string('Tipo').required('Tipo de colaborador es requerido'),
    area: yup
      .number('Area')
      .when([`${isManager}`], { is: (value) => value === false, then: (s) => s.required('Area es requerida') }),
    birthday: yup.string('Cumpleaños').when([`${isManager}`], {
      is: (value) => value === false,
      then: (s) => s.required('El cumpleaños es requerido')
    }),
    vacations: yup.number('Vacaciones').when([`${isManager}`], {
      is: (value) => value === false,
      then: (s) => s.required('El numero dias es requerido')
    })
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      lastnames: '',
      email: '',
      employee: '',
      entry: moment().format('YYYY-MM-DD'),
      subarea: '',
      type: '',
      vacations: 0,
      area: '',
      subareas: '',
      birthday: moment().format('YYYY-MM-DD')
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!update) {
        if (isManager) {
          parentCallbackManager(values);
        } else {
          parentCallbackAssociate(values);
        }
      } else {
        updateRegister(modeAssociate ? associate.id : manager.id, values);
      }
      setIsManager(false);
      resetForm(formik.initialValues);
    }
  });

  useEffect(() => {
    if (modeAssociate) {
      setIsManager(false);
      formik.setFieldValue('name', update ? associate.name : formik.initialValues.name);
      formik.setFieldValue('lastnames', update ? associate.lastnames : formik.initialValues.lastnames);
      formik.setFieldValue('email', update ? associate.user?.email : formik.initialValues.email);
      formik.setFieldValue('employee', update ? associate.employee_number : formik.initialValues.employee);
      formik.setFieldValue('entry', update ? moment(associate.entry_date).toDate() : formik.initialValues.entry);
      formik.setFieldValue('area', update ? Number(associate.area_id) : formik.initialValues.area);
      formik.setFieldValue('subarea', update ? Number(associate.subarea_id) : formik.initialValues.subarea);
      formik.setFieldValue('birthday', update ? moment(associate.birthday).toDate() : formik.initialValues.birthday);
      formik.setFieldValue('vacations', update ? associate.vacations_available : formik.initialValues.vacations);
      formik.setFieldValue('type', update ? associate.user?.permissions[0].name : formik.initialValues.type);
    } else {
      if (update && !modeAssociate) {
        setIsManager(true);
      }
      formik.setFieldValue(
        'type',
        update && manager.permissions ? manager.permissions[0].name : formik.initialValues.type
      );
      formik.setFieldValue('name', update ? manager.name : formik.initialValues.name);
      formik.setFieldValue('email', update ? manager.email : formik.initialValues.email);
      formik.setFieldValue('lastnames', formik.initialValues.lastnames);
      formik.setFieldValue('employee', formik.initialValues.employee);
      formik.setFieldValue('entry', formik.initialValues.entry);
      formik.setFieldValue('area', formik.initialValues.area);
      formik.setFieldValue('subarea', formik.initialValues.subarea);
      formik.setFieldValue('birthday', formik.initialValues.birthday);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, modeAssociate, associate, manager]);

  return (
    <Drawer anchor="right" open={open} onClose={close}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
        <Box sx={{ width: { xs: '100%', md: '500px', xl: '600px' } }}>
          <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="h4" style={{ marginTop: '10px', marginBottom: '30px' }}>
                {update ? 'Actualizar' : 'Nuevo'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{
                  borderRadius: 30,
                  height: '30px',
                  marginTop: '10px',
                  marginLeft: '10px',
                  marginBottom: '30px'
                }}
                size="small"
              >
                {update ? 'Actualizar' : 'Guardar'}
              </Button>
              <IconButton
                aria-label="close"
                onClick={close}
                sx={{
                  color: (theme) => theme.palette.grey[500]
                }}
                style={{ marginTop: '10px', marginBottom: '30px' }}
              >
                <Close />
              </IconButton>
            </Box>
            <FormControl style={{ width: '100%' }}>
              <TextField
                id="type"
                name="type"
                label="Tipo de colaborador"
                onChange={(e, value) => {
                  formik.setFieldValue('type', value.props.value);
                  if (value.props.value === 'manager') {
                    setIsManager(true);
                  } else {
                    setIsManager(false);
                  }
                }}
                value={formik.values.type || ''}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
                select
                fullWidth
                size="small"
              >
                {TYPE.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <FormControl style={{ marginTop: '8px', width: '100%' }}>
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
            <FormControl style={{ marginTop: '8px', width: '100%' }}>
              <TextField
                id="lastnames"
                name="lastnames"
                label="Apellidos"
                style={{ display: isManager ? 'none' : 'flex' }}
                disabled={isManager}
                value={formik.values.lastnames || ''}
                onChange={formik.handleChange}
                error={formik.touched.lastnames && Boolean(formik.errors.lastnames)}
                fullWidth
                helperText={formik.touched.lastnames && formik.errors.lastnames}
                size="small"
              />
            </FormControl>
            <FormControl style={{ marginTop: '8px', width: '100%' }}>
              <TextField
                id="email"
                name="email"
                label="Correo"
                value={formik.values.email || ''}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                size="small"
              />
            </FormControl>
            <FormControl style={{ marginTop: '8px', width: '100%' }}>
              <TextField
                id="employee"
                name="employee"
                disabled={isManager}
                style={{ display: isManager ? 'none' : 'flex' }}
                label="No. de empleado"
                value={formik.values.employee || ''}
                onChange={formik.handleChange}
                error={formik.touched.employee && Boolean(formik.errors.employee)}
                fullWidth
                helperText={formik.touched.employee && formik.errors.employee}
                size="small"
              />
            </FormControl>
            <FormControl style={{ marginTop: '8px', width: '100%' }}>
              <DatePicker
                label="Fecha de ingreso"
                disabled={isManager}
                style={{ display: isManager ? 'none' : 'flex' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    style={{ display: isManager ? 'none' : 'flex' }}
                    helperText={formik.touched.entry && formik.errors.entry}
                    error={formik.touched.entry && Boolean(formik.errors.entry)}
                  />
                )}
                id="entry"
                name="entry"
                value={formik.values.entry}
                onChange={(value) => formik.setFieldValue('entry', value)}
              />
            </FormControl>
            <FormControl style={{ marginTop: '8px', width: '100%' }}>
              <DatePicker
                label="Cumpleaños"
                disabled={isManager}
                style={{ display: isManager ? 'none' : 'flex' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    style={{ display: isManager ? 'none' : 'flex' }}
                    helperText={formik.touched.birthday && formik.errors.birthday}
                    error={formik.touched.birthday && Boolean(formik.errors.birthday)}
                  />
                )}
                id="birthday"
                name="birthday"
                value={formik.values.birthday}
                onChange={(value) => formik.setFieldValue('birthday', value)}
              />
            </FormControl>
            <FormControl style={{ width: '100%', marginTop: '8px' }}>
              <TextField
                id="area"
                name="area"
                label="Area"
                onChange={(e, value) => {
                  formik.setFieldValue('area', value.props.value);
                  onChangeArea(value.props.value);
                }}
                style={{ display: isManager ? 'none' : 'flex' }}
                disabled={isManager}
                defaultValue=""
                value={formik.values.area || ''}
                select
                error={formik.touched.area && Boolean(formik.errors.area)}
                fullWidth
                helperText={formik.touched.area && formik.errors.area}
                size="small"
              >
                {areas.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <FormControl style={{ width: '100%', marginTop: '8px' }}>
              <TextField
                id="subarea"
                name="subarea"
                label="Rol"
                onChange={(e, value) => {
                  formik.setFieldValue('subarea', value.props.value);
                }}
                style={{ display: isManager ? 'none' : 'flex' }}
                disabled={isManager}
                defaultValue=""
                value={formik.values.subarea || ''}
                select
                error={formik.touched.subarea && Boolean(formik.errors.subarea)}
                fullWidth
                helperText={formik.touched.subarea && formik.errors.subarea}
                size="small"
              >
                <MenuItem key={'id-subarea'} value="">
                  SELECCIONE
                </MenuItem>
                {subareas.map((option) => (
                  <MenuItem key={option.id} value={`${option.id}`}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <FormControl style={{ marginTop: '8px', width: '100%' }}>
              <TextField
                id="vacations"
                name="vacations"
                label="Dias de vacaciones disponibles"
                style={{ display: isManager ? 'none' : 'flex' }}
                value={formik.values.vacations || 0}
                onChange={formik.handleChange}
                error={formik.touched.vacations && Boolean(formik.errors.vacations)}
                fullWidth
                helperText={formik.touched.vacations && formik.errors.vacations}
                size="small"
              />
            </FormControl>
          </form>
        </Box>
      </LocalizationProvider>
    </Drawer>
  );
}
