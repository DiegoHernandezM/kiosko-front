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
  MenuItem,
  Slider,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import { useFormik } from 'formik';
import { DataGrid, esES } from '@mui/x-data-grid';
import { Delete, CloudDownload, Close } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
// components
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DialogConfirm from '../../general/DialogConfirm';
import UploadDialog from '../../task/Upload';
// ----------------------------------------------------------------------

EditObjective.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any,
  objective: PropTypes.object,
  uploadFiles: PropTypes.func,
  deleteFile: PropTypes.func,
  downloadFile: PropTypes.func,
  isLoading: PropTypes.bool
};

const filters = {
  pinter: {
    cursor: 'pointer',
    marginLeft: '5px',
    textAlign: 'center'
  }
};

const QUARTERS = [
  { value: 1, label: 'ENERO - MARZO' },
  { value: 2, label: 'ABRIL - JUNIO' },
  { value: 3, label: 'JULIO - SEPTIEMBRE' },
  { value: 4, label: 'OCTUBRE - DICIEMBRE' }
];

const marks = [
  {
    value: 0,
    label: '0 %'
  },
  {
    value: 100,
    label: '100 %'
  }
];

export default function EditObjective({
  open,
  close,
  parentCallback,
  objective,
  uploadFiles,
  deleteFile,
  downloadFile,
  isLoading
}) {
  const [openUpload, setOpenUpload] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [arrayFiles, setArrayFiles] = useState([]);
  const [nameFile, setNameFile] = useState('');
  const formik = useFormik({
    initialValues: {
      id: 0,
      name: '',
      description: '',
      evidence: [],
      year: new Date(),
      quarter: '',
      weighing: 0
    },
    onSubmit: (values, { resetForm }) => {
      parentCallback(objective.id, values);
      resetForm(formik.initialValues);
    }
  });

  const closeUpload = () => {
    setOpenUpload(false);
  };

  useEffect(() => {
    formik.setFieldValue('id', objective.id ?? formik.initialValues.name);
    formik.setFieldValue('name', objective.name ?? formik.initialValues.name);
    formik.setFieldValue('description', objective.description ?? formik.initialValues.description);
    formik.setFieldValue('year', moment(`01-01-${objective.year + 1}`).format('YYYY') ?? formik.initialValues.year);
    formik.setFieldValue('quarter', objective.quarter ?? formik.initialValues.quarter);
    formik.setFieldValue('weighing', objective.weighing ?? formik.initialValues.weighing);
    formik.setFieldValue('evidence', objective.evidence ?? formik.initialValues.evidence);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objective]);

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
          const array = [...formik.values.evidence];
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
                disabled={objective.status > 1}
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

  const valuetext = (value) => `${value}%`;

  return (
    <Drawer anchor="right" open={open} onClose={close}>
      <Box sx={{ width: { xs: '100%', md: '500px', xl: '600px' } }}>
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
                Actualizar Objetivo
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
                disabled={moment().startOf('week').add(1, 'days').isAfter(moment(objective.created_at))}
                size="small"
              >
                Actualizar Objetivo
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
            <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
              <DatePicker
                id="year"
                name="year"
                views={['year']}
                minDate={new Date()}
                label="Año"
                value={formik.values.year || null}
                onChange={(value) => formik.setFieldValue('year', value)}
                renderInput={(params) => <TextField size="small" {...params} helperText={null} />}
              />
            </FormControl>
            <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
              <TextField
                id="quarter"
                name="quarter"
                label="Trimestre"
                onChange={formik.handleChange}
                value={formik.values.quarter}
                select
                fullWidth
                size="small"
                error={formik.touched.quarter && Boolean(formik.errors.quarter)}
                helperText={formik.touched.quarter && formik.errors.quarter}
              >
                {QUARTERS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
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
            <FormControl style={{ marginLeft: '50px', marginTop: '8px', width: '80%' }}>
              <Typography variant="body">Ponderacion</Typography>
              <Slider
                id="weighing"
                name="weighing"
                aria-label="Ponderacion"
                getAriaValueText={valuetext}
                onChange={(value) => formik.setFieldValue('weighing', value.target.value)}
                valueLabelDisplay="auto"
                value={formik.values.weighing}
                step={10}
                marks={marks}
                min={0}
                max={100}
              />
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
                disabled={moment().startOf('week').add(1, 'days').isAfter(moment(objective.created_at))}
              >
                Agregar archivos
              </Button>
            </Box>
            <div style={{ height: 300, width: '100%' }}>
              <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ flexGrow: 1 }}>
                  <DataGrid
                    loading={isLoading}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    componentsProps={{
                      toolbar: {
                        export: false,
                        columns: false,
                        density: false
                      }
                    }}
                    rowsPerPageOptions={[10]}
                    rows={formik.values.evidence ?? []}
                    columns={columns}
                    rowHeight={40}
                    pageSize={10}
                  />
                </div>
              </div>
            </div>
            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
            <Typography
              variant="h5"
              style={{
                marginTop: '10px',
                marginLeft: '10px',
                display: objective.observation !== null ? 'block' : 'none'
              }}
            >
              Revisión
            </Typography>
            <FormControl
              style={{
                marginLeft: '10px',
                marginTop: '9px',
                width: '90%',
                display: objective.observation !== null ? 'block' : 'none'
              }}
            >
              <TextField
                id="observation"
                disabled
                name="observation"
                label="Observacion"
                value={objective.observation || ''}
                fullWidth
                size="small"
              />
            </FormControl>
            <FormControl
              style={{
                marginLeft: '10px',
                marginTop: '9px',
                width: '90%',
                display: objective.real_weighing !== null ? 'block' : 'none'
              }}
            >
              <OutlinedInput
                id="real_weighing"
                disabled
                name="real_weighing"
                size="small"
                fullWidth
                value={objective.real_weighing || '0'}
                endAdornment={<InputAdornment position="end">% Ponderacion</InputAdornment>}
              />
            </FormControl>
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
