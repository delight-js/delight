import React from "react";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import packageInfo from "@emotion/react/package.json";

const isObject = (obj) => typeof obj === "object" && obj !== null;

const walkObj = (obj, path = [], onEnd) => {
  if (isObject(obj)) {
    Object.entries(obj).forEach(([key, obj2]) =>
      walkObj(obj2, [...path, key], onEnd)
    );
  } else {
    onEnd({
      path,
      value: obj,
    });
  }
};

const createTheme = (theme) => {
  /*
   * 1. Read each domains config
   * 2. Process every domain
   * 3. Merge in theme
   *
   */
  const map = {};
  walkObj(theme.definitions, [], ({ path, value }) => {
    map[path.join("-")] = value;
  });
  return {
    type: "theme",
    definitions: theme.definitions,
    render: {
      base: theme.base || {},
      ui: theme.ui || {},
      utils: theme.utils || {},
    },
    map: {
      ...map,
      ...theme.ui,
    },
  };
};

export { createTheme };

const __EMOTION_VERSION__ = packageInfo.version;

export const Context = React.createContext({
  __EMOTION_VERSION__,
  theme: {},
});

export const useUmbrellaTheme = () => React.useContext(Context);

const ThemeProvider = ({ children, theme, ...props }) => {
  const outer = useUmbrellaTheme();
  if (process.env.NODE_ENV !== "production") {
    if (outer.__EMOTION_VERSION__ !== __EMOTION_VERSION__) {
      console.warn(
        "Multiple versions of Emotion detected,",
        "and theming might not work as expected.",
        "Please ensure there is only one copy of @emotion/react installed in your application."
      );
    }
  }
  // TODO: process theme with theme factory
  return (
    <EmotionThemeProvider theme={createTheme(theme)} {...props}>
      {children}
    </EmotionThemeProvider>
  );
};

export default ThemeProvider;
