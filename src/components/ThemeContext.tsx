import React, { createContext, useContext } from "react";
import { defaultColors, type Colors } from "../theme";

const ColorsContext = createContext<Colors>(defaultColors);

export const ThemeProvider: React.FC<{
  colors: Colors;
  children: React.ReactNode;
}> = ({ colors, children }) => (
  <ColorsContext.Provider value={colors}>{children}</ColorsContext.Provider>
);

export const useColors = () => useContext(ColorsContext);
