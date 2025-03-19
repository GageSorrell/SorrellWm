(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/ansi-styles/index.js":
/*!*******************************************!*\
  !*** ./node_modules/ansi-styles/index.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* module decorator */ module = __webpack_require__.nmd(module);


const wrapAnsi16 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => (...args) => {
	const rgb = fn(...args);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

const ansi2ansi = n => n;
const rgb2rgb = (r, g, b) => [r, g, b];

const setLazyProperty = (object, property, get) => {
	Object.defineProperty(object, property, {
		get: () => {
			const value = get();

			Object.defineProperty(object, property, {
				value,
				enumerable: true,
				configurable: true
			});

			return value;
		},
		enumerable: true,
		configurable: true
	});
};

/** @type {typeof import('color-convert')} */
let colorConvert;
const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
	if (colorConvert === undefined) {
		colorConvert = __webpack_require__(/*! color-convert */ "./node_modules/color-convert/index.js");
	}

	const offset = isBackground ? 10 : 0;
	const styles = {};

	for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
		const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
		if (sourceSpace === targetSpace) {
			styles[name] = wrap(identity, offset);
		} else if (typeof suite === 'object') {
			styles[name] = wrap(suite[targetSpace], offset);
		}
	}

	return styles;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
	setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});


/***/ }),

/***/ "./node_modules/bindings/bindings.js":
/*!*******************************************!*\
  !*** ./node_modules/bindings/bindings.js ***!
  \*******************************************/
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

var fs = __webpack_require__(/*! fs */ "fs"),
  path = __webpack_require__(/*! path */ "path"),
  fileURLToPath = __webpack_require__(/*! file-uri-to-path */ "./node_modules/file-uri-to-path/index.js"),
  join = path.join,
  dirname = path.dirname,
  exists =
    (fs.accessSync &&
      function(path) {
        try {
          fs.accessSync(path);
        } catch (e) {
          return false;
        }
        return true;
      }) ||
    fs.existsSync ||
    path.existsSync,
  defaults = {
    arrow: process.env.NODE_BINDINGS_ARROW || ' → ',
    compiled: process.env.NODE_BINDINGS_COMPILED_DIR || 'compiled',
    platform: process.platform,
    arch: process.arch,
    nodePreGyp:
      'node-v' +
      process.versions.modules +
      '-' +
      process.platform +
      '-' +
      process.arch,
    version: process.versions.node,
    bindings: 'bindings.node',
    try: [
      // node-gyp's linked version in the "build" dir
      ['module_root', 'build', 'bindings'],
      // node-waf and gyp_addon (a.k.a node-gyp)
      ['module_root', 'build', 'Debug', 'bindings'],
      ['module_root', 'build', 'Release', 'bindings'],
      // Debug files, for development (legacy behavior, remove for node v0.9)
      ['module_root', 'out', 'Debug', 'bindings'],
      ['module_root', 'Debug', 'bindings'],
      // Release files, but manually compiled (legacy behavior, remove for node v0.9)
      ['module_root', 'out', 'Release', 'bindings'],
      ['module_root', 'Release', 'bindings'],
      // Legacy from node-waf, node <= 0.4.x
      ['module_root', 'build', 'default', 'bindings'],
      // Production "Release" buildtype binary (meh...)
      ['module_root', 'compiled', 'version', 'platform', 'arch', 'bindings'],
      // node-qbs builds
      ['module_root', 'addon-build', 'release', 'install-root', 'bindings'],
      ['module_root', 'addon-build', 'debug', 'install-root', 'bindings'],
      ['module_root', 'addon-build', 'default', 'install-root', 'bindings'],
      // node-pre-gyp path ./lib/binding/{node_abi}-{platform}-{arch}
      ['module_root', 'lib', 'binding', 'nodePreGyp', 'bindings']
    ]
  };

/**
 * The main `bindings()` function loads the compiled bindings for a given module.
 * It uses V8's Error API to determine the parent filename that this function is
 * being invoked from, which is then used to find the root directory.
 */

function bindings(opts) {
  // Argument surgery
  if (typeof opts == 'string') {
    opts = { bindings: opts };
  } else if (!opts) {
    opts = {};
  }

  // maps `defaults` onto `opts` object
  Object.keys(defaults).map(function(i) {
    if (!(i in opts)) opts[i] = defaults[i];
  });

  // Get the module root
  if (!opts.module_root) {
    opts.module_root = exports.getRoot(exports.getFileName());
  }

  // Ensure the given bindings name ends with .node
  if (path.extname(opts.bindings) != '.node') {
    opts.bindings += '.node';
  }

  // https://github.com/webpack/webpack/issues/4175#issuecomment-342931035
  var requireFunc =
     true
      ? require
      : 0;

  var tries = [],
    i = 0,
    l = opts.try.length,
    n,
    b,
    err;

  for (; i < l; i++) {
    n = join.apply(
      null,
      opts.try[i].map(function(p) {
        return opts[p] || p;
      })
    );
    tries.push(n);
    try {
      b = opts.path ? requireFunc.resolve(n) : requireFunc(n);
      if (!opts.path) {
        b.path = n;
      }
      return b;
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND' &&
          e.code !== 'QUALIFIED_PATH_RESOLUTION_FAILED' &&
          !/not find/i.test(e.message)) {
        throw e;
      }
    }
  }

  err = new Error(
    'Could not locate the bindings file. Tried:\n' +
      tries
        .map(function(a) {
          return opts.arrow + a;
        })
        .join('\n')
  );
  err.tries = tries;
  throw err;
}
module.exports = exports = bindings;

/**
 * Gets the filename of the JavaScript file that invokes this function.
 * Used to help find the root directory of a module.
 * Optionally accepts an filename argument to skip when searching for the invoking filename
 */

exports.getFileName = function getFileName(calling_file) {
  var origPST = Error.prepareStackTrace,
    origSTL = Error.stackTraceLimit,
    dummy = {},
    fileName;

  Error.stackTraceLimit = 10;

  Error.prepareStackTrace = function(e, st) {
    for (var i = 0, l = st.length; i < l; i++) {
      fileName = st[i].getFileName();
      if (fileName !== __filename) {
        if (calling_file) {
          if (fileName !== calling_file) {
            return;
          }
        } else {
          return;
        }
      }
    }
  };

  // run the 'prepareStackTrace' function above
  Error.captureStackTrace(dummy);
  dummy.stack;

  // cleanup
  Error.prepareStackTrace = origPST;
  Error.stackTraceLimit = origSTL;

  // handle filename that starts with "file://"
  var fileSchema = 'file://';
  if (fileName.indexOf(fileSchema) === 0) {
    fileName = fileURLToPath(fileName);
  }

  return fileName;
};

/**
 * Gets the root directory of a module, given an arbitrary filename
 * somewhere in the module tree. The "root directory" is the directory
 * containing the `package.json` file.
 *
 *   In:  /home/nate/node-native-module/lib/index.js
 *   Out: /home/nate/node-native-module
 */

exports.getRoot = function getRoot(file) {
  var dir = dirname(file),
    prev;
  while (true) {
    if (dir === '.') {
      // Avoids an infinite loop in rare cases, like the REPL
      dir = process.cwd();
    }
    if (
      exists(join(dir, 'package.json')) ||
      exists(join(dir, 'node_modules'))
    ) {
      // Found the 'package.json' file or 'node_modules' dir; we're done
      return dir;
    }
    if (prev === dir) {
      // Got to the top
      throw new Error(
        'Could not find module root given file: "' +
          file +
          '". Do you have a `package.json` file? '
      );
    }
    // Try the parent dir next
    prev = dir;
    dir = join(dir, '..');
  }
};


/***/ }),

/***/ "./node_modules/chalk/source/index.js":
/*!********************************************!*\
  !*** ./node_modules/chalk/source/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const ansiStyles = __webpack_require__(/*! ansi-styles */ "./node_modules/ansi-styles/index.js");
const {stdout: stdoutColor, stderr: stderrColor} = __webpack_require__(/*! supports-color */ "./node_modules/supports-color/index.js");
const {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
} = __webpack_require__(/*! ./util */ "./node_modules/chalk/source/util.js");

const {isArray} = Array;

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
	'ansi',
	'ansi',
	'ansi256',
	'ansi16m'
];

const styles = Object.create(null);

const applyOptions = (object, options = {}) => {
	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === undefined ? colorLevel : options.level;
};

class ChalkClass {
	constructor(options) {
		// eslint-disable-next-line no-constructor-return
		return chalkFactory(options);
	}
}

const chalkFactory = options => {
	const chalk = {};
	applyOptions(chalk, options);

	chalk.template = (...arguments_) => chalkTag(chalk.template, ...arguments_);

	Object.setPrototypeOf(chalk, Chalk.prototype);
	Object.setPrototypeOf(chalk.template, chalk);

	chalk.template.constructor = () => {
		throw new Error('`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');
	};

	chalk.template.Instance = ChalkClass;

	return chalk.template;
};

function Chalk(options) {
	return chalkFactory(options);
}

for (const [styleName, style] of Object.entries(ansiStyles)) {
	styles[styleName] = {
		get() {
			const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
			Object.defineProperty(this, styleName, {value: builder});
			return builder;
		}
	};
}

styles.visible = {
	get() {
		const builder = createBuilder(this, this._styler, true);
		Object.defineProperty(this, 'visible', {value: builder});
		return builder;
	}
};

const usedModels = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256'];

for (const model of usedModels) {
	styles[model] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

for (const model of usedModels) {
	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

const proto = Object.defineProperties(() => {}, {
	...styles,
	level: {
		enumerable: true,
		get() {
			return this._generator.level;
		},
		set(level) {
			this._generator.level = level;
		}
	}
});

const createStyler = (open, close, parent) => {
	let openAll;
	let closeAll;
	if (parent === undefined) {
		openAll = open;
		closeAll = close;
	} else {
		openAll = parent.openAll + open;
		closeAll = close + parent.closeAll;
	}

	return {
		open,
		close,
		openAll,
		closeAll,
		parent
	};
};

const createBuilder = (self, _styler, _isEmpty) => {
	const builder = (...arguments_) => {
		if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
			// Called as a template literal, for example: chalk.red`2 + 3 = {bold ${2+3}}`
			return applyStyle(builder, chalkTag(builder, ...arguments_));
		}

		// Single argument is hot path, implicit coercion is faster than anything
		// eslint-disable-next-line no-implicit-coercion
		return applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));
	};

	// We alter the prototype because we must return a function, but there is
	// no way to create a function with a different prototype
	Object.setPrototypeOf(builder, proto);

	builder._generator = self;
	builder._styler = _styler;
	builder._isEmpty = _isEmpty;

	return builder;
};

const applyStyle = (self, string) => {
	if (self.level <= 0 || !string) {
		return self._isEmpty ? '' : string;
	}

	let styler = self._styler;

	if (styler === undefined) {
		return string;
	}

	const {openAll, closeAll} = styler;
	if (string.indexOf('\u001B') !== -1) {
		while (styler !== undefined) {
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			string = stringReplaceAll(string, styler.close, styler.open);

			styler = styler.parent;
		}
	}

	// We can move both next actions out of loop, because remaining actions in loop won't have
	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
	const lfIndex = string.indexOf('\n');
	if (lfIndex !== -1) {
		string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
	}

	return openAll + string + closeAll;
};

let template;
const chalkTag = (chalk, ...strings) => {
	const [firstString] = strings;

	if (!isArray(firstString) || !isArray(firstString.raw)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return strings.join(' ');
	}

	const arguments_ = strings.slice(1);
	const parts = [firstString.raw[0]];

	for (let i = 1; i < firstString.length; i++) {
		parts.push(
			String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'),
			String(firstString.raw[i])
		);
	}

	if (template === undefined) {
		template = __webpack_require__(/*! ./templates */ "./node_modules/chalk/source/templates.js");
	}

	return template(chalk, parts.join(''));
};

Object.defineProperties(Chalk.prototype, styles);

const chalk = Chalk(); // eslint-disable-line new-cap
chalk.supportsColor = stdoutColor;
chalk.stderr = Chalk({level: stderrColor ? stderrColor.level : 0}); // eslint-disable-line new-cap
chalk.stderr.supportsColor = stderrColor;

module.exports = chalk;


/***/ }),

/***/ "./node_modules/chalk/source/templates.js":
/*!************************************************!*\
  !*** ./node_modules/chalk/source/templates.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";

const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;

const ESCAPES = new Map([
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
	['b', '\b'],
	['f', '\f'],
	['v', '\v'],
	['0', '\0'],
	['\\', '\\'],
	['e', '\u001B'],
	['a', '\u0007']
]);

function unescape(c) {
	const u = c[0] === 'u';
	const bracket = c[1] === '{';

	if ((u && !bracket && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
		return String.fromCharCode(parseInt(c.slice(1), 16));
	}

	if (u && bracket) {
		return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
	}

	return ESCAPES.get(c) || c;
}

function parseArguments(name, arguments_) {
	const results = [];
	const chunks = arguments_.trim().split(/\s*,\s*/g);
	let matches;

	for (const chunk of chunks) {
		const number = Number(chunk);
		if (!Number.isNaN(number)) {
			results.push(number);
		} else if ((matches = chunk.match(STRING_REGEX))) {
			results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
		} else {
			throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
		}
	}

	return results;
}

function parseStyle(style) {
	STYLE_REGEX.lastIndex = 0;

	const results = [];
	let matches;

	while ((matches = STYLE_REGEX.exec(style)) !== null) {
		const name = matches[1];

		if (matches[2]) {
			const args = parseArguments(name, matches[2]);
			results.push([name].concat(args));
		} else {
			results.push([name]);
		}
	}

	return results;
}

function buildStyle(chalk, styles) {
	const enabled = {};

	for (const layer of styles) {
		for (const style of layer.styles) {
			enabled[style[0]] = layer.inverse ? null : style.slice(1);
		}
	}

	let current = chalk;
	for (const [styleName, styles] of Object.entries(enabled)) {
		if (!Array.isArray(styles)) {
			continue;
		}

		if (!(styleName in current)) {
			throw new Error(`Unknown Chalk style: ${styleName}`);
		}

		current = styles.length > 0 ? current[styleName](...styles) : current[styleName];
	}

	return current;
}

module.exports = (chalk, temporary) => {
	const styles = [];
	const chunks = [];
	let chunk = [];

	// eslint-disable-next-line max-params
	temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
		if (escapeCharacter) {
			chunk.push(unescape(escapeCharacter));
		} else if (style) {
			const string = chunk.join('');
			chunk = [];
			chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
			styles.push({inverse, styles: parseStyle(style)});
		} else if (close) {
			if (styles.length === 0) {
				throw new Error('Found extraneous } in Chalk template literal');
			}

			chunks.push(buildStyle(chalk, styles)(chunk.join('')));
			chunk = [];
			styles.pop();
		} else {
			chunk.push(character);
		}
	});

	chunks.push(chunk.join(''));

	if (styles.length > 0) {
		const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
		throw new Error(errMessage);
	}

	return chunks.join('');
};


/***/ }),

/***/ "./node_modules/chalk/source/util.js":
/*!*******************************************!*\
  !*** ./node_modules/chalk/source/util.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";


const stringReplaceAll = (string, substring, replacer) => {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = '';
	do {
		returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

const stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
	let endIndex = 0;
	let returnValue = '';
	do {
		const gotCR = string[index - 1] === '\r';
		returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		endIndex = index + 1;
		index = string.indexOf('\n', endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

module.exports = {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
};


/***/ }),

/***/ "./node_modules/color-convert/conversions.js":
/*!***************************************************!*\
  !*** ./node_modules/color-convert/conversions.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* MIT license */
/* eslint-disable no-mixed-operators */
const cssKeywords = __webpack_require__(/*! color-name */ "./node_modules/color-name/index.js");

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

module.exports = convert;

// Hide .channels and .labels properties
for (const model of Object.keys(convert)) {
	if (!('channels' in convert[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert[model].labels.length !== convert[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert[model];
	delete convert[model].channels;
	delete convert[model].labels;
	Object.defineProperty(convert[model], 'channels', {value: channels});
	Object.defineProperty(convert[model], 'labels', {value: labels});
}

convert.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	const xyz = convert.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hsv = convert.gray.hsl;

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),

/***/ "./node_modules/color-convert/index.js":
/*!*********************************************!*\
  !*** ./node_modules/color-convert/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const conversions = __webpack_require__(/*! ./conversions */ "./node_modules/color-convert/conversions.js");
const route = __webpack_require__(/*! ./route */ "./node_modules/color-convert/route.js");

const convert = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),

/***/ "./node_modules/color-convert/route.js":
/*!*********************************************!*\
  !*** ./node_modules/color-convert/route.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const conversions = __webpack_require__(/*! ./conversions */ "./node_modules/color-convert/conversions.js");

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),

/***/ "./node_modules/color-name/index.js":
/*!******************************************!*\
  !*** ./node_modules/color-name/index.js ***!
  \******************************************/
/***/ ((module) => {

"use strict";


module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),

/***/ "./node_modules/file-uri-to-path/index.js":
/*!************************************************!*\
  !*** ./node_modules/file-uri-to-path/index.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * Module dependencies.
 */

var sep = (__webpack_require__(/*! path */ "path").sep) || '/';

/**
 * Module exports.
 */

module.exports = fileUriToPath;

/**
 * File URI to Path function.
 *
 * @param {String} uri
 * @return {String} path
 * @api public
 */

function fileUriToPath (uri) {
  if ('string' != typeof uri ||
      uri.length <= 7 ||
      'file://' != uri.substring(0, 7)) {
    throw new TypeError('must pass in a file:// URI to convert to a file path');
  }

  var rest = decodeURI(uri.substring(7));
  var firstSlash = rest.indexOf('/');
  var host = rest.substring(0, firstSlash);
  var path = rest.substring(firstSlash + 1);

  // 2.  Scheme Definition
  // As a special case, <host> can be the string "localhost" or the empty
  // string; this is interpreted as "the machine from which the URL is
  // being interpreted".
  if ('localhost' == host) host = '';

  if (host) {
    host = sep + sep + host;
  }

  // 3.2  Drives, drive letters, mount points, file system root
  // Drive letters are mapped into the top of a file URI in various ways,
  // depending on the implementation; some applications substitute
  // vertical bar ("|") for the colon after the drive letter, yielding
  // "file:///c|/tmp/test.txt".  In some cases, the colon is left
  // unchanged, as in "file:///c:/tmp/test.txt".  In other cases, the
  // colon is simply omitted, as in "file:///c/tmp/test.txt".
  path = path.replace(/^(.+)\|/, '$1:');

  // for Windows, we need to invert the path separators from what a URI uses
  if (sep == '\\') {
    path = path.replace(/\//g, '\\');
  }

  if (/^.+\:/.test(path)) {
    // has Windows drive at beginning of path
  } else {
    // unix path…
    path = sep + path;
  }

  return host + path;
}


/***/ }),

/***/ "./node_modules/has-flag/index.js":
/*!****************************************!*\
  !*** ./node_modules/has-flag/index.js ***!
  \****************************************/
/***/ ((module) => {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ "./node_modules/supports-color/index.js":
/*!**********************************************!*\
  !*** ./node_modules/supports-color/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const os = __webpack_require__(/*! os */ "os");
const tty = __webpack_require__(/*! tty */ "tty");
const hasFlag = __webpack_require__(/*! has-flag */ "./node_modules/has-flag/index.js");

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),

/***/ "./Source/Main/Core/SideEffects.ts":
/*!*****************************************!*\
  !*** ./Source/Main/Core/SideEffects.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _MessageLoop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../MessageLoop */ "./Source/Main/MessageLoop.ts");
/* harmony import */ var _Hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Hook */ "./Source/Main/Hook.ts");
/* harmony import */ var _NodeIpc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../NodeIpc */ "./Source/Main/NodeIpc.ts");
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Keyboard */ "./Source/Main/Keyboard.ts");
/* harmony import */ var _Monitor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Monitor */ "./Source/Main/Monitor.ts");
/* harmony import */ var _Tree__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Tree */ "./Source/Main/Tree.ts");
/* File:      SideEffects.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */






setTimeout(() => {
    Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../MainWindow */ "./Source/Main/MainWindow.ts"));
    __webpack_require__.e(/*! import() */ "Source_Main_RendererFunctions_Generated_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../RendererFunctions.Generated */ "./Source/Main/RendererFunctions.Generated.ts"));
    Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_electron-debug_index_js-node_modules_electron-devtools-installer_dist_in-77df03"), __webpack_require__.e("node_modules_electron-debug_sync_recursive-Source_Main_Core_Initialization_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./Initialization */ "./Source/Main/Core/Initialization.ts"));
    __webpack_require__.e(/*! import() */ "Source_Main_Core_Tray_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./Tray */ "./Source/Main/Core/Tray.ts"));
    __webpack_require__.e(/*! import() */ "Source_Main_WinEvent_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../WinEvent */ "./Source/Main/WinEvent.ts"));
});


/***/ }),

/***/ "./Source/Main/Core/Utility.ts":
/*!*************************************!*\
  !*** ./Source/Main/Core/Utility.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AreBoxesEqual: () => (/* binding */ AreBoxesEqual),
/* harmony export */   AreHandlesEqual: () => (/* binding */ AreHandlesEqual),
/* harmony export */   ResolveHtmlPath: () => (/* binding */ ResolveHtmlPath)
/* harmony export */ });
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! url */ "url");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* File:    util.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */


function ResolveHtmlPath(HtmlFileName, Component) {
    if (true) {
        const Port = process.env.PORT || 1212;
        const Url = new url__WEBPACK_IMPORTED_MODULE_0__.URL(`http://localhost:${Port}`);
        Url.pathname = HtmlFileName;
        return Url.href;
    }
    const BasePath = `file://${path__WEBPACK_IMPORTED_MODULE_1___default().resolve(__dirname, "../Renderer/", HtmlFileName)}`;
    if (Component !== undefined) {
        const ComponentArgument = `?Component=${Component}`;
        return BasePath + ComponentArgument;
    }
    else {
        return BasePath;
    }
}
const AreBoxesEqual = (A, B) => {
    return (A.X === B.X &&
        A.Y === B.Y &&
        A.Width === B.Width &&
        A.Height === B.Height);
};
const AreHandlesEqual = (A, B) => {
    return A.Handle === B.Handle;
};


/***/ }),

/***/ "./Source/Main/Development/Log.ts":
/*!****************************************!*\
  !*** ./Source/Main/Development/Log.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Log: () => (/* binding */ Log)
/* harmony export */ });
/* File:      Log.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */
/** @TODO */
const Log = (...Arguments) => {
    console.log(...Arguments);
    // process.stdout.write(
    //     chalk.bgMagenta.white(" Backend ") +
    //     " " +
    //     JSON.stringify(Arguments, null, 4)
    // );
};


/***/ }),

/***/ "./Source/Main/Development/index.ts":
/*!******************************************!*\
  !*** ./Source/Main/Development/index.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Log: () => (/* reexport safe */ _Log__WEBPACK_IMPORTED_MODULE_0__.Log)
/* harmony export */ });
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Log */ "./Source/Main/Development/Log.ts");
/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */



/***/ }),

/***/ "./Source/Main/Dispatcher.ts":
/*!***********************************!*\
  !*** ./Source/Main/Dispatcher.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TDispatcher: () => (/* binding */ TDispatcher),
/* harmony export */   TDispatcher_DEPRECATED: () => (/* binding */ TDispatcher_DEPRECATED)
/* harmony export */ });
/* File:      Dispatcher.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */
class TDispatcher {
    NextListenerId = 0;
    Listeners = new Map();
    GetHandle = () => {
        const Subscribe = (Callback) => {
            const Id = this.NextListenerId++;
            this.Listeners.set(Id, Callback);
            return Id;
        };
        const Unsubscribe = (Id) => {
            this.Listeners.delete(Id);
        };
        return {
            Subscribe,
            Unsubscribe
        };
    };
    Dispatch = (Message) => {
        if (this.Listeners.size > 0) {
            this.Listeners.forEach((Callback) => {
                Callback(Message);
            });
        }
    };
}
;
/* eslint-disable-next-line @typescript-eslint/naming-convention */
class TDispatcher_DEPRECATED {
    NextListenerId = 0;
    Listeners = new Map();
    Subscribe(Callback) {
        const Id = this.NextListenerId++;
        this.Listeners.set(Id, Callback);
        return Id;
    }
    Unsubscribe(Id) {
        this.Listeners.delete(Id);
    }
    Dispatch = (Message) => {
        if (this.Listeners.size > 0) {
            this.Listeners.forEach((Callback) => {
                Callback(Message);
            });
        }
    };
}
;


/***/ }),

/***/ "./Source/Main/Hook.ts":
/*!*****************************!*\
  !*** ./Source/Main/Hook.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__);

(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.InitializeHooks)();


/***/ }),

/***/ "./Source/Main/Keyboard.ts":
/*!*********************************!*\
  !*** ./Source/Main/Keyboard.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Keyboard: () => (/* binding */ Keyboard)
/* harmony export */ });
/* harmony import */ var _NodeIpc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NodeIpc */ "./Source/Main/NodeIpc.ts");
/* harmony import */ var _Domain_Common_Component_Keyboard_Keyboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/Domain/Common/Component/Keyboard/Keyboard */ "./Source/Renderer/Domain/Common/Component/Keyboard/Keyboard.ts");
/* harmony import */ var _Dispatcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Dispatcher */ "./Source/Main/Dispatcher.ts");
/* File:      Keyboard.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */



class FKeyboard extends _Dispatcher__WEBPACK_IMPORTED_MODULE_2__.TDispatcher_DEPRECATED {
    constructor() {
        super();
    }
    IsKeyDown = false;
    /** Returns true if the `OnKey` should continue. */
    Debounce = (State) => {
        if (State === "Down") {
            if (!this.IsKeyDown) {
                this.IsKeyDown = true;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            this.IsKeyDown = false;
            return true;
        }
    };
    OnKey = (...Data) => {
        const Event = Data[0];
        const IsDebounced = this.Debounce(Event.State);
        if (IsDebounced && (0,_Domain_Common_Component_Keyboard_Keyboard__WEBPACK_IMPORTED_MODULE_1__.IsVirtualKey)(Event.VkCode)) {
            this.Dispatch(Event);
        }
    };
}
const Keyboard = new FKeyboard();
(0,_NodeIpc__WEBPACK_IMPORTED_MODULE_0__.Subscribe)("Keyboard", Keyboard.OnKey);


/***/ }),

/***/ "./Source/Main/Main.ts":
/*!*****************************!*\
  !*** ./Source/Main/Main.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Core_SideEffects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Core/SideEffects */ "./Source/Main/Core/SideEffects.ts");
/* File:      Main.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */



/***/ }),

/***/ "./Source/Main/MainWindow.ts":
/*!***********************************!*\
  !*** ./Source/Main/MainWindow.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetActiveWindow: () => (/* binding */ GetActiveWindow)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Keyboard */ "./Source/Main/Keyboard.ts");
/* harmony import */ var _Core_Utility__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Core/Utility */ "./Source/Main/Core/Utility.ts");
/* harmony import */ var _Domain_Common_Component_Keyboard_Keyboard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/Domain/Common/Component/Keyboard/Keyboard */ "./Source/Renderer/Domain/Common/Component/Keyboard/Keyboard.ts");
/* harmony import */ var _Tree__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Tree */ "./Source/Main/Tree.ts");
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! chalk */ "./node_modules/chalk/source/index.js");
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(chalk__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _Development__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Development */ "./Source/Main/Development/index.ts");
/* File:    MainWindow.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */









let MainWindow = undefined;
const GetLeastInvisiblePosition = () => {
    const Displays = electron__WEBPACK_IMPORTED_MODULE_2__.screen.getAllDisplays();
    const MonitorBounds = Displays.map((display) => {
        return {
            bottom: display.bounds.y + display.bounds.height,
            left: display.bounds.x,
            right: display.bounds.x + display.bounds.width,
            top: display.bounds.y
        };
    });
    MonitorBounds.sort((A, B) => A.left - B.left || A.top - B.top);
    const MaxRight = Math.max(...MonitorBounds.map((bounds) => bounds.right));
    const MaxBottom = Math.max(...MonitorBounds.map((bounds) => bounds.bottom));
    const InvisibleX = (MaxRight + 1) * 2;
    const InvisibleY = (MaxBottom + 1) * 2;
    return {
        x: InvisibleX,
        y: InvisibleY
    };
};
const LaunchMainWindow = async () => {
    console.log("Launching main window.");
    MainWindow = new electron__WEBPACK_IMPORTED_MODULE_2__.BrowserWindow({
        alwaysOnTop: true,
        frame: false,
        height: 900,
        show: true,
        skipTaskbar: true,
        title: "SorrellWm Main Window",
        titleBarStyle: "hidden",
        transparent: true,
        webPreferences: {
            devTools: false,
            // devTools: true,
            nodeIntegration: true,
            preload: electron__WEBPACK_IMPORTED_MODULE_2__.app.isPackaged
                ? path__WEBPACK_IMPORTED_MODULE_0__.join(__dirname, "Preload.js")
                : path__WEBPACK_IMPORTED_MODULE_0__.join(__dirname, "../../.erb/dll/preload.js")
        },
        width: 900,
        ...GetLeastInvisiblePosition()
    });
    MainWindow.on("show", (_Event, _IsAlwaysOnTop) => {
        MainWindow?.webContents.send("Navigate", "Main");
    });
    MainWindow.on("page-title-updated", (Event, _Title, _ExplicitSet) => {
        Event.preventDefault();
        // MainWindow?.webContents.openDevTools();
    });
    /** @TODO Find better place for this. */
    electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("GetAnnotatedPanels", async (_Event, ..._Arguments) => {
        const Panels = (0,_Tree__WEBPACK_IMPORTED_MODULE_6__.GetPanels)();
        const AnnotatedPanels = (await Promise.all(Panels.map(_Tree__WEBPACK_IMPORTED_MODULE_6__.AnnotatePanel)))
            .filter((Value) => {
            return Value !== undefined;
        });
        MainWindow?.webContents.send("GetAnnotatedPanels", AnnotatedPanels);
    });
    // Keyboard.Subscribe((Argument: FKeyboardEvent): void =>
    // {
    //     const InputKeys: Array<FVirtualKey> =
    //     [
    //         Vk["D"],
    //         Vk["H"],
    //         Vk["T"],
    //         Vk["N"],
    //         Vk["Z"],
    //         Vk["F"],
    //         Vk["G"],
    //         Vk["C"],
    //         Vk["R"],
    //         Vk["0"],
    //         Vk["1"],
    //         Vk["2"],
    //         Vk["3"],
    //         Vk["4"],
    //         Vk["5"],
    //         Vk["6"],
    //         Vk["7"],
    //         Vk["8"],
    //         Vk["9"]
    //     ];
    //     if (InputKeys.includes(Argument.VkCode) && Argument.State === "Up")
    //     {
    //         Log(`Logging input here as ${ Argument.VkCode }.`);
    //         MainWindow?.webContents.sendInputEvent({keyCode: KeyIdsById[Argument.VkCode], type: "keyDown"});
    //         MainWindow?.webContents.sendInputEvent({keyCode: KeyIdsById[Argument.VkCode], type: "char"});
    //         MainWindow?.webContents.sendInputEvent({keyCode: KeyIdsById[Argument.VkCode], type: "keyUp"});
    //     }
    // });
    /** @TODO Find better place for this. */
    electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("GetPanelScreenshots", async (_Event, ..._Arguments) => {
        const Panels = (0,_Tree__WEBPACK_IMPORTED_MODULE_6__.GetPanels)();
        const Screenshots = (await Promise.all(Panels.map(_Tree__WEBPACK_IMPORTED_MODULE_6__.GetPanelScreenshot)))
            .filter((Value) => {
            return Value !== undefined;
        });
        MainWindow?.webContents.send("GetPanelScreenshots", Screenshots);
    });
    electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("BringIntoPanel", async (_Event, ...Arguments) => {
        // Log("BringIntoPanel", Arguments[0]);
        console.log("BringIntoPanel !! !!", ...Arguments);
        (0,_Tree__WEBPACK_IMPORTED_MODULE_6__.BringIntoPanel)(Arguments[0]);
    });
    electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("TearDown", async (_Event, ...Arguments) => {
        ActiveWindow = undefined;
        (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.UnblurBackground)();
    });
    electron__WEBPACK_IMPORTED_MODULE_2__.ipcMain.on("Log", async (_Event, ...Arguments) => {
        const StringifiedArguments = Arguments
            .map((Argument) => {
            return typeof Argument === "string"
                ? Argument
                : JSON.stringify(Argument);
        })
            .join();
        const Birdie = chalk__WEBPACK_IMPORTED_MODULE_7___default().bgMagenta(" ⚛️ ") + " ";
        let OutString = Birdie;
        for (let Index = 0; Index < StringifiedArguments.length; Index++) {
            const Character = StringifiedArguments[Index];
            if (Character === "\n" && Index !== StringifiedArguments.length - 1) {
                OutString += Birdie + Character;
            }
            else {
                OutString += Character;
            }
        }
        console.log(OutString);
    });
    MainWindow.loadURL((0,_Core_Utility__WEBPACK_IMPORTED_MODULE_4__.ResolveHtmlPath)("index.html"));
};
/** The window that SorrellWm is being drawn over. */
let ActiveWindow = undefined;
const GetActiveWindow = () => {
    return ActiveWindow;
};
function OnKey(Event) {
    const { State, VkCode } = Event;
    if (MainWindow === undefined) {
        return;
    }
    /** @TODO Make this a modifiable setting. */
    const ActivationKey = _Domain_Common_Component_Keyboard_Keyboard__WEBPACK_IMPORTED_MODULE_5__.Vk["+"];
    if (VkCode === ActivationKey) {
        if (State === "Down") {
            if ((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.GetWindowTitle)((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.GetFocusedWindow)()) !== "SorrellWm Main Window") {
                ActiveWindow = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.GetFocusedWindow)();
                const IsTiled = (0,_Tree__WEBPACK_IMPORTED_MODULE_6__.IsWindowTiled)((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.GetFocusedWindow)());
                (0,_Development__WEBPACK_IMPORTED_MODULE_8__.Log)(`Focused Window of IsTiled call is ${(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.GetWindowTitle)((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.GetFocusedWindow)())}.`);
                MainWindow.webContents.send("Navigate", "", { IsTiled });
                (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.BlurBackground)();
            }
        }
        else {
            (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_1__.UnblurBackground)();
        }
    }
    else {
        MainWindow.webContents.send("Keyboard", Event);
    }
}
electron__WEBPACK_IMPORTED_MODULE_2__.app.whenReady()
    .then(LaunchMainWindow)
    .catch(console.log);
_Keyboard__WEBPACK_IMPORTED_MODULE_3__.Keyboard.Subscribe(OnKey);


/***/ }),

/***/ "./Source/Main/MessageLoop.ts":
/*!************************************!*\
  !*** ./Source/Main/MessageLoop.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__);
/* File:      MessageLoop.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Gage Sorrell
 * License:   MIT
 */
/** This file must be side-effect imported by `Main`. */

const RunInitializeMessageLoop = () => {
    (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.InitializeMessageLoop)(() => { });
};
RunInitializeMessageLoop();


/***/ }),

/***/ "./Source/Main/Monitor.ts":
/*!********************************!*\
  !*** ./Source/Main/Monitor.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetMonitors: () => (/* binding */ GetMonitors),
/* harmony export */   MonitorsHandle: () => (/* binding */ MonitorsHandle)
/* harmony export */ });
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _NodeIpc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NodeIpc */ "./Source/Main/NodeIpc.ts");
/* harmony import */ var _Dispatcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Dispatcher */ "./Source/Main/Dispatcher.ts");
/* File:      Monitor.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */



const Monitors = [];
const GetMonitors = () => {
    return [...Monitors];
};
const MonitorsDispatcher = new _Dispatcher__WEBPACK_IMPORTED_MODULE_2__.TDispatcher();
const MonitorsHandle = MonitorsDispatcher.GetHandle();
const OnMonitorsChanged = (...Data) => {
    const NewMonitors = Data[0];
    Monitors.length = 0;
    Monitors.push(...NewMonitors);
    MonitorsDispatcher.Dispatch(NewMonitors);
};
const InitializeMonitorTracking = () => {
    Monitors.push(...(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.InitializeMonitors)());
    (0,_NodeIpc__WEBPACK_IMPORTED_MODULE_1__.Subscribe)("Monitors", OnMonitorsChanged);
};
InitializeMonitorTracking();


/***/ }),

/***/ "./Source/Main/NodeIpc.ts":
/*!********************************!*\
  !*** ./Source/Main/NodeIpc.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Subscribe: () => (/* binding */ Subscribe),
/* harmony export */   Unsubscribe: () => (/* binding */ Unsubscribe)
/* harmony export */ });
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__);
/* File:      NodeIpc.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */

let NextListenerId = 0;
const Listeners = new Map();
const Subscribe = (Channel, Callback) => {
    const Id = NextListenerId++;
    Listeners.set(Id, { Callback, Channel });
    return Id;
};
const Unsubscribe = (Id) => {
    Listeners.delete(Id);
};
function OnMessage(Channel, Message) {
    Listeners.forEach((Callback) => {
        if (Callback.Channel === Channel) {
            Callback.Callback(Message);
        }
    });
}
(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.InitializeIpc)(OnMessage);


/***/ }),

/***/ "./Source/Main/Tree.ts":
/*!*****************************!*\
  !*** ./Source/Main/Tree.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AnnotatePanel: () => (/* binding */ AnnotatePanel),
/* harmony export */   ArePanelsEqual: () => (/* binding */ ArePanelsEqual),
/* harmony export */   BringIntoPanel: () => (/* binding */ BringIntoPanel),
/* harmony export */   Exists: () => (/* binding */ Exists),
/* harmony export */   ExistsExactlyOne: () => (/* binding */ ExistsExactlyOne),
/* harmony export */   Find: () => (/* binding */ Find),
/* harmony export */   Flatten: () => (/* binding */ Flatten),
/* harmony export */   ForAll: () => (/* binding */ ForAll),
/* harmony export */   GetForest: () => (/* binding */ GetForest),
/* harmony export */   GetPanelFromAnnotated: () => (/* binding */ GetPanelFromAnnotated),
/* harmony export */   GetPanelScreenshot: () => (/* binding */ GetPanelScreenshot),
/* harmony export */   GetPanels: () => (/* binding */ GetPanels),
/* harmony export */   GetRootPanel: () => (/* binding */ GetRootPanel),
/* harmony export */   IsPanel: () => (/* binding */ IsPanel),
/* harmony export */   IsWindowTiled: () => (/* binding */ IsWindowTiled),
/* harmony export */   LogForest: () => (/* binding */ LogForest),
/* harmony export */   MakeSizesUniform: () => (/* binding */ MakeSizesUniform),
/* harmony export */   Publish: () => (/* binding */ Publish),
/* harmony export */   RemoveAnnotations: () => (/* binding */ RemoveAnnotations),
/* harmony export */   Traverse: () => (/* binding */ Traverse),
/* harmony export */   UpdateForest: () => (/* binding */ UpdateForest)
/* harmony export */ });
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Core_Utility__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Core/Utility */ "./Source/Main/Core/Utility.ts");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _MainWindow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MainWindow */ "./Source/Main/MainWindow.ts");
/* harmony import */ var _Monitor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Monitor */ "./Source/Main/Monitor.ts");
/* harmony import */ var _Development__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Development */ "./Source/Main/Development/index.ts");
/* File:      Tree.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */






const Forest = [];
const GetForest = () => {
    return [...Forest];
};
/** @TODO */
const LogForest = () => {
};
const Cell = (Handle) => {
    return {
        Handle,
        Size: { Height: 0, Width: 0, X: 0, Y: 0 },
        ZOrder: 0
    };
};
const UpdateForest = (UpdateFunction) => {
    const NewForest = UpdateFunction([...Forest]);
    Forest.length = 0;
    Forest.push(...NewForest);
    // @TODO Move and resize, and sort ZOrder of all windows being tiled by SorrellWm.
};
const InitializeTree = () => {
    const Monitors = (0,_Monitor__WEBPACK_IMPORTED_MODULE_4__.GetMonitors)();
    console.log(Monitors);
    Forest.push(...Monitors.map((Monitor) => {
        console.log(`Here, MonitorHandle is ${Monitor.Handle}.`);
        return {
            Children: [],
            MonitorId: Monitor.Handle,
            Size: Monitor.Size,
            Type: "Horizontal",
            ZOrder: 0
        };
    }));
    console.log(Forest);
    const TileableWindows = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.GetTileableWindows)();
    console.log(`Found ${TileableWindows.length} tileable windows.`);
    TileableWindows.forEach((Handle) => {
        const Monitor = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.GetMonitorFromWindow)(Handle);
        const RootPanel = Forest.find((Panel) => {
            console.log(`Monitor is ${JSON.stringify(Monitor)} and Panel.MonitorId is ${JSON.stringify(Panel.MonitorId)}.`);
            const Info = Monitors.find((Foo) => {
                return Foo.Handle.Handle === Panel.MonitorId?.Handle;
            });
            console.log(`Size ${JSON.stringify(Info?.Size)} WorkSize ${JSON.stringify(Info?.WorkSize)}.`);
            return Panel.MonitorId?.Handle === Monitor.Handle;
        });
        if (RootPanel === undefined) {
            // @TODO
            console.log("💡💡💡💡 RootPanel was undefined.");
        }
        else {
            RootPanel.Children.push(Cell(Handle));
        }
    });
    Forest.forEach((Panel) => {
        const MonitorInfo = Monitors.find((InMonitor) => InMonitor.Handle === Panel.MonitorId);
        if (MonitorInfo === undefined) {
            // @TODO
        }
        else {
            Panel.Children = Panel.Children.map((Child, Index) => {
                const UniformWidth = MonitorInfo.WorkSize.Width / Panel.Children.length;
                const OutChild = { ...Child };
                OutChild.Size =
                    {
                        ...MonitorInfo.WorkSize,
                        Width: UniformWidth,
                        X: UniformWidth * Index + MonitorInfo.WorkSize.X
                    };
                return OutChild;
            });
        }
    });
    const Cells = GetAllCells(Forest);
    Cells.forEach((Cell) => {
        console.log(`Setting position of ${(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.GetWindowTitle)(Cell.Handle)} to ${JSON.stringify(Cell.Size)}.`);
        (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.SetWindowPosition)(Cell.Handle, Cell.Size);
        /* At least for now, ignore SorrellWm windows. */
        // if (GetWindowTitle(Cell.Handle) !== "SorrellWm")
        // {
        //     SetWindowPosition(Cell.Handle, Cell.Size);
        // }
    });
    console.log(`Called SetWindowPosition for ${Cells.length} windows.`);
};
const IsCell = (Vertex) => {
    return "Handle" in Vertex;
};
const Flatten = () => {
    const OutArray = [];
    Traverse((Vertex) => {
        OutArray.push(Vertex);
        return true;
    });
    return OutArray;
};
/**
 * Run a function for each vertex until the function returns `false` for
 * an iteration.
 */
const Traverse = (Predicate, Entry) => {
    let Continues = true;
    const Recurrence = (Vertex) => {
        if (Continues) {
            Continues = Predicate(Vertex);
            if (Continues && "Children" in Vertex) {
                for (const Child of Vertex.Children) {
                    Recurrence(Child);
                }
            }
        }
    };
    if (Entry) {
        Recurrence(Entry);
    }
    else {
        for (const Panel of Forest) {
            Recurrence(Panel);
        }
    }
};
const GetAllCells = (Panels) => {
    const Result = [];
    function Traverse(Vertex) {
        if ("Handle" in Vertex) {
            Result.push(Vertex);
        }
        else if ("Children" in Vertex) {
            for (const Child of Vertex.Children) {
                Traverse(Child);
            }
        }
    }
    for (const Panel of Panels) {
        for (const Child of Panel.Children) {
            Traverse(Child);
        }
    }
    return Result;
};
const Exists = (Predicate) => {
    let DoesExist = false;
    Traverse((Vertex) => {
        if (!DoesExist) {
            DoesExist = Predicate(Vertex);
        }
        return !DoesExist;
    });
    return DoesExist;
};
/** @TODO */
const ExistsExactlyOne = (Predicate) => {
    return false;
};
const ForAll = (Predicate) => {
    return false;
};
const IsWindowTiled = (Handle) => {
    return Exists((Vertex) => {
        if (IsCell(Vertex)) {
            (0,_Development__WEBPACK_IMPORTED_MODULE_5__.Log)("Handles are: ", Vertex.Handle, Handle);
        }
        return IsCell(Vertex) && (0,_Core_Utility__WEBPACK_IMPORTED_MODULE_1__.AreHandlesEqual)(Vertex.Handle, Handle);
    });
};
const GetPanels = () => {
    const Vertices = Flatten();
    return Vertices.filter((Vertex) => !IsCell(Vertex));
};
const Publish = () => {
    Traverse((Vertex) => {
        if (IsCell(Vertex)) {
            (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.SetWindowPosition)(Vertex.Handle, Vertex.Size);
        }
        return true;
    });
};
function PanelContainsVertex(currentVertex, targetVertex) {
    if (currentVertex === targetVertex) {
        return true;
    }
    // If this is a panel, check its children recursively
    if ("Children" in currentVertex) {
        for (const child of currentVertex.Children) {
            if (PanelContainsVertex(child, targetVertex)) {
                return true;
            }
        }
    }
    return false;
}
const GetRootPanel = (Vertex) => {
    for (const Panel of Forest) {
        if (PanelContainsVertex(Panel, Vertex)) {
            return Panel;
        }
    }
    return undefined;
};
const GetPanelApplicationNames = (Panel) => {
    const ResultNames = [];
    Traverse((Vertex) => {
        if ("Handle" in Vertex) {
            const FriendlyName = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.GetApplicationFriendlyName)(Vertex.Handle);
            if (FriendlyName !== undefined) {
                ResultNames.push(FriendlyName);
            }
            if (ResultNames.length >= 3) {
                return false;
            }
        }
        return true;
    }, Panel);
    return ResultNames;
};
const AnnotatePanel = (Panel) => {
    const RootPanel = GetRootPanel(Panel);
    if (RootPanel !== undefined && RootPanel.MonitorId !== undefined) {
        const ApplicationNames = GetPanelApplicationNames(Panel);
        const IsRoot = RootPanel === Panel;
        const Monitor = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.GetMonitorFriendlyName)(RootPanel.MonitorId) || "";
        return {
            ...Panel,
            ApplicationNames,
            IsRoot,
            Monitor,
            Screenshot: undefined
        };
    }
    return undefined;
};
const GetPanelScreenshot = async (Panel) => {
    const ScreenshotBuffer = await fs__WEBPACK_IMPORTED_MODULE_2__.promises.readFile((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.CaptureScreenSectionToTempPngFile)(Panel.Size));
    return "data:image/png;base64," + ScreenshotBuffer.toString("base64");
};
const MakeSizesUniform = (Panel) => {
    Panel.Children.forEach((Child, Index) => {
        if (Panel.Type === "Horizontal") {
            Child.Size.Width = Panel.Size.Width / Panel.Children.length;
            Child.Size.X = Panel.Size.X + Index * Child.Size.Width;
            Child.Size.Height = Panel.Size.Height;
            Child.Size.Y = Panel.Size.Y;
        }
        else if (Panel.Type === "Vertical") {
            Child.Size.Height = Panel.Size.Height / Panel.Children.length;
            Child.Size.Y = Panel.Size.Y + Index * Child.Size.Height;
            Child.Size.Width = Panel.Size.Width;
            Child.Size.X = Panel.Size.X;
        }
    });
};
const BringIntoPanel = (InPanel) => {
    const Handle = (0,_MainWindow__WEBPACK_IMPORTED_MODULE_3__.GetActiveWindow)();
    if (Handle !== undefined) {
        console.log(`BringingIntoPanel: ${(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_0__.GetWindowTitle)(Handle)}.`);
        const Panel = GetPanelFromAnnotated(InPanel);
        if (Panel !== undefined) {
            console.log("BringIntoPanel: PanelFromAnnotated was defined!");
            const OutCell = Cell(Handle);
            Panel.Children.push(OutCell);
            MakeSizesUniform(Panel);
            Publish();
        }
        else {
            console.log("BringIntoPanel: PanelFromAnnotated was UNDEFINED.");
        }
    }
};
const ArePanelsEqual = (A, B) => {
    return (0,_Core_Utility__WEBPACK_IMPORTED_MODULE_1__.AreBoxesEqual)(A.Size, B.Size);
};
const Find = (Predicate) => {
    let Out = undefined;
    Traverse((Vertex) => {
        if (Out === undefined) {
            const Satisfies = Predicate(Vertex);
            if (Satisfies) {
                Out = Vertex;
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    });
    return Out;
};
const IsPanel = (Vertex) => {
    return "Children" in Vertex;
};
const GetPanelFromAnnotated = (Panel) => {
    const LoggedPanel = {
        Size: Panel.Size,
        Type: Panel.Type
    };
    console.log("Begins GetPanelFromAnnotated, Panel is", LoggedPanel);
    return Find((Vertex) => {
        if (IsPanel(Vertex)) {
            console.log("Vertex is a panel.", Vertex);
            const AreEqual = ArePanelsEqual(Panel, Vertex);
            if (AreEqual) {
                console.log("Panels are equal", Panel, Vertex);
            }
            else {
                console.log("Panels are NOT equal", Panel, Vertex);
            }
            return AreEqual;
        }
        else {
            console.log("Vertex was NOT a panel", Vertex);
            return false;
        }
    });
};
const RemoveAnnotations = ({ Children, MonitorId, Size, Type, ZOrder }) => {
    return {
        Children,
        MonitorId,
        Size,
        Type,
        ZOrder
    };
};
InitializeTree();


/***/ }),

/***/ "./Source/Renderer/Domain/Common/Component/Keyboard/Keyboard.ts":
/*!**********************************************************************!*\
  !*** ./Source/Renderer/Domain/Common/Component/Keyboard/Keyboard.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetKeyName: () => (/* binding */ GetKeyName),
/* harmony export */   IsVirtualKey: () => (/* binding */ IsVirtualKey),
/* harmony export */   KeyIdsById: () => (/* binding */ KeyIdsById),
/* harmony export */   VirtualKeys: () => (/* binding */ VirtualKeys),
/* harmony export */   Vk: () => (/* binding */ Vk)
/* harmony export */ });
/* File:      Keyboard.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2024 Sorrell Intellectual Properties
 * License:   MIT
 */
/* eslint-disable sort-keys */
/** Developer-friendly names of key codes. */
const KeyIdsById = {
    0x05: "MouseX1",
    0x06: "MouseX2",
    0x08: "Backspace",
    0x09: "Tab",
    0x0D: "Enter",
    0x10: "Shift",
    0x11: "Ctrl",
    0x12: "Alt",
    0x13: "Pause",
    0x20: "Space",
    0x21: "PgUp",
    0x22: "PgDown",
    0x23: "End",
    0x24: "Home",
    0x25: "LeftArrow",
    0x26: "UpArrow",
    0x27: "RightArrow",
    0x28: "DownArrow",
    0x2D: "Ins",
    0x2E: "Del",
    0x30: "0",
    0x31: "1",
    0x32: "2",
    0x33: "3",
    0x34: "4",
    0x35: "5",
    0x36: "6",
    0x37: "7",
    0x38: "8",
    0x39: "9",
    0x41: "A",
    0x42: "B",
    0x43: "C",
    0x44: "D",
    0x45: "E",
    0x46: "F",
    0x47: "G",
    0x48: "H",
    0x49: "I",
    0x4A: "J",
    0x4B: "K",
    0x4C: "L",
    0x4D: "M",
    0x4E: "N",
    0x4F: "O",
    0x50: "P",
    0x51: "Q",
    0x52: "R",
    0x53: "S",
    0x54: "T",
    0x55: "U",
    0x56: "V",
    0x57: "W",
    0x58: "X",
    0x59: "Y",
    0x5A: "Z",
    0x5B: "LWin",
    0x5C: "RWin",
    0x5D: "Applications",
    0x60: "Num0",
    0x61: "Num1",
    0x62: "Num2",
    0x63: "Num3",
    0x64: "Num4",
    0x65: "Num5",
    0x66: "Num6",
    0x67: "Num7",
    0x68: "Num8",
    0x69: "Num9",
    0x6A: "Multiply",
    0x6B: "Add",
    0x6D: "Subtract",
    0x6E: "NumDecimal",
    0x6F: "NumDivide",
    0x70: "F1",
    0x71: "F2",
    0x72: "F3",
    0x73: "F4",
    0x74: "F5",
    0x75: "F6",
    0x76: "F7",
    0x77: "F8",
    0x78: "F9",
    0x79: "F10",
    0x7A: "F11",
    0x7B: "F12",
    0x7C: "F13",
    0x7D: "F14",
    0x7E: "F15",
    0x7F: "F16",
    0x80: "F17",
    0x81: "F18",
    0x82: "F19",
    0x83: "F20",
    0x84: "F21",
    0x85: "F22",
    0x86: "F23",
    0x87: "F24",
    0xA0: "LShift",
    0xA1: "RShift",
    0xA2: "LCtrl",
    0xA3: "RCtrl",
    0xA4: "LAlt",
    0xA5: "RAlt",
    0xA6: "BrowserBack",
    0xA7: "BrowserForward",
    0xA8: "BrowserRefresh",
    0xA9: "BrowserStop",
    0xAA: "BrowserSearch",
    0xAB: "BrowserFavorites",
    0xAC: "BrowserStart",
    0xB0: "NextTrack",
    0xB1: "PreviousTrack",
    0xB2: "StopMedia",
    0xB3: "PlayPauseMedia",
    0xB4: "StartMail",
    0xB5: "SelectMedia",
    0xB6: "StartApplicationOne",
    0xB7: "StartApplicationTwo",
    0xBA: ";",
    0xBB: "+",
    0xBC: ",",
    0xBD: "-",
    0xBE: ".",
    0xBF: "/",
    0xC0: "`",
    0xDB: "[",
    0xDC: "\\",
    0xDD: "]",
    0xDE: "'"
};
const GetKeyName = (VkCode) => {
    return KeyIdsById[VkCode];
};
/** Developer-friendly names of key codes. */
const Vk = {
    MouseX1: 0x05,
    MouseX2: 0x06,
    Backspace: 0x08,
    Tab: 0x09,
    Enter: 0x0D,
    Shift: 0x10,
    Ctrl: 0x11,
    Alt: 0x12,
    Pause: 0x13,
    Space: 0x20,
    PgUp: 0x21,
    PgDown: 0x22,
    End: 0x23,
    Home: 0x24,
    LeftArrow: 0x25,
    UpArrow: 0x26,
    RightArrow: 0x27,
    DownArrow: 0x28,
    Ins: 0x2D,
    Del: 0x2E,
    0: 0x30,
    1: 0x31,
    2: 0x32,
    3: 0x33,
    4: 0x34,
    5: 0x35,
    6: 0x36,
    7: 0x37,
    8: 0x38,
    9: 0x39,
    A: 0x41,
    B: 0x42,
    C: 0x43,
    D: 0x44,
    E: 0x45,
    F: 0x46,
    G: 0x47,
    H: 0x48,
    I: 0x49,
    J: 0x4A,
    K: 0x4B,
    L: 0x4C,
    M: 0x4D,
    N: 0x4E,
    O: 0x4F,
    P: 0x50,
    Q: 0x51,
    R: 0x52,
    S: 0x53,
    T: 0x54,
    U: 0x55,
    V: 0x56,
    W: 0x57,
    X: 0x58,
    Y: 0x59,
    Z: 0x5A,
    LWin: 0x5B,
    RWin: 0x5C,
    Applications: 0x5D,
    Num0: 0x60,
    Num1: 0x61,
    Num2: 0x62,
    Num3: 0x63,
    Num4: 0x64,
    Num5: 0x65,
    Num6: 0x66,
    Num7: 0x67,
    Num8: 0x68,
    Num9: 0x69,
    Multiply: 0x6A,
    Add: 0x6B,
    Subtract: 0x6D,
    NumDecimal: 0x6E,
    NumDivide: 0x6F,
    F1: 0x70,
    F2: 0x71,
    F3: 0x72,
    F4: 0x73,
    F5: 0x74,
    F6: 0x75,
    F7: 0x76,
    F8: 0x77,
    F9: 0x78,
    F10: 0x79,
    F11: 0x7A,
    F12: 0x7B,
    F13: 0x7C,
    F14: 0x7D,
    F15: 0x7E,
    F16: 0x7F,
    F17: 0x80,
    F18: 0x81,
    F19: 0x82,
    F20: 0x83,
    F21: 0x84,
    F22: 0x85,
    F23: 0x86,
    F24: 0x87,
    LShift: 0xA0,
    RShift: 0xA1,
    LCtrl: 0xA2,
    RCtrl: 0xA3,
    LAlt: 0xA4,
    RAlt: 0xA5,
    BrowserBack: 0xA6,
    BrowserForward: 0xA7,
    BrowserRefresh: 0xA8,
    BrowserStop: 0xA9,
    BrowserSearch: 0xAA,
    BrowserFavorites: 0xAB,
    BrowserStart: 0xAC,
    NextTrack: 0xB0,
    PreviousTrack: 0xB1,
    StopMedia: 0xB2,
    PlayPauseMedia: 0xB3,
    StartMail: 0xB4,
    SelectMedia: 0xB5,
    StartApplicationOne: 0xB6,
    StartApplicationTwo: 0xB7,
    ";": 0xBA,
    "+": 0xBB,
    ",": 0xBC,
    "-": 0xBD,
    ".": 0xBE,
    "/": 0xBF,
    "`": 0xC0,
    "[": 0xDB,
    "\\": 0xDC,
    "]": 0xDD,
    "'": 0xDE
};
const VirtualKeys = [
    0x05,
    0x06,
    0x08,
    0x09,
    0x0D,
    0x10,
    0x11,
    0x12,
    0x13,
    0x20,
    0x21,
    0x22,
    0x23,
    0x24,
    0x25,
    0x26,
    0x27,
    0x28,
    0x2D,
    0x2E,
    0x30,
    0x31,
    0x32,
    0x33,
    0x34,
    0x35,
    0x36,
    0x37,
    0x38,
    0x39,
    0x41,
    0x42,
    0x43,
    0x44,
    0x45,
    0x46,
    0x47,
    0x48,
    0x49,
    0x4A,
    0x4B,
    0x4C,
    0x4D,
    0x4E,
    0x4F,
    0x50,
    0x51,
    0x52,
    0x53,
    0x54,
    0x55,
    0x56,
    0x57,
    0x58,
    0x59,
    0x5A,
    0x5B,
    0x5C,
    0x5D,
    0x60,
    0x61,
    0x62,
    0x63,
    0x64,
    0x65,
    0x66,
    0x67,
    0x68,
    0x69,
    0x6A,
    0x6B,
    0x6D,
    0x6E,
    0x6F,
    0x70,
    0x71,
    0x72,
    0x73,
    0x74,
    0x75,
    0x76,
    0x77,
    0x78,
    0x79,
    0x7A,
    0x7B,
    0x7C,
    0x7D,
    0x7E,
    0x7F,
    0x80,
    0x81,
    0x82,
    0x83,
    0x84,
    0x85,
    0x86,
    0x87,
    0xA0,
    0xA1,
    0xA2,
    0xA3,
    0xA4,
    0xA5,
    0xA6,
    0xA7,
    0xA8,
    0xA9,
    0xAA,
    0xAB,
    0xAC,
    0xB0,
    0xB1,
    0xB2,
    0xB3,
    0xB4,
    0xB5,
    0xB6,
    0xB7,
    0xBA,
    0xBB,
    0xBC,
    0xBD,
    0xBE,
    0xBF,
    0xC0,
    0xDB,
    0xDC,
    0xDD,
    0xDE
];
/* eslint-enable sort-keys */
/** Is the `KeyCode` a VK Code **that this app uses**. */
const IsVirtualKey = (KeyCode) => {
    return VirtualKeys.includes(KeyCode);
};


/***/ }),

/***/ "./Windows/index.js":
/*!**************************!*\
  !*** ./Windows/index.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var myModule = __webpack_require__(/*! bindings */ "./node_modules/bindings/bindings.js")("hello");
module.exports = myModule;


/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "constants":
/*!****************************!*\
  !*** external "constants" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("constants");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "string_decoder":
/*!*********************************!*\
  !*** external "string_decoder" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".bundle.dev.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			"main": 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 		
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__(__webpack_require__.s = "./Source/Main/Main.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDhCQUE4Qjs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsUUFBUSxRQUFRO0FBQ2xDLGtCQUFrQixRQUFRLFFBQVE7QUFDbEMsa0JBQWtCLFFBQVEsT0FBTztBQUNqQyxrQkFBa0IsUUFBUSxPQUFPO0FBQ2pDLGtCQUFrQixRQUFRLE9BQU87QUFDakMsa0JBQWtCLFFBQVEsT0FBTztBQUNqQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwRUFBMEU7O0FBRTFFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpREFBaUQsRUFBRSxVQUFVLEVBQUU7QUFDL0Q7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdEpBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVLDZDQUFtQjs7QUFFN0I7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLFFBQVE7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDakVhOztBQUViO0FBQ0E7QUFDQTtB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SSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsY0FBYztJQUNwQixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxVQUFVO0lBQ2hCLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLFVBQVU7SUFDaEIsSUFBSSxFQUFFLFlBQVk7SUFDbEIsSUFBSSxFQUFFLFdBQVc7SUFDakIsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsUUFBUTtJQUNkLElBQUksRUFBRSxPQUFPO0lBQ2IsSUFBSSxFQUFFLE9BQU87SUFDYixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLGFBQWE7SUFDbkIsSUFBSSxFQUFFLGdCQUFnQjtJQUN0QixJQUFJLEVBQUUsZ0JBQWdCO0lBQ3RCLElBQUksRUFBRSxhQUFhO0lBQ25CLElBQUksRUFBRSxlQUFlO0lBQ3JCLElBQUksRUFBRSxrQkFBa0I7SUFDeEIsSUFBSSxFQUFFLGNBQWM7SUFDcEIsSUFBSSxFQUFFLFdBQVc7SUFDakIsSUFBSSxFQUFFLGVBQWU7SUFDckIsSUFBSSxFQUFFLFdBQVc7SUFDakIsSUFBSSxFQUFFLGdCQUFnQjtJQUN0QixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsYUFBYTtJQUNuQixJQUFJLEVBQUUscUJBQXFCO0lBQzNCLElBQUksRUFBRSxxQkFBcUI7SUFDM0IsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztDQUNILENBQUM7QUFFSixNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQW1CLEVBQVUsRUFBRTtJQUV0RCxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QixDQUFDLENBQUM7QUFFRiw2Q0FBNkM7QUFDdEMsTUFBTSxFQUFFLEdBQ2Y7SUFDSSxPQUFPLEVBQUUsSUFBSTtJQUNiLE9BQU8sRUFBRSxJQUFJO0lBQ2IsU0FBUyxFQUFFLElBQUk7SUFDZixHQUFHLEVBQUUsSUFBSTtJQUNULEtBQUssRUFBRSxJQUFJO0lBQ1gsS0FBSyxFQUFFLElBQUk7SUFDWCxJQUFJLEVBQUUsSUFBSTtJQUNWLEdBQUcsRUFBRSxJQUFJO0lBQ1QsS0FBSyxFQUFFLElBQUk7SUFDWCxLQUFLLEVBQUUsSUFBSTtJQUNYLElBQUksRUFBRSxJQUFJO0lBQ1YsTUFBTSxFQUFFLElBQUk7SUFDWixHQUFHLEVBQUUsSUFBSTtJQUNULElBQUksRUFBRSxJQUFJO0lBQ1YsU0FBUyxFQUFFLElBQUk7SUFDZixPQUFPLEVBQUUsSUFBSTtJQUNiLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixZQUFZLEVBQUUsSUFBSTtJQUNsQixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLFFBQVEsRUFBRSxJQUFJO0lBQ2QsR0FBRyxFQUFFLElBQUk7SUFDVCxRQUFRLEVBQUUsSUFBSTtJQUNkLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsTUFBTSxFQUFFLElBQUk7SUFDWixNQUFNLEVBQUUsSUFBSTtJQUNaLEtBQUssRUFBRSxJQUFJO0lBQ1gsS0FBSyxFQUFFLElBQUk7SUFDWCxJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsV0FBVyxFQUFFLElBQUk7SUFDakIsY0FBYyxFQUFFLElBQUk7SUFDcEIsY0FBYyxFQUFFLElBQUk7SUFDcEIsV0FBVyxFQUFFLElBQUk7SUFDakIsYUFBYSxFQUFFLElBQUk7SUFDbkIsZ0JBQWdCLEVBQUUsSUFBSTtJQUN0QixZQUFZLEVBQUUsSUFBSTtJQUNsQixTQUFTLEVBQUUsSUFBSTtJQUNmLGFBQWEsRUFBRSxJQUFJO0lBQ25CLFNBQVMsRUFBRSxJQUFJO0lBQ2YsY0FBYyxFQUFFLElBQUk7SUFDcEIsU0FBUyxFQUFFLElBQUk7SUFDZixXQUFXLEVBQUUsSUFBSTtJQUNqQixtQkFBbUIsRUFBRSxJQUFJO0lBQ3pCLG1CQUFtQixFQUFFLElBQUk7SUFDekIsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULElBQUksRUFBRSxJQUFJO0lBQ1YsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtDQUNILENBQUM7QUFFSixNQUFNLFdBQVcsR0FDeEI7SUFDSSxJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0NBQ0UsQ0FBQztBQUVYLDZCQUE2QjtBQUU3Qix5REFBeUQ7QUFDbEQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxPQUFlLEVBQTBCLEVBQUU7SUFFcEUsT0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQXNCLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN6YUYsSUFBSSxRQUFRLEdBQUcsbUJBQU8sQ0FBQyxxREFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDNUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7Ozs7Ozs7Ozs7OztBQ0QxQjs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0MvQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEVBQUU7V0FDRjs7Ozs7V0NSQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ0pBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQ0pBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGdCQUFnQixxQkFBcUI7V0FDckM7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxhQUFhO1dBQ2I7V0FDQSxJQUFJO1dBQ0o7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7Ozs7VUVyQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL1NvcnJlbGxXbS8uL25vZGVfbW9kdWxlcy9hbnNpLXN0eWxlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9ub2RlX21vZHVsZXMvYmluZGluZ3MvYmluZGluZ3MuanMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vbm9kZV9tb2R1bGVzL2NoYWxrL3NvdXJjZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9ub2RlX21vZHVsZXMvY2hhbGsvc291cmNlL3RlbXBsYXRlcy5qcyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9ub2RlX21vZHVsZXMvY2hhbGsvc291cmNlL3V0aWwuanMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vbm9kZV9tb2R1bGVzL2NvbG9yLWNvbnZlcnQvY29udmVyc2lvbnMuanMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vbm9kZV9tb2R1bGVzL2NvbG9yLWNvbnZlcnQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vbm9kZV9tb2R1bGVzL2NvbG9yLWNvbnZlcnQvcm91dGUuanMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vbm9kZV9tb2R1bGVzL2NvbG9yLW5hbWUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vbm9kZV9tb2R1bGVzL2ZpbGUtdXJpLXRvLXBhdGgvaW5kZXguanMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vbm9kZV9tb2R1bGVzL2hhcy1mbGFnL2luZGV4LmpzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL25vZGVfbW9kdWxlcy9zdXBwb3J0cy1jb2xvci9pbmRleC5qcyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9Db3JlL1NpZGVFZmZlY3RzLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0NvcmUvVXRpbGl0eS50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9EZXZlbG9wbWVudC9Mb2cudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vRGV2ZWxvcG1lbnQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vRGlzcGF0Y2hlci50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9Ib29rLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0tleWJvYXJkLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL01haW4udHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vTWFpbldpbmRvdy50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9NZXNzYWdlTG9vcC50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9Nb25pdG9yLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL05vZGVJcGMudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vVHJlZS50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvUmVuZGVyZXIvRG9tYWluL0NvbW1vbi9Db21wb25lbnQvS2V5Ym9hcmQvS2V5Ym9hcmQudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vV2luZG93cy9pbmRleC5qcyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImFzc2VydFwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiYnVmZmVyXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJjaGlsZF9wcm9jZXNzXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJjb25zdGFudHNcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImNyeXB0b1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImV2ZW50c1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZnNcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImh0dHBcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImh0dHBzXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJvc1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwicGF0aFwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwicXVlcnlzdHJpbmdcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInN0cmVhbVwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwic3RyaW5nX2RlY29kZXJcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInR0eVwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwidXJsXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJ1dGlsXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJ6bGliXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvZW5zdXJlIGNodW5rIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvZ2V0IGphdmFzY3JpcHQgY2h1bmsgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9yZXF1aXJlIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSBmYWN0b3J5KCk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsICgpID0+IHtcbnJldHVybiAiLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHdyYXBBbnNpMTYgPSAoZm4sIG9mZnNldCkgPT4gKC4uLmFyZ3MpID0+IHtcblx0Y29uc3QgY29kZSA9IGZuKC4uLmFyZ3MpO1xuXHRyZXR1cm4gYFxcdTAwMUJbJHtjb2RlICsgb2Zmc2V0fW1gO1xufTtcblxuY29uc3Qgd3JhcEFuc2kyNTYgPSAoZm4sIG9mZnNldCkgPT4gKC4uLmFyZ3MpID0+IHtcblx0Y29uc3QgY29kZSA9IGZuKC4uLmFyZ3MpO1xuXHRyZXR1cm4gYFxcdTAwMUJbJHszOCArIG9mZnNldH07NTske2NvZGV9bWA7XG59O1xuXG5jb25zdCB3cmFwQW5zaTE2bSA9IChmbiwgb2Zmc2V0KSA9PiAoLi4uYXJncykgPT4ge1xuXHRjb25zdCByZ2IgPSBmbiguLi5hcmdzKTtcblx0cmV0dXJuIGBcXHUwMDFCWyR7MzggKyBvZmZzZXR9OzI7JHtyZ2JbMF19OyR7cmdiWzFdfTske3JnYlsyXX1tYDtcbn07XG5cbmNvbnN0IGFuc2kyYW5zaSA9IG4gPT4gbjtcbmNvbnN0IHJnYjJyZ2IgPSAociwgZywgYikgPT4gW3IsIGcsIGJdO1xuXG5jb25zdCBzZXRMYXp5UHJvcGVydHkgPSAob2JqZWN0LCBwcm9wZXJ0eSwgZ2V0KSA9PiB7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5LCB7XG5cdFx0Z2V0OiAoKSA9PiB7XG5cdFx0XHRjb25zdCB2YWx1ZSA9IGdldCgpO1xuXG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwge1xuXHRcdFx0XHR2YWx1ZSxcblx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdH0sXG5cdFx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0XHRjb25maWd1cmFibGU6IHRydWVcblx0fSk7XG59O1xuXG4vKiogQHR5cGUge3R5cGVvZiBpbXBvcnQoJ2NvbG9yLWNvbnZlcnQnKX0gKi9cbmxldCBjb2xvckNvbnZlcnQ7XG5jb25zdCBtYWtlRHluYW1pY1N0eWxlcyA9ICh3cmFwLCB0YXJnZXRTcGFjZSwgaWRlbnRpdHksIGlzQmFja2dyb3VuZCkgPT4ge1xuXHRpZiAoY29sb3JDb252ZXJ0ID09PSB1bmRlZmluZWQpIHtcblx0XHRjb2xvckNvbnZlcnQgPSByZXF1aXJlKCdjb2xvci1jb252ZXJ0Jyk7XG5cdH1cblxuXHRjb25zdCBvZmZzZXQgPSBpc0JhY2tncm91bmQgPyAxMCA6IDA7XG5cdGNvbnN0IHN0eWxlcyA9IHt9O1xuXG5cdGZvciAoY29uc3QgW3NvdXJjZVNwYWNlLCBzdWl0ZV0gb2YgT2JqZWN0LmVudHJpZXMoY29sb3JDb252ZXJ0KSkge1xuXHRcdGNvbnN0IG5hbWUgPSBzb3VyY2VTcGFjZSA9PT0gJ2Fuc2kxNicgPyAnYW5zaScgOiBzb3VyY2VTcGFjZTtcblx0XHRpZiAoc291cmNlU3BhY2UgPT09IHRhcmdldFNwYWNlKSB7XG5cdFx0XHRzdHlsZXNbbmFtZV0gPSB3cmFwKGlkZW50aXR5LCBvZmZzZXQpO1xuXHRcdH0gZWxzZSBpZiAodHlwZW9mIHN1aXRlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0c3R5bGVzW25hbWVdID0gd3JhcChzdWl0ZVt0YXJnZXRTcGFjZV0sIG9mZnNldCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHN0eWxlcztcbn07XG5cbmZ1bmN0aW9uIGFzc2VtYmxlU3R5bGVzKCkge1xuXHRjb25zdCBjb2RlcyA9IG5ldyBNYXAoKTtcblx0Y29uc3Qgc3R5bGVzID0ge1xuXHRcdG1vZGlmaWVyOiB7XG5cdFx0XHRyZXNldDogWzAsIDBdLFxuXHRcdFx0Ly8gMjEgaXNuJ3Qgd2lkZWx5IHN1cHBvcnRlZCBhbmQgMjIgZG9lcyB0aGUgc2FtZSB0aGluZ1xuXHRcdFx0Ym9sZDogWzEsIDIyXSxcblx0XHRcdGRpbTogWzIsIDIyXSxcblx0XHRcdGl0YWxpYzogWzMsIDIzXSxcblx0XHRcdHVuZGVybGluZTogWzQsIDI0XSxcblx0XHRcdGludmVyc2U6IFs3LCAyN10sXG5cdFx0XHRoaWRkZW46IFs4LCAyOF0sXG5cdFx0XHRzdHJpa2V0aHJvdWdoOiBbOSwgMjldXG5cdFx0fSxcblx0XHRjb2xvcjoge1xuXHRcdFx0YmxhY2s6IFszMCwgMzldLFxuXHRcdFx0cmVkOiBbMzEsIDM5XSxcblx0XHRcdGdyZWVuOiBbMzIsIDM5XSxcblx0XHRcdHllbGxvdzogWzMzLCAzOV0sXG5cdFx0XHRibHVlOiBbMzQsIDM5XSxcblx0XHRcdG1hZ2VudGE6IFszNSwgMzldLFxuXHRcdFx0Y3lhbjogWzM2LCAzOV0sXG5cdFx0XHR3aGl0ZTogWzM3LCAzOV0sXG5cblx0XHRcdC8vIEJyaWdodCBjb2xvclxuXHRcdFx0YmxhY2tCcmlnaHQ6IFs5MCwgMzldLFxuXHRcdFx0cmVkQnJpZ2h0OiBbOTEsIDM5XSxcblx0XHRcdGdyZWVuQnJpZ2h0OiBbOTIsIDM5XSxcblx0XHRcdHllbGxvd0JyaWdodDogWzkzLCAzOV0sXG5cdFx0XHRibHVlQnJpZ2h0OiBbOTQsIDM5XSxcblx0XHRcdG1hZ2VudGFCcmlnaHQ6IFs5NSwgMzldLFxuXHRcdFx0Y3lhbkJyaWdodDogWzk2LCAzOV0sXG5cdFx0XHR3aGl0ZUJyaWdodDogWzk3LCAzOV1cblx0XHR9LFxuXHRcdGJnQ29sb3I6IHtcblx0XHRcdGJnQmxhY2s6IFs0MCwgNDldLFxuXHRcdFx0YmdSZWQ6IFs0MSwgNDldLFxuXHRcdFx0YmdHcmVlbjogWzQyLCA0OV0sXG5cdFx0XHRiZ1llbGxvdzogWzQzLCA0OV0sXG5cdFx0XHRiZ0JsdWU6IFs0NCwgNDldLFxuXHRcdFx0YmdNYWdlbnRhOiBbNDUsIDQ5XSxcblx0XHRcdGJnQ3lhbjogWzQ2LCA0OV0sXG5cdFx0XHRiZ1doaXRlOiBbNDcsIDQ5XSxcblxuXHRcdFx0Ly8gQnJpZ2h0IGNvbG9yXG5cdFx0XHRiZ0JsYWNrQnJpZ2h0OiBbMTAwLCA0OV0sXG5cdFx0XHRiZ1JlZEJyaWdodDogWzEwMSwgNDldLFxuXHRcdFx0YmdHcmVlbkJyaWdodDogWzEwMiwgNDldLFxuXHRcdFx0YmdZZWxsb3dCcmlnaHQ6IFsxMDMsIDQ5XSxcblx0XHRcdGJnQmx1ZUJyaWdodDogWzEwNCwgNDldLFxuXHRcdFx0YmdNYWdlbnRhQnJpZ2h0OiBbMTA1LCA0OV0sXG5cdFx0XHRiZ0N5YW5CcmlnaHQ6IFsxMDYsIDQ5XSxcblx0XHRcdGJnV2hpdGVCcmlnaHQ6IFsxMDcsIDQ5XVxuXHRcdH1cblx0fTtcblxuXHQvLyBBbGlhcyBicmlnaHQgYmxhY2sgYXMgZ3JheSAoYW5kIGdyZXkpXG5cdHN0eWxlcy5jb2xvci5ncmF5ID0gc3R5bGVzLmNvbG9yLmJsYWNrQnJpZ2h0O1xuXHRzdHlsZXMuYmdDb2xvci5iZ0dyYXkgPSBzdHlsZXMuYmdDb2xvci5iZ0JsYWNrQnJpZ2h0O1xuXHRzdHlsZXMuY29sb3IuZ3JleSA9IHN0eWxlcy5jb2xvci5ibGFja0JyaWdodDtcblx0c3R5bGVzLmJnQ29sb3IuYmdHcmV5ID0gc3R5bGVzLmJnQ29sb3IuYmdCbGFja0JyaWdodDtcblxuXHRmb3IgKGNvbnN0IFtncm91cE5hbWUsIGdyb3VwXSBvZiBPYmplY3QuZW50cmllcyhzdHlsZXMpKSB7XG5cdFx0Zm9yIChjb25zdCBbc3R5bGVOYW1lLCBzdHlsZV0gb2YgT2JqZWN0LmVudHJpZXMoZ3JvdXApKSB7XG5cdFx0XHRzdHlsZXNbc3R5bGVOYW1lXSA9IHtcblx0XHRcdFx0b3BlbjogYFxcdTAwMUJbJHtzdHlsZVswXX1tYCxcblx0XHRcdFx0Y2xvc2U6IGBcXHUwMDFCWyR7c3R5bGVbMV19bWBcblx0XHRcdH07XG5cblx0XHRcdGdyb3VwW3N0eWxlTmFtZV0gPSBzdHlsZXNbc3R5bGVOYW1lXTtcblxuXHRcdFx0Y29kZXMuc2V0KHN0eWxlWzBdLCBzdHlsZVsxXSk7XG5cdFx0fVxuXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHN0eWxlcywgZ3JvdXBOYW1lLCB7XG5cdFx0XHR2YWx1ZTogZ3JvdXAsXG5cdFx0XHRlbnVtZXJhYmxlOiBmYWxzZVxuXHRcdH0pO1xuXHR9XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHN0eWxlcywgJ2NvZGVzJywge1xuXHRcdHZhbHVlOiBjb2Rlcyxcblx0XHRlbnVtZXJhYmxlOiBmYWxzZVxuXHR9KTtcblxuXHRzdHlsZXMuY29sb3IuY2xvc2UgPSAnXFx1MDAxQlszOW0nO1xuXHRzdHlsZXMuYmdDb2xvci5jbG9zZSA9ICdcXHUwMDFCWzQ5bSc7XG5cblx0c2V0TGF6eVByb3BlcnR5KHN0eWxlcy5jb2xvciwgJ2Fuc2knLCAoKSA9PiBtYWtlRHluYW1pY1N0eWxlcyh3cmFwQW5zaTE2LCAnYW5zaTE2JywgYW5zaTJhbnNpLCBmYWxzZSkpO1xuXHRzZXRMYXp5UHJvcGVydHkoc3R5bGVzLmNvbG9yLCAnYW5zaTI1NicsICgpID0+IG1ha2VEeW5hbWljU3R5bGVzKHdyYXBBbnNpMjU2LCAnYW5zaTI1NicsIGFuc2kyYW5zaSwgZmFsc2UpKTtcblx0c2V0TGF6eVByb3BlcnR5KHN0eWxlcy5jb2xvciwgJ2Fuc2kxNm0nLCAoKSA9PiBtYWtlRHluYW1pY1N0eWxlcyh3cmFwQW5zaTE2bSwgJ3JnYicsIHJnYjJyZ2IsIGZhbHNlKSk7XG5cdHNldExhenlQcm9wZXJ0eShzdHlsZXMuYmdDb2xvciwgJ2Fuc2knLCAoKSA9PiBtYWtlRHluYW1pY1N0eWxlcyh3cmFwQW5zaTE2LCAnYW5zaTE2JywgYW5zaTJhbnNpLCB0cnVlKSk7XG5cdHNldExhenlQcm9wZXJ0eShzdHlsZXMuYmdDb2xvciwgJ2Fuc2kyNTYnLCAoKSA9PiBtYWtlRHluYW1pY1N0eWxlcyh3cmFwQW5zaTI1NiwgJ2Fuc2kyNTYnLCBhbnNpMmFuc2ksIHRydWUpKTtcblx0c2V0TGF6eVByb3BlcnR5KHN0eWxlcy5iZ0NvbG9yLCAnYW5zaTE2bScsICgpID0+IG1ha2VEeW5hbWljU3R5bGVzKHdyYXBBbnNpMTZtLCAncmdiJywgcmdiMnJnYiwgdHJ1ZSkpO1xuXG5cdHJldHVybiBzdHlsZXM7XG59XG5cbi8vIE1ha2UgdGhlIGV4cG9ydCBpbW11dGFibGVcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsICdleHBvcnRzJywge1xuXHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRnZXQ6IGFzc2VtYmxlU3R5bGVzXG59KTtcbiIsIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpLFxuICBwYXRoID0gcmVxdWlyZSgncGF0aCcpLFxuICBmaWxlVVJMVG9QYXRoID0gcmVxdWlyZSgnZmlsZS11cmktdG8tcGF0aCcpLFxuICBqb2luID0gcGF0aC5qb2luLFxuICBkaXJuYW1lID0gcGF0aC5kaXJuYW1lLFxuICBleGlzdHMgPVxuICAgIChmcy5hY2Nlc3NTeW5jICYmXG4gICAgICBmdW5jdGlvbihwYXRoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZnMuYWNjZXNzU3luYyhwYXRoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pIHx8XG4gICAgZnMuZXhpc3RzU3luYyB8fFxuICAgIHBhdGguZXhpc3RzU3luYyxcbiAgZGVmYXVsdHMgPSB7XG4gICAgYXJyb3c6IHByb2Nlc3MuZW52Lk5PREVfQklORElOR1NfQVJST1cgfHwgJyDihpIgJyxcbiAgICBjb21waWxlZDogcHJvY2Vzcy5lbnYuTk9ERV9CSU5ESU5HU19DT01QSUxFRF9ESVIgfHwgJ2NvbXBpbGVkJyxcbiAgICBwbGF0Zm9ybTogcHJvY2Vzcy5wbGF0Zm9ybSxcbiAgICBhcmNoOiBwcm9jZXNzLmFyY2gsXG4gICAgbm9kZVByZUd5cDpcbiAgICAgICdub2RlLXYnICtcbiAgICAgIHByb2Nlc3MudmVyc2lvbnMubW9kdWxlcyArXG4gICAgICAnLScgK1xuICAgICAgcHJvY2Vzcy5wbGF0Zm9ybSArXG4gICAgICAnLScgK1xuICAgICAgcHJvY2Vzcy5hcmNoLFxuICAgIHZlcnNpb246IHByb2Nlc3MudmVyc2lvbnMubm9kZSxcbiAgICBiaW5kaW5nczogJ2JpbmRpbmdzLm5vZGUnLFxuICAgIHRyeTogW1xuICAgICAgLy8gbm9kZS1neXAncyBsaW5rZWQgdmVyc2lvbiBpbiB0aGUgXCJidWlsZFwiIGRpclxuICAgICAgWydtb2R1bGVfcm9vdCcsICdidWlsZCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gbm9kZS13YWYgYW5kIGd5cF9hZGRvbiAoYS5rLmEgbm9kZS1neXApXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2J1aWxkJywgJ0RlYnVnJywgJ2JpbmRpbmdzJ10sXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2J1aWxkJywgJ1JlbGVhc2UnLCAnYmluZGluZ3MnXSxcbiAgICAgIC8vIERlYnVnIGZpbGVzLCBmb3IgZGV2ZWxvcG1lbnQgKGxlZ2FjeSBiZWhhdmlvciwgcmVtb3ZlIGZvciBub2RlIHYwLjkpXG4gICAgICBbJ21vZHVsZV9yb290JywgJ291dCcsICdEZWJ1ZycsICdiaW5kaW5ncyddLFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdEZWJ1ZycsICdiaW5kaW5ncyddLFxuICAgICAgLy8gUmVsZWFzZSBmaWxlcywgYnV0IG1hbnVhbGx5IGNvbXBpbGVkIChsZWdhY3kgYmVoYXZpb3IsIHJlbW92ZSBmb3Igbm9kZSB2MC45KVxuICAgICAgWydtb2R1bGVfcm9vdCcsICdvdXQnLCAnUmVsZWFzZScsICdiaW5kaW5ncyddLFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdSZWxlYXNlJywgJ2JpbmRpbmdzJ10sXG4gICAgICAvLyBMZWdhY3kgZnJvbSBub2RlLXdhZiwgbm9kZSA8PSAwLjQueFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdidWlsZCcsICdkZWZhdWx0JywgJ2JpbmRpbmdzJ10sXG4gICAgICAvLyBQcm9kdWN0aW9uIFwiUmVsZWFzZVwiIGJ1aWxkdHlwZSBiaW5hcnkgKG1laC4uLilcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnY29tcGlsZWQnLCAndmVyc2lvbicsICdwbGF0Zm9ybScsICdhcmNoJywgJ2JpbmRpbmdzJ10sXG4gICAgICAvLyBub2RlLXFicyBidWlsZHNcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnYWRkb24tYnVpbGQnLCAncmVsZWFzZScsICdpbnN0YWxsLXJvb3QnLCAnYmluZGluZ3MnXSxcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnYWRkb24tYnVpbGQnLCAnZGVidWcnLCAnaW5zdGFsbC1yb290JywgJ2JpbmRpbmdzJ10sXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2FkZG9uLWJ1aWxkJywgJ2RlZmF1bHQnLCAnaW5zdGFsbC1yb290JywgJ2JpbmRpbmdzJ10sXG4gICAgICAvLyBub2RlLXByZS1neXAgcGF0aCAuL2xpYi9iaW5kaW5nL3tub2RlX2FiaX0te3BsYXRmb3JtfS17YXJjaH1cbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnbGliJywgJ2JpbmRpbmcnLCAnbm9kZVByZUd5cCcsICdiaW5kaW5ncyddXG4gICAgXVxuICB9O1xuXG4vKipcbiAqIFRoZSBtYWluIGBiaW5kaW5ncygpYCBmdW5jdGlvbiBsb2FkcyB0aGUgY29tcGlsZWQgYmluZGluZ3MgZm9yIGEgZ2l2ZW4gbW9kdWxlLlxuICogSXQgdXNlcyBWOCdzIEVycm9yIEFQSSB0byBkZXRlcm1pbmUgdGhlIHBhcmVudCBmaWxlbmFtZSB0aGF0IHRoaXMgZnVuY3Rpb24gaXNcbiAqIGJlaW5nIGludm9rZWQgZnJvbSwgd2hpY2ggaXMgdGhlbiB1c2VkIHRvIGZpbmQgdGhlIHJvb3QgZGlyZWN0b3J5LlxuICovXG5cbmZ1bmN0aW9uIGJpbmRpbmdzKG9wdHMpIHtcbiAgLy8gQXJndW1lbnQgc3VyZ2VyeVxuICBpZiAodHlwZW9mIG9wdHMgPT0gJ3N0cmluZycpIHtcbiAgICBvcHRzID0geyBiaW5kaW5nczogb3B0cyB9O1xuICB9IGVsc2UgaWYgKCFvcHRzKSB7XG4gICAgb3B0cyA9IHt9O1xuICB9XG5cbiAgLy8gbWFwcyBgZGVmYXVsdHNgIG9udG8gYG9wdHNgIG9iamVjdFxuICBPYmplY3Qua2V5cyhkZWZhdWx0cykubWFwKGZ1bmN0aW9uKGkpIHtcbiAgICBpZiAoIShpIGluIG9wdHMpKSBvcHRzW2ldID0gZGVmYXVsdHNbaV07XG4gIH0pO1xuXG4gIC8vIEdldCB0aGUgbW9kdWxlIHJvb3RcbiAgaWYgKCFvcHRzLm1vZHVsZV9yb290KSB7XG4gICAgb3B0cy5tb2R1bGVfcm9vdCA9IGV4cG9ydHMuZ2V0Um9vdChleHBvcnRzLmdldEZpbGVOYW1lKCkpO1xuICB9XG5cbiAgLy8gRW5zdXJlIHRoZSBnaXZlbiBiaW5kaW5ncyBuYW1lIGVuZHMgd2l0aCAubm9kZVxuICBpZiAocGF0aC5leHRuYW1lKG9wdHMuYmluZGluZ3MpICE9ICcubm9kZScpIHtcbiAgICBvcHRzLmJpbmRpbmdzICs9ICcubm9kZSc7XG4gIH1cblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay93ZWJwYWNrL2lzc3Vlcy80MTc1I2lzc3VlY29tbWVudC0zNDI5MzEwMzVcbiAgdmFyIHJlcXVpcmVGdW5jID1cbiAgICB0eXBlb2YgX193ZWJwYWNrX3JlcXVpcmVfXyA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgPyBfX25vbl93ZWJwYWNrX3JlcXVpcmVfX1xuICAgICAgOiByZXF1aXJlO1xuXG4gIHZhciB0cmllcyA9IFtdLFxuICAgIGkgPSAwLFxuICAgIGwgPSBvcHRzLnRyeS5sZW5ndGgsXG4gICAgbixcbiAgICBiLFxuICAgIGVycjtcblxuICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgIG4gPSBqb2luLmFwcGx5KFxuICAgICAgbnVsbCxcbiAgICAgIG9wdHMudHJ5W2ldLm1hcChmdW5jdGlvbihwKSB7XG4gICAgICAgIHJldHVybiBvcHRzW3BdIHx8IHA7XG4gICAgICB9KVxuICAgICk7XG4gICAgdHJpZXMucHVzaChuKTtcbiAgICB0cnkge1xuICAgICAgYiA9IG9wdHMucGF0aCA/IHJlcXVpcmVGdW5jLnJlc29sdmUobikgOiByZXF1aXJlRnVuYyhuKTtcbiAgICAgIGlmICghb3B0cy5wYXRoKSB7XG4gICAgICAgIGIucGF0aCA9IG47XG4gICAgICB9XG4gICAgICByZXR1cm4gYjtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5jb2RlICE9PSAnTU9EVUxFX05PVF9GT1VORCcgJiZcbiAgICAgICAgICBlLmNvZGUgIT09ICdRVUFMSUZJRURfUEFUSF9SRVNPTFVUSU9OX0ZBSUxFRCcgJiZcbiAgICAgICAgICAhL25vdCBmaW5kL2kudGVzdChlLm1lc3NhZ2UpKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZXJyID0gbmV3IEVycm9yKFxuICAgICdDb3VsZCBub3QgbG9jYXRlIHRoZSBiaW5kaW5ncyBmaWxlLiBUcmllZDpcXG4nICtcbiAgICAgIHRyaWVzXG4gICAgICAgIC5tYXAoZnVuY3Rpb24oYSkge1xuICAgICAgICAgIHJldHVybiBvcHRzLmFycm93ICsgYTtcbiAgICAgICAgfSlcbiAgICAgICAgLmpvaW4oJ1xcbicpXG4gICk7XG4gIGVyci50cmllcyA9IHRyaWVzO1xuICB0aHJvdyBlcnI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBiaW5kaW5ncztcblxuLyoqXG4gKiBHZXRzIHRoZSBmaWxlbmFtZSBvZiB0aGUgSmF2YVNjcmlwdCBmaWxlIHRoYXQgaW52b2tlcyB0aGlzIGZ1bmN0aW9uLlxuICogVXNlZCB0byBoZWxwIGZpbmQgdGhlIHJvb3QgZGlyZWN0b3J5IG9mIGEgbW9kdWxlLlxuICogT3B0aW9uYWxseSBhY2NlcHRzIGFuIGZpbGVuYW1lIGFyZ3VtZW50IHRvIHNraXAgd2hlbiBzZWFyY2hpbmcgZm9yIHRoZSBpbnZva2luZyBmaWxlbmFtZVxuICovXG5cbmV4cG9ydHMuZ2V0RmlsZU5hbWUgPSBmdW5jdGlvbiBnZXRGaWxlTmFtZShjYWxsaW5nX2ZpbGUpIHtcbiAgdmFyIG9yaWdQU1QgPSBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSxcbiAgICBvcmlnU1RMID0gRXJyb3Iuc3RhY2tUcmFjZUxpbWl0LFxuICAgIGR1bW15ID0ge30sXG4gICAgZmlsZU5hbWU7XG5cbiAgRXJyb3Iuc3RhY2tUcmFjZUxpbWl0ID0gMTA7XG5cbiAgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSBmdW5jdGlvbihlLCBzdCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gc3QubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmaWxlTmFtZSA9IHN0W2ldLmdldEZpbGVOYW1lKCk7XG4gICAgICBpZiAoZmlsZU5hbWUgIT09IF9fZmlsZW5hbWUpIHtcbiAgICAgICAgaWYgKGNhbGxpbmdfZmlsZSkge1xuICAgICAgICAgIGlmIChmaWxlTmFtZSAhPT0gY2FsbGluZ19maWxlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBydW4gdGhlICdwcmVwYXJlU3RhY2tUcmFjZScgZnVuY3Rpb24gYWJvdmVcbiAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UoZHVtbXkpO1xuICBkdW1teS5zdGFjaztcblxuICAvLyBjbGVhbnVwXG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gb3JpZ1BTVDtcbiAgRXJyb3Iuc3RhY2tUcmFjZUxpbWl0ID0gb3JpZ1NUTDtcblxuICAvLyBoYW5kbGUgZmlsZW5hbWUgdGhhdCBzdGFydHMgd2l0aCBcImZpbGU6Ly9cIlxuICB2YXIgZmlsZVNjaGVtYSA9ICdmaWxlOi8vJztcbiAgaWYgKGZpbGVOYW1lLmluZGV4T2YoZmlsZVNjaGVtYSkgPT09IDApIHtcbiAgICBmaWxlTmFtZSA9IGZpbGVVUkxUb1BhdGgoZmlsZU5hbWUpO1xuICB9XG5cbiAgcmV0dXJuIGZpbGVOYW1lO1xufTtcblxuLyoqXG4gKiBHZXRzIHRoZSByb290IGRpcmVjdG9yeSBvZiBhIG1vZHVsZSwgZ2l2ZW4gYW4gYXJiaXRyYXJ5IGZpbGVuYW1lXG4gKiBzb21ld2hlcmUgaW4gdGhlIG1vZHVsZSB0cmVlLiBUaGUgXCJyb290IGRpcmVjdG9yeVwiIGlzIHRoZSBkaXJlY3RvcnlcbiAqIGNvbnRhaW5pbmcgdGhlIGBwYWNrYWdlLmpzb25gIGZpbGUuXG4gKlxuICogICBJbjogIC9ob21lL25hdGUvbm9kZS1uYXRpdmUtbW9kdWxlL2xpYi9pbmRleC5qc1xuICogICBPdXQ6IC9ob21lL25hdGUvbm9kZS1uYXRpdmUtbW9kdWxlXG4gKi9cblxuZXhwb3J0cy5nZXRSb290ID0gZnVuY3Rpb24gZ2V0Um9vdChmaWxlKSB7XG4gIHZhciBkaXIgPSBkaXJuYW1lKGZpbGUpLFxuICAgIHByZXY7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgaWYgKGRpciA9PT0gJy4nKSB7XG4gICAgICAvLyBBdm9pZHMgYW4gaW5maW5pdGUgbG9vcCBpbiByYXJlIGNhc2VzLCBsaWtlIHRoZSBSRVBMXG4gICAgICBkaXIgPSBwcm9jZXNzLmN3ZCgpO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICBleGlzdHMoam9pbihkaXIsICdwYWNrYWdlLmpzb24nKSkgfHxcbiAgICAgIGV4aXN0cyhqb2luKGRpciwgJ25vZGVfbW9kdWxlcycpKVxuICAgICkge1xuICAgICAgLy8gRm91bmQgdGhlICdwYWNrYWdlLmpzb24nIGZpbGUgb3IgJ25vZGVfbW9kdWxlcycgZGlyOyB3ZSdyZSBkb25lXG4gICAgICByZXR1cm4gZGlyO1xuICAgIH1cbiAgICBpZiAocHJldiA9PT0gZGlyKSB7XG4gICAgICAvLyBHb3QgdG8gdGhlIHRvcFxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ291bGQgbm90IGZpbmQgbW9kdWxlIHJvb3QgZ2l2ZW4gZmlsZTogXCInICtcbiAgICAgICAgICBmaWxlICtcbiAgICAgICAgICAnXCIuIERvIHlvdSBoYXZlIGEgYHBhY2thZ2UuanNvbmAgZmlsZT8gJ1xuICAgICAgKTtcbiAgICB9XG4gICAgLy8gVHJ5IHRoZSBwYXJlbnQgZGlyIG5leHRcbiAgICBwcmV2ID0gZGlyO1xuICAgIGRpciA9IGpvaW4oZGlyLCAnLi4nKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGFuc2lTdHlsZXMgPSByZXF1aXJlKCdhbnNpLXN0eWxlcycpO1xuY29uc3Qge3N0ZG91dDogc3Rkb3V0Q29sb3IsIHN0ZGVycjogc3RkZXJyQ29sb3J9ID0gcmVxdWlyZSgnc3VwcG9ydHMtY29sb3InKTtcbmNvbnN0IHtcblx0c3RyaW5nUmVwbGFjZUFsbCxcblx0c3RyaW5nRW5jYXNlQ1JMRldpdGhGaXJzdEluZGV4XG59ID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmNvbnN0IHtpc0FycmF5fSA9IEFycmF5O1xuXG4vLyBgc3VwcG9ydHNDb2xvci5sZXZlbGAg4oaSIGBhbnNpU3R5bGVzLmNvbG9yW25hbWVdYCBtYXBwaW5nXG5jb25zdCBsZXZlbE1hcHBpbmcgPSBbXG5cdCdhbnNpJyxcblx0J2Fuc2knLFxuXHQnYW5zaTI1NicsXG5cdCdhbnNpMTZtJ1xuXTtcblxuY29uc3Qgc3R5bGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuY29uc3QgYXBwbHlPcHRpb25zID0gKG9iamVjdCwgb3B0aW9ucyA9IHt9KSA9PiB7XG5cdGlmIChvcHRpb25zLmxldmVsICYmICEoTnVtYmVyLmlzSW50ZWdlcihvcHRpb25zLmxldmVsKSAmJiBvcHRpb25zLmxldmVsID49IDAgJiYgb3B0aW9ucy5sZXZlbCA8PSAzKSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignVGhlIGBsZXZlbGAgb3B0aW9uIHNob3VsZCBiZSBhbiBpbnRlZ2VyIGZyb20gMCB0byAzJyk7XG5cdH1cblxuXHQvLyBEZXRlY3QgbGV2ZWwgaWYgbm90IHNldCBtYW51YWxseVxuXHRjb25zdCBjb2xvckxldmVsID0gc3Rkb3V0Q29sb3IgPyBzdGRvdXRDb2xvci5sZXZlbCA6IDA7XG5cdG9iamVjdC5sZXZlbCA9IG9wdGlvbnMubGV2ZWwgPT09IHVuZGVmaW5lZCA/IGNvbG9yTGV2ZWwgOiBvcHRpb25zLmxldmVsO1xufTtcblxuY2xhc3MgQ2hhbGtDbGFzcyB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RydWN0b3ItcmV0dXJuXG5cdFx0cmV0dXJuIGNoYWxrRmFjdG9yeShvcHRpb25zKTtcblx0fVxufVxuXG5jb25zdCBjaGFsa0ZhY3RvcnkgPSBvcHRpb25zID0+IHtcblx0Y29uc3QgY2hhbGsgPSB7fTtcblx0YXBwbHlPcHRpb25zKGNoYWxrLCBvcHRpb25zKTtcblxuXHRjaGFsay50ZW1wbGF0ZSA9ICguLi5hcmd1bWVudHNfKSA9PiBjaGFsa1RhZyhjaGFsay50ZW1wbGF0ZSwgLi4uYXJndW1lbnRzXyk7XG5cblx0T2JqZWN0LnNldFByb3RvdHlwZU9mKGNoYWxrLCBDaGFsay5wcm90b3R5cGUpO1xuXHRPYmplY3Quc2V0UHJvdG90eXBlT2YoY2hhbGsudGVtcGxhdGUsIGNoYWxrKTtcblxuXHRjaGFsay50ZW1wbGF0ZS5jb25zdHJ1Y3RvciA9ICgpID0+IHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2BjaGFsay5jb25zdHJ1Y3RvcigpYCBpcyBkZXByZWNhdGVkLiBVc2UgYG5ldyBjaGFsay5JbnN0YW5jZSgpYCBpbnN0ZWFkLicpO1xuXHR9O1xuXG5cdGNoYWxrLnRlbXBsYXRlLkluc3RhbmNlID0gQ2hhbGtDbGFzcztcblxuXHRyZXR1cm4gY2hhbGsudGVtcGxhdGU7XG59O1xuXG5mdW5jdGlvbiBDaGFsayhvcHRpb25zKSB7XG5cdHJldHVybiBjaGFsa0ZhY3Rvcnkob3B0aW9ucyk7XG59XG5cbmZvciAoY29uc3QgW3N0eWxlTmFtZSwgc3R5bGVdIG9mIE9iamVjdC5lbnRyaWVzKGFuc2lTdHlsZXMpKSB7XG5cdHN0eWxlc1tzdHlsZU5hbWVdID0ge1xuXHRcdGdldCgpIHtcblx0XHRcdGNvbnN0IGJ1aWxkZXIgPSBjcmVhdGVCdWlsZGVyKHRoaXMsIGNyZWF0ZVN0eWxlcihzdHlsZS5vcGVuLCBzdHlsZS5jbG9zZSwgdGhpcy5fc3R5bGVyKSwgdGhpcy5faXNFbXB0eSk7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgc3R5bGVOYW1lLCB7dmFsdWU6IGJ1aWxkZXJ9KTtcblx0XHRcdHJldHVybiBidWlsZGVyO1xuXHRcdH1cblx0fTtcbn1cblxuc3R5bGVzLnZpc2libGUgPSB7XG5cdGdldCgpIHtcblx0XHRjb25zdCBidWlsZGVyID0gY3JlYXRlQnVpbGRlcih0aGlzLCB0aGlzLl9zdHlsZXIsIHRydWUpO1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndmlzaWJsZScsIHt2YWx1ZTogYnVpbGRlcn0pO1xuXHRcdHJldHVybiBidWlsZGVyO1xuXHR9XG59O1xuXG5jb25zdCB1c2VkTW9kZWxzID0gWydyZ2InLCAnaGV4JywgJ2tleXdvcmQnLCAnaHNsJywgJ2hzdicsICdod2InLCAnYW5zaScsICdhbnNpMjU2J107XG5cbmZvciAoY29uc3QgbW9kZWwgb2YgdXNlZE1vZGVscykge1xuXHRzdHlsZXNbbW9kZWxdID0ge1xuXHRcdGdldCgpIHtcblx0XHRcdGNvbnN0IHtsZXZlbH0gPSB0aGlzO1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uICguLi5hcmd1bWVudHNfKSB7XG5cdFx0XHRcdGNvbnN0IHN0eWxlciA9IGNyZWF0ZVN0eWxlcihhbnNpU3R5bGVzLmNvbG9yW2xldmVsTWFwcGluZ1tsZXZlbF1dW21vZGVsXSguLi5hcmd1bWVudHNfKSwgYW5zaVN0eWxlcy5jb2xvci5jbG9zZSwgdGhpcy5fc3R5bGVyKTtcblx0XHRcdFx0cmV0dXJuIGNyZWF0ZUJ1aWxkZXIodGhpcywgc3R5bGVyLCB0aGlzLl9pc0VtcHR5KTtcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xufVxuXG5mb3IgKGNvbnN0IG1vZGVsIG9mIHVzZWRNb2RlbHMpIHtcblx0Y29uc3QgYmdNb2RlbCA9ICdiZycgKyBtb2RlbFswXS50b1VwcGVyQ2FzZSgpICsgbW9kZWwuc2xpY2UoMSk7XG5cdHN0eWxlc1tiZ01vZGVsXSA9IHtcblx0XHRnZXQoKSB7XG5cdFx0XHRjb25zdCB7bGV2ZWx9ID0gdGhpcztcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoLi4uYXJndW1lbnRzXykge1xuXHRcdFx0XHRjb25zdCBzdHlsZXIgPSBjcmVhdGVTdHlsZXIoYW5zaVN0eWxlcy5iZ0NvbG9yW2xldmVsTWFwcGluZ1tsZXZlbF1dW21vZGVsXSguLi5hcmd1bWVudHNfKSwgYW5zaVN0eWxlcy5iZ0NvbG9yLmNsb3NlLCB0aGlzLl9zdHlsZXIpO1xuXHRcdFx0XHRyZXR1cm4gY3JlYXRlQnVpbGRlcih0aGlzLCBzdHlsZXIsIHRoaXMuX2lzRW1wdHkpO1xuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59XG5cbmNvbnN0IHByb3RvID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoKCkgPT4ge30sIHtcblx0Li4uc3R5bGVzLFxuXHRsZXZlbDoge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0KCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2dlbmVyYXRvci5sZXZlbDtcblx0XHR9LFxuXHRcdHNldChsZXZlbCkge1xuXHRcdFx0dGhpcy5fZ2VuZXJhdG9yLmxldmVsID0gbGV2ZWw7XG5cdFx0fVxuXHR9XG59KTtcblxuY29uc3QgY3JlYXRlU3R5bGVyID0gKG9wZW4sIGNsb3NlLCBwYXJlbnQpID0+IHtcblx0bGV0IG9wZW5BbGw7XG5cdGxldCBjbG9zZUFsbDtcblx0aWYgKHBhcmVudCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0b3BlbkFsbCA9IG9wZW47XG5cdFx0Y2xvc2VBbGwgPSBjbG9zZTtcblx0fSBlbHNlIHtcblx0XHRvcGVuQWxsID0gcGFyZW50Lm9wZW5BbGwgKyBvcGVuO1xuXHRcdGNsb3NlQWxsID0gY2xvc2UgKyBwYXJlbnQuY2xvc2VBbGw7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdG9wZW4sXG5cdFx0Y2xvc2UsXG5cdFx0b3BlbkFsbCxcblx0XHRjbG9zZUFsbCxcblx0XHRwYXJlbnRcblx0fTtcbn07XG5cbmNvbnN0IGNyZWF0ZUJ1aWxkZXIgPSAoc2VsZiwgX3N0eWxlciwgX2lzRW1wdHkpID0+IHtcblx0Y29uc3QgYnVpbGRlciA9ICguLi5hcmd1bWVudHNfKSA9PiB7XG5cdFx0aWYgKGlzQXJyYXkoYXJndW1lbnRzX1swXSkgJiYgaXNBcnJheShhcmd1bWVudHNfWzBdLnJhdykpIHtcblx0XHRcdC8vIENhbGxlZCBhcyBhIHRlbXBsYXRlIGxpdGVyYWwsIGZvciBleGFtcGxlOiBjaGFsay5yZWRgMiArIDMgPSB7Ym9sZCAkezIrM319YFxuXHRcdFx0cmV0dXJuIGFwcGx5U3R5bGUoYnVpbGRlciwgY2hhbGtUYWcoYnVpbGRlciwgLi4uYXJndW1lbnRzXykpO1xuXHRcdH1cblxuXHRcdC8vIFNpbmdsZSBhcmd1bWVudCBpcyBob3QgcGF0aCwgaW1wbGljaXQgY29lcmNpb24gaXMgZmFzdGVyIHRoYW4gYW55dGhpbmdcblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8taW1wbGljaXQtY29lcmNpb25cblx0XHRyZXR1cm4gYXBwbHlTdHlsZShidWlsZGVyLCAoYXJndW1lbnRzXy5sZW5ndGggPT09IDEpID8gKCcnICsgYXJndW1lbnRzX1swXSkgOiBhcmd1bWVudHNfLmpvaW4oJyAnKSk7XG5cdH07XG5cblx0Ly8gV2UgYWx0ZXIgdGhlIHByb3RvdHlwZSBiZWNhdXNlIHdlIG11c3QgcmV0dXJuIGEgZnVuY3Rpb24sIGJ1dCB0aGVyZSBpc1xuXHQvLyBubyB3YXkgdG8gY3JlYXRlIGEgZnVuY3Rpb24gd2l0aCBhIGRpZmZlcmVudCBwcm90b3R5cGVcblx0T2JqZWN0LnNldFByb3RvdHlwZU9mKGJ1aWxkZXIsIHByb3RvKTtcblxuXHRidWlsZGVyLl9nZW5lcmF0b3IgPSBzZWxmO1xuXHRidWlsZGVyLl9zdHlsZXIgPSBfc3R5bGVyO1xuXHRidWlsZGVyLl9pc0VtcHR5ID0gX2lzRW1wdHk7XG5cblx0cmV0dXJuIGJ1aWxkZXI7XG59O1xuXG5jb25zdCBhcHBseVN0eWxlID0gKHNlbGYsIHN0cmluZykgPT4ge1xuXHRpZiAoc2VsZi5sZXZlbCA8PSAwIHx8ICFzdHJpbmcpIHtcblx0XHRyZXR1cm4gc2VsZi5faXNFbXB0eSA/ICcnIDogc3RyaW5nO1xuXHR9XG5cblx0bGV0IHN0eWxlciA9IHNlbGYuX3N0eWxlcjtcblxuXHRpZiAoc3R5bGVyID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gc3RyaW5nO1xuXHR9XG5cblx0Y29uc3Qge29wZW5BbGwsIGNsb3NlQWxsfSA9IHN0eWxlcjtcblx0aWYgKHN0cmluZy5pbmRleE9mKCdcXHUwMDFCJykgIT09IC0xKSB7XG5cdFx0d2hpbGUgKHN0eWxlciAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyBSZXBsYWNlIGFueSBpbnN0YW5jZXMgYWxyZWFkeSBwcmVzZW50IHdpdGggYSByZS1vcGVuaW5nIGNvZGVcblx0XHRcdC8vIG90aGVyd2lzZSBvbmx5IHRoZSBwYXJ0IG9mIHRoZSBzdHJpbmcgdW50aWwgc2FpZCBjbG9zaW5nIGNvZGVcblx0XHRcdC8vIHdpbGwgYmUgY29sb3JlZCwgYW5kIHRoZSByZXN0IHdpbGwgc2ltcGx5IGJlICdwbGFpbicuXG5cdFx0XHRzdHJpbmcgPSBzdHJpbmdSZXBsYWNlQWxsKHN0cmluZywgc3R5bGVyLmNsb3NlLCBzdHlsZXIub3Blbik7XG5cblx0XHRcdHN0eWxlciA9IHN0eWxlci5wYXJlbnQ7XG5cdFx0fVxuXHR9XG5cblx0Ly8gV2UgY2FuIG1vdmUgYm90aCBuZXh0IGFjdGlvbnMgb3V0IG9mIGxvb3AsIGJlY2F1c2UgcmVtYWluaW5nIGFjdGlvbnMgaW4gbG9vcCB3b24ndCBoYXZlXG5cdC8vIGFueS92aXNpYmxlIGVmZmVjdCBvbiBwYXJ0cyB3ZSBhZGQgaGVyZS4gQ2xvc2UgdGhlIHN0eWxpbmcgYmVmb3JlIGEgbGluZWJyZWFrIGFuZCByZW9wZW5cblx0Ly8gYWZ0ZXIgbmV4dCBsaW5lIHRvIGZpeCBhIGJsZWVkIGlzc3VlIG9uIG1hY09TOiBodHRwczovL2dpdGh1Yi5jb20vY2hhbGsvY2hhbGsvcHVsbC85MlxuXHRjb25zdCBsZkluZGV4ID0gc3RyaW5nLmluZGV4T2YoJ1xcbicpO1xuXHRpZiAobGZJbmRleCAhPT0gLTEpIHtcblx0XHRzdHJpbmcgPSBzdHJpbmdFbmNhc2VDUkxGV2l0aEZpcnN0SW5kZXgoc3RyaW5nLCBjbG9zZUFsbCwgb3BlbkFsbCwgbGZJbmRleCk7XG5cdH1cblxuXHRyZXR1cm4gb3BlbkFsbCArIHN0cmluZyArIGNsb3NlQWxsO1xufTtcblxubGV0IHRlbXBsYXRlO1xuY29uc3QgY2hhbGtUYWcgPSAoY2hhbGssIC4uLnN0cmluZ3MpID0+IHtcblx0Y29uc3QgW2ZpcnN0U3RyaW5nXSA9IHN0cmluZ3M7XG5cblx0aWYgKCFpc0FycmF5KGZpcnN0U3RyaW5nKSB8fCAhaXNBcnJheShmaXJzdFN0cmluZy5yYXcpKSB7XG5cdFx0Ly8gSWYgY2hhbGsoKSB3YXMgY2FsbGVkIGJ5IGl0c2VsZiBvciB3aXRoIGEgc3RyaW5nLFxuXHRcdC8vIHJldHVybiB0aGUgc3RyaW5nIGl0c2VsZiBhcyBhIHN0cmluZy5cblx0XHRyZXR1cm4gc3RyaW5ncy5qb2luKCcgJyk7XG5cdH1cblxuXHRjb25zdCBhcmd1bWVudHNfID0gc3RyaW5ncy5zbGljZSgxKTtcblx0Y29uc3QgcGFydHMgPSBbZmlyc3RTdHJpbmcucmF3WzBdXTtcblxuXHRmb3IgKGxldCBpID0gMTsgaSA8IGZpcnN0U3RyaW5nLmxlbmd0aDsgaSsrKSB7XG5cdFx0cGFydHMucHVzaChcblx0XHRcdFN0cmluZyhhcmd1bWVudHNfW2kgLSAxXSkucmVwbGFjZSgvW3t9XFxcXF0vZywgJ1xcXFwkJicpLFxuXHRcdFx0U3RyaW5nKGZpcnN0U3RyaW5nLnJhd1tpXSlcblx0XHQpO1xuXHR9XG5cblx0aWYgKHRlbXBsYXRlID09PSB1bmRlZmluZWQpIHtcblx0XHR0ZW1wbGF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzJyk7XG5cdH1cblxuXHRyZXR1cm4gdGVtcGxhdGUoY2hhbGssIHBhcnRzLmpvaW4oJycpKTtcbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENoYWxrLnByb3RvdHlwZSwgc3R5bGVzKTtcblxuY29uc3QgY2hhbGsgPSBDaGFsaygpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5ldy1jYXBcbmNoYWxrLnN1cHBvcnRzQ29sb3IgPSBzdGRvdXRDb2xvcjtcbmNoYWxrLnN0ZGVyciA9IENoYWxrKHtsZXZlbDogc3RkZXJyQ29sb3IgPyBzdGRlcnJDb2xvci5sZXZlbCA6IDB9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuZXctY2FwXG5jaGFsay5zdGRlcnIuc3VwcG9ydHNDb2xvciA9IHN0ZGVyckNvbG9yO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNoYWxrO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgVEVNUExBVEVfUkVHRVggPSAvKD86XFxcXCh1KD86W2EtZlxcZF17NH18XFx7W2EtZlxcZF17MSw2fVxcfSl8eFthLWZcXGRdezJ9fC4pKXwoPzpcXHsofik/KFxcdysoPzpcXChbXildKlxcKSk/KD86XFwuXFx3Kyg/OlxcKFteKV0qXFwpKT8pKikoPzpbIFxcdF18KD89XFxyP1xcbikpKXwoXFx9KXwoKD86LnxbXFxyXFxuXFxmXSkrPykvZ2k7XG5jb25zdCBTVFlMRV9SRUdFWCA9IC8oPzpefFxcLikoXFx3KykoPzpcXCgoW14pXSopXFwpKT8vZztcbmNvbnN0IFNUUklOR19SRUdFWCA9IC9eKFsnXCJdKSgoPzpcXFxcLnwoPyFcXDEpW15cXFxcXSkqKVxcMSQvO1xuY29uc3QgRVNDQVBFX1JFR0VYID0gL1xcXFwodSg/OlthLWZcXGRdezR9fHtbYS1mXFxkXXsxLDZ9fSl8eFthLWZcXGRdezJ9fC4pfChbXlxcXFxdKS9naTtcblxuY29uc3QgRVNDQVBFUyA9IG5ldyBNYXAoW1xuXHRbJ24nLCAnXFxuJ10sXG5cdFsncicsICdcXHInXSxcblx0Wyd0JywgJ1xcdCddLFxuXHRbJ2InLCAnXFxiJ10sXG5cdFsnZicsICdcXGYnXSxcblx0Wyd2JywgJ1xcdiddLFxuXHRbJzAnLCAnXFwwJ10sXG5cdFsnXFxcXCcsICdcXFxcJ10sXG5cdFsnZScsICdcXHUwMDFCJ10sXG5cdFsnYScsICdcXHUwMDA3J11cbl0pO1xuXG5mdW5jdGlvbiB1bmVzY2FwZShjKSB7XG5cdGNvbnN0IHUgPSBjWzBdID09PSAndSc7XG5cdGNvbnN0IGJyYWNrZXQgPSBjWzFdID09PSAneyc7XG5cblx0aWYgKCh1ICYmICFicmFja2V0ICYmIGMubGVuZ3RoID09PSA1KSB8fCAoY1swXSA9PT0gJ3gnICYmIGMubGVuZ3RoID09PSAzKSkge1xuXHRcdHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KGMuc2xpY2UoMSksIDE2KSk7XG5cdH1cblxuXHRpZiAodSAmJiBicmFja2V0KSB7XG5cdFx0cmV0dXJuIFN0cmluZy5mcm9tQ29kZVBvaW50KHBhcnNlSW50KGMuc2xpY2UoMiwgLTEpLCAxNikpO1xuXHR9XG5cblx0cmV0dXJuIEVTQ0FQRVMuZ2V0KGMpIHx8IGM7XG59XG5cbmZ1bmN0aW9uIHBhcnNlQXJndW1lbnRzKG5hbWUsIGFyZ3VtZW50c18pIHtcblx0Y29uc3QgcmVzdWx0cyA9IFtdO1xuXHRjb25zdCBjaHVua3MgPSBhcmd1bWVudHNfLnRyaW0oKS5zcGxpdCgvXFxzKixcXHMqL2cpO1xuXHRsZXQgbWF0Y2hlcztcblxuXHRmb3IgKGNvbnN0IGNodW5rIG9mIGNodW5rcykge1xuXHRcdGNvbnN0IG51bWJlciA9IE51bWJlcihjaHVuayk7XG5cdFx0aWYgKCFOdW1iZXIuaXNOYU4obnVtYmVyKSkge1xuXHRcdFx0cmVzdWx0cy5wdXNoKG51bWJlcik7XG5cdFx0fSBlbHNlIGlmICgobWF0Y2hlcyA9IGNodW5rLm1hdGNoKFNUUklOR19SRUdFWCkpKSB7XG5cdFx0XHRyZXN1bHRzLnB1c2gobWF0Y2hlc1syXS5yZXBsYWNlKEVTQ0FQRV9SRUdFWCwgKG0sIGVzY2FwZSwgY2hhcmFjdGVyKSA9PiBlc2NhcGUgPyB1bmVzY2FwZShlc2NhcGUpIDogY2hhcmFjdGVyKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBDaGFsayB0ZW1wbGF0ZSBzdHlsZSBhcmd1bWVudDogJHtjaHVua30gKGluIHN0eWxlICcke25hbWV9JylgKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0cztcbn1cblxuZnVuY3Rpb24gcGFyc2VTdHlsZShzdHlsZSkge1xuXHRTVFlMRV9SRUdFWC5sYXN0SW5kZXggPSAwO1xuXG5cdGNvbnN0IHJlc3VsdHMgPSBbXTtcblx0bGV0IG1hdGNoZXM7XG5cblx0d2hpbGUgKChtYXRjaGVzID0gU1RZTEVfUkVHRVguZXhlYyhzdHlsZSkpICE9PSBudWxsKSB7XG5cdFx0Y29uc3QgbmFtZSA9IG1hdGNoZXNbMV07XG5cblx0XHRpZiAobWF0Y2hlc1syXSkge1xuXHRcdFx0Y29uc3QgYXJncyA9IHBhcnNlQXJndW1lbnRzKG5hbWUsIG1hdGNoZXNbMl0pO1xuXHRcdFx0cmVzdWx0cy5wdXNoKFtuYW1lXS5jb25jYXQoYXJncykpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHRzLnB1c2goW25hbWVdKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gcmVzdWx0cztcbn1cblxuZnVuY3Rpb24gYnVpbGRTdHlsZShjaGFsaywgc3R5bGVzKSB7XG5cdGNvbnN0IGVuYWJsZWQgPSB7fTtcblxuXHRmb3IgKGNvbnN0IGxheWVyIG9mIHN0eWxlcykge1xuXHRcdGZvciAoY29uc3Qgc3R5bGUgb2YgbGF5ZXIuc3R5bGVzKSB7XG5cdFx0XHRlbmFibGVkW3N0eWxlWzBdXSA9IGxheWVyLmludmVyc2UgPyBudWxsIDogc3R5bGUuc2xpY2UoMSk7XG5cdFx0fVxuXHR9XG5cblx0bGV0IGN1cnJlbnQgPSBjaGFsaztcblx0Zm9yIChjb25zdCBbc3R5bGVOYW1lLCBzdHlsZXNdIG9mIE9iamVjdC5lbnRyaWVzKGVuYWJsZWQpKSB7XG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KHN0eWxlcykpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGlmICghKHN0eWxlTmFtZSBpbiBjdXJyZW50KSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBVbmtub3duIENoYWxrIHN0eWxlOiAke3N0eWxlTmFtZX1gKTtcblx0XHR9XG5cblx0XHRjdXJyZW50ID0gc3R5bGVzLmxlbmd0aCA+IDAgPyBjdXJyZW50W3N0eWxlTmFtZV0oLi4uc3R5bGVzKSA6IGN1cnJlbnRbc3R5bGVOYW1lXTtcblx0fVxuXG5cdHJldHVybiBjdXJyZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IChjaGFsaywgdGVtcG9yYXJ5KSA9PiB7XG5cdGNvbnN0IHN0eWxlcyA9IFtdO1xuXHRjb25zdCBjaHVua3MgPSBbXTtcblx0bGV0IGNodW5rID0gW107XG5cblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1wYXJhbXNcblx0dGVtcG9yYXJ5LnJlcGxhY2UoVEVNUExBVEVfUkVHRVgsIChtLCBlc2NhcGVDaGFyYWN0ZXIsIGludmVyc2UsIHN0eWxlLCBjbG9zZSwgY2hhcmFjdGVyKSA9PiB7XG5cdFx0aWYgKGVzY2FwZUNoYXJhY3Rlcikge1xuXHRcdFx0Y2h1bmsucHVzaCh1bmVzY2FwZShlc2NhcGVDaGFyYWN0ZXIpKTtcblx0XHR9IGVsc2UgaWYgKHN0eWxlKSB7XG5cdFx0XHRjb25zdCBzdHJpbmcgPSBjaHVuay5qb2luKCcnKTtcblx0XHRcdGNodW5rID0gW107XG5cdFx0XHRjaHVua3MucHVzaChzdHlsZXMubGVuZ3RoID09PSAwID8gc3RyaW5nIDogYnVpbGRTdHlsZShjaGFsaywgc3R5bGVzKShzdHJpbmcpKTtcblx0XHRcdHN0eWxlcy5wdXNoKHtpbnZlcnNlLCBzdHlsZXM6IHBhcnNlU3R5bGUoc3R5bGUpfSk7XG5cdFx0fSBlbHNlIGlmIChjbG9zZSkge1xuXHRcdFx0aWYgKHN0eWxlcy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdGb3VuZCBleHRyYW5lb3VzIH0gaW4gQ2hhbGsgdGVtcGxhdGUgbGl0ZXJhbCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRjaHVua3MucHVzaChidWlsZFN0eWxlKGNoYWxrLCBzdHlsZXMpKGNodW5rLmpvaW4oJycpKSk7XG5cdFx0XHRjaHVuayA9IFtdO1xuXHRcdFx0c3R5bGVzLnBvcCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjaHVuay5wdXNoKGNoYXJhY3Rlcik7XG5cdFx0fVxuXHR9KTtcblxuXHRjaHVua3MucHVzaChjaHVuay5qb2luKCcnKSk7XG5cblx0aWYgKHN0eWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0Y29uc3QgZXJyTWVzc2FnZSA9IGBDaGFsayB0ZW1wbGF0ZSBsaXRlcmFsIGlzIG1pc3NpbmcgJHtzdHlsZXMubGVuZ3RofSBjbG9zaW5nIGJyYWNrZXQke3N0eWxlcy5sZW5ndGggPT09IDEgPyAnJyA6ICdzJ30gKFxcYH1cXGApYDtcblx0XHR0aHJvdyBuZXcgRXJyb3IoZXJyTWVzc2FnZSk7XG5cdH1cblxuXHRyZXR1cm4gY2h1bmtzLmpvaW4oJycpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgc3RyaW5nUmVwbGFjZUFsbCA9IChzdHJpbmcsIHN1YnN0cmluZywgcmVwbGFjZXIpID0+IHtcblx0bGV0IGluZGV4ID0gc3RyaW5nLmluZGV4T2Yoc3Vic3RyaW5nKTtcblx0aWYgKGluZGV4ID09PSAtMSkge1xuXHRcdHJldHVybiBzdHJpbmc7XG5cdH1cblxuXHRjb25zdCBzdWJzdHJpbmdMZW5ndGggPSBzdWJzdHJpbmcubGVuZ3RoO1xuXHRsZXQgZW5kSW5kZXggPSAwO1xuXHRsZXQgcmV0dXJuVmFsdWUgPSAnJztcblx0ZG8ge1xuXHRcdHJldHVyblZhbHVlICs9IHN0cmluZy5zdWJzdHIoZW5kSW5kZXgsIGluZGV4IC0gZW5kSW5kZXgpICsgc3Vic3RyaW5nICsgcmVwbGFjZXI7XG5cdFx0ZW5kSW5kZXggPSBpbmRleCArIHN1YnN0cmluZ0xlbmd0aDtcblx0XHRpbmRleCA9IHN0cmluZy5pbmRleE9mKHN1YnN0cmluZywgZW5kSW5kZXgpO1xuXHR9IHdoaWxlIChpbmRleCAhPT0gLTEpO1xuXG5cdHJldHVyblZhbHVlICs9IHN0cmluZy5zdWJzdHIoZW5kSW5kZXgpO1xuXHRyZXR1cm4gcmV0dXJuVmFsdWU7XG59O1xuXG5jb25zdCBzdHJpbmdFbmNhc2VDUkxGV2l0aEZpcnN0SW5kZXggPSAoc3RyaW5nLCBwcmVmaXgsIHBvc3RmaXgsIGluZGV4KSA9PiB7XG5cdGxldCBlbmRJbmRleCA9IDA7XG5cdGxldCByZXR1cm5WYWx1ZSA9ICcnO1xuXHRkbyB7XG5cdFx0Y29uc3QgZ290Q1IgPSBzdHJpbmdbaW5kZXggLSAxXSA9PT0gJ1xccic7XG5cdFx0cmV0dXJuVmFsdWUgKz0gc3RyaW5nLnN1YnN0cihlbmRJbmRleCwgKGdvdENSID8gaW5kZXggLSAxIDogaW5kZXgpIC0gZW5kSW5kZXgpICsgcHJlZml4ICsgKGdvdENSID8gJ1xcclxcbicgOiAnXFxuJykgKyBwb3N0Zml4O1xuXHRcdGVuZEluZGV4ID0gaW5kZXggKyAxO1xuXHRcdGluZGV4ID0gc3RyaW5nLmluZGV4T2YoJ1xcbicsIGVuZEluZGV4KTtcblx0fSB3aGlsZSAoaW5kZXggIT09IC0xKTtcblxuXHRyZXR1cm5WYWx1ZSArPSBzdHJpbmcuc3Vic3RyKGVuZEluZGV4KTtcblx0cmV0dXJuIHJldHVyblZhbHVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHN0cmluZ1JlcGxhY2VBbGwsXG5cdHN0cmluZ0VuY2FzZUNSTEZXaXRoRmlyc3RJbmRleFxufTtcbiIsIi8qIE1JVCBsaWNlbnNlICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1taXhlZC1vcGVyYXRvcnMgKi9cbmNvbnN0IGNzc0tleXdvcmRzID0gcmVxdWlyZSgnY29sb3ItbmFtZScpO1xuXG4vLyBOT1RFOiBjb252ZXJzaW9ucyBzaG91bGQgb25seSByZXR1cm4gcHJpbWl0aXZlIHZhbHVlcyAoaS5lLiBhcnJheXMsIG9yXG4vLyAgICAgICB2YWx1ZXMgdGhhdCBnaXZlIGNvcnJlY3QgYHR5cGVvZmAgcmVzdWx0cykuXG4vLyAgICAgICBkbyBub3QgdXNlIGJveCB2YWx1ZXMgdHlwZXMgKGkuZS4gTnVtYmVyKCksIFN0cmluZygpLCBldGMuKVxuXG5jb25zdCByZXZlcnNlS2V5d29yZHMgPSB7fTtcbmZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGNzc0tleXdvcmRzKSkge1xuXHRyZXZlcnNlS2V5d29yZHNbY3NzS2V5d29yZHNba2V5XV0gPSBrZXk7XG59XG5cbmNvbnN0IGNvbnZlcnQgPSB7XG5cdHJnYjoge2NoYW5uZWxzOiAzLCBsYWJlbHM6ICdyZ2InfSxcblx0aHNsOiB7Y2hhbm5lbHM6IDMsIGxhYmVsczogJ2hzbCd9LFxuXHRoc3Y6IHtjaGFubmVsczogMywgbGFiZWxzOiAnaHN2J30sXG5cdGh3Yjoge2NoYW5uZWxzOiAzLCBsYWJlbHM6ICdod2InfSxcblx0Y215azoge2NoYW5uZWxzOiA0LCBsYWJlbHM6ICdjbXlrJ30sXG5cdHh5ejoge2NoYW5uZWxzOiAzLCBsYWJlbHM6ICd4eXonfSxcblx0bGFiOiB7Y2hhbm5lbHM6IDMsIGxhYmVsczogJ2xhYid9LFxuXHRsY2g6IHtjaGFubmVsczogMywgbGFiZWxzOiAnbGNoJ30sXG5cdGhleDoge2NoYW5uZWxzOiAxLCBsYWJlbHM6IFsnaGV4J119LFxuXHRrZXl3b3JkOiB7Y2hhbm5lbHM6IDEsIGxhYmVsczogWydrZXl3b3JkJ119LFxuXHRhbnNpMTY6IHtjaGFubmVsczogMSwgbGFiZWxzOiBbJ2Fuc2kxNiddfSxcblx0YW5zaTI1Njoge2NoYW5uZWxzOiAxLCBsYWJlbHM6IFsnYW5zaTI1NiddfSxcblx0aGNnOiB7Y2hhbm5lbHM6IDMsIGxhYmVsczogWydoJywgJ2MnLCAnZyddfSxcblx0YXBwbGU6IHtjaGFubmVsczogMywgbGFiZWxzOiBbJ3IxNicsICdnMTYnLCAnYjE2J119LFxuXHRncmF5OiB7Y2hhbm5lbHM6IDEsIGxhYmVsczogWydncmF5J119XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnZlcnQ7XG5cbi8vIEhpZGUgLmNoYW5uZWxzIGFuZCAubGFiZWxzIHByb3BlcnRpZXNcbmZvciAoY29uc3QgbW9kZWwgb2YgT2JqZWN0LmtleXMoY29udmVydCkpIHtcblx0aWYgKCEoJ2NoYW5uZWxzJyBpbiBjb252ZXJ0W21vZGVsXSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ21pc3NpbmcgY2hhbm5lbHMgcHJvcGVydHk6ICcgKyBtb2RlbCk7XG5cdH1cblxuXHRpZiAoISgnbGFiZWxzJyBpbiBjb252ZXJ0W21vZGVsXSkpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ21pc3NpbmcgY2hhbm5lbCBsYWJlbHMgcHJvcGVydHk6ICcgKyBtb2RlbCk7XG5cdH1cblxuXHRpZiAoY29udmVydFttb2RlbF0ubGFiZWxzLmxlbmd0aCAhPT0gY29udmVydFttb2RlbF0uY2hhbm5lbHMpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ2NoYW5uZWwgYW5kIGxhYmVsIGNvdW50cyBtaXNtYXRjaDogJyArIG1vZGVsKTtcblx0fVxuXG5cdGNvbnN0IHtjaGFubmVscywgbGFiZWxzfSA9IGNvbnZlcnRbbW9kZWxdO1xuXHRkZWxldGUgY29udmVydFttb2RlbF0uY2hhbm5lbHM7XG5cdGRlbGV0ZSBjb252ZXJ0W21vZGVsXS5sYWJlbHM7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb252ZXJ0W21vZGVsXSwgJ2NoYW5uZWxzJywge3ZhbHVlOiBjaGFubmVsc30pO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoY29udmVydFttb2RlbF0sICdsYWJlbHMnLCB7dmFsdWU6IGxhYmVsc30pO1xufVxuXG5jb252ZXJ0LnJnYi5oc2wgPSBmdW5jdGlvbiAocmdiKSB7XG5cdGNvbnN0IHIgPSByZ2JbMF0gLyAyNTU7XG5cdGNvbnN0IGcgPSByZ2JbMV0gLyAyNTU7XG5cdGNvbnN0IGIgPSByZ2JbMl0gLyAyNTU7XG5cdGNvbnN0IG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuXHRjb25zdCBtYXggPSBNYXRoLm1heChyLCBnLCBiKTtcblx0Y29uc3QgZGVsdGEgPSBtYXggLSBtaW47XG5cdGxldCBoO1xuXHRsZXQgcztcblxuXHRpZiAobWF4ID09PSBtaW4pIHtcblx0XHRoID0gMDtcblx0fSBlbHNlIGlmIChyID09PSBtYXgpIHtcblx0XHRoID0gKGcgLSBiKSAvIGRlbHRhO1xuXHR9IGVsc2UgaWYgKGcgPT09IG1heCkge1xuXHRcdGggPSAyICsgKGIgLSByKSAvIGRlbHRhO1xuXHR9IGVsc2UgaWYgKGIgPT09IG1heCkge1xuXHRcdGggPSA0ICsgKHIgLSBnKSAvIGRlbHRhO1xuXHR9XG5cblx0aCA9IE1hdGgubWluKGggKiA2MCwgMzYwKTtcblxuXHRpZiAoaCA8IDApIHtcblx0XHRoICs9IDM2MDtcblx0fVxuXG5cdGNvbnN0IGwgPSAobWluICsgbWF4KSAvIDI7XG5cblx0aWYgKG1heCA9PT0gbWluKSB7XG5cdFx0cyA9IDA7XG5cdH0gZWxzZSBpZiAobCA8PSAwLjUpIHtcblx0XHRzID0gZGVsdGEgLyAobWF4ICsgbWluKTtcblx0fSBlbHNlIHtcblx0XHRzID0gZGVsdGEgLyAoMiAtIG1heCAtIG1pbik7XG5cdH1cblxuXHRyZXR1cm4gW2gsIHMgKiAxMDAsIGwgKiAxMDBdO1xufTtcblxuY29udmVydC5yZ2IuaHN2ID0gZnVuY3Rpb24gKHJnYikge1xuXHRsZXQgcmRpZjtcblx0bGV0IGdkaWY7XG5cdGxldCBiZGlmO1xuXHRsZXQgaDtcblx0bGV0IHM7XG5cblx0Y29uc3QgciA9IHJnYlswXSAvIDI1NTtcblx0Y29uc3QgZyA9IHJnYlsxXSAvIDI1NTtcblx0Y29uc3QgYiA9IHJnYlsyXSAvIDI1NTtcblx0Y29uc3QgdiA9IE1hdGgubWF4KHIsIGcsIGIpO1xuXHRjb25zdCBkaWZmID0gdiAtIE1hdGgubWluKHIsIGcsIGIpO1xuXHRjb25zdCBkaWZmYyA9IGZ1bmN0aW9uIChjKSB7XG5cdFx0cmV0dXJuICh2IC0gYykgLyA2IC8gZGlmZiArIDEgLyAyO1xuXHR9O1xuXG5cdGlmIChkaWZmID09PSAwKSB7XG5cdFx0aCA9IDA7XG5cdFx0cyA9IDA7XG5cdH0gZWxzZSB7XG5cdFx0cyA9IGRpZmYgLyB2O1xuXHRcdHJkaWYgPSBkaWZmYyhyKTtcblx0XHRnZGlmID0gZGlmZmMoZyk7XG5cdFx0YmRpZiA9IGRpZmZjKGIpO1xuXG5cdFx0aWYgKHIgPT09IHYpIHtcblx0XHRcdGggPSBiZGlmIC0gZ2RpZjtcblx0XHR9IGVsc2UgaWYgKGcgPT09IHYpIHtcblx0XHRcdGggPSAoMSAvIDMpICsgcmRpZiAtIGJkaWY7XG5cdFx0fSBlbHNlIGlmIChiID09PSB2KSB7XG5cdFx0XHRoID0gKDIgLyAzKSArIGdkaWYgLSByZGlmO1xuXHRcdH1cblxuXHRcdGlmIChoIDwgMCkge1xuXHRcdFx0aCArPSAxO1xuXHRcdH0gZWxzZSBpZiAoaCA+IDEpIHtcblx0XHRcdGggLT0gMTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gW1xuXHRcdGggKiAzNjAsXG5cdFx0cyAqIDEwMCxcblx0XHR2ICogMTAwXG5cdF07XG59O1xuXG5jb252ZXJ0LnJnYi5od2IgPSBmdW5jdGlvbiAocmdiKSB7XG5cdGNvbnN0IHIgPSByZ2JbMF07XG5cdGNvbnN0IGcgPSByZ2JbMV07XG5cdGxldCBiID0gcmdiWzJdO1xuXHRjb25zdCBoID0gY29udmVydC5yZ2IuaHNsKHJnYilbMF07XG5cdGNvbnN0IHcgPSAxIC8gMjU1ICogTWF0aC5taW4ociwgTWF0aC5taW4oZywgYikpO1xuXG5cdGIgPSAxIC0gMSAvIDI1NSAqIE1hdGgubWF4KHIsIE1hdGgubWF4KGcsIGIpKTtcblxuXHRyZXR1cm4gW2gsIHcgKiAxMDAsIGIgKiAxMDBdO1xufTtcblxuY29udmVydC5yZ2IuY215ayA9IGZ1bmN0aW9uIChyZ2IpIHtcblx0Y29uc3QgciA9IHJnYlswXSAvIDI1NTtcblx0Y29uc3QgZyA9IHJnYlsxXSAvIDI1NTtcblx0Y29uc3QgYiA9IHJnYlsyXSAvIDI1NTtcblxuXHRjb25zdCBrID0gTWF0aC5taW4oMSAtIHIsIDEgLSBnLCAxIC0gYik7XG5cdGNvbnN0IGMgPSAoMSAtIHIgLSBrKSAvICgxIC0gaykgfHwgMDtcblx0Y29uc3QgbSA9ICgxIC0gZyAtIGspIC8gKDEgLSBrKSB8fCAwO1xuXHRjb25zdCB5ID0gKDEgLSBiIC0gaykgLyAoMSAtIGspIHx8IDA7XG5cblx0cmV0dXJuIFtjICogMTAwLCBtICogMTAwLCB5ICogMTAwLCBrICogMTAwXTtcbn07XG5cbmZ1bmN0aW9uIGNvbXBhcmF0aXZlRGlzdGFuY2UoeCwgeSkge1xuXHQvKlxuXHRcdFNlZSBodHRwczovL2VuLm0ud2lraXBlZGlhLm9yZy93aWtpL0V1Y2xpZGVhbl9kaXN0YW5jZSNTcXVhcmVkX0V1Y2xpZGVhbl9kaXN0YW5jZVxuXHQqL1xuXHRyZXR1cm4gKFxuXHRcdCgoeFswXSAtIHlbMF0pICoqIDIpICtcblx0XHQoKHhbMV0gLSB5WzFdKSAqKiAyKSArXG5cdFx0KCh4WzJdIC0geVsyXSkgKiogMilcblx0KTtcbn1cblxuY29udmVydC5yZ2Iua2V5d29yZCA9IGZ1bmN0aW9uIChyZ2IpIHtcblx0Y29uc3QgcmV2ZXJzZWQgPSByZXZlcnNlS2V5d29yZHNbcmdiXTtcblx0aWYgKHJldmVyc2VkKSB7XG5cdFx0cmV0dXJuIHJldmVyc2VkO1xuXHR9XG5cblx0bGV0IGN1cnJlbnRDbG9zZXN0RGlzdGFuY2UgPSBJbmZpbml0eTtcblx0bGV0IGN1cnJlbnRDbG9zZXN0S2V5d29yZDtcblxuXHRmb3IgKGNvbnN0IGtleXdvcmQgb2YgT2JqZWN0LmtleXMoY3NzS2V5d29yZHMpKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSBjc3NLZXl3b3Jkc1trZXl3b3JkXTtcblxuXHRcdC8vIENvbXB1dGUgY29tcGFyYXRpdmUgZGlzdGFuY2Vcblx0XHRjb25zdCBkaXN0YW5jZSA9IGNvbXBhcmF0aXZlRGlzdGFuY2UocmdiLCB2YWx1ZSk7XG5cblx0XHQvLyBDaGVjayBpZiBpdHMgbGVzcywgaWYgc28gc2V0IGFzIGNsb3Nlc3Rcblx0XHRpZiAoZGlzdGFuY2UgPCBjdXJyZW50Q2xvc2VzdERpc3RhbmNlKSB7XG5cdFx0XHRjdXJyZW50Q2xvc2VzdERpc3RhbmNlID0gZGlzdGFuY2U7XG5cdFx0XHRjdXJyZW50Q2xvc2VzdEtleXdvcmQgPSBrZXl3b3JkO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBjdXJyZW50Q2xvc2VzdEtleXdvcmQ7XG59O1xuXG5jb252ZXJ0LmtleXdvcmQucmdiID0gZnVuY3Rpb24gKGtleXdvcmQpIHtcblx0cmV0dXJuIGNzc0tleXdvcmRzW2tleXdvcmRdO1xufTtcblxuY29udmVydC5yZ2IueHl6ID0gZnVuY3Rpb24gKHJnYikge1xuXHRsZXQgciA9IHJnYlswXSAvIDI1NTtcblx0bGV0IGcgPSByZ2JbMV0gLyAyNTU7XG5cdGxldCBiID0gcmdiWzJdIC8gMjU1O1xuXG5cdC8vIEFzc3VtZSBzUkdCXG5cdHIgPSByID4gMC4wNDA0NSA/ICgoKHIgKyAwLjA1NSkgLyAxLjA1NSkgKiogMi40KSA6IChyIC8gMTIuOTIpO1xuXHRnID0gZyA+IDAuMDQwNDUgPyAoKChnICsgMC4wNTUpIC8gMS4wNTUpICoqIDIuNCkgOiAoZyAvIDEyLjkyKTtcblx0YiA9IGIgPiAwLjA0MDQ1ID8gKCgoYiArIDAuMDU1KSAvIDEuMDU1KSAqKiAyLjQpIDogKGIgLyAxMi45Mik7XG5cblx0Y29uc3QgeCA9IChyICogMC40MTI0KSArIChnICogMC4zNTc2KSArIChiICogMC4xODA1KTtcblx0Y29uc3QgeSA9IChyICogMC4yMTI2KSArIChnICogMC43MTUyKSArIChiICogMC4wNzIyKTtcblx0Y29uc3QgeiA9IChyICogMC4wMTkzKSArIChnICogMC4xMTkyKSArIChiICogMC45NTA1KTtcblxuXHRyZXR1cm4gW3ggKiAxMDAsIHkgKiAxMDAsIHogKiAxMDBdO1xufTtcblxuY29udmVydC5yZ2IubGFiID0gZnVuY3Rpb24gKHJnYikge1xuXHRjb25zdCB4eXogPSBjb252ZXJ0LnJnYi54eXoocmdiKTtcblx0bGV0IHggPSB4eXpbMF07XG5cdGxldCB5ID0geHl6WzFdO1xuXHRsZXQgeiA9IHh5elsyXTtcblxuXHR4IC89IDk1LjA0Nztcblx0eSAvPSAxMDA7XG5cdHogLz0gMTA4Ljg4MztcblxuXHR4ID0geCA+IDAuMDA4ODU2ID8gKHggKiogKDEgLyAzKSkgOiAoNy43ODcgKiB4KSArICgxNiAvIDExNik7XG5cdHkgPSB5ID4gMC4wMDg4NTYgPyAoeSAqKiAoMSAvIDMpKSA6ICg3Ljc4NyAqIHkpICsgKDE2IC8gMTE2KTtcblx0eiA9IHogPiAwLjAwODg1NiA/ICh6ICoqICgxIC8gMykpIDogKDcuNzg3ICogeikgKyAoMTYgLyAxMTYpO1xuXG5cdGNvbnN0IGwgPSAoMTE2ICogeSkgLSAxNjtcblx0Y29uc3QgYSA9IDUwMCAqICh4IC0geSk7XG5cdGNvbnN0IGIgPSAyMDAgKiAoeSAtIHopO1xuXG5cdHJldHVybiBbbCwgYSwgYl07XG59O1xuXG5jb252ZXJ0LmhzbC5yZ2IgPSBmdW5jdGlvbiAoaHNsKSB7XG5cdGNvbnN0IGggPSBoc2xbMF0gLyAzNjA7XG5cdGNvbnN0IHMgPSBoc2xbMV0gLyAxMDA7XG5cdGNvbnN0IGwgPSBoc2xbMl0gLyAxMDA7XG5cdGxldCB0Mjtcblx0bGV0IHQzO1xuXHRsZXQgdmFsO1xuXG5cdGlmIChzID09PSAwKSB7XG5cdFx0dmFsID0gbCAqIDI1NTtcblx0XHRyZXR1cm4gW3ZhbCwgdmFsLCB2YWxdO1xuXHR9XG5cblx0aWYgKGwgPCAwLjUpIHtcblx0XHR0MiA9IGwgKiAoMSArIHMpO1xuXHR9IGVsc2Uge1xuXHRcdHQyID0gbCArIHMgLSBsICogcztcblx0fVxuXG5cdGNvbnN0IHQxID0gMiAqIGwgLSB0MjtcblxuXHRjb25zdCByZ2IgPSBbMCwgMCwgMF07XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG5cdFx0dDMgPSBoICsgMSAvIDMgKiAtKGkgLSAxKTtcblx0XHRpZiAodDMgPCAwKSB7XG5cdFx0XHR0MysrO1xuXHRcdH1cblxuXHRcdGlmICh0MyA+IDEpIHtcblx0XHRcdHQzLS07XG5cdFx0fVxuXG5cdFx0aWYgKDYgKiB0MyA8IDEpIHtcblx0XHRcdHZhbCA9IHQxICsgKHQyIC0gdDEpICogNiAqIHQzO1xuXHRcdH0gZWxzZSBpZiAoMiAqIHQzIDwgMSkge1xuXHRcdFx0dmFsID0gdDI7XG5cdFx0fSBlbHNlIGlmICgzICogdDMgPCAyKSB7XG5cdFx0XHR2YWwgPSB0MSArICh0MiAtIHQxKSAqICgyIC8gMyAtIHQzKSAqIDY7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhbCA9IHQxO1xuXHRcdH1cblxuXHRcdHJnYltpXSA9IHZhbCAqIDI1NTtcblx0fVxuXG5cdHJldHVybiByZ2I7XG59O1xuXG5jb252ZXJ0LmhzbC5oc3YgPSBmdW5jdGlvbiAoaHNsKSB7XG5cdGNvbnN0IGggPSBoc2xbMF07XG5cdGxldCBzID0gaHNsWzFdIC8gMTAwO1xuXHRsZXQgbCA9IGhzbFsyXSAvIDEwMDtcblx0bGV0IHNtaW4gPSBzO1xuXHRjb25zdCBsbWluID0gTWF0aC5tYXgobCwgMC4wMSk7XG5cblx0bCAqPSAyO1xuXHRzICo9IChsIDw9IDEpID8gbCA6IDIgLSBsO1xuXHRzbWluICo9IGxtaW4gPD0gMSA/IGxtaW4gOiAyIC0gbG1pbjtcblx0Y29uc3QgdiA9IChsICsgcykgLyAyO1xuXHRjb25zdCBzdiA9IGwgPT09IDAgPyAoMiAqIHNtaW4pIC8gKGxtaW4gKyBzbWluKSA6ICgyICogcykgLyAobCArIHMpO1xuXG5cdHJldHVybiBbaCwgc3YgKiAxMDAsIHYgKiAxMDBdO1xufTtcblxuY29udmVydC5oc3YucmdiID0gZnVuY3Rpb24gKGhzdikge1xuXHRjb25zdCBoID0gaHN2WzBdIC8gNjA7XG5cdGNvbnN0IHMgPSBoc3ZbMV0gLyAxMDA7XG5cdGxldCB2ID0gaHN2WzJdIC8gMTAwO1xuXHRjb25zdCBoaSA9IE1hdGguZmxvb3IoaCkgJSA2O1xuXG5cdGNvbnN0IGYgPSBoIC0gTWF0aC5mbG9vcihoKTtcblx0Y29uc3QgcCA9IDI1NSAqIHYgKiAoMSAtIHMpO1xuXHRjb25zdCBxID0gMjU1ICogdiAqICgxIC0gKHMgKiBmKSk7XG5cdGNvbnN0IHQgPSAyNTUgKiB2ICogKDEgLSAocyAqICgxIC0gZikpKTtcblx0diAqPSAyNTU7XG5cblx0c3dpdGNoIChoaSkge1xuXHRcdGNhc2UgMDpcblx0XHRcdHJldHVybiBbdiwgdCwgcF07XG5cdFx0Y2FzZSAxOlxuXHRcdFx0cmV0dXJuIFtxLCB2LCBwXTtcblx0XHRjYXNlIDI6XG5cdFx0XHRyZXR1cm4gW3AsIHYsIHRdO1xuXHRcdGNhc2UgMzpcblx0XHRcdHJldHVybiBbcCwgcSwgdl07XG5cdFx0Y2FzZSA0OlxuXHRcdFx0cmV0dXJuIFt0LCBwLCB2XTtcblx0XHRjYXNlIDU6XG5cdFx0XHRyZXR1cm4gW3YsIHAsIHFdO1xuXHR9XG59O1xuXG5jb252ZXJ0Lmhzdi5oc2wgPSBmdW5jdGlvbiAoaHN2KSB7XG5cdGNvbnN0IGggPSBoc3ZbMF07XG5cdGNvbnN0IHMgPSBoc3ZbMV0gLyAxMDA7XG5cdGNvbnN0IHYgPSBoc3ZbMl0gLyAxMDA7XG5cdGNvbnN0IHZtaW4gPSBNYXRoLm1heCh2LCAwLjAxKTtcblx0bGV0IHNsO1xuXHRsZXQgbDtcblxuXHRsID0gKDIgLSBzKSAqIHY7XG5cdGNvbnN0IGxtaW4gPSAoMiAtIHMpICogdm1pbjtcblx0c2wgPSBzICogdm1pbjtcblx0c2wgLz0gKGxtaW4gPD0gMSkgPyBsbWluIDogMiAtIGxtaW47XG5cdHNsID0gc2wgfHwgMDtcblx0bCAvPSAyO1xuXG5cdHJldHVybiBbaCwgc2wgKiAxMDAsIGwgKiAxMDBdO1xufTtcblxuLy8gaHR0cDovL2Rldi53My5vcmcvY3Nzd2cvY3NzLWNvbG9yLyNod2ItdG8tcmdiXG5jb252ZXJ0Lmh3Yi5yZ2IgPSBmdW5jdGlvbiAoaHdiKSB7XG5cdGNvbnN0IGggPSBod2JbMF0gLyAzNjA7XG5cdGxldCB3aCA9IGh3YlsxXSAvIDEwMDtcblx0bGV0IGJsID0gaHdiWzJdIC8gMTAwO1xuXHRjb25zdCByYXRpbyA9IHdoICsgYmw7XG5cdGxldCBmO1xuXG5cdC8vIFdoICsgYmwgY2FudCBiZSA+IDFcblx0aWYgKHJhdGlvID4gMSkge1xuXHRcdHdoIC89IHJhdGlvO1xuXHRcdGJsIC89IHJhdGlvO1xuXHR9XG5cblx0Y29uc3QgaSA9IE1hdGguZmxvb3IoNiAqIGgpO1xuXHRjb25zdCB2ID0gMSAtIGJsO1xuXHRmID0gNiAqIGggLSBpO1xuXG5cdGlmICgoaSAmIDB4MDEpICE9PSAwKSB7XG5cdFx0ZiA9IDEgLSBmO1xuXHR9XG5cblx0Y29uc3QgbiA9IHdoICsgZiAqICh2IC0gd2gpOyAvLyBMaW5lYXIgaW50ZXJwb2xhdGlvblxuXG5cdGxldCByO1xuXHRsZXQgZztcblx0bGV0IGI7XG5cdC8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzLXBlci1saW5lLG5vLW11bHRpLXNwYWNlcyAqL1xuXHRzd2l0Y2ggKGkpIHtcblx0XHRkZWZhdWx0OlxuXHRcdGNhc2UgNjpcblx0XHRjYXNlIDA6IHIgPSB2OyAgZyA9IG47ICBiID0gd2g7IGJyZWFrO1xuXHRcdGNhc2UgMTogciA9IG47ICBnID0gdjsgIGIgPSB3aDsgYnJlYWs7XG5cdFx0Y2FzZSAyOiByID0gd2g7IGcgPSB2OyAgYiA9IG47IGJyZWFrO1xuXHRcdGNhc2UgMzogciA9IHdoOyBnID0gbjsgIGIgPSB2OyBicmVhaztcblx0XHRjYXNlIDQ6IHIgPSBuOyAgZyA9IHdoOyBiID0gdjsgYnJlYWs7XG5cdFx0Y2FzZSA1OiByID0gdjsgIGcgPSB3aDsgYiA9IG47IGJyZWFrO1xuXHR9XG5cdC8qIGVzbGludC1lbmFibGUgbWF4LXN0YXRlbWVudHMtcGVyLWxpbmUsbm8tbXVsdGktc3BhY2VzICovXG5cblx0cmV0dXJuIFtyICogMjU1LCBnICogMjU1LCBiICogMjU1XTtcbn07XG5cbmNvbnZlcnQuY215ay5yZ2IgPSBmdW5jdGlvbiAoY215aykge1xuXHRjb25zdCBjID0gY215a1swXSAvIDEwMDtcblx0Y29uc3QgbSA9IGNteWtbMV0gLyAxMDA7XG5cdGNvbnN0IHkgPSBjbXlrWzJdIC8gMTAwO1xuXHRjb25zdCBrID0gY215a1szXSAvIDEwMDtcblxuXHRjb25zdCByID0gMSAtIE1hdGgubWluKDEsIGMgKiAoMSAtIGspICsgayk7XG5cdGNvbnN0IGcgPSAxIC0gTWF0aC5taW4oMSwgbSAqICgxIC0gaykgKyBrKTtcblx0Y29uc3QgYiA9IDEgLSBNYXRoLm1pbigxLCB5ICogKDEgLSBrKSArIGspO1xuXG5cdHJldHVybiBbciAqIDI1NSwgZyAqIDI1NSwgYiAqIDI1NV07XG59O1xuXG5jb252ZXJ0Lnh5ei5yZ2IgPSBmdW5jdGlvbiAoeHl6KSB7XG5cdGNvbnN0IHggPSB4eXpbMF0gLyAxMDA7XG5cdGNvbnN0IHkgPSB4eXpbMV0gLyAxMDA7XG5cdGNvbnN0IHogPSB4eXpbMl0gLyAxMDA7XG5cdGxldCByO1xuXHRsZXQgZztcblx0bGV0IGI7XG5cblx0ciA9ICh4ICogMy4yNDA2KSArICh5ICogLTEuNTM3MikgKyAoeiAqIC0wLjQ5ODYpO1xuXHRnID0gKHggKiAtMC45Njg5KSArICh5ICogMS44NzU4KSArICh6ICogMC4wNDE1KTtcblx0YiA9ICh4ICogMC4wNTU3KSArICh5ICogLTAuMjA0MCkgKyAoeiAqIDEuMDU3MCk7XG5cblx0Ly8gQXNzdW1lIHNSR0Jcblx0ciA9IHIgPiAwLjAwMzEzMDhcblx0XHQ/ICgoMS4wNTUgKiAociAqKiAoMS4wIC8gMi40KSkpIC0gMC4wNTUpXG5cdFx0OiByICogMTIuOTI7XG5cblx0ZyA9IGcgPiAwLjAwMzEzMDhcblx0XHQ/ICgoMS4wNTUgKiAoZyAqKiAoMS4wIC8gMi40KSkpIC0gMC4wNTUpXG5cdFx0OiBnICogMTIuOTI7XG5cblx0YiA9IGIgPiAwLjAwMzEzMDhcblx0XHQ/ICgoMS4wNTUgKiAoYiAqKiAoMS4wIC8gMi40KSkpIC0gMC4wNTUpXG5cdFx0OiBiICogMTIuOTI7XG5cblx0ciA9IE1hdGgubWluKE1hdGgubWF4KDAsIHIpLCAxKTtcblx0ZyA9IE1hdGgubWluKE1hdGgubWF4KDAsIGcpLCAxKTtcblx0YiA9IE1hdGgubWluKE1hdGgubWF4KDAsIGIpLCAxKTtcblxuXHRyZXR1cm4gW3IgKiAyNTUsIGcgKiAyNTUsIGIgKiAyNTVdO1xufTtcblxuY29udmVydC54eXoubGFiID0gZnVuY3Rpb24gKHh5eikge1xuXHRsZXQgeCA9IHh5elswXTtcblx0bGV0IHkgPSB4eXpbMV07XG5cdGxldCB6ID0geHl6WzJdO1xuXG5cdHggLz0gOTUuMDQ3O1xuXHR5IC89IDEwMDtcblx0eiAvPSAxMDguODgzO1xuXG5cdHggPSB4ID4gMC4wMDg4NTYgPyAoeCAqKiAoMSAvIDMpKSA6ICg3Ljc4NyAqIHgpICsgKDE2IC8gMTE2KTtcblx0eSA9IHkgPiAwLjAwODg1NiA/ICh5ICoqICgxIC8gMykpIDogKDcuNzg3ICogeSkgKyAoMTYgLyAxMTYpO1xuXHR6ID0geiA+IDAuMDA4ODU2ID8gKHogKiogKDEgLyAzKSkgOiAoNy43ODcgKiB6KSArICgxNiAvIDExNik7XG5cblx0Y29uc3QgbCA9ICgxMTYgKiB5KSAtIDE2O1xuXHRjb25zdCBhID0gNTAwICogKHggLSB5KTtcblx0Y29uc3QgYiA9IDIwMCAqICh5IC0geik7XG5cblx0cmV0dXJuIFtsLCBhLCBiXTtcbn07XG5cbmNvbnZlcnQubGFiLnh5eiA9IGZ1bmN0aW9uIChsYWIpIHtcblx0Y29uc3QgbCA9IGxhYlswXTtcblx0Y29uc3QgYSA9IGxhYlsxXTtcblx0Y29uc3QgYiA9IGxhYlsyXTtcblx0bGV0IHg7XG5cdGxldCB5O1xuXHRsZXQgejtcblxuXHR5ID0gKGwgKyAxNikgLyAxMTY7XG5cdHggPSBhIC8gNTAwICsgeTtcblx0eiA9IHkgLSBiIC8gMjAwO1xuXG5cdGNvbnN0IHkyID0geSAqKiAzO1xuXHRjb25zdCB4MiA9IHggKiogMztcblx0Y29uc3QgejIgPSB6ICoqIDM7XG5cdHkgPSB5MiA+IDAuMDA4ODU2ID8geTIgOiAoeSAtIDE2IC8gMTE2KSAvIDcuNzg3O1xuXHR4ID0geDIgPiAwLjAwODg1NiA/IHgyIDogKHggLSAxNiAvIDExNikgLyA3Ljc4Nztcblx0eiA9IHoyID4gMC4wMDg4NTYgPyB6MiA6ICh6IC0gMTYgLyAxMTYpIC8gNy43ODc7XG5cblx0eCAqPSA5NS4wNDc7XG5cdHkgKj0gMTAwO1xuXHR6ICo9IDEwOC44ODM7XG5cblx0cmV0dXJuIFt4LCB5LCB6XTtcbn07XG5cbmNvbnZlcnQubGFiLmxjaCA9IGZ1bmN0aW9uIChsYWIpIHtcblx0Y29uc3QgbCA9IGxhYlswXTtcblx0Y29uc3QgYSA9IGxhYlsxXTtcblx0Y29uc3QgYiA9IGxhYlsyXTtcblx0bGV0IGg7XG5cblx0Y29uc3QgaHIgPSBNYXRoLmF0YW4yKGIsIGEpO1xuXHRoID0gaHIgKiAzNjAgLyAyIC8gTWF0aC5QSTtcblxuXHRpZiAoaCA8IDApIHtcblx0XHRoICs9IDM2MDtcblx0fVxuXG5cdGNvbnN0IGMgPSBNYXRoLnNxcnQoYSAqIGEgKyBiICogYik7XG5cblx0cmV0dXJuIFtsLCBjLCBoXTtcbn07XG5cbmNvbnZlcnQubGNoLmxhYiA9IGZ1bmN0aW9uIChsY2gpIHtcblx0Y29uc3QgbCA9IGxjaFswXTtcblx0Y29uc3QgYyA9IGxjaFsxXTtcblx0Y29uc3QgaCA9IGxjaFsyXTtcblxuXHRjb25zdCBociA9IGggLyAzNjAgKiAyICogTWF0aC5QSTtcblx0Y29uc3QgYSA9IGMgKiBNYXRoLmNvcyhocik7XG5cdGNvbnN0IGIgPSBjICogTWF0aC5zaW4oaHIpO1xuXG5cdHJldHVybiBbbCwgYSwgYl07XG59O1xuXG5jb252ZXJ0LnJnYi5hbnNpMTYgPSBmdW5jdGlvbiAoYXJncywgc2F0dXJhdGlvbiA9IG51bGwpIHtcblx0Y29uc3QgW3IsIGcsIGJdID0gYXJncztcblx0bGV0IHZhbHVlID0gc2F0dXJhdGlvbiA9PT0gbnVsbCA/IGNvbnZlcnQucmdiLmhzdihhcmdzKVsyXSA6IHNhdHVyYXRpb247IC8vIEhzdiAtPiBhbnNpMTYgb3B0aW1pemF0aW9uXG5cblx0dmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlIC8gNTApO1xuXG5cdGlmICh2YWx1ZSA9PT0gMCkge1xuXHRcdHJldHVybiAzMDtcblx0fVxuXG5cdGxldCBhbnNpID0gMzBcblx0XHQrICgoTWF0aC5yb3VuZChiIC8gMjU1KSA8PCAyKVxuXHRcdHwgKE1hdGgucm91bmQoZyAvIDI1NSkgPDwgMSlcblx0XHR8IE1hdGgucm91bmQociAvIDI1NSkpO1xuXG5cdGlmICh2YWx1ZSA9PT0gMikge1xuXHRcdGFuc2kgKz0gNjA7XG5cdH1cblxuXHRyZXR1cm4gYW5zaTtcbn07XG5cbmNvbnZlcnQuaHN2LmFuc2kxNiA9IGZ1bmN0aW9uIChhcmdzKSB7XG5cdC8vIE9wdGltaXphdGlvbiBoZXJlOyB3ZSBhbHJlYWR5IGtub3cgdGhlIHZhbHVlIGFuZCBkb24ndCBuZWVkIHRvIGdldFxuXHQvLyBpdCBjb252ZXJ0ZWQgZm9yIHVzLlxuXHRyZXR1cm4gY29udmVydC5yZ2IuYW5zaTE2KGNvbnZlcnQuaHN2LnJnYihhcmdzKSwgYXJnc1syXSk7XG59O1xuXG5jb252ZXJ0LnJnYi5hbnNpMjU2ID0gZnVuY3Rpb24gKGFyZ3MpIHtcblx0Y29uc3QgciA9IGFyZ3NbMF07XG5cdGNvbnN0IGcgPSBhcmdzWzFdO1xuXHRjb25zdCBiID0gYXJnc1syXTtcblxuXHQvLyBXZSB1c2UgdGhlIGV4dGVuZGVkIGdyZXlzY2FsZSBwYWxldHRlIGhlcmUsIHdpdGggdGhlIGV4Y2VwdGlvbiBvZlxuXHQvLyBibGFjayBhbmQgd2hpdGUuIG5vcm1hbCBwYWxldHRlIG9ubHkgaGFzIDQgZ3JleXNjYWxlIHNoYWRlcy5cblx0aWYgKHIgPT09IGcgJiYgZyA9PT0gYikge1xuXHRcdGlmIChyIDwgOCkge1xuXHRcdFx0cmV0dXJuIDE2O1xuXHRcdH1cblxuXHRcdGlmIChyID4gMjQ4KSB7XG5cdFx0XHRyZXR1cm4gMjMxO1xuXHRcdH1cblxuXHRcdHJldHVybiBNYXRoLnJvdW5kKCgociAtIDgpIC8gMjQ3KSAqIDI0KSArIDIzMjtcblx0fVxuXG5cdGNvbnN0IGFuc2kgPSAxNlxuXHRcdCsgKDM2ICogTWF0aC5yb3VuZChyIC8gMjU1ICogNSkpXG5cdFx0KyAoNiAqIE1hdGgucm91bmQoZyAvIDI1NSAqIDUpKVxuXHRcdCsgTWF0aC5yb3VuZChiIC8gMjU1ICogNSk7XG5cblx0cmV0dXJuIGFuc2k7XG59O1xuXG5jb252ZXJ0LmFuc2kxNi5yZ2IgPSBmdW5jdGlvbiAoYXJncykge1xuXHRsZXQgY29sb3IgPSBhcmdzICUgMTA7XG5cblx0Ly8gSGFuZGxlIGdyZXlzY2FsZVxuXHRpZiAoY29sb3IgPT09IDAgfHwgY29sb3IgPT09IDcpIHtcblx0XHRpZiAoYXJncyA+IDUwKSB7XG5cdFx0XHRjb2xvciArPSAzLjU7XG5cdFx0fVxuXG5cdFx0Y29sb3IgPSBjb2xvciAvIDEwLjUgKiAyNTU7XG5cblx0XHRyZXR1cm4gW2NvbG9yLCBjb2xvciwgY29sb3JdO1xuXHR9XG5cblx0Y29uc3QgbXVsdCA9ICh+fihhcmdzID4gNTApICsgMSkgKiAwLjU7XG5cdGNvbnN0IHIgPSAoKGNvbG9yICYgMSkgKiBtdWx0KSAqIDI1NTtcblx0Y29uc3QgZyA9ICgoKGNvbG9yID4+IDEpICYgMSkgKiBtdWx0KSAqIDI1NTtcblx0Y29uc3QgYiA9ICgoKGNvbG9yID4+IDIpICYgMSkgKiBtdWx0KSAqIDI1NTtcblxuXHRyZXR1cm4gW3IsIGcsIGJdO1xufTtcblxuY29udmVydC5hbnNpMjU2LnJnYiA9IGZ1bmN0aW9uIChhcmdzKSB7XG5cdC8vIEhhbmRsZSBncmV5c2NhbGVcblx0aWYgKGFyZ3MgPj0gMjMyKSB7XG5cdFx0Y29uc3QgYyA9IChhcmdzIC0gMjMyKSAqIDEwICsgODtcblx0XHRyZXR1cm4gW2MsIGMsIGNdO1xuXHR9XG5cblx0YXJncyAtPSAxNjtcblxuXHRsZXQgcmVtO1xuXHRjb25zdCByID0gTWF0aC5mbG9vcihhcmdzIC8gMzYpIC8gNSAqIDI1NTtcblx0Y29uc3QgZyA9IE1hdGguZmxvb3IoKHJlbSA9IGFyZ3MgJSAzNikgLyA2KSAvIDUgKiAyNTU7XG5cdGNvbnN0IGIgPSAocmVtICUgNikgLyA1ICogMjU1O1xuXG5cdHJldHVybiBbciwgZywgYl07XG59O1xuXG5jb252ZXJ0LnJnYi5oZXggPSBmdW5jdGlvbiAoYXJncykge1xuXHRjb25zdCBpbnRlZ2VyID0gKChNYXRoLnJvdW5kKGFyZ3NbMF0pICYgMHhGRikgPDwgMTYpXG5cdFx0KyAoKE1hdGgucm91bmQoYXJnc1sxXSkgJiAweEZGKSA8PCA4KVxuXHRcdCsgKE1hdGgucm91bmQoYXJnc1syXSkgJiAweEZGKTtcblxuXHRjb25zdCBzdHJpbmcgPSBpbnRlZ2VyLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuXHRyZXR1cm4gJzAwMDAwMCcuc3Vic3RyaW5nKHN0cmluZy5sZW5ndGgpICsgc3RyaW5nO1xufTtcblxuY29udmVydC5oZXgucmdiID0gZnVuY3Rpb24gKGFyZ3MpIHtcblx0Y29uc3QgbWF0Y2ggPSBhcmdzLnRvU3RyaW5nKDE2KS5tYXRjaCgvW2EtZjAtOV17Nn18W2EtZjAtOV17M30vaSk7XG5cdGlmICghbWF0Y2gpIHtcblx0XHRyZXR1cm4gWzAsIDAsIDBdO1xuXHR9XG5cblx0bGV0IGNvbG9yU3RyaW5nID0gbWF0Y2hbMF07XG5cblx0aWYgKG1hdGNoWzBdLmxlbmd0aCA9PT0gMykge1xuXHRcdGNvbG9yU3RyaW5nID0gY29sb3JTdHJpbmcuc3BsaXQoJycpLm1hcChjaGFyID0+IHtcblx0XHRcdHJldHVybiBjaGFyICsgY2hhcjtcblx0XHR9KS5qb2luKCcnKTtcblx0fVxuXG5cdGNvbnN0IGludGVnZXIgPSBwYXJzZUludChjb2xvclN0cmluZywgMTYpO1xuXHRjb25zdCByID0gKGludGVnZXIgPj4gMTYpICYgMHhGRjtcblx0Y29uc3QgZyA9IChpbnRlZ2VyID4+IDgpICYgMHhGRjtcblx0Y29uc3QgYiA9IGludGVnZXIgJiAweEZGO1xuXG5cdHJldHVybiBbciwgZywgYl07XG59O1xuXG5jb252ZXJ0LnJnYi5oY2cgPSBmdW5jdGlvbiAocmdiKSB7XG5cdGNvbnN0IHIgPSByZ2JbMF0gLyAyNTU7XG5cdGNvbnN0IGcgPSByZ2JbMV0gLyAyNTU7XG5cdGNvbnN0IGIgPSByZ2JbMl0gLyAyNTU7XG5cdGNvbnN0IG1heCA9IE1hdGgubWF4KE1hdGgubWF4KHIsIGcpLCBiKTtcblx0Y29uc3QgbWluID0gTWF0aC5taW4oTWF0aC5taW4ociwgZyksIGIpO1xuXHRjb25zdCBjaHJvbWEgPSAobWF4IC0gbWluKTtcblx0bGV0IGdyYXlzY2FsZTtcblx0bGV0IGh1ZTtcblxuXHRpZiAoY2hyb21hIDwgMSkge1xuXHRcdGdyYXlzY2FsZSA9IG1pbiAvICgxIC0gY2hyb21hKTtcblx0fSBlbHNlIHtcblx0XHRncmF5c2NhbGUgPSAwO1xuXHR9XG5cblx0aWYgKGNocm9tYSA8PSAwKSB7XG5cdFx0aHVlID0gMDtcblx0fSBlbHNlXG5cdGlmIChtYXggPT09IHIpIHtcblx0XHRodWUgPSAoKGcgLSBiKSAvIGNocm9tYSkgJSA2O1xuXHR9IGVsc2Vcblx0aWYgKG1heCA9PT0gZykge1xuXHRcdGh1ZSA9IDIgKyAoYiAtIHIpIC8gY2hyb21hO1xuXHR9IGVsc2Uge1xuXHRcdGh1ZSA9IDQgKyAociAtIGcpIC8gY2hyb21hO1xuXHR9XG5cblx0aHVlIC89IDY7XG5cdGh1ZSAlPSAxO1xuXG5cdHJldHVybiBbaHVlICogMzYwLCBjaHJvbWEgKiAxMDAsIGdyYXlzY2FsZSAqIDEwMF07XG59O1xuXG5jb252ZXJ0LmhzbC5oY2cgPSBmdW5jdGlvbiAoaHNsKSB7XG5cdGNvbnN0IHMgPSBoc2xbMV0gLyAxMDA7XG5cdGNvbnN0IGwgPSBoc2xbMl0gLyAxMDA7XG5cblx0Y29uc3QgYyA9IGwgPCAwLjUgPyAoMi4wICogcyAqIGwpIDogKDIuMCAqIHMgKiAoMS4wIC0gbCkpO1xuXG5cdGxldCBmID0gMDtcblx0aWYgKGMgPCAxLjApIHtcblx0XHRmID0gKGwgLSAwLjUgKiBjKSAvICgxLjAgLSBjKTtcblx0fVxuXG5cdHJldHVybiBbaHNsWzBdLCBjICogMTAwLCBmICogMTAwXTtcbn07XG5cbmNvbnZlcnQuaHN2LmhjZyA9IGZ1bmN0aW9uIChoc3YpIHtcblx0Y29uc3QgcyA9IGhzdlsxXSAvIDEwMDtcblx0Y29uc3QgdiA9IGhzdlsyXSAvIDEwMDtcblxuXHRjb25zdCBjID0gcyAqIHY7XG5cdGxldCBmID0gMDtcblxuXHRpZiAoYyA8IDEuMCkge1xuXHRcdGYgPSAodiAtIGMpIC8gKDEgLSBjKTtcblx0fVxuXG5cdHJldHVybiBbaHN2WzBdLCBjICogMTAwLCBmICogMTAwXTtcbn07XG5cbmNvbnZlcnQuaGNnLnJnYiA9IGZ1bmN0aW9uIChoY2cpIHtcblx0Y29uc3QgaCA9IGhjZ1swXSAvIDM2MDtcblx0Y29uc3QgYyA9IGhjZ1sxXSAvIDEwMDtcblx0Y29uc3QgZyA9IGhjZ1syXSAvIDEwMDtcblxuXHRpZiAoYyA9PT0gMC4wKSB7XG5cdFx0cmV0dXJuIFtnICogMjU1LCBnICogMjU1LCBnICogMjU1XTtcblx0fVxuXG5cdGNvbnN0IHB1cmUgPSBbMCwgMCwgMF07XG5cdGNvbnN0IGhpID0gKGggJSAxKSAqIDY7XG5cdGNvbnN0IHYgPSBoaSAlIDE7XG5cdGNvbnN0IHcgPSAxIC0gdjtcblx0bGV0IG1nID0gMDtcblxuXHQvKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cy1wZXItbGluZSAqL1xuXHRzd2l0Y2ggKE1hdGguZmxvb3IoaGkpKSB7XG5cdFx0Y2FzZSAwOlxuXHRcdFx0cHVyZVswXSA9IDE7IHB1cmVbMV0gPSB2OyBwdXJlWzJdID0gMDsgYnJlYWs7XG5cdFx0Y2FzZSAxOlxuXHRcdFx0cHVyZVswXSA9IHc7IHB1cmVbMV0gPSAxOyBwdXJlWzJdID0gMDsgYnJlYWs7XG5cdFx0Y2FzZSAyOlxuXHRcdFx0cHVyZVswXSA9IDA7IHB1cmVbMV0gPSAxOyBwdXJlWzJdID0gdjsgYnJlYWs7XG5cdFx0Y2FzZSAzOlxuXHRcdFx0cHVyZVswXSA9IDA7IHB1cmVbMV0gPSB3OyBwdXJlWzJdID0gMTsgYnJlYWs7XG5cdFx0Y2FzZSA0OlxuXHRcdFx0cHVyZVswXSA9IHY7IHB1cmVbMV0gPSAwOyBwdXJlWzJdID0gMTsgYnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHB1cmVbMF0gPSAxOyBwdXJlWzFdID0gMDsgcHVyZVsyXSA9IHc7XG5cdH1cblx0LyogZXNsaW50LWVuYWJsZSBtYXgtc3RhdGVtZW50cy1wZXItbGluZSAqL1xuXG5cdG1nID0gKDEuMCAtIGMpICogZztcblxuXHRyZXR1cm4gW1xuXHRcdChjICogcHVyZVswXSArIG1nKSAqIDI1NSxcblx0XHQoYyAqIHB1cmVbMV0gKyBtZykgKiAyNTUsXG5cdFx0KGMgKiBwdXJlWzJdICsgbWcpICogMjU1XG5cdF07XG59O1xuXG5jb252ZXJ0LmhjZy5oc3YgPSBmdW5jdGlvbiAoaGNnKSB7XG5cdGNvbnN0IGMgPSBoY2dbMV0gLyAxMDA7XG5cdGNvbnN0IGcgPSBoY2dbMl0gLyAxMDA7XG5cblx0Y29uc3QgdiA9IGMgKyBnICogKDEuMCAtIGMpO1xuXHRsZXQgZiA9IDA7XG5cblx0aWYgKHYgPiAwLjApIHtcblx0XHRmID0gYyAvIHY7XG5cdH1cblxuXHRyZXR1cm4gW2hjZ1swXSwgZiAqIDEwMCwgdiAqIDEwMF07XG59O1xuXG5jb252ZXJ0LmhjZy5oc2wgPSBmdW5jdGlvbiAoaGNnKSB7XG5cdGNvbnN0IGMgPSBoY2dbMV0gLyAxMDA7XG5cdGNvbnN0IGcgPSBoY2dbMl0gLyAxMDA7XG5cblx0Y29uc3QgbCA9IGcgKiAoMS4wIC0gYykgKyAwLjUgKiBjO1xuXHRsZXQgcyA9IDA7XG5cblx0aWYgKGwgPiAwLjAgJiYgbCA8IDAuNSkge1xuXHRcdHMgPSBjIC8gKDIgKiBsKTtcblx0fSBlbHNlXG5cdGlmIChsID49IDAuNSAmJiBsIDwgMS4wKSB7XG5cdFx0cyA9IGMgLyAoMiAqICgxIC0gbCkpO1xuXHR9XG5cblx0cmV0dXJuIFtoY2dbMF0sIHMgKiAxMDAsIGwgKiAxMDBdO1xufTtcblxuY29udmVydC5oY2cuaHdiID0gZnVuY3Rpb24gKGhjZykge1xuXHRjb25zdCBjID0gaGNnWzFdIC8gMTAwO1xuXHRjb25zdCBnID0gaGNnWzJdIC8gMTAwO1xuXHRjb25zdCB2ID0gYyArIGcgKiAoMS4wIC0gYyk7XG5cdHJldHVybiBbaGNnWzBdLCAodiAtIGMpICogMTAwLCAoMSAtIHYpICogMTAwXTtcbn07XG5cbmNvbnZlcnQuaHdiLmhjZyA9IGZ1bmN0aW9uIChod2IpIHtcblx0Y29uc3QgdyA9IGh3YlsxXSAvIDEwMDtcblx0Y29uc3QgYiA9IGh3YlsyXSAvIDEwMDtcblx0Y29uc3QgdiA9IDEgLSBiO1xuXHRjb25zdCBjID0gdiAtIHc7XG5cdGxldCBnID0gMDtcblxuXHRpZiAoYyA8IDEpIHtcblx0XHRnID0gKHYgLSBjKSAvICgxIC0gYyk7XG5cdH1cblxuXHRyZXR1cm4gW2h3YlswXSwgYyAqIDEwMCwgZyAqIDEwMF07XG59O1xuXG5jb252ZXJ0LmFwcGxlLnJnYiA9IGZ1bmN0aW9uIChhcHBsZSkge1xuXHRyZXR1cm4gWyhhcHBsZVswXSAvIDY1NTM1KSAqIDI1NSwgKGFwcGxlWzFdIC8gNjU1MzUpICogMjU1LCAoYXBwbGVbMl0gLyA2NTUzNSkgKiAyNTVdO1xufTtcblxuY29udmVydC5yZ2IuYXBwbGUgPSBmdW5jdGlvbiAocmdiKSB7XG5cdHJldHVybiBbKHJnYlswXSAvIDI1NSkgKiA2NTUzNSwgKHJnYlsxXSAvIDI1NSkgKiA2NTUzNSwgKHJnYlsyXSAvIDI1NSkgKiA2NTUzNV07XG59O1xuXG5jb252ZXJ0LmdyYXkucmdiID0gZnVuY3Rpb24gKGFyZ3MpIHtcblx0cmV0dXJuIFthcmdzWzBdIC8gMTAwICogMjU1LCBhcmdzWzBdIC8gMTAwICogMjU1LCBhcmdzWzBdIC8gMTAwICogMjU1XTtcbn07XG5cbmNvbnZlcnQuZ3JheS5oc2wgPSBmdW5jdGlvbiAoYXJncykge1xuXHRyZXR1cm4gWzAsIDAsIGFyZ3NbMF1dO1xufTtcblxuY29udmVydC5ncmF5LmhzdiA9IGNvbnZlcnQuZ3JheS5oc2w7XG5cbmNvbnZlcnQuZ3JheS5od2IgPSBmdW5jdGlvbiAoZ3JheSkge1xuXHRyZXR1cm4gWzAsIDEwMCwgZ3JheVswXV07XG59O1xuXG5jb252ZXJ0LmdyYXkuY215ayA9IGZ1bmN0aW9uIChncmF5KSB7XG5cdHJldHVybiBbMCwgMCwgMCwgZ3JheVswXV07XG59O1xuXG5jb252ZXJ0LmdyYXkubGFiID0gZnVuY3Rpb24gKGdyYXkpIHtcblx0cmV0dXJuIFtncmF5WzBdLCAwLCAwXTtcbn07XG5cbmNvbnZlcnQuZ3JheS5oZXggPSBmdW5jdGlvbiAoZ3JheSkge1xuXHRjb25zdCB2YWwgPSBNYXRoLnJvdW5kKGdyYXlbMF0gLyAxMDAgKiAyNTUpICYgMHhGRjtcblx0Y29uc3QgaW50ZWdlciA9ICh2YWwgPDwgMTYpICsgKHZhbCA8PCA4KSArIHZhbDtcblxuXHRjb25zdCBzdHJpbmcgPSBpbnRlZ2VyLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuXHRyZXR1cm4gJzAwMDAwMCcuc3Vic3RyaW5nKHN0cmluZy5sZW5ndGgpICsgc3RyaW5nO1xufTtcblxuY29udmVydC5yZ2IuZ3JheSA9IGZ1bmN0aW9uIChyZ2IpIHtcblx0Y29uc3QgdmFsID0gKHJnYlswXSArIHJnYlsxXSArIHJnYlsyXSkgLyAzO1xuXHRyZXR1cm4gW3ZhbCAvIDI1NSAqIDEwMF07XG59O1xuIiwiY29uc3QgY29udmVyc2lvbnMgPSByZXF1aXJlKCcuL2NvbnZlcnNpb25zJyk7XG5jb25zdCByb3V0ZSA9IHJlcXVpcmUoJy4vcm91dGUnKTtcblxuY29uc3QgY29udmVydCA9IHt9O1xuXG5jb25zdCBtb2RlbHMgPSBPYmplY3Qua2V5cyhjb252ZXJzaW9ucyk7XG5cbmZ1bmN0aW9uIHdyYXBSYXcoZm4pIHtcblx0Y29uc3Qgd3JhcHBlZEZuID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcblx0XHRjb25zdCBhcmcwID0gYXJnc1swXTtcblx0XHRpZiAoYXJnMCA9PT0gdW5kZWZpbmVkIHx8IGFyZzAgPT09IG51bGwpIHtcblx0XHRcdHJldHVybiBhcmcwO1xuXHRcdH1cblxuXHRcdGlmIChhcmcwLmxlbmd0aCA+IDEpIHtcblx0XHRcdGFyZ3MgPSBhcmcwO1xuXHRcdH1cblxuXHRcdHJldHVybiBmbihhcmdzKTtcblx0fTtcblxuXHQvLyBQcmVzZXJ2ZSAuY29udmVyc2lvbiBwcm9wZXJ0eSBpZiB0aGVyZSBpcyBvbmVcblx0aWYgKCdjb252ZXJzaW9uJyBpbiBmbikge1xuXHRcdHdyYXBwZWRGbi5jb252ZXJzaW9uID0gZm4uY29udmVyc2lvbjtcblx0fVxuXG5cdHJldHVybiB3cmFwcGVkRm47XG59XG5cbmZ1bmN0aW9uIHdyYXBSb3VuZGVkKGZuKSB7XG5cdGNvbnN0IHdyYXBwZWRGbiA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG5cdFx0Y29uc3QgYXJnMCA9IGFyZ3NbMF07XG5cblx0XHRpZiAoYXJnMCA9PT0gdW5kZWZpbmVkIHx8IGFyZzAgPT09IG51bGwpIHtcblx0XHRcdHJldHVybiBhcmcwO1xuXHRcdH1cblxuXHRcdGlmIChhcmcwLmxlbmd0aCA+IDEpIHtcblx0XHRcdGFyZ3MgPSBhcmcwO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJlc3VsdCA9IGZuKGFyZ3MpO1xuXG5cdFx0Ly8gV2UncmUgYXNzdW1pbmcgdGhlIHJlc3VsdCBpcyBhbiBhcnJheSBoZXJlLlxuXHRcdC8vIHNlZSBub3RpY2UgaW4gY29udmVyc2lvbnMuanM7IGRvbid0IHVzZSBib3ggdHlwZXNcblx0XHQvLyBpbiBjb252ZXJzaW9uIGZ1bmN0aW9ucy5cblx0XHRpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcpIHtcblx0XHRcdGZvciAobGV0IGxlbiA9IHJlc3VsdC5sZW5ndGgsIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0cmVzdWx0W2ldID0gTWF0aC5yb3VuZChyZXN1bHRbaV0pO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH07XG5cblx0Ly8gUHJlc2VydmUgLmNvbnZlcnNpb24gcHJvcGVydHkgaWYgdGhlcmUgaXMgb25lXG5cdGlmICgnY29udmVyc2lvbicgaW4gZm4pIHtcblx0XHR3cmFwcGVkRm4uY29udmVyc2lvbiA9IGZuLmNvbnZlcnNpb247XG5cdH1cblxuXHRyZXR1cm4gd3JhcHBlZEZuO1xufVxuXG5tb2RlbHMuZm9yRWFjaChmcm9tTW9kZWwgPT4ge1xuXHRjb252ZXJ0W2Zyb21Nb2RlbF0gPSB7fTtcblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoY29udmVydFtmcm9tTW9kZWxdLCAnY2hhbm5lbHMnLCB7dmFsdWU6IGNvbnZlcnNpb25zW2Zyb21Nb2RlbF0uY2hhbm5lbHN9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnZlcnRbZnJvbU1vZGVsXSwgJ2xhYmVscycsIHt2YWx1ZTogY29udmVyc2lvbnNbZnJvbU1vZGVsXS5sYWJlbHN9KTtcblxuXHRjb25zdCByb3V0ZXMgPSByb3V0ZShmcm9tTW9kZWwpO1xuXHRjb25zdCByb3V0ZU1vZGVscyA9IE9iamVjdC5rZXlzKHJvdXRlcyk7XG5cblx0cm91dGVNb2RlbHMuZm9yRWFjaCh0b01vZGVsID0+IHtcblx0XHRjb25zdCBmbiA9IHJvdXRlc1t0b01vZGVsXTtcblxuXHRcdGNvbnZlcnRbZnJvbU1vZGVsXVt0b01vZGVsXSA9IHdyYXBSb3VuZGVkKGZuKTtcblx0XHRjb252ZXJ0W2Zyb21Nb2RlbF1bdG9Nb2RlbF0ucmF3ID0gd3JhcFJhdyhmbik7XG5cdH0pO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gY29udmVydDtcbiIsImNvbnN0IGNvbnZlcnNpb25zID0gcmVxdWlyZSgnLi9jb252ZXJzaW9ucycpO1xuXG4vKlxuXHRUaGlzIGZ1bmN0aW9uIHJvdXRlcyBhIG1vZGVsIHRvIGFsbCBvdGhlciBtb2RlbHMuXG5cblx0YWxsIGZ1bmN0aW9ucyB0aGF0IGFyZSByb3V0ZWQgaGF2ZSBhIHByb3BlcnR5IGAuY29udmVyc2lvbmAgYXR0YWNoZWRcblx0dG8gdGhlIHJldHVybmVkIHN5bnRoZXRpYyBmdW5jdGlvbi4gVGhpcyBwcm9wZXJ0eSBpcyBhbiBhcnJheVxuXHRvZiBzdHJpbmdzLCBlYWNoIHdpdGggdGhlIHN0ZXBzIGluIGJldHdlZW4gdGhlICdmcm9tJyBhbmQgJ3RvJ1xuXHRjb2xvciBtb2RlbHMgKGluY2x1c2l2ZSkuXG5cblx0Y29udmVyc2lvbnMgdGhhdCBhcmUgbm90IHBvc3NpYmxlIHNpbXBseSBhcmUgbm90IGluY2x1ZGVkLlxuKi9cblxuZnVuY3Rpb24gYnVpbGRHcmFwaCgpIHtcblx0Y29uc3QgZ3JhcGggPSB7fTtcblx0Ly8gaHR0cHM6Ly9qc3BlcmYuY29tL29iamVjdC1rZXlzLXZzLWZvci1pbi13aXRoLWNsb3N1cmUvM1xuXHRjb25zdCBtb2RlbHMgPSBPYmplY3Qua2V5cyhjb252ZXJzaW9ucyk7XG5cblx0Zm9yIChsZXQgbGVuID0gbW9kZWxzLmxlbmd0aCwgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdGdyYXBoW21vZGVsc1tpXV0gPSB7XG5cdFx0XHQvLyBodHRwOi8vanNwZXJmLmNvbS8xLXZzLWluZmluaXR5XG5cdFx0XHQvLyBtaWNyby1vcHQsIGJ1dCB0aGlzIGlzIHNpbXBsZS5cblx0XHRcdGRpc3RhbmNlOiAtMSxcblx0XHRcdHBhcmVudDogbnVsbFxuXHRcdH07XG5cdH1cblxuXHRyZXR1cm4gZ3JhcGg7XG59XG5cbi8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0JyZWFkdGgtZmlyc3Rfc2VhcmNoXG5mdW5jdGlvbiBkZXJpdmVCRlMoZnJvbU1vZGVsKSB7XG5cdGNvbnN0IGdyYXBoID0gYnVpbGRHcmFwaCgpO1xuXHRjb25zdCBxdWV1ZSA9IFtmcm9tTW9kZWxdOyAvLyBVbnNoaWZ0IC0+IHF1ZXVlIC0+IHBvcFxuXG5cdGdyYXBoW2Zyb21Nb2RlbF0uZGlzdGFuY2UgPSAwO1xuXG5cdHdoaWxlIChxdWV1ZS5sZW5ndGgpIHtcblx0XHRjb25zdCBjdXJyZW50ID0gcXVldWUucG9wKCk7XG5cdFx0Y29uc3QgYWRqYWNlbnRzID0gT2JqZWN0LmtleXMoY29udmVyc2lvbnNbY3VycmVudF0pO1xuXG5cdFx0Zm9yIChsZXQgbGVuID0gYWRqYWNlbnRzLmxlbmd0aCwgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0Y29uc3QgYWRqYWNlbnQgPSBhZGphY2VudHNbaV07XG5cdFx0XHRjb25zdCBub2RlID0gZ3JhcGhbYWRqYWNlbnRdO1xuXG5cdFx0XHRpZiAobm9kZS5kaXN0YW5jZSA9PT0gLTEpIHtcblx0XHRcdFx0bm9kZS5kaXN0YW5jZSA9IGdyYXBoW2N1cnJlbnRdLmRpc3RhbmNlICsgMTtcblx0XHRcdFx0bm9kZS5wYXJlbnQgPSBjdXJyZW50O1xuXHRcdFx0XHRxdWV1ZS51bnNoaWZ0KGFkamFjZW50KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZ3JhcGg7XG59XG5cbmZ1bmN0aW9uIGxpbmsoZnJvbSwgdG8pIHtcblx0cmV0dXJuIGZ1bmN0aW9uIChhcmdzKSB7XG5cdFx0cmV0dXJuIHRvKGZyb20oYXJncykpO1xuXHR9O1xufVxuXG5mdW5jdGlvbiB3cmFwQ29udmVyc2lvbih0b01vZGVsLCBncmFwaCkge1xuXHRjb25zdCBwYXRoID0gW2dyYXBoW3RvTW9kZWxdLnBhcmVudCwgdG9Nb2RlbF07XG5cdGxldCBmbiA9IGNvbnZlcnNpb25zW2dyYXBoW3RvTW9kZWxdLnBhcmVudF1bdG9Nb2RlbF07XG5cblx0bGV0IGN1ciA9IGdyYXBoW3RvTW9kZWxdLnBhcmVudDtcblx0d2hpbGUgKGdyYXBoW2N1cl0ucGFyZW50KSB7XG5cdFx0cGF0aC51bnNoaWZ0KGdyYXBoW2N1cl0ucGFyZW50KTtcblx0XHRmbiA9IGxpbmsoY29udmVyc2lvbnNbZ3JhcGhbY3VyXS5wYXJlbnRdW2N1cl0sIGZuKTtcblx0XHRjdXIgPSBncmFwaFtjdXJdLnBhcmVudDtcblx0fVxuXG5cdGZuLmNvbnZlcnNpb24gPSBwYXRoO1xuXHRyZXR1cm4gZm47XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZyb21Nb2RlbCkge1xuXHRjb25zdCBncmFwaCA9IGRlcml2ZUJGUyhmcm9tTW9kZWwpO1xuXHRjb25zdCBjb252ZXJzaW9uID0ge307XG5cblx0Y29uc3QgbW9kZWxzID0gT2JqZWN0LmtleXMoZ3JhcGgpO1xuXHRmb3IgKGxldCBsZW4gPSBtb2RlbHMubGVuZ3RoLCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0Y29uc3QgdG9Nb2RlbCA9IG1vZGVsc1tpXTtcblx0XHRjb25zdCBub2RlID0gZ3JhcGhbdG9Nb2RlbF07XG5cblx0XHRpZiAobm9kZS5wYXJlbnQgPT09IG51bGwpIHtcblx0XHRcdC8vIE5vIHBvc3NpYmxlIGNvbnZlcnNpb24sIG9yIHRoaXMgbm9kZSBpcyB0aGUgc291cmNlIG1vZGVsLlxuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Y29udmVyc2lvblt0b01vZGVsXSA9IHdyYXBDb252ZXJzaW9uKHRvTW9kZWwsIGdyYXBoKTtcblx0fVxuXG5cdHJldHVybiBjb252ZXJzaW9uO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRcImFsaWNlYmx1ZVwiOiBbMjQwLCAyNDgsIDI1NV0sXHJcblx0XCJhbnRpcXVld2hpdGVcIjogWzI1MCwgMjM1LCAyMTVdLFxyXG5cdFwiYXF1YVwiOiBbMCwgMjU1LCAyNTVdLFxyXG5cdFwiYXF1YW1hcmluZVwiOiBbMTI3LCAyNTUsIDIxMl0sXHJcblx0XCJhenVyZVwiOiBbMjQwLCAyNTUsIDI1NV0sXHJcblx0XCJiZWlnZVwiOiBbMjQ1LCAyNDUsIDIyMF0sXHJcblx0XCJiaXNxdWVcIjogWzI1NSwgMjI4LCAxOTZdLFxyXG5cdFwiYmxhY2tcIjogWzAsIDAsIDBdLFxyXG5cdFwiYmxhbmNoZWRhbG1vbmRcIjogWzI1NSwgMjM1LCAyMDVdLFxyXG5cdFwiYmx1ZVwiOiBbMCwgMCwgMjU1XSxcclxuXHRcImJsdWV2aW9sZXRcIjogWzEzOCwgNDMsIDIyNl0sXHJcblx0XCJicm93blwiOiBbMTY1LCA0MiwgNDJdLFxyXG5cdFwiYnVybHl3b29kXCI6IFsyMjIsIDE4NCwgMTM1XSxcclxuXHRcImNhZGV0Ymx1ZVwiOiBbOTUsIDE1OCwgMTYwXSxcclxuXHRcImNoYXJ0cmV1c2VcIjogWzEyNywgMjU1LCAwXSxcclxuXHRcImNob2NvbGF0ZVwiOiBbMjEwLCAxMDUsIDMwXSxcclxuXHRcImNvcmFsXCI6IFsyNTUsIDEyNywgODBdLFxyXG5cdFwiY29ybmZsb3dlcmJsdWVcIjogWzEwMCwgMTQ5LCAyMzddLFxyXG5cdFwiY29ybnNpbGtcIjogWzI1NSwgMjQ4LCAyMjBdLFxyXG5cdFwiY3JpbXNvblwiOiBbMjIwLCAyMCwgNjBdLFxyXG5cdFwiY3lhblwiOiBbMCwgMjU1LCAyNTVdLFxyXG5cdFwiZGFya2JsdWVcIjogWzAsIDAsIDEzOV0sXHJcblx0XCJkYXJrY3lhblwiOiBbMCwgMTM5LCAxMzldLFxyXG5cdFwiZGFya2dvbGRlbnJvZFwiOiBbMTg0LCAxMzQsIDExXSxcclxuXHRcImRhcmtncmF5XCI6IFsxNjksIDE2OSwgMTY5XSxcclxuXHRcImRhcmtncmVlblwiOiBbMCwgMTAwLCAwXSxcclxuXHRcImRhcmtncmV5XCI6IFsxNjksIDE2OSwgMTY5XSxcclxuXHRcImRhcmtraGFraVwiOiBbMTg5LCAxODMsIDEwN10sXHJcblx0XCJkYXJrbWFnZW50YVwiOiBbMTM5LCAwLCAxMzldLFxyXG5cdFwiZGFya29saXZlZ3JlZW5cIjogWzg1LCAxMDcsIDQ3XSxcclxuXHRcImRhcmtvcmFuZ2VcIjogWzI1NSwgMTQwLCAwXSxcclxuXHRcImRhcmtvcmNoaWRcIjogWzE1MywgNTAsIDIwNF0sXHJcblx0XCJkYXJrcmVkXCI6IFsxMzksIDAsIDBdLFxyXG5cdFwiZGFya3NhbG1vblwiOiBbMjMzLCAxNTAsIDEyMl0sXHJcblx0XCJkYXJrc2VhZ3JlZW5cIjogWzE0MywgMTg4LCAxNDNdLFxyXG5cdFwiZGFya3NsYXRlYmx1ZVwiOiBbNzIsIDYxLCAxMzldLFxyXG5cdFwiZGFya3NsYXRlZ3JheVwiOiBbNDcsIDc5LCA3OV0sXHJcblx0XCJkYXJrc2xhdGVncmV5XCI6IFs0NywgNzksIDc5XSxcclxuXHRcImRhcmt0dXJxdW9pc2VcIjogWzAsIDIwNiwgMjA5XSxcclxuXHRcImRhcmt2aW9sZXRcIjogWzE0OCwgMCwgMjExXSxcclxuXHRcImRlZXBwaW5rXCI6IFsyNTUsIDIwLCAxNDddLFxyXG5cdFwiZGVlcHNreWJsdWVcIjogWzAsIDE5MSwgMjU1XSxcclxuXHRcImRpbWdyYXlcIjogWzEwNSwgMTA1LCAxMDVdLFxyXG5cdFwiZGltZ3JleVwiOiBbMTA1LCAxMDUsIDEwNV0sXHJcblx0XCJkb2RnZXJibHVlXCI6IFszMCwgMTQ0LCAyNTVdLFxyXG5cdFwiZmlyZWJyaWNrXCI6IFsxNzgsIDM0LCAzNF0sXHJcblx0XCJmbG9yYWx3aGl0ZVwiOiBbMjU1LCAyNTAsIDI0MF0sXHJcblx0XCJmb3Jlc3RncmVlblwiOiBbMzQsIDEzOSwgMzRdLFxyXG5cdFwiZnVjaHNpYVwiOiBbMjU1LCAwLCAyNTVdLFxyXG5cdFwiZ2FpbnNib3JvXCI6IFsyMjAsIDIyMCwgMjIwXSxcclxuXHRcImdob3N0d2hpdGVcIjogWzI0OCwgMjQ4LCAyNTVdLFxyXG5cdFwiZ29sZFwiOiBbMjU1LCAyMTUsIDBdLFxyXG5cdFwiZ29sZGVucm9kXCI6IFsyMTgsIDE2NSwgMzJdLFxyXG5cdFwiZ3JheVwiOiBbMTI4LCAxMjgsIDEyOF0sXHJcblx0XCJncmVlblwiOiBbMCwgMTI4LCAwXSxcclxuXHRcImdyZWVueWVsbG93XCI6IFsxNzMsIDI1NSwgNDddLFxyXG5cdFwiZ3JleVwiOiBbMTI4LCAxMjgsIDEyOF0sXHJcblx0XCJob25leWRld1wiOiBbMjQwLCAyNTUsIDI0MF0sXHJcblx0XCJob3RwaW5rXCI6IFsyNTUsIDEwNSwgMTgwXSxcclxuXHRcImluZGlhbnJlZFwiOiBbMjA1LCA5MiwgOTJdLFxyXG5cdFwiaW5kaWdvXCI6IFs3NSwgMCwgMTMwXSxcclxuXHRcIml2b3J5XCI6IFsyNTUsIDI1NSwgMjQwXSxcclxuXHRcImtoYWtpXCI6IFsyNDAsIDIzMCwgMTQwXSxcclxuXHRcImxhdmVuZGVyXCI6IFsyMzAsIDIzMCwgMjUwXSxcclxuXHRcImxhdmVuZGVyYmx1c2hcIjogWzI1NSwgMjQwLCAyNDVdLFxyXG5cdFwibGF3bmdyZWVuXCI6IFsxMjQsIDI1MiwgMF0sXHJcblx0XCJsZW1vbmNoaWZmb25cIjogWzI1NSwgMjUwLCAyMDVdLFxyXG5cdFwibGlnaHRibHVlXCI6IFsxNzMsIDIxNiwgMjMwXSxcclxuXHRcImxpZ2h0Y29yYWxcIjogWzI0MCwgMTI4LCAxMjhdLFxyXG5cdFwibGlnaHRjeWFuXCI6IFsyMjQsIDI1NSwgMjU1XSxcclxuXHRcImxpZ2h0Z29sZGVucm9keWVsbG93XCI6IFsyNTAsIDI1MCwgMjEwXSxcclxuXHRcImxpZ2h0Z3JheVwiOiBbMjExLCAyMTEsIDIxMV0sXHJcblx0XCJsaWdodGdyZWVuXCI6IFsxNDQsIDIzOCwgMTQ0XSxcclxuXHRcImxpZ2h0Z3JleVwiOiBbMjExLCAyMTEsIDIxMV0sXHJcblx0XCJsaWdodHBpbmtcIjogWzI1NSwgMTgyLCAxOTNdLFxyXG5cdFwibGlnaHRzYWxtb25cIjogWzI1NSwgMTYwLCAxMjJdLFxyXG5cdFwibGlnaHRzZWFncmVlblwiOiBbMzIsIDE3OCwgMTcwXSxcclxuXHRcImxpZ2h0c2t5Ymx1ZVwiOiBbMTM1LCAyMDYsIDI1MF0sXHJcblx0XCJsaWdodHNsYXRlZ3JheVwiOiBbMTE5LCAxMzYsIDE1M10sXHJcblx0XCJsaWdodHNsYXRlZ3JleVwiOiBbMTE5LCAxMzYsIDE1M10sXHJcblx0XCJsaWdodHN0ZWVsYmx1ZVwiOiBbMTc2LCAxOTYsIDIyMl0sXHJcblx0XCJsaWdodHllbGxvd1wiOiBbMjU1LCAyNTUsIDIyNF0sXHJcblx0XCJsaW1lXCI6IFswLCAyNTUsIDBdLFxyXG5cdFwibGltZWdyZWVuXCI6IFs1MCwgMjA1LCA1MF0sXHJcblx0XCJsaW5lblwiOiBbMjUwLCAyNDAsIDIzMF0sXHJcblx0XCJtYWdlbnRhXCI6IFsyNTUsIDAsIDI1NV0sXHJcblx0XCJtYXJvb25cIjogWzEyOCwgMCwgMF0sXHJcblx0XCJtZWRpdW1hcXVhbWFyaW5lXCI6IFsxMDIsIDIwNSwgMTcwXSxcclxuXHRcIm1lZGl1bWJsdWVcIjogWzAsIDAsIDIwNV0sXHJcblx0XCJtZWRpdW1vcmNoaWRcIjogWzE4NiwgODUsIDIxMV0sXHJcblx0XCJtZWRpdW1wdXJwbGVcIjogWzE0NywgMTEyLCAyMTldLFxyXG5cdFwibWVkaXVtc2VhZ3JlZW5cIjogWzYwLCAxNzksIDExM10sXHJcblx0XCJtZWRpdW1zbGF0ZWJsdWVcIjogWzEyMywgMTA0LCAyMzhdLFxyXG5cdFwibWVkaXVtc3ByaW5nZ3JlZW5cIjogWzAsIDI1MCwgMTU0XSxcclxuXHRcIm1lZGl1bXR1cnF1b2lzZVwiOiBbNzIsIDIwOSwgMjA0XSxcclxuXHRcIm1lZGl1bXZpb2xldHJlZFwiOiBbMTk5LCAyMSwgMTMzXSxcclxuXHRcIm1pZG5pZ2h0Ymx1ZVwiOiBbMjUsIDI1LCAxMTJdLFxyXG5cdFwibWludGNyZWFtXCI6IFsyNDUsIDI1NSwgMjUwXSxcclxuXHRcIm1pc3R5cm9zZVwiOiBbMjU1LCAyMjgsIDIyNV0sXHJcblx0XCJtb2NjYXNpblwiOiBbMjU1LCAyMjgsIDE4MV0sXHJcblx0XCJuYXZham93aGl0ZVwiOiBbMjU1LCAyMjIsIDE3M10sXHJcblx0XCJuYXZ5XCI6IFswLCAwLCAxMjhdLFxyXG5cdFwib2xkbGFjZVwiOiBbMjUzLCAyNDUsIDIzMF0sXHJcblx0XCJvbGl2ZVwiOiBbMTI4LCAxMjgsIDBdLFxyXG5cdFwib2xpdmVkcmFiXCI6IFsxMDcsIDE0MiwgMzVdLFxyXG5cdFwib3JhbmdlXCI6IFsyNTUsIDE2NSwgMF0sXHJcblx0XCJvcmFuZ2VyZWRcIjogWzI1NSwgNjksIDBdLFxyXG5cdFwib3JjaGlkXCI6IFsyMTgsIDExMiwgMjE0XSxcclxuXHRcInBhbGVnb2xkZW5yb2RcIjogWzIzOCwgMjMyLCAxNzBdLFxyXG5cdFwicGFsZWdyZWVuXCI6IFsxNTIsIDI1MSwgMTUyXSxcclxuXHRcInBhbGV0dXJxdW9pc2VcIjogWzE3NSwgMjM4LCAyMzhdLFxyXG5cdFwicGFsZXZpb2xldHJlZFwiOiBbMjE5LCAxMTIsIDE0N10sXHJcblx0XCJwYXBheWF3aGlwXCI6IFsyNTUsIDIzOSwgMjEzXSxcclxuXHRcInBlYWNocHVmZlwiOiBbMjU1LCAyMTgsIDE4NV0sXHJcblx0XCJwZXJ1XCI6IFsyMDUsIDEzMywgNjNdLFxyXG5cdFwicGlua1wiOiBbMjU1LCAxOTIsIDIwM10sXHJcblx0XCJwbHVtXCI6IFsyMjEsIDE2MCwgMjIxXSxcclxuXHRcInBvd2RlcmJsdWVcIjogWzE3NiwgMjI0LCAyMzBdLFxyXG5cdFwicHVycGxlXCI6IFsxMjgsIDAsIDEyOF0sXHJcblx0XCJyZWJlY2NhcHVycGxlXCI6IFsxMDIsIDUxLCAxNTNdLFxyXG5cdFwicmVkXCI6IFsyNTUsIDAsIDBdLFxyXG5cdFwicm9zeWJyb3duXCI6IFsxODgsIDE0MywgMTQzXSxcclxuXHRcInJveWFsYmx1ZVwiOiBbNjUsIDEwNSwgMjI1XSxcclxuXHRcInNhZGRsZWJyb3duXCI6IFsxMzksIDY5LCAxOV0sXHJcblx0XCJzYWxtb25cIjogWzI1MCwgMTI4LCAxMTRdLFxyXG5cdFwic2FuZHlicm93blwiOiBbMjQ0LCAxNjQsIDk2XSxcclxuXHRcInNlYWdyZWVuXCI6IFs0NiwgMTM5LCA4N10sXHJcblx0XCJzZWFzaGVsbFwiOiBbMjU1LCAyNDUsIDIzOF0sXHJcblx0XCJzaWVubmFcIjogWzE2MCwgODIsIDQ1XSxcclxuXHRcInNpbHZlclwiOiBbMTkyLCAxOTIsIDE5Ml0sXHJcblx0XCJza3libHVlXCI6IFsxMzUsIDIwNiwgMjM1XSxcclxuXHRcInNsYXRlYmx1ZVwiOiBbMTA2LCA5MCwgMjA1XSxcclxuXHRcInNsYXRlZ3JheVwiOiBbMTEyLCAxMjgsIDE0NF0sXHJcblx0XCJzbGF0ZWdyZXlcIjogWzExMiwgMTI4LCAxNDRdLFxyXG5cdFwic25vd1wiOiBbMjU1LCAyNTAsIDI1MF0sXHJcblx0XCJzcHJpbmdncmVlblwiOiBbMCwgMjU1LCAxMjddLFxyXG5cdFwic3RlZWxibHVlXCI6IFs3MCwgMTMwLCAxODBdLFxyXG5cdFwidGFuXCI6IFsyMTAsIDE4MCwgMTQwXSxcclxuXHRcInRlYWxcIjogWzAsIDEyOCwgMTI4XSxcclxuXHRcInRoaXN0bGVcIjogWzIxNiwgMTkxLCAyMTZdLFxyXG5cdFwidG9tYXRvXCI6IFsyNTUsIDk5LCA3MV0sXHJcblx0XCJ0dXJxdW9pc2VcIjogWzY0LCAyMjQsIDIwOF0sXHJcblx0XCJ2aW9sZXRcIjogWzIzOCwgMTMwLCAyMzhdLFxyXG5cdFwid2hlYXRcIjogWzI0NSwgMjIyLCAxNzldLFxyXG5cdFwid2hpdGVcIjogWzI1NSwgMjU1LCAyNTVdLFxyXG5cdFwid2hpdGVzbW9rZVwiOiBbMjQ1LCAyNDUsIDI0NV0sXHJcblx0XCJ5ZWxsb3dcIjogWzI1NSwgMjU1LCAwXSxcclxuXHRcInllbGxvd2dyZWVuXCI6IFsxNTQsIDIwNSwgNTBdXHJcbn07XHJcbiIsIlxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBzZXAgPSByZXF1aXJlKCdwYXRoJykuc2VwIHx8ICcvJztcblxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbGVVcmlUb1BhdGg7XG5cbi8qKlxuICogRmlsZSBVUkkgdG8gUGF0aCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJpXG4gKiBAcmV0dXJuIHtTdHJpbmd9IHBhdGhcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZmlsZVVyaVRvUGF0aCAodXJpKSB7XG4gIGlmICgnc3RyaW5nJyAhPSB0eXBlb2YgdXJpIHx8XG4gICAgICB1cmkubGVuZ3RoIDw9IDcgfHxcbiAgICAgICdmaWxlOi8vJyAhPSB1cmkuc3Vic3RyaW5nKDAsIDcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbXVzdCBwYXNzIGluIGEgZmlsZTovLyBVUkkgdG8gY29udmVydCB0byBhIGZpbGUgcGF0aCcpO1xuICB9XG5cbiAgdmFyIHJlc3QgPSBkZWNvZGVVUkkodXJpLnN1YnN0cmluZyg3KSk7XG4gIHZhciBmaXJzdFNsYXNoID0gcmVzdC5pbmRleE9mKCcvJyk7XG4gIHZhciBob3N0ID0gcmVzdC5zdWJzdHJpbmcoMCwgZmlyc3RTbGFzaCk7XG4gIHZhciBwYXRoID0gcmVzdC5zdWJzdHJpbmcoZmlyc3RTbGFzaCArIDEpO1xuXG4gIC8vIDIuICBTY2hlbWUgRGVmaW5pdGlvblxuICAvLyBBcyBhIHNwZWNpYWwgY2FzZSwgPGhvc3Q+IGNhbiBiZSB0aGUgc3RyaW5nIFwibG9jYWxob3N0XCIgb3IgdGhlIGVtcHR5XG4gIC8vIHN0cmluZzsgdGhpcyBpcyBpbnRlcnByZXRlZCBhcyBcInRoZSBtYWNoaW5lIGZyb20gd2hpY2ggdGhlIFVSTCBpc1xuICAvLyBiZWluZyBpbnRlcnByZXRlZFwiLlxuICBpZiAoJ2xvY2FsaG9zdCcgPT0gaG9zdCkgaG9zdCA9ICcnO1xuXG4gIGlmIChob3N0KSB7XG4gICAgaG9zdCA9IHNlcCArIHNlcCArIGhvc3Q7XG4gIH1cblxuICAvLyAzLjIgIERyaXZlcywgZHJpdmUgbGV0dGVycywgbW91bnQgcG9pbnRzLCBmaWxlIHN5c3RlbSByb290XG4gIC8vIERyaXZlIGxldHRlcnMgYXJlIG1hcHBlZCBpbnRvIHRoZSB0b3Agb2YgYSBmaWxlIFVSSSBpbiB2YXJpb3VzIHdheXMsXG4gIC8vIGRlcGVuZGluZyBvbiB0aGUgaW1wbGVtZW50YXRpb247IHNvbWUgYXBwbGljYXRpb25zIHN1YnN0aXR1dGVcbiAgLy8gdmVydGljYWwgYmFyIChcInxcIikgZm9yIHRoZSBjb2xvbiBhZnRlciB0aGUgZHJpdmUgbGV0dGVyLCB5aWVsZGluZ1xuICAvLyBcImZpbGU6Ly8vY3wvdG1wL3Rlc3QudHh0XCIuICBJbiBzb21lIGNhc2VzLCB0aGUgY29sb24gaXMgbGVmdFxuICAvLyB1bmNoYW5nZWQsIGFzIGluIFwiZmlsZTovLy9jOi90bXAvdGVzdC50eHRcIi4gIEluIG90aGVyIGNhc2VzLCB0aGVcbiAgLy8gY29sb24gaXMgc2ltcGx5IG9taXR0ZWQsIGFzIGluIFwiZmlsZTovLy9jL3RtcC90ZXN0LnR4dFwiLlxuICBwYXRoID0gcGF0aC5yZXBsYWNlKC9eKC4rKVxcfC8sICckMTonKTtcblxuICAvLyBmb3IgV2luZG93cywgd2UgbmVlZCB0byBpbnZlcnQgdGhlIHBhdGggc2VwYXJhdG9ycyBmcm9tIHdoYXQgYSBVUkkgdXNlc1xuICBpZiAoc2VwID09ICdcXFxcJykge1xuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoL1xcLy9nLCAnXFxcXCcpO1xuICB9XG5cbiAgaWYgKC9eLitcXDovLnRlc3QocGF0aCkpIHtcbiAgICAvLyBoYXMgV2luZG93cyBkcml2ZSBhdCBiZWdpbm5pbmcgb2YgcGF0aFxuICB9IGVsc2Uge1xuICAgIC8vIHVuaXggcGF0aOKAplxuICAgIHBhdGggPSBzZXAgKyBwYXRoO1xuICB9XG5cbiAgcmV0dXJuIGhvc3QgKyBwYXRoO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmbGFnLCBhcmd2ID0gcHJvY2Vzcy5hcmd2KSA9PiB7XG5cdGNvbnN0IHByZWZpeCA9IGZsYWcuc3RhcnRzV2l0aCgnLScpID8gJycgOiAoZmxhZy5sZW5ndGggPT09IDEgPyAnLScgOiAnLS0nKTtcblx0Y29uc3QgcG9zaXRpb24gPSBhcmd2LmluZGV4T2YocHJlZml4ICsgZmxhZyk7XG5cdGNvbnN0IHRlcm1pbmF0b3JQb3NpdGlvbiA9IGFyZ3YuaW5kZXhPZignLS0nKTtcblx0cmV0dXJuIHBvc2l0aW9uICE9PSAtMSAmJiAodGVybWluYXRvclBvc2l0aW9uID09PSAtMSB8fCBwb3NpdGlvbiA8IHRlcm1pbmF0b3JQb3NpdGlvbik7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3Qgb3MgPSByZXF1aXJlKCdvcycpO1xuY29uc3QgdHR5ID0gcmVxdWlyZSgndHR5Jyk7XG5jb25zdCBoYXNGbGFnID0gcmVxdWlyZSgnaGFzLWZsYWcnKTtcblxuY29uc3Qge2Vudn0gPSBwcm9jZXNzO1xuXG5sZXQgZm9yY2VDb2xvcjtcbmlmIChoYXNGbGFnKCduby1jb2xvcicpIHx8XG5cdGhhc0ZsYWcoJ25vLWNvbG9ycycpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9yPWZhbHNlJykgfHxcblx0aGFzRmxhZygnY29sb3I9bmV2ZXInKSkge1xuXHRmb3JjZUNvbG9yID0gMDtcbn0gZWxzZSBpZiAoaGFzRmxhZygnY29sb3InKSB8fFxuXHRoYXNGbGFnKCdjb2xvcnMnKSB8fFxuXHRoYXNGbGFnKCdjb2xvcj10cnVlJykgfHxcblx0aGFzRmxhZygnY29sb3I9YWx3YXlzJykpIHtcblx0Zm9yY2VDb2xvciA9IDE7XG59XG5cbmlmICgnRk9SQ0VfQ09MT1InIGluIGVudikge1xuXHRpZiAoZW52LkZPUkNFX0NPTE9SID09PSAndHJ1ZScpIHtcblx0XHRmb3JjZUNvbG9yID0gMTtcblx0fSBlbHNlIGlmIChlbnYuRk9SQ0VfQ09MT1IgPT09ICdmYWxzZScpIHtcblx0XHRmb3JjZUNvbG9yID0gMDtcblx0fSBlbHNlIHtcblx0XHRmb3JjZUNvbG9yID0gZW52LkZPUkNFX0NPTE9SLmxlbmd0aCA9PT0gMCA/IDEgOiBNYXRoLm1pbihwYXJzZUludChlbnYuRk9SQ0VfQ09MT1IsIDEwKSwgMyk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlTGV2ZWwobGV2ZWwpIHtcblx0aWYgKGxldmVsID09PSAwKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRsZXZlbCxcblx0XHRoYXNCYXNpYzogdHJ1ZSxcblx0XHRoYXMyNTY6IGxldmVsID49IDIsXG5cdFx0aGFzMTZtOiBsZXZlbCA+PSAzXG5cdH07XG59XG5cbmZ1bmN0aW9uIHN1cHBvcnRzQ29sb3IoaGF2ZVN0cmVhbSwgc3RyZWFtSXNUVFkpIHtcblx0aWYgKGZvcmNlQ29sb3IgPT09IDApIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdGlmIChoYXNGbGFnKCdjb2xvcj0xNm0nKSB8fFxuXHRcdGhhc0ZsYWcoJ2NvbG9yPWZ1bGwnKSB8fFxuXHRcdGhhc0ZsYWcoJ2NvbG9yPXRydWVjb2xvcicpKSB7XG5cdFx0cmV0dXJuIDM7XG5cdH1cblxuXHRpZiAoaGFzRmxhZygnY29sb3I9MjU2JykpIHtcblx0XHRyZXR1cm4gMjtcblx0fVxuXG5cdGlmIChoYXZlU3RyZWFtICYmICFzdHJlYW1Jc1RUWSAmJiBmb3JjZUNvbG9yID09PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdGNvbnN0IG1pbiA9IGZvcmNlQ29sb3IgfHwgMDtcblxuXHRpZiAoZW52LlRFUk0gPT09ICdkdW1iJykge1xuXHRcdHJldHVybiBtaW47XG5cdH1cblxuXHRpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuXHRcdC8vIFdpbmRvd3MgMTAgYnVpbGQgMTA1ODYgaXMgdGhlIGZpcnN0IFdpbmRvd3MgcmVsZWFzZSB0aGF0IHN1cHBvcnRzIDI1NiBjb2xvcnMuXG5cdFx0Ly8gV2luZG93cyAxMCBidWlsZCAxNDkzMSBpcyB0aGUgZmlyc3QgcmVsZWFzZSB0aGF0IHN1cHBvcnRzIDE2bS9UcnVlQ29sb3IuXG5cdFx0Y29uc3Qgb3NSZWxlYXNlID0gb3MucmVsZWFzZSgpLnNwbGl0KCcuJyk7XG5cdFx0aWYgKFxuXHRcdFx0TnVtYmVyKG9zUmVsZWFzZVswXSkgPj0gMTAgJiZcblx0XHRcdE51bWJlcihvc1JlbGVhc2VbMl0pID49IDEwNTg2XG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4gTnVtYmVyKG9zUmVsZWFzZVsyXSkgPj0gMTQ5MzEgPyAzIDogMjtcblx0XHR9XG5cblx0XHRyZXR1cm4gMTtcblx0fVxuXG5cdGlmICgnQ0knIGluIGVudikge1xuXHRcdGlmIChbJ1RSQVZJUycsICdDSVJDTEVDSScsICdBUFBWRVlPUicsICdHSVRMQUJfQ0knLCAnR0lUSFVCX0FDVElPTlMnLCAnQlVJTERLSVRFJ10uc29tZShzaWduID0+IHNpZ24gaW4gZW52KSB8fCBlbnYuQ0lfTkFNRSA9PT0gJ2NvZGVzaGlwJykge1xuXHRcdFx0cmV0dXJuIDE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1pbjtcblx0fVxuXG5cdGlmICgnVEVBTUNJVFlfVkVSU0lPTicgaW4gZW52KSB7XG5cdFx0cmV0dXJuIC9eKDlcXC4oMCpbMS05XVxcZCopXFwufFxcZHsyLH1cXC4pLy50ZXN0KGVudi5URUFNQ0lUWV9WRVJTSU9OKSA/IDEgOiAwO1xuXHR9XG5cblx0aWYgKGVudi5DT0xPUlRFUk0gPT09ICd0cnVlY29sb3InKSB7XG5cdFx0cmV0dXJuIDM7XG5cdH1cblxuXHRpZiAoJ1RFUk1fUFJPR1JBTScgaW4gZW52KSB7XG5cdFx0Y29uc3QgdmVyc2lvbiA9IHBhcnNlSW50KChlbnYuVEVSTV9QUk9HUkFNX1ZFUlNJT04gfHwgJycpLnNwbGl0KCcuJylbMF0sIDEwKTtcblxuXHRcdHN3aXRjaCAoZW52LlRFUk1fUFJPR1JBTSkge1xuXHRcdFx0Y2FzZSAnaVRlcm0uYXBwJzpcblx0XHRcdFx0cmV0dXJuIHZlcnNpb24gPj0gMyA/IDMgOiAyO1xuXHRcdFx0Y2FzZSAnQXBwbGVfVGVybWluYWwnOlxuXHRcdFx0XHRyZXR1cm4gMjtcblx0XHRcdC8vIE5vIGRlZmF1bHRcblx0XHR9XG5cdH1cblxuXHRpZiAoLy0yNTYoY29sb3IpPyQvaS50ZXN0KGVudi5URVJNKSkge1xuXHRcdHJldHVybiAyO1xuXHR9XG5cblx0aWYgKC9ec2NyZWVufF54dGVybXxednQxMDB8XnZ0MjIwfF5yeHZ0fGNvbG9yfGFuc2l8Y3lnd2lufGxpbnV4L2kudGVzdChlbnYuVEVSTSkpIHtcblx0XHRyZXR1cm4gMTtcblx0fVxuXG5cdGlmICgnQ09MT1JURVJNJyBpbiBlbnYpIHtcblx0XHRyZXR1cm4gMTtcblx0fVxuXG5cdHJldHVybiBtaW47XG59XG5cbmZ1bmN0aW9uIGdldFN1cHBvcnRMZXZlbChzdHJlYW0pIHtcblx0Y29uc3QgbGV2ZWwgPSBzdXBwb3J0c0NvbG9yKHN0cmVhbSwgc3RyZWFtICYmIHN0cmVhbS5pc1RUWSk7XG5cdHJldHVybiB0cmFuc2xhdGVMZXZlbChsZXZlbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRzdXBwb3J0c0NvbG9yOiBnZXRTdXBwb3J0TGV2ZWwsXG5cdHN0ZG91dDogdHJhbnNsYXRlTGV2ZWwoc3VwcG9ydHNDb2xvcih0cnVlLCB0dHkuaXNhdHR5KDEpKSksXG5cdHN0ZGVycjogdHJhbnNsYXRlTGV2ZWwoc3VwcG9ydHNDb2xvcih0cnVlLCB0dHkuaXNhdHR5KDIpKSlcbn07XG4iLCIvKiBGaWxlOiAgICAgIFNpZGVFZmZlY3RzLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCBcIi4uL01lc3NhZ2VMb29wXCI7XG5pbXBvcnQgXCIuLi9Ib29rXCI7XG5pbXBvcnQgXCIuLi9Ob2RlSXBjXCI7XG5pbXBvcnQgXCIuLi9LZXlib2FyZFwiO1xuaW1wb3J0IFwiLi4vTW9uaXRvclwiO1xuaW1wb3J0IFwiLi4vVHJlZVwiO1xuXG5zZXRUaW1lb3V0KCgpOiB2b2lkID0+XG57XG4gICAgaW1wb3J0KFwiLi4vTWFpbldpbmRvd1wiKTtcbiAgICBpbXBvcnQoXCIuLi9SZW5kZXJlckZ1bmN0aW9ucy5HZW5lcmF0ZWRcIik7XG4gICAgaW1wb3J0KFwiLi9Jbml0aWFsaXphdGlvblwiKTtcbiAgICBpbXBvcnQoXCIuL1RyYXlcIik7XG4gICAgaW1wb3J0KFwiLi4vV2luRXZlbnRcIik7XG59KTtcblxuIiwiLyogRmlsZTogICAgdXRpbC50c1xuICogQXV0aG9yOiAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBMaWNlbnNlOiBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEhIYW5kbGUgfSBmcm9tIFwiLi9VdGlsaXR5LlR5cGVzXCI7XG5pbXBvcnQgeyBVUkwgfSBmcm9tIFwidXJsXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHR5cGUgeyBGQm94IH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gUmVzb2x2ZUh0bWxQYXRoKEh0bWxGaWxlTmFtZTogc3RyaW5nLCBDb21wb25lbnQ/OiBzdHJpbmcpXG57XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCIpXG4gICAge1xuICAgICAgICBjb25zdCBQb3J0OiBzdHJpbmcgfCBudW1iZXIgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDEyMTI7XG4gICAgICAgIGNvbnN0IFVybDogVVJMID0gbmV3IFVSTChgaHR0cDovL2xvY2FsaG9zdDokeyBQb3J0IH1gKTtcbiAgICAgICAgVXJsLnBhdGhuYW1lID0gSHRtbEZpbGVOYW1lO1xuICAgICAgICByZXR1cm4gVXJsLmhyZWY7XG4gICAgfVxuICAgIGNvbnN0IEJhc2VQYXRoOiBzdHJpbmcgPSBgZmlsZTovLyR7cGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuLi9SZW5kZXJlci9cIiwgSHRtbEZpbGVOYW1lKX1gO1xuICAgIGlmIChDb21wb25lbnQgIT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIGNvbnN0IENvbXBvbmVudEFyZ3VtZW50OiBzdHJpbmcgPSBgP0NvbXBvbmVudD0keyBDb21wb25lbnQgfWA7XG4gICAgICAgIHJldHVybiBCYXNlUGF0aCArIENvbXBvbmVudEFyZ3VtZW50O1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICByZXR1cm4gQmFzZVBhdGg7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgQXJlQm94ZXNFcXVhbCA9IChBOiBGQm94LCBCOiBGQm94KTogYm9vbGVhbiA9Plxue1xuICAgIHJldHVybiAoXG4gICAgICAgIEEuWCA9PT0gQi5YICYmXG4gICAgICAgIEEuWSA9PT0gQi5ZICYmXG4gICAgICAgIEEuV2lkdGggPT09IEIuV2lkdGggJiZcbiAgICAgICAgQS5IZWlnaHQgPT09IEIuSGVpZ2h0XG4gICAgKTtcblxufTtcblxuZXhwb3J0IGNvbnN0IEFyZUhhbmRsZXNFcXVhbCA9IChBOiBISGFuZGxlLCBCOiBISGFuZGxlKTogYm9vbGVhbiA9Plxue1xuICAgIHJldHVybiBBLkhhbmRsZSA9PT0gQi5IYW5kbGU7XG59O1xuIiwiLyogRmlsZTogICAgICBMb2cudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IGNoYWxrIGZyb20gXCJjaGFsa1wiO1xuXG4vKiogQFRPRE8gKi9cbmV4cG9ydCBjb25zdCBMb2cgPSAoLi4uQXJndW1lbnRzOiBBcnJheTx1bmtub3duPik6IHZvaWQgPT5cbntcbiAgICBjb25zb2xlLmxvZyguLi5Bcmd1bWVudHMpO1xuICAgIC8vIHByb2Nlc3Muc3Rkb3V0LndyaXRlKFxuICAgIC8vICAgICBjaGFsay5iZ01hZ2VudGEud2hpdGUoXCIgQmFja2VuZCBcIikgK1xuICAgIC8vICAgICBcIiBcIiArXG4gICAgLy8gICAgIEpTT04uc3RyaW5naWZ5KEFyZ3VtZW50cywgbnVsbCwgNClcbiAgICAvLyApO1xufTtcbiIsIi8qIEZpbGU6ICAgICAgaW5kZXgudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuZXhwb3J0ICogZnJvbSBcIi4vTG9nXCI7XG4iLCIvKiBGaWxlOiAgICAgIERpc3BhdGNoZXIudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuZXhwb3J0IHR5cGUgVFN1YnNjcmlwdGlvbkhhbmRsZTxUPiA9XG57XG4gICAgU3Vic2NyaWJlKENhbGxiYWNrOiAoKEFyZ3VtZW50OiBUKSA9PiB2b2lkKSk6IG51bWJlcjtcbiAgICBVbnN1YnNjcmliZShJZDogbnVtYmVyKTogdm9pZDtcbn07XG5cbmV4cG9ydCBjbGFzcyBURGlzcGF0Y2hlcjxUPlxue1xuICAgIHByaXZhdGUgTmV4dExpc3RlbmVySWQ6IG51bWJlciA9IDA7XG5cbiAgICBwcml2YXRlIExpc3RlbmVyczogTWFwPG51bWJlciwgKEFyZ3VtZW50OiBUKSA9PiB2b2lkPiA9IG5ldyBNYXA8bnVtYmVyLCAoQXJndW1lbnQ6IFQpID0+IHZvaWQ+KCk7XG5cbiAgICBwdWJsaWMgR2V0SGFuZGxlID0gKCk6IFRTdWJzY3JpcHRpb25IYW5kbGU8VD4gPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IFN1YnNjcmliZSA9IChDYWxsYmFjazogKChBcmd1bWVudDogVCkgPT4gdm9pZCkpOiBudW1iZXIgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgSWQ6IG51bWJlciA9IHRoaXMuTmV4dExpc3RlbmVySWQrKztcbiAgICAgICAgICAgIHRoaXMuTGlzdGVuZXJzLnNldChJZCwgQ2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuIElkO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IFVuc3Vic2NyaWJlID0gKElkOiBudW1iZXIpOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuTGlzdGVuZXJzLmRlbGV0ZShJZCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFN1YnNjcmliZSxcbiAgICAgICAgICAgIFVuc3Vic2NyaWJlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIERpc3BhdGNoID0gKE1lc3NhZ2U6IFQpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAodGhpcy5MaXN0ZW5lcnMuc2l6ZSA+IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuTGlzdGVuZXJzLmZvckVhY2goKENhbGxiYWNrOiAoKEFyZ3VtZW50OiBUKSA9PiB2b2lkKSk6IHZvaWQgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDYWxsYmFjayhNZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn07XG5cbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbmFtaW5nLWNvbnZlbnRpb24gKi9cbmV4cG9ydCBjbGFzcyBURGlzcGF0Y2hlcl9ERVBSRUNBVEVEPFQgPSB1bmtub3duPlxue1xuICAgIHByaXZhdGUgTmV4dExpc3RlbmVySWQ6IG51bWJlciA9IDA7XG5cbiAgICBwcml2YXRlIExpc3RlbmVyczogTWFwPG51bWJlciwgKEFyZ3VtZW50OiBUKSA9PiB2b2lkPiA9IG5ldyBNYXA8bnVtYmVyLCAoQXJndW1lbnQ6IFQpID0+IHZvaWQ+KCk7XG5cbiAgICBwdWJsaWMgU3Vic2NyaWJlKENhbGxiYWNrOiAoKEFyZ3VtZW50OiBUKSA9PiB2b2lkKSk6IG51bWJlclxuICAgIHtcbiAgICAgICAgY29uc3QgSWQ6IG51bWJlciA9IHRoaXMuTmV4dExpc3RlbmVySWQrKztcbiAgICAgICAgdGhpcy5MaXN0ZW5lcnMuc2V0KElkLCBDYWxsYmFjayk7XG4gICAgICAgIHJldHVybiBJZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgVW5zdWJzY3JpYmUoSWQ6IG51bWJlcik6IHZvaWRcbiAgICB7XG4gICAgICAgIHRoaXMuTGlzdGVuZXJzLmRlbGV0ZShJZCk7XG4gICAgfVxuXG4gICAgcHVibGljIERpc3BhdGNoID0gKE1lc3NhZ2U6IFQpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAodGhpcy5MaXN0ZW5lcnMuc2l6ZSA+IDApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuTGlzdGVuZXJzLmZvckVhY2goKENhbGxiYWNrOiAoKEFyZ3VtZW50OiBUKSA9PiB2b2lkKSk6IHZvaWQgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBDYWxsYmFjayhNZXNzYWdlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcbn07XG4iLCJpbXBvcnQgeyBJbml0aWFsaXplSG9va3MgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5cbkluaXRpYWxpemVIb29rcygpO1xuIiwiLyogRmlsZTogICAgICBLZXlib2FyZC50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjQgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZLZXlib2FyZEV2ZW50IH0gZnJvbSBcIi4vS2V5Ym9hcmQuVHlwZXNcIjtcbmltcG9ydCB7IFN1YnNjcmliZSBhcyBJcGNTdWJzY3JpYmUgfSBmcm9tIFwiLi9Ob2RlSXBjXCI7XG5pbXBvcnQgeyBJc1ZpcnR1YWxLZXkgfSBmcm9tIFwiQC9Eb21haW4vQ29tbW9uL0NvbXBvbmVudC9LZXlib2FyZC9LZXlib2FyZFwiO1xuaW1wb3J0IHsgVERpc3BhdGNoZXJfREVQUkVDQVRFRCB9IGZyb20gXCIuL0Rpc3BhdGNoZXJcIjtcblxuY2xhc3MgRktleWJvYXJkIGV4dGVuZHMgVERpc3BhdGNoZXJfREVQUkVDQVRFRDxGS2V5Ym9hcmRFdmVudD5cbntcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoKVxuICAgIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIElzS2V5RG93bjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgLyoqIFJldHVybnMgdHJ1ZSBpZiB0aGUgYE9uS2V5YCBzaG91bGQgY29udGludWUuICovXG4gICAgcHJpdmF0ZSBEZWJvdW5jZSA9IChTdGF0ZTogRktleWJvYXJkRXZlbnRbXCJTdGF0ZVwiXSk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIGlmIChTdGF0ZSA9PT0gXCJEb3duXCIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5Jc0tleURvd24pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5Jc0tleURvd24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuSXNLZXlEb3duID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwdWJsaWMgT25LZXkgPSAoLi4uRGF0YTogQXJyYXk8dW5rbm93bj4pOiB2b2lkID0+XG4gICAge1xuICAgICAgICBjb25zdCBFdmVudDogRktleWJvYXJkRXZlbnQgPSBEYXRhWzBdIGFzIEZLZXlib2FyZEV2ZW50O1xuICAgICAgICBjb25zdCBJc0RlYm91bmNlZDogYm9vbGVhbiA9IHRoaXMuRGVib3VuY2UoRXZlbnQuU3RhdGUpO1xuICAgICAgICBpZiAoSXNEZWJvdW5jZWQgJiYgSXNWaXJ0dWFsS2V5KEV2ZW50LlZrQ29kZSkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuRGlzcGF0Y2goRXZlbnQpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IEtleWJvYXJkOiBGS2V5Ym9hcmQgPSBuZXcgRktleWJvYXJkKCk7XG5JcGNTdWJzY3JpYmUoXCJLZXlib2FyZFwiLCBLZXlib2FyZC5PbktleSk7XG4iLCIvKiBGaWxlOiAgICAgIE1haW4udHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI0IEdhZ2UgU29ycmVsbFxuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgXCIuL0NvcmUvU2lkZUVmZmVjdHNcIjtcbiIsIi8qIEZpbGU6ICAgIE1haW5XaW5kb3cudHNcbiAqIEF1dGhvcjogIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogTGljZW5zZTogTUlUXG4gKi9cblxuaW1wb3J0ICogYXMgRnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgKiBhcyBQYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQge1xuICAgIEJsdXJCYWNrZ3JvdW5kLFxuICAgIENhcHR1cmVTY3JlZW5TZWN0aW9uVG9UZW1wUG5nRmlsZSxcbiAgICB0eXBlIEZCb3gsXG4gICAgR2V0Rm9jdXNlZFdpbmRvdyxcbiAgICBHZXRXaW5kb3dUaXRsZSxcbiAgICB0eXBlIEhXaW5kb3csXG4gICAgVW5ibHVyQmFja2dyb3VuZCB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IEJyb3dzZXJXaW5kb3csIGFwcCwgaXBjTWFpbiwgc2NyZWVuIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgdHlwZSB7IEZLZXlib2FyZEV2ZW50IH0gZnJvbSBcIi4vS2V5Ym9hcmQuVHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgRlZpcnR1YWxLZXkgfSBmcm9tIFwiQC9Eb21haW4vQ29tbW9uL0NvbXBvbmVudC9LZXlib2FyZC9LZXlib2FyZC5UeXBlc1wiO1xuaW1wb3J0IHsgS2V5Ym9hcmQgfSBmcm9tIFwiLi9LZXlib2FyZFwiO1xuaW1wb3J0IHsgUmVzb2x2ZUh0bWxQYXRoIH0gZnJvbSBcIi4vQ29yZS9VdGlsaXR5XCI7XG5pbXBvcnQgeyBLZXlJZHNCeUlkLCBWayB9IGZyb20gXCJAL0RvbWFpbi9Db21tb24vQ29tcG9uZW50L0tleWJvYXJkL0tleWJvYXJkXCI7XG5pbXBvcnQgeyBBbm5vdGF0ZVBhbmVsLCBCcmluZ0ludG9QYW5lbCwgR2V0Rm9yZXN0LCBHZXRQYW5lbHMsIEdldFBhbmVsU2NyZWVuc2hvdCwgSXNXaW5kb3dUaWxlZCB9IGZyb20gXCIuL1RyZWVcIjtcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCB7IExvZyB9IGZyb20gXCIuL0RldmVsb3BtZW50XCI7XG5pbXBvcnQgdHlwZSB7IEZBbm5vdGF0ZWRQYW5lbCwgRlBhbmVsIH0gZnJvbSBcIi4vVHJlZS5UeXBlc1wiO1xuXG5sZXQgTWFpbldpbmRvdzogQnJvd3NlcldpbmRvdyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuY29uc3QgR2V0TGVhc3RJbnZpc2libGVQb3NpdGlvbiA9ICgpOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0gPT5cbntcbiAgICBjb25zdCBEaXNwbGF5czogQXJyYXk8RWxlY3Ryb24uRGlzcGxheT4gPSBzY3JlZW4uZ2V0QWxsRGlzcGxheXMoKTtcblxuICAgIHR5cGUgRk1vbml0b3JCb3VuZHMgPSB7IGxlZnQ6IG51bWJlcjsgcmlnaHQ6IG51bWJlcjsgdG9wOiBudW1iZXI7IGJvdHRvbTogbnVtYmVyIH07XG4gICAgY29uc3QgTW9uaXRvckJvdW5kczogQXJyYXk8Rk1vbml0b3JCb3VuZHM+ID0gRGlzcGxheXMubWFwKChkaXNwbGF5OiBFbGVjdHJvbi5EaXNwbGF5KTogRk1vbml0b3JCb3VuZHMgPT5cbiAgICB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBib3R0b206IGRpc3BsYXkuYm91bmRzLnkgKyBkaXNwbGF5LmJvdW5kcy5oZWlnaHQsXG4gICAgICAgICAgICBsZWZ0OiBkaXNwbGF5LmJvdW5kcy54LFxuICAgICAgICAgICAgcmlnaHQ6IGRpc3BsYXkuYm91bmRzLnggKyBkaXNwbGF5LmJvdW5kcy53aWR0aCxcbiAgICAgICAgICAgIHRvcDogZGlzcGxheS5ib3VuZHMueVxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgTW9uaXRvckJvdW5kcy5zb3J0KChBOiBGTW9uaXRvckJvdW5kcywgQjogRk1vbml0b3JCb3VuZHMpID0+IEEubGVmdCAtIEIubGVmdCB8fCBBLnRvcCAtIEIudG9wKTtcblxuICAgIGNvbnN0IE1heFJpZ2h0OiBudW1iZXIgPSBNYXRoLm1heCguLi5Nb25pdG9yQm91bmRzLm1hcCgoYm91bmRzOiBGTW9uaXRvckJvdW5kcykgPT4gYm91bmRzLnJpZ2h0KSk7XG4gICAgY29uc3QgTWF4Qm90dG9tOiBudW1iZXIgPSBNYXRoLm1heCguLi5Nb25pdG9yQm91bmRzLm1hcCgoYm91bmRzOiBGTW9uaXRvckJvdW5kcykgPT4gYm91bmRzLmJvdHRvbSkpO1xuXG4gICAgY29uc3QgSW52aXNpYmxlWDogbnVtYmVyID0gKE1heFJpZ2h0ICsgMSkgKiAyO1xuICAgIGNvbnN0IEludmlzaWJsZVk6IG51bWJlciA9IChNYXhCb3R0b20gKyAxKSAqIDI7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB4OiBJbnZpc2libGVYLFxuICAgICAgICB5OiBJbnZpc2libGVZXG4gICAgfTtcbn07XG5cbmNvbnN0IExhdW5jaE1haW5XaW5kb3cgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuICAgIGNvbnNvbGUubG9nKFwiTGF1bmNoaW5nIG1haW4gd2luZG93LlwiKTtcbiAgICBNYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgICAgICBhbHdheXNPblRvcDogdHJ1ZSxcbiAgICAgICAgZnJhbWU6IGZhbHNlLFxuICAgICAgICBoZWlnaHQ6IDkwMCxcbiAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgc2tpcFRhc2tiYXI6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIlNvcnJlbGxXbSBNYWluIFdpbmRvd1wiLFxuICAgICAgICB0aXRsZUJhclN0eWxlOiBcImhpZGRlblwiLFxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgd2ViUHJlZmVyZW5jZXM6XG4gICAgICAgIHtcbiAgICAgICAgICAgIGRldlRvb2xzOiBmYWxzZSxcbiAgICAgICAgICAgIC8vIGRldlRvb2xzOiB0cnVlLFxuICAgICAgICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgcHJlbG9hZDogYXBwLmlzUGFja2FnZWRcbiAgICAgICAgICAgICAgICA/IFBhdGguam9pbihfX2Rpcm5hbWUsIFwiUHJlbG9hZC5qc1wiKVxuICAgICAgICAgICAgICAgIDogUGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi8uLi8uZXJiL2RsbC9wcmVsb2FkLmpzXCIpXG4gICAgICAgIH0sXG4gICAgICAgIHdpZHRoOiA5MDAsXG4gICAgICAgIC4uLkdldExlYXN0SW52aXNpYmxlUG9zaXRpb24oKVxuICAgIH0pO1xuXG4gICAgTWFpbldpbmRvdy5vbihcInNob3dcIiwgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIF9Jc0Fsd2F5c09uVG9wOiBib29sZWFuKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIk5hdmlnYXRlXCIsIFwiTWFpblwiKTtcbiAgICB9KTtcblxuICAgIE1haW5XaW5kb3cub24oXG4gICAgICAgIFwicGFnZS10aXRsZS11cGRhdGVkXCIsXG4gICAgICAgIChFdmVudDogRWxlY3Ryb24uRXZlbnQsIF9UaXRsZTogc3RyaW5nLCBfRXhwbGljaXRTZXQ6IGJvb2xlYW4pOiB2b2lkID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIEV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAvLyBNYWluV2luZG93Py53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICAvKiogQFRPRE8gRmluZCBiZXR0ZXIgcGxhY2UgZm9yIHRoaXMuICovXG4gICAgaXBjTWFpbi5vbihcIkdldEFubm90YXRlZFBhbmVsc1wiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uX0FyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+XG4gICAge1xuICAgICAgICBjb25zdCBQYW5lbHM6IEFycmF5PEZQYW5lbD4gPSBHZXRQYW5lbHMoKTtcbiAgICAgICAgY29uc3QgQW5ub3RhdGVkUGFuZWxzOiBBcnJheTxGQW5ub3RhdGVkUGFuZWw+ID0gKGF3YWl0IFByb21pc2UuYWxsKFBhbmVscy5tYXAoQW5ub3RhdGVQYW5lbCkpKVxuICAgICAgICAgICAgLmZpbHRlcigoVmFsdWU6IEZBbm5vdGF0ZWRQYW5lbCB8IHVuZGVmaW5lZCk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gVmFsdWUgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH0pIGFzIEFycmF5PEZBbm5vdGF0ZWRQYW5lbD47XG5cbiAgICAgICAgTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZChcIkdldEFubm90YXRlZFBhbmVsc1wiLCBBbm5vdGF0ZWRQYW5lbHMpO1xuICAgIH0pO1xuXG4gICAgLy8gS2V5Ym9hcmQuU3Vic2NyaWJlKChBcmd1bWVudDogRktleWJvYXJkRXZlbnQpOiB2b2lkID0+XG4gICAgLy8ge1xuICAgIC8vICAgICBjb25zdCBJbnB1dEtleXM6IEFycmF5PEZWaXJ0dWFsS2V5PiA9XG4gICAgLy8gICAgIFtcbiAgICAvLyAgICAgICAgIFZrW1wiRFwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiSFwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiVFwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiTlwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiWlwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiRlwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiR1wiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiQ1wiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiUlwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiMFwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiMVwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiMlwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiM1wiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiNFwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiNVwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiNlwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiN1wiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiOFwiXSxcbiAgICAvLyAgICAgICAgIFZrW1wiOVwiXVxuICAgIC8vICAgICBdO1xuXG4gICAgLy8gICAgIGlmIChJbnB1dEtleXMuaW5jbHVkZXMoQXJndW1lbnQuVmtDb2RlKSAmJiBBcmd1bWVudC5TdGF0ZSA9PT0gXCJVcFwiKVxuICAgIC8vICAgICB7XG4gICAgLy8gICAgICAgICBMb2coYExvZ2dpbmcgaW5wdXQgaGVyZSBhcyAkeyBBcmd1bWVudC5Wa0NvZGUgfS5gKTtcbiAgICAvLyAgICAgICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmRJbnB1dEV2ZW50KHtrZXlDb2RlOiBLZXlJZHNCeUlkW0FyZ3VtZW50LlZrQ29kZV0sIHR5cGU6IFwia2V5RG93blwifSk7XG4gICAgLy8gICAgICAgICBNYWluV2luZG93Py53ZWJDb250ZW50cy5zZW5kSW5wdXRFdmVudCh7a2V5Q29kZTogS2V5SWRzQnlJZFtBcmd1bWVudC5Wa0NvZGVdLCB0eXBlOiBcImNoYXJcIn0pO1xuICAgIC8vICAgICAgICAgTWFpbldpbmRvdz8ud2ViQ29udGVudHMuc2VuZElucHV0RXZlbnQoe2tleUNvZGU6IEtleUlkc0J5SWRbQXJndW1lbnQuVmtDb2RlXSwgdHlwZTogXCJrZXlVcFwifSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyB9KTtcblxuICAgIC8qKiBAVE9ETyBGaW5kIGJldHRlciBwbGFjZSBmb3IgdGhpcy4gKi9cbiAgICBpcGNNYWluLm9uKFwiR2V0UGFuZWxTY3JlZW5zaG90c1wiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uX0FyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+XG4gICAge1xuICAgICAgICBjb25zdCBQYW5lbHM6IEFycmF5PEZQYW5lbD4gPSBHZXRQYW5lbHMoKTtcbiAgICAgICAgY29uc3QgU2NyZWVuc2hvdHM6IEFycmF5PHN0cmluZz4gPSAoYXdhaXQgUHJvbWlzZS5hbGwoUGFuZWxzLm1hcChHZXRQYW5lbFNjcmVlbnNob3QpKSlcbiAgICAgICAgICAgIC5maWx0ZXIoKFZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBib29sZWFuID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9KSBhcyBBcnJheTxzdHJpbmc+O1xuXG4gICAgICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJHZXRQYW5lbFNjcmVlbnNob3RzXCIsIFNjcmVlbnNob3RzKTtcbiAgICB9KTtcblxuICAgIGlwY01haW4ub24oXCJCcmluZ0ludG9QYW5lbFwiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uQXJndW1lbnRzOiBBcnJheTx1bmtub3duPikgPT5cbiAgICB7XG4gICAgICAgIC8vIExvZyhcIkJyaW5nSW50b1BhbmVsXCIsIEFyZ3VtZW50c1swXSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQnJpbmdJbnRvUGFuZWwgISEgISFcIiwgLi4uQXJndW1lbnRzKTtcbiAgICAgICAgQnJpbmdJbnRvUGFuZWwoQXJndW1lbnRzWzBdIGFzIEZBbm5vdGF0ZWRQYW5lbCk7XG4gICAgfSk7XG5cbiAgICBpcGNNYWluLm9uKFwiVGVhckRvd25cIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLkFyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+XG4gICAge1xuICAgICAgICBBY3RpdmVXaW5kb3cgPSB1bmRlZmluZWQ7XG4gICAgICAgIFVuYmx1ckJhY2tncm91bmQoKTtcbiAgICB9KTtcblxuICAgIGlwY01haW4ub24oXCJMb2dcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLkFyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+XG4gICAge1xuICAgICAgICBjb25zdCBTdHJpbmdpZmllZEFyZ3VtZW50czogc3RyaW5nID0gQXJndW1lbnRzXG4gICAgICAgICAgICAubWFwKChBcmd1bWVudDogdW5rbm93bik6IHN0cmluZyA9PlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgQXJndW1lbnQgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgPyBBcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICA6IEpTT04uc3RyaW5naWZ5KEFyZ3VtZW50KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuam9pbigpO1xuXG4gICAgICAgIGNvbnN0IEJpcmRpZTogc3RyaW5nID0gY2hhbGsuYmdNYWdlbnRhKFwiIOKam++4jyBcIikgKyBcIiBcIjtcbiAgICAgICAgbGV0IE91dFN0cmluZzogc3RyaW5nID0gQmlyZGllO1xuICAgICAgICBmb3IgKGxldCBJbmRleDogbnVtYmVyID0gMDsgSW5kZXggPCBTdHJpbmdpZmllZEFyZ3VtZW50cy5sZW5ndGg7IEluZGV4KyspXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IENoYXJhY3Rlcjogc3RyaW5nID0gU3RyaW5naWZpZWRBcmd1bWVudHNbSW5kZXhdO1xuICAgICAgICAgICAgaWYgKENoYXJhY3RlciA9PT0gXCJcXG5cIiAmJiBJbmRleCAhPT0gU3RyaW5naWZpZWRBcmd1bWVudHMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBPdXRTdHJpbmcgKz0gQmlyZGllICsgQ2hhcmFjdGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE91dFN0cmluZyArPSBDaGFyYWN0ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhPdXRTdHJpbmcpO1xuICAgIH0pO1xuXG4gICAgTWFpbldpbmRvdy5sb2FkVVJMKFJlc29sdmVIdG1sUGF0aChcImluZGV4Lmh0bWxcIikpO1xufTtcblxuLyoqIFRoZSB3aW5kb3cgdGhhdCBTb3JyZWxsV20gaXMgYmVpbmcgZHJhd24gb3Zlci4gKi9cbmxldCBBY3RpdmVXaW5kb3c6IEhXaW5kb3cgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5leHBvcnQgY29uc3QgR2V0QWN0aXZlV2luZG93ID0gKCk6IEhXaW5kb3cgfCB1bmRlZmluZWQgPT5cbntcbiAgICByZXR1cm4gQWN0aXZlV2luZG93O1xufTtcblxuZnVuY3Rpb24gT25LZXkoRXZlbnQ6IEZLZXlib2FyZEV2ZW50KTogdm9pZFxue1xuICAgIGNvbnN0IHsgU3RhdGUsIFZrQ29kZSB9ID0gRXZlbnQ7XG4gICAgaWYgKE1haW5XaW5kb3cgPT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKiogQFRPRE8gTWFrZSB0aGlzIGEgbW9kaWZpYWJsZSBzZXR0aW5nLiAqL1xuICAgIGNvbnN0IEFjdGl2YXRpb25LZXk6IEZWaXJ0dWFsS2V5ID0gVmtbXCIrXCJdO1xuXG4gICAgaWYgKFZrQ29kZSA9PT0gQWN0aXZhdGlvbktleSlcbiAgICB7XG4gICAgICAgIGlmIChTdGF0ZSA9PT0gXCJEb3duXCIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChHZXRXaW5kb3dUaXRsZShHZXRGb2N1c2VkV2luZG93KCkpICE9PSBcIlNvcnJlbGxXbSBNYWluIFdpbmRvd1wiKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEFjdGl2ZVdpbmRvdyA9IEdldEZvY3VzZWRXaW5kb3coKTtcbiAgICAgICAgICAgICAgICBjb25zdCBJc1RpbGVkOiBib29sZWFuID0gSXNXaW5kb3dUaWxlZChHZXRGb2N1c2VkV2luZG93KCkpO1xuICAgICAgICAgICAgICAgIExvZyhgRm9jdXNlZCBXaW5kb3cgb2YgSXNUaWxlZCBjYWxsIGlzICR7IEdldFdpbmRvd1RpdGxlKEdldEZvY3VzZWRXaW5kb3coKSkgfS5gKTtcbiAgICAgICAgICAgICAgICBNYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoXCJOYXZpZ2F0ZVwiLCBcIlwiLCB7IElzVGlsZWQgfSk7XG4gICAgICAgICAgICAgICAgQmx1ckJhY2tncm91bmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIFVuYmx1ckJhY2tncm91bmQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBNYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoXCJLZXlib2FyZFwiLCBFdmVudCk7XG4gICAgfVxufVxuXG5hcHAud2hlblJlYWR5KClcbiAgICAudGhlbihMYXVuY2hNYWluV2luZG93KVxuICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG5cbktleWJvYXJkLlN1YnNjcmliZShPbktleSk7XG4iLCIvKiBGaWxlOiAgICAgIE1lc3NhZ2VMb29wLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuLyoqIFRoaXMgZmlsZSBtdXN0IGJlIHNpZGUtZWZmZWN0IGltcG9ydGVkIGJ5IGBNYWluYC4gKi9cblxuaW1wb3J0IHsgSW5pdGlhbGl6ZU1lc3NhZ2VMb29wIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG5jb25zdCBSdW5Jbml0aWFsaXplTWVzc2FnZUxvb3AgPSAoKTogdm9pZCA9Plxue1xuICAgIEluaXRpYWxpemVNZXNzYWdlTG9vcCgoKSA9PiB7IH0pO1xufTtcblxuUnVuSW5pdGlhbGl6ZU1lc3NhZ2VMb29wKCk7XG4iLCIvKiBGaWxlOiAgICAgIE1vbml0b3IudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHsgdHlwZSBGTW9uaXRvckluZm8sIEluaXRpYWxpemVNb25pdG9ycyB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IFN1YnNjcmliZSB9IGZyb20gXCIuL05vZGVJcGNcIjtcbmltcG9ydCB7IFREaXNwYXRjaGVyLCB0eXBlIFRTdWJzY3JpcHRpb25IYW5kbGUgfSBmcm9tIFwiLi9EaXNwYXRjaGVyXCI7XG5cbmNvbnN0IE1vbml0b3JzOiBBcnJheTxGTW9uaXRvckluZm8+ID0gWyBdO1xuXG5leHBvcnQgY29uc3QgR2V0TW9uaXRvcnMgPSAoKTogQXJyYXk8Rk1vbml0b3JJbmZvPiA9Plxue1xuICAgIHJldHVybiBbIC4uLk1vbml0b3JzIF07XG59O1xuXG5jb25zdCBNb25pdG9yc0Rpc3BhdGNoZXI6IFREaXNwYXRjaGVyPEFycmF5PEZNb25pdG9ySW5mbz4+ID0gbmV3IFREaXNwYXRjaGVyPEFycmF5PEZNb25pdG9ySW5mbz4+KCk7XG5leHBvcnQgY29uc3QgTW9uaXRvcnNIYW5kbGU6IFRTdWJzY3JpcHRpb25IYW5kbGU8QXJyYXk8Rk1vbml0b3JJbmZvPj4gPSBNb25pdG9yc0Rpc3BhdGNoZXIuR2V0SGFuZGxlKCk7XG5cbmNvbnN0IE9uTW9uaXRvcnNDaGFuZ2VkID0gKC4uLkRhdGE6IEFycmF5PHVua25vd24+KTogdm9pZCA9Plxue1xuICAgIGNvbnN0IE5ld01vbml0b3JzOiBBcnJheTxGTW9uaXRvckluZm8+ID0gRGF0YVswXSBhcyBBcnJheTxGTW9uaXRvckluZm8+O1xuICAgIE1vbml0b3JzLmxlbmd0aCA9IDA7XG4gICAgTW9uaXRvcnMucHVzaCguLi5OZXdNb25pdG9ycyk7XG4gICAgTW9uaXRvcnNEaXNwYXRjaGVyLkRpc3BhdGNoKE5ld01vbml0b3JzKTtcbn07XG5cbmNvbnN0IEluaXRpYWxpemVNb25pdG9yVHJhY2tpbmcgPSAoKTogdm9pZCA9Plxue1xuICAgIE1vbml0b3JzLnB1c2goLi4uSW5pdGlhbGl6ZU1vbml0b3JzKCkpO1xuICAgIFN1YnNjcmliZShcIk1vbml0b3JzXCIsIE9uTW9uaXRvcnNDaGFuZ2VkKTtcbn07XG5cbkluaXRpYWxpemVNb25pdG9yVHJhY2tpbmcoKTtcbiIsIi8qIEZpbGU6ICAgICAgTm9kZUlwYy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjQgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZJcGNDYWxsYmFjaywgRklwY0NhbGxiYWNrU2VyaWFsaXplZCB9IGZyb20gXCIuL05vZGVJcGMuVHlwZXNcIjtcbmltcG9ydCB7IEluaXRpYWxpemVJcGMgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5cbmxldCBOZXh0TGlzdGVuZXJJZDogbnVtYmVyID0gMDtcbmNvbnN0IExpc3RlbmVyczogTWFwPG51bWJlciwgRklwY0NhbGxiYWNrU2VyaWFsaXplZD4gPSBuZXcgTWFwPG51bWJlciwgRklwY0NhbGxiYWNrU2VyaWFsaXplZD4oKTtcblxuZXhwb3J0IGNvbnN0IFN1YnNjcmliZSA9IChDaGFubmVsOiBzdHJpbmcsIENhbGxiYWNrOiBGSXBjQ2FsbGJhY2spOiBudW1iZXIgPT5cbntcbiAgICBjb25zdCBJZDogbnVtYmVyID0gTmV4dExpc3RlbmVySWQrKztcbiAgICBMaXN0ZW5lcnMuc2V0KElkLCB7IENhbGxiYWNrLCBDaGFubmVsIH0pO1xuICAgIHJldHVybiBJZDtcbn07XG5cbmV4cG9ydCBjb25zdCBVbnN1YnNjcmliZSA9IChJZDogbnVtYmVyKTogdm9pZCA9Plxue1xuICAgIExpc3RlbmVycy5kZWxldGUoSWQpO1xufTtcblxuZnVuY3Rpb24gT25NZXNzYWdlKENoYW5uZWw6IHN0cmluZywgTWVzc2FnZTogdW5rbm93bilcbntcbiAgICBMaXN0ZW5lcnMuZm9yRWFjaCgoQ2FsbGJhY2s6IEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAoQ2FsbGJhY2suQ2hhbm5lbCA9PT0gQ2hhbm5lbClcbiAgICAgICAge1xuICAgICAgICAgICAgQ2FsbGJhY2suQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuSW5pdGlhbGl6ZUlwYyhPbk1lc3NhZ2UpO1xuIiwiLyogRmlsZTogICAgICBUcmVlLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB7XG4gICAgQ2FwdHVyZVNjcmVlblNlY3Rpb25Ub1RlbXBQbmdGaWxlLFxuICAgIHR5cGUgRk1vbml0b3JJbmZvLFxuICAgIEdldEFwcGxpY2F0aW9uRnJpZW5kbHlOYW1lLFxuICAgIEdldE1vbml0b3JGcmllbmRseU5hbWUsXG4gICAgR2V0TW9uaXRvckZyb21XaW5kb3csXG4gICAgR2V0VGlsZWFibGVXaW5kb3dzLFxuICAgIEdldFdpbmRvd1RpdGxlLFxuICAgIHR5cGUgSE1vbml0b3IsXG4gICAgdHlwZSBIV2luZG93LFxuICAgIFNldFdpbmRvd1Bvc2l0aW9uIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuaW1wb3J0IHR5cGUge1xuICAgIEZBbm5vdGF0ZWRQYW5lbCxcbiAgICBGQ2VsbCxcbiAgICBGRm9yZXN0LFxuICAgIEZQYW5lbCxcbiAgICBGUGFuZWxCYXNlLFxuICAgIEZQYW5lbEhvcml6b250YWwsXG4gICAgRlZlcnRleCB9IGZyb20gXCIuL1RyZWUuVHlwZXNcIjtcbmltcG9ydCB7IEFyZUJveGVzRXF1YWwsIEFyZUhhbmRsZXNFcXVhbCB9IGZyb20gXCIuL0NvcmUvVXRpbGl0eVwiO1xuaW1wb3J0IHsgcHJvbWlzZXMgYXMgRnMgfSBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IEdldEFjdGl2ZVdpbmRvdyB9IGZyb20gXCIuL01haW5XaW5kb3dcIjtcbmltcG9ydCB7IEdldE1vbml0b3JzIH0gZnJvbSBcIi4vTW9uaXRvclwiO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSBcIi4vRGV2ZWxvcG1lbnRcIjtcbmltcG9ydCB0eXBlIHsgVFByZWRpY2F0ZSB9IGZyb20gXCJAL1V0aWxpdHlcIjtcblxuY29uc3QgRm9yZXN0OiBGRm9yZXN0ID0gWyBdO1xuXG5leHBvcnQgY29uc3QgR2V0Rm9yZXN0ID0gKCk6IEZGb3Jlc3QgPT5cbntcbiAgICByZXR1cm4gWyAuLi5Gb3Jlc3QgXTtcbn07XG5cbi8qKiBAVE9ETyAqL1xuZXhwb3J0IGNvbnN0IExvZ0ZvcmVzdCA9ICgpOiB2b2lkID0+XG57XG59O1xuXG5jb25zdCBDZWxsID0gKEhhbmRsZTogSFdpbmRvdyk6IEZDZWxsID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgSGFuZGxlLFxuICAgICAgICBTaXplOiB7IEhlaWdodDogMCwgV2lkdGg6IDAsIFg6IDAsIFk6IDAgfSxcbiAgICAgICAgWk9yZGVyOiAwXG4gICAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBVcGRhdGVGb3Jlc3QgPSAoVXBkYXRlRnVuY3Rpb246IChPbGRGb3Jlc3Q6IEZGb3Jlc3QpID0+IEZGb3Jlc3QpOiB2b2lkID0+XG57XG4gICAgY29uc3QgTmV3Rm9yZXN0OiBGRm9yZXN0ID0gVXBkYXRlRnVuY3Rpb24oWyAuLi5Gb3Jlc3QgXSk7XG4gICAgRm9yZXN0Lmxlbmd0aCA9IDA7XG4gICAgRm9yZXN0LnB1c2goLi4uTmV3Rm9yZXN0KTtcblxuICAgIC8vIEBUT0RPIE1vdmUgYW5kIHJlc2l6ZSwgYW5kIHNvcnQgWk9yZGVyIG9mIGFsbCB3aW5kb3dzIGJlaW5nIHRpbGVkIGJ5IFNvcnJlbGxXbS5cbn07XG5cbmNvbnN0IEluaXRpYWxpemVUcmVlID0gKCk6IHZvaWQgPT5cbntcbiAgICBjb25zdCBNb25pdG9yczogQXJyYXk8Rk1vbml0b3JJbmZvPiA9IEdldE1vbml0b3JzKCk7XG5cbiAgICBjb25zb2xlLmxvZyhNb25pdG9ycyk7XG5cbiAgICBGb3Jlc3QucHVzaCguLi5Nb25pdG9ycy5tYXAoKE1vbml0b3I6IEZNb25pdG9ySW5mbyk6IEZQYW5lbEhvcml6b250YWwgPT5cbiAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBIZXJlLCBNb25pdG9ySGFuZGxlIGlzICR7IE1vbml0b3IuSGFuZGxlIH0uYCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBDaGlsZHJlbjogWyBdLFxuICAgICAgICAgICAgTW9uaXRvcklkOiBNb25pdG9yLkhhbmRsZSxcbiAgICAgICAgICAgIFNpemU6IE1vbml0b3IuU2l6ZSxcbiAgICAgICAgICAgIFR5cGU6IFwiSG9yaXpvbnRhbFwiLFxuICAgICAgICAgICAgWk9yZGVyOiAwXG4gICAgICAgIH07XG4gICAgfSkpO1xuXG4gICAgY29uc29sZS5sb2coRm9yZXN0KTtcblxuICAgIGNvbnN0IFRpbGVhYmxlV2luZG93czogQXJyYXk8SFdpbmRvdz4gPSBHZXRUaWxlYWJsZVdpbmRvd3MoKTtcblxuICAgIGNvbnNvbGUubG9nKGBGb3VuZCAkeyBUaWxlYWJsZVdpbmRvd3MubGVuZ3RoIH0gdGlsZWFibGUgd2luZG93cy5gKTtcblxuICAgIFRpbGVhYmxlV2luZG93cy5mb3JFYWNoKChIYW5kbGU6IEhXaW5kb3cpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBjb25zdCBNb25pdG9yOiBITW9uaXRvciA9IEdldE1vbml0b3JGcm9tV2luZG93KEhhbmRsZSk7XG4gICAgICAgIGNvbnN0IFJvb3RQYW5lbDogRlBhbmVsQmFzZSB8IHVuZGVmaW5lZCA9XG4gICAgICAgICAgICBGb3Jlc3QuZmluZCgoUGFuZWw6IEZQYW5lbEJhc2UpOiBib29sZWFuID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE1vbml0b3IgaXMgJHsgSlNPTi5zdHJpbmdpZnkoTW9uaXRvcikgfSBhbmQgUGFuZWwuTW9uaXRvcklkIGlzICR7IEpTT04uc3RyaW5naWZ5KFBhbmVsLk1vbml0b3JJZCkgfS5gKTtcbiAgICAgICAgICAgICAgICBjb25zdCBJbmZvOiBGTW9uaXRvckluZm8gfCB1bmRlZmluZWQgPVxuICAgICAgICAgICAgICAgICAgICBNb25pdG9ycy5maW5kKChGb286IEZNb25pdG9ySW5mbyk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZvby5IYW5kbGUuSGFuZGxlID09PSBQYW5lbC5Nb25pdG9ySWQ/LkhhbmRsZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgU2l6ZSAkeyBKU09OLnN0cmluZ2lmeShJbmZvPy5TaXplKSB9IFdvcmtTaXplICR7IEpTT04uc3RyaW5naWZ5KEluZm8/LldvcmtTaXplKSB9LmApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBhbmVsLk1vbml0b3JJZD8uSGFuZGxlID09PSBNb25pdG9yLkhhbmRsZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChSb290UGFuZWwgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gQFRPRE9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi8J+SofCfkqHwn5Kh8J+SoSBSb290UGFuZWwgd2FzIHVuZGVmaW5lZC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBSb290UGFuZWwuQ2hpbGRyZW4ucHVzaChDZWxsKEhhbmRsZSkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBGb3Jlc3QuZm9yRWFjaCgoUGFuZWw6IEZQYW5lbCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IE1vbml0b3JJbmZvOiBGTW9uaXRvckluZm8gfCB1bmRlZmluZWQgPVxuICAgICAgICAgICAgTW9uaXRvcnMuZmluZCgoSW5Nb25pdG9yOiBGTW9uaXRvckluZm8pOiBib29sZWFuID0+IEluTW9uaXRvci5IYW5kbGUgPT09IFBhbmVsLk1vbml0b3JJZCk7XG5cbiAgICAgICAgaWYgKE1vbml0b3JJbmZvID09PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIEBUT0RPXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBQYW5lbC5DaGlsZHJlbiA9IFBhbmVsLkNoaWxkcmVuLm1hcCgoQ2hpbGQ6IEZWZXJ0ZXgsIEluZGV4OiBudW1iZXIpOiBGVmVydGV4ID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgVW5pZm9ybVdpZHRoOiBudW1iZXIgPSBNb25pdG9ySW5mby5Xb3JrU2l6ZS5XaWR0aCAvIFBhbmVsLkNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBPdXRDaGlsZDogRlZlcnRleCA9IHsgLi4uQ2hpbGQgfTtcbiAgICAgICAgICAgICAgICBPdXRDaGlsZC5TaXplID1cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC4uLk1vbml0b3JJbmZvLldvcmtTaXplLFxuICAgICAgICAgICAgICAgICAgICBXaWR0aDogVW5pZm9ybVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBYOiBVbmlmb3JtV2lkdGggKiBJbmRleCArIE1vbml0b3JJbmZvLldvcmtTaXplLlhcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIE91dENoaWxkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IENlbGxzOiBBcnJheTxGQ2VsbD4gPSBHZXRBbGxDZWxscyhGb3Jlc3QpO1xuXG4gICAgQ2VsbHMuZm9yRWFjaCgoQ2VsbDogRkNlbGwpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBjb25zb2xlLmxvZyhgU2V0dGluZyBwb3NpdGlvbiBvZiAkeyBHZXRXaW5kb3dUaXRsZShDZWxsLkhhbmRsZSkgfSB0byAkeyBKU09OLnN0cmluZ2lmeShDZWxsLlNpemUpIH0uYCk7XG4gICAgICAgIFNldFdpbmRvd1Bvc2l0aW9uKENlbGwuSGFuZGxlLCBDZWxsLlNpemUpO1xuICAgICAgICAvKiBBdCBsZWFzdCBmb3Igbm93LCBpZ25vcmUgU29ycmVsbFdtIHdpbmRvd3MuICovXG4gICAgICAgIC8vIGlmIChHZXRXaW5kb3dUaXRsZShDZWxsLkhhbmRsZSkgIT09IFwiU29ycmVsbFdtXCIpXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIFNldFdpbmRvd1Bvc2l0aW9uKENlbGwuSGFuZGxlLCBDZWxsLlNpemUpO1xuICAgICAgICAvLyB9XG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZyhgQ2FsbGVkIFNldFdpbmRvd1Bvc2l0aW9uIGZvciAkeyBDZWxscy5sZW5ndGggfSB3aW5kb3dzLmApO1xufTtcblxuY29uc3QgSXNDZWxsID0gKFZlcnRleDogRlZlcnRleCk6IFZlcnRleCBpcyBGQ2VsbCA9Plxue1xuICAgIHJldHVybiBcIkhhbmRsZVwiIGluIFZlcnRleDtcbn07XG5cbmV4cG9ydCBjb25zdCBGbGF0dGVuID0gKCk6IEFycmF5PEZWZXJ0ZXg+ID0+XG57XG4gICAgY29uc3QgT3V0QXJyYXk6IEFycmF5PEZWZXJ0ZXg+ID0gWyBdO1xuXG4gICAgVHJhdmVyc2UoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIE91dEFycmF5LnB1c2goVmVydGV4KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gT3V0QXJyYXk7XG59O1xuXG4vKipcbiAqIFJ1biBhIGZ1bmN0aW9uIGZvciBlYWNoIHZlcnRleCB1bnRpbCB0aGUgZnVuY3Rpb24gcmV0dXJucyBgZmFsc2VgIGZvclxuICogYW4gaXRlcmF0aW9uLlxuICovXG5leHBvcnQgY29uc3QgVHJhdmVyc2UgPSAoUHJlZGljYXRlOiBUUHJlZGljYXRlPEZWZXJ0ZXg+LCBFbnRyeT86IEZWZXJ0ZXgpOiB2b2lkID0+XG57XG4gICAgbGV0IENvbnRpbnVlczogYm9vbGVhbiA9IHRydWU7XG4gICAgY29uc3QgUmVjdXJyZW5jZSA9IChWZXJ0ZXg6IEZWZXJ0ZXgpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAoQ29udGludWVzKVxuICAgICAgICB7XG4gICAgICAgICAgICBDb250aW51ZXMgPSBQcmVkaWNhdGUoVmVydGV4KTtcbiAgICAgICAgICAgIGlmIChDb250aW51ZXMgJiYgXCJDaGlsZHJlblwiIGluIFZlcnRleClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IENoaWxkIG9mIFZlcnRleC5DaGlsZHJlbilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlY3VycmVuY2UoQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoRW50cnkpXG4gICAge1xuICAgICAgICBSZWN1cnJlbmNlKEVudHJ5KTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgZm9yIChjb25zdCBQYW5lbCBvZiBGb3Jlc3QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFJlY3VycmVuY2UoUGFuZWwpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuY29uc3QgR2V0QWxsQ2VsbHMgPSAoUGFuZWxzOiBBcnJheTxGUGFuZWw+KTogQXJyYXk8RkNlbGw+ID0+XG57XG4gICAgY29uc3QgUmVzdWx0OiBBcnJheTxGQ2VsbD4gPSBbIF07XG5cbiAgICBmdW5jdGlvbiBUcmF2ZXJzZShWZXJ0ZXg6IEZWZXJ0ZXgpOiB2b2lkXG4gICAge1xuICAgICAgICBpZiAoXCJIYW5kbGVcIiBpbiBWZXJ0ZXgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFJlc3VsdC5wdXNoKFZlcnRleCBhcyBGQ2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoXCJDaGlsZHJlblwiIGluIFZlcnRleClcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yIChjb25zdCBDaGlsZCBvZiBWZXJ0ZXguQ2hpbGRyZW4pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgVHJhdmVyc2UoQ2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBQYW5lbCBvZiBQYW5lbHMpXG4gICAge1xuICAgICAgICBmb3IgKGNvbnN0IENoaWxkIG9mIFBhbmVsLkNoaWxkcmVuKVxuICAgICAgICB7XG4gICAgICAgICAgICBUcmF2ZXJzZShDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IEV4aXN0cyA9IChQcmVkaWNhdGU6IChWZXJ0ZXg6IEZWZXJ0ZXgpID0+IGJvb2xlYW4pOiBib29sZWFuID0+XG57XG4gICAgbGV0IERvZXNFeGlzdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIFRyYXZlcnNlKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoIURvZXNFeGlzdClcbiAgICAgICAge1xuICAgICAgICAgICAgRG9lc0V4aXN0ID0gUHJlZGljYXRlKFZlcnRleCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gIURvZXNFeGlzdDtcbiAgICB9KTtcblxuICAgIHJldHVybiBEb2VzRXhpc3Q7XG59O1xuXG4vKiogQFRPRE8gKi9cbmV4cG9ydCBjb25zdCBFeGlzdHNFeGFjdGx5T25lID0gKFByZWRpY2F0ZTogKFZlcnRleDogRlZlcnRleCkgPT4gYm9vbGVhbik6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgRm9yQWxsID0gKFByZWRpY2F0ZTogKFZlcnRleDogRlZlcnRleCkgPT4gYm9vbGVhbik6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgSXNXaW5kb3dUaWxlZCA9IChIYW5kbGU6IEhXaW5kb3cpOiBib29sZWFuID0+XG57XG4gICAgcmV0dXJuIEV4aXN0cygoVmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgaWYgKElzQ2VsbChWZXJ0ZXgpKVxuICAgICAgICB7XG4gICAgICAgICAgICBMb2coXCJIYW5kbGVzIGFyZTogXCIsIFZlcnRleC5IYW5kbGUsIEhhbmRsZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIElzQ2VsbChWZXJ0ZXgpICYmIEFyZUhhbmRsZXNFcXVhbChWZXJ0ZXguSGFuZGxlLCBIYW5kbGUpO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IEdldFBhbmVscyA9ICgpOiBBcnJheTxGUGFuZWw+ID0+XG57XG4gICAgY29uc3QgVmVydGljZXM6IEFycmF5PEZWZXJ0ZXg+ID0gRmxhdHRlbigpO1xuICAgIHJldHVybiBWZXJ0aWNlcy5maWx0ZXIoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT4gIUlzQ2VsbChWZXJ0ZXgpKSBhcyBBcnJheTxGUGFuZWw+O1xufTtcblxuZXhwb3J0IGNvbnN0IFB1Ymxpc2ggPSAoKTogdm9pZCA9Plxue1xuICAgIFRyYXZlcnNlKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoSXNDZWxsKFZlcnRleCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFNldFdpbmRvd1Bvc2l0aW9uKFxuICAgICAgICAgICAgICAgIFZlcnRleC5IYW5kbGUsXG4gICAgICAgICAgICAgICAgVmVydGV4LlNpemVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIFBhbmVsQ29udGFpbnNWZXJ0ZXgoY3VycmVudFZlcnRleDogRlZlcnRleCwgdGFyZ2V0VmVydGV4OiBGVmVydGV4KTogYm9vbGVhblxue1xuICAgIGlmIChjdXJyZW50VmVydGV4ID09PSB0YXJnZXRWZXJ0ZXgpXG4gICAge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGlzIGlzIGEgcGFuZWwsIGNoZWNrIGl0cyBjaGlsZHJlbiByZWN1cnNpdmVseVxuICAgIGlmIChcIkNoaWxkcmVuXCIgaW4gY3VycmVudFZlcnRleClcbiAgICB7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY3VycmVudFZlcnRleC5DaGlsZHJlbilcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKFBhbmVsQ29udGFpbnNWZXJ0ZXgoY2hpbGQsIHRhcmdldFZlcnRleCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBjb25zdCBHZXRSb290UGFuZWwgPSAoVmVydGV4OiBGVmVydGV4KTogRlBhbmVsIHwgdW5kZWZpbmVkID0+XG57XG4gICAgZm9yIChjb25zdCBQYW5lbCBvZiBGb3Jlc3QpXG4gICAge1xuICAgICAgICBpZiAoUGFuZWxDb250YWluc1ZlcnRleChQYW5lbCwgVmVydGV4KSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIFBhbmVsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IEdldFBhbmVsQXBwbGljYXRpb25OYW1lcyA9IChQYW5lbDogRlBhbmVsKTogQXJyYXk8c3RyaW5nPiA9Plxue1xuICAgIGNvbnN0IFJlc3VsdE5hbWVzOiBBcnJheTxzdHJpbmc+ID0gWyBdO1xuXG4gICAgVHJhdmVyc2UoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIGlmIChcIkhhbmRsZVwiIGluIFZlcnRleClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgRnJpZW5kbHlOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBHZXRBcHBsaWNhdGlvbkZyaWVuZGx5TmFtZShWZXJ0ZXguSGFuZGxlKTtcbiAgICAgICAgICAgIGlmIChGcmllbmRseU5hbWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZXN1bHROYW1lcy5wdXNoKEZyaWVuZGx5TmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChSZXN1bHROYW1lcy5sZW5ndGggPj0gMylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LCBQYW5lbCk7XG5cbiAgICByZXR1cm4gUmVzdWx0TmFtZXM7XG59O1xuXG5leHBvcnQgY29uc3QgQW5ub3RhdGVQYW5lbCA9IChQYW5lbDogRlBhbmVsKTogRkFubm90YXRlZFBhbmVsIHwgdW5kZWZpbmVkID0+XG57XG4gICAgY29uc3QgUm9vdFBhbmVsOiBGUGFuZWwgfCB1bmRlZmluZWQgPSBHZXRSb290UGFuZWwoUGFuZWwpO1xuICAgIGlmIChSb290UGFuZWwgIT09IHVuZGVmaW5lZCAmJiBSb290UGFuZWwuTW9uaXRvcklkICE9PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICBjb25zdCBBcHBsaWNhdGlvbk5hbWVzOiBBcnJheTxzdHJpbmc+ID0gR2V0UGFuZWxBcHBsaWNhdGlvbk5hbWVzKFBhbmVsKTtcbiAgICAgICAgY29uc3QgSXNSb290OiBib29sZWFuID0gUm9vdFBhbmVsID09PSBQYW5lbDtcbiAgICAgICAgY29uc3QgTW9uaXRvcjogc3RyaW5nID0gR2V0TW9uaXRvckZyaWVuZGx5TmFtZShSb290UGFuZWwuTW9uaXRvcklkKSB8fCBcIlwiO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5QYW5lbCxcblxuICAgICAgICAgICAgQXBwbGljYXRpb25OYW1lcyxcbiAgICAgICAgICAgIElzUm9vdCxcbiAgICAgICAgICAgIE1vbml0b3IsXG4gICAgICAgICAgICBTY3JlZW5zaG90OiB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IGNvbnN0IEdldFBhbmVsU2NyZWVuc2hvdCA9IGFzeW5jIChQYW5lbDogRlBhbmVsKTogUHJvbWlzZTxzdHJpbmcgfCB1bmRlZmluZWQ+ID0+XG57XG4gICAgY29uc3QgU2NyZWVuc2hvdEJ1ZmZlcjogQnVmZmVyID1cbiAgICAgICAgYXdhaXQgRnMucmVhZEZpbGUoQ2FwdHVyZVNjcmVlblNlY3Rpb25Ub1RlbXBQbmdGaWxlKFBhbmVsLlNpemUpKTtcblxuICAgIHJldHVybiBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxcIiArIFNjcmVlbnNob3RCdWZmZXIudG9TdHJpbmcoXCJiYXNlNjRcIik7XG59O1xuXG5leHBvcnQgY29uc3QgTWFrZVNpemVzVW5pZm9ybSA9IChQYW5lbDogRlBhbmVsKTogdm9pZCA9Plxue1xuICAgIFBhbmVsLkNoaWxkcmVuLmZvckVhY2goKENoaWxkOiBGVmVydGV4LCBJbmRleDogbnVtYmVyKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKFBhbmVsLlR5cGUgPT09IFwiSG9yaXpvbnRhbFwiKVxuICAgICAgICB7XG4gICAgICAgICAgICBDaGlsZC5TaXplLldpZHRoID0gUGFuZWwuU2l6ZS5XaWR0aCAvIFBhbmVsLkNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgIENoaWxkLlNpemUuWCA9IFBhbmVsLlNpemUuWCArIEluZGV4ICogQ2hpbGQuU2l6ZS5XaWR0aDtcbiAgICAgICAgICAgIENoaWxkLlNpemUuSGVpZ2h0ID0gUGFuZWwuU2l6ZS5IZWlnaHQ7XG4gICAgICAgICAgICBDaGlsZC5TaXplLlkgPSBQYW5lbC5TaXplLlk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoUGFuZWwuVHlwZSA9PT0gXCJWZXJ0aWNhbFwiKVxuICAgICAgICB7XG4gICAgICAgICAgICBDaGlsZC5TaXplLkhlaWdodCA9IFBhbmVsLlNpemUuSGVpZ2h0IC8gUGFuZWwuQ2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICAgICAgQ2hpbGQuU2l6ZS5ZID0gUGFuZWwuU2l6ZS5ZICsgSW5kZXggKiBDaGlsZC5TaXplLkhlaWdodDtcbiAgICAgICAgICAgIENoaWxkLlNpemUuV2lkdGggPSBQYW5lbC5TaXplLldpZHRoO1xuICAgICAgICAgICAgQ2hpbGQuU2l6ZS5YID0gUGFuZWwuU2l6ZS5YO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgQnJpbmdJbnRvUGFuZWwgPSAoSW5QYW5lbDogRkFubm90YXRlZFBhbmVsKTogdm9pZCA9Plxue1xuICAgIGNvbnN0IEhhbmRsZTogSFdpbmRvdyB8IHVuZGVmaW5lZCA9IEdldEFjdGl2ZVdpbmRvdygpO1xuICAgIGlmIChIYW5kbGUgIT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBCcmluZ2luZ0ludG9QYW5lbDogJHsgR2V0V2luZG93VGl0bGUoSGFuZGxlKSB9LmApO1xuICAgICAgICBjb25zdCBQYW5lbDogRlBhbmVsIHwgdW5kZWZpbmVkID0gR2V0UGFuZWxGcm9tQW5ub3RhdGVkKEluUGFuZWwpO1xuICAgICAgICBpZiAoUGFuZWwgIT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJCcmluZ0ludG9QYW5lbDogUGFuZWxGcm9tQW5ub3RhdGVkIHdhcyBkZWZpbmVkIVwiKTtcbiAgICAgICAgICAgIGNvbnN0IE91dENlbGw6IEZDZWxsID0gQ2VsbChIYW5kbGUpO1xuICAgICAgICAgICAgUGFuZWwuQ2hpbGRyZW4ucHVzaChPdXRDZWxsKTtcbiAgICAgICAgICAgIE1ha2VTaXplc1VuaWZvcm0oUGFuZWwpO1xuICAgICAgICAgICAgUHVibGlzaCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJCcmluZ0ludG9QYW5lbDogUGFuZWxGcm9tQW5ub3RhdGVkIHdhcyBVTkRFRklORUQuXCIpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IEFyZVBhbmVsc0VxdWFsID0gKEE6IEZQYW5lbCB8IEZBbm5vdGF0ZWRQYW5lbCwgQjogRlBhbmVsIHwgRkFubm90YXRlZFBhbmVsKTogYm9vbGVhbiA9Plxue1xuICAgIHJldHVybiBBcmVCb3hlc0VxdWFsKEEuU2l6ZSwgQi5TaXplKTtcbn07XG5cbmV4cG9ydCBjb25zdCBGaW5kID0gKFByZWRpY2F0ZTogVFByZWRpY2F0ZTxGVmVydGV4Pik6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPT5cbntcbiAgICBsZXQgT3V0OiBGVmVydGV4IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gICAgVHJhdmVyc2UoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIGlmIChPdXQgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgU2F0aXNmaWVzOiBib29sZWFuID0gUHJlZGljYXRlKFZlcnRleCk7XG4gICAgICAgICAgICBpZiAoU2F0aXNmaWVzKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE91dCA9IFZlcnRleDtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIE91dDtcbn07XG5cbmV4cG9ydCBjb25zdCBJc1BhbmVsID0gKFZlcnRleDogRlZlcnRleCk6IFZlcnRleCBpcyBGUGFuZWwgPT5cbntcbiAgICByZXR1cm4gXCJDaGlsZHJlblwiIGluIFZlcnRleDtcbn07XG5cbmV4cG9ydCBjb25zdCBHZXRQYW5lbEZyb21Bbm5vdGF0ZWQgPSAoUGFuZWw6IEZBbm5vdGF0ZWRQYW5lbCk6IEZQYW5lbCB8IHVuZGVmaW5lZCA9Plxue1xuICAgIGNvbnN0IExvZ2dlZFBhbmVsOiBQYXJ0aWFsPEZQYW5lbD4gPVxuICAgIHtcbiAgICAgICAgU2l6ZTogUGFuZWwuU2l6ZSxcbiAgICAgICAgVHlwZTogUGFuZWwuVHlwZVxuICAgIH07XG5cbiAgICBjb25zb2xlLmxvZyhcIkJlZ2lucyBHZXRQYW5lbEZyb21Bbm5vdGF0ZWQsIFBhbmVsIGlzXCIsIExvZ2dlZFBhbmVsKTtcbiAgICByZXR1cm4gRmluZCgoVmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgaWYgKElzUGFuZWwoVmVydGV4KSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWZXJ0ZXggaXMgYSBwYW5lbC5cIiwgVmVydGV4KTtcbiAgICAgICAgICAgIGNvbnN0IEFyZUVxdWFsOiBib29sZWFuID0gQXJlUGFuZWxzRXF1YWwoUGFuZWwsIFZlcnRleCk7XG5cbiAgICAgICAgICAgIGlmIChBcmVFcXVhbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBhbmVscyBhcmUgZXF1YWxcIiwgUGFuZWwsIFZlcnRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYW5lbHMgYXJlIE5PVCBlcXVhbFwiLCBQYW5lbCwgVmVydGV4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEFyZUVxdWFsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWZXJ0ZXggd2FzIE5PVCBhIHBhbmVsXCIsIFZlcnRleCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KSBhcyBGUGFuZWwgfCB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgY29uc3QgUmVtb3ZlQW5ub3RhdGlvbnMgPSAoeyBDaGlsZHJlbiwgTW9uaXRvcklkLCBTaXplLCBUeXBlLCBaT3JkZXIgfTogRkFubm90YXRlZFBhbmVsKTogRlBhbmVsID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgQ2hpbGRyZW4sXG4gICAgICAgIE1vbml0b3JJZCxcbiAgICAgICAgU2l6ZSxcbiAgICAgICAgVHlwZSxcbiAgICAgICAgWk9yZGVyXG4gICAgfTtcbn07XG5cbkluaXRpYWxpemVUcmVlKCk7XG4iLCIvKiBGaWxlOiAgICAgIEtleWJvYXJkLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRktleUlkLCBGVmlydHVhbEtleSB9IGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5cbi8qIGVzbGludC1kaXNhYmxlIHNvcnQta2V5cyAqL1xuXG4vKiogRGV2ZWxvcGVyLWZyaWVuZGx5IG5hbWVzIG9mIGtleSBjb2Rlcy4gKi9cbmV4cG9ydCBjb25zdCBLZXlJZHNCeUlkOiBSZWFkb25seTxSZWNvcmQ8RlZpcnR1YWxLZXksIEZLZXlJZD4+ID1cbntcbiAgICAweDA1OiBcIk1vdXNlWDFcIixcbiAgICAweDA2OiBcIk1vdXNlWDJcIixcbiAgICAweDA4OiBcIkJhY2tzcGFjZVwiLFxuICAgIDB4MDk6IFwiVGFiXCIsXG4gICAgMHgwRDogXCJFbnRlclwiLFxuICAgIDB4MTA6IFwiU2hpZnRcIixcbiAgICAweDExOiBcIkN0cmxcIixcbiAgICAweDEyOiBcIkFsdFwiLFxuICAgIDB4MTM6IFwiUGF1c2VcIixcbiAgICAweDIwOiBcIlNwYWNlXCIsXG4gICAgMHgyMTogXCJQZ1VwXCIsXG4gICAgMHgyMjogXCJQZ0Rvd25cIixcbiAgICAweDIzOiBcIkVuZFwiLFxuICAgIDB4MjQ6IFwiSG9tZVwiLFxuICAgIDB4MjU6IFwiTGVmdEFycm93XCIsXG4gICAgMHgyNjogXCJVcEFycm93XCIsXG4gICAgMHgyNzogXCJSaWdodEFycm93XCIsXG4gICAgMHgyODogXCJEb3duQXJyb3dcIixcbiAgICAweDJEOiBcIkluc1wiLFxuICAgIDB4MkU6IFwiRGVsXCIsXG4gICAgMHgzMDogXCIwXCIsXG4gICAgMHgzMTogXCIxXCIsXG4gICAgMHgzMjogXCIyXCIsXG4gICAgMHgzMzogXCIzXCIsXG4gICAgMHgzNDogXCI0XCIsXG4gICAgMHgzNTogXCI1XCIsXG4gICAgMHgzNjogXCI2XCIsXG4gICAgMHgzNzogXCI3XCIsXG4gICAgMHgzODogXCI4XCIsXG4gICAgMHgzOTogXCI5XCIsXG4gICAgMHg0MTogXCJBXCIsXG4gICAgMHg0MjogXCJCXCIsXG4gICAgMHg0MzogXCJDXCIsXG4gICAgMHg0NDogXCJEXCIsXG4gICAgMHg0NTogXCJFXCIsXG4gICAgMHg0NjogXCJGXCIsXG4gICAgMHg0NzogXCJHXCIsXG4gICAgMHg0ODogXCJIXCIsXG4gICAgMHg0OTogXCJJXCIsXG4gICAgMHg0QTogXCJKXCIsXG4gICAgMHg0QjogXCJLXCIsXG4gICAgMHg0QzogXCJMXCIsXG4gICAgMHg0RDogXCJNXCIsXG4gICAgMHg0RTogXCJOXCIsXG4gICAgMHg0RjogXCJPXCIsXG4gICAgMHg1MDogXCJQXCIsXG4gICAgMHg1MTogXCJRXCIsXG4gICAgMHg1MjogXCJSXCIsXG4gICAgMHg1MzogXCJTXCIsXG4gICAgMHg1NDogXCJUXCIsXG4gICAgMHg1NTogXCJVXCIsXG4gICAgMHg1NjogXCJWXCIsXG4gICAgMHg1NzogXCJXXCIsXG4gICAgMHg1ODogXCJYXCIsXG4gICAgMHg1OTogXCJZXCIsXG4gICAgMHg1QTogXCJaXCIsXG4gICAgMHg1QjogXCJMV2luXCIsXG4gICAgMHg1QzogXCJSV2luXCIsXG4gICAgMHg1RDogXCJBcHBsaWNhdGlvbnNcIixcbiAgICAweDYwOiBcIk51bTBcIixcbiAgICAweDYxOiBcIk51bTFcIixcbiAgICAweDYyOiBcIk51bTJcIixcbiAgICAweDYzOiBcIk51bTNcIixcbiAgICAweDY0OiBcIk51bTRcIixcbiAgICAweDY1OiBcIk51bTVcIixcbiAgICAweDY2OiBcIk51bTZcIixcbiAgICAweDY3OiBcIk51bTdcIixcbiAgICAweDY4OiBcIk51bThcIixcbiAgICAweDY5OiBcIk51bTlcIixcbiAgICAweDZBOiBcIk11bHRpcGx5XCIsXG4gICAgMHg2QjogXCJBZGRcIixcbiAgICAweDZEOiBcIlN1YnRyYWN0XCIsXG4gICAgMHg2RTogXCJOdW1EZWNpbWFsXCIsXG4gICAgMHg2RjogXCJOdW1EaXZpZGVcIixcbiAgICAweDcwOiBcIkYxXCIsXG4gICAgMHg3MTogXCJGMlwiLFxuICAgIDB4NzI6IFwiRjNcIixcbiAgICAweDczOiBcIkY0XCIsXG4gICAgMHg3NDogXCJGNVwiLFxuICAgIDB4NzU6IFwiRjZcIixcbiAgICAweDc2OiBcIkY3XCIsXG4gICAgMHg3NzogXCJGOFwiLFxuICAgIDB4Nzg6IFwiRjlcIixcbiAgICAweDc5OiBcIkYxMFwiLFxuICAgIDB4N0E6IFwiRjExXCIsXG4gICAgMHg3QjogXCJGMTJcIixcbiAgICAweDdDOiBcIkYxM1wiLFxuICAgIDB4N0Q6IFwiRjE0XCIsXG4gICAgMHg3RTogXCJGMTVcIixcbiAgICAweDdGOiBcIkYxNlwiLFxuICAgIDB4ODA6IFwiRjE3XCIsXG4gICAgMHg4MTogXCJGMThcIixcbiAgICAweDgyOiBcIkYxOVwiLFxuICAgIDB4ODM6IFwiRjIwXCIsXG4gICAgMHg4NDogXCJGMjFcIixcbiAgICAweDg1OiBcIkYyMlwiLFxuICAgIDB4ODY6IFwiRjIzXCIsXG4gICAgMHg4NzogXCJGMjRcIixcbiAgICAweEEwOiBcIkxTaGlmdFwiLFxuICAgIDB4QTE6IFwiUlNoaWZ0XCIsXG4gICAgMHhBMjogXCJMQ3RybFwiLFxuICAgIDB4QTM6IFwiUkN0cmxcIixcbiAgICAweEE0OiBcIkxBbHRcIixcbiAgICAweEE1OiBcIlJBbHRcIixcbiAgICAweEE2OiBcIkJyb3dzZXJCYWNrXCIsXG4gICAgMHhBNzogXCJCcm93c2VyRm9yd2FyZFwiLFxuICAgIDB4QTg6IFwiQnJvd3NlclJlZnJlc2hcIixcbiAgICAweEE5OiBcIkJyb3dzZXJTdG9wXCIsXG4gICAgMHhBQTogXCJCcm93c2VyU2VhcmNoXCIsXG4gICAgMHhBQjogXCJCcm93c2VyRmF2b3JpdGVzXCIsXG4gICAgMHhBQzogXCJCcm93c2VyU3RhcnRcIixcbiAgICAweEIwOiBcIk5leHRUcmFja1wiLFxuICAgIDB4QjE6IFwiUHJldmlvdXNUcmFja1wiLFxuICAgIDB4QjI6IFwiU3RvcE1lZGlhXCIsXG4gICAgMHhCMzogXCJQbGF5UGF1c2VNZWRpYVwiLFxuICAgIDB4QjQ6IFwiU3RhcnRNYWlsXCIsXG4gICAgMHhCNTogXCJTZWxlY3RNZWRpYVwiLFxuICAgIDB4QjY6IFwiU3RhcnRBcHBsaWNhdGlvbk9uZVwiLFxuICAgIDB4Qjc6IFwiU3RhcnRBcHBsaWNhdGlvblR3b1wiLFxuICAgIDB4QkE6IFwiO1wiLFxuICAgIDB4QkI6IFwiK1wiLFxuICAgIDB4QkM6IFwiLFwiLFxuICAgIDB4QkQ6IFwiLVwiLFxuICAgIDB4QkU6IFwiLlwiLFxuICAgIDB4QkY6IFwiL1wiLFxuICAgIDB4QzA6IFwiYFwiLFxuICAgIDB4REI6IFwiW1wiLFxuICAgIDB4REM6IFwiXFxcXFwiLFxuICAgIDB4REQ6IFwiXVwiLFxuICAgIDB4REU6IFwiJ1wiXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgR2V0S2V5TmFtZSA9IChWa0NvZGU6IEZWaXJ0dWFsS2V5KTogRktleUlkID0+XG57XG4gICAgcmV0dXJuIEtleUlkc0J5SWRbVmtDb2RlXTtcbn07XG5cbi8qKiBEZXZlbG9wZXItZnJpZW5kbHkgbmFtZXMgb2Yga2V5IGNvZGVzLiAqL1xuZXhwb3J0IGNvbnN0IFZrOiBSZWFkb25seTxSZWNvcmQ8RktleUlkLCBGVmlydHVhbEtleT4+ID1cbntcbiAgICBNb3VzZVgxOiAweDA1LFxuICAgIE1vdXNlWDI6IDB4MDYsXG4gICAgQmFja3NwYWNlOiAweDA4LFxuICAgIFRhYjogMHgwOSxcbiAgICBFbnRlcjogMHgwRCxcbiAgICBTaGlmdDogMHgxMCxcbiAgICBDdHJsOiAweDExLFxuICAgIEFsdDogMHgxMixcbiAgICBQYXVzZTogMHgxMyxcbiAgICBTcGFjZTogMHgyMCxcbiAgICBQZ1VwOiAweDIxLFxuICAgIFBnRG93bjogMHgyMixcbiAgICBFbmQ6IDB4MjMsXG4gICAgSG9tZTogMHgyNCxcbiAgICBMZWZ0QXJyb3c6IDB4MjUsXG4gICAgVXBBcnJvdzogMHgyNixcbiAgICBSaWdodEFycm93OiAweDI3LFxuICAgIERvd25BcnJvdzogMHgyOCxcbiAgICBJbnM6IDB4MkQsXG4gICAgRGVsOiAweDJFLFxuICAgIDA6IDB4MzAsXG4gICAgMTogMHgzMSxcbiAgICAyOiAweDMyLFxuICAgIDM6IDB4MzMsXG4gICAgNDogMHgzNCxcbiAgICA1OiAweDM1LFxuICAgIDY6IDB4MzYsXG4gICAgNzogMHgzNyxcbiAgICA4OiAweDM4LFxuICAgIDk6IDB4MzksXG4gICAgQTogMHg0MSxcbiAgICBCOiAweDQyLFxuICAgIEM6IDB4NDMsXG4gICAgRDogMHg0NCxcbiAgICBFOiAweDQ1LFxuICAgIEY6IDB4NDYsXG4gICAgRzogMHg0NyxcbiAgICBIOiAweDQ4LFxuICAgIEk6IDB4NDksXG4gICAgSjogMHg0QSxcbiAgICBLOiAweDRCLFxuICAgIEw6IDB4NEMsXG4gICAgTTogMHg0RCxcbiAgICBOOiAweDRFLFxuICAgIE86IDB4NEYsXG4gICAgUDogMHg1MCxcbiAgICBROiAweDUxLFxuICAgIFI6IDB4NTIsXG4gICAgUzogMHg1MyxcbiAgICBUOiAweDU0LFxuICAgIFU6IDB4NTUsXG4gICAgVjogMHg1NixcbiAgICBXOiAweDU3LFxuICAgIFg6IDB4NTgsXG4gICAgWTogMHg1OSxcbiAgICBaOiAweDVBLFxuICAgIExXaW46IDB4NUIsXG4gICAgUldpbjogMHg1QyxcbiAgICBBcHBsaWNhdGlvbnM6IDB4NUQsXG4gICAgTnVtMDogMHg2MCxcbiAgICBOdW0xOiAweDYxLFxuICAgIE51bTI6IDB4NjIsXG4gICAgTnVtMzogMHg2MyxcbiAgICBOdW00OiAweDY0LFxuICAgIE51bTU6IDB4NjUsXG4gICAgTnVtNjogMHg2NixcbiAgICBOdW03OiAweDY3LFxuICAgIE51bTg6IDB4NjgsXG4gICAgTnVtOTogMHg2OSxcbiAgICBNdWx0aXBseTogMHg2QSxcbiAgICBBZGQ6IDB4NkIsXG4gICAgU3VidHJhY3Q6IDB4NkQsXG4gICAgTnVtRGVjaW1hbDogMHg2RSxcbiAgICBOdW1EaXZpZGU6IDB4NkYsXG4gICAgRjE6IDB4NzAsXG4gICAgRjI6IDB4NzEsXG4gICAgRjM6IDB4NzIsXG4gICAgRjQ6IDB4NzMsXG4gICAgRjU6IDB4NzQsXG4gICAgRjY6IDB4NzUsXG4gICAgRjc6IDB4NzYsXG4gICAgRjg6IDB4NzcsXG4gICAgRjk6IDB4NzgsXG4gICAgRjEwOiAweDc5LFxuICAgIEYxMTogMHg3QSxcbiAgICBGMTI6IDB4N0IsXG4gICAgRjEzOiAweDdDLFxuICAgIEYxNDogMHg3RCxcbiAgICBGMTU6IDB4N0UsXG4gICAgRjE2OiAweDdGLFxuICAgIEYxNzogMHg4MCxcbiAgICBGMTg6IDB4ODEsXG4gICAgRjE5OiAweDgyLFxuICAgIEYyMDogMHg4MyxcbiAgICBGMjE6IDB4ODQsXG4gICAgRjIyOiAweDg1LFxuICAgIEYyMzogMHg4NixcbiAgICBGMjQ6IDB4ODcsXG4gICAgTFNoaWZ0OiAweEEwLFxuICAgIFJTaGlmdDogMHhBMSxcbiAgICBMQ3RybDogMHhBMixcbiAgICBSQ3RybDogMHhBMyxcbiAgICBMQWx0OiAweEE0LFxuICAgIFJBbHQ6IDB4QTUsXG4gICAgQnJvd3NlckJhY2s6IDB4QTYsXG4gICAgQnJvd3NlckZvcndhcmQ6IDB4QTcsXG4gICAgQnJvd3NlclJlZnJlc2g6IDB4QTgsXG4gICAgQnJvd3NlclN0b3A6IDB4QTksXG4gICAgQnJvd3NlclNlYXJjaDogMHhBQSxcbiAgICBCcm93c2VyRmF2b3JpdGVzOiAweEFCLFxuICAgIEJyb3dzZXJTdGFydDogMHhBQyxcbiAgICBOZXh0VHJhY2s6IDB4QjAsXG4gICAgUHJldmlvdXNUcmFjazogMHhCMSxcbiAgICBTdG9wTWVkaWE6IDB4QjIsXG4gICAgUGxheVBhdXNlTWVkaWE6IDB4QjMsXG4gICAgU3RhcnRNYWlsOiAweEI0LFxuICAgIFNlbGVjdE1lZGlhOiAweEI1LFxuICAgIFN0YXJ0QXBwbGljYXRpb25PbmU6IDB4QjYsXG4gICAgU3RhcnRBcHBsaWNhdGlvblR3bzogMHhCNyxcbiAgICBcIjtcIjogMHhCQSxcbiAgICBcIitcIjogMHhCQixcbiAgICBcIixcIjogMHhCQyxcbiAgICBcIi1cIjogMHhCRCxcbiAgICBcIi5cIjogMHhCRSxcbiAgICBcIi9cIjogMHhCRixcbiAgICBcImBcIjogMHhDMCxcbiAgICBcIltcIjogMHhEQixcbiAgICBcIlxcXFxcIjogMHhEQyxcbiAgICBcIl1cIjogMHhERCxcbiAgICBcIidcIjogMHhERVxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IFZpcnR1YWxLZXlzOiBSZWFkb25seTxBcnJheTxGVmlydHVhbEtleT4+ID1cbltcbiAgICAweDA1LFxuICAgIDB4MDYsXG4gICAgMHgwOCxcbiAgICAweDA5LFxuICAgIDB4MEQsXG4gICAgMHgxMCxcbiAgICAweDExLFxuICAgIDB4MTIsXG4gICAgMHgxMyxcbiAgICAweDIwLFxuICAgIDB4MjEsXG4gICAgMHgyMixcbiAgICAweDIzLFxuICAgIDB4MjQsXG4gICAgMHgyNSxcbiAgICAweDI2LFxuICAgIDB4MjcsXG4gICAgMHgyOCxcbiAgICAweDJELFxuICAgIDB4MkUsXG4gICAgMHgzMCxcbiAgICAweDMxLFxuICAgIDB4MzIsXG4gICAgMHgzMyxcbiAgICAweDM0LFxuICAgIDB4MzUsXG4gICAgMHgzNixcbiAgICAweDM3LFxuICAgIDB4MzgsXG4gICAgMHgzOSxcbiAgICAweDQxLFxuICAgIDB4NDIsXG4gICAgMHg0MyxcbiAgICAweDQ0LFxuICAgIDB4NDUsXG4gICAgMHg0NixcbiAgICAweDQ3LFxuICAgIDB4NDgsXG4gICAgMHg0OSxcbiAgICAweDRBLFxuICAgIDB4NEIsXG4gICAgMHg0QyxcbiAgICAweDRELFxuICAgIDB4NEUsXG4gICAgMHg0RixcbiAgICAweDUwLFxuICAgIDB4NTEsXG4gICAgMHg1MixcbiAgICAweDUzLFxuICAgIDB4NTQsXG4gICAgMHg1NSxcbiAgICAweDU2LFxuICAgIDB4NTcsXG4gICAgMHg1OCxcbiAgICAweDU5LFxuICAgIDB4NUEsXG4gICAgMHg1QixcbiAgICAweDVDLFxuICAgIDB4NUQsXG4gICAgMHg2MCxcbiAgICAweDYxLFxuICAgIDB4NjIsXG4gICAgMHg2MyxcbiAgICAweDY0LFxuICAgIDB4NjUsXG4gICAgMHg2NixcbiAgICAweDY3LFxuICAgIDB4NjgsXG4gICAgMHg2OSxcbiAgICAweDZBLFxuICAgIDB4NkIsXG4gICAgMHg2RCxcbiAgICAweDZFLFxuICAgIDB4NkYsXG4gICAgMHg3MCxcbiAgICAweDcxLFxuICAgIDB4NzIsXG4gICAgMHg3MyxcbiAgICAweDc0LFxuICAgIDB4NzUsXG4gICAgMHg3NixcbiAgICAweDc3LFxuICAgIDB4NzgsXG4gICAgMHg3OSxcbiAgICAweDdBLFxuICAgIDB4N0IsXG4gICAgMHg3QyxcbiAgICAweDdELFxuICAgIDB4N0UsXG4gICAgMHg3RixcbiAgICAweDgwLFxuICAgIDB4ODEsXG4gICAgMHg4MixcbiAgICAweDgzLFxuICAgIDB4ODQsXG4gICAgMHg4NSxcbiAgICAweDg2LFxuICAgIDB4ODcsXG4gICAgMHhBMCxcbiAgICAweEExLFxuICAgIDB4QTIsXG4gICAgMHhBMyxcbiAgICAweEE0LFxuICAgIDB4QTUsXG4gICAgMHhBNixcbiAgICAweEE3LFxuICAgIDB4QTgsXG4gICAgMHhBOSxcbiAgICAweEFBLFxuICAgIDB4QUIsXG4gICAgMHhBQyxcbiAgICAweEIwLFxuICAgIDB4QjEsXG4gICAgMHhCMixcbiAgICAweEIzLFxuICAgIDB4QjQsXG4gICAgMHhCNSxcbiAgICAweEI2LFxuICAgIDB4QjcsXG4gICAgMHhCQSxcbiAgICAweEJCLFxuICAgIDB4QkMsXG4gICAgMHhCRCxcbiAgICAweEJFLFxuICAgIDB4QkYsXG4gICAgMHhDMCxcbiAgICAweERCLFxuICAgIDB4REMsXG4gICAgMHhERCxcbiAgICAweERFXG5dIGFzIGNvbnN0O1xuXG4vKiBlc2xpbnQtZW5hYmxlIHNvcnQta2V5cyAqL1xuXG4vKiogSXMgdGhlIGBLZXlDb2RlYCBhIFZLIENvZGUgKip0aGF0IHRoaXMgYXBwIHVzZXMqKi4gKi9cbmV4cG9ydCBjb25zdCBJc1ZpcnR1YWxLZXkgPSAoS2V5Q29kZTogbnVtYmVyKTogS2V5Q29kZSBpcyBGVmlydHVhbEtleSA9Plxue1xuICAgIHJldHVybiBWaXJ0dWFsS2V5cy5pbmNsdWRlcyhLZXlDb2RlIGFzIEZWaXJ0dWFsS2V5KTtcbn07XG4iLCJ2YXIgbXlNb2R1bGUgPSByZXF1aXJlKFwiYmluZGluZ3NcIikoXCJoZWxsb1wiKTtcbm1vZHVsZS5leHBvcnRzID0gbXlNb2R1bGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhc3NlcnRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYnVmZmVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNoaWxkX3Byb2Nlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29uc3RhbnRzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJldmVudHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInF1ZXJ5c3RyaW5nXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInN0cmVhbVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdHJpbmdfZGVjb2RlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0dHlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXJsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV0aWxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiemxpYlwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuLy8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbl9fd2VicGFja19yZXF1aXJlX18uYyA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmYgPSB7fTtcbi8vIFRoaXMgZmlsZSBjb250YWlucyBvbmx5IHRoZSBlbnRyeSBjaHVuay5cbi8vIFRoZSBjaHVuayBsb2FkaW5nIGZ1bmN0aW9uIGZvciBhZGRpdGlvbmFsIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5lID0gKGNodW5rSWQpID0+IHtcblx0cmV0dXJuIFByb21pc2UuYWxsKE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uZikucmVkdWNlKChwcm9taXNlcywga2V5KSA9PiB7XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5mW2tleV0oY2h1bmtJZCwgcHJvbWlzZXMpO1xuXHRcdHJldHVybiBwcm9taXNlcztcblx0fSwgW10pKTtcbn07IiwiLy8gVGhpcyBmdW5jdGlvbiBhbGxvdyB0byByZWZlcmVuY2UgYXN5bmMgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnUgPSAoY2h1bmtJZCkgPT4ge1xuXHQvLyByZXR1cm4gdXJsIGZvciBmaWxlbmFtZXMgYmFzZWQgb24gdGVtcGxhdGVcblx0cmV0dXJuIFwiXCIgKyBjaHVua0lkICsgXCIuYnVuZGxlLmRldi5qc1wiO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBjaHVua3Ncbi8vIFwiMVwiIG1lYW5zIFwibG9hZGVkXCIsIG90aGVyd2lzZSBub3QgbG9hZGVkIHlldFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDFcbn07XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxudmFyIGluc3RhbGxDaHVuayA9IChjaHVuaykgPT4ge1xuXHR2YXIgbW9yZU1vZHVsZXMgPSBjaHVuay5tb2R1bGVzLCBjaHVua0lkcyA9IGNodW5rLmlkcywgcnVudGltZSA9IGNodW5rLnJ1bnRpbWU7XG5cdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHR9XG5cdH1cblx0aWYocnVudGltZSkgcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAxO1xuXG59O1xuXG4vLyByZXF1aXJlKCkgY2h1bmsgbG9hZGluZyBmb3IgamF2YXNjcmlwdFxuX193ZWJwYWNrX3JlcXVpcmVfXy5mLnJlcXVpcmUgPSAoY2h1bmtJZCwgcHJvbWlzZXMpID0+IHtcblx0Ly8gXCIxXCIgaXMgdGhlIHNpZ25hbCBmb3IgXCJhbHJlYWR5IGxvYWRlZFwiXG5cdGlmKCFpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRpZih0cnVlKSB7IC8vIGFsbCBjaHVua3MgaGF2ZSBKU1xuXHRcdFx0aW5zdGFsbENodW5rKHJlcXVpcmUoXCIuL1wiICsgX193ZWJwYWNrX3JlcXVpcmVfXy51KGNodW5rSWQpKSk7XG5cdFx0fSBlbHNlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDE7XG5cdH1cbn07XG5cbi8vIG5vIGV4dGVybmFsIGluc3RhbGwgY2h1bmtcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdCIsIiIsIi8vIG1vZHVsZSBjYWNoZSBhcmUgdXNlZCBzbyBlbnRyeSBpbmxpbmluZyBpcyBkaXNhYmxlZFxuLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL1NvdXJjZS9NYWluL01haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=