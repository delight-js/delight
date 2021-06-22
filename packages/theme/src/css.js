// import React from "react";
import { css as emotionCss } from "@emotion/react";

const getClassFromTheme = theme => (match, themeLink) => {
  if (theme?.map && theme.map[themeLink]) {
    // parse the exchanged code one more time => allows the use of themeLinks in the themeLink definitions
    return parseCss(theme.map[themeLink], theme);
  }
  console.warn(`Theme link "${themeLink}" not found.`);
  return themeLink;
};

const isNumber = v => !Number.isNaN(v);

const nextNumber = currentIndex => (v, index) =>
  index > currentIndex && isNumber(v);

const createLinearFunction = (prev, next) => breakpoint => {
  const m = (next.v - prev.v) / (next.bp - prev.bp);
  const b = prev.v - m * prev.bp;

  return m * breakpoint + b;
};

const interpolateMediaqueries = theme => (
  match,
  g1,
  property,
  g3,
  stiffValues,
  g5,
  smoothValues,
  g7,
  g8,
  options,
  g10,
  unit
) => {
  if (!theme?.definitions?.breakpoint) {
    console.warn(`Breakpoints not defined.`);
    return match;
  }
  const breakpoints = Object.entries(theme.definitions.breakpoint);
  if (!(stiffValues || smoothValues)) {
    console.warn(`Values for mediaqueries not set.`);
    return match;
  }
  const shouldInterpolate = !!smoothValues;
  const values = (smoothValues || stiffValues)
    .split(",")
    .map(v => parseFloat(v.trim()));

  if (options) {
    try {
      options = JSON.parse(options.trim());
    } catch (e) {
      console.log(e);
    }
    if (
      !options.method ||
      !["floor", "round", "ceil"].includes(options.method)
    ) {
      options.method = "round";
    }
    options.step = parseFloat(options.step);
    if (Number.isNaN(options.step) || options.step <= 0) {
      options.step = unit === "em" ? 0.001 : 1;
    }
  }
  // TODO: line-height: {,40,,,,104}px; interpolate first value and start with mediaqueries from third value

  if (shouldInterpolate) {
    // TODO: create functions before the loop (DRY) and get them via iterator every time a new breakpoint appears
  }

  const output = [];

  for (let i = 0, len = values.length; i < len; i++) {
    if (Number.isNaN(values[i]) && !shouldInterpolate) {
      continue;
    }
    let before = "",
      after = "",
      finalValue;
    const breakpoint = breakpoints[i];
    if (breakpoint[0] !== "default") {
      before = `@media:${breakpoint[0]} {`;
      after = `}`;
    }
    if (!Number.isNaN(values[i])) {
      finalValue = values[i];
    } else if (shouldInterpolate) {
      // TODO: fluent interpolation like calc(4px + 0.2vw) when option.step < 0
      // calculate value between other values

      // get last

      // get next
      const nextIndex = values.findIndex(nextNumber(i));
      const prevIndex =
        len - 1 - [...values].reverse().findIndex(nextNumber(i));
      if (nextIndex < 0 || prevIndex < 0) {
        // TODO: can also interpolate edge cases from the next and second next value...
        continue;
      }

      // create formula
      const func = createLinearFunction(
        {
          v: values[prevIndex],
          bp: breakpoints[prevIndex][1],
        },
        {
          v: values[nextIndex],
          bp: breakpoints[nextIndex][1],
        }
      );
      finalValue = func(breakpoints[i][1]);
      if (options) {
        finalValue =
          Math[options.method](finalValue / options.step) * options.step;
      }
    }
    output.push(`${before}${property}: ${finalValue}${unit};${after}`);
  }
  return output.join("\n");
};

const expandMediaquery = theme => (match, breakpoint) => {
  if (
    theme?.definitions?.breakpoint &&
    theme.definitions.breakpoint[breakpoint]
  ) {
    return `@media screen and (min-width: ${theme.definitions.breakpoint[breakpoint]}px)`;
  }
  console.warn(`Breakpoint "${breakpoint}" not defined.`);
  return breakpoint;
};

const parseActions = [
  {
    name: "Map variables to their values",
    regExp: /\$([A-Za-z0-9._-]+)/gm,
    func: getClassFromTheme,
  },
  {
    name: "Map variables  a second time to parse ",
    regExp: /\$([A-Za-z0-9._-]+)/gm,
    func: getClassFromTheme,
  },
  {
    name: "Fill mediaqueries and interpolate",
    // regExp: /(^|\\s+|\}|;)([A-Za-z0-9-]+):\s*(\[(.*)\]|\{(.*)\})(\((.*)\))?([A-Za-z]*);/gm,
    regExp: /(^|\s+|\}|;)([A-Za-z0-9-]+):\s*(\[(((?!\]).)*)\]|\{(((?!\}).)*)\})(\((((?!\)).)*)\))?([A-Za-z]*);/gm,
    func: interpolateMediaqueries,
  },
  {
    name: "Turn media:<breakpoint> short notes into real mediaqueries.",
    regExp: /@media:([A-Za-z0-9._-]+)/gm,
    func: expandMediaquery,
  },
];

/*
 * Replace all theme links
 * @param {string} style - The preprocessed css string with theme links included.
 */
const parseCss = (style, theme) => {
  // TODO: style may be an object
  if (typeof style !== "string") {
    return style;
  }
  let newStyle = style;

  for (let i = 0, len = parseActions.length; i < len; i++) {
    const action = parseActions[i];
    newStyle = newStyle.replace(action.regExp, action.func(theme));
  }
  return newStyle;
};

export { parseCss };

const css = (...args) => theme => {
  const newArgs = args.map(a => parseCss(a, theme));
  return emotionCss(...newArgs);
};

export { css };
