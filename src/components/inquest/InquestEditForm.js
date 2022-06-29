import { useEffect } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Button, Drawer, FormControl, IconButton, TextField, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

import * as yup from 'yup';
import { useFormik } from 'formik';
// ----------------------------------------------------------------------

InquestEditForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  inquest: PropTypes.object,
  updateInquest: PropTypes.func
};

const validationSchema = yup.object({
  name: yup.string('Nombre').required('El nombre es requerido'),
  description: yup.string('Descripcion').required('La descripcion es requerida')
});

export default function InquestEditForm({ open, close, inquest, updateInquest }) {
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      content: []
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      updateInquest(inquest.id, values.name, values.description, values.content);
      resetForm(formik.initialValues);
    }
  });

  useEffect(() => {
    formik.setFieldValue('name', inquest.name);
    formik.setFieldValue('description', inquest.description);
    formik.setFieldValue('content', inquest.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inquest]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={close}
      style={{ width: '500px' }}
      sx={{ width: { xs: '200px', md: '500px', xl: '600px' } }}
    >
      <Box style={{ width: '500px' }}>
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
              Editar encuesta
            </Typography>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ borderRadius: 30, height: '30px', marginTop: '20px', marginRight: '10px' }}
              size="small"
            >
              Actualizar
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
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
            <TextField
              id="name"
              name="name"
              label="Nombre"
              onChange={formik.handleChange}
              value={formik.values.name || ''}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              fullWidth
              size="small"
              variant="outlined"
            />
          </FormControl>
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
            <TextField
              id="description"
              name="description"
              label="Descripcion"
              onChange={formik.handleChange}
              value={formik.values.description || ''}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              fullWidth
              size="small"
              variant="outlined"
            />
          </FormControl>
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
            {inquest.content !== undefined
              ? inquest.content.map((value, key) => (
                  <div key={`question-${key}`} style={{ marginTop: '8px' }}>
                    <TextField
                      id={`question-${value.id}`}
                      name={`question-${value.id}`}
                      disabled
                      label="Pregunta"
                      value={value.question || ''}
                      fullWidth
                      size="small"
                      variant="outlined"
                    />
                  </div>
                ))
              : []}
          </FormControl>
        </form>
      </Box>
    </Drawer>
  );
}
