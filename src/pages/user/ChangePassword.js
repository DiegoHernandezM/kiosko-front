import PropTypes from 'prop-types';
import { React, useState } from 'react';
// material
import { Box, Drawer, Button, TextField, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
// components
ChangePassword.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  changePassword: PropTypes.func
};
const initialState = {
  newPassword: '',
  newPasswordConfirmation: '',
  oldPassword: ''
};
export default function ChangePassword({ open, close, changePassword }) {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState(false);
  const handleChange = (event) => {
    setMessage('');
    setErrors(false);
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = () => {
    if (form.newPassword === form.newPasswordConfirmation) {
      changePassword(form.oldPassword, form.newPassword, form.newPasswordConfirmation);
      clearData();
    } else {
      setMessage('Las contraseñas no coinciden');
      setErrors(true);
    }
  };

  const clearData = () => {
    setForm(initialState);
    close();
  };

  return (
    <Drawer anchor="right" open={open} onClose={clearData}>
      <Box sx={{ width: { xs: '375px', md: '500px', lg: '500px', xl: '600px' } }}>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h4" style={{ marginTop: '10px', marginLeft: '10px', marginBottom: '30px' }}>
            Actualizar contraseña
          </Typography>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ borderRadius: 30, height: '30px', marginTop: '20px', marginRight: '10px' }}
            onClick={handleSubmit}
            size="small"
          >
            Actualizar
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
        <Box style={{ marginLeft: '10px', marginRight: '10px' }}>
          <TextField
            name="oldPassword"
            required
            autoFocus
            label="Antigua Contraseña"
            margin="normal"
            variant="outlined"
            fullWidth
            value={form.oldPassword}
            onChange={handleChange}
          />
          <TextField
            name="newPassword"
            required
            label="Nueva Contraseña"
            margin="normal"
            variant="outlined"
            fullWidth
            value={form.newPassword}
            onChange={handleChange}
            error={errors}
            helperText={message}
          />
          <TextField
            name="newPasswordConfirmation"
            required
            label="Confirmar contraseña"
            margin="normal"
            variant="outlined"
            fullWidth
            value={form.newPasswordConfirmation}
            onChange={handleChange}
            error={errors}
            helperText={message}
          />
        </Box>
      </Box>
    </Drawer>
  );
}
