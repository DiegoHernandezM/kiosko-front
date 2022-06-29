import { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import SnackAlert from '../../components/general/SnackAlert';
// sections
import { ChangePasswordForm } from '../../sections/auth/verify-code';
// redux
import { useDispatch } from '../../redux/store';
import { updatePassword } from '../../redux/slices/user';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function ChangePassword() {
  const { token } = useParams();
  const dispatch = useDispatch();
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const change = (password) => {
    dispatch(changePassword(password));
  };

  function changePassword(password) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(updatePassword(password, token)));
      })
        .then(() => (window.location = PATH_AUTH.login))
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
        });
  }

  return (
    <Page title="Cambiar contraseña" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            <Button
              size="small"
              component={RouterLink}
              to={PATH_AUTH.login}
              startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} width={20} height={20} />}
              sx={{ mb: 3 }}
            >
              Regresar
            </Button>

            <Typography variant="h3" paragraph>
              Ingresa tu nueva contraseña
            </Typography>

            <Box sx={{ mt: 5, mb: 3 }}>
              <ChangePasswordForm onSent={change} />
            </Box>
          </Box>
          <SnackAlert message={message} type={typeMessage} open={openMessage} close={handleCloseMessage} />
        </Container>
      </RootStyle>
    </Page>
  );
}
