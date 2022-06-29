import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogTitle, Stack, Typography } from '@mui/material';

DialogAlert.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  title: PropTypes.string,
  body: PropTypes.string
};

export default function DialogAlert({ open, close, title, body }) {
  return (
    <Dialog open={open} fullWidth maxWidth="xs" onClose={close}>
      <DialogTitle>{title}</DialogTitle>
      <Stack spacing={3} sx={{ p: 3, pb: 0 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <div>
            <Typography variant="subtitle2">{body}</Typography>
          </div>
        </Stack>
      </Stack>
      <DialogActions>
        <Button onClick={close}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
