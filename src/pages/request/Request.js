import { useState, useEffect } from 'react';
// material
import { Container, Card, Tooltip } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getPetitions,
  getPetition,
  clearDataPetition,
  approvedPet,
  destroy,
  restore,
  getFile
} from '../../redux/slices/petition';
// components
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import { QuickSearch } from '../../components/tables';
import RequestForm from '../../components/request/RequestForm';
// import useAuth from '../../hooks/useAuth';
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

export default function Request() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { petitions, petition, isLoading } = useSelector((state) => state.petition);
  const [openForm, setOpenForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const [modeUpdate, setModeUpdate] = useState(false);
  const [rows, setRows] = useState([]);
  const [petitionId, setPetitionId] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [modeRestore, setModeRestore] = useState(false);

  const columns = [
    {
      field: 'date',
      headerName: 'Fecha',
      width: 100,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'full_name',
      headerName: 'Colaborador',
      width: 180,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'areaname',
      headerName: 'Area',
      width: 120,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'subname',
      headerName: 'Rol',
      width: 120,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'approved',
      headerName: 'Estatus',
      width: 90,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>,
      renderCell: (params) => {
        if (params.row.approved === 0) {
          return (
            <div>
              <Tooltip title={params.row.approved === 0 ? 'Peticion rechazada' : 'N/A'} aria-label="add">
                <CancelOutlinedIcon style={{ color: 'red' }} />
              </Tooltip>
            </div>
          );
        }
        if (params.row.approved === 1) {
          return (
            <div>
              <Tooltip title={params.row.approved === 1 ? 'Peticion en espera' : 'N/A'} aria-label="add">
                <AccessTimeOutlinedIcon style={{ color: 'orange' }} />
              </Tooltip>
            </div>
          );
        }
        return (
          <div>
            <Tooltip title={params.row.approved === 2 ? 'Peticion aceptada' : 'N/A'} aria-label="add">
              <CheckOutlinedIcon style={{ color: 'green' }} />
            </Tooltip>
          </div>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Acciones',
      sortable: false,
      disableExport: true,
      width: 100,
      renderCell: (params) => {
        const onClickDelete = (e) => {
          e.stopPropagation();
          setPetitionId(params.row.id);
          setOpenConfirm(true);
          setModeRestore(false);
        };
        const onClickRestore = (e) => {
          e.stopPropagation();
          setPetitionId(params.row.id);
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
    dispatch(getPetitions());
  }, [dispatch]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = petitions.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  const handleCloseForm = () => {
    dispatch(clearDataPetition());
    setOpenForm(false);
  };

  const handleUpdate = (id, comment, approved, commentAdmin) => {
    setOpenForm(false);
    dispatch(approvedPetition(id, comment, approved, commentAdmin));
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
      dispatch(deletePetition());
    } else {
      setOpenConfirm(false);
      dispatch(restorePetition());
    }
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  function approvedPetition(id, comment, approved, commentAdmin) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(approvedPet(id, comment, approved, commentAdmin)));
      })
        .then((response) => {
          dispatch(getPetitions());
          setMessage(response.status === 200 ? 'Operacion realizada' : 'Ocurrio algun error');
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

  function deletePetition() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(destroy(petitionId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Peticion eliminada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getPetitions());
          setPetitionId(0);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function restorePetition() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(restore(petitionId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Peticion recuperada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getPetitions());
          setPetitionId(0);
          setModeRestore(false);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  const downloadFile = (name, original) => {
    dispatch(downFiles(name, original));
  };

  function downFiles(name, original) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(getFile(name)));
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', original);
          document.body.appendChild(link);
          link.click();
          setPetitionId(0);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  return (
    <Page title="Solicitudes">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Solicitudes" links={[{ name: '', href: PATH_DASHBOARD.root }]} />
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
                  rows={rows.length > 0 ? rows : petitions}
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
                    dispatch(getPetition(params.row.id));
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
      <RequestForm
        open={openForm}
        close={handleCloseForm}
        petition={petition}
        update={modeUpdate}
        updatePetition={handleUpdate}
        downloadFile={downloadFile}
      />
      <DialogConfirm
        open={openConfirm}
        close={handleCloseConfirm}
        title={modeRestore === false ? 'Eliminar peticion' : 'Recuperar peticion'}
        body={modeRestore === false ? 'Desea eliminar esta peticion' : 'Desea recuperar esta peticion'}
        agree={handleCloseAccept}
      />
    </Page>
  );
}
