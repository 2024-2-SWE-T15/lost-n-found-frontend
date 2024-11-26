import { createSlice } from "@reduxjs/toolkit";

export const SCENE = {
  INITIAL: "initial",
  SEARCH_RESULT: "search-result",
  LOST_DETAILS_FORM: "lost-details-form",
  FOUND_DETAILS_FORM: "found-details-form",
  KEPT_LOCATION_PICKER: "kept-location-picker",
};

const sceneSlice = createSlice({
  name: "scene",
  initialState: {
    value: SCENE.INITIAL,
  },
  reducers: {
    setScene: (_, action) => {
      return { value: action.payload };
    },
  },
  selectors: {
    selectScene: (state) => state.value,
  },
});

export { sceneSlice };
