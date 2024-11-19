import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";
import { SIDEBAR_WIDTH_PX } from "./Sidebar";
import PropTypes from 'prop-types';
import { phases, marker_types } from "../constants/map_const";
// @ts-ignore
import marker_red from "../assets/marker_img/marker_red.png";
// @ts-ignore
import marker_green from "../assets/marker_img/marker_green.png";
// @ts-ignore
import marker_blue from "../assets/marker_img/marker_blue.png";
// @ts-ignore
import marker_black from "../assets/marker_img/marker_black.png";


const imageSize = { width: 32, height: 32 }

const MarkerFactory = ({ position, content, id, selectedMarkerId, onMarkerClick, phase, type}) => {
  const map = useMap();
  const projection = map.getProjection();

  let marker_img = null;

  function MarkerClickFunc(position, id) {
    
    onMarkerClick(id);

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

    case marker_types.KEEPED:
      if(phase === phases.IDLE){
        marker_img = marker_blue;
      }
      else if (phase === phases.CHOOSE_LOST_OR_FOUND){
        marker_img = marker_green;
      }

      break;
    case marker_types.FOUND:
      marker_img = marker_green;
      break;
    case marker_types.LOST:
      marker_img = marker_blue;
      break;
    case marker_types.CLICK_GROUND:
      marker_img = marker_red;
      break;  
  }


  return (
    //custo
    <MapMarker
      position={position}
      onClick={(marker) => {
        MarkerClickFunc(marker.getPosition(), id);
      }}
      image={{
        src: marker_img,
        size:  imageSize ,
        }}
    >
      {selectedMarkerId === id && content}
    </MapMarker>
  );
};

MarkerFactory.propTypes = {
  position: PropTypes.object.isRequired,
  content: PropTypes.node,
  id: PropTypes.any.isRequired,
  onMarkerClick: PropTypes.func.isRequired,
  selectedMarkerId: PropTypes.any,
  phase : PropTypes.string.isRequired,
  type : PropTypes.string.isRequired

};

export default MarkerFactory;