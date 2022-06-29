import { useEffect } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Button, Drawer, FormControl, IconButton, MenuItem, TextField, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import * as yup from 'yup';
import { useFormik } from 'formik';
// ----------------------------------------------------------------------

SubareaForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any,
  areas: PropTypes.array,
  subarea: PropTypes.object,
  update: PropTypes.bool,
  updateSubarea: PropTypes.func
};

const validationSchema = yup.object({
  name: yup.string('Nombre').required('El nombre es requerido'),
  areaId: yup.string('Area').required('El area es requerido')
});

export default function SubareaForm({ open, close, parentCallback, areas, subarea, update, updateSubarea }) {
  const formik = useFormik({
    initialValues: {
      name: '',
      areaId: ''
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!update) {
        parentCallback(values);
      } else {
        updateSubarea(subarea.id, values.name, values.areaId);
      }
      resetForm(formik.initialValues);
    }
  });

  useEffect(() => {
    formik.setFieldValue('name', update ? subarea.name : formik.initialValues.name);
    formik.setFieldValue('areaId', update ? subarea.area_id : formik.initialValues.areaId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, subarea]);

  return (
    <Drawer anchor="right" open={open} onClose={close}>
      <Box sx={{ width: { xs: '375px', md: '500px', lg: '500px', xl: '600px' } }}>
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
              {update ? 'Actualizar' : 'Nueva'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ borderRadius: 30, height: '30px', marginTop: '20px', marginRight: '10px' }}
              size="small"
            >
              {update ? 'Actualizar rol' : 'Guardar rol'}
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
          <FormControl style={{ marginLeft: '10px', width: '90%', marginTop: '8px' }}>
            <TextField
              id="areaId"
              name="areaId"
              label="Area"
              onChange={formik.handleChange}
              value={formik.values.areaId || ''}
              select
              error={formik.touched.areaId && Boolean(formik.errors.areaId)}
              fullWidth
              helperText={formik.touched.brand && formik.errors.brand}
              size="small"
            >
              {areas.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </form>
      </Box>
    </Drawer>
  );
}
