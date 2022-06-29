import PropTypes from 'prop-types';
// material
import { Box, Drawer, Typography, Tooltip, Divider, IconButton, Stack, Card, CardHeader } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { CloudDownload, Close } from '@mui/icons-material';
// components
// ----------------------------------------------------------------------

TaskDetail.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  task: PropTypes.object,
  downloadFile: PropTypes.func
};

const filters = {
  pinter: {
    cursor: 'pointer',
    marginLeft: '5px',
    textAlign: 'center'
  }
};

export default function TaskDetail({ open, close, task, downloadFile }) {
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
    <Drawer style={{ zIndex: 999999 }} anchor="right" open={open} onClose={close}>
      <Box sx={{ width: { xs: '390px', md: '500px', xl: '600px' } }}>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h4" style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '30px' }}>
            DETALLE DE ACTIVIDAD
          </Typography>
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
        <form noValidate autoComplete="off">
          <Card style={{ marginLeft: '10px' }}>
            <CardHeader
              title={task.name}
              subheader={task.project?.project}
              sx={{
                '& .MuiCardHeader-action': {
                  alignSelf: 'center'
                }
              }}
            />
            <Stack spacing={2} sx={{ minHeight: 402, position: 'relative', p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <div>
                  <Typography variant="subtitle2">
                    {task.associate?.associate} {task.associate?.lastnames}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                    {task.task_date}
                  </Typography>
                </div>
              </Stack>
              <Typography variant="body2">{task.task_description}</Typography>
              <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
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
                      rows={task.files ?? []}
                      columns={columns}
                      rowHeight={40}
                      pageSize={10}
                    />
                  </div>
                </div>
              </div>
            </Stack>
          </Card>
        </form>
      </Box>
    </Drawer>
  );
}
