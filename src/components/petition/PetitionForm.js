/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// material
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  MenuItem,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { Close, CloudDownload, Delete } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { DataGrid, esES } from '@mui/x-data-grid';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import SnackAlert from '../general/SnackAlert';
import UploadMultiFile from '../upload/UploadMultiFile';
import DialogConfirm from '../general/DialogConfirm';
import UploadDialog from './Upload';

// ----------------------------------------------------------------------

PetitionForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  parentCallback: PropTypes.any,
  petition: PropTypes.object,
  associate: PropTypes.object,
  update: PropTypes.bool,
  updatePetition: PropTypes.func,
  uploadFiles: PropTypes.func,
  deleteFile: PropTypes.func,
  downloadFile: PropTypes.func,
  loading: PropTypes.bool
};

const TYPE = [
  { value: '', label: 'SELECCIONE' },
  { value: 'RETARDO', label: 'Retardo' },
  { value: 'FALTA', label: 'Falta' },
  { value: 'VACACIONES', label: 'Vacaciones' },
  { value: 'PERMISO', label: 'Permiso' },
  { value: 'OTRO', label: 'Otro' }
];

const validationSchema = yup.object({
  date: yup.string('Fecha').required('La fecha es requerida'),
  petition_description: yup.string('Descripcion').required('La descripcion es requerida'),
  comment: yup.string('Comentarios').required('Comentarios son requeridos')
});

const filters = {
  pinter: {
    cursor: 'pointer',
    marginLeft: '5px',
    textAlign: 'center'
  }
};

export default function PetitionForm({
  open,
  close,
  parentCallback,
  petition,
  associate,
  update,
  updatePetition,
  uploadFiles,
  deleteFile,
  downloadFile,
  loading
}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [diffDays, setDiffDays] = useState(0);
  const [hideDatePicker, setHideDatePicker] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const [helper, setHelper] = useState('');
  const [files, setFiles] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [arrayFiles, setArrayFiles] = useState([]);
  const [nameFile, setNameFile] = useState('');

  const formik = useFormik({
    initialValues: {
      id: 0,
      date: moment().format('YYYY-MM-DD'),
      petition_description: '',
      comment: '',
      approved: 1,
      associate_id: 0,
      start: '',
      end: '',
      days: 0,
      files: []
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!update) {
        if (values.petition_description === 'VACACIONES') {
          if (associate.vacations_available > values.days) {
            parentCallback(values, files);
            setHideDatePicker(false);
            setStartDate('');
            setEndDate('');
            setDiffDays(0);
            setFiles([]);
          } else {
            setMessage('Superas el numero de dias disponibles');
            setTypeMessage('error');
            setOpenMessage(true);
            setStartDate('');
            setEndDate('');
            setDiffDays(0);
          }
        } else {
          parentCallback(values, files);
          setHideDatePicker(false);
          setStartDate('');
          setEndDate('');
          setFiles([]);
        }
      } else {
        let period = null;
        if (values.start !== '') {
          period = [
            {
              startDate: moment(values.start).format('YYYY-MM-DD'),
              endDate: moment(values.end).format('YYYY-MM-DD'),
              days: diffDays
            }
          ];
        }
        updatePetition(
          petition.id,
          values.date,
          values.petition_description,
          values.comment,
          petition.approved_by,
          petition.associate_id,
          period
        );
      }
      resetForm(formik.initialValues);
    }
  });

  useEffect(() => {
    formik.setFieldValue('id', petition.id ?? formik.initialValues.id);
    formik.setFieldValue('date', update ? petition.date : formik.initialValues.date);
    formik.setFieldValue(
      'start',
      update && petition.period !== null ? petition.period?.[0].startDate : formik.initialValues.start
    );
    formik.setFieldValue(
      'end',
      update && petition.period !== null ? petition.period?.[0].endDate : formik.initialValues.end
    );
    formik.setFieldValue(
      'petition_description',
      update ? petition.petition_description : formik.initialValues.petition_description
    );
    formik.setFieldValue('comment', update ? petition.comment : formik.initialValues.comment);
    formik.setFieldValue('approved', update ? petition.approved : formik.initialValues.approved);
    formik.setFieldValue('associate_id', update ? petition.associate_id : formik.initialValues.associate_id);
    formik.setFieldValue('approved_by', update ? petition.approved_by : formik.initialValues.approved_by);
    formik.setFieldValue('comment_by_admin', update && petition.comment_by_admin);
    formik.setFieldValue('files', petition.files ?? formik.initialValues.files);
    setHideDatePicker(petition.period !== null);
    setDiffDays(
      petition.period !== null
        ? workingDays(
            moment(petition.period?.[0].startDate).format('YYYY-MM-DD'),
            moment(petition.period?.[0].endDate).format('YYYY-MM-DD')
          )
        : 0
    );
    if (update) {
      getHalfDay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, petition]);

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
                disabled={petition.approved === 0 || petition.approved === 2}
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

  const handleOnClose = () => {
    close();
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  function workingDays(dateFrom, dateTo) {
    const from = moment(dateFrom);
    const to = moment(dateTo);
    // eslint-disable-next-line no-var
    var days = 0;

    while (!from.isAfter(to)) {
      if (from.isoWeekday() !== 6 && from.isoWeekday() !== 7) {
        days++;
      }
      from.add(1, 'days');
    }
    return days;
  }

  function getHalfDay() {
    const fromDate = moment(petition.period?.[0].startDate);
    const toDate = moment(petition.period?.[0].endDate);
    const diff = toDate.diff(fromDate, 'days');
    let days = 0;
    const range = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < diff + 1; i++) {
      range.push(moment(petition.period?.[0].startDate).add(i, 'days'));
    }
    if (range.length > 0) {
      range.forEach((day) => {
        const dia = moment(day);
        if (dia.day() !== 6 && dia.day() !== 0) {
          if (dia.day() === 5) {
            days += 0.5;
          } else {
            days += 1;
          }
        }
      });
    }
    setDiffDays(days);
  }

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFiles]
  );

  const handleRemove = (file) => {
    const filteredItems = files.filter((_file) => _file !== file);
    setFiles(filteredItems);
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };

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

  const closeUpload = () => {
    setOpenUpload(false);
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleOnClose}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
        <Box sx={{ width: { xs: '100%', md: '500px', xl: '600px' } }}>
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
                {update ? (petition.approved === 2 ? 'Detalle' : 'Editar') : 'Nueva'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={petition.approved === 2}
                style={{ borderRadius: 30, height: '30px', marginTop: '20px', marginRight: '10px' }}
                size="small"
              >
                {update ? 'Actualizar Peticion' : 'Guardar'}
              </Button>
              <IconButton
                aria-label="close"
                onClick={handleOnClose}
                sx={{
                  color: (theme) => theme.palette.grey[500]
                }}
                style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '30px' }}
              >
                <Close />
              </IconButton>
            </Box>
            <FormControl style={{ marginLeft: '10px', marginTop: '10px', width: '95%' }}>
              <TextField
                id="petition_description"
                name="petition_description"
                disabled={petition.approved === 2}
                label="Tipo de peticion"
                onChange={(e, value) => {
                  formik.setFieldValue('petition_description', value.props.value);
                  if (value.props.value === 'VACACIONES') {
                    setHideDatePicker(true);
                  } else {
                    setHideDatePicker(false);
                    setStartDate('');
                    setEndDate('');
                  }
                }}
                value={formik.values.petition_description || ''}
                error={formik.touched.petition_description && Boolean(formik.errors.petition_description)}
                helperText={formik.touched.petition_description && formik.errors.petition_description}
                select
                fullWidth
                size="small"
              >
                {TYPE.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
            <FormControl style={{ marginLeft: '10px', marginTop: '10px', width: '95%' }}>
              <DatePicker
                label="Fecha de registro"
                disabled={formik.values.petition_description === 'VACACIONES' || petition.approved === 2}
                minDate={new Date(moment().subtract(1, 'days'))}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    helperText={formik.touched.date && formik.errors.date}
                    error={formik.touched.date && Boolean(formik.errors.date)}
                  />
                )}
                id="date"
                name="date"
                value={moment(formik.values.date)}
                onChange={(value) => {
                  formik.setFieldValue('date', value);
                }}
              />
            </FormControl>
            {hideDatePicker && (
              <>
                <FormControl style={{ textAlign: 'center', marginLeft: '10px', marginTop: '8px', width: '95%' }}>
                  <DatePicker
                    id="date-vacation-start"
                    name="date-vacation-start"
                    disabled={petition.approved === 2}
                    label="Fecha inicio"
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);

                      formik.setFieldValue('start', date);
                      if (endDate !== '') {
                        formik.setFieldValue(
                          'days',
                          workingDays(moment(date).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'))
                        );
                      }
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={moment.now()}
                    value={moment(formik.values.start)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        helperText={formik.touched.date && formik.errors.date}
                        error={formik.touched.date && Boolean(formik.errors.date)}
                      />
                    )}
                  />
                </FormControl>
                <FormControl style={{ textAlign: 'center', marginLeft: '10px', marginTop: '8px', width: '95%' }}>
                  <DatePicker
                    id="date-vacation-end"
                    name="date-vacation-end"
                    label="Fecha fin"
                    disabled={startDate === '' || petition.approved === 2}
                    selected={endDate}
                    onChange={(date) => {
                      const fromDate = moment(startDate);
                      const toDate = moment(date);
                      const diff = toDate.diff(fromDate, 'days');
                      let days = 0;
                      const range = [];
                      for (let i = 0; i < diff + 1; i++) {
                        range.push(moment(startDate).add(i, 'days'));
                      }
                      if (range.length > 0) {
                        range.forEach((day) => {
                          const dia = moment(day);
                          if (dia.day() !== 6 && dia.day() !== 0) {
                            if (dia.day() === 5) {
                              days += 0.5;
                            } else {
                              days += 1;
                            }
                          }
                        });
                      }
                      setDiffDays(days);
                      if (associate.vacations_available < days) {
                        setHelper('No puedes seleccionar mas dias de los disponibles');
                      }
                      setEndDate(date);
                      formik.setFieldValue('end', date);
                      if (startDate !== '') {
                        formik.setFieldValue(
                          'days',
                          workingDays(moment(startDate).format('YYYY-MM-DD'), moment(date).format('YYYY-MM-DD'))
                        );
                      }
                    }}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    value={moment(formik.values.end)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        helperText={formik.touched.endate && formik.errors.endDate}
                        error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                      />
                    )}
                  />
                </FormControl>
                <FormControl style={{ textAlign: 'center', marginLeft: '10px', marginTop: '8px', width: '95%' }}>
                  <TextField
                    id="days_availables"
                    name="days_availables"
                    label="Dias disponibles"
                    disabled
                    value={associate.vacations_available}
                    fullWidth
                    size="small"
                  />
                </FormControl>
                <FormControl style={{ textAlign: 'center', marginLeft: '10px', marginTop: '8px', width: '95%' }}>
                  <TextField
                    id="days"
                    name="days"
                    label="Dias seleccionados"
                    disabled
                    value={parseFloat(diffDays)}
                    fullWidth
                    error={associate.vacations_available < diffDays}
                    helperText={helper}
                    size="small"
                  />
                </FormControl>
              </>
            )}
            <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '95%' }}>
              <TextField
                id="comment"
                name="comment"
                label="Comentarios"
                disabled={petition.approved === 2}
                onChange={formik.handleChange}
                value={formik.values.comment || ''}
                error={formik.touched.comment && Boolean(formik.errors.comment)}
                helperText={formik.touched.comment && formik.errors.comment}
                fullWidth
                size="small"
                multiline
                rows={6}
                variant="outlined"
              />
            </FormControl>
            <div hidden={!update}>
              <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '95%' }}>
                <TextField
                  id="comment-by-admin"
                  name="comment-by-admin"
                  label="Comentarios del administrador"
                  disabled
                  value={formik.values.comment_by_admin || ''}
                  fullWidth
                  size="small"
                  multiline
                  rows={6}
                  variant="outlined"
                />
              </FormControl>
            </div>
            {!update ? (
              <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '95%' }}>
                <UploadMultiFile
                  files={files}
                  onDrop={handleDropMultiFile}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </FormControl>
            ) : (
              <></>
            )}
            {update ? (
              <div>
                {' '}
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
                    disabled={petition.approved === 0 || petition.approved === 2}
                  >
                    Agregar archivos
                  </Button>
                </Box>
                <div style={{ height: 300, width: '100%' }}>
                  <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                      <DataGrid
                        loading={loading}
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
              </div>
            ) : (
              <></>
            )}
          </form>
          <SnackAlert message={message} type={typeMessage} open={openMessage} close={handleCloseMessage} />
        </Box>
      </LocalizationProvider>
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
