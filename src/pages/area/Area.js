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
import { getAreas, getArea, clearDataArea, create, update, destroy, restore } from '../../redux/slices/area';
// components
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import { QuickSearch } from '../../components/tables';
import AreaForm from '../../components/area/AreaForm';
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
  const { areas, area, isLoading } = useSelector((state) => state.area);
  const [openForm, setOpenForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const [modeUpdate, setModeUpdate] = useState(false);
  const [rows, setRows] = useState([]);
  const { user } = useAuth();
  const [areaId, setAreaId] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [modeRestore, setModeRestore] = useState(false);

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'deleted_at',
      headerName: 'Estatus',
      flex: 0.5,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>,
      renderCell: (params) => (
        <div>
          <Tooltip title={params.row.deleted_at === null ? 'Area habilitada' : 'Area deshabilitada'} aria-label="add">
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
          setAreaId(params.row.id);
          setOpenConfirm(true);
          setModeRestore(false);
        };
        const onClickRestore = (e) => {
          e.stopPropagation();
          setAreaId(params.row.id);
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
  }, [dispatch]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = areas.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  const handleCloseForm = () => {
    dispatch(clearDataArea());
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setModeUpdate(false);
    setOpenForm(true);
  };

  const handleUpdate = (id, name) => {
    setOpenForm(false);
    dispatch(updateArea(id, name));
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
      dispatch(deleteArea());
    } else {
      setOpenConfirm(false);
      dispatch(restoreArea());
    }
  };

  const handleCallbackForm = (values) => {
    dispatch(createArea(values.name));
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  function createArea(name) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(create(name)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Area creada' : 'Ocurro algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          dispatch(getAreas());
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

  function updateArea(id, name) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(update(id, name)));
      })
        .then((response) => {
          dispatch(getAreas());
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

  function deleteArea() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(destroy(areaId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Area eliminada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getAreas());
          setAreaId(0);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function restoreArea() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(restore(areaId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Area recuperada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getAreas());
          setAreaId(0);
          setModeRestore(false);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  return (
    <Page title="Areas">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Areas"
          links={[{ name: '', href: PATH_DASHBOARD.root }]}
          action={
            <Button variant="contained" onClick={handleOpenForm} startIcon={<Icon icon={plusFill} />}>
              Nueva Area
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
                  rows={rows.length > 0 ? rows : areas}
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
                    dispatch(getArea(params.row.id));
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
      <AreaForm
        open={openForm}
        close={handleCloseForm}
        parentCallback={handleCallbackForm}
        area={area}
        update={modeUpdate}
        updateArea={handleUpdate}
        permissions={user.permissions}
      />
      <DialogConfirm
        open={openConfirm}
        close={handleCloseConfirm}
        title={modeRestore === false ? 'Eliminar area' : 'Recuperar area'}
        body={modeRestore === false ? 'Desea eliminar esta area' : 'Desea recuperar esta area'}
        agree={handleCloseAccept}
      />
    </Page>
  );
}
