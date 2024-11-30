import axios from "axios";

const BASE_URL = "https://inspired-terrapin-organic.ngrok-free.app";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "ngrok-skip-browser-warning": true,
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const checkLogin = async () => {
  await api.get("/auth/verification");
};

export const login = (provider) => {
  const redirectUrl = encodeURIComponent(window.location.origin + "/");
  window.location.href = `${BASE_URL}/auth/login/${provider}?redirect_url=${redirectUrl}`;
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
      createTime: marker.create_time,
      thumbnail: marker.thumbnail,
      hashtags: marker.hashtags,
    }));
  } else {
    throw new Error("Invalid response data: " + JSON.stringify(response.data));
  }
};

export const searchPosts = async ({ query, tags, lat, lng, distance }) => {
  const response = await api.get("/post/search/", {
    params: {
      query,
      tags,
      coordinates: [lat, lng],
      distance,
      limit: 30,
    },
    paramsSerializer: {
      indexes: null,
    },
  });

  console.log("Response from API:", response.data);
  return response.data.map((post) => ({
    id: post.id,
    latlng: {
      lat: post.coordinates[0],
      lng: post.coordinates[1],
    },
    title: post.title,
    thumbnail: post.thumbnail,
    hashtags: post.hashtags,
    createTime: post.create_time,
  }));
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

export const fetchPost = async (postId) => {
  const response = await api.get("/post", {
    params: { post_id: postId },
  });

  console.log("Fetched post:", response.data);
  return {
    id: response.data.id,
    title: response.data.title,
    description: response.data.description,
    isLost: response.data.is_lost,
    createTime: response.data.create_time,
    hashtags: response.data.hashtags,
    nickname: response.data.nickname,
    coordinates: {
      lat: response.data.coordinates[0],
      lng: response.data.coordinates[1],
    },
    keptCoordinates: response.data.kept_place?.stronghold?.coordinates
      ? {
          lat: response.data.kept_place.stronghold.coordinates[0],
          lng: response.data.kept_place.stronghold.coordinates[1],
        }
      : null,
  };
};

export const fetchPostPhotos = async (postId) => {
  const response = await api.get(`/post/${postId}/image/`);
  console.log("Fetched post photos:", response.data);
  return response.data;
};

export const fetchPostRecommendations = async (postId) => {
  const response = await api.get("/post/recommand/", {
    params: { post_id: postId },
  });

  console.log("Fetched recommendations:", response.data);
  return {
    lost: (response.data.lost || []).map((post) => ({
      id: post.id,
      title: post.title,
      hashtags: post.tags,
      thumbnail: post.thumbnail,
    })),
    found: (response.data.found || []).map((post) => ({
      id: post.id,
      title: post.title,
      hashtags: post.tags,
      thumbnail: post.thumbnail,
    })),
  };
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

// 사용자 정보 가져오기
export const fetchUserInfo = async () => {
  try {
    const response = await api.get("/auth/userinfo");
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

// 사용자 정보 업데이트
export const updateUserInfo = async (payload) => {
  try {
    const response = await api.put("/auth/", payload);
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};
