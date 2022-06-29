import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
import SnackAlert from '../../components/general/SnackAlert';
// sections
import { ResetPasswordForm } from '../../sections/auth/reset-password';
// assets
import { SentIcon } from '../../assets';
// redux
import { useDispatch } from '../../redux/store';
import { resetPassword } from '../../redux/slices/user';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');

  const reset = (userEmail) => {
    dispatch(resetEmailUser(userEmail));
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  function resetEmailUser(userEmail) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(resetPassword(userEmail)));
      })
        .then(() => {
          setSent(true);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
        });
  }

  return (
    <Page title="Resetear Contraseña" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            {!sent ? (
              <>
                <Typography variant="h3" paragraph>
                  ¿Olvidaste tu contraseña?
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 5 }}>
                  Ingrese la dirección de correo electrónico asociada con su cuenta y le enviaremos un enlace por correo
                  electrónico para restablecer su clave.
                </Typography>

                <ResetPasswordForm onSent={reset} onGetEmail={(value) => setEmail(value)} />

                <Button fullWidth size="large" component={RouterLink} to={PATH_AUTH.login} sx={{ mt: 1 }}>
                  Regresar
                </Button>
              </>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <SentIcon sx={{ mb: 5, mx: 'auto', height: 160 }} />

                <Typography variant="h3" gutterBottom>
                  Solicitud enviada con éxito
                </Typography>
                <Typography>
                  Hemos enviado un correo electrónico de confirmación a &nbsp;
                  <strong>{email}</strong>
                  <br />
                  Por favor revise su correo electrónico.
                </Typography>

                <Button size="large" variant="contained" component={RouterLink} to={PATH_AUTH.login} sx={{ mt: 5 }}>
                  Regresar
                </Button>
              </Box>
            )}
          </Box>
          <SnackAlert message={message} type={typeMessage} open={openMessage} close={handleCloseMessage} />
        </Container>
      </RootStyle>
    </Page>
  );
}
