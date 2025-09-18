import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// 🛡️ Safely parse cookies
let parsedUser = null;
try {
  const userCookie = Cookies.get('user');
  if (userCookie && userCookie !== 'undefined') {
    parsedUser = JSON.parse(userCookie);
  }
} catch (err) {
  console.error("Invalid user cookie:", err);
  Cookies.remove('user');
}

const initialState = {
  isAuthenticated: !!Cookies.get('token'),
  user: parsedUser,
  token: Cookies.get('token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;

      Cookies.set('user', JSON.stringify(action.payload.user), { expires: 1 }); // 1 day
      Cookies.set('token', action.payload.token, { expires: 1 }); // 1 day
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      Cookies.remove('user');
      Cookies.remove('token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
