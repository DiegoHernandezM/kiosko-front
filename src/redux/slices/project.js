import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export const initialState = {
  isLoading: false,
  error: false,
  projects: [],
  project: {}
};

const slice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state) {
      state.isLoading = false;
      state.error = true;
    },

    // GET POSTS
    getProjectsSuccess(state, action) {
      state.isLoading = false;
      state.projects = action.payload;
      state.error = false;
    },
    getProjectSuccess(state, action) {
      state.isLoading = false;
      state.project = action.payload;
      state.error = false;
    },
    clearDataSuccess(state) {
      state.project = initialState.project;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getProjects() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/project/all');
      dispatch(slice.actions.getProjectsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProject(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/project/edit/${id}`);
      dispatch(slice.actions.getProjectSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function create(name, description, number) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/project/create`, {
        name,
        description,
        project_number: number
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function update(id, name, description, number) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`/api/v1/project/update/${id}`, {
        name,
        description,
        project_number: number
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
    try {
      const response = await axios.get(`/api/v1/project/destroy/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function restoreProject(id) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/v1/project/restore/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function clearDataProject() {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.clearDataSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
