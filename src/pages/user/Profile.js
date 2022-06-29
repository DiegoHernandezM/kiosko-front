import { useState, useEffect } from 'react';
// material
import { Box, Button, Container, FormControl, TextField, Typography } from '@mui/material';
import * as yup from 'yup';
import { useFormik } from 'formik';
// redux
// eslint-disable-next-line import/no-unresolved
import { useDispatch, useSelector } from '../../redux/store';
import { changePassword, showLogued, updateUser } from '../../redux/slices/user';
// components
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import ChangePassword from './ChangePassword';
import SnackAlert from '../../components/general/SnackAlert';

const validationSchema = yup.object({
  name: yup.string('Nombre').required('El nombre es requerido'),
  email: yup.string('Email').required('El email es requerido')
});

export default function Profile() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);

  const { showUser } = useSelector((state) => state.user);
  const formik = useFormik({
    initialValues: {
      email: '',
      name: ''
    },
    validationSchema,
    onSubmit: (values) => {
      handleUpdate(showUser.id, values.name, values.email, showUser.permissions);
    }
  });
  useEffect(() => {
    dispatch(showLogued());
    formik.setFieldValue('name', showUser.name);
    formik.setFieldValue('email', showUser.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, showUser.name, showUser.email]);

  const handleOpenForm = () => {
    setOpenDrawer(true);
  };

  const handleCloseForm = () => {
    setOpenDrawer(false);
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  function update(id, name, email, authority) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(updateUser(id, name, email, authority)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Perfil actualizado' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
        })
        .catch((error) => {
          console.log(error);
        });
  }
  const handleUpdate = (id, name, email, authority) => {
    dispatch(update(id, name, email, authority));
  };

  const handleChangePassword = (oldPassword, newPassword, newPasswordConfirmation) => {
    dispatch(resetPassword(oldPassword, newPassword, newPasswordConfirmation));
  };

  function resetPassword(oldPassword, newPassword, newPasswordConfirmation) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(changePassword(oldPassword, newPassword, newPasswordConfirmation)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Se cambio la contraseña' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          setOpenDrawer(false);
        })
        .catch((error) => {
          setMessage(error.message);
          setTypeMessage('error');
          setOpenMessage(true);
          setOpenDrawer(false);
        });
  }

  return (
    <Page title="Kiosko | Perfil">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Perfil"
          links={[{ name: '', href: PATH_DASHBOARD.root }]}
          action={
            <Button variant="contained" onClick={handleOpenForm}>
              Cambiar Contraseña
            </Button>
          }
        />
      </Container>
      <SnackAlert message={message} type={typeMessage} open={openMessage} close={handleCloseMessage} />
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box>
          <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <Box>
              <Typography variant="h4" style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '30px' }}>
                Actualiza tú información
              </Typography>
            </Box>
            <FormControl style={{ marginLeft: '10px', width: '90%' }}>
              <TextField
                id="email"
                name="email"
                label="Email"
                disabled
                value={formik.values.email || ''}
                onChange={formik.handleChange}
                fullWidth
              />
            </FormControl>
            <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
              <TextField
                id="name"
                name="name"
                label="Nombre"
                value={formik.values.name || ''}
                onChange={formik.handleChange}
                fullWidth
              />
            </FormControl>
            <Button variant="contained" color="primary" type="submit" style={{ marginLeft: '10px', marginTop: '20px' }}>
              Actualizar
            </Button>
          </form>
        </Box>
        <ChangePassword open={openDrawer} close={handleCloseForm} changePassword={handleChangePassword} />
      </Container>
    </Page>
  );
}
