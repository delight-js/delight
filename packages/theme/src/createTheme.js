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

export default createTheme;
