import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { DataGrid, esES } from '@mui/x-data-grid';
import { Delete, RestoreFromTrash } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
// components
import { QuickSearch } from '../tables';
import DialogConfirm from '../general/DialogConfirm';

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const filters = {
  pinter: {
    cursor: 'pointer',
    marginLeft: '5px',
    textAlign: 'center'
  }
};

TableUsers.propTypes = {
  doubleClick: PropTypes.func,
  users: PropTypes.array,
  loading: PropTypes.bool,
  handleRestore: PropTypes.func,
  handleDelete: PropTypes.func
};

export default function TableUsers({ users, doubleClick, loading, handleRestore, handleDelete }) {
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [titleDialog, setTitleDialog] = useState('');
  const [bodyDialog, setBodyDialog] = useState('');
  const [restore, setRestore] = useState(false);
  const [id, setId] = useState(0);

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1.5,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'email',
      headerName: 'Correo',
      flex: 1.5,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'action',
      headerName: 'Acciones',
      sortable: false,
      disableExport: true,
      flex: 1,
      renderCell: (params) => {
        const onClickDelete = (e) => {
          e.stopPropagation();
          setRestore(false);
          handleOpenConfirm();
          setTitleDialog('Eliminar usuario');
          setBodyDialog('Desea eliminar el registro?');
          setId(params.row.id);
        };
        const onClickRestore = (e) => {
          e.stopPropagation();
          handleOpenConfirm();
          setRestore(true);
          setTitleDialog('Recuperar usuario');
          setBodyDialog('Desea recuperar el registro?');
          setId(params.row.id);
        };
        return (
          <>
            <Tooltip key={`re-${params.row.id}`} title="Eliminar">
              <div>
                <IconButton
                  disabled={params.row.deleted_at !== null}
                  onClick={onClickDelete}
                  key={`delete-${params.row.id}`}
                  type="button"
                  color="primary"
                  style={filters.pinter}
                >
                  <Delete />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip key={`res-${params.row.id}`} title="Recuperar">
              <div>
                <IconButton
                  disabled={params.row.deleted_at === null}
                  color="primary"
                  onClick={onClickRestore}
                  key={`restore-${params.row.id}`}
                  type="button"
                  style={filters.pinter}
                >
                  <RestoreFromTrash />
                </IconButton>
              </div>
            </Tooltip>
          </>
        );
      }
    }
  ];

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = users.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseAccept = () => {
    if (restore) {
      handleRestore(id);
    } else {
      handleDelete(id);
    }
    setOpenConfirm(false);
  };

  return (
    <>
      <div style={{ height: 600, width: '100%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              components={{
                Toolbar: QuickSearch
              }}
              loading={loading}
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              rows={rows.length > 0 ? rows : users}
              columns={columns}
              rowHeight={40}
              componentsProps={{
                hideFooterPagination: false,
                toolbar: {
                  hideFooterPagination: false,
                  export: false,
                  columns: true,
                  density: true,
                  search: true,
                  customExport: false,
                  value: searchText,
                  onChange: (event) => requestSearch(event.target.value),
                  clearSearch: () => requestSearch('')
                }
              }}
              onRowDoubleClick={(params) => {
                doubleClick(params.row.id);
              }}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => {
                setPageSize(newPageSize);
              }}
              rowsPerPageOptions={[10, 20, 50, 100]}
            />
          </div>
        </div>
      </div>
      <DialogConfirm
        open={openConfirm}
        close={handleCloseConfirm}
        title={titleDialog}
        body={bodyDialog}
        agree={handleCloseAccept}
      />
    </>
  );
}
