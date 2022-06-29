import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Dialog, DialogActions, DialogTitle, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  isLoading: PropTypes.bool,
  close: PropTypes.func,
  title: PropTypes.string,
  body: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  verifyPassword: PropTypes.bool,
  error: PropTypes.bool
};

export default function ConfirmDialog({ open, close, title, body, onConfirm, verifyPassword, error, isLoading }) {
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirm = () => {
    onConfirm(password);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={close}>
      <DialogTitle>{title}</DialogTitle>
      <Stack spacing={3} sx={{ p: 3, pb: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <div>
            <Typography variant="subtitle2">{body}</Typography>
            {verifyPassword === true ? (
              <form>
                <TextField
                  value={password}
                  error={error}
                  onChange={handleChange}
                  helperText={error === true ? 'Contraseña inválida.' : null}
                  id="filled-password-input"
                  label="Contraseña"
                  type="password"
                  autoComplete="current-password"
                  variant="filled"
                />
              </form>
            ) : null}
          </div>
        </Stack>
      </Stack>
      <DialogActions>
        <LoadingButton loading={isLoading} onClick={handleConfirm} variant="outlined" color="primary">
          Confirmar
        </LoadingButton>
        <Button onClick={close} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
