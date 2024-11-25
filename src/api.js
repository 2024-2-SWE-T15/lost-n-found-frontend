import axios from "axios";

const api = axios.create({
  baseURL: "https://caring-sadly-marmoset.ngrok-free.app",
  headers: {
    "ngrok-skip-browser-warning": true,
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const checkLogin = async () => {
  await api.get("/auth/verification");
};

export const fetchMarkers = async (lat, lng, distance) => {
  const response = await api.get("/marker", {
    params: { lng, lat, distance },
  });

  if (response.data && Array.isArray(response.data)) {
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
      thumbnail: marker.thumbnail,
    }));
  } else {
    throw new Error("Invalid response data: " + JSON.stringify(response.data));
  }
};

export const fetchStrongholdMarkers = async (lat, lng, distance) => {
  const response = await api.get("/marker/stronghold", {
    params: { lng, lat, distance },
  });

  if (response.data && Array.isArray(response.data)) {
    return response.data.map((marker) => ({
      id: marker.id,
      name: marker.name,
      description: marker.description,
      latlng: {
        lat: marker.coordinates[0],
        lng: marker.coordinates[1],
      },
    }));
  } else {
    throw new Error("Invalid response data: " + JSON.stringify(response.data));
  }
};

export const submitLostItem = async ({
  title,
  coordinates,
  categories,
  description,
  photos,
  phoneNumber,
  birthDate,
}) => {
  // 요청 본문 구성
  const hashtags = categories.split(" ");
  const requestBody = {
    title,
    coordinates,
    hashtags,
    description,
    photos,
    personal_idlist: {
      phone: phoneNumber,
      birth: birthDate,
    },
  };

  try {
    const response = await api.post("/post/lost", requestBody);

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

export const createStrongholdMarker = async (payload) => {
  try {
    const response = await api.post("/marker/stronghold", payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log("Fetched stronghold markers:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating stronghold marker:",
      error.response || error.message
    );
    throw error;
  }
};

export const registerFoundItem = async ({
  title,
  coordinates,
  keptCoordinates,
  strongholdId,
  categories,
  description,
  photos,
  phoneNumber,
  birthDate,
}) => {
  const hashtags = categories.split(" ");
  const requestBody = {
    title,
    coordinates,
    kept_coordinates: keptCoordinates,
    stronghold_id: strongholdId,
    hashtags,
    description,
    photos,
    personal_idlist: {
      phone: phoneNumber,
      birth: birthDate,
    },
  };
  try {
    const response = await api.post("/post/found", requestBody);
    console.log("POST /post/found response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error registering found item:",
      error.response || error.message
    );
    throw error;
  }
};
