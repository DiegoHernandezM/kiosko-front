import { useState, useEffect } from 'react';
// material
import { Container, Card, Button, Tooltip } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { RadioButtonChecked as EnableIcon } from '@mui/icons-material';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAreas } from '../../redux/slices/area';
import {
  getSubareas,
  getSubarea,
  clearDataSubarea,
  create,
  update,
  destroy,
  restore
} from '../../redux/slices/subarea';

// components
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import { QuickSearch } from '../../components/tables';
import SubareaForm from '../../components/subarea/SubareaForm';
import useAuth from '../../hooks/useAuth';
import SnackAlert from '../../components/general/SnackAlert';
import DialogConfirm from '../../components/general/DialogConfirm';

const filters = {
  pinter: {
    cursor: 'pointer',
    marginLeft: '5px',
    textAlign: 'center'
  }
};

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export default function Area() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { areas } = useSelector((state) => state.area);
  const { subareas, subarea, isLoading } = useSelector((state) => state.subarea);
  const [openForm, setOpenForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const [modeUpdate, setModeUpdate] = useState(false);
  const [rows, setRows] = useState([]);
  const { user } = useAuth();
  const [subareaId, setSubareaId] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [modeRestore, setModeRestore] = useState(false);

  const columns = [
    {
      field: 'name',
      headerName: 'Rol',
      flex: 1,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'area_name',
      headerName: 'Area',
      flex: 1.2,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'deleted_at',
      headerName: 'Estatus',
      flex: 0.3,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>,
      renderCell: (params) => (
        <div>
          <Tooltip
            title={params.row.deleted_at === null ? 'Subarea habilitada' : 'Subarea deshabilitada'}
            aria-label="add"
          >
            <EnableIcon style={{ color: params.row.deleted_at === null ? 'green' : 'gray' }} />
          </Tooltip>
        </div>
      )
    },
    {
      field: 'action',
      headerName: 'Acciones',
      sortable: false,
      disableExport: true,
      flex: 0.5,
      renderCell: (params) => {
        const onClickDelete = (e) => {
          e.stopPropagation();
          setSubareaId(params.row.id);
          setOpenConfirm(true);
          setModeRestore(false);
        };
        const onClickRestore = (e) => {
          e.stopPropagation();
          setSubareaId(params.row.id);
          setOpenConfirm(true);
          setModeRestore(true);
        };
        return (
          <>
            <Tooltip key={`re-${params.row.id}`} title="Eliminar">
              <div>
                <IconButton
                  disabled={params.row.deleted_at !== null}
                  onClick={onClickDelete}
                  key={`re-${params.row.id}`}
                  type="button"
                  color="primary"
                  style={filters.pinter}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip key={`res-${params.row.id}`} title="Recuperar">
              <div>
                <IconButton
                  disabled={params.row.deleted_at === null}
                  color="primary"
                  onClick={onClickRestore}
                  key={`re-${params.row.id}`}
                  type="button"
                  style={filters.pinter}
                >
                  <RestoreFromTrashIcon />
                </IconButton>
              </div>
            </Tooltip>
          </>
        );
      }
    }
  ];

  useEffect(() => {
    dispatch(getAreas());
    dispatch(getSubareas());
  }, [dispatch]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = subareas.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  const handleCloseForm = () => {
    dispatch(clearDataSubarea());
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setModeUpdate(false);
    setOpenForm(true);
  };

  const handleCloseConfirm = () => {
    if (modeRestore === false) {
      setModeUpdate(false);
      setOpenConfirm(false);
      setModeRestore(false);
    } else {
      setModeUpdate(false);
      setOpenConfirm(false);
      setModeRestore(true);
    }
  };

  const handleCloseAccept = () => {
    if (modeRestore === false) {
      setOpenConfirm(false);
      dispatch(deleteSubarea());
    } else {
      setOpenConfirm(false);
      dispatch(restoreSubarea());
    }
  };

  const handleUpdate = (id, name, areaId) => {
    setOpenForm(false);
    dispatch(updateSubarea(id, name, areaId));
  };

  const handleCallbackForm = (values) => {
    dispatch(createSubarea(values.name, values.areaId));
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  function createSubarea(name, areaId) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(create(name, areaId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Rol creado' : 'Ocurro algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          dispatch(getSubareas());
          setOpenMessage(true);
          setOpenForm(false);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function updateSubarea(id, name, areaId) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(update(id, name, areaId)));
      })
        .then((response) => {
          dispatch(getSubareas());
          setMessage(response.status === 200 ? 'Actualizacion realizada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function deleteSubarea() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(destroy(subareaId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Subarea eliminada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getSubareas());
          setSubareaId(0);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function restoreSubarea() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(restore(subareaId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Rol recuperado' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getSubareas());
          setSubareaId(0);
          setModeRestore(false);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  return (
    <Page title="Roles">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Roles"
          links={[{ name: '', href: PATH_DASHBOARD.root }]}
          action={
            <Button variant="contained" onClick={handleOpenForm} startIcon={<Icon icon={plusFill} />}>
              Nuevo Rol
            </Button>
          }
        />
      </Container>
      <SnackAlert message={message} type={typeMessage} open={openMessage} close={handleCloseMessage} />
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <div style={{ height: 600, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  components={{
                    Toolbar: QuickSearch
                  }}
                  loading={isLoading}
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  rows={rows.length > 0 ? rows : subareas}
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
                    dispatch(getSubarea(params.row.id));
                    setModeUpdate(true);
                    setOpenForm(true);
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
        </Card>
      </Container>
      <SubareaForm
        open={openForm}
        close={handleCloseForm}
        parentCallback={handleCallbackForm}
        areas={areas}
        subarea={subarea}
        update={modeUpdate}
        updateSubarea={handleUpdate}
        permissions={user.permissions}
      />
      <DialogConfirm
        open={openConfirm}
        close={handleCloseConfirm}
        title={modeRestore === false ? 'Eliminar Rol' : 'Recuperar Rol'}
        body={modeRestore === false ? 'Desea eliminar este rol' : 'Desea recuperar este rol'}
        agree={handleCloseAccept}
      />
    </Page>
  );
}
