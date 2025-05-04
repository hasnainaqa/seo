import axios from "axios";
import { toast } from "sonner";
import { appConfig } from "@/lib/app-config";

// when call the api use this api client so have common error handling for all the api of commonly used api's

const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    let message = "";
    if (error.response?.status === 401) {
      // User not auth, ask to re login
      window.location.href = appConfig.auth.login;
    } else if (error.response?.status === 403) {
      // User not authorized, must purchase/pick a plan
      window.location.href = appConfig.lemonsqueezy.billingRoute;
    } else {
      message = error?.response?.data?.message || error?.response?.data?.error;
    }

    error.message =
      typeof message === "string" ? message : JSON.stringify(message);

    console.error(error.message);

    // Automatically display errors to the user
    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("something went wrong...");
    }
    return Promise.reject(error);
  }
);
export default apiClient;
