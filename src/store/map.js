import { createSlice } from "@reduxjs/toolkit";

export const MARKER_TYPE = {
  // LOST_ITEM: "lost-item", // is it necessary?
  FOUND_ITEM: "found-item",
  STRONGHOLD: "stronghold",
  PINNED: "pinned",
  CLICKED: "clicked",
};

export const PINNED_MARKER_ID = "_-_-pinned";
export const CLICKED_MARKER_ID = "_-_-clicked";

const mapSlice = createSlice({
  name: "map",
  initialState: {
    activeMarkerId: null,
    markerMap: {},
  },
  reducers: {
    setActiveMarkerId: (state, action) => {
      return {
        ...state,
        activeMarkerId: action.payload,
      };
    },
    setMarkerMap: (state, action) => {
      return {
        ...state,
        markerMap: { ...action.payload },
      };
    },
  },
  selectors: {
    selectActiveMarker: (state) =>
      state.activeMarkerId ? state.markerMap[state.activeMarkerId] : null,
    selectClickedMarker: (state) => state.markerMap[CLICKED_MARKER_ID],
    selectPinnedMarker: (state) => state.markerMap[PINNED_MARKER_ID],
  },
});

export { mapSlice };
