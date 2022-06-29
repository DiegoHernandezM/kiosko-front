import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export const initialState = {
  isLoading: false,
  error: false,
  tasks: [],
  task: {}
};

const slice = createSlice({
  name: 'taskManager',
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
    getTasksSuccess(state, action) {
      state.isLoading = false;
      state.tasks = action.payload;
      state.error = false;
    },
    getTaskSuccess(state, action) {
      state.isLoading = false;
      state.task = action.payload;
      if (state.task.files !== null) {
        state.task.files.forEach((v, k, a) => {
          a[k].id = k;
        });
      }
      state.error = false;
    },
    clearDataSuccess(state) {
      state.task = initialState.task;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getTasks(init = null) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/task/all', {
        params: {
          init
        }
      });
      dispatch(slice.actions.getTasksSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTask(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/task/find/${id}`);
      dispatch(slice.actions.getTaskSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function update(id, observation, percent, status) {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/api/v1/task/update/${id}`, {
        observation,
        percent,
        status
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function getReportTask(init) {
  return async (dispatch) => {
    try {
      const config = {
        responseType: 'blob',
        params: { init, save: false }
      };
      const response = await axios.get('/api/v1/task/report', config);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([response.data], { type: 'text/xlsx' }));
      a.setAttribute('download', `actividades.xlsx`);
      document.body.appendChild(a);
      a.click();
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
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
