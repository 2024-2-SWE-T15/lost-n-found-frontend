import axios from "axios";

export const fetchMarkers = async (lat, lng, distance) => {
  const response = await axios.get(
    `https://caring-sadly-marmoset.ngrok-free.app/marker/`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
      params: { lng, lat, distance },
    }
  );

  if (response.data && Array.isArray(response.data)) {
    console.log(response.data);
    return response.data.map((marker) => ({
      id: marker.id,
      title: marker.title,
      latlng: {
        lat: marker.coordinates[0],
        lng: marker.coordinates[1],
      },
      isLost: marker.is_lost,
      description: marker.description,
      createTime: marker.create_time,
      updateTime: marker.update_time,
      userId: marker.user_id,
    }));
  } else {
    throw new Error("Invalid response data: " + JSON.stringify(response.data));
  }
};
