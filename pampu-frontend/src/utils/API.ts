import axios from "axios";
import config from "../config";

const instance = axios.create({
    baseURL: config.base,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
})

instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  
  export default instance;