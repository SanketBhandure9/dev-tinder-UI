const API_BASE_URL_LOCAL = "http://localhost:3000";
const API_BASE_URL_PROD = "/api";

export const USER_SIGNUP = API_BASE_URL_PROD + "/signup";
export const LOGIN_URL = API_BASE_URL_PROD + "/login";
export const LOGOUT_URL = API_BASE_URL_PROD + "/logout";
export const USER_FEED_URL = API_BASE_URL_PROD + "/user/feed";
export const PROFILE_VIEW_URL = API_BASE_URL_PROD + "/profile/view";
export const PROFILE_EDIT_URL = API_BASE_URL_PROD + "/profile/edit";
export const USER_CONNECTIONS_URL = API_BASE_URL_PROD + "/user/connections";
export const USER_REQUESTS_URL = API_BASE_URL_PROD + "/user/requests/received";
export const USER_REVIEW_REQUESTS_URL = API_BASE_URL_PROD + "/request/review";
export const USER_SEND_REQUESTS_URL = API_BASE_URL_PROD + "/request/send";
export const USER_REMOVE_CONNECTION =
  API_BASE_URL_PROD + "/user/connection/remove";
export const USER_DELETE_ACCOUNT_URL = API_BASE_URL_PROD + "/delete-account";
