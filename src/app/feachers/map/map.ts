import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface MapState {
  map: any;
  ps: any;
}

const initialState: MapState = {
  map: null,
  ps: null,
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMap: (state, action: PayloadAction<any>) => {
      state.map = action.payload;
    },
    setPs: (state, action: PayloadAction<any>) => {
      state.ps = action.payload;
    },
  },
});

export const { setMap, setPs } = mapSlice.actions;

export const selectMap = (state: RootState) => state.map.map;
export const selectPs = (state: RootState) => state.map.ps;

export default mapSlice.reducer;
