import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { REACT_APP_BASE_URL } from "@env";
import {
  AnswerRoutes,
  PairRoutes,
  QuestionRoutes,
  UserRoutes,
} from "@uaguape/routes";
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

const ApiContext = createContext<ControllerAxiosInstances>({
  users: axios.create(),
  answers: axios.create(),
  pairs: axios.create(),
  questions: axios.create(),
});

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { idToken, hasRefreshToken, onRefreshAuth } = useAuth();
  const [api, setApi] = useState<ControllerAxiosInstances>({} as any);

  useEffect(() => {
    if (idToken) {
      const authorization = `Bearer ${idToken}`;
      const newApi = controllers.reduce((acc, controller) => {
        const instance = axios.create({
          baseURL: `${REACT_APP_BASE_URL}${controller}`,
          headers: { Authorization: authorization },
        });
        instance.interceptors.response.use(
          (response: AxiosResponse) => response.data,
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
          }
        );
        acc[controller] = instance;
        return acc;
      }, {} as ControllerAxiosInstances);
      setApi(newApi);
    }
  }, [idToken, hasRefreshToken, onRefreshAuth]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
