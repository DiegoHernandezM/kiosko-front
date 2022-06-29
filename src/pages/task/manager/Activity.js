import { useState, useEffect } from 'react';
import moment from 'moment';
// material
import { Container, Card, Tooltip, Box } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { CancelOutlined, AccessTimeOutlined, TaskAltOutlined } from '@mui/icons-material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getFile } from '../../../redux/slices/task';
import { getTasks, clearDataTask, getReportTask } from '../../../redux/slices/taskManager';
// components
import Page from '../../../components/Page';
import { PATH_DASHBOARD } from '../../../routes/paths';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import useSettings from '../../../hooks/useSettings';
import { QuickSearch } from '../../../components/tables';
import Detail from '../../../components/task/manager/Detail';
import Filters from '../../../components/task/manager/Filters';

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export default function Activity() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((state) => state.taskManager);
  const { projects } = useSelector((state) => state.project);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [rows, setRows] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [task, setTask] = useState({});
  const day = new Date(moment().startOf('week'));
  const [dayFilter, setDayFilter] = useState(day);

  useEffect(() => {
    dispatch(getTasks(day));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const getIcon = (status) => {
    switch (status) {
      case 1:
        return <TaskAltOutlined color={'success'} fontSize={'small'} style={{ marginTop: '10px' }} />;
      case 2:
        return <AccessTimeOutlined color={'warning'} fontSize={'small'} style={{ marginTop: '10px' }} />;
      default:
        return <CancelOutlined color={'error'} fontSize={'small'} style={{ marginTop: '10px' }} />;
    }
  };

  const getTitle = (status) => {
    switch (status) {
      case 1:
        return 'Actividad en tiempo';
      case 2:
        return 'Actividad fuera de tiempo';
      default:
        return 'Sin registro';
    }
  };

  const columns = [
    {
      field: 'asociate',
      headerName: 'Colaborador',
      width: 280,
      renderCell: (params) => `${params.row.name} ${params.row.lastnames}`,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'monday',
      headerName: 'Lunes',
      width: 90,
      renderCell: (params) => (
        <div>
          <Tooltip title={getTitle(params.row?.week.monday)} aria-label="add">
            {getIcon(params.row?.week.monday)}
          </Tooltip>
        </div>
      ),
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'tuesday',
      headerName: 'Martes',
      width: 90,
      renderCell: (params) => (
        <div>
          <Tooltip title={getTitle(params.row?.week.tuesday)} aria-label="add">
            {getIcon(params.row?.week.tuesday)}
          </Tooltip>
        </div>
      ),
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'wednesday',
      headerName: 'Miercoles',
      width: 90,
      renderCell: (params) => (
        <div>
          <Tooltip title={getTitle(params.row?.week.wednesday)} aria-label="add">
            {getIcon(params.row?.week.wednesday)}
          </Tooltip>
        </div>
      ),
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'thursday',
      headerName: 'Jueves',
      width: 90,
      renderCell: (params) => (
        <div>
          <Tooltip title={getTitle(params.row?.week.thursday)} aria-label="add">
            {getIcon(params.row?.week.thursday)}
          </Tooltip>
        </div>
      ),
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'friday',
      headerName: 'Viernes',
      width: 90,
      renderCell: (params) => (
        <div>
          <Tooltip title={getTitle(params.row?.week.friday)} aria-label="add">
            {getIcon(params.row?.week.friday)}
          </Tooltip>
        </div>
      ),
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    }
  ];

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = tasks.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  const handleCloseEdit = () => {
    dispatch(clearDataTask());
    setOpenEdit(false);
  };

  const handleCallback = (values) => {
    setDayFilter(moment(values.init).format('YYYY-MM-DD'));
    dispatch(getTasks(values.init));
  };

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
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function getExcel() {
    dispatch(getReportTask(dayFilter));
  }

  return (
    <Page title="Actividades">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Actividades" links={[{ name: '', href: PATH_DASHBOARD.root }]} />
      </Container>
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
            <Filters parentCallback={handleCallback} projects={projects} />
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
                  rows={rows.length > 0 ? rows : tasks}
                  columns={columns}
                  rowHeight={40}
                  componentsProps={{
                    toolbar: {
                      hideFooterPagination: false,
                      export: false,
                      columns: true,
                      density: true,
                      search: true,
                      customExport: true,
                      value: searchText,
                      onClick: () => getExcel(),
                      onChange: (event) => requestSearch(event.target.value),
                      clearSearch: () => requestSearch('')
                    }
                  }}
                  onRowDoubleClick={(params) => {
                    setTask(params.row);
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
      <Detail open={openEdit} close={handleCloseEdit} tasksAssociate={task} download={downloadFile} />
    </Page>
  );
}
