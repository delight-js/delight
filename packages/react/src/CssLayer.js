/** @jsx jsx */
import React from "react";
import { Global, css, jsx, useTheme } from "./react";
import { writeVars } from "../utils/cssVars";

const CssLayer = ({ type }) => {
  const theme = useTheme();
  // TODO: concat default vars
  const {
    render: {
      [type]: { vars = [], styles = [] },
    },
  } = theme;
  return (
    <>
      <Global
        styles={css(`
          ${vars
            .map((v) =>
              Object.entries(v.vars)
                .map((w) => writeVars(...w))
                .join(""),
            )
            .join("")}
          ${Object.entries(styles)
            .map(([tag, tagStyles]) => `${tag} { ${tagStyles} }`)
            .join(" ")}
        `)(theme)}
      />
    </>
  );
};

export default CssLayer;
