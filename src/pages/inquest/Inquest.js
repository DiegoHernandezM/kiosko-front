import { useState, useEffect } from 'react';
import moment from 'moment';
// material
import { Button, Container, Card, Tooltip } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
// redux
import { CheckOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from '../../redux/store';
import {
  getInquests,
  getInquest,
  clearDataInquest,
  create,
  update,
  destroy,
  restore,
  expire,
  getInquestCsv
} from '../../redux/slices/inquest';
// components
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import { QuickSearch } from '../../components/tables';
import InquestCreateForm from '../../components/inquest/InquestCreateForm';
import InquestEditForm from '../../components/inquest/InquestEditForm';
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

export default function Inquest() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { inquests, inquest, isLoading } = useSelector((state) => state.inquest);
  const [openForm, setOpenForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState([]);
  const [inquestId, setInquestId] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [modeRestore, setModeRestore] = useState(false);
  const [openConfirmExpire, setOpenConfirmExpire] = useState(false);

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre',
      width: 250,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'description',
      headerName: 'Descripcion',
      width: 250,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'expired',
      headerName: 'Estado',
      width: 120,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>,
      // eslint-disable-next-line consistent-return
      renderCell: (params) => {
        if (params.row.expired === 0) {
          return (
            <div>
              <Tooltip title={params.row.expired === 0 ? 'Encuesta activa' : 'N/A'} aria-label="add">
                <CheckOutlined style={{ color: 'green' }} />
              </Tooltip>
            </div>
          );
        }
        if (params.row.expired === 1) {
          return (
            <div>
              <Tooltip title={params.row.expired === 1 ? 'Encuesta ya finalizo' : 'N/A'} aria-label="add">
                <AddTaskOutlinedIcon style={{ color: 'green' }} />
              </Tooltip>
            </div>
          );
        }
      }
    },
    {
      field: 'action',
      headerName: 'Acciones',
      sortable: false,
      disableExport: true,
      width: 150,
      renderCell: (params) => {
        const onClickDelete = (e) => {
          e.stopPropagation();
          setInquestId(params.row.id);
          setOpenConfirm(true);
          setModeRestore(false);
        };
        const onClickExpire = (e) => {
          e.stopPropagation();
          setInquestId(params.row.id);
          setOpenConfirmExpire(true);
        };
        const onClickDownload = (e) => {
          e.stopPropagation();
          setInquestId(params.row.id);
          dispatch(getInquestById(params.row.id));
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
            <Tooltip
              key={`expires-${params.row.id}`}
              title={params.row.expired === 0 ? 'Finalizar encuesta' : 'Encuesta finalizada'}
            >
              <div>
                <IconButton
                  disabled={params.row.deleted_at !== null || params.row.expired === 1}
                  color="primary"
                  onClick={onClickExpire}
                  key={`re-${params.row.id}`}
                  type="button"
                  style={filters.pinter}
                >
                  <AssignmentTurnedInOutlinedIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip
              key={`download-${params.row.id}`}
              title={params.row.expired === 0 ? 'No disponible' : 'Descargar resultados'}
            >
              <div>
                <IconButton
                  disabled={params.row.deleted_at !== null || params.row.expired === 0}
                  color="primary"
                  onClick={onClickDownload}
                  key={`re-${params.row.id}`}
                  type="button"
                  style={filters.pinter}
                >
                  <FileDownloadOutlinedIcon />
                </IconButton>
              </div>
            </Tooltip>
          </>
        );
      }
    }
  ];

  useEffect(() => {
    dispatch(getInquests());
  }, [dispatch]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = inquests.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  const handleCloseForm = () => {
    dispatch(clearDataInquest());
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseEditForm = () => {
    dispatch(clearDataInquest());
    setOpenEditForm(false);
  };

  const handleOpenEditForm = () => {
    setOpenEditForm(true);
  };

  const handleUpdate = (id, name, description, content) => {
    setOpenEditForm(false);
    dispatch(updateInquest(id, name, description, content));
  };

  const handleCloseConfirm = () => {
    if (modeRestore === false) {
      setOpenConfirm(false);
      setModeRestore(false);
    } else {
      setOpenConfirm(false);
      setModeRestore(true);
    }
  };

  const handleCloseConfirmExpire = () => {
    setOpenConfirmExpire(false);
  };

  const handleCloseAccept = () => {
    if (modeRestore === false) {
      setOpenConfirm(false);
      dispatch(deleteInquest());
    } else {
      setOpenConfirm(false);
      dispatch(restoreInquest());
    }
  };

  const handleCloseAcceptExpire = () => {
    setOpenConfirmExpire(false);
    dispatch(expireInquest());
  };

  const handleCallbackForm = (values) => {
    dispatch(createInquest(values.name, values.description, values.content, values.emails));
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  function createInquest(name, description, content, emails) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(create(name, description, content, emails)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Encuesta creada' : 'Ocurro algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          dispatch(getInquests());
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

  function updateInquest(id, name, description, content) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(update(id, name, description, content)));
      })
        .then((response) => {
          dispatch(getInquests());
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

  function deleteInquest() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(destroy(inquestId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Encuesta eliminada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getInquests());
          setInquestId(0);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function restoreInquest() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(restore(inquestId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Encuesta recuperada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getInquests());
          setInquestId(0);
          setModeRestore(false);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function expireInquest() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(expire(inquestId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Encuesta finalizada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getInquests());
          setInquestId(0);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function getInquestById(id) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(getInquestCsv(id)));
      })
        .then((response) => {
          const data = [];
          response.forEach((value, key) => {
            data[key] = [
              moment(value.created_at).format('YYYY-MM-DD'),
              value.iname,
              value.rname,
              value.email,
              value.new_content,
              value.comments
            ];
          });
          const headerRow = ['Fecha', 'Nombre encuesta', 'Participante', 'Email', 'Contenido', 'Comentarios'];
          const delimiter = ',';
          const csvContent = [headerRow, ...data].map((e) => e.join(delimiter)).join('\n');
          const csvFileName = 'Reporte-de-encuesta';
          downloadCsv(csvContent, csvFileName);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  const downloadCsv = (data, fileName) => {
    const finalFileName = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], { type: 'text/csv' }));
    a.setAttribute('download', finalFileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Page title="KIOSKO: Encuestas">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Encuestas"
          links={[{ name: '', href: PATH_DASHBOARD.root }]}
          action={
            <Button variant="contained" onClick={handleOpenForm} startIcon={<Icon icon={plusFill} />}>
              Nueva Encuesta
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
                  rows={rows.length > 0 ? rows : inquests}
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
                    dispatch(getInquest(params.row.id));
                    handleOpenEditForm();
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
      <InquestCreateForm open={openForm} close={handleCloseForm} parentCallback={handleCallbackForm} />
      <InquestEditForm open={openEditForm} close={handleCloseEditForm} inquest={inquest} updateInquest={handleUpdate} />
      <DialogConfirm
        open={openConfirm}
        close={handleCloseConfirm}
        title={modeRestore === false ? 'Eliminar encuesta' : 'Recuperar encuesta'}
        body={modeRestore === false ? 'Desea eliminar esta encuesta' : 'Desea recuperar esta encuesta'}
        agree={handleCloseAccept}
      />
      <DialogConfirm
        open={openConfirmExpire}
        close={handleCloseConfirmExpire}
        title={'Finalizar encuesta'}
        body={'Desea finalizar esta encuesta'}
        agree={handleCloseAcceptExpire}
      />
    </Page>
  );
}
