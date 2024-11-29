import {
  CLICKED_MARKER_ID,
  MARKER_TYPE,
  PINNED_MARKER_ID,
  SCENE,
} from "../store";
import {
  clearFormData,
  setActiveMarkerId,
  setMarkerMap,
  setScene,
} from "./store";
import {
  createStrongholdMarker,
  registerFoundItem,
  submitLostItem,
} from "../api";
import {
  selectActiveMarker,
  selectFormData,
  selectMap,
  selectPinnedMarker,
  selectScene,
} from "../selector";

import { refreshMap } from "./map";

const enterForm = (dispatch, getState, isLost) => {
  const { activeMarkerId, markerMap: oldMarkerMap } = selectMap(getState());
  const newMarkerMap = {
    [PINNED_MARKER_ID]: {
      latlng: oldMarkerMap[activeMarkerId].latlng,
      type: MARKER_TYPE.PINNED,
    },
  };

  dispatch(setMarkerMap(newMarkerMap));
  dispatch(setActiveMarkerId(PINNED_MARKER_ID));
  dispatch(
    setScene(isLost ? SCENE.LOST_DETAILS_FORM : SCENE.FOUND_DETAILS_FORM)
  );
};

export const enterLostForm = () => (dispatch, getState) => {
  enterForm(dispatch, getState, true);
};

export const enterFoundForm = () => (dispatch, getState) => {
  enterForm(dispatch, getState, false);
};

export const goBackOnForm = () => (dispatch, getState) => {
  const scene = selectScene(getState());
  const { markerMap } = selectMap(getState());

  switch (scene) {
    case SCENE.LOST_DETAILS_FORM:
    case SCENE.FOUND_DETAILS_FORM: {
      dispatch(clearFormData());
      dispatch(setMarkerMap({}));
      dispatch(setActiveMarkerId(null));
      dispatch(setScene(SCENE.INITIAL));
      dispatch(refreshMap());

      break;
    }
    case SCENE.KEPT_LOCATION_PICKER:
      dispatch(
        setMarkerMap({
          [PINNED_MARKER_ID]: markerMap[PINNED_MARKER_ID],
          [CLICKED_MARKER_ID]: null,
        })
      );
      dispatch(setActiveMarkerId(null));
      dispatch(setScene(SCENE.FOUND_DETAILS_FORM));
      break;
    default:
      console.error("Unexpected scene:", scene);
  }
};

export const submitLostForm = () => async (_, getState) => {
  const state = getState();
  const pinnedMarker = selectPinnedMarker(state);
  const formData = {
    ...selectFormData(state),
    coordinates: [pinnedMarker.latlng.lat, pinnedMarker.latlng.lng],
  };

  try {
    // @ts-ignore
    const response = await submitLostItem(formData);
    console.log("Response from API:", response);

    // Redirect to /post/:postId after successful submission
    if (response?.id) {
      window.location.href = `/post/${response.id}`;
    } else {
      console.error("Post ID not found in the response:", response);
      alert("등록에 문제가 발생했습니다.");
    }
  } catch (error) {
    console.error("Error sending request:", error);
    alert("오류가 발생했습니다. 다시 시도해주세요.");
  }
};

export const submitFoundForm = () => (dispatch) => {
  dispatch(setScene(SCENE.KEPT_LOCATION_PICKER));
  dispatch(refreshMap());
};

export const confirmFoundLocation = () => async (_, getState) => {
  const state = getState();
  const formData = selectFormData(state);
  const activeMarker = selectActiveMarker(state);
  const pinnedMarker = selectPinnedMarker(state);

  try {
    let strongholdId;
    try {
      strongholdId = await createStrongholdIfNeeded(
        activeMarker,
        // @ts-ignore
        formData.title,
        // @ts-ignore
        formData.description
      );
    } catch (error) {
      console.error("Error creating stronghold:", error);
      alert("보관 장소 생성에 실패했습니다.");
      return;
    }

    // @ts-ignore
    const response = await registerFoundItem({
      ...formData,
      coordinates: [pinnedMarker.latlng.lat, pinnedMarker.latlng.lng],
      keptCoordinates: [activeMarker.latlng.lat, activeMarker.latlng.lng],
      strongholdId,
    });

    if (response?.id) {
      window.location.href = `/post/${response.id}`;
    } else {
      console.error("Post ID is missing in the API response:", response);
      alert("등록에 문제가 발생했습니다.");
    }
  } catch (error) {
    console.error("Error during registration process:", error);
    alert("오류가 발생했습니다. 다시 시도해주세요.");
  }
};

const createStrongholdIfNeeded = async (marker, title, description) => {
  switch (marker.type) {
    case MARKER_TYPE.PINNED:
      // no need to create stronghold
      return null;
    case MARKER_TYPE.STRONGHOLD:
      // preexisting stronghold
      return marker.data.id;
    case MARKER_TYPE.CLICKED: {
      const strongholdData = await createStrongholdMarker({
        name: title,
        description: description,
        lat: marker.latlng.lat,
        lng: marker.latlng.lng,
      });
      console.log("Stronghold Marker API Response:", strongholdData);
      return strongholdData.id;
    }
  }
};
