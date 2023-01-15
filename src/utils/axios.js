import axios from "axios";

axios.defaults.baseURL = "https://ecolane-api.zig-web.com/api/";
axios.interceptors.request.use(function (config) {
  const accessToken = sessionStorage.getItem("accessToken");
  const refreshToken = sessionStorage.getItem("refreshToken");

  if (config.url === "refresh") config.headers.Authorization = `Bearer ${refreshToken}`;
  else config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
});
axios.interceptors.response.use(
  (resp) => resp,
  async (err) => {
    //Handling refresh tokens
    if (err.response.data?.error === "token_expired") {
      const response = await axios.post(
        "refresh",
        {},
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("refreshToken")}` } }
      );
      if (response.status === 200) {
        sessionStorage.setItem("accessToken", response.data["access_token"]);
        return axios(err.config);
      }
    }
    //Handling widgets section
    if (err.response.data?.message === NEW_WIDGET_ERR) {
      console.log(err.response);
      await axios.post("AddWidgets", {
        WifiMacAddress: err.response.config.params.WifiMacAddress,
        widget1: false,
        widget2: false,
        widget3: false,
        widget4: false,
        widget5: false,
        widget6: false,
      });
      return axios(err.config);
    }
    return { ...err.response };
  }
);
const NEW_WIDGET_ERR = "No device found with the given Wifi Mac Address";
