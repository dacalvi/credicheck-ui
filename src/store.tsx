import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useSelector, useDispatch} from "react-redux";
import colorsReducer from "slices/colors";
import configReducer from "slices/config";
import leftSidebarReducer from "slices/left-sidebar";
import navigationReducer from "slices/navigation";
import rolesReducer from "slices/roles";

const store = configureStore({
  reducer: {
    colors: colorsReducer,
    config: configReducer,
    leftSidebar: leftSidebarReducer,
    navigation: navigationReducer,
    roles: rolesReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
