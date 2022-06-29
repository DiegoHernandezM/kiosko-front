// @mui
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Container, Typography } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import Image from '../../components/Image';
// sections
import { LoginForm } from '../../sections/auth/login';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { token } = useParams();
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Login">
      <RootStyle>
        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              {`Bienvenido`}
            </Typography>
            <Image style={{ width: '300px', marginLeft: '10%' }} alt="login" src="/logo/logo-ccp.png" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            {!smUp && (
              <Stack alignItems="center">
                <Image style={{ width: '130px' }} alt="login" src="/logo/logo-ccp.png" />
              </Stack>
            )}
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Iniciar sesion en Kiosko
                </Typography>
              </Box>
            </Stack>
            <LoginForm token={token} />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
