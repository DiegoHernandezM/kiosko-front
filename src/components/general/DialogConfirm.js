import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';

DialogConfirm.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  title: PropTypes.string,
  body: PropTypes.string,
  agree: PropTypes.func
};

export default function DialogConfirm({ open, close, title, body, agree }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <div>
      <Dialog fullScreen={fullScreen} open={open} onClose={close} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{body}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={close}>
            Cancelar
          </Button>
          <Button onClick={agree} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
