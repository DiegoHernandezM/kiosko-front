import { useState, useEffect } from 'react';
import moment from 'moment';
// material
import { Container, Card, Button, Tooltip, Box } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Delete, TaskAltOutlined, WarningAmber } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getProjects } from '../../../redux/slices/project';
import {
  getTasksAssociate,
  getTaskAssociate,
  createTaskAssociate,
  destroy,
  clearDataTask,
  addFiles,
  dropFile,
  getFile,
  updateTask
} from '../../../redux/slices/task';
// components
import Page from '../../../components/Page';
import { PATH_DASHBOARD } from '../../../routes/paths';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import useSettings from '../../../hooks/useSettings';
import { QuickSearch } from '../../../components/tables';
import SnackAlert from '../../../components/general/SnackAlert';
import DialogConfirm from '../../../components/general/DialogConfirm';
import CreateTask from '../../../components/task/Create';
import EditTask from '../../../components/task/Edit';
import Filters from '../../../components/task/Filters';

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

export default function Task() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { tasksAssociate, taskAssociate, isLoading } = useSelector((state) => state.task);
  const { projects } = useSelector((state) => state.project);
  const [openForm, setOpenForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState([]);
  const [taskId, setTaskId] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const dayOfWeek = moment().day();
  const canCreateUpdate = dayOfWeek === 6 || dayOfWeek === 0;

  useEffect(() => {
    dispatch(getTasksAssociate());
    dispatch(getProjects());
  }, [dispatch]);

  const getIcon = (status) => {
    if (status === 1) {
      return <TaskAltOutlined color={'success'} fontSize={'small'} style={{ marginTop: '10px' }} />;
    }
    return <WarningAmber color={'warning'} fontSize={'small'} style={{ marginTop: '10px' }} />;
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 0.5,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'status',
      headerName: 'Estado',
      flex: 0.1,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>,
      renderCell: (params) => (
        <div>
          <Tooltip
            title={
              // eslint-disable-next-line no-nested-ternary
              params.row.status === 1 ? 'Actividad en tiempo' : 'Actividad fuera de tiempo'
            }
            aria-label="add"
          >
            {getIcon(params.row.status)}
          </Tooltip>
        </div>
      )
    },
    {
      field: 'action',
      headerName: 'Acciones',
      sortable: false,
      disableExport: true,
      flex: 0.3,
      renderCell: (params) => {
        const onClickDelete = (e) => {
          e.stopPropagation();
          setTaskId(params.row.id);
          setOpenConfirm(true);
        };
        return (
          <>
            <Tooltip key={`re-${params.row.id}`} title="Eliminar">
              <div>
                <IconButton
                  onClick={onClickDelete}
                  key={`re-${params.row.id}`}
                  type="button"
                  color="primary"
                  style={filters.pinter}
                  disabled={moment().startOf('week').add(1, 'days').isAfter(moment(params.row.created_at))}
                >
                  <Delete />
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
    const filteredRows = tasksAssociate.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  const handleCloseForm = () => {
    dispatch(clearDataTask());
    setOpenForm(false);
  };

  const handleCloseEdit = () => {
    dispatch(clearDataTask());
    setOpenEdit(false);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleCloseAccept = () => {
    dispatch(deleteTask());
    setOpenConfirm(false);
  };

  const handleCallbackForm = (values, files) => {
    dispatch(createTask(values, files));
  };

  const handleCallback = (values) => {
    dispatch(getTasksAssociate(values.init, values.end, values.status));
  };

  const handleCallbackEdit = (id, values) => {
    dispatch(updateTaskValues(id, values));
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  function createTask(values, files) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(
          dispatch(
            createTaskAssociate(
              values.name,
              values.description,
              files,
              moment(values.day).format('YYYY-MM-DD'),
              values.hours
            )
          )
        );
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Actividad creada' : 'Ocurro algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          dispatch(getTasksAssociate());
          setOpenForm(false);
          setOpenMessage(true);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function updateTaskValues(id, values) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(updateTask(id, values.name, values.description, values.day, values.hours)));
      })
        .then((response) => {
          dispatch(getTasksAssociate());
          setMessage(response.status === 200 ? 'Actualizacion realizada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          setOpenEdit(false);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function deleteTask() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(destroy(taskId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Actividad eliminada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getTasksAssociate());
          setTaskId(0);
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
          dispatch(getTaskAssociate(id));
          setTaskId(0);
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
          dispatch(getTaskAssociate(id));
          setTaskId(0);
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
          setTaskId(0);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  return (
    <Page title="Actividades">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Actividades"
          links={[{ name: '', href: PATH_DASHBOARD.root }]}
          action={
            <Button
              variant="contained"
              disabled={canCreateUpdate}
              onClick={handleOpenForm}
              startIcon={<Icon icon={plusFill} />}
            >
              Nueva Actividad
            </Button>
          }
        />
      </Container>
      <SnackAlert message={message} type={typeMessage} open={openMessage} close={handleCloseMessage} />
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <Box
            sx={{
              mt: { xs: '70px', sm: '30px', md: '30px', lg: '20px' },
              mb: { xs: '70px', sm: '30px', md: '35px', lg: '20px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Filters parentCallback={handleCallback} />
          </Box>
          <div style={{ height: 600, width: '100%' }}>
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ flexGrow: 1 }}>
                <DataGrid
                  components={{
                    Toolbar: QuickSearch
                  }}
                  loading={isLoading}
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  rows={rows.length > 0 ? rows : tasksAssociate}
                  columns={columns}
                  rowHeight={40}
                  componentsProps={{
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
                    dispatch(getTaskAssociate(params.row.id));
                    setTaskId(params.row.id);
                    setOpenEdit(true);
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
      <DialogConfirm
        open={openConfirm}
        close={handleCloseConfirm}
        title={'Eliminar actividad'}
        body={'Desea eliminar esta actividad'}
        agree={handleCloseAccept}
      />
      <CreateTask open={openForm} close={handleCloseForm} parentCallback={handleCallbackForm} />
      <EditTask
        open={openEdit}
        close={handleCloseEdit}
        parentCallback={handleCallbackEdit}
        task={taskAssociate}
        projects={projects}
        uploadFiles={addFilesTask}
        deleteFile={deleteFileTask}
        downloadFile={downloadFile}
      />
    </Page>
  );
}
