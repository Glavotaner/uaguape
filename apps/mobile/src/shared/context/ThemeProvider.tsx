import React, { createContext, ReactNode, useContext } from "react";

type FontContextType = {
  size: {
    small: number;
    medium: number;
    large: number;
  };
};

const font: FontContextType = {
  size: {
    small: 12,
    medium: 16,
    large: 20,
  },
};

const FontContext = createContext<FontContextType>(font);
export const useFont = () => useContext(FontContext);
export const FontProvider = ({ children }: { children: ReactNode }) => {
  return <FontContext.Provider value={font}>{children}</FontContext.Provider>;
};
