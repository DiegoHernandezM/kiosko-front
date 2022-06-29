import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export const initialState = {
  isLoading: false,
  error: false,
  objectives: [],
  objective: {},
  associates: []
};

const slice = createSlice({
  name: 'objective',
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
    getObjectivesAssociateSuccess(state, action) {
      state.isLoading = false;
      state.objectives = action.payload;
      state.error = false;
    },
    getObjectiveAssociateSuccess(state, action) {
      state.isLoading = false;
      state.objective = action.payload;
      state.error = false;
    },
    getObjectsByAssociatesSuccess(state, action) {
      state.isLoading = false;
      state.associates = action.payload;
      state.error = false;
    },
    clearDataSuccess(state) {
      state.objective = initialState.objective;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getObjectivesAssociate(year = null, quarter = null, approved = null) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/objective/all', {
        params: {
          year,
          quarter,
          approved
        }
      });
      dispatch(slice.actions.getObjectivesAssociateSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateByAssociate(
  isAssociate,
  id,
  name,
  description,
  weighing,
  year,
  quarter,
  approved,
  progress,
  observation = null,
  realWeighing = null
) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/objective/update/${id}`, {
        isAssociate,
        id,
        name,
        description,
        year,
        quarter,
        weighing,
        approved,
        progress,
        observation,
        realWeighing
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function getObjectiveAssociate(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/objective/find/${id}`);
      dispatch(slice.actions.getObjectiveAssociateSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createObjective(name, description, weighing, year, quarter, files, progress) {
  const bodyFormData = new FormData();
  // eslint-disable-next-line array-callback-return
  files.map((file) => {
    bodyFormData.append('evidence[]', file);
  });
  bodyFormData.append('name', name);
  bodyFormData.append('description', description);
  bodyFormData.append('year', year);
  bodyFormData.append('quarter', quarter);
  bodyFormData.append('weighing', weighing);
  bodyFormData.append('progress', progress);
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/objective/create', bodyFormData, {
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

export function destroy(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/objective/delete/${id}`);
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
    bodyFormData.append('evidence[]', file);
  });
  bodyFormData.append('id', id);
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/objective/addfiles', bodyFormData, {
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

export function dropFile(id, name, evidence) {
  return async (dispatch) => {
    try {
      const response = await axios.post(`/api/v1/objective/deletefile/`, {
        id,
        name,
        evidence
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
      const response = await axios.get(`/api/v1/objective/downloadfile/`, {
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

export function getAssociates(year = null, quarter = null, approved = null) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/objective/allassociates', {
        params: {
          year,
          quarter,
          approved
        }
      });
      dispatch(slice.actions.getObjectsByAssociatesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function clearDataObjective() {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.clearDataSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
