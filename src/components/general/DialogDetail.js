import PropTypes from 'prop-types';
import { React, useState } from 'react';
// material
import { Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
// components
// eslint-disable-next-line import/no-useless-path-segments
import { QuickSearch } from '../../components/tables';

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

DialogDetail.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  theme: PropTypes.object,
  detail: PropTypes.array,
  palletMovements: PropTypes.array,
  handleClickPallets: PropTypes.func
};

const columns = [
  {
    field: 'wave_id',
    headerName: 'Ola',
    width: 70
  },
  {
    field: 'lpn_transportador',
    headerName: 'LPN',
    width: 130,
    renderCell: (params) => params.row.lpn_transportador.slice(0, -1)
  },
  {
    field: 'assignated_by',
    headerName: 'Ubico',
    width: 130,
    renderCell: (params) => (params.row.assignated_by !== null ? params.row.assignated_by : 'N/A')
  },
  {
    field: 'inducted_by',
    headerName: 'Indujo',
    width: 130,
    renderCell: (params) => (params.row.inducted_by !== null ? params.row.inducted_by : 'N/A')
  }
];

const palletColumns = [
  {
    field: 'wave_id',
    headerName: 'Ola',
    flex: 0.3
  },
  {
    field: 'session',
    headerName: 'Usuario',
    flex: 0.5
  },
  {
    field: 'created_at',
    headerName: 'Fecha Movimiento',
    flex: 0.8
    // renderCell: (params) => (params.row.assignated_by !== null ? params.row.assignated_by : 'N/A')
  },
  {
    field: 'from_zone',
    headerName: 'Zona Inicio',
    flex: 0.5,
    renderCell: (params) => {
      // eslint-disable-next-line no-unused-expressions
      let color = '';
      if (params.row.from_zone === 'PICKING') {
        color = 'red';
      }
      return <span style={{ color }}>{`${params.row.from_zone}`}</span>;
    }
  },
  {
    field: 'to_zone',
    headerName: 'Zona Destino',
    flex: 0.5,
    renderCell: (params) => {
      // eslint-disable-next-line no-unused-expressions
      let color = '';
      if (params.row.from_zone === 'PICKING') {
        color = 'red';
      }
      return <span style={{ color }}>{`${params.row.to_zone}`}</span>;
    }
  }
];

export default function DialogDetail({ open, close, detail, palletMovements, handleClickPallets, theme }) {
  const [page, setPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState([]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = detail.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  const handleClose = () => {
    setSearchText('');
    setRows([]);
    close();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSearchText('');
    setRows([]);
  };
  return (
    <Grid item xs={12} style={{ textAlign: 'center' }}>
      <Dialog open={open} fullWidth maxWidth="md">
        <DialogTitle>Detalle</DialogTitle>
        <DialogContent>
          <div style={{ height: 500, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  rows={rows.length > 0 ? rows : detail}
                  columns={columns}
                  components={{ Toolbar: QuickSearch }}
                  componentsProps={{
                    toolbar: {
                      export: false,
                      columns: true,
                      density: true,
                      search: true,
                      value: searchText,
                      customExport: false,
                      onChange: (event) => requestSearch(event.target.value),
                      clearSearch: () => requestSearch('')
                    }
                  }}
                  pageSize={page}
                  onPageSizeChange={(newPageSize) => setPage(newPageSize)}
                  rowsPerPageOptions={[5, 10, 25]}
                  pagination
                  style={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }}
                  onRowDoubleClick={(params) => {
                    handleClickPallets(params.row.pallet_id ?? params.row.id);
                    setOpenDialog(true);
                  }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog} fullWidth maxWidth="md">
        <DialogTitle>Historial de movimientos</DialogTitle>
        <DialogContent>
          <div style={{ height: 500, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  rows={palletMovements ?? []}
                  columns={palletColumns}
                  pageSize={page}
                  onPageSizeChange={(newPageSize) => setPage(newPageSize)}
                  rowsPerPageOptions={[5, 10, 25]}
                  pagination
                  style={{ color: theme.palette.mode === 'light' ? 'black' : 'white' }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseDialog}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
