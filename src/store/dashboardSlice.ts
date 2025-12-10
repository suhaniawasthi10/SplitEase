import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { dashboardService, type BalanceSummary, type DetailedBalance } from '../services/dashboardService';

interface DashboardState {
  summary: BalanceSummary | null;
  detailedBalances: {
    owedToYou: DetailedBalance[];
    youOwe: DetailedBalance[];
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  detailedBalances: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchBalanceSummary = createAsyncThunk(
  'dashboard/fetchBalanceSummary',
  async (_, { rejectWithValue }) => {
    try {
      const summary = await dashboardService.getBalanceSummary();
      return summary;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDetailedBalances = createAsyncThunk(
  'dashboard/fetchDetailedBalances',
  async (_, { rejectWithValue }) => {
    try {
      const balances = await dashboardService.getDetailedBalances();
      return balances;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.summary = null;
      state.detailedBalances = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Balance Summary
      .addCase(fetchBalanceSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalanceSummary.fulfilled, (state, action: PayloadAction<BalanceSummary>) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchBalanceSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Detailed Balances
      .addCase(fetchDetailedBalances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailedBalances.fulfilled, (state, action) => {
        state.loading = false;
        state.detailedBalances = action.payload;
      })
      .addCase(fetchDetailedBalances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;