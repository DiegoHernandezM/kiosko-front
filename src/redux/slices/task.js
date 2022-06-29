import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export const initialState = {
  isLoading: false,
  error: false,
  tasksAssociate: [],
  taskAssociate: {},
  tasks: []
};

const slice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    endLoading(state) {
      state.isLoading = false;
    },

    // HAS ERROR
    hasError(state) {
      state.isLoading = false;
      state.error = true;
    },

    // GET POSTS
    getTasksAssociateSuccess(state, action) {
      state.isLoading = false;
      state.tasksAssociate = action.payload;
      state.error = false;
    },
    getTaskAssociateSuccess(state, action) {
      state.isLoading = false;
      state.taskAssociate = action.payload;
      state.error = false;
    },
    clearDataSuccess(state) {
      state.taskAssociate = initialState.taskAssociate;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getTasksAssociate(init = null, end = null, status = null) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/taskassociate/all', {
        params: {
          init,
          end,
          status
        }
      });
      dispatch(slice.actions.getTasksAssociateSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTaskAssociate(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/taskassociate/find/${id}`);
      dispatch(slice.actions.getTaskAssociateSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createTaskAssociate(name, description, files, day, hours) {
  const bodyFormData = new FormData();
  // eslint-disable-next-line array-callback-return
  files.map((file) => {
    bodyFormData.append('files[]', file);
  });
  bodyFormData.append('name', name);
  bodyFormData.append('description', description);
  bodyFormData.append('task_day', day);
  bodyFormData.append('hours', hours);
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/taskassociate/create', bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(slice.actions.endLoading());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function update(id, name) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`/api/v1/area/update/${id}`, {
        name
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function destroy(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/taskassociate/delete/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function addFiles(id, files) {
  const bodyFormData = new FormData();
  // eslint-disable-next-line array-callback-return
  files.map((file) => {
    bodyFormData.append('files[]', file);
  });
  bodyFormData.append('id', id);
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/taskassociate/addfiles', bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(slice.actions.endLoading());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function dropFile(id, name, files) {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/api/v1/taskassociate/deletefile/`, {
        id,
        name,
        files
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function getFile(name) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/v1/taskassociate/downloadfile/`, {
        params: {
          name
        },
        responseType: 'blob'
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function updateTask(id, name, description, day, hours) {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/api/v1/taskassociate/update/${id}`, {
        name,
        description,
        day,
        hours
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function clearDataTask() {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.clearDataSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
