import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
  return { type: actionTypes.AUTH_START };
};

export const authSuccess = (idToken, userId) => {
  return { type: actionTypes.AUTH_SUCCESS, idToken, userId }
};

export const authFail = (error) => {
  return { type: actionTypes.AUTH_FAIL, error };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationTime');
  localStorage.removeItem('userId');
  return { type: actionTypes.AUTH_LOGOUT }
}

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  }
}

export const auth = (email, password, isSignup) => {
  return dispatch => {
    dispatch(authStart());

    const authData = {
      email,
      password,
      returnSecureToken: true
    }
    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCsr91Kh54M9AJSMdmyhXwM0dYz1ffriEo';

    if (!isSignup) {
      url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCsr91Kh54M9AJSMdmyhXwM0dYz1ffriEo'
    }
    axios.post(url, authData)
      .then(response => {
        const expirationTime = new Date(new Date().getTime() + response.data.expiresIn * 1000)
        localStorage.setItem('token', response.data.idToken);
        localStorage.setItem('expirationTime', expirationTime);
        localStorage.setItem('userId', response.data.localId);
        dispatch(authSuccess(response.data.idToken, response.data.localId))
        dispatch(checkAuthTimeout(response.data.expiresIn))
      })
      .catch(error => {
        console.log(error);
        dispatch(authFail(error.response.data.error));
      })

  }
}

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT,
    path: path
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationTime = new Date(localStorage.getItem('expirationTime'));
      if (expirationTime <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000));
      }
    }
  };
};