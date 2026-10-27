import React, { createContext, useContext } from "react";
import { defaultColors, type Colors } from "../theme";

type Direction = "rtl" | "ltr";

const ColorsContext = createContext<Colors>(defaultColors);
const DirectionContext = createContext<Direction>("rtl");

// Provides the colors and the text direction, and sets `dir` so that flex
// rows, text alignment and logical CSS properties follow the language.
export const ThemeProvider: React.FC<{
  colors: Colors;
  direction: Direction;
  children: React.ReactNode;
}> = ({ colors, direction, children }) => (
  <ColorsContext.Provider value={colors}>
    <DirectionContext.Provider value={direction}>
      <div dir={direction} style={{ position: "absolute", inset: 0 }}>
        {children}
      </div>
    </DirectionContext.Provider>
  </ColorsContext.Provider>
);

export const useColors = () => useContext(ColorsContext);
export const useDirection = () => useContext(DirectionContext);
