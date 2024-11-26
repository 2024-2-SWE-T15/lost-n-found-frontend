// @ts-nocheck
import { MapMarker, useMap } from "react-kakao-maps-sdk";
import { selectScene, selectSidebar } from "../selector";
import { useDispatch, useSelector } from "react-redux";

import { MARKER_TYPE } from "../store";
import PropTypes from "prop-types";
import { SIDEBAR_WIDTH_PX } from "./Sidebar";
import { clickMarker } from "../actions";
import marker_black from "../assets/marker_img/marker_black.png";
import marker_blue from "../assets/marker_img/marker_blue.png";
// import marker_green from "../assets/marker_img/marker_green.png";
import marker_new from "../assets/marker_img/marker_new_3.png";
import marker_red from "../assets/marker_img/marker_red.png";
import renderMarkerPopupContent from "./MarkerPopupContent";
import { useEffect } from "react";

const ACTIVE_MARKER_IMG_SIZE = { width: 40, height: 40 };
const INACTIVE_MARKER_IMG_SIZE = { width: 32, height: 32 };

const markerImageMap = {
  [MARKER_TYPE.FOUND_ITEM]: marker_black,
  [MARKER_TYPE.STRONGHOLD]: marker_blue,
  [MARKER_TYPE.PINNED]: marker_new,
  [MARKER_TYPE.CLICKED]: marker_red,
};

const getSidebarOffset = (projection) => {
  // click event causes the sidebar to open, so we need to adjust the map center
  const sidebarTopLeft = projection.coordsFromContainerPoint(
    // eslint-disable-next-line no-undef
    new kakao.maps.Point(0, 0)
  );
  const sidebarTopRight = projection.coordsFromContainerPoint(
    // eslint-disable-next-line no-undef
    new kakao.maps.Point(SIDEBAR_WIDTH_PX, 0)
  );

  return {
    lat: (sidebarTopLeft.getLat() - sidebarTopRight.getLat()) / 2,
    lng: (sidebarTopLeft.getLng() - sidebarTopRight.getLng()) / 2,
  };
};

const CustomMarker = ({ id, marker, isActive }) => {
  const { type, latlng } = marker;
  const dispatch = useDispatch();
  const map = useMap();
  const projection = map.getProjection();
  const scene = useSelector(selectScene);
  const { opened: sidebarOpened } = useSelector(selectSidebar);

  useEffect(() => {
    if (isActive) {
      // defer the panning to the next tick
      const timeout = setTimeout(() => {
        const offset = sidebarOpened
          ? getSidebarOffset(projection)
          : { lat: 0, lng: 0 };

        map.panTo(
          // eslint-disable-next-line no-undef
          new kakao.maps.LatLng(
            latlng.lat + offset.lat,
            latlng.lng + offset.lng
          )
        );
      }, 0);

      return () => clearTimeout(timeout);
    }
    // intentional dependency list: move the map only if the marker becomes active
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const popupContent = isActive
    ? renderMarkerPopupContent(scene, marker)
    : null;

  return (
    <MapMarker
      position={latlng}
      onClick={() => dispatch(clickMarker(id))}
      image={{
        src: markerImageMap[type],
        size: isActive ? ACTIVE_MARKER_IMG_SIZE : INACTIVE_MARKER_IMG_SIZE,
      }}
    >
      {popupContent}
    </MapMarker>
  );
};

CustomMarker.propTypes = {
  id: PropTypes.any.isRequired,
  marker: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default CustomMarker;
