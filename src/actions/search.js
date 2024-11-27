import {
  CLICKED_MARKER_ID,
  MARKER_TYPE,
  PINNED_MARKER_ID,
  SCENE,
} from "../store";
import {
  applyFilter,
  clearFilter,
  setActiveMarkerId,
  setMarkerMap,
  setScene,
} from "./store";
import { selectMap, selectScene, selectSidebarAwareCenter } from "../selector";

import { refreshMap } from "./map";
import { searchPosts } from "../api";

export const search = (payload) => async (dispatch, getState) => {
  dispatch(setScene(SCENE.SEARCH_RESULT));

  if (payload.distance) {
    const { lat, lng } = selectSidebarAwareCenter(getState());
    payload.lat = lat;
    payload.lng = lng;

    dispatch(
      setMarkerMap({
        [PINNED_MARKER_ID]: {
          latlng: { lat, lng },
          type: MARKER_TYPE.PINNED,
        },
      })
    );
  } else {
    dispatch(setMarkerMap({}));
  }

  dispatch(
    applyFilter({
      ...payload,
      isSearching: true,
    })
  );

  // @ts-ignore
  try {
    const posts = await searchPosts(payload);
    dispatch(
      applyFilter({
        ...payload,
        isSearching: false,
        result: posts,
      })
    );

    const scene = selectScene(getState());
    if (scene === SCENE.SEARCH_RESULT) {
      const { markerMap: oldMarkerMap } = selectMap(getState());
      const newMarkerMap = posts.reduce((acc, post) => {
        acc[post.id] = {
          latlng: post.latlng,
          type: MARKER_TYPE.ITEM,
          data: post,
        };
        return acc;
      }, {});
      newMarkerMap[CLICKED_MARKER_ID] = oldMarkerMap[CLICKED_MARKER_ID];
      newMarkerMap[PINNED_MARKER_ID] = oldMarkerMap[PINNED_MARKER_ID];

      console.log(newMarkerMap);

      dispatch(setMarkerMap(newMarkerMap));
      dispatch(setActiveMarkerId(null));
    }
  } catch (error) {
    console.error("Failed to search posts:", error);
    dispatch(
      applyFilter({
        ...payload,
        isSearching: false,
        result: false,
      })
    );
  }
};

export const clearSearch = () => (dispatch) => {
  dispatch(setScene(SCENE.INITIAL));
  dispatch(setMarkerMap({}));
  dispatch(clearFilter());
  dispatch(setActiveMarkerId(null));
  dispatch(refreshMap());
};
