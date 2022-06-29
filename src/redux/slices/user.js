import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export const initialState = {
  isLoadingUser: false,
  error: false,
  users: [],
  user: {},
  usersPermission: [],
  showUser: []
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoadingUser = true;
    },

    // HAS ERROR
    hasError(state) {
      state.isLoadingUser = false;
      state.error = true;
    },

    // GET POSTS
    getUsersSuccess(state, action) {
      state.isLoadingUser = false;
      state.users = action.payload;
      state.error = false;
    },
    getUserSuccess(state, action) {
      state.isLoadingUser = false;
      state.user = action.payload;
      state.error = false;
    },
    getUsersPermissionSuccess(state, action) {
      state.isLoadingUser = false;
      state.usersPermission = action.payload;
      state.error = false;
    },
    clearDataSuccess(state) {
      state.user = initialState.user;
    },
    getShowLogued(state, action) {
      state.isLoading = false;
      state.showUser = action.payload;
      state.error = false;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUsers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/user/all');
      dispatch(slice.actions.getUsersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/user/find/${id}`);
      dispatch(slice.actions.getUserSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createUser(name, email, authority) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/user/create`, {
        name,
        email,
        authority: {
          permissions: [authority]
        }
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function updateUser(id, name, email, authority) {
  return async (dispatch) => {
    try {
      const response = await axios.patch(`/api/v1/user/update/${id}`, {
        id,
        name,
        email,
        authority: {
          permissions: [authority]
        }
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function destroyUser(id) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/v1/user/destroy/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function restoreUser(id) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/v1/user/restore/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function getUsersPermission(permission) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/user/permission/${permission}`);
      dispatch(slice.actions.getUsersPermissionSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function clearDataUser() {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.clearDataSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function showLogued() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/user/showlogued`);
      dispatch(slice.actions.getShowLogued(response.data.user));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function changePassword(oldPassword, newPassword, newPasswordConfirmation) {
  // eslint-disable-next-line consistent-return
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/user/changepassword`, {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function resetPassword(email) {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/api/resetpassword`, {
        email
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function updatePassword(password, token) {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/api/submitresetpassword`, {
        password,
        token
      });
      return Promise.resolve(response.data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}
