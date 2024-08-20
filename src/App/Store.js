// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../Slice/UserSlice.js';
import reloadSilce from '../Slice/Reload.js';

const store = configureStore({
  reducer: {
    user: userReducer,
    reload: reloadSilce,
  },
});

export default store;