import React, { createContext, ReactNode, useContext } from "react";
import { Theme } from "@react-navigation/native";

type AppTheme = Theme & {
  text: {
    size: {
      small: number;
      medium: number;
      large: number;
    };
  };
};

const theme: AppTheme = {
  dark: false,
  colors: {
    primary: "#029784",
    background: "#00C9A7",
    card: "#029784",
    text: "#00291C",
    border: "#FFA17A",
    notification: "#00C9A7",
  },
  text: {
    size: {
      small: 12,
      medium: 16,
      large: 20,
    },
  },
};

const ThemeContext = createContext<AppTheme>(theme);
export const useTheme = () => useContext(ThemeContext);
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
