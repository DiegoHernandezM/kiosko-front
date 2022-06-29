import { forwardRef, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Button, DialogTitle, DialogContent, Grid, Card, Stack, DialogActions, Dialog, Slide } from '@mui/material';
import UploadMultiFile from '../upload/UploadMultiFile';
// ----------------------------------------------------------------------

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

UploadDialog.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  upload: PropTypes.func
};

export default function UploadDialog({ open, close, upload }) {
  const [files, setFiles] = useState([]);

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

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleRemove = (file) => {
    const filteredItems = files.filter((_file) => _file !== file);
    setFiles(filteredItems);
  };

  const handleUpdate = () => {
    upload(files);
    setFiles([]);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={close}
      aria-describedby="alert-dialog-slide-description"
      fullWidth
      maxWidth={'sm'}
    >
      <DialogTitle>{'AGREGAR ARCHIVOS'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <UploadMultiFile
                  files={files}
                  onDrop={handleDropMultiFile}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancelar</Button>
        <Button onClick={handleUpdate} type="button">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
