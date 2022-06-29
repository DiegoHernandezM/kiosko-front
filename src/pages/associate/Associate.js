import { useState, useEffect } from 'react';
import moment from 'moment';
// material
import { Container, Tab, Card, Button, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import plusFill from '@iconify/icons-eva/plus-fill';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getAssociates,
  getAssociate,
  clearDataAssociate,
  create,
  update,
  destroy,
  restore
} from '../../redux/slices/associate';
import {
  getUser,
  getUsersPermission,
  clearDataUser,
  createUser,
  updateUser,
  restoreUser,
  destroyUser
} from '../../redux/slices/user';
import { getAreas } from '../../redux/slices/area';
import { getSubareasByArea } from '../../redux/slices/subarea';
// components
import Page from '../../components/Page';
import { PATH_DASHBOARD } from '../../routes/paths';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useSettings from '../../hooks/useSettings';
import AssociateForm from '../../components/associate/AssociateForm';
import TableAssociate from '../../components/associate/TableAssociates';
import TableUsers from '../../components/associate/TableUsers';
import SnackAlert from '../../components/general/SnackAlert';

export default function Associate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [value, setValue] = useState('1');
  const { associates, associate, isLoading } = useSelector((state) => state.associate);
  const { usersPermission, user, isLoadingUser } = useSelector((state) => state.user);
  const { areas } = useSelector((state) => state.area);
  const { subareasArea } = useSelector((state) => state.subarea);
  const [openForm, setOpenForm] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');
  const [modeUpdate, setModeUpdate] = useState(false);
  const [modeAssociate, setModeAssociate] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(getAssociates());
    dispatch(getUsersPermission('manager'));
    dispatch(getAreas());
  }, [dispatch]);

  const handleCloseForm = () => {
    setModeAssociate(false);
    dispatch(clearDataAssociate());
    dispatch(clearDataUser());
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setModeAssociate(false);
    setModeUpdate(false);
    setOpenForm(true);
  };

  const handleUpdate = (id, values) => {
    if (modeAssociate) {
      dispatch(updateAssociate(id, values));
    } else {
      dispatch(updateManager(id, values));
    }
    setModeAssociate(false);
    setOpenForm(false);
  };

  function createAssociate(values) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(
          dispatch(
            create(
              values.name,
              values.lastnames,
              values.email,
              values.employee,
              moment(values.entry).format('YYYY-MM-DD'),
              values.area,
              values.subarea,
              values.type,
              moment(values.birthday).format('YYYY-MM-DD'),
              values.vacations
            )
          )
        );
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Colaborador creado' : 'Ocurro algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          dispatch(getAssociates());
          dispatch(getUsersPermission('manager'));
          setOpenMessage(true);
          setOpenForm(false);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function createManager(values) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(createUser(values.name, values.email, values.type)));
      })
        .then((response) => {
          setMessage(response.status === 200 ? 'Manager creado' : 'Ocurro algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          dispatch(getAssociates());
          dispatch(getUsersPermission('manager'));
          setOpenMessage(true);
          setOpenForm(false);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function updateAssociate(id, values) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(
          dispatch(
            update(
              id,
              values.name,
              values.lastnames,
              values.employee,
              moment(values.entry).format('YYYY-MM-DD'),
              values.area,
              values.subarea,
              values.type,
              moment(values.birthday).format('YYYY-MM-DD'),
              values.vacations
            )
          )
        );
      })
        .then((response) => {
          dispatch(getAssociates());
          dispatch(getUsersPermission('manager'));
          setMessage(response.status === 200 ? 'Actualizacion realizada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function updateManager(id, values) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(updateUser(id, values.name, values.email, values.type)));
      })
        .then((response) => {
          dispatch(getAssociates());
          setMessage(response.status === 200 ? 'Actualizacion realizada' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  const handleCallbackAssociateForm = (values) => {
    dispatch(createAssociate(values));
  };

  const handleCallbackManagerForm = (values) => {
    dispatch(createManager(values));
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
  };

  const doubleClickAssociates = (row) => {
    setModeAssociate(true);
    setOpenForm(true);
    setModeUpdate(true);
    dispatch(getAssociate(row.id));
    dispatch(getSubareasByArea(row.area_id));
  };

  const doubleClickUsers = (id) => {
    setModeAssociate(false);
    setOpenForm(true);
    setModeUpdate(true);
    dispatch(getUser(id));
  };

  const onChangeArea = (id) => {
    dispatch(getSubareasByArea(id));
  };

  const handleRestore = (id) => {
    dispatch(restoreAssociate(id));
  };

  const handleRestoreUser = (id) => {
    dispatch(restoreU(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteAssociate(id));
  };

  const handleDeleteUser = (id) => {
    dispatch(deleteU(id));
  };

  function deleteU(id) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(destroyUser(id)));
      })
        .then((response) => {
          dispatch(getAssociates());
          dispatch(getUsersPermission('manager'));
          setMessage(response.status === 200 ? 'Usuario eliminado' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function deleteAssociate(id) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(destroy(id)));
      })
        .then((response) => {
          dispatch(getAssociates());
          dispatch(getUsersPermission('manager'));
          setMessage(response.status === 200 ? 'Colaborador eliminado' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function restoreAssociate(id) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(restore(id)));
      })
        .then((response) => {
          dispatch(getAssociates());
          dispatch(getUsersPermission('manager'));
          setMessage(response.status === 200 ? 'Colaborador activado' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  function restoreU(id) {
    return (dispatch) =>
      new Promise((resolve) => {
        resolve(dispatch(restoreUser(id)));
      })
        .then((response) => {
          dispatch(getAssociates());
          dispatch(getUsersPermission('manager'));
          setMessage(response.status === 200 ? 'Administrador activado' : 'Ocurrio algun error');
          setTypeMessage(response.status === 200 ? 'success' : 'error');
          setOpenMessage(true);
        })
        .catch((error) => {
          setTypeMessage('error');
          setMessage(error.message);
          setOpenMessage(true);
          console.log(error);
        });
  }

  return (
    <Page title="Colaboradores">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Colaboradores y Administradores"
          links={[{ name: '', href: PATH_DASHBOARD.root }]}
          action={
            <Button variant="contained" onClick={handleOpenForm} startIcon={<Icon icon={plusFill} />}>
              Nuevo
            </Button>
          }
        />
      </Container>
      <SnackAlert message={message} type={typeMessage} open={openMessage} close={handleCloseMessage} />
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <TabContext value={value}>
            <Box sx={{ width: '100%', marginBottom: '10px' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
                <Tab label="COLABORADORES" value="1" />
                <Tab label="ADMINISTRADORES" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <TableAssociate
                loading={isLoading}
                doubleClick={doubleClickAssociates}
                associates={associates}
                handleRestore={handleRestore}
                handleDelete={handleDelete}
              />
            </TabPanel>
            <TabPanel value="2">
              <TableUsers
                loading={isLoadingUser}
                doubleClick={doubleClickUsers}
                users={usersPermission}
                handleRestore={handleRestoreUser}
                handleDelete={handleDeleteUser}
              />
            </TabPanel>
          </TabContext>
        </Card>
      </Container>
      <AssociateForm
        open={openForm}
        modeAssociate={modeAssociate}
        close={handleCloseForm}
        parentCallbackAssociate={handleCallbackAssociateForm}
        parentCallbackManager={handleCallbackManagerForm}
        associate={associate}
        manager={user}
        update={modeUpdate}
        updateRegister={handleUpdate}
        areas={areas}
        subareas={subareasArea}
        onChangeArea={onChangeArea}
      />
    </Page>
  );
}
