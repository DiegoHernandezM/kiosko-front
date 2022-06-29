import { useState, useEffect } from 'react';
import moment from 'moment';
// material
import { Container, Card, Button, Tooltip, Box } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Delete, AccessTimeOutlined, TaskAltOutlined } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import {
  getObjectivesAssociate,
  getObjectiveAssociate,
  createObjective,
  updateByAssociate,
  destroy,
  addFiles,
  dropFile,
  getFile,
  clearDataObjective
} from '../../../redux/slices/objective';
// components
import Page from '../../../components/Page';
import { PATH_DASHBOARD } from '../../../routes/paths';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import useSettings from '../../../hooks/useSettings';
import { QuickSearch } from '../../../components/tables';
import SnackAlert from '../../../components/general/SnackAlert';
import DialogConfirm from '../../../components/general/DialogConfirm';
import CreateObjective from '../../../components/objective/associate/Create';
import EditObjective from '../../../components/objective/associate/Edit';
import Filters from '../../../components/objective/Filters';

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

const Jss1 = styled('div')({
  width: '100%',
  border: '1px solid rgb(169,169,169)',
  height: '26px',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: '2px'
});

const Jss2 = styled('div')({
  width: '100%',
  display: 'flex',
  position: 'absolute',
  lineHeight: '24px',
  justifyContent: 'center',
  color: '1px solid rgb(169,169,169)'
});

export default function Objective() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { objectives, objective, isLoading } = useSelector((state) => state.objective);
  const [openForm, setOpenForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState([]);
  const [taskId, setTaskId] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [quarter, setQuarter] = useState(moment().quarter());
  const [year, setYear] = useState(moment().format('YYYY'));

  useEffect(() => {
    dispatch(getObjectivesAssociate(year, quarter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const getIcon = (approved) => {
    if (approved === 1) {
      return <TaskAltOutlined color={'success'} fontSize={'small'} style={{ marginTop: '10px' }} />;
    }
    return <AccessTimeOutlined color={'warning'} fontSize={'small'} style={{ marginTop: '10px' }} />;
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Nombre',
      width: 150,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 90,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>,
      renderCell: (params) => (
        <div>
          <Tooltip
            title={
              // eslint-disable-next-line no-nested-ternary
              params.row.approved === 1 ? 'Objetivo aceptado' : 'En espera de ser aceptada'
            }
            aria-label="add"
          >
            {getIcon(params.row.approved)}
          </Tooltip>
        </div>
      )
    },
    {
      field: 'weighing',
      headerName: 'Ponderacion',
      width: 120,
      renderCell: (params) => {
        const avg = params.row.weighing;
        return (
          <Jss1>
            <Jss2>{avg > 0 ? avg : 0}</Jss2>
            <div style={{ height: '100%', maxWidth: `${avg > 0 ? avg : 0}%`, backgroundColor: 'rgb(206, 198, 197)' }} />
          </Jss1>
        );
      }
    },
    {
      field: 'progress',
      headerName: 'Avance',
      width: 120,
      renderCell: (params) => {
        const avg = params.row.progress;
        return (
          <Jss1>
            <Jss2>{avg > 0 ? avg : 0}%</Jss2>
            <div style={{ height: '100%', maxWidth: `${avg > 0 ? avg : 0}%`, backgroundColor: 'rgb(206, 198, 197)' }} />
          </Jss1>
        );
      }
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
          setTaskId(params.row.id);
          setOpenConfirm(true);
          setCanDelete(params.row.approved === 0);
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
                  disabled={params.row.approved === 1}
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
    const filteredRows = objectives.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  const handleCloseForm = () => {
    dispatch(clearDataObjective());
    setOpenForm(false);
  };

  const handleCloseEdit = () => {
    dispatch(clearDataObjective());
    setOpenEdit(false);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setCanDelete(false);
  };

  const handleCloseAccept = () => {
    if (!canDelete) {
      setOpenConfirm(false);
    } else {
      dispatch(deleteObj());
      setOpenConfirm(false);
    }
  };

  const handleCallbackForm = (values, files) => {
    dispatch(createObj(values, files));
  };

  const handleCallback = (values) => {
    dispatch(getObjectivesAssociate(moment(values.year).format('YYYY'), values.quarter));
    setYear(moment(values.year).format('YYYY'));
    setQuarter(values.quarter);
  };

  const handleCallbackEdit = (id, values) => {
    dispatch(updateObj(id, values));
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  function createObj(values, files) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(
          dispatch(
            createObjective(
              values.name,
              values.description,
              values.weighing,
              moment(values.year).format('YYYY'),
              values.quarter,
              files,
              values.progress
            )
          )
        );
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Objetivo creado' : 'Ocurro algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          dispatch(getObjectivesAssociate(year, quarter));
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

  function updateObj(id, values) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(
          dispatch(
            updateByAssociate(
              true,
              id,
              values.name,
              values.description,
              values.weighing,
              moment(values.year).format('YYYY'),
              values.quarter,
              values.approved,
              values.progress
            )
          )
        );
      })
        .then((response) => {
          dispatch(getObjectivesAssociate(year, quarter));
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

  function deleteObj() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(destroy(taskId)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Objetivo eliminado' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          dispatch(getObjectivesAssociate(year, quarter));
          setTaskId(0);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  const addFilesObj = (id, files) => {
    dispatch(newFiles(id, files));
  };

  const deleteFileObj = (id, name, aFiles) => {
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
          dispatch(getObjectiveAssociate(id));
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
          dispatch(getObjectiveAssociate(id));
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
    <Page title="Objetivos">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Objetivos"
          links={[{ name: '', href: PATH_DASHBOARD.root }]}
          action={
            <Button variant="contained" onClick={handleOpenForm} startIcon={<Icon icon={plusFill} />}>
              Nuevo Objetivo
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
                  rows={rows.length > 0 ? rows : objectives}
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
                    dispatch(getObjectiveAssociate(params.row.id));
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
        title={canDelete ? 'Eliminar objetivo' : 'No de puede eliminar'}
        body={canDelete ? 'Desea eliminar este objetivo' : 'El objetivo no puede ser eliminada. Ya ha sido aceptado'}
        agree={handleCloseAccept}
      />
      <CreateObjective open={openForm} close={handleCloseForm} parentCallback={handleCallbackForm} />
      <EditObjective
        open={openEdit}
        close={handleCloseEdit}
        parentCallback={handleCallbackEdit}
        objective={objective}
        uploadFiles={addFilesObj}
        deleteFile={deleteFileObj}
        downloadFile={downloadFile}
        isLoading={isLoading}
      />
    </Page>
  );
}
