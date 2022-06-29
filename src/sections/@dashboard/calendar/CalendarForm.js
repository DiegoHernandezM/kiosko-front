import PropTypes from 'prop-types';
import moment from 'moment';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions } from '@mui/material';
import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
// redux
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFSwitch } from '../../../components/hook-form';

// ----------------------------------------------------------------------
const getInitialValues = (event, range) => {
  const _event = {
    title: '',
    description: '',
    all_day: false,
    start: range ? range.start : new Date(),
    end: range ? range.end : new Date()
  };
  if (event || range) {
    return merge({}, _event, event);
  }
  return _event;
};

// ----------------------------------------------------------------------

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
  isAssociate: PropTypes.bool
};

export default function CalendarForm({ event, range, onCancel, isAssociate }) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const isCreating = Object.keys(event).length === 0;
  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('El titulo es requerido'),
    description: Yup.string().max(5000).required('La descripcion es requerida')
  });
  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event, range)
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  const onSubmit = async (data) => {
    try {
      const newEvent = {
        title: data.title,
        description: data.description,
        textColor: data.textColor,
        all_day: data.all_day,
        start: moment(data.start).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(data.end).format('YYYY-MM-DD HH:mm:ss')
      };
      if (event.id) {
        dispatch(updateEvent(event.id, newEvent));
        enqueueSnackbar('Actualizacion realizada');
      } else {
        enqueueSnackbar('Evento creado');
        dispatch(createEvent(newEvent));
      }
      onCancel();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!event.id) return;
    try {
      onCancel();
      dispatch(deleteEvent(event.id));
      enqueueSnackbar('Evento eliminado');
    } catch (error) {
      console.error(error);
    }
  };

  const values = watch();

  const isDateError = isBefore(new Date(values.end), new Date(values.start));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="title" label="Titulo" />
        <RHFTextField name="description" label="Descripcion" multiline rows={4} />
        <RHFSwitch name="all_day" label="Todo el dia" />
        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              label="Inicio"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          )}
        />
        <Controller
          name="end"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              label="Fin"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!isDateError}
                  helperText={isDateError && 'Fin no puede ser anterior al inicio del evento'}
                />
              )}
            />
          )}
        />
      </Stack>

      <DialogActions>
        {!isCreating && !isAssociate ? (
          <Tooltip title="Eliminar evento">
            <IconButton onClick={handleDelete}>
              <Iconify icon="eva:trash-2-outline" width={20} height={20} />
            </IconButton>
          </Tooltip>
        ) : null}
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancelar
        </Button>
        {!isAssociate ? (
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
            Guardar
          </LoadingButton>
        ) : null}
      </DialogActions>
    </FormProvider>
  );
}
