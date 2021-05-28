/**
 * Creates the variable meta data for a single set
 * @param {string} prefix - A string that helps to classify the created vars.
 * @param {object} set - A object with sets of variables to build referencing the tokens provided (key will be the name for the conditional class).
 * @param {object} tokens - Abstract values might be used by this set.
 */
const createVars = (prefix, set, tokens) =>
  Object.entries(set).reduce((acc, [name, token]) => {
    return [
      ...acc,
      {
        var: `--${prefix}${name}`,
        val: tokens[token],
        alias: name,
      },
    ];
  }, []);

// .map(([name, token]) => ({
//   var: `--${prefix}${name}`,
//   val: tokens[token],
//   alias: name,
// }));

/**
 * Cuts
 * @param {string} prefix - A string that helps to classify the created vars.
 * @param {object} set - A object with sets of variables to build referencing the tokens provided (key will be the name for the conditional class).
 * @param {object} tokens - Abstract values might be used by this set.
 */
const createResponsiveVars = (prefix, set, tokens) => {
  return {
    Test: "RING",
  };
};

/**
 * Creates an object containing variables for interoperable use.
 * @param {string} prefix - A string that helps to classify the created vars.
 * @param {object} sets - A object with sets of variables to build referencing the tokens provided (key will be the name for the conditional class).
 * @param {object} tokens - Abstract values being used by the sets.
 */
const createThemeVars = (prefix = "", sets, tokens) => {
  prefix += prefix.length ? "-" : "";
  return Object.entries(sets).reduce(
    (acc, [setName, set]) => ({
      ...acc,
      [setName]: Array.isArray(set)
        ? createResponsiveVars(prefix, set, tokens)
        : createVars(prefix, set, tokens),
    }),
    {}
  );
};

export default createThemeVars;

const createMap = (vars) =>
  (vars.default || Object.values(vars)[0]).reduce(
    (acc, cur) => ({ ...acc, [cur.alias]: `var(${cur.var})` }),
    {}
  );

export { createMap };

/**
 * Creates a string in css syntax
 * @param {string} set - Name of the set.
 * @param {array} vars - Array of sets of objects with var, val, alias.
 */
const writeVars = (set, vars) =>
  `${set === "default" ? ":root" : `.theme-${set}`} { ${vars.reduce(
    (acc, cur) => (acc += `${cur.var}:${cur.val};`),
    ""
  )} }`;

export { writeVars };

/**
 * Resolves a var from a given domain, set and name
 * @param {object} domain - Provides the config of a given domain.
 * @param {string} name - The name of the var to search for.
 */
const getVar = (domain, name) => domain.map[name];

export { getVar };
