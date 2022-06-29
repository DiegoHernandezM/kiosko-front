import { useEffect } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Button, Drawer, FormControl, IconButton, TextField, Typography } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Close } from '@mui/icons-material';
// ----------------------------------------------------------------------

ProjectForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any,
  project: PropTypes.object,
  update: PropTypes.bool,
  updateProject: PropTypes.func
};

const validationSchema = yup.object({
  name: yup.string('Nombre').required('El nombre es requerido'),
  number: yup.string('Numero').required('El numero es requerido'),
  description: yup.string('Descripcion').required('La descripcion es requerida')
});

export default function ProjectForm({ open, close, parentCallback, project, update, updateProject }) {
  const formik = useFormik({
    initialValues: {
      name: '',
      number: '',
      description: ''
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!update) {
        parentCallback(values);
      } else {
        updateProject(project.id, values.name, values.description, values.number);
      }
      resetForm(formik.initialValues);
    }
  });

  useEffect(() => {
    formik.setFieldValue('name', update ? project.name : formik.initialValues.name);
    formik.setFieldValue('description', update ? project.description : formik.initialValues.description);
    formik.setFieldValue('number', update ? project.project_number : formik.initialValues.number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, project]);

  return (
    <Drawer anchor="right" open={open} onClose={close}>
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
            <Typography variant="h4" style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '30px' }}>
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
              {update ? 'Actualizar Proyecto' : 'Guardar Proyecto'}
            </Button>
            <IconButton
              aria-label="close"
              onClick={close}
              sx={{
                color: (theme) => theme.palette.grey[500]
              }}
              style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '30px' }}
            >
              <Close />
            </IconButton>
          </Box>
          <FormControl style={{ marginLeft: '10px', width: '90%' }}>
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
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
            <TextField
              id="description"
              name="description"
              label="Descripcion"
              value={formik.values.description || ''}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              fullWidth
              helperText={formik.touched.description && formik.errors.description}
              size="small"
            />
          </FormControl>
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
            <TextField
              id="number"
              name="number"
              label="Numero de proyecto"
              value={formik.values.number || ''}
              onChange={formik.handleChange}
              error={formik.touched.number && Boolean(formik.errors.number)}
              fullWidth
              helperText={formik.touched.number && formik.errors.number}
              size="small"
            />
          </FormControl>
        </form>
      </Box>
    </Drawer>
  );
}
