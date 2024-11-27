import * as store from "../store";

export const {
  actions: { clear: clearFilter, apply: applyFilter },
} = store.filterSlice;

export const {
  actions: { clear: clearFormData, setField: setFormDataField },
} = store.formDataSlice;

export const {
  actions: { setMarkerMap, setActiveMarkerId },
} = store.mapSlice;

export const {
  actions: { toggleProfileMenu, openProfileMenu, closeProfileMenu },
} = store.profileMenuSlice;

export const {
  actions: { toggleSidebar, openSidebar, closeSidebar },
} = store.sidebarSlice;

export const {
  actions: { setScene },
} = store.sceneSlice;
