import { useState, useEffect } from 'react';
// material
import { Container, Card, Button, Tooltip } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import IconButton from '@mui/material/IconButton';
import { Delete, RestoreFromTrash } from '@mui/icons-material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getProjects,
  getProject,
  clearDataProject,
  create,
  update,
  restoreProject,
  destroy
} from '../../redux/slices/project';
// components
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import { QuickSearch } from '../../components/tables';
import ProjectForm from '../../components/project/ProjectForm';
import SnackAlert from '../../components/general/SnackAlert';
import DialogConfirm from '../../components/general/DialogConfirm';

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

export default function Project() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { projects, project, isLoading } = useSelector((state) => state.project);
  const [openForm, setOpenForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const [modeUpdate, setModeUpdate] = useState(false);
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
      flex: 1,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'project_number',
      headerName: 'Numero',
      flex: 0.3,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
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
          setRestore(false);
          setOpenConfirm(true);
          setTitleDialog('Eliminar proyecto');
          setBodyDialog('Desea eliminar el registro?');
          setId(params.row.id);
        };
        const onClickRestore = (e) => {
          e.stopPropagation();
          setOpenConfirm(true);
          setRestore(true);
          setTitleDialog('Recuperar proyecto');
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

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = projects.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  const handleCloseForm = () => {
    dispatch(clearDataProject());
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setModeUpdate(false);
    setOpenForm(true);
  };

  const handleUpdate = (id, name, description, number) => {
    setOpenForm(false);
    dispatch(updateProject(id, name, description, number));
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  function createProject(name, description, number) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(create(name, description, number)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Proyecto creado' : 'Ocurro algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          dispatch(getProjects());
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

  function updateProject(id, name, description, number) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(update(id, name, description, number)));
      })
        .then((response) => {
          dispatch(getProjects());
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

  function restoreP() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(restoreProject(id)));
      })
        .then((response) => {
          dispatch(getProjects());
          setMessage(response.status === 200 ? 'Proyecto activado' : 'Ocurrio algun error');
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

  function deleteP() {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(destroy(id)));
      })
        .then((response) => {
          dispatch(getProjects());
          setMessage(response.status === 200 ? 'Proyecto eliminado' : 'Ocurrio algun error');
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

  const handleCallbackForm = (values) => {
    dispatch(createProject(values.name, values.description, values.number));
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const handleCloseAccept = () => {
    if (restore) {
      dispatch(restoreP(id));
    } else {
      dispatch(deleteP(id));
    }
    setOpenConfirm(false);
  };

  return (
    <Page title="Proyectos">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Proyectos"
          links={[{ name: '', href: PATH_DASHBOARD.root }]}
          action={
            <Button variant="contained" onClick={handleOpenForm} startIcon={<Icon icon={plusFill} />}>
              Nuevo Proyecto
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
                  rows={rows.length > 0 ? rows : projects}
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
                    dispatch(getProject(params.row.id));
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
      <ProjectForm
        open={openForm}
        close={handleCloseForm}
        parentCallback={handleCallbackForm}
        project={project}
        update={modeUpdate}
        updateProject={handleUpdate}
      />
      <DialogConfirm
        open={openConfirm}
        close={handleCloseConfirm}
        title={titleDialog}
        body={bodyDialog}
        agree={handleCloseAccept}
      />
    </Page>
  );
}
