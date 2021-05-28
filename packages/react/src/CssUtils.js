import React from "react";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// import { prefixer } from 'stylis'
import CssLayer from "./CssLayer";

const myCache = createCache({
  key: "util", // css-utils
});

const CssBase = () => (
  <CacheProvider value={myCache}>
    <CssLayer type="utils" />
  </CacheProvider>
);

export default CssBase;
