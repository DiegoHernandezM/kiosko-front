import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
// ----------------------------------------------------------------------

export const initialState = {
  isLoading: false,
  error: false,
  associates: [],
  associate: {}
};

const slice = createSlice({
  name: 'associate',
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
    getAssociatesSuccess(state, action) {
      state.isLoading = false;
      state.associates = action.payload;
      state.error = false;
    },
    getAssociateSuccess(state, action) {
      state.isLoading = false;
      state.associate = action.payload;
      state.error = false;
    },
    clearDataSuccess(state) {
      state.associate = initialState.associate;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getAssociates() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/associate/all');
      dispatch(slice.actions.getAssociatesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getAssociate(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/associate/find/${id}`);
      dispatch(slice.actions.getAssociateSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function create(name, lastnames, email, employee, entry, area, subarea, type, birthday, vacations) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`/api/v1/associate/create`, {
        name,
        lastnames,
        email,
        employee_number: employee,
        entry_date: entry,
        area_id: area,
        subarea_id: subarea,
        type,
        birthday,
        vacations_available: vacations
      });
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function update(id, name, lastnames, employee, entry, area, subarea, type, birthday, vacations) {
  return async (dispatch) => {
    try {
      const response = await axios.patch(`/api/v1/associate/update/${id}`, {
        name,
        lastnames,
        employee_number: employee,
        entry_date: entry,
        area_id: area,
        subarea_id: subarea,
        type,
        birthday,
        vacations_available: vacations
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
      const response = await axios.get(`/api/v1/associate/destroy/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function restore(id) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/v1/associate/restore/${id}`);
      return Promise.resolve(response);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      return Promise.reject(error);
    }
  };
}

export function clearDataAssociate() {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.clearDataSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
