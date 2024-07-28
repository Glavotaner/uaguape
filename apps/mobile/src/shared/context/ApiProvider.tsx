import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
  useMemo,
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
import {
  CreateAnswerDto,
  QuestionDetailDto,
  UpdateUserDto,
  UserDto,
} from "uaguape-common";

const ApiContext = createContext<{
  users: {
    update: (dto: UpdateUserDto) => Promise<UserDto>;
    get: () => Promise<UserDto>;
  };
  questions: {
    daily: () => Promise<QuestionDetailDto>;
    detail: (id: string) => Promise<QuestionDetailDto>;
    answer: (id: string, dto: CreateAnswerDto) => Promise<QuestionDetailDto>;
  };
}>({
  users: {} as any,
  questions: {} as any,
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

  const endpoints = useMemo(() => {
    const users = {
      update: (dto: UpdateUserDto) =>
        api.users.patch<UserDto, UserDto>("", dto),
      get: () => api.users.get<UserDto, UserDto>(""),
    };
    const questions = {
      daily: () =>
        api.questions.get<QuestionDetailDto, QuestionDetailDto>(
          QuestionRoutes.DAILY
        ),
      detail: (id: string) =>
        api.questions.get<QuestionDetailDto, QuestionDetailDto>(id),
      answer: (id: string, dto: CreateAnswerDto) =>
        api.answers.post<QuestionDetailDto, QuestionDetailDto>(
          AnswerRoutes.QUESTION_ID.replace(":id", id),
          dto
        ),
    };
    return { users, questions };
  }, [idToken, hasRefreshToken, onRefreshAuth]);

  return (
    <ApiContext.Provider value={endpoints}>{children}</ApiContext.Provider>
  );
};
