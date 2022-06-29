import * as React from 'react';
import { Snackbar, Alert, Stack } from '@mui/material';
import PropTypes from 'prop-types';

SnackAlert.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  type: PropTypes.string,
  close: PropTypes.func
};

export default function SnackAlert({ open, message, type, close }) {
  const [state] = React.useState({
    vertical: 'bottom',
    horizontal: 'center'
  });
  const { vertical, horizontal } = state;

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        autoHideDuration={6000}
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={close}
        key={vertical + horizontal}
      >
        <Alert onClose={close} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
