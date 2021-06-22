import * as React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import CssLayer from "./CssLayer";

const utilsCache = createCache({
  key: "util",
});

const CssBase = () => (
  <CacheProvider value={utilsCache}>
    <CssLayer type="utils" /> {/* TODO: purgeCSS for Utils */}
  </CacheProvider>
);

export default CssBase;
