import React from "react";
import {
  ThemeProvider as EmotionThemeProvider,
  CacheProvider,
} from "@emotion/react";
import createCache from "@emotion/cache";
import packageInfo from "@emotion/react/package.json";
import CssBase from "./CssBase";
import CssUtils from "./CssUtils";

const isObject = obj => typeof obj === "object" && obj !== null;

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

const createTheme = theme => {
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

const createContentCache = () => createCache({ key: "c" });

const contentCache = createContentCache();

const ThemeProvider = ({ children, theme, isSsr = true, cache, ...props }) => {
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
  const cacheValue = cache || isSsr ? createContentCache() : contentCache;
  // TODO: process theme with theme factory.
  return (
    <EmotionThemeProvider theme={createTheme(theme)} {...props}>
      <CssBase />
      <CacheProvider value={cacheValue}>{children}</CacheProvider>
      <CssUtils />
    </EmotionThemeProvider>
  );
};

export default ThemeProvider;
