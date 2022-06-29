import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
// material
import {
  Box,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { Close, CloudDownload } from '@mui/icons-material';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { DatePicker } from '@mui/lab';
import { DataGrid, esES } from '@mui/x-data-grid';

PetitionForm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  petition: PropTypes.object,
  update: PropTypes.bool,
  updatePetition: PropTypes.func,
  downloadFile: PropTypes.func
};

const validationSchema = yup.object({
  comment: yup.string('Comentarios').required('Comentarios son requeridos'),
  comment_by_admin: yup.string('Comentarios del admin').nullable()
});

const filters = {
  pinter: {
    cursor: 'pointer',
    marginLeft: '5px',
    textAlign: 'center'
  }
};

export default function PetitionForm({ open, close, petition, update, updatePetition, downloadFile }) {
  const [approvedP, setApprovedP] = useState(0);
  const [diffDays, setDiffDays] = useState(0);
  const formik = useFormik({
    initialValues: {
      date: moment().format('YYYY-MM-DD'),
      comment: '',
      approved: '',
      petition_description: '',
      comment_by_admin: ''
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      updatePetition(petition.id, values.comment, approvedP, values.comment_by_admin);
      resetForm(formik.initialValues);
      setApprovedP(0);
    }
  });

  useEffect(() => {
    formik.setFieldValue('date', update ? Date(petition.date) : formik.initialValues.date);
    formik.setFieldValue(
      'petition_description',
      update ? petition.petition_description : formik.initialValues.petition_description
    );
    formik.setFieldValue('comment', update ? petition.comment : formik.initialValues.comment);
    formik.setFieldValue('approved', update ? petition.approved : formik.initialValues.approved);
    formik.setFieldValue(
      'comment_by_admin',
      update ? petition.comment_by_admin : formik.initialValues.comment_by_admin
    );
    formik.setFieldValue('files', petition.files ?? formik.initialValues.files);
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
        const onClickDownload = (e) => {
          e.stopPropagation();
          downloadFile(params.row.name, params.row.original);
        };
        return [
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

  const onCloseDrawer = () => {
    close();
  };

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

  return (
    <Drawer anchor="right" open={open} onClose={onCloseDrawer}>
      <Box sx={{ width: { xs: '375px', md: '500px', xl: '600px' } }}>
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
              {update ? 'Aprobar peticion' : 'Nueva petición'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              style={{ borderRadius: 30, height: '30px', marginTop: '20px', marginRight: '10px' }}
              size="small"
            >
              {update ? 'Guardar' : 'Guardar'}
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
            <FormControlLabel
              control={
                <Switch
                  onChange={(e) => {
                    if (e.target.checked) {
                      setApprovedP(2);
                    } else {
                      setApprovedP(0);
                    }
                  }}
                />
              }
              label="Aprobar peticion"
            />
          </FormControl>
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
            <DatePicker
              label="Fecha de registro"
              disabled={update}
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
              value={petition.created_at || formik.values.date}
              onChange={(value) => formik.setFieldValue('date', value)}
            />
          </FormControl>
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
            <TextField
              id="petition_description"
              name="petition_description"
              label="Descripcion"
              disabled={update}
              onChange={formik.handleChange}
              value={formik.values.petition_description || ''}
              error={formik.touched.petition_description && Boolean(formik.errors.petition_description)}
              helperText={formik.touched.petition_description && formik.errors.petition_description}
              fullWidth
              size="small"
              variant="outlined"
            />
          </FormControl>
          {petition.petition_description === 'VACACIONES' ? (
            <>
              <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
                <DatePicker
                  id="date-vacation-start"
                  name="date-vacation-start"
                  label="Fecha inicio"
                  disabled
                  value={moment(petition.period[0]?.startDate)}
                  renderInput={(params) => <TextField {...params} size="small" error={null} />}
                  onChange={() => {
                    console.log('ok');
                  }}
                />
              </FormControl>
              <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
                <DatePicker
                  id="date-vacation-end"
                  name="date-vacation-end"
                  label="Fecha fin"
                  disabled
                  value={moment(petition.period[0]?.endDate)}
                  renderInput={(params) => <TextField {...params} size="small" error={null} />}
                  onChange={() => {
                    console.log('ok');
                  }}
                />
              </FormControl>
              <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
                <TextField
                  id="days"
                  name="days"
                  label="Dias de vacaciones"
                  disabled
                  value={petition.associate.vacations_available}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </FormControl>
              <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
                <TextField
                  id="days"
                  name="days"
                  label="Dias seleccionados"
                  disabled
                  value={diffDays}
                  fullWidth
                  size="small"
                />
              </FormControl>
            </>
          ) : (
            <></>
          )}
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
            <TextField
              id="comment"
              name="comment"
              label="Comentarios"
              disabled
              onChange={formik.handleChange}
              value={formik.values.comment || ''}
              error={formik.touched.comment && Boolean(formik.errors.comment)}
              helperText={formik.touched.comment && formik.errors.comment}
              fullWidth
              size="small"
              multiline
              rows={8}
              variant="outlined"
            />
          </FormControl>
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
            <TextField
              id="comment_by_admin"
              name="comment_by_admin"
              label="Comentarios del administrador"
              onChange={formik.handleChange}
              value={formik.values.comment_by_admin || ''}
              error={formik.touched.comment_by_admin && Boolean(formik.errors.comment_by_admin)}
              helperText={formik.touched.comment_by_admin && formik.errors.comment_by_admin}
              fullWidth
              size="small"
              multiline
              rows={8}
              variant="outlined"
            />
          </FormControl>
          <FormControl style={{ marginLeft: '10px', marginTop: '8px', width: '90%' }}>
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
          </FormControl>
        </form>
      </Box>
    </Drawer>
  );
}
