// src/App/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: false, // This is where user data will be stored
};

const reloadSlice = createSlice({ // Corrected name here
  name: 'reload',
  initialState,
  reducers: {
    setReload: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setReload } = reloadSlice.actions; // Use destructuring to match the corrected slice name
export default reloadSlice.reducer;