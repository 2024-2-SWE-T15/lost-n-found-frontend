

export const transformMarkerData = (markerData) => {
  let diff = 0;
  return markerData.map(marker => ({
    id: marker.id,
    content: <div style={{ color: "#000" }}>{ marker.id}</div>, //테스트용
    latlng: { 
      lat: marker.coordinates[1] - 55.62786535,  //위도 (테스트용)
      lng: marker.coordinates[0] + 169.17110113 + 0.0005*(diff++), //경도 (테스트용)
    },
    isLost: marker.is_lost,
    matchRank: marker.match_rank,
    description: marker.description,
    createTime: marker.create_time,
    updateTime: marker.update_time,
    userId: marker.user_id,
    valid: marker.valid
  }));
}; 