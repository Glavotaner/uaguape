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

  const getRoute = (controller: string) => `${REACT_APP_BASE_URL}${controller}`;

  const api = {
    users: axios.create({ baseURL: getRoute(UserRoutes.BASE) }),
    answers: axios.create({ baseURL: getRoute(AnswerRoutes.BASE) }),
    pairs: axios.create({ baseURL: getRoute(PairRoutes.BASE) }),
    questions: axios.create({ baseURL: getRoute(QuestionRoutes.BASE) }),
  };

  const controllers = Object.values(api);

  controllers.forEach((controller) =>
    controller.interceptors.response.use(
      (response) => response.data,
      interceptor
    )
  );

  useEffect(() => {
    if (idToken) {
      const authorization = `Bearer ${idToken}`;
      controllers.forEach((controller) => {
        controller.defaults.headers.Authorization = authorization;
      });
    }
  }, [idToken]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
