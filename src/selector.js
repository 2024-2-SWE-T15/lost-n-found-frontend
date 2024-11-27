import * as store from "./store";

export const {
  selectors: { selectActiveMarker, selectClickedMarker, selectPinnedMarker },
  selectSlice: selectMap,
} = store.mapSlice;

export const {
  selectors: { selectScene },
} = store.sceneSlice;

export const { selectSlice: selectFilter } = store.filterSlice;
export const { selectSlice: selectFormData } = store.formDataSlice;
export const { selectSlice: selectProfileMenu } = store.profileMenuSlice;
export const { selectSlice: selectSidebar } = store.sidebarSlice;
