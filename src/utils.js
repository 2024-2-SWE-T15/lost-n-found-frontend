import { SIDEBAR_FULL_WIDTH_PX } from "./components/Sidebar";

export const getSidebarLatLngOffset = (projection) => {
  // click event causes the sidebar to open, so we need to adjust the map center
  const sidebarTopLeft = projection.coordsFromContainerPoint(
    // eslint-disable-next-line no-undef
    new kakao.maps.Point(0, 0)
  );
  const sidebarTopRight = projection.coordsFromContainerPoint(
    // eslint-disable-next-line no-undef
    new kakao.maps.Point(SIDEBAR_FULL_WIDTH_PX, 0)
  );

  return {
    lat: (sidebarTopLeft.getLat() - sidebarTopRight.getLat()) / 2,
    lng: (sidebarTopLeft.getLng() - sidebarTopRight.getLng()) / 2,
  };
};
