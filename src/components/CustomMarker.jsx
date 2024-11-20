import {  MapMarker, useMap } from "react-kakao-maps-sdk";
import { SIDEBAR_WIDTH_PX } from "./Sidebar";
import PropTypes from 'prop-types';
import {  marker_types, temp_marker_types } from "../constants/map_const";
// @ts-ignore
import marker_red from "../assets/marker_img/marker_red.png";
// @ts-ignore
import marker_green from "../assets/marker_img/marker_green.png";
// @ts-ignore
import marker_blue from "../assets/marker_img/marker_blue.png";
// @ts-ignore
import marker_black from "../assets/marker_img/marker_black.png";
// @ts-ignore
import marker_new from "../assets/marker_img/marker_new_3.png";

const imageSize = { width: 32, height: 32 }

const CustomMarker = ({id, type, position,isPopupOpened ,popupContent,  onMarkerClick}) => {
  const map = useMap();
  const projection = map.getProjection();

  let marker_img = null;

  function MarkerClickFunc(position) {
    
    onMarkerClick(id, type);

    setTimeout(() => {
      // click event causes the sidebar to open, so we need to adjust the map center
      const sidebarTopLeft = projection.coordsFromContainerPoint(
        // eslint-disable-next-line no-undef
        new kakao.maps.Point(0, 0)
      );
      const sidebarTopRight = projection.coordsFromContainerPoint(
        // eslint-disable-next-line no-undef
        new kakao.maps.Point(SIDEBAR_WIDTH_PX, 0)
      );

      const latOffset =
        (sidebarTopLeft.getLat() - sidebarTopRight.getLat()) / 2;
      const lngOffset =
        (sidebarTopLeft.getLng() - sidebarTopRight.getLng()) / 2;

      // eslint-disable-next-line no-undef
      const newPosition = new kakao.maps.LatLng(
        position.getLat() + latOffset,
        position.getLng() + lngOffset
      );

      map.panTo(newPosition);
    }, 10);
  }


  //set marker image by type & phase
  switch (type) {

    case marker_types.KEPT_IDLE_PHASE:
      marker_img = marker_blue;
      break;
      
    case marker_types.KPET_CHOOSE_PHASE:
      marker_img = marker_green;
      break;
    case marker_types.FOUND:
      marker_img = marker_green;
      break;
    case marker_types.LOST:
      marker_img = marker_blue;
      break;

    case temp_marker_types.TEMP_UNSET:
      marker_img = marker_new;
      break;
  }


  return (
    <MapMarker
      position={position}
      onClick={(marker) => {
        MarkerClickFunc(marker.getPosition());
      }}
      image={{
        src: marker_img,
        size:  imageSize ,
        }}
    >
      {isPopupOpened && popupContent}
    </MapMarker>
  );
};

CustomMarker.propTypes = {
  
  id: PropTypes.any.isRequired,
  type : PropTypes.string.isRequired,
  position: PropTypes.object.isRequired,
  isPopupOpened: PropTypes.bool.isRequired,
  popupContent: PropTypes.node,
  onMarkerClick: PropTypes.func.isRequired,

};

export default CustomMarker;