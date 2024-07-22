import axios from "axios";
import { getAccesToken, saveAccessToken } from "@token-service";
const http = axios.create({
  baseURL: "https://service.olimjanov.uz/v1",
});
async function refreshAccessToken() {
  try {
    const refresh = getAccesToken("access_token");
    if (!refresh) {
      throw new Error("Refresh token not found.");
    }
    const response = await axios.get(
      `https://store.go-clothes.uz/v1/token/${refresh}`
    );
    const { access_token, refresh_token } = response.data;
    saveAccessToken("access_token", access_token);
    saveAccessToken("refresh_token", refresh_token);

    return access_token;
  } catch (error) {
    console.log(error);
  }
}

http.interceptors.request.use((config) => {
  const access_token = getAccesToken("access_token");
  if (access_token) {
    config.headers["Authorization"] = access_token;
  }
  return config;
});
http.interceptors.request.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      const access_token = await refreshAccessToken();
      if (access_token) {
        const originalRequest = error.config;
        originalRequest.headers["Authorization"] = access_token;
      } else {
        console.error(
          "Failed to refresh access token. Redirecting to login page..."
        );
        return Promise.reject(error);
      }
    }
  }
);
export default http;
