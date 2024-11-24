import axios from "axios";

const BASE_URL = 'https://caring-sadly-marmoset.ngrok-free.app';

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

export const submitLostItem = async ({
  title,
  coordinates,
  category,
  description,
  base64DataArray,
  phoneNumber,
  birthDate,
}) => {
  // 요청 본문 구성
  const categoryArray = category.split(" ");
  const requestBody = {
    title: title,
    coordinates: coordinates || [null, null], // 좌표가 없을 경우 기본값
    hashtags: categoryArray,
    description: description,
    photos: base64DataArray,
    personal_idlist: {
      phone: phoneNumber,
      birth: birthDate,
    },
  };

  try {
    const response = await axios.post(`${BASE_URL}/post/lost`, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    console.log("Response from API:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server responded with error:", error.response.status);
      console.error("Error details:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error during request setup:", error.message);
    }
    throw error;
  }
};