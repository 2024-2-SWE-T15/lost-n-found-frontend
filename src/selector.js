import * as store from "./store";

export const {
  selectors: { selectActiveMarker, selectClickedMarker, selectPinnedMarker },
  selectSlice: selectMap,
} = store.mapSlice;

export const {
  selectors: { selectFilter },
} = store.filterSlice;

export const {
  selectors: { selectScene },
} = store.sceneSlice;

export const { selectSlice: selectFormData } = store.formDataSlice;
export const { selectSlice: selectProfileMenu } = store.profileMenuSlice;
export const { selectSlice: selectSidebar } = store.sidebarSlice;

export const selectSidebarAwareCenter = (state) => {
  const { opened: sidebarOpened } = selectSidebar(state);
  const {
    centerSnapshot: { lat: centerLat, lng: centerLng },
    sidebarOffsetSnapshot: { lat: offsetLat, lng: offsetLng },
  } = selectMap(state);

  return {
    lat: centerLat - (sidebarOpened ? offsetLat : 0),
    lng: centerLng - (sidebarOpened ? offsetLng : 0),
  };
};
