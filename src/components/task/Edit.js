import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// material
import {
  Box,
  Button,
  Drawer,
  FormControl,
  TextField,
  Typography,
  Tooltip,
  Divider,
  IconButton,
  MenuItem
} from '@mui/material';
import { useFormik } from 'formik';
import { DataGrid, esES } from '@mui/x-data-grid';
import { Delete, CloudDownload, Close } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
// components
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DialogConfirm from '../general/DialogConfirm';
import UploadDialog from './Upload';
// ----------------------------------------------------------------------

const HOURS = [
  { value: 1, label: '1 hr' },
  { value: 2, label: '2 hrs' },
  { value: 3, label: '3 hrs' },
  { value: 4, label: '4 hrs' },
  { value: 5, label: '5 hrs' },
  { value: 6, label: '6 hrs' },
  { value: 7, label: '7 hrs' },
  { value: 8, label: '8 hrs' }
];

EditTask.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any,
  task: PropTypes.object,
  uploadFiles: PropTypes.func,
  deleteFile: PropTypes.func,
  downloadFile: PropTypes.func
};

const filters = {
  pinter: {
    cursor: 'pointer',
    marginLeft: '5px',
    textAlign: 'center'
  }
};

export default function EditTask({ open, close, parentCallback, task, uploadFiles, deleteFile, downloadFile }) {
  const [openUpload, setOpenUpload] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [arrayFiles, setArrayFiles] = useState([]);
  const [nameFile, setNameFile] = useState('');
  const formik = useFormik({
    initialValues: {
      id: 0,
      name: '',
      description: '',
      files: [],
      day: null,
      hours: 1
    },
    onSubmit: (values, { resetForm }) => {
      parentCallback(task.id, values);
      resetForm(formik.initialValues);
    }
  });

  const closeUpload = () => {
    setOpenUpload(false);
  };

  useEffect(() => {
    formik.setFieldValue('id', task.id ?? formik.initialValues.name);
    formik.setFieldValue('name', task.name ?? formik.initialValues.name);
    formik.setFieldValue('description', task.task_description ?? formik.initialValues.description);
    formik.setFieldValue('day', task.task_day ?? formik.initialValues.day);
    formik.setFieldValue('hours', task.hours ?? formik.initialValues.hours);
    formik.setFieldValue('files', task.files ?? formik.initialValues.files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task]);

  const columns = [
    {
      field: 'original',
      headerName: 'Nombre',
      flex: 1,
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
          setOpenDelete(true);
          const array = [...formik.values.files];
          const index = array.findIndex((x) => x === params.row);
          array.splice(index, 1);
          setNameFile(params.row.name);
          setArrayFiles(array);
        };
        const onClickDownload = (e) => {
          e.stopPropagation();
          downloadFile(params.row.name, params.row.original);
        };
        return [
          <Tooltip key={`re-${params.row.name}`} title="Eliminar">
            <div>
              <IconButton
                disabled={task.status > 1}
                onClick={onClickDelete}
                key={`re-${params.row.name}`}
                type="button"
                color="primary"
                style={filters.pinter}
              >
                <Delete />
              </IconButton>
            </div>
          </Tooltip>,
          <Tooltip key={`dw-${params.row.name}`} title="Descargar">
            <CloudDownload
              onClick={onClickDownload}
              key={`dw-${params.row.name}`}
              type="button"
              color="primary"
              style={filters.pinter}
            />
          </Tooltip>
        ];
      }
    }
  ];

  const handleOpenUpload = () => {
    setOpenUpload(true);
  };

  const handleUploadNewFiles = (values) => {
    uploadFiles(formik.values.id, values);
    setOpenUpload(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleCloseDelet = () => {
    deleteFile(formik.values.id, nameFile, arrayFiles);
    setOpenDelete(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={close}>
      <Box sx={{ width: { xs: '375px', md: '500px', xl: '600px' } }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
          <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="h4" style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '30px' }}>
                Actualizar
              </Typography>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                style={{
                  borderRadius: 30,
                  height: '30px',
                  marginTop: '10px',
                  marginLeft: '10px',
                  marginBottom: '30px'
                }}
                disabled={moment().startOf('week').add(1, 'days').isAfter(moment(task.created_at))}
                size="small"
              >
                Actualizar Actividad
              </Button>
              <IconButton
                aria-label="close"
                onClick={close}
                sx={{
                  color: (theme) => theme.palette.grey[500]
                }}
                style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '30px' }}
              >
                <Close />
              </IconButton>
            </Box>
            <FormControl style={{ marginLeft: '10px', width: '90%' }}>
              <DatePicker
                label="Fecha"
                minDate={new Date(moment().startOf('week').add(1, 'days'))}
                maxDate={new Date(moment().endOf('week').subtract(1, 'days'))}
                renderInput={(params) => <TextField size="small" {...params} />}
                id="day"
                name="day"
                value={moment(formik.values.day)}
                onChange={(value) => formik.setFieldValue('day', value)}
                helperText={formik.touched.day && formik.errors.day}
              />
            </FormControl>
            <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
              <TextField
                id="name"
                name="name"
                label="Nombre"
                value={formik.values.name || ''}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                size="small"
              />
            </FormControl>
            <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
              <TextField
                id="description"
                name="description"
                label="Descipcion"
                multiline
                value={formik.values.description || ''}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                fullWidth
                helperText={formik.touched.description && formik.errors.description}
                size="small"
              />
            </FormControl>
            <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
              <TextField
                id="hours"
                name="hours"
                label="Horas"
                onChange={formik.handleChange}
                value={formik.values.hours || ''}
                select
                error={formik.touched.hours && Boolean(formik.errors.hours)}
                fullWidth
                helperText={formik.touched.hours && formik.errors.hours}
                size="small"
              >
                {HOURS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="h5" style={{ marginTop: '10px', marginLeft: '10px' }}>
                Archivos
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                type="button"
                style={{ borderRadius: 30, height: '30px', marginTop: '20px', marginRight: '10px' }}
                size="small"
                onClick={handleOpenUpload}
                disabled={moment().startOf('week').add(1, 'days').isAfter(moment(task.created_at))}
              >
                Agregar archivos
              </Button>
            </Box>
            <div style={{ height: 300, width: '100%' }}>
              <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ flexGrow: 1 }}>
                  <DataGrid
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    componentsProps={{
                      toolbar: {
                        export: false,
                        columns: false,
                        density: false
                      }
                    }}
                    rowsPerPageOptions={[10]}
                    rows={formik.values.files ?? []}
                    columns={columns}
                    rowHeight={40}
                    pageSize={10}
                  />
                </div>
              </div>
            </div>
            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
          </form>
        </LocalizationProvider>
      </Box>
      <UploadDialog open={openUpload} close={closeUpload} upload={handleUploadNewFiles} />
      <DialogConfirm
        open={openDelete}
        close={handleCloseDelete}
        title={'Eliminar archivo'}
        body={'Desea eliminar este archivo?'}
        agree={handleCloseDelet}
      />
    </Drawer>
  );
}
