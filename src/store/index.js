import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { formDataSlice, profileMenuSlice, sidebarSlice } from "./misc";

import { mapSlice } from "./map";
import { sceneSlice } from "./scene";

const rootReducer = combineSlices(
  formDataSlice,
  profileMenuSlice,
  sidebarSlice,
  mapSlice,
  sceneSlice
);

export const mainPageStore = configureStore({
  reducer: rootReducer,
});

export default mainPageStore;
export * from "./map";
export * from "./misc";
export * from "./scene";
