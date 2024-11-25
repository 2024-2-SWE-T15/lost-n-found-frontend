import {
  CLICKED_MARKER_ID,
  MARKER_TYPE,
  PINNED_MARKER_ID,
  SCENE,
} from "../store";
import { fetchMarkers, fetchStrongholdMarkers } from "../api";
import { openSidebar, setActiveMarkerId, setMarkerMap } from "./store";
import { selectMap, selectScene } from "../selector";

export const refreshMap = (lat, lng) => async (dispatch, getState) => {
  const sceneOnDispatch = selectScene(getState());

  let newMarkerMap = null;

  if (sceneOnDispatch === SCENE.INITIAL) {
    // fetch markers
    const markers = await fetchMarkers(lat, lng, 10000);
    newMarkerMap = markers.reduce((acc, marker) => {
      acc[marker.id] = {
        latlng: marker.latlng,
        type: MARKER_TYPE.FOUND_ITEM,
        data: marker,
      };
      return acc;
    }, {});
  } else if (sceneOnDispatch === SCENE.KEPT_LOCATION_PICKER) {
    // fetch markers
    const markers = await fetchStrongholdMarkers(lat, lng, 10000);
    newMarkerMap = markers.reduce((acc, marker) => {
      acc[marker.id] = {
        latlng: marker.latlng,
        type: MARKER_TYPE.STRONGHOLD,
        data: marker,
      };
      return acc;
    }, {});
  }

  if (!newMarkerMap) return;

  const sceneOnUpdate = selectScene(getState());
  if (sceneOnUpdate === sceneOnDispatch) {
    const { activeMarkerId, markerMap: oldMarkerMap } = selectMap(getState());
    newMarkerMap[CLICKED_MARKER_ID] = oldMarkerMap[CLICKED_MARKER_ID];
    newMarkerMap[PINNED_MARKER_ID] = oldMarkerMap[PINNED_MARKER_ID];

    dispatch(setMarkerMap(newMarkerMap));

    if (activeMarkerId && !newMarkerMap[activeMarkerId]) {
      dispatch(setActiveMarkerId(null));
    }
  }
};

export const clickMarker = (markerId) => (dispatch, getState) => {
  const { markerMap } = selectMap(getState());
  const marker = markerMap[markerId];

  if (!marker) {
    console.error("marker not found");
    return;
  }

  if (markerId !== CLICKED_MARKER_ID) {
    // remove clicked marker
    dispatch(setMarkerMap({ ...markerMap, [CLICKED_MARKER_ID]: null }));
  }

  dispatch(setActiveMarkerId(markerId));
  dispatch(openSidebar());
};

export const clickMap = (lat, lng) => (dispatch, getState) => {
  const state = getState();
  const scene = selectScene(state);
  const { activeMarkerId, markerMap } = selectMap(state);

  if (scene === SCENE.LOST_DETAILS_FORM || scene === SCENE.FOUND_DETAILS_FORM) {
    // clicked marker has no use in form scenes
    return;
  }

  if (activeMarkerId) {
    dispatch(setActiveMarkerId(null));

    if (activeMarkerId === CLICKED_MARKER_ID) {
      // remove clicked marker
      dispatch(setMarkerMap({ ...markerMap, [CLICKED_MARKER_ID]: null }));
    }
  } else {
    // add clicked marker
    const newMarker = {
      latlng: { lat, lng },
      type: MARKER_TYPE.CLICKED,
    };

    dispatch(setMarkerMap({ ...markerMap, [CLICKED_MARKER_ID]: newMarker }));
    dispatch(setActiveMarkerId(CLICKED_MARKER_ID));
    dispatch(openSidebar());
  }
};
