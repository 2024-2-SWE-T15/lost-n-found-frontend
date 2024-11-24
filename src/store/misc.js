import { createSlice } from "@reduxjs/toolkit";

const profileMenuSlice = createSlice({
  name: "profileMenu",
  initialState: {
    opened: false,
  },
  reducers: {
    toggleProfileMenu: (state) => {
      return {
        ...state,
        opened: !state.opened,
      };
    },
    openProfileMenu: (state) => {
      return {
        ...state,
        opened: true,
      };
    },
    closeProfileMenu: (state) => {
      return {
        ...state,
        opened: false,
      };
    },
  },
});

const formDataSlice = createSlice({
  name: "formData",
  initialState: {},
  reducers: {
    clear: () => ({}),
    setField: (state, action) => {
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    },
  },
});

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    opened: true,
  },
  reducers: {
    toggleSidebar: (state) => {
      return {
        ...state,
        opened: !state.opened,
      };
    },
    openSidebar: (state) => {
      return {
        ...state,
        opened: true,
      };
    },
    closeSidebar: (state) => {
      return {
        ...state,
        opened: false,
      };
    },
  },
});

export { formDataSlice, profileMenuSlice, sidebarSlice };
