import * as React from "react";
import { Global, useTheme } from "@emotion/react";
import { css } from "../css.js";
import { writeVars } from "../cssVars";

const CssLayer = ({ type }) => {
  // TODO: purgeCSS option (may be needed for utils)
  const theme = useTheme();
  // TODO: concat default vars
  const {
    render: {
      [type]: { vars = [], styles = [] },
    },
  } = theme;
  return (
    <React.Fragment>
      <Global
        styles={css(`
          ${vars
            .map(v =>
              Object.entries(v.vars)
                .map(w => writeVars(...w))
                .join("")
            )
            .join("")}
          ${Object.entries(styles)
            .map(([tag, tagStyles]) => `${tag} { ${tagStyles} }`)
            .join(" ")}
        `)(theme)}
      />
    </React.Fragment>
  );
};

export default CssLayer;
