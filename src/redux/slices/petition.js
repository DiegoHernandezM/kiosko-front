import { createSlice } from '@reduxjs/toolkit';
// utils
import moment from 'moment';
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export const initialState = {
  isLoading: false,
  loading: false,
  error: false,
  petitions: [],
  petition: {},
  petitionsAssociate: [],
  associate: {}
};

const slice = createSlice({
  name: 'petition',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    initialLoading(state) {
      state.loading = true;
    },
    endLoading(state) {
      state.isLoading = false;
    },
    finishLoading(state) {
      state.loading = false;
    },

    // HAS ERROR
    hasError(state) {
      state.isLoading = false;
      state.error = true;
    },

    // GET POSTS
    getPetitionsSuccess(state, action) {
      state.isLoading = false;
      state.petitions = action.payload;
      state.error = false;
    },
    getPetitionSuccess(state, action) {
      state.isLoading = false;
      state.loading = false;
      state.petition = action.payload;
      state.error = false;
    },
    getPetitionsByAssociateSuccess(state, action) {
      state.isLoading = false;
      state.petitionsAssociate = action.payload.petitions;
      state.associate = action.payload.associate;
      state.error = false;
    },
    clearDataSuccess(state) {
      state.petition = initialState.petition;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getPetitions() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/petition/all');
      dispatch(slice.actions.getPetitionsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getPetitionsByAssociate() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/petition/allbyassociate');
      dispatch(slice.actions.getPetitionsByAssociateSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getPetition(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/petition/edit/${id}`);
      dispatch(slice.actions.getPetitionSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function create(date, petitionDesc, comment, approved, start, end, days, files) {
  const bodyFormData = new FormData();
  const period = [{ startDate: moment(start).format('YYYY-MM-DD'), endDate: moment(end).format('YYYY-MM-DD'), days }];
  // eslint-disable-next-line array-callback-return
  files.map((file) => {
    bodyFormData.append('files[]', file);
  });
  bodyFormData.append('date', date);
  bodyFormData.append('petition_description', petitionDesc);
  bodyFormData.append('comment', comment);
  bodyFormData.append('approved', approved);
  bodyFormData.append('period', start === '' || end === '' ? '' : JSON.stringify(period));
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/petition/create`, bodyFormData, {
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

export function update(id, date, petitionDesc, comment, approved, approvedBy, associateId, period) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`/api/v1/petition/update/${id}`, {
        date,
        petition_description: petitionDesc,
        comment,
        approved,
        associate_id: associateId,
        approved_by: approvedBy,
        period
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function approvedPet(id, comment, approved, commentAdmin) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/petition/approved/${id}`, {
        comment,
        approved,
        comment_by_admin: commentAdmin
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
      const response = await axios.patch(`/api/v1/petition/destroy/${id}`);
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
      const response = await axios.patch(`/api/v1/petition/restore/${id}`);
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
    dispatch(slice.actions.initialLoading());
    try {
      const response = await axios.post('/api/v1/petition/addfiles', bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(slice.actions.finishLoading());
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function dropFile(id, name, files) {
  return async (dispatch) => {
    dispatch(slice.actions.initialLoading());
    try {
      const response = await axios.post(`/api/v1/petition/deletefile/`, {
        id,
        name,
        files
      });
      dispatch(slice.actions.finishLoading());
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
      const response = await axios.get(`/api/v1/petition/downloadfile/`, {
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

export function clearDataPetition() {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.clearDataSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
