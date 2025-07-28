export const API_BASE_URL_LOCAL = "http://localhost:3000";
const API_BASE_URL_PROD = "/api";

const BASE_URL =
  location.hostname === "localhost" ? API_BASE_URL_LOCAL : API_BASE_URL_PROD;

export const USER_SIGNUP = BASE_URL + "/signup";
export const LOGIN_URL = BASE_URL + "/login";
export const LOGOUT_URL = BASE_URL + "/logout";
export const USER_FEED_URL = BASE_URL + "/user/feed";
export const PROFILE_VIEW_URL = BASE_URL + "/profile/view";
export const PROFILE_EDIT_URL = BASE_URL + "/profile/edit";
export const USER_CONNECTIONS_URL = BASE_URL + "/user/connections";
export const USER_REQUESTS_URL = BASE_URL + "/user/requests/received";
export const USER_REVIEW_REQUESTS_URL = BASE_URL + "/request/review";
export const USER_SEND_REQUESTS_URL = BASE_URL + "/request/send";
export const USER_REMOVE_CONNECTION = BASE_URL + "/user/connection/remove";
export const USER_DELETE_ACCOUNT_URL = BASE_URL + "/delete-account";
export const USER_CHAT_HISTORY = BASE_URL + "/chat";
