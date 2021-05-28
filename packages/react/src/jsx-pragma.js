import { jsx as emotionJsx } from "@emotion/react";
import { ThemeContext } from "./react";
import { withTheme } from "./react";
// const cssParse = require("css/lib/parse");

// const getCSS = (props) => (theme) => {
//     const styles = css(props.sx)(theme)
//     const raw = typeof props.css === 'function' ? props.css(theme) : props.css
//     return [styles, raw]
//   }

// const parseProps = (props) => {
//   if (!props || (!props.sx && !props.css)) return props;
//   const next = {};
//   for (let key in props) {
//     if (key === 'sx') continue
//     next[key] = props[key]
//   }
//   next.css = getCSS(props)
//   return next
// };

const jsx = (element, props, ...children) => {
  //   const styles = props?.css?.styles;
  // if (!!styles) {
  //   console.log(element, cssParse(styles));
  // }

  return emotionJsx(element, props, ...children);
};

export default jsx;

// var obj = css.parse("body { font-size: 12px; }", options);
// css.stringify(obj, options);
