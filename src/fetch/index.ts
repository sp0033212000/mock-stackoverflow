import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { isBrowser } from "react-use/lib/misc/util";

import { loadingEventEmitter } from "@/event";

import { isNotEmptyArray } from "@/utils";

const baseURL = isBrowser
  ? `${window.location.origin}/rewrite/stackoverflow-api`
  : `${process.env.STACKOVERFLOW_API_URL}`;

const StackoverflowAPI = axios.create({
  baseURL,
});

const PureAPI = axios.create();

export const requestHandler = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
  const { disableLoader } = config;

  if (!disableLoader) {
    loadingEventEmitter.emit(true);
  }

  return config;
};

export const responseHandler = (response: AxiosResponse) => {
  if (!response.config.disableLoader) {
    loadingEventEmitter.emit(false);
  }
  return response;
};

export const responseErrorHandler = (error: AxiosError) => {
  loadingEventEmitter.emit(false);
  const data = error.response?.data as any;
  const config = error.config;
  if (!config?.disableAlert) {
    if (isBrowser) {
      const name: string = data?.name || "";
      const messages: Array<string> = data?.messages || [];
      if (isNotEmptyArray(messages)) {
        const isBypass = (error?.config?.bypassErrorNames || []).includes(name);
        if (!isBypass && Number(data?.code) !== 401) {
          alert(`
            name: ${name}
            message:
            ----> ${messages.join("\n----> ")}
          `);
        }
      }
    }
  }

  return Promise.reject(error);
};

StackoverflowAPI.interceptors.request.use(requestHandler);
StackoverflowAPI.interceptors.response.use(
  responseHandler,
  responseErrorHandler
);

PureAPI.interceptors.request.use(requestHandler);
PureAPI.interceptors.response.use(responseHandler, responseErrorHandler);

export { PureAPI };
export default StackoverflowAPI;
