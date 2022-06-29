import { useState, useEffect } from 'react';
import moment from 'moment';
// material
import { Button, Container, Card, Tooltip } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { CheckOutlined, AccessTimeOutlined, CancelOutlined } from '@mui/icons-material';

// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getPetitionsByAssociate,
  getPetition,
  clearDataPetition,
  create,
  update,
  destroy,
  restore,
  addFiles,
  dropFile,
  getFile
} from '../../redux/slices/petition';
// components
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import { QuickSearch } from '../../components/tables';
import PetitionForm from '../../components/petition/PetitionForm';
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

export default function Petition() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { petition, isLoading, petitionsAssociate, associate, loading } = useSelector((state) => state.petition);
  const [openForm, setOpenForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const [modeUpdate, setModeUpdate] = useState(false);
  const [rows, setRows] = useState([]);
  const { user } = useAuth();
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
      field: 'approved',
      headerName: 'Estatus',
      width: 90,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>,
      renderCell: (params) => {
        if (params.row.approved === 0) {
          return (
            <div>
              <Tooltip title={params.row.approved === 0 ? 'Peticion rechazada' : 'N/A'} aria-label="add">
                <CancelOutlined style={{ color: 'red' }} />
              </Tooltip>
            </div>
          );
        }
        if (params.row.approved === 1) {
          return (
            <div>
              <Tooltip title={params.row.approved === 1 ? 'Peticion en espera' : 'N/A'} aria-label="add">
                <AccessTimeOutlined style={{ color: 'orange' }} />
              </Tooltip>
            </div>
          );
        }
        return (
          <div>
            <Tooltip title={params.row.approved === 2 ? 'Peticion aceptada' : 'N/A'} aria-label="add">
              <CheckOutlined style={{ color: 'green' }} />
            </Tooltip>
          </div>
        );
      }
    },
    {
      field: 'approved_by',
      headerName: 'Aprobado por',
      width: 120,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>,
      renderCell: (params) => (params.row.approved_by !== 0 ? params.row.approvedBy : '----')
    },
    {
      field: 'action',
      headerName: 'Acciones',
      sortable: false,
      disableExport: true,
      width: 90,
      renderCell: (params) => {
        const onClickDelete = (e) => {
          e.stopPropagation();
          setPetitionId(params.row.id);
          setOpenConfirm(true);
          setModeRestore(false);
        };
        return (
          <>
            <Tooltip key={`re-${params.row.id}`} title="Eliminar">
              <div>
                <IconButton
                  disabled={params.row.deleted_at !== null || params.row.approved === 2 || params.row.approved === 1}
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
          </>
        );
      }
    }
  ];

  useEffect(() => {
    dispatch(getPetitionsByAssociate());
  }, [dispatch]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = petitionsAssociate.filter((row) =>
      Object.keys(row).some((field) => searchRegex.test(row[field]))
    );
    setRows(filteredRows);
  };

  const handleCloseForm = () => {
    dispatch(clearDataPetition());
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setModeUpdate(false);
    setOpenForm(true);
  };

  const handleUpdate = (id, date, petitionDesc, comment, approvedBy, associateId, period) => {
    setOpenForm(false);
    dispatch(updatePetition(id, date, petitionDesc, comment, approvedBy, associateId, period));
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

  const handleCallbackForm = (values, files) => {
    dispatch(
      createPetition(
        values.date,
        values.petition_description,
        values.comment,
        values.approved,
        values.start,
        values.end,
        values.days,
        files
      )
    );
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  function createPetition(date, petitionDesc, comment, approved, start, end, days, files) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(
          dispatch(create(moment(date).format('YYYY-MM-DD'), petitionDesc, comment, approved, start, end, days, files))
        );
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Peticion creada' : 'Ocurro algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          dispatch(getPetitionsByAssociate());
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

  function updatePetition(id, date, petitionDesc, comment, approvedBy, associateId, period) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(update(id, date, petitionDesc, comment, false, approvedBy, associateId, period)));
      })
        .then((response) => {
          dispatch(getPetitionsByAssociate());
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

  function deletePetition() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(destroy(petitionId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Peticion eliminada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getPetitionsByAssociate());
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
          dispatch(getPetitionsByAssociate());
          setPetitionId(0);
          setModeRestore(false);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  const addFilesTask = (id, files) => {
    dispatch(newFiles(id, files));
  };

  const deleteFileTask = (id, name, aFiles) => {
    dispatch(deleteFiles(id, name, aFiles));
  };

  const downloadFile = (name, original) => {
    dispatch(downFiles(name, original));
  };

  function newFiles(id, files) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(addFiles(id, files)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Archivo(s) agregados' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getPetition(id));
          setPetitionId(0);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function deleteFiles(id, name, aFiles) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(dropFile(id, name, aFiles)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Archivo eliminado' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getPetition(id));
          setPetitionId(0);
        })
        .catch((error) => {
          console.log(error);
        });
  }

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
    <Page title="Peticiones">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Peticiones"
          links={[{ name: '', href: PATH_DASHBOARD.root }]}
          action={
            <Button variant="contained" onClick={handleOpenForm} startIcon={<Icon icon={plusFill} />}>
              Nueva Peticion
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
                  rows={rows.length > 0 ? rows : petitionsAssociate}
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
      <PetitionForm
        open={openForm}
        close={handleCloseForm}
        parentCallback={handleCallbackForm}
        petition={petition}
        associate={associate}
        update={modeUpdate}
        updatePetition={handleUpdate}
        permissions={user.permissions}
        uploadFiles={addFilesTask}
        deleteFile={deleteFileTask}
        downloadFile={downloadFile}
        loading={loading}
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
