import getApiUrl from "@/constant/apiUrl";
import {
    getUsersFailure,
    getUsersRequest,
    getUsersSuccess,
} from "@/redux/slices/usersCheckIn";
import { call, put, takeLatest } from "redux-saga/effects";

// Generic POST helper using fetch
const postRequest = async (url, restaurantId, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ shopId: restaurantId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

function* handleGetUsers(action) {
  try {
    const apiURL = getApiUrl();

    // Destructure payload to get restaurantId and token if provided
    const { restaurantId, token } = action.payload;

    const data = yield call(
      postRequest,
      `${apiURL}/getAreaUsers`,
      restaurantId,
      token
    );

    if (data?.status && data?.userData) {
      yield put(
        getUsersSuccess({
          users: data.userData,
        })
      );
    } else {
      yield put(getUsersFailure(data?.message || "Users get failed"));
    }
  } catch (error) {
    yield put(getUsersFailure(error.message || "Users get failed"));
  }
}

// Watcher saga
export function* usersSaga() {
  yield takeLatest(getUsersRequest.type, handleGetUsers);
}
