import {createSlice} from "@reduxjs/toolkit";

export type RoleState = {
  id: number;
  name: string;
};

const initialState: RoleState[] = [
  {
    id: 1,
    name: "Super Admin",
  },
  {
    id: 2,
    name: "Supervisor",
  },
  {
    id: 3,
    name: "Oficial de Negocio",
  },
];

export const rolesSlice = createSlice({
  name: "roles",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
});

export default rolesSlice.reducer;
