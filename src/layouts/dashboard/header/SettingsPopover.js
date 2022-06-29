import { useState } from 'react';
// @mui
import { Divider, Typography, Stack } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import SettingMode from '../../../components/settings/SettingMode';
import SettingColorPresets from '../../../components/settings/SettingColorPresets';
import SettingStretch from '../../../components/settings/SettingStretch';
import SettingFullscreen from '../../../components/settings/SettingFullscreen';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButtonAnimate color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <SettingsIcon width={20} height={20} />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 250, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 2, pr: 1, pl: 2.5 }}>
          <Typography variant="subtitle1">Configuración</Typography>
          <div>
            <IconButtonAnimate onClick={handleClose}>
              <Iconify icon={'eva:close-fill'} width={20} height={20} />
            </IconButtonAnimate>
          </div>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ flexGrow: 1 }}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">MODO</Typography>
              <SettingMode />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">COLOR</Typography>
              <SettingColorPresets />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">ESPACIAMIENTO</Typography>
              <SettingStretch />
            </Stack>

            <SettingFullscreen />
          </Stack>
        </Scrollbar>
      </MenuPopover>
    </>
  );
}
