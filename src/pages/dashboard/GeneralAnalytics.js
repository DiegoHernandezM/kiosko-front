import { useEffect } from 'react';
// @mui
import { Grid, Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import { useDispatch, useSelector } from '../../redux/store';
import { getData } from '../../redux/slices/dashboard';
// sections
import { AnalyticsOrderTimeline, StatsInfoCard, DataChart } from '../../sections/@dashboard/general/analytics';

// ----------------------------------------------------------------------

export default function GeneralAnalytics() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Bienvenido
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <StatsInfoCard title="Colaboradores" color="success" total={data.associates} />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <StatsInfoCard title="Solicitudes pendientes" color="warning" total={data.petitions} />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <StatsInfoCard title="Objetivos por aprobar" color="warning" total={data.objectives} />
          </Grid>

          <Grid item xs={12} md={8} lg={8}>
            <DataChart associates={data.tasks ?? []} />
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <AnalyticsOrderTimeline events={data.events ?? []} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
