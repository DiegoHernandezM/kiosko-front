import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export const initialState = {
  isLoading: false,
  error: false,
  inquests: [],
  inquest: {}
};

const slice = createSlice({
  name: 'inquest',
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
    getInquestsSuccess(state, action) {
      state.isLoading = false;
      state.inquests = action.payload;
      state.error = false;
    },
    getInquestSuccess(state, action) {
      state.isLoading = false;
      state.inquest = action.payload;
      state.error = false;
    },
    getInquestCsvSuccess(state) {
      state.isLoading = false;
      state.error = false;
    },
    clearDataSuccess(state) {
      state.inquest = initialState.inquest;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getInquests() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/inquest/all');
      dispatch(slice.actions.getInquestsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getInquest(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/inquest/edit/${id}`);
      dispatch(slice.actions.getInquestSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function create(name, description, content, emails) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/inquest/create`, {
        name,
        description,
        content,
        emails
      });
      return Promise.resolve(response);
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function update(id, name, description, content) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`/api/v1/inquest/update/${id}`, {
        name,
        description,
        content
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
      const response = await axios.patch(`/api/v1/inquest/destroy/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function restore(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`/api/v1/inquest/restore/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function expire(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/inquest/changestatus/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function clearDataInquest() {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.clearDataSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function verifyInquest(uuid) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/inquest/recipient/verify/${uuid}`);
      return Promise.resolve(response);
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function createAnswers(uuid, content, comments) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/inquest/send/answers`, {
        uuid,
        content,
        comments
      });
      return Promise.resolve(response);
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function getInquestCsv(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/inquest/csv/${id}`);
      dispatch(slice.actions.getInquestCsvSuccess(response.data));
      return Promise.resolve(response.data);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}
