
import Constants from 'expo-constants';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  sendOtpFailure,
  sendOtpRequest,
  sendOtpSuccess,
  verifyOtpFailure,
  verifyOtpRequest,
  verifyOtpSuccess,
} from '../slices/authSlice';

const getApiUrl = () => {
  const apiURL =
    Constants?.expoConfig?.extra?.apiURL ||
    Constants?.manifest?.extra?.apiURL; 
  if (!apiURL) throw new Error('API URL is not defined in expo-constants');
  return apiURL;
};

// Generic POST helper using fetch
const postRequest = async (url, body, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Worker saga for sending OTP
function* handleSendOtp(action) {
  try {
    const apiURL = getApiUrl();
    const data = yield call(postRequest, `${apiURL}/sendOtp`, action.payload);

    if (data?.status) {
      yield put(sendOtpSuccess());
    } else {
      yield put(sendOtpFailure(data?.message || 'Failed to send OTP'));
    }
  } catch (error) {
    console.error('Send OTP Error:', error);
    yield put(sendOtpFailure(error.message || 'Failed to send OTP'));
  }
}

// Worker saga for verifying OTP
function* handleVerifyOtp(action) {
  try {
    const apiURL = getApiUrl();
    const data = yield call(postRequest, `${apiURL}/verifyOtp`, action.payload);
    
    const token = data?.Token?.split(' ')[1];

    if (data?.status && token && data?.action && data?.user_id) {
      yield put(
        verifyOtpSuccess({
          token,
          action: data.action,
          user_id: data.user_id,
          user: data.userData,
        })
      );
    } else {
      yield put(verifyOtpFailure(data?.message || 'OTP verification failed'));
    }
  } catch (error) {
    console.error('Verify OTP Error:', error);
    yield put(verifyOtpFailure(error.message || 'OTP verification failed'));
  }
}

// Watcher saga
export function* authSaga() {
  yield takeLatest(sendOtpRequest.type, handleSendOtp);
  yield takeLatest(verifyOtpRequest.type, handleVerifyOtp);
}
