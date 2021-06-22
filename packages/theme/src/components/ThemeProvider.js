import * as React from "react";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import createTheme from "../createTheme";
import CssBase from "./CssBase";
import CssUtils from "./CssUtils";

const ThemeProvider = ({ children, theme, ...props }) => (
  <EmotionThemeProvider theme={createTheme(theme)} {...props}>
    <CssBase />
    {children}
    <CssUtils />
  </EmotionThemeProvider>
);

export default ThemeProvider;
