import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as Auth from "react-native-app-auth";
import { REACT_APP_BASE_URL, REACT_APP_OAUTH_CLIENT_ID } from "@env";
import { StorageKeys, useStorage } from "../hooks/storage";
import axios from "axios";
import { UserRoutes } from "@uaguape/routes";

type AuthState = {
  idToken: string;
  refreshToken: string;
};

const AuthContext = createContext<{
  idToken: string | null;
  onRefreshAuth: () => Promise<string | null>;
  hasRefreshToken: boolean;
  hasAuth: boolean;
  isAuthReady: boolean;
}>({
  idToken: null,
  onRefreshAuth: async () => null,
  hasRefreshToken: false,
  hasAuth: false,
  isAuthReady: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [getAuth, setAuth] = useStorage(StorageKeys.AUTH_STATE);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const authConfig: Auth.AuthConfiguration = {
    issuer: "https://accounts.google.com",
    clientId: `${REACT_APP_OAUTH_CLIENT_ID}.apps.googleusercontent.com`,
    redirectUrl: `com.googleusercontent.apps.${REACT_APP_OAUTH_CLIENT_ID}:/oauth2redirect/google`,
    scopes: ["openid", "profile", "email"],
  };

  const authorize = async () => {
    try {
      let storedAuth = await getAuth();
      if (storedAuth == null) {
        storedAuth = await Auth.authorize(authConfig);
        await axios.post(
          `${REACT_APP_BASE_URL}${UserRoutes.BASE}/${UserRoutes.REGISTER}`,
          null,
          {
            headers: { Authorization: `Bearer ${storedAuth.idToken}` },
          }
        );
      }
      setAuthState(storedAuth);
    } finally {
      setIsAuthReady(true);
    }
  };

  const refreshAuth = useCallback(async () => {
    if (authState?.refreshToken) {
      const refreshedState = await Auth.refresh(authConfig, {
        refreshToken: authState.refreshToken,
      });
      setAuthState({
        ...refreshedState,
        refreshToken: authState.refreshToken,
      });
      return refreshedState.idToken;
    }
    return null;
  }, [authState?.refreshToken]);

  useEffect(() => {
    authorize();
  }, []);

  useEffect(() => {
    if (authState) {
      setAuth(authState);
    }
  }, [authState]);

  return (
    <AuthContext.Provider
      value={{
        idToken: authState?.idToken ?? null,
        onRefreshAuth: refreshAuth,
        isAuthReady,
        hasAuth: authState !== null,
        hasRefreshToken: authState?.refreshToken !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
