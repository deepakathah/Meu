import { configureStore } from '@reduxjs/toolkit';
import rootSaga from './saga/index';
import authReducer from './slices/authSlice';
const createSagaMiddleware = require('redux-saga').default;

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;