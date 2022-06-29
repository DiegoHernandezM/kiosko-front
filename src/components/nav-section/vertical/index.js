import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { List, Box, ListSubheader } from '@mui/material';
//
import { NavListRoot } from './NavList';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter
    })
  })
);

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array
};

export default function NavSectionVertical({ navConfig, isCollapse = false, ...other }) {
  const [index, setIndex] = useState(null);
  const { user } = useAuth();
  useEffect(() => {
    if (user.permissions.filter((obj) => obj.name === 'manager').length > 0) {
      const parseItem = navConfig.map((value) => value);
      parseItem.map((list, index) => {
        if (list.subheader === 'app') {
          setIndex(index);
          navConfig.splice(index, 1);
        }
        return list;
      });
    }
    if (user.permissions.filter((obj) => obj.name === 'associate').length > 0) {
      const parseItem = navConfig.map((value) => value);
      parseItem.map((list, index) => {
        if (list.subheader === 'administración') {
          setIndex(index);
          navConfig.splice(index, 1);
        }
        if (list.subheader === 'general') {
          list.items.map((item, i) => {
            if (item.title === 'dashboard') {
              list.items.splice(i, 1);
            }
            return item;
          });
        }
        return list;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box {...other}>
      {navConfig.map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 2 }}>
          <ListSubheaderStyle
            sx={{
              ...(isCollapse && {
                opacity: 0
              })
            }}
          >
            {group.subheader}
          </ListSubheaderStyle>

          {group.items.map((list) => (
            <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />
          ))}
        </List>
      ))}
    </Box>
  );
}
