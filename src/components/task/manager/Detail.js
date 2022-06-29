import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Button, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { VisibilityOutlined } from '@mui/icons-material';
// components
import TaskDetail from './TaskDetail';
// ----------------------------------------------------------------------

Detail.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  tasksAssociate: PropTypes.object,
  download: PropTypes.func
};

const filters = {
  pinter: {
    cursor: 'pointer',
    marginLeft: '5px',
    textAlign: 'center'
  }
};

export default function Detail({ open, close, tasksAssociate, download }) {
  const isLoading = false;
  const [detailTask, setDetailTask] = useState({});
  const [openDetail, setOpenDetail] = useState(false);

  const columns = [
    {
      field: 'task_day',
      headerName: 'Dia',
      flex: 1,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'name',
      headerName: 'Nombre de actividad',
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
          setDetailTask(params.row);
          setOpenDetail(true);
        };
        return [
          <Tooltip key={`dw-${params.row.id}`} title="Detalle">
            <VisibilityOutlined
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

  const handleClose = () => {
    setOpenDetail(false);
  };

  return (
    <>
      <Dialog maxWidth="sm" fullWidth open={open} onClose={close} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">
          Actividades de: {tasksAssociate.name} {tasksAssociate.lastnames}{' '}
        </DialogTitle>
        <DialogContent>
          <div style={{ height: 400, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  loading={isLoading}
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  rows={tasksAssociate.tasks ?? []}
                  columns={columns}
                  rowHeight={40}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={close}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <TaskDetail open={openDetail} close={handleClose} task={detailTask} downloadFile={download} />
    </>
  );
}
