import axios from "axios";
import { PLATFORM } from "enums/common";
import { toast } from "react-toastify";
import routes from "routes";
import { IHeader } from "./constants";
export const API_URL = process.env.NEXT_PUBLIC_API_END_POINT;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error?.response?.data?.code === 401) {
      handleUnauthorized();
      toast.error(error?.response?.data?.message);
      return;
    }
    console.error("API", "error", error);
    const errorMessage = error.response.data.message;
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
);

export function auth(platform: PLATFORM): IHeader {
  if (localStorage) {
    const token =
      localStorage?.getItem(`${platform}Token`) ??
      sessionStorage?.getItem(`${platform}Token`) ??
      "";
    return { Authorization: `Bearer ${token}` };
  }
  return { Authorization: `` };
}

export function handleUnauthorized(): void {
  if (window.location.href.includes(PLATFORM.CMS) && localStorage) {
    localStorage?.removeItem("cmsToken");
    localStorage?.removeItem("cmsUserId");
    setTimeout(() => {
      window.location.href = routes.cms.login.value;
    }, 3000);
  } else if (localStorage) {
    localStorage?.removeItem("websiteToken");
    localStorage?.removeItem("websiteUserId");
    window.location.reload;
  }
}

export function handleError(
  error: Error,
  filePath: string,
  functionName: string
) {
  const errorPath = `Error: ${filePath} -> ${functionName} -> error: ${error}`;
  console.error(errorPath, JSON.stringify(error));
}

export default api;
