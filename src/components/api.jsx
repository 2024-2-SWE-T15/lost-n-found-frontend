

export const transformMarkerData = (markerData) => {
  let diff = 0;
  return markerData.map(marker => ({
    id: marker.id,
    content: <div style={{ color: "#000" }}>{ marker.title}</div>, //테스트용
    latlng: { 
      lat: marker.coordinates[0],
      lng: marker.coordinates[1]
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