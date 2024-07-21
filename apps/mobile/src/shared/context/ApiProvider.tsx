import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios, { AxiosError, AxiosInstance } from "axios";
import { REACT_APP_BASE_URL } from "@env";
import {
  AnswerRoutes,
  PairRoutes,
  QuestionRoutes,
  UserRoutes,
} from "uaguape-routes";
import { useAuth } from "./AuthProvider";

const controllers = [
  UserRoutes.BASE,
  QuestionRoutes.BASE,
  AnswerRoutes.BASE,
  PairRoutes.BASE,
] as const;

type ControllerNames = (typeof controllers)[number];

type ControllerAxiosInstances = {
  [K in ControllerNames]: AxiosInstance;
};

const generateControllers = () =>
  controllers.reduce(
    (controllers, controller) => ({
      ...controllers,
      [controller]: axios.create({
        baseURL: `${REACT_APP_BASE_URL}${controller}`,
      }),
    }),
    {} as ControllerAxiosInstances
  );

const ApiContext = createContext<ControllerAxiosInstances>(
  generateControllers()
);

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { idToken, hasRefreshToken, onRefreshAuth } = useAuth();

  const interceptor = useCallback(
    async (error: AxiosError) => {
      const isUnauthorized = error.response?.status === 403;
      if (isUnauthorized && hasRefreshToken) {
        const refreshedToken = await onRefreshAuth();
        if (!refreshedToken) {
          throw new Error("Unauthorized");
        }
        const retriedResponse = await axios.request({
          ...error.config,
          headers: { Authorization: `Bearer ${refreshedToken}` },
        });
        return retriedResponse;
      }
      throw error;
    },
    [hasRefreshToken, onRefreshAuth]
  );

  const api = generateControllers();

  const controllers = Object.values(api);

  controllers.forEach((controller) =>
    controller.interceptors.response.use((response) => response, interceptor)
  );

  useEffect(() => {
    if (idToken) {
      const authorization = `Bearer ${idToken}`;
      console.log(authorization);
      controllers.forEach((controller) => {
        controller.defaults.headers.Authorization = authorization;
      });
    }
  }, [idToken]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
