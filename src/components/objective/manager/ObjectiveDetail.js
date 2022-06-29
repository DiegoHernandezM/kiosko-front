import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import {
  Box,
  Drawer,
  Typography,
  Tooltip,
  Divider,
  IconButton,
  Stack,
  Card,
  CardHeader,
  Button,
  FormControl,
  TextField,
  FormControlLabel,
  Switch
} from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { CloudDownload, Close } from '@mui/icons-material';
import { useFormik } from 'formik';
import { useEffect } from 'react';
// components
// ----------------------------------------------------------------------

ObjectiveDetail.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  objective: PropTypes.object,
  downloadFile: PropTypes.func,
  parentCallback: PropTypes.any
};

const filters = {
  pinter: {
    cursor: 'pointer',
    marginLeft: '5px',
    textAlign: 'center'
  }
};

const Jss1 = styled('div')({
  width: '100%',
  border: '1px solid rgb(169,169,169)',
  height: '26px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '2px'
});

const Jss2 = styled('div')({
  width: '100%',
  display: 'flex',
  position: 'absolute',
  lineHeight: '24px',
  justifyContent: 'center',
  color: '1px solid rgb(169,169,169)'
});

export default function ObjectiveDetail({ open, close, objective, downloadFile, parentCallback }) {
  const avg = objective.weighing;
  const avgProgress = objective.progress;
  const formik = useFormik({
    initialValues: {
      id: 0,
      observation: '',
      approved: false
    },
    onSubmit: (values, { resetForm }) => {
      parentCallback(objective.id, values, objective);
      resetForm(formik.initialValues);
    }
  });

  useEffect(() => {
    formik.setFieldValue('id', objective.id ?? formik.initialValues.id);
    formik.setFieldValue('observation', objective.observation ?? formik.initialValues.observation);
    formik.setFieldValue('approved', objective.approved === 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objective]);

  const columns = [
    {
      field: 'original',
      headerName: 'Nombre',
      flex: 1,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'action',
      headerName: 'Acciones',
      sortable: false,
      disableExport: true,
      flex: 0.5,
      renderCell: (params) => {
        const onClickDownload = (e) => {
          e.stopPropagation();
          downloadFile(params.row.name, params.row.original);
        };
        return [
          <Tooltip key={`dw-${params.row.name}`} title="Descargar">
            <CloudDownload
              onClick={onClickDownload}
              key={`dw-${params.row.name}`}
              type="button"
              color="primary"
              style={filters.pinter}
            />
          </Tooltip>
        ];
      }
    }
  ];

  return (
    <Drawer
      style={{ zIndex: 999999 }}
      anchor="right"
      open={open}
      onClose={close}
      sx={{ width: { xs: '200px', md: '500px', xl: '600px' } }}
    >
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
              DETALLE DE OBJETIVO
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
          <Card style={{ marginLeft: '10px' }}>
            <CardHeader
              title={objective.name}
              sx={{
                '& .MuiCardHeader-action': {
                  alignSelf: 'center'
                }
              }}
            />
            <Stack spacing={2} sx={{ minHeight: 402, position: 'relative', p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <div>
                  <Typography variant="body">Ponderacion:</Typography>
                </div>
                <Jss1>
                  <Jss2>{avg > 0 ? avg : 0}</Jss2>
                  <div
                    style={{ height: '100%', maxWidth: `${avg > 0 ? avg : 0}%`, backgroundColor: 'rgb(206, 198, 197)' }}
                  />
                </Jss1>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={2}>
                <div>
                  <Typography variant="body">Avance:</Typography>
                </div>
                <Jss1>
                  <Jss2>{avgProgress > 0 ? avgProgress : 0}%</Jss2>
                  <div
                    style={{
                      height: '100%',
                      maxWidth: `${avgProgress > 0 ? avgProgress : 0}%`,
                      backgroundColor: 'rgb(206, 198, 197)'
                    }}
                  />
                </Jss1>
              </Stack>
              <Typography variant="body2">{objective.description}</Typography>
              <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
              <div>
                <Typography variant="body">Evidencia:</Typography>
              </div>
              <div style={{ height: 300, width: '100%' }}>
                <div style={{ display: 'flex', height: '100%' }}>
                  <div style={{ flexGrow: 1 }}>
                    <DataGrid
                      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                      componentsProps={{
                        toolbar: {
                          export: false,
                          columns: false,
                          density: false
                        }
                      }}
                      rowsPerPageOptions={[10]}
                      rows={objective.evidence ?? []}
                      columns={columns}
                      rowHeight={40}
                      pageSize={10}
                    />
                  </div>
                </div>
              </div>
              <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
              <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formik.values.approved}
                      onChange={(value) => formik.setFieldValue('approved', value.target.checked)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label="Aprobado"
                />
              </FormControl>
              <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
                <TextField
                  id="observation"
                  name="observation"
                  label="Observacion"
                  value={formik.values.observation || ''}
                  onChange={formik.handleChange}
                  error={formik.touched.observation && Boolean(formik.errors.observation)}
                  fullWidth
                  multiline
                  rows={2}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </FormControl>
            </Stack>
          </Card>
        </form>
      </Box>
    </Drawer>
  );
}
