import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, Container } from '@mui/material';
// components
import Page from '../components/Page';
// assets
import { ComingSoonIllustration } from '../assets';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <Page title="403 Acceso no autorizado" sx={{ height: 1 }}>
      <RootStyle title="403 Acceso no autorizado | KIOSKO">
        <Container>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <Typography variant="h3" paragraph>
              403 Acceso No Autorizado
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>No tienes acceso a este contenido.</Typography>

            <ComingSoonIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              Regresar
            </Button>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
