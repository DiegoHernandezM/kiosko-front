import { useState, useEffect } from 'react';
import moment from 'moment';
// material
import { Container, Card, Box } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getAssociates, updateByAssociate, getFile } from '../../../redux/slices/objective';
// components
import Page from '../../../components/Page';
import { PATH_DASHBOARD } from '../../../routes/paths';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import useSettings from '../../../hooks/useSettings';
import { QuickSearch } from '../../../components/tables';
import SnackAlert from '../../../components/general/SnackAlert';
import Filters from '../../../components/objective/Filters';
import Detail from '../../../components/objective/manager/Detail';

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export default function Objective() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { associates, isLoading } = useSelector((state) => state.objective);
  const [associate, setAssociate] = useState({});
  const [openDetail, setOpenDetail] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState([]);
  const [quarter, setQuarter] = useState(moment().quarter());
  const [year, setYear] = useState(moment().format('YYYY'));
  const [status, setStatus] = useState(true);

  useEffect(() => {
    dispatch(getAssociates(year, quarter, status));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const columns = [
    {
      field: 'asociate',
      headerName: 'Colaborador',
      flex: 0.4,
      renderCell: (params) => `${params.row.name} ${params.row.lastnames}`,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    },
    {
      field: 'objectives',
      headerName: 'No. Objetivos',
      flex: 0.4,
      renderCell: (params) => params.row.objectives.length,
      renderHeader: (p) => <strong style={{ overflow: 'visible' }}>{p.colDef.headerName}</strong>
    }
  ];

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = associates.filter((row) => Object.keys(row).some((field) => searchRegex.test(row[field])));
    setRows(filteredRows);
  };

  const handleClose = () => {
    setOpenDetail(false);
  };

  const handleCallback = (values) => {
    dispatch(getAssociates(values.year, values.quarter, values.approved));
    setYear(moment(values.year).format('YYYY'));
    setQuarter(values.quarter);
    setStatus(values.approved);
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const update = (id, values, objective) => {
    dispatch(updateObj(id, values, objective));
  };

  function updateObj(id, values, objective) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(
          dispatch(
            updateByAssociate(
              false,
              id,
              objective.name,
              objective.description,
              objective.weighing,
              objective.year,
              objective.quarter,
              values.approved,
              values.observation
            )
          )
        );
      })
        .then((response) => {
          dispatch(getAssociates(year, quarter, status));
          setMessage(response.status === 200 ? 'Actualizacion realizada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
          setOpenDetail(false);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
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
        })
        .catch((error) => {
          console.log(error);
        });
  }

  return (
    <Page title="Objetivos">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs heading="Objetivos" links={[{ name: '', href: PATH_DASHBOARD.root }]} />
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
                  rows={rows.length > 0 ? rows : associates}
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
                    setAssociate(params.row);
                    setOpenDetail(true);
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
      <Detail open={openDetail} close={handleClose} associate={associate} download={downloadFile} update={update} />
    </Page>
  );
}
