import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else if (response.status === 401) {
        // Jeśli status to 401, wywołaj akcję logout
        dispatch(logout());
        return rejectWithValue('Unauthorized');
      } else {
        throw new Error('Failed to fetch user data');
      }
    }
    return null;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
