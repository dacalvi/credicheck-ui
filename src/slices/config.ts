import {createSlice, PayloadAction} from "@reduxjs/toolkit";

// Define a type for the slice state
interface ConfigState {
  name: string;
  description: string;
  url: string;
  layout: string;
  collapsed: boolean;
  rightSidebar: boolean;
  background: string;
}

// Define the initial state using that type
const initialState: ConfigState = {
  name: "CrediCheck",
  description: "Analizador de crédito",
  url: "https://d-board-nextjs.mobifica.com",
  layout: "layout-1",
  collapsed: false,
  rightSidebar: false,
  background: "dark",
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<Partial<ConfigState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const {setConfig} = configSlice.actions;

export default configSlice.reducer;
