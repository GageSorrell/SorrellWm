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
/* harmony import */ var _Tree__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Tree */ "./Source/Main/Tree.ts");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sorrellwm/windows */ "./Windows/index.js");
/* harmony import */ var _sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Keyboard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Keyboard */ "./Source/Main/Keyboard.ts");
/* harmony import */ var _Development__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Development */ "./Source/Main/Development/index.ts");
/* harmony import */ var _Core_Utility__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Core/Utility */ "./Source/Main/Core/Utility.ts");
/* harmony import */ var _Domain_Common_Component_Keyboard_Keyboard__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/Domain/Common/Component/Keyboard/Keyboard */ "./Source/Renderer/Domain/Common/Component/Keyboard/Keyboard.ts");
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! chalk */ "./node_modules/chalk/source/index.js");
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(chalk__WEBPACK_IMPORTED_MODULE_8__);
/* File:    MainWindow.ts
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */









let MainWindow = undefined;
const GetLeastInvisiblePosition = () => {
    const Displays = electron__WEBPACK_IMPORTED_MODULE_3__.screen.getAllDisplays();
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
    MainWindow = new electron__WEBPACK_IMPORTED_MODULE_3__.BrowserWindow({
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
            preload: electron__WEBPACK_IMPORTED_MODULE_3__.app.isPackaged
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
    electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.on("GetAnnotatedPanels", async (_Event, ..._Arguments) => {
        const Panels = (0,_Tree__WEBPACK_IMPORTED_MODULE_1__.GetPanels)();
        const AnnotatedPanels = (await Promise.all(Panels.map(_Tree__WEBPACK_IMPORTED_MODULE_1__.AnnotatePanel)))
            .filter((Value) => {
            return Value !== undefined;
        });
        MainWindow?.webContents.send("GetAnnotatedPanels", AnnotatedPanels);
    });
    /** @TODO Find better place for this. */
    electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.on("GetPanelScreenshots", async (_Event, ..._Arguments) => {
        const Panels = (0,_Tree__WEBPACK_IMPORTED_MODULE_1__.GetPanels)();
        const Screenshots = (await Promise.all(Panels.map(_Tree__WEBPACK_IMPORTED_MODULE_1__.GetPanelScreenshot)))
            .filter((Value) => {
            return Value !== undefined;
        });
        MainWindow?.webContents.send("GetPanelScreenshots", Screenshots);
    });
    electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.on("BringIntoPanel", async (_Event, ...Arguments) => {
        // Log("BringIntoPanel", Arguments[0]);
        console.log("BringIntoPanel !! !!", ...Arguments);
        (0,_Tree__WEBPACK_IMPORTED_MODULE_1__.BringIntoPanel)(Arguments[0]);
    });
    electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.on("TearDown", async (_Event, ..._Arguments) => {
        ActiveWindow = undefined;
        (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.UnblurBackground)();
    });
    electron__WEBPACK_IMPORTED_MODULE_3__.ipcMain.on("Log", async (_Event, ...Arguments) => {
        const StringifiedArguments = Arguments
            .map((Argument) => {
            return typeof Argument === "string"
                ? Argument
                : JSON.stringify(Argument);
        })
            .join();
        const Birdie = chalk__WEBPACK_IMPORTED_MODULE_8___default().bgMagenta(" ⚛️ ") + " ";
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
    MainWindow.loadURL((0,_Core_Utility__WEBPACK_IMPORTED_MODULE_6__.ResolveHtmlPath)("index.html"));
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
    const ActivationKey = _Domain_Common_Component_Keyboard_Keyboard__WEBPACK_IMPORTED_MODULE_7__.Vk["F24"];
    if (VkCode === ActivationKey) {
        if (State === "Down") {
            if ((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.GetWindowTitle)((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.GetFocusedWindow)()) !== "SorrellWm Main Window") {
                ActiveWindow = (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.GetFocusedWindow)();
                const IsTiled = (0,_Tree__WEBPACK_IMPORTED_MODULE_1__.IsWindowTiled)((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.GetFocusedWindow)());
                (0,_Development__WEBPACK_IMPORTED_MODULE_5__.Log)(`Focused Window of IsTiled call is ${(0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.GetWindowTitle)((0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.GetFocusedWindow)())}.`);
                MainWindow.webContents.send("Navigate", "", { IsTiled });
                (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.BlurBackground)();
            }
        }
        else {
            (0,_sorrellwm_windows__WEBPACK_IMPORTED_MODULE_2__.UnblurBackground)();
        }
    }
    else {
        MainWindow.webContents.send("Keyboard", Event);
    }
}
electron__WEBPACK_IMPORTED_MODULE_3__.app.whenReady()
    .then(LaunchMainWindow)
    .catch(console.log);
_Keyboard__WEBPACK_IMPORTED_MODULE_4__.Keyboard.Subscribe(OnKey);


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLDhCQUE4Qjs7QUFFOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsUUFBUSxRQUFRO0FBQ2xDLGtCQUFrQixRQUFRLFFBQVE7QUFDbEMsa0JBQWtCLFFBQVEsT0FBTztBQUNqQyxrQkFBa0IsUUFBUSxPQUFPO0FBQ2pDLGtCQUFrQixRQUFRLE9BQU87QUFDakMsa0JBQWtCLFFBQVEsT0FBTztBQUNqQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwRUFBMEU7O0FBRTFFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpREFBaUQsRUFBRSxVQUFVLEVBQUU7QUFDL0Q7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDdEpBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVLDZDQUFtQjs7QUFFN0I7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLFFBQVE7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDakVhOztBQUViO0FBQ0E7QUFDQTtB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SUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxNQUFNO0lBQ1osSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsVUFBVTtJQUNoQixJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxVQUFVO0lBQ2hCLElBQUksRUFBRSxZQUFZO0lBQ2xCLElBQUksRUFBRSxXQUFXO0lBQ2pCLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxLQUFLO0lBQ1gsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsS0FBSztJQUNYLElBQUksRUFBRSxRQUFRO0lBQ2QsSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsT0FBTztJQUNiLElBQUksRUFBRSxPQUFPO0lBQ2IsSUFBSSxFQUFFLE1BQU07SUFDWixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxhQUFhO0lBQ25CLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsSUFBSSxFQUFFLGdCQUFnQjtJQUN0QixJQUFJLEVBQUUsYUFBYTtJQUNuQixJQUFJLEVBQUUsZUFBZTtJQUNyQixJQUFJLEVBQUUsa0JBQWtCO0lBQ3hCLElBQUksRUFBRSxjQUFjO0lBQ3BCLElBQUksRUFBRSxXQUFXO0lBQ2pCLElBQUksRUFBRSxlQUFlO0lBQ3JCLElBQUksRUFBRSxXQUFXO0lBQ2pCLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsSUFBSSxFQUFFLFdBQVc7SUFDakIsSUFBSSxFQUFFLGFBQWE7SUFDbkIsSUFBSSxFQUFFLHFCQUFxQjtJQUMzQixJQUFJLEVBQUUscUJBQXFCO0lBQzNCLElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsR0FBRztJQUNULElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7Q0FDSCxDQUFDO0FBRUosTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFtQixFQUFVLEVBQUU7SUFFdEQsT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFDO0FBRUYsNkNBQTZDO0FBQ3RDLE1BQU0sRUFBRSxHQUNmO0lBQ0ksT0FBTyxFQUFFLElBQUk7SUFDYixPQUFPLEVBQUUsSUFBSTtJQUNiLFNBQVMsRUFBRSxJQUFJO0lBQ2YsR0FBRyxFQUFFLElBQUk7SUFDVCxLQUFLLEVBQUUsSUFBSTtJQUNYLEtBQUssRUFBRSxJQUFJO0lBQ1gsSUFBSSxFQUFFLElBQUk7SUFDVixHQUFHLEVBQUUsSUFBSTtJQUNULEtBQUssRUFBRSxJQUFJO0lBQ1gsS0FBSyxFQUFFLElBQUk7SUFDWCxJQUFJLEVBQUUsSUFBSTtJQUNWLE1BQU0sRUFBRSxJQUFJO0lBQ1osR0FBRyxFQUFFLElBQUk7SUFDVCxJQUFJLEVBQUUsSUFBSTtJQUNWLFNBQVMsRUFBRSxJQUFJO0lBQ2YsT0FBTyxFQUFFLElBQUk7SUFDYixVQUFVLEVBQUUsSUFBSTtJQUNoQixTQUFTLEVBQUUsSUFBSTtJQUNmLEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxDQUFDLEVBQUUsSUFBSTtJQUNQLENBQUMsRUFBRSxJQUFJO0lBQ1AsQ0FBQyxFQUFFLElBQUk7SUFDUCxJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsWUFBWSxFQUFFLElBQUk7SUFDbEIsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLElBQUksRUFBRSxJQUFJO0lBQ1YsSUFBSSxFQUFFLElBQUk7SUFDVixRQUFRLEVBQUUsSUFBSTtJQUNkLEdBQUcsRUFBRSxJQUFJO0lBQ1QsUUFBUSxFQUFFLElBQUk7SUFDZCxVQUFVLEVBQUUsSUFBSTtJQUNoQixTQUFTLEVBQUUsSUFBSTtJQUNmLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEVBQUUsRUFBRSxJQUFJO0lBQ1IsRUFBRSxFQUFFLElBQUk7SUFDUixFQUFFLEVBQUUsSUFBSTtJQUNSLEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULE1BQU0sRUFBRSxJQUFJO0lBQ1osTUFBTSxFQUFFLElBQUk7SUFDWixLQUFLLEVBQUUsSUFBSTtJQUNYLEtBQUssRUFBRSxJQUFJO0lBQ1gsSUFBSSxFQUFFLElBQUk7SUFDVixJQUFJLEVBQUUsSUFBSTtJQUNWLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLGFBQWEsRUFBRSxJQUFJO0lBQ25CLGdCQUFnQixFQUFFLElBQUk7SUFDdEIsWUFBWSxFQUFFLElBQUk7SUFDbEIsU0FBUyxFQUFFLElBQUk7SUFDZixhQUFhLEVBQUUsSUFBSTtJQUNuQixTQUFTLEVBQUUsSUFBSTtJQUNmLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFNBQVMsRUFBRSxJQUFJO0lBQ2YsV0FBVyxFQUFFLElBQUk7SUFDakIsbUJBQW1CLEVBQUUsSUFBSTtJQUN6QixtQkFBbUIsRUFBRSxJQUFJO0lBQ3pCLEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxHQUFHLEVBQUUsSUFBSTtJQUNULEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7SUFDVCxJQUFJLEVBQUUsSUFBSTtJQUNWLEdBQUcsRUFBRSxJQUFJO0lBQ1QsR0FBRyxFQUFFLElBQUk7Q0FDSCxDQUFDO0FBRUosTUFBTSxXQUFXLEdBQ3hCO0lBQ0ksSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtJQUNKLElBQUk7SUFDSixJQUFJO0lBQ0osSUFBSTtDQUNFLENBQUM7QUFFWCw2QkFBNkI7QUFFN0IseURBQXlEO0FBQ2xELE1BQU0sWUFBWSxHQUFHLENBQUMsT0FBZSxFQUEwQixFQUFFO0lBRXBFLE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFzQixDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7O0FDemFGLElBQUksUUFBUSxHQUFHLG1CQUFPLENBQUMscURBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDOzs7Ozs7Ozs7Ozs7QUNEMUI7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDL0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFQUFFO1dBQ0Y7Ozs7O1dDUkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NKQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NKQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQkFBZ0IscUJBQXFCO1dBQ3JDOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsYUFBYTtXQUNiO1dBQ0EsSUFBSTtXQUNKO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7Ozs7O1VFckNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9ub2RlX21vZHVsZXMvYW5zaS1zdHlsZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vbm9kZV9tb2R1bGVzL2JpbmRpbmdzL2JpbmRpbmdzLmpzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL25vZGVfbW9kdWxlcy9jaGFsay9zb3VyY2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vbm9kZV9tb2R1bGVzL2NoYWxrL3NvdXJjZS90ZW1wbGF0ZXMuanMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vbm9kZV9tb2R1bGVzL2NoYWxrL3NvdXJjZS91dGlsLmpzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL25vZGVfbW9kdWxlcy9jb2xvci1jb252ZXJ0L2NvbnZlcnNpb25zLmpzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL25vZGVfbW9kdWxlcy9jb2xvci1jb252ZXJ0L2luZGV4LmpzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL25vZGVfbW9kdWxlcy9jb2xvci1jb252ZXJ0L3JvdXRlLmpzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL25vZGVfbW9kdWxlcy9jb2xvci1uYW1lL2luZGV4LmpzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL25vZGVfbW9kdWxlcy9maWxlLXVyaS10by1wYXRoL2luZGV4LmpzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL25vZGVfbW9kdWxlcy9oYXMtZmxhZy9pbmRleC5qcyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9ub2RlX21vZHVsZXMvc3VwcG9ydHMtY29sb3IvaW5kZXguanMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vQ29yZS9TaWRlRWZmZWN0cy50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9Db3JlL1V0aWxpdHkudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vRGV2ZWxvcG1lbnQvTG9nLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0RldmVsb3BtZW50L2luZGV4LnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL0Rpc3BhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vSG9vay50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9LZXlib2FyZC50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9NYWluLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL01haW5XaW5kb3cudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vTWVzc2FnZUxvb3AudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL01haW4vTW9uaXRvci50cyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vLi9Tb3VyY2UvTWFpbi9Ob2RlSXBjLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1NvdXJjZS9NYWluL1RyZWUudHMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtLy4vU291cmNlL1JlbmRlcmVyL0RvbWFpbi9Db21tb24vQ29tcG9uZW50L0tleWJvYXJkL0tleWJvYXJkLnRzIiwid2VicGFjazovL1NvcnJlbGxXbS8uL1dpbmRvd3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJhc3NlcnRcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImJ1ZmZlclwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiY2hpbGRfcHJvY2Vzc1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiY29uc3RhbnRzXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJjcnlwdG9cIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJldmVudHNcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImZzXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJodHRwc1wiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwib3NcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInBhdGhcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInF1ZXJ5c3RyaW5nXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJzdHJlYW1cIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInN0cmluZ19kZWNvZGVyXCIiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJ0dHlcIiIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInVybFwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwidXRpbFwiIiwid2VicGFjazovL1NvcnJlbGxXbS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiemxpYlwiIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ydW50aW1lL2Vuc3VyZSBjaHVuayIsIndlYnBhY2s6Ly9Tb3JyZWxsV20vd2VicGFjay9ydW50aW1lL2dldCBqYXZhc2NyaXB0IGNodW5rIGZpbGVuYW1lIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3J1bnRpbWUvcmVxdWlyZSBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL1NvcnJlbGxXbS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vU29ycmVsbFdtL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoZ2xvYmFsLCAoKSA9PiB7XG5yZXR1cm4gIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB3cmFwQW5zaTE2ID0gKGZuLCBvZmZzZXQpID0+ICguLi5hcmdzKSA9PiB7XG5cdGNvbnN0IGNvZGUgPSBmbiguLi5hcmdzKTtcblx0cmV0dXJuIGBcXHUwMDFCWyR7Y29kZSArIG9mZnNldH1tYDtcbn07XG5cbmNvbnN0IHdyYXBBbnNpMjU2ID0gKGZuLCBvZmZzZXQpID0+ICguLi5hcmdzKSA9PiB7XG5cdGNvbnN0IGNvZGUgPSBmbiguLi5hcmdzKTtcblx0cmV0dXJuIGBcXHUwMDFCWyR7MzggKyBvZmZzZXR9OzU7JHtjb2RlfW1gO1xufTtcblxuY29uc3Qgd3JhcEFuc2kxNm0gPSAoZm4sIG9mZnNldCkgPT4gKC4uLmFyZ3MpID0+IHtcblx0Y29uc3QgcmdiID0gZm4oLi4uYXJncyk7XG5cdHJldHVybiBgXFx1MDAxQlskezM4ICsgb2Zmc2V0fTsyOyR7cmdiWzBdfTske3JnYlsxXX07JHtyZ2JbMl19bWA7XG59O1xuXG5jb25zdCBhbnNpMmFuc2kgPSBuID0+IG47XG5jb25zdCByZ2IycmdiID0gKHIsIGcsIGIpID0+IFtyLCBnLCBiXTtcblxuY29uc3Qgc2V0TGF6eVByb3BlcnR5ID0gKG9iamVjdCwgcHJvcGVydHksIGdldCkgPT4ge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwge1xuXHRcdGdldDogKCkgPT4ge1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBnZXQoKTtcblxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHksIHtcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdH0pO1xufTtcblxuLyoqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCdjb2xvci1jb252ZXJ0Jyl9ICovXG5sZXQgY29sb3JDb252ZXJ0O1xuY29uc3QgbWFrZUR5bmFtaWNTdHlsZXMgPSAod3JhcCwgdGFyZ2V0U3BhY2UsIGlkZW50aXR5LCBpc0JhY2tncm91bmQpID0+IHtcblx0aWYgKGNvbG9yQ29udmVydCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0Y29sb3JDb252ZXJ0ID0gcmVxdWlyZSgnY29sb3ItY29udmVydCcpO1xuXHR9XG5cblx0Y29uc3Qgb2Zmc2V0ID0gaXNCYWNrZ3JvdW5kID8gMTAgOiAwO1xuXHRjb25zdCBzdHlsZXMgPSB7fTtcblxuXHRmb3IgKGNvbnN0IFtzb3VyY2VTcGFjZSwgc3VpdGVdIG9mIE9iamVjdC5lbnRyaWVzKGNvbG9yQ29udmVydCkpIHtcblx0XHRjb25zdCBuYW1lID0gc291cmNlU3BhY2UgPT09ICdhbnNpMTYnID8gJ2Fuc2knIDogc291cmNlU3BhY2U7XG5cdFx0aWYgKHNvdXJjZVNwYWNlID09PSB0YXJnZXRTcGFjZSkge1xuXHRcdFx0c3R5bGVzW25hbWVdID0gd3JhcChpZGVudGl0eSwgb2Zmc2V0KTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBzdWl0ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdHN0eWxlc1tuYW1lXSA9IHdyYXAoc3VpdGVbdGFyZ2V0U3BhY2VdLCBvZmZzZXQpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBzdHlsZXM7XG59O1xuXG5mdW5jdGlvbiBhc3NlbWJsZVN0eWxlcygpIHtcblx0Y29uc3QgY29kZXMgPSBuZXcgTWFwKCk7XG5cdGNvbnN0IHN0eWxlcyA9IHtcblx0XHRtb2RpZmllcjoge1xuXHRcdFx0cmVzZXQ6IFswLCAwXSxcblx0XHRcdC8vIDIxIGlzbid0IHdpZGVseSBzdXBwb3J0ZWQgYW5kIDIyIGRvZXMgdGhlIHNhbWUgdGhpbmdcblx0XHRcdGJvbGQ6IFsxLCAyMl0sXG5cdFx0XHRkaW06IFsyLCAyMl0sXG5cdFx0XHRpdGFsaWM6IFszLCAyM10sXG5cdFx0XHR1bmRlcmxpbmU6IFs0LCAyNF0sXG5cdFx0XHRpbnZlcnNlOiBbNywgMjddLFxuXHRcdFx0aGlkZGVuOiBbOCwgMjhdLFxuXHRcdFx0c3RyaWtldGhyb3VnaDogWzksIDI5XVxuXHRcdH0sXG5cdFx0Y29sb3I6IHtcblx0XHRcdGJsYWNrOiBbMzAsIDM5XSxcblx0XHRcdHJlZDogWzMxLCAzOV0sXG5cdFx0XHRncmVlbjogWzMyLCAzOV0sXG5cdFx0XHR5ZWxsb3c6IFszMywgMzldLFxuXHRcdFx0Ymx1ZTogWzM0LCAzOV0sXG5cdFx0XHRtYWdlbnRhOiBbMzUsIDM5XSxcblx0XHRcdGN5YW46IFszNiwgMzldLFxuXHRcdFx0d2hpdGU6IFszNywgMzldLFxuXG5cdFx0XHQvLyBCcmlnaHQgY29sb3Jcblx0XHRcdGJsYWNrQnJpZ2h0OiBbOTAsIDM5XSxcblx0XHRcdHJlZEJyaWdodDogWzkxLCAzOV0sXG5cdFx0XHRncmVlbkJyaWdodDogWzkyLCAzOV0sXG5cdFx0XHR5ZWxsb3dCcmlnaHQ6IFs5MywgMzldLFxuXHRcdFx0Ymx1ZUJyaWdodDogWzk0LCAzOV0sXG5cdFx0XHRtYWdlbnRhQnJpZ2h0OiBbOTUsIDM5XSxcblx0XHRcdGN5YW5CcmlnaHQ6IFs5NiwgMzldLFxuXHRcdFx0d2hpdGVCcmlnaHQ6IFs5NywgMzldXG5cdFx0fSxcblx0XHRiZ0NvbG9yOiB7XG5cdFx0XHRiZ0JsYWNrOiBbNDAsIDQ5XSxcblx0XHRcdGJnUmVkOiBbNDEsIDQ5XSxcblx0XHRcdGJnR3JlZW46IFs0MiwgNDldLFxuXHRcdFx0YmdZZWxsb3c6IFs0MywgNDldLFxuXHRcdFx0YmdCbHVlOiBbNDQsIDQ5XSxcblx0XHRcdGJnTWFnZW50YTogWzQ1LCA0OV0sXG5cdFx0XHRiZ0N5YW46IFs0NiwgNDldLFxuXHRcdFx0YmdXaGl0ZTogWzQ3LCA0OV0sXG5cblx0XHRcdC8vIEJyaWdodCBjb2xvclxuXHRcdFx0YmdCbGFja0JyaWdodDogWzEwMCwgNDldLFxuXHRcdFx0YmdSZWRCcmlnaHQ6IFsxMDEsIDQ5XSxcblx0XHRcdGJnR3JlZW5CcmlnaHQ6IFsxMDIsIDQ5XSxcblx0XHRcdGJnWWVsbG93QnJpZ2h0OiBbMTAzLCA0OV0sXG5cdFx0XHRiZ0JsdWVCcmlnaHQ6IFsxMDQsIDQ5XSxcblx0XHRcdGJnTWFnZW50YUJyaWdodDogWzEwNSwgNDldLFxuXHRcdFx0YmdDeWFuQnJpZ2h0OiBbMTA2LCA0OV0sXG5cdFx0XHRiZ1doaXRlQnJpZ2h0OiBbMTA3LCA0OV1cblx0XHR9XG5cdH07XG5cblx0Ly8gQWxpYXMgYnJpZ2h0IGJsYWNrIGFzIGdyYXkgKGFuZCBncmV5KVxuXHRzdHlsZXMuY29sb3IuZ3JheSA9IHN0eWxlcy5jb2xvci5ibGFja0JyaWdodDtcblx0c3R5bGVzLmJnQ29sb3IuYmdHcmF5ID0gc3R5bGVzLmJnQ29sb3IuYmdCbGFja0JyaWdodDtcblx0c3R5bGVzLmNvbG9yLmdyZXkgPSBzdHlsZXMuY29sb3IuYmxhY2tCcmlnaHQ7XG5cdHN0eWxlcy5iZ0NvbG9yLmJnR3JleSA9IHN0eWxlcy5iZ0NvbG9yLmJnQmxhY2tCcmlnaHQ7XG5cblx0Zm9yIChjb25zdCBbZ3JvdXBOYW1lLCBncm91cF0gb2YgT2JqZWN0LmVudHJpZXMoc3R5bGVzKSkge1xuXHRcdGZvciAoY29uc3QgW3N0eWxlTmFtZSwgc3R5bGVdIG9mIE9iamVjdC5lbnRyaWVzKGdyb3VwKSkge1xuXHRcdFx0c3R5bGVzW3N0eWxlTmFtZV0gPSB7XG5cdFx0XHRcdG9wZW46IGBcXHUwMDFCWyR7c3R5bGVbMF19bWAsXG5cdFx0XHRcdGNsb3NlOiBgXFx1MDAxQlske3N0eWxlWzFdfW1gXG5cdFx0XHR9O1xuXG5cdFx0XHRncm91cFtzdHlsZU5hbWVdID0gc3R5bGVzW3N0eWxlTmFtZV07XG5cblx0XHRcdGNvZGVzLnNldChzdHlsZVswXSwgc3R5bGVbMV0pO1xuXHRcdH1cblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdHlsZXMsIGdyb3VwTmFtZSwge1xuXHRcdFx0dmFsdWU6IGdyb3VwLFxuXHRcdFx0ZW51bWVyYWJsZTogZmFsc2Vcblx0XHR9KTtcblx0fVxuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdHlsZXMsICdjb2RlcycsIHtcblx0XHR2YWx1ZTogY29kZXMsXG5cdFx0ZW51bWVyYWJsZTogZmFsc2Vcblx0fSk7XG5cblx0c3R5bGVzLmNvbG9yLmNsb3NlID0gJ1xcdTAwMUJbMzltJztcblx0c3R5bGVzLmJnQ29sb3IuY2xvc2UgPSAnXFx1MDAxQls0OW0nO1xuXG5cdHNldExhenlQcm9wZXJ0eShzdHlsZXMuY29sb3IsICdhbnNpJywgKCkgPT4gbWFrZUR5bmFtaWNTdHlsZXMod3JhcEFuc2kxNiwgJ2Fuc2kxNicsIGFuc2kyYW5zaSwgZmFsc2UpKTtcblx0c2V0TGF6eVByb3BlcnR5KHN0eWxlcy5jb2xvciwgJ2Fuc2kyNTYnLCAoKSA9PiBtYWtlRHluYW1pY1N0eWxlcyh3cmFwQW5zaTI1NiwgJ2Fuc2kyNTYnLCBhbnNpMmFuc2ksIGZhbHNlKSk7XG5cdHNldExhenlQcm9wZXJ0eShzdHlsZXMuY29sb3IsICdhbnNpMTZtJywgKCkgPT4gbWFrZUR5bmFtaWNTdHlsZXMod3JhcEFuc2kxNm0sICdyZ2InLCByZ2IycmdiLCBmYWxzZSkpO1xuXHRzZXRMYXp5UHJvcGVydHkoc3R5bGVzLmJnQ29sb3IsICdhbnNpJywgKCkgPT4gbWFrZUR5bmFtaWNTdHlsZXMod3JhcEFuc2kxNiwgJ2Fuc2kxNicsIGFuc2kyYW5zaSwgdHJ1ZSkpO1xuXHRzZXRMYXp5UHJvcGVydHkoc3R5bGVzLmJnQ29sb3IsICdhbnNpMjU2JywgKCkgPT4gbWFrZUR5bmFtaWNTdHlsZXMod3JhcEFuc2kyNTYsICdhbnNpMjU2JywgYW5zaTJhbnNpLCB0cnVlKSk7XG5cdHNldExhenlQcm9wZXJ0eShzdHlsZXMuYmdDb2xvciwgJ2Fuc2kxNm0nLCAoKSA9PiBtYWtlRHluYW1pY1N0eWxlcyh3cmFwQW5zaTE2bSwgJ3JnYicsIHJnYjJyZ2IsIHRydWUpKTtcblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG4vLyBNYWtlIHRoZSBleHBvcnQgaW1tdXRhYmxlXG5PYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCAnZXhwb3J0cycsIHtcblx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0Z2V0OiBhc3NlbWJsZVN0eWxlc1xufSk7XG4iLCIvKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKSxcbiAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKSxcbiAgZmlsZVVSTFRvUGF0aCA9IHJlcXVpcmUoJ2ZpbGUtdXJpLXRvLXBhdGgnKSxcbiAgam9pbiA9IHBhdGguam9pbixcbiAgZGlybmFtZSA9IHBhdGguZGlybmFtZSxcbiAgZXhpc3RzID1cbiAgICAoZnMuYWNjZXNzU3luYyAmJlxuICAgICAgZnVuY3Rpb24ocGF0aCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZzLmFjY2Vzc1N5bmMocGF0aCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KSB8fFxuICAgIGZzLmV4aXN0c1N5bmMgfHxcbiAgICBwYXRoLmV4aXN0c1N5bmMsXG4gIGRlZmF1bHRzID0ge1xuICAgIGFycm93OiBwcm9jZXNzLmVudi5OT0RFX0JJTkRJTkdTX0FSUk9XIHx8ICcg4oaSICcsXG4gICAgY29tcGlsZWQ6IHByb2Nlc3MuZW52Lk5PREVfQklORElOR1NfQ09NUElMRURfRElSIHx8ICdjb21waWxlZCcsXG4gICAgcGxhdGZvcm06IHByb2Nlc3MucGxhdGZvcm0sXG4gICAgYXJjaDogcHJvY2Vzcy5hcmNoLFxuICAgIG5vZGVQcmVHeXA6XG4gICAgICAnbm9kZS12JyArXG4gICAgICBwcm9jZXNzLnZlcnNpb25zLm1vZHVsZXMgK1xuICAgICAgJy0nICtcbiAgICAgIHByb2Nlc3MucGxhdGZvcm0gK1xuICAgICAgJy0nICtcbiAgICAgIHByb2Nlc3MuYXJjaCxcbiAgICB2ZXJzaW9uOiBwcm9jZXNzLnZlcnNpb25zLm5vZGUsXG4gICAgYmluZGluZ3M6ICdiaW5kaW5ncy5ub2RlJyxcbiAgICB0cnk6IFtcbiAgICAgIC8vIG5vZGUtZ3lwJ3MgbGlua2VkIHZlcnNpb24gaW4gdGhlIFwiYnVpbGRcIiBkaXJcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnYnVpbGQnLCAnYmluZGluZ3MnXSxcbiAgICAgIC8vIG5vZGUtd2FmIGFuZCBneXBfYWRkb24gKGEuay5hIG5vZGUtZ3lwKVxuICAgICAgWydtb2R1bGVfcm9vdCcsICdidWlsZCcsICdEZWJ1ZycsICdiaW5kaW5ncyddLFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdidWlsZCcsICdSZWxlYXNlJywgJ2JpbmRpbmdzJ10sXG4gICAgICAvLyBEZWJ1ZyBmaWxlcywgZm9yIGRldmVsb3BtZW50IChsZWdhY3kgYmVoYXZpb3IsIHJlbW92ZSBmb3Igbm9kZSB2MC45KVxuICAgICAgWydtb2R1bGVfcm9vdCcsICdvdXQnLCAnRGVidWcnLCAnYmluZGluZ3MnXSxcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnRGVidWcnLCAnYmluZGluZ3MnXSxcbiAgICAgIC8vIFJlbGVhc2UgZmlsZXMsIGJ1dCBtYW51YWxseSBjb21waWxlZCAobGVnYWN5IGJlaGF2aW9yLCByZW1vdmUgZm9yIG5vZGUgdjAuOSlcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnb3V0JywgJ1JlbGVhc2UnLCAnYmluZGluZ3MnXSxcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnUmVsZWFzZScsICdiaW5kaW5ncyddLFxuICAgICAgLy8gTGVnYWN5IGZyb20gbm9kZS13YWYsIG5vZGUgPD0gMC40LnhcbiAgICAgIFsnbW9kdWxlX3Jvb3QnLCAnYnVpbGQnLCAnZGVmYXVsdCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gUHJvZHVjdGlvbiBcIlJlbGVhc2VcIiBidWlsZHR5cGUgYmluYXJ5IChtZWguLi4pXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2NvbXBpbGVkJywgJ3ZlcnNpb24nLCAncGxhdGZvcm0nLCAnYXJjaCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gbm9kZS1xYnMgYnVpbGRzXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2FkZG9uLWJ1aWxkJywgJ3JlbGVhc2UnLCAnaW5zdGFsbC1yb290JywgJ2JpbmRpbmdzJ10sXG4gICAgICBbJ21vZHVsZV9yb290JywgJ2FkZG9uLWJ1aWxkJywgJ2RlYnVnJywgJ2luc3RhbGwtcm9vdCcsICdiaW5kaW5ncyddLFxuICAgICAgWydtb2R1bGVfcm9vdCcsICdhZGRvbi1idWlsZCcsICdkZWZhdWx0JywgJ2luc3RhbGwtcm9vdCcsICdiaW5kaW5ncyddLFxuICAgICAgLy8gbm9kZS1wcmUtZ3lwIHBhdGggLi9saWIvYmluZGluZy97bm9kZV9hYml9LXtwbGF0Zm9ybX0te2FyY2h9XG4gICAgICBbJ21vZHVsZV9yb290JywgJ2xpYicsICdiaW5kaW5nJywgJ25vZGVQcmVHeXAnLCAnYmluZGluZ3MnXVxuICAgIF1cbiAgfTtcblxuLyoqXG4gKiBUaGUgbWFpbiBgYmluZGluZ3MoKWAgZnVuY3Rpb24gbG9hZHMgdGhlIGNvbXBpbGVkIGJpbmRpbmdzIGZvciBhIGdpdmVuIG1vZHVsZS5cbiAqIEl0IHVzZXMgVjgncyBFcnJvciBBUEkgdG8gZGV0ZXJtaW5lIHRoZSBwYXJlbnQgZmlsZW5hbWUgdGhhdCB0aGlzIGZ1bmN0aW9uIGlzXG4gKiBiZWluZyBpbnZva2VkIGZyb20sIHdoaWNoIGlzIHRoZW4gdXNlZCB0byBmaW5kIHRoZSByb290IGRpcmVjdG9yeS5cbiAqL1xuXG5mdW5jdGlvbiBiaW5kaW5ncyhvcHRzKSB7XG4gIC8vIEFyZ3VtZW50IHN1cmdlcnlcbiAgaWYgKHR5cGVvZiBvcHRzID09ICdzdHJpbmcnKSB7XG4gICAgb3B0cyA9IHsgYmluZGluZ3M6IG9wdHMgfTtcbiAgfSBlbHNlIGlmICghb3B0cykge1xuICAgIG9wdHMgPSB7fTtcbiAgfVxuXG4gIC8vIG1hcHMgYGRlZmF1bHRzYCBvbnRvIGBvcHRzYCBvYmplY3RcbiAgT2JqZWN0LmtleXMoZGVmYXVsdHMpLm1hcChmdW5jdGlvbihpKSB7XG4gICAgaWYgKCEoaSBpbiBvcHRzKSkgb3B0c1tpXSA9IGRlZmF1bHRzW2ldO1xuICB9KTtcblxuICAvLyBHZXQgdGhlIG1vZHVsZSByb290XG4gIGlmICghb3B0cy5tb2R1bGVfcm9vdCkge1xuICAgIG9wdHMubW9kdWxlX3Jvb3QgPSBleHBvcnRzLmdldFJvb3QoZXhwb3J0cy5nZXRGaWxlTmFtZSgpKTtcbiAgfVxuXG4gIC8vIEVuc3VyZSB0aGUgZ2l2ZW4gYmluZGluZ3MgbmFtZSBlbmRzIHdpdGggLm5vZGVcbiAgaWYgKHBhdGguZXh0bmFtZShvcHRzLmJpbmRpbmdzKSAhPSAnLm5vZGUnKSB7XG4gICAgb3B0cy5iaW5kaW5ncyArPSAnLm5vZGUnO1xuICB9XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2svd2VicGFjay9pc3N1ZXMvNDE3NSNpc3N1ZWNvbW1lbnQtMzQyOTMxMDM1XG4gIHZhciByZXF1aXJlRnVuYyA9XG4gICAgdHlwZW9mIF9fd2VicGFja19yZXF1aXJlX18gPT09ICdmdW5jdGlvbidcbiAgICAgID8gX19ub25fd2VicGFja19yZXF1aXJlX19cbiAgICAgIDogcmVxdWlyZTtcblxuICB2YXIgdHJpZXMgPSBbXSxcbiAgICBpID0gMCxcbiAgICBsID0gb3B0cy50cnkubGVuZ3RoLFxuICAgIG4sXG4gICAgYixcbiAgICBlcnI7XG5cbiAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICBuID0gam9pbi5hcHBseShcbiAgICAgIG51bGwsXG4gICAgICBvcHRzLnRyeVtpXS5tYXAoZnVuY3Rpb24ocCkge1xuICAgICAgICByZXR1cm4gb3B0c1twXSB8fCBwO1xuICAgICAgfSlcbiAgICApO1xuICAgIHRyaWVzLnB1c2gobik7XG4gICAgdHJ5IHtcbiAgICAgIGIgPSBvcHRzLnBhdGggPyByZXF1aXJlRnVuYy5yZXNvbHZlKG4pIDogcmVxdWlyZUZ1bmMobik7XG4gICAgICBpZiAoIW9wdHMucGF0aCkge1xuICAgICAgICBiLnBhdGggPSBuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGI7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUuY29kZSAhPT0gJ01PRFVMRV9OT1RfRk9VTkQnICYmXG4gICAgICAgICAgZS5jb2RlICE9PSAnUVVBTElGSUVEX1BBVEhfUkVTT0xVVElPTl9GQUlMRUQnICYmXG4gICAgICAgICAgIS9ub3QgZmluZC9pLnRlc3QoZS5tZXNzYWdlKSkge1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVyciA9IG5ldyBFcnJvcihcbiAgICAnQ291bGQgbm90IGxvY2F0ZSB0aGUgYmluZGluZ3MgZmlsZS4gVHJpZWQ6XFxuJyArXG4gICAgICB0cmllc1xuICAgICAgICAubWFwKGZ1bmN0aW9uKGEpIHtcbiAgICAgICAgICByZXR1cm4gb3B0cy5hcnJvdyArIGE7XG4gICAgICAgIH0pXG4gICAgICAgIC5qb2luKCdcXG4nKVxuICApO1xuICBlcnIudHJpZXMgPSB0cmllcztcbiAgdGhyb3cgZXJyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gYmluZGluZ3M7XG5cbi8qKlxuICogR2V0cyB0aGUgZmlsZW5hbWUgb2YgdGhlIEphdmFTY3JpcHQgZmlsZSB0aGF0IGludm9rZXMgdGhpcyBmdW5jdGlvbi5cbiAqIFVzZWQgdG8gaGVscCBmaW5kIHRoZSByb290IGRpcmVjdG9yeSBvZiBhIG1vZHVsZS5cbiAqIE9wdGlvbmFsbHkgYWNjZXB0cyBhbiBmaWxlbmFtZSBhcmd1bWVudCB0byBza2lwIHdoZW4gc2VhcmNoaW5nIGZvciB0aGUgaW52b2tpbmcgZmlsZW5hbWVcbiAqL1xuXG5leHBvcnRzLmdldEZpbGVOYW1lID0gZnVuY3Rpb24gZ2V0RmlsZU5hbWUoY2FsbGluZ19maWxlKSB7XG4gIHZhciBvcmlnUFNUID0gRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UsXG4gICAgb3JpZ1NUTCA9IEVycm9yLnN0YWNrVHJhY2VMaW1pdCxcbiAgICBkdW1teSA9IHt9LFxuICAgIGZpbGVOYW1lO1xuXG4gIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IDEwO1xuXG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gZnVuY3Rpb24oZSwgc3QpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgZmlsZU5hbWUgPSBzdFtpXS5nZXRGaWxlTmFtZSgpO1xuICAgICAgaWYgKGZpbGVOYW1lICE9PSBfX2ZpbGVuYW1lKSB7XG4gICAgICAgIGlmIChjYWxsaW5nX2ZpbGUpIHtcbiAgICAgICAgICBpZiAoZmlsZU5hbWUgIT09IGNhbGxpbmdfZmlsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gcnVuIHRoZSAncHJlcGFyZVN0YWNrVHJhY2UnIGZ1bmN0aW9uIGFib3ZlXG4gIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGR1bW15KTtcbiAgZHVtbXkuc3RhY2s7XG5cbiAgLy8gY2xlYW51cFxuICBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSA9IG9yaWdQU1Q7XG4gIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IG9yaWdTVEw7XG5cbiAgLy8gaGFuZGxlIGZpbGVuYW1lIHRoYXQgc3RhcnRzIHdpdGggXCJmaWxlOi8vXCJcbiAgdmFyIGZpbGVTY2hlbWEgPSAnZmlsZTovLyc7XG4gIGlmIChmaWxlTmFtZS5pbmRleE9mKGZpbGVTY2hlbWEpID09PSAwKSB7XG4gICAgZmlsZU5hbWUgPSBmaWxlVVJMVG9QYXRoKGZpbGVOYW1lKTtcbiAgfVxuXG4gIHJldHVybiBmaWxlTmFtZTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgYSBtb2R1bGUsIGdpdmVuIGFuIGFyYml0cmFyeSBmaWxlbmFtZVxuICogc29tZXdoZXJlIGluIHRoZSBtb2R1bGUgdHJlZS4gVGhlIFwicm9vdCBkaXJlY3RvcnlcIiBpcyB0aGUgZGlyZWN0b3J5XG4gKiBjb250YWluaW5nIHRoZSBgcGFja2FnZS5qc29uYCBmaWxlLlxuICpcbiAqICAgSW46ICAvaG9tZS9uYXRlL25vZGUtbmF0aXZlLW1vZHVsZS9saWIvaW5kZXguanNcbiAqICAgT3V0OiAvaG9tZS9uYXRlL25vZGUtbmF0aXZlLW1vZHVsZVxuICovXG5cbmV4cG9ydHMuZ2V0Um9vdCA9IGZ1bmN0aW9uIGdldFJvb3QoZmlsZSkge1xuICB2YXIgZGlyID0gZGlybmFtZShmaWxlKSxcbiAgICBwcmV2O1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIGlmIChkaXIgPT09ICcuJykge1xuICAgICAgLy8gQXZvaWRzIGFuIGluZmluaXRlIGxvb3AgaW4gcmFyZSBjYXNlcywgbGlrZSB0aGUgUkVQTFxuICAgICAgZGlyID0gcHJvY2Vzcy5jd2QoKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgZXhpc3RzKGpvaW4oZGlyLCAncGFja2FnZS5qc29uJykpIHx8XG4gICAgICBleGlzdHMoam9pbihkaXIsICdub2RlX21vZHVsZXMnKSlcbiAgICApIHtcbiAgICAgIC8vIEZvdW5kIHRoZSAncGFja2FnZS5qc29uJyBmaWxlIG9yICdub2RlX21vZHVsZXMnIGRpcjsgd2UncmUgZG9uZVxuICAgICAgcmV0dXJuIGRpcjtcbiAgICB9XG4gICAgaWYgKHByZXYgPT09IGRpcikge1xuICAgICAgLy8gR290IHRvIHRoZSB0b3BcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0NvdWxkIG5vdCBmaW5kIG1vZHVsZSByb290IGdpdmVuIGZpbGU6IFwiJyArXG4gICAgICAgICAgZmlsZSArXG4gICAgICAgICAgJ1wiLiBEbyB5b3UgaGF2ZSBhIGBwYWNrYWdlLmpzb25gIGZpbGU/ICdcbiAgICAgICk7XG4gICAgfVxuICAgIC8vIFRyeSB0aGUgcGFyZW50IGRpciBuZXh0XG4gICAgcHJldiA9IGRpcjtcbiAgICBkaXIgPSBqb2luKGRpciwgJy4uJyk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBhbnNpU3R5bGVzID0gcmVxdWlyZSgnYW5zaS1zdHlsZXMnKTtcbmNvbnN0IHtzdGRvdXQ6IHN0ZG91dENvbG9yLCBzdGRlcnI6IHN0ZGVyckNvbG9yfSA9IHJlcXVpcmUoJ3N1cHBvcnRzLWNvbG9yJyk7XG5jb25zdCB7XG5cdHN0cmluZ1JlcGxhY2VBbGwsXG5cdHN0cmluZ0VuY2FzZUNSTEZXaXRoRmlyc3RJbmRleFxufSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCB7aXNBcnJheX0gPSBBcnJheTtcblxuLy8gYHN1cHBvcnRzQ29sb3IubGV2ZWxgIOKGkiBgYW5zaVN0eWxlcy5jb2xvcltuYW1lXWAgbWFwcGluZ1xuY29uc3QgbGV2ZWxNYXBwaW5nID0gW1xuXHQnYW5zaScsXG5cdCdhbnNpJyxcblx0J2Fuc2kyNTYnLFxuXHQnYW5zaTE2bSdcbl07XG5cbmNvbnN0IHN0eWxlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbmNvbnN0IGFwcGx5T3B0aW9ucyA9IChvYmplY3QsIG9wdGlvbnMgPSB7fSkgPT4ge1xuXHRpZiAob3B0aW9ucy5sZXZlbCAmJiAhKE51bWJlci5pc0ludGVnZXIob3B0aW9ucy5sZXZlbCkgJiYgb3B0aW9ucy5sZXZlbCA+PSAwICYmIG9wdGlvbnMubGV2ZWwgPD0gMykpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgbGV2ZWxgIG9wdGlvbiBzaG91bGQgYmUgYW4gaW50ZWdlciBmcm9tIDAgdG8gMycpO1xuXHR9XG5cblx0Ly8gRGV0ZWN0IGxldmVsIGlmIG5vdCBzZXQgbWFudWFsbHlcblx0Y29uc3QgY29sb3JMZXZlbCA9IHN0ZG91dENvbG9yID8gc3Rkb3V0Q29sb3IubGV2ZWwgOiAwO1xuXHRvYmplY3QubGV2ZWwgPSBvcHRpb25zLmxldmVsID09PSB1bmRlZmluZWQgPyBjb2xvckxldmVsIDogb3B0aW9ucy5sZXZlbDtcbn07XG5cbmNsYXNzIENoYWxrQ2xhc3Mge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0cnVjdG9yLXJldHVyblxuXHRcdHJldHVybiBjaGFsa0ZhY3Rvcnkob3B0aW9ucyk7XG5cdH1cbn1cblxuY29uc3QgY2hhbGtGYWN0b3J5ID0gb3B0aW9ucyA9PiB7XG5cdGNvbnN0IGNoYWxrID0ge307XG5cdGFwcGx5T3B0aW9ucyhjaGFsaywgb3B0aW9ucyk7XG5cblx0Y2hhbGsudGVtcGxhdGUgPSAoLi4uYXJndW1lbnRzXykgPT4gY2hhbGtUYWcoY2hhbGsudGVtcGxhdGUsIC4uLmFyZ3VtZW50c18pO1xuXG5cdE9iamVjdC5zZXRQcm90b3R5cGVPZihjaGFsaywgQ2hhbGsucHJvdG90eXBlKTtcblx0T2JqZWN0LnNldFByb3RvdHlwZU9mKGNoYWxrLnRlbXBsYXRlLCBjaGFsayk7XG5cblx0Y2hhbGsudGVtcGxhdGUuY29uc3RydWN0b3IgPSAoKSA9PiB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdgY2hhbGsuY29uc3RydWN0b3IoKWAgaXMgZGVwcmVjYXRlZC4gVXNlIGBuZXcgY2hhbGsuSW5zdGFuY2UoKWAgaW5zdGVhZC4nKTtcblx0fTtcblxuXHRjaGFsay50ZW1wbGF0ZS5JbnN0YW5jZSA9IENoYWxrQ2xhc3M7XG5cblx0cmV0dXJuIGNoYWxrLnRlbXBsYXRlO1xufTtcblxuZnVuY3Rpb24gQ2hhbGsob3B0aW9ucykge1xuXHRyZXR1cm4gY2hhbGtGYWN0b3J5KG9wdGlvbnMpO1xufVxuXG5mb3IgKGNvbnN0IFtzdHlsZU5hbWUsIHN0eWxlXSBvZiBPYmplY3QuZW50cmllcyhhbnNpU3R5bGVzKSkge1xuXHRzdHlsZXNbc3R5bGVOYW1lXSA9IHtcblx0XHRnZXQoKSB7XG5cdFx0XHRjb25zdCBidWlsZGVyID0gY3JlYXRlQnVpbGRlcih0aGlzLCBjcmVhdGVTdHlsZXIoc3R5bGUub3Blbiwgc3R5bGUuY2xvc2UsIHRoaXMuX3N0eWxlciksIHRoaXMuX2lzRW1wdHkpO1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIHN0eWxlTmFtZSwge3ZhbHVlOiBidWlsZGVyfSk7XG5cdFx0XHRyZXR1cm4gYnVpbGRlcjtcblx0XHR9XG5cdH07XG59XG5cbnN0eWxlcy52aXNpYmxlID0ge1xuXHRnZXQoKSB7XG5cdFx0Y29uc3QgYnVpbGRlciA9IGNyZWF0ZUJ1aWxkZXIodGhpcywgdGhpcy5fc3R5bGVyLCB0cnVlKTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3Zpc2libGUnLCB7dmFsdWU6IGJ1aWxkZXJ9KTtcblx0XHRyZXR1cm4gYnVpbGRlcjtcblx0fVxufTtcblxuY29uc3QgdXNlZE1vZGVscyA9IFsncmdiJywgJ2hleCcsICdrZXl3b3JkJywgJ2hzbCcsICdoc3YnLCAnaHdiJywgJ2Fuc2knLCAnYW5zaTI1NiddO1xuXG5mb3IgKGNvbnN0IG1vZGVsIG9mIHVzZWRNb2RlbHMpIHtcblx0c3R5bGVzW21vZGVsXSA9IHtcblx0XHRnZXQoKSB7XG5cdFx0XHRjb25zdCB7bGV2ZWx9ID0gdGhpcztcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoLi4uYXJndW1lbnRzXykge1xuXHRcdFx0XHRjb25zdCBzdHlsZXIgPSBjcmVhdGVTdHlsZXIoYW5zaVN0eWxlcy5jb2xvcltsZXZlbE1hcHBpbmdbbGV2ZWxdXVttb2RlbF0oLi4uYXJndW1lbnRzXyksIGFuc2lTdHlsZXMuY29sb3IuY2xvc2UsIHRoaXMuX3N0eWxlcik7XG5cdFx0XHRcdHJldHVybiBjcmVhdGVCdWlsZGVyKHRoaXMsIHN0eWxlciwgdGhpcy5faXNFbXB0eSk7XG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn1cblxuZm9yIChjb25zdCBtb2RlbCBvZiB1c2VkTW9kZWxzKSB7XG5cdGNvbnN0IGJnTW9kZWwgPSAnYmcnICsgbW9kZWxbMF0udG9VcHBlckNhc2UoKSArIG1vZGVsLnNsaWNlKDEpO1xuXHRzdHlsZXNbYmdNb2RlbF0gPSB7XG5cdFx0Z2V0KCkge1xuXHRcdFx0Y29uc3Qge2xldmVsfSA9IHRoaXM7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3VtZW50c18pIHtcblx0XHRcdFx0Y29uc3Qgc3R5bGVyID0gY3JlYXRlU3R5bGVyKGFuc2lTdHlsZXMuYmdDb2xvcltsZXZlbE1hcHBpbmdbbGV2ZWxdXVttb2RlbF0oLi4uYXJndW1lbnRzXyksIGFuc2lTdHlsZXMuYmdDb2xvci5jbG9zZSwgdGhpcy5fc3R5bGVyKTtcblx0XHRcdFx0cmV0dXJuIGNyZWF0ZUJ1aWxkZXIodGhpcywgc3R5bGVyLCB0aGlzLl9pc0VtcHR5KTtcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xufVxuXG5jb25zdCBwcm90byA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCgpID0+IHt9LCB7XG5cdC4uLnN0eWxlcyxcblx0bGV2ZWw6IHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9nZW5lcmF0b3IubGV2ZWw7XG5cdFx0fSxcblx0XHRzZXQobGV2ZWwpIHtcblx0XHRcdHRoaXMuX2dlbmVyYXRvci5sZXZlbCA9IGxldmVsO1xuXHRcdH1cblx0fVxufSk7XG5cbmNvbnN0IGNyZWF0ZVN0eWxlciA9IChvcGVuLCBjbG9zZSwgcGFyZW50KSA9PiB7XG5cdGxldCBvcGVuQWxsO1xuXHRsZXQgY2xvc2VBbGw7XG5cdGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkge1xuXHRcdG9wZW5BbGwgPSBvcGVuO1xuXHRcdGNsb3NlQWxsID0gY2xvc2U7XG5cdH0gZWxzZSB7XG5cdFx0b3BlbkFsbCA9IHBhcmVudC5vcGVuQWxsICsgb3Blbjtcblx0XHRjbG9zZUFsbCA9IGNsb3NlICsgcGFyZW50LmNsb3NlQWxsO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRvcGVuLFxuXHRcdGNsb3NlLFxuXHRcdG9wZW5BbGwsXG5cdFx0Y2xvc2VBbGwsXG5cdFx0cGFyZW50XG5cdH07XG59O1xuXG5jb25zdCBjcmVhdGVCdWlsZGVyID0gKHNlbGYsIF9zdHlsZXIsIF9pc0VtcHR5KSA9PiB7XG5cdGNvbnN0IGJ1aWxkZXIgPSAoLi4uYXJndW1lbnRzXykgPT4ge1xuXHRcdGlmIChpc0FycmF5KGFyZ3VtZW50c19bMF0pICYmIGlzQXJyYXkoYXJndW1lbnRzX1swXS5yYXcpKSB7XG5cdFx0XHQvLyBDYWxsZWQgYXMgYSB0ZW1wbGF0ZSBsaXRlcmFsLCBmb3IgZXhhbXBsZTogY2hhbGsucmVkYDIgKyAzID0ge2JvbGQgJHsyKzN9fWBcblx0XHRcdHJldHVybiBhcHBseVN0eWxlKGJ1aWxkZXIsIGNoYWxrVGFnKGJ1aWxkZXIsIC4uLmFyZ3VtZW50c18pKTtcblx0XHR9XG5cblx0XHQvLyBTaW5nbGUgYXJndW1lbnQgaXMgaG90IHBhdGgsIGltcGxpY2l0IGNvZXJjaW9uIGlzIGZhc3RlciB0aGFuIGFueXRoaW5nXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWltcGxpY2l0LWNvZXJjaW9uXG5cdFx0cmV0dXJuIGFwcGx5U3R5bGUoYnVpbGRlciwgKGFyZ3VtZW50c18ubGVuZ3RoID09PSAxKSA/ICgnJyArIGFyZ3VtZW50c19bMF0pIDogYXJndW1lbnRzXy5qb2luKCcgJykpO1xuXHR9O1xuXG5cdC8vIFdlIGFsdGVyIHRoZSBwcm90b3R5cGUgYmVjYXVzZSB3ZSBtdXN0IHJldHVybiBhIGZ1bmN0aW9uLCBidXQgdGhlcmUgaXNcblx0Ly8gbm8gd2F5IHRvIGNyZWF0ZSBhIGZ1bmN0aW9uIHdpdGggYSBkaWZmZXJlbnQgcHJvdG90eXBlXG5cdE9iamVjdC5zZXRQcm90b3R5cGVPZihidWlsZGVyLCBwcm90byk7XG5cblx0YnVpbGRlci5fZ2VuZXJhdG9yID0gc2VsZjtcblx0YnVpbGRlci5fc3R5bGVyID0gX3N0eWxlcjtcblx0YnVpbGRlci5faXNFbXB0eSA9IF9pc0VtcHR5O1xuXG5cdHJldHVybiBidWlsZGVyO1xufTtcblxuY29uc3QgYXBwbHlTdHlsZSA9IChzZWxmLCBzdHJpbmcpID0+IHtcblx0aWYgKHNlbGYubGV2ZWwgPD0gMCB8fCAhc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHNlbGYuX2lzRW1wdHkgPyAnJyA6IHN0cmluZztcblx0fVxuXG5cdGxldCBzdHlsZXIgPSBzZWxmLl9zdHlsZXI7XG5cblx0aWYgKHN0eWxlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIHN0cmluZztcblx0fVxuXG5cdGNvbnN0IHtvcGVuQWxsLCBjbG9zZUFsbH0gPSBzdHlsZXI7XG5cdGlmIChzdHJpbmcuaW5kZXhPZignXFx1MDAxQicpICE9PSAtMSkge1xuXHRcdHdoaWxlIChzdHlsZXIgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gUmVwbGFjZSBhbnkgaW5zdGFuY2VzIGFscmVhZHkgcHJlc2VudCB3aXRoIGEgcmUtb3BlbmluZyBjb2RlXG5cdFx0XHQvLyBvdGhlcndpc2Ugb25seSB0aGUgcGFydCBvZiB0aGUgc3RyaW5nIHVudGlsIHNhaWQgY2xvc2luZyBjb2RlXG5cdFx0XHQvLyB3aWxsIGJlIGNvbG9yZWQsIGFuZCB0aGUgcmVzdCB3aWxsIHNpbXBseSBiZSAncGxhaW4nLlxuXHRcdFx0c3RyaW5nID0gc3RyaW5nUmVwbGFjZUFsbChzdHJpbmcsIHN0eWxlci5jbG9zZSwgc3R5bGVyLm9wZW4pO1xuXG5cdFx0XHRzdHlsZXIgPSBzdHlsZXIucGFyZW50O1xuXHRcdH1cblx0fVxuXG5cdC8vIFdlIGNhbiBtb3ZlIGJvdGggbmV4dCBhY3Rpb25zIG91dCBvZiBsb29wLCBiZWNhdXNlIHJlbWFpbmluZyBhY3Rpb25zIGluIGxvb3Agd29uJ3QgaGF2ZVxuXHQvLyBhbnkvdmlzaWJsZSBlZmZlY3Qgb24gcGFydHMgd2UgYWRkIGhlcmUuIENsb3NlIHRoZSBzdHlsaW5nIGJlZm9yZSBhIGxpbmVicmVhayBhbmQgcmVvcGVuXG5cdC8vIGFmdGVyIG5leHQgbGluZSB0byBmaXggYSBibGVlZCBpc3N1ZSBvbiBtYWNPUzogaHR0cHM6Ly9naXRodWIuY29tL2NoYWxrL2NoYWxrL3B1bGwvOTJcblx0Y29uc3QgbGZJbmRleCA9IHN0cmluZy5pbmRleE9mKCdcXG4nKTtcblx0aWYgKGxmSW5kZXggIT09IC0xKSB7XG5cdFx0c3RyaW5nID0gc3RyaW5nRW5jYXNlQ1JMRldpdGhGaXJzdEluZGV4KHN0cmluZywgY2xvc2VBbGwsIG9wZW5BbGwsIGxmSW5kZXgpO1xuXHR9XG5cblx0cmV0dXJuIG9wZW5BbGwgKyBzdHJpbmcgKyBjbG9zZUFsbDtcbn07XG5cbmxldCB0ZW1wbGF0ZTtcbmNvbnN0IGNoYWxrVGFnID0gKGNoYWxrLCAuLi5zdHJpbmdzKSA9PiB7XG5cdGNvbnN0IFtmaXJzdFN0cmluZ10gPSBzdHJpbmdzO1xuXG5cdGlmICghaXNBcnJheShmaXJzdFN0cmluZykgfHwgIWlzQXJyYXkoZmlyc3RTdHJpbmcucmF3KSkge1xuXHRcdC8vIElmIGNoYWxrKCkgd2FzIGNhbGxlZCBieSBpdHNlbGYgb3Igd2l0aCBhIHN0cmluZyxcblx0XHQvLyByZXR1cm4gdGhlIHN0cmluZyBpdHNlbGYgYXMgYSBzdHJpbmcuXG5cdFx0cmV0dXJuIHN0cmluZ3Muam9pbignICcpO1xuXHR9XG5cblx0Y29uc3QgYXJndW1lbnRzXyA9IHN0cmluZ3Muc2xpY2UoMSk7XG5cdGNvbnN0IHBhcnRzID0gW2ZpcnN0U3RyaW5nLnJhd1swXV07XG5cblx0Zm9yIChsZXQgaSA9IDE7IGkgPCBmaXJzdFN0cmluZy5sZW5ndGg7IGkrKykge1xuXHRcdHBhcnRzLnB1c2goXG5cdFx0XHRTdHJpbmcoYXJndW1lbnRzX1tpIC0gMV0pLnJlcGxhY2UoL1t7fVxcXFxdL2csICdcXFxcJCYnKSxcblx0XHRcdFN0cmluZyhmaXJzdFN0cmluZy5yYXdbaV0pXG5cdFx0KTtcblx0fVxuXG5cdGlmICh0ZW1wbGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGVtcGxhdGUgPSByZXF1aXJlKCcuL3RlbXBsYXRlcycpO1xuXHR9XG5cblx0cmV0dXJuIHRlbXBsYXRlKGNoYWxrLCBwYXJ0cy5qb2luKCcnKSk7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhDaGFsay5wcm90b3R5cGUsIHN0eWxlcyk7XG5cbmNvbnN0IGNoYWxrID0gQ2hhbGsoKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuZXctY2FwXG5jaGFsay5zdXBwb3J0c0NvbG9yID0gc3Rkb3V0Q29sb3I7XG5jaGFsay5zdGRlcnIgPSBDaGFsayh7bGV2ZWw6IHN0ZGVyckNvbG9yID8gc3RkZXJyQ29sb3IubGV2ZWwgOiAwfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbmV3LWNhcFxuY2hhbGsuc3RkZXJyLnN1cHBvcnRzQ29sb3IgPSBzdGRlcnJDb2xvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBjaGFsaztcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IFRFTVBMQVRFX1JFR0VYID0gLyg/OlxcXFwodSg/OlthLWZcXGRdezR9fFxce1thLWZcXGRdezEsNn1cXH0pfHhbYS1mXFxkXXsyfXwuKSl8KD86XFx7KH4pPyhcXHcrKD86XFwoW14pXSpcXCkpPyg/OlxcLlxcdysoPzpcXChbXildKlxcKSk/KSopKD86WyBcXHRdfCg/PVxccj9cXG4pKSl8KFxcfSl8KCg/Oi58W1xcclxcblxcZl0pKz8pL2dpO1xuY29uc3QgU1RZTEVfUkVHRVggPSAvKD86XnxcXC4pKFxcdyspKD86XFwoKFteKV0qKVxcKSk/L2c7XG5jb25zdCBTVFJJTkdfUkVHRVggPSAvXihbJ1wiXSkoKD86XFxcXC58KD8hXFwxKVteXFxcXF0pKilcXDEkLztcbmNvbnN0IEVTQ0FQRV9SRUdFWCA9IC9cXFxcKHUoPzpbYS1mXFxkXXs0fXx7W2EtZlxcZF17MSw2fX0pfHhbYS1mXFxkXXsyfXwuKXwoW15cXFxcXSkvZ2k7XG5cbmNvbnN0IEVTQ0FQRVMgPSBuZXcgTWFwKFtcblx0WyduJywgJ1xcbiddLFxuXHRbJ3InLCAnXFxyJ10sXG5cdFsndCcsICdcXHQnXSxcblx0WydiJywgJ1xcYiddLFxuXHRbJ2YnLCAnXFxmJ10sXG5cdFsndicsICdcXHYnXSxcblx0WycwJywgJ1xcMCddLFxuXHRbJ1xcXFwnLCAnXFxcXCddLFxuXHRbJ2UnLCAnXFx1MDAxQiddLFxuXHRbJ2EnLCAnXFx1MDAwNyddXG5dKTtcblxuZnVuY3Rpb24gdW5lc2NhcGUoYykge1xuXHRjb25zdCB1ID0gY1swXSA9PT0gJ3UnO1xuXHRjb25zdCBicmFja2V0ID0gY1sxXSA9PT0gJ3snO1xuXG5cdGlmICgodSAmJiAhYnJhY2tldCAmJiBjLmxlbmd0aCA9PT0gNSkgfHwgKGNbMF0gPT09ICd4JyAmJiBjLmxlbmd0aCA9PT0gMykpIHtcblx0XHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChjLnNsaWNlKDEpLCAxNikpO1xuXHR9XG5cblx0aWYgKHUgJiYgYnJhY2tldCkge1xuXHRcdHJldHVybiBTdHJpbmcuZnJvbUNvZGVQb2ludChwYXJzZUludChjLnNsaWNlKDIsIC0xKSwgMTYpKTtcblx0fVxuXG5cdHJldHVybiBFU0NBUEVTLmdldChjKSB8fCBjO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50cyhuYW1lLCBhcmd1bWVudHNfKSB7XG5cdGNvbnN0IHJlc3VsdHMgPSBbXTtcblx0Y29uc3QgY2h1bmtzID0gYXJndW1lbnRzXy50cmltKCkuc3BsaXQoL1xccyosXFxzKi9nKTtcblx0bGV0IG1hdGNoZXM7XG5cblx0Zm9yIChjb25zdCBjaHVuayBvZiBjaHVua3MpIHtcblx0XHRjb25zdCBudW1iZXIgPSBOdW1iZXIoY2h1bmspO1xuXHRcdGlmICghTnVtYmVyLmlzTmFOKG51bWJlcikpIHtcblx0XHRcdHJlc3VsdHMucHVzaChudW1iZXIpO1xuXHRcdH0gZWxzZSBpZiAoKG1hdGNoZXMgPSBjaHVuay5tYXRjaChTVFJJTkdfUkVHRVgpKSkge1xuXHRcdFx0cmVzdWx0cy5wdXNoKG1hdGNoZXNbMl0ucmVwbGFjZShFU0NBUEVfUkVHRVgsIChtLCBlc2NhcGUsIGNoYXJhY3RlcikgPT4gZXNjYXBlID8gdW5lc2NhcGUoZXNjYXBlKSA6IGNoYXJhY3RlcikpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgQ2hhbGsgdGVtcGxhdGUgc3R5bGUgYXJndW1lbnQ6ICR7Y2h1bmt9IChpbiBzdHlsZSAnJHtuYW1lfScpYCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIHBhcnNlU3R5bGUoc3R5bGUpIHtcblx0U1RZTEVfUkVHRVgubGFzdEluZGV4ID0gMDtcblxuXHRjb25zdCByZXN1bHRzID0gW107XG5cdGxldCBtYXRjaGVzO1xuXG5cdHdoaWxlICgobWF0Y2hlcyA9IFNUWUxFX1JFR0VYLmV4ZWMoc3R5bGUpKSAhPT0gbnVsbCkge1xuXHRcdGNvbnN0IG5hbWUgPSBtYXRjaGVzWzFdO1xuXG5cdFx0aWYgKG1hdGNoZXNbMl0pIHtcblx0XHRcdGNvbnN0IGFyZ3MgPSBwYXJzZUFyZ3VtZW50cyhuYW1lLCBtYXRjaGVzWzJdKTtcblx0XHRcdHJlc3VsdHMucHVzaChbbmFtZV0uY29uY2F0KGFyZ3MpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0cy5wdXNoKFtuYW1lXSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkU3R5bGUoY2hhbGssIHN0eWxlcykge1xuXHRjb25zdCBlbmFibGVkID0ge307XG5cblx0Zm9yIChjb25zdCBsYXllciBvZiBzdHlsZXMpIHtcblx0XHRmb3IgKGNvbnN0IHN0eWxlIG9mIGxheWVyLnN0eWxlcykge1xuXHRcdFx0ZW5hYmxlZFtzdHlsZVswXV0gPSBsYXllci5pbnZlcnNlID8gbnVsbCA6IHN0eWxlLnNsaWNlKDEpO1xuXHRcdH1cblx0fVxuXG5cdGxldCBjdXJyZW50ID0gY2hhbGs7XG5cdGZvciAoY29uc3QgW3N0eWxlTmFtZSwgc3R5bGVzXSBvZiBPYmplY3QuZW50cmllcyhlbmFibGVkKSkge1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShzdHlsZXMpKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRpZiAoIShzdHlsZU5hbWUgaW4gY3VycmVudCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5rbm93biBDaGFsayBzdHlsZTogJHtzdHlsZU5hbWV9YCk7XG5cdFx0fVxuXG5cdFx0Y3VycmVudCA9IHN0eWxlcy5sZW5ndGggPiAwID8gY3VycmVudFtzdHlsZU5hbWVdKC4uLnN0eWxlcykgOiBjdXJyZW50W3N0eWxlTmFtZV07XG5cdH1cblxuXHRyZXR1cm4gY3VycmVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSAoY2hhbGssIHRlbXBvcmFyeSkgPT4ge1xuXHRjb25zdCBzdHlsZXMgPSBbXTtcblx0Y29uc3QgY2h1bmtzID0gW107XG5cdGxldCBjaHVuayA9IFtdO1xuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtcGFyYW1zXG5cdHRlbXBvcmFyeS5yZXBsYWNlKFRFTVBMQVRFX1JFR0VYLCAobSwgZXNjYXBlQ2hhcmFjdGVyLCBpbnZlcnNlLCBzdHlsZSwgY2xvc2UsIGNoYXJhY3RlcikgPT4ge1xuXHRcdGlmIChlc2NhcGVDaGFyYWN0ZXIpIHtcblx0XHRcdGNodW5rLnB1c2godW5lc2NhcGUoZXNjYXBlQ2hhcmFjdGVyKSk7XG5cdFx0fSBlbHNlIGlmIChzdHlsZSkge1xuXHRcdFx0Y29uc3Qgc3RyaW5nID0gY2h1bmsuam9pbignJyk7XG5cdFx0XHRjaHVuayA9IFtdO1xuXHRcdFx0Y2h1bmtzLnB1c2goc3R5bGVzLmxlbmd0aCA9PT0gMCA/IHN0cmluZyA6IGJ1aWxkU3R5bGUoY2hhbGssIHN0eWxlcykoc3RyaW5nKSk7XG5cdFx0XHRzdHlsZXMucHVzaCh7aW52ZXJzZSwgc3R5bGVzOiBwYXJzZVN0eWxlKHN0eWxlKX0pO1xuXHRcdH0gZWxzZSBpZiAoY2xvc2UpIHtcblx0XHRcdGlmIChzdHlsZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRm91bmQgZXh0cmFuZW91cyB9IGluIENoYWxrIHRlbXBsYXRlIGxpdGVyYWwnKTtcblx0XHRcdH1cblxuXHRcdFx0Y2h1bmtzLnB1c2goYnVpbGRTdHlsZShjaGFsaywgc3R5bGVzKShjaHVuay5qb2luKCcnKSkpO1xuXHRcdFx0Y2h1bmsgPSBbXTtcblx0XHRcdHN0eWxlcy5wb3AoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2h1bmsucHVzaChjaGFyYWN0ZXIpO1xuXHRcdH1cblx0fSk7XG5cblx0Y2h1bmtzLnB1c2goY2h1bmsuam9pbignJykpO1xuXG5cdGlmIChzdHlsZXMubGVuZ3RoID4gMCkge1xuXHRcdGNvbnN0IGVyck1lc3NhZ2UgPSBgQ2hhbGsgdGVtcGxhdGUgbGl0ZXJhbCBpcyBtaXNzaW5nICR7c3R5bGVzLmxlbmd0aH0gY2xvc2luZyBicmFja2V0JHtzdHlsZXMubGVuZ3RoID09PSAxID8gJycgOiAncyd9IChcXGB9XFxgKWA7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGVyck1lc3NhZ2UpO1xuXHR9XG5cblx0cmV0dXJuIGNodW5rcy5qb2luKCcnKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN0cmluZ1JlcGxhY2VBbGwgPSAoc3RyaW5nLCBzdWJzdHJpbmcsIHJlcGxhY2VyKSA9PiB7XG5cdGxldCBpbmRleCA9IHN0cmluZy5pbmRleE9mKHN1YnN0cmluZyk7XG5cdGlmIChpbmRleCA9PT0gLTEpIHtcblx0XHRyZXR1cm4gc3RyaW5nO1xuXHR9XG5cblx0Y29uc3Qgc3Vic3RyaW5nTGVuZ3RoID0gc3Vic3RyaW5nLmxlbmd0aDtcblx0bGV0IGVuZEluZGV4ID0gMDtcblx0bGV0IHJldHVyblZhbHVlID0gJyc7XG5cdGRvIHtcblx0XHRyZXR1cm5WYWx1ZSArPSBzdHJpbmcuc3Vic3RyKGVuZEluZGV4LCBpbmRleCAtIGVuZEluZGV4KSArIHN1YnN0cmluZyArIHJlcGxhY2VyO1xuXHRcdGVuZEluZGV4ID0gaW5kZXggKyBzdWJzdHJpbmdMZW5ndGg7XG5cdFx0aW5kZXggPSBzdHJpbmcuaW5kZXhPZihzdWJzdHJpbmcsIGVuZEluZGV4KTtcblx0fSB3aGlsZSAoaW5kZXggIT09IC0xKTtcblxuXHRyZXR1cm5WYWx1ZSArPSBzdHJpbmcuc3Vic3RyKGVuZEluZGV4KTtcblx0cmV0dXJuIHJldHVyblZhbHVlO1xufTtcblxuY29uc3Qgc3RyaW5nRW5jYXNlQ1JMRldpdGhGaXJzdEluZGV4ID0gKHN0cmluZywgcHJlZml4LCBwb3N0Zml4LCBpbmRleCkgPT4ge1xuXHRsZXQgZW5kSW5kZXggPSAwO1xuXHRsZXQgcmV0dXJuVmFsdWUgPSAnJztcblx0ZG8ge1xuXHRcdGNvbnN0IGdvdENSID0gc3RyaW5nW2luZGV4IC0gMV0gPT09ICdcXHInO1xuXHRcdHJldHVyblZhbHVlICs9IHN0cmluZy5zdWJzdHIoZW5kSW5kZXgsIChnb3RDUiA/IGluZGV4IC0gMSA6IGluZGV4KSAtIGVuZEluZGV4KSArIHByZWZpeCArIChnb3RDUiA/ICdcXHJcXG4nIDogJ1xcbicpICsgcG9zdGZpeDtcblx0XHRlbmRJbmRleCA9IGluZGV4ICsgMTtcblx0XHRpbmRleCA9IHN0cmluZy5pbmRleE9mKCdcXG4nLCBlbmRJbmRleCk7XG5cdH0gd2hpbGUgKGluZGV4ICE9PSAtMSk7XG5cblx0cmV0dXJuVmFsdWUgKz0gc3RyaW5nLnN1YnN0cihlbmRJbmRleCk7XG5cdHJldHVybiByZXR1cm5WYWx1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRzdHJpbmdSZXBsYWNlQWxsLFxuXHRzdHJpbmdFbmNhc2VDUkxGV2l0aEZpcnN0SW5kZXhcbn07XG4iLCIvKiBNSVQgbGljZW5zZSAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tbWl4ZWQtb3BlcmF0b3JzICovXG5jb25zdCBjc3NLZXl3b3JkcyA9IHJlcXVpcmUoJ2NvbG9yLW5hbWUnKTtcblxuLy8gTk9URTogY29udmVyc2lvbnMgc2hvdWxkIG9ubHkgcmV0dXJuIHByaW1pdGl2ZSB2YWx1ZXMgKGkuZS4gYXJyYXlzLCBvclxuLy8gICAgICAgdmFsdWVzIHRoYXQgZ2l2ZSBjb3JyZWN0IGB0eXBlb2ZgIHJlc3VsdHMpLlxuLy8gICAgICAgZG8gbm90IHVzZSBib3ggdmFsdWVzIHR5cGVzIChpLmUuIE51bWJlcigpLCBTdHJpbmcoKSwgZXRjLilcblxuY29uc3QgcmV2ZXJzZUtleXdvcmRzID0ge307XG5mb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhjc3NLZXl3b3JkcykpIHtcblx0cmV2ZXJzZUtleXdvcmRzW2Nzc0tleXdvcmRzW2tleV1dID0ga2V5O1xufVxuXG5jb25zdCBjb252ZXJ0ID0ge1xuXHRyZ2I6IHtjaGFubmVsczogMywgbGFiZWxzOiAncmdiJ30sXG5cdGhzbDoge2NoYW5uZWxzOiAzLCBsYWJlbHM6ICdoc2wnfSxcblx0aHN2OiB7Y2hhbm5lbHM6IDMsIGxhYmVsczogJ2hzdid9LFxuXHRod2I6IHtjaGFubmVsczogMywgbGFiZWxzOiAnaHdiJ30sXG5cdGNteWs6IHtjaGFubmVsczogNCwgbGFiZWxzOiAnY215ayd9LFxuXHR4eXo6IHtjaGFubmVsczogMywgbGFiZWxzOiAneHl6J30sXG5cdGxhYjoge2NoYW5uZWxzOiAzLCBsYWJlbHM6ICdsYWInfSxcblx0bGNoOiB7Y2hhbm5lbHM6IDMsIGxhYmVsczogJ2xjaCd9LFxuXHRoZXg6IHtjaGFubmVsczogMSwgbGFiZWxzOiBbJ2hleCddfSxcblx0a2V5d29yZDoge2NoYW5uZWxzOiAxLCBsYWJlbHM6IFsna2V5d29yZCddfSxcblx0YW5zaTE2OiB7Y2hhbm5lbHM6IDEsIGxhYmVsczogWydhbnNpMTYnXX0sXG5cdGFuc2kyNTY6IHtjaGFubmVsczogMSwgbGFiZWxzOiBbJ2Fuc2kyNTYnXX0sXG5cdGhjZzoge2NoYW5uZWxzOiAzLCBsYWJlbHM6IFsnaCcsICdjJywgJ2cnXX0sXG5cdGFwcGxlOiB7Y2hhbm5lbHM6IDMsIGxhYmVsczogWydyMTYnLCAnZzE2JywgJ2IxNiddfSxcblx0Z3JheToge2NoYW5uZWxzOiAxLCBsYWJlbHM6IFsnZ3JheSddfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb252ZXJ0O1xuXG4vLyBIaWRlIC5jaGFubmVscyBhbmQgLmxhYmVscyBwcm9wZXJ0aWVzXG5mb3IgKGNvbnN0IG1vZGVsIG9mIE9iamVjdC5rZXlzKGNvbnZlcnQpKSB7XG5cdGlmICghKCdjaGFubmVscycgaW4gY29udmVydFttb2RlbF0pKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdtaXNzaW5nIGNoYW5uZWxzIHByb3BlcnR5OiAnICsgbW9kZWwpO1xuXHR9XG5cblx0aWYgKCEoJ2xhYmVscycgaW4gY29udmVydFttb2RlbF0pKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdtaXNzaW5nIGNoYW5uZWwgbGFiZWxzIHByb3BlcnR5OiAnICsgbW9kZWwpO1xuXHR9XG5cblx0aWYgKGNvbnZlcnRbbW9kZWxdLmxhYmVscy5sZW5ndGggIT09IGNvbnZlcnRbbW9kZWxdLmNoYW5uZWxzKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdjaGFubmVsIGFuZCBsYWJlbCBjb3VudHMgbWlzbWF0Y2g6ICcgKyBtb2RlbCk7XG5cdH1cblxuXHRjb25zdCB7Y2hhbm5lbHMsIGxhYmVsc30gPSBjb252ZXJ0W21vZGVsXTtcblx0ZGVsZXRlIGNvbnZlcnRbbW9kZWxdLmNoYW5uZWxzO1xuXHRkZWxldGUgY29udmVydFttb2RlbF0ubGFiZWxzO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoY29udmVydFttb2RlbF0sICdjaGFubmVscycsIHt2YWx1ZTogY2hhbm5lbHN9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnZlcnRbbW9kZWxdLCAnbGFiZWxzJywge3ZhbHVlOiBsYWJlbHN9KTtcbn1cblxuY29udmVydC5yZ2IuaHNsID0gZnVuY3Rpb24gKHJnYikge1xuXHRjb25zdCByID0gcmdiWzBdIC8gMjU1O1xuXHRjb25zdCBnID0gcmdiWzFdIC8gMjU1O1xuXHRjb25zdCBiID0gcmdiWzJdIC8gMjU1O1xuXHRjb25zdCBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKTtcblx0Y29uc3QgbWF4ID0gTWF0aC5tYXgociwgZywgYik7XG5cdGNvbnN0IGRlbHRhID0gbWF4IC0gbWluO1xuXHRsZXQgaDtcblx0bGV0IHM7XG5cblx0aWYgKG1heCA9PT0gbWluKSB7XG5cdFx0aCA9IDA7XG5cdH0gZWxzZSBpZiAociA9PT0gbWF4KSB7XG5cdFx0aCA9IChnIC0gYikgLyBkZWx0YTtcblx0fSBlbHNlIGlmIChnID09PSBtYXgpIHtcblx0XHRoID0gMiArIChiIC0gcikgLyBkZWx0YTtcblx0fSBlbHNlIGlmIChiID09PSBtYXgpIHtcblx0XHRoID0gNCArIChyIC0gZykgLyBkZWx0YTtcblx0fVxuXG5cdGggPSBNYXRoLm1pbihoICogNjAsIDM2MCk7XG5cblx0aWYgKGggPCAwKSB7XG5cdFx0aCArPSAzNjA7XG5cdH1cblxuXHRjb25zdCBsID0gKG1pbiArIG1heCkgLyAyO1xuXG5cdGlmIChtYXggPT09IG1pbikge1xuXHRcdHMgPSAwO1xuXHR9IGVsc2UgaWYgKGwgPD0gMC41KSB7XG5cdFx0cyA9IGRlbHRhIC8gKG1heCArIG1pbik7XG5cdH0gZWxzZSB7XG5cdFx0cyA9IGRlbHRhIC8gKDIgLSBtYXggLSBtaW4pO1xuXHR9XG5cblx0cmV0dXJuIFtoLCBzICogMTAwLCBsICogMTAwXTtcbn07XG5cbmNvbnZlcnQucmdiLmhzdiA9IGZ1bmN0aW9uIChyZ2IpIHtcblx0bGV0IHJkaWY7XG5cdGxldCBnZGlmO1xuXHRsZXQgYmRpZjtcblx0bGV0IGg7XG5cdGxldCBzO1xuXG5cdGNvbnN0IHIgPSByZ2JbMF0gLyAyNTU7XG5cdGNvbnN0IGcgPSByZ2JbMV0gLyAyNTU7XG5cdGNvbnN0IGIgPSByZ2JbMl0gLyAyNTU7XG5cdGNvbnN0IHYgPSBNYXRoLm1heChyLCBnLCBiKTtcblx0Y29uc3QgZGlmZiA9IHYgLSBNYXRoLm1pbihyLCBnLCBiKTtcblx0Y29uc3QgZGlmZmMgPSBmdW5jdGlvbiAoYykge1xuXHRcdHJldHVybiAodiAtIGMpIC8gNiAvIGRpZmYgKyAxIC8gMjtcblx0fTtcblxuXHRpZiAoZGlmZiA9PT0gMCkge1xuXHRcdGggPSAwO1xuXHRcdHMgPSAwO1xuXHR9IGVsc2Uge1xuXHRcdHMgPSBkaWZmIC8gdjtcblx0XHRyZGlmID0gZGlmZmMocik7XG5cdFx0Z2RpZiA9IGRpZmZjKGcpO1xuXHRcdGJkaWYgPSBkaWZmYyhiKTtcblxuXHRcdGlmIChyID09PSB2KSB7XG5cdFx0XHRoID0gYmRpZiAtIGdkaWY7XG5cdFx0fSBlbHNlIGlmIChnID09PSB2KSB7XG5cdFx0XHRoID0gKDEgLyAzKSArIHJkaWYgLSBiZGlmO1xuXHRcdH0gZWxzZSBpZiAoYiA9PT0gdikge1xuXHRcdFx0aCA9ICgyIC8gMykgKyBnZGlmIC0gcmRpZjtcblx0XHR9XG5cblx0XHRpZiAoaCA8IDApIHtcblx0XHRcdGggKz0gMTtcblx0XHR9IGVsc2UgaWYgKGggPiAxKSB7XG5cdFx0XHRoIC09IDE7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIFtcblx0XHRoICogMzYwLFxuXHRcdHMgKiAxMDAsXG5cdFx0diAqIDEwMFxuXHRdO1xufTtcblxuY29udmVydC5yZ2IuaHdiID0gZnVuY3Rpb24gKHJnYikge1xuXHRjb25zdCByID0gcmdiWzBdO1xuXHRjb25zdCBnID0gcmdiWzFdO1xuXHRsZXQgYiA9IHJnYlsyXTtcblx0Y29uc3QgaCA9IGNvbnZlcnQucmdiLmhzbChyZ2IpWzBdO1xuXHRjb25zdCB3ID0gMSAvIDI1NSAqIE1hdGgubWluKHIsIE1hdGgubWluKGcsIGIpKTtcblxuXHRiID0gMSAtIDEgLyAyNTUgKiBNYXRoLm1heChyLCBNYXRoLm1heChnLCBiKSk7XG5cblx0cmV0dXJuIFtoLCB3ICogMTAwLCBiICogMTAwXTtcbn07XG5cbmNvbnZlcnQucmdiLmNteWsgPSBmdW5jdGlvbiAocmdiKSB7XG5cdGNvbnN0IHIgPSByZ2JbMF0gLyAyNTU7XG5cdGNvbnN0IGcgPSByZ2JbMV0gLyAyNTU7XG5cdGNvbnN0IGIgPSByZ2JbMl0gLyAyNTU7XG5cblx0Y29uc3QgayA9IE1hdGgubWluKDEgLSByLCAxIC0gZywgMSAtIGIpO1xuXHRjb25zdCBjID0gKDEgLSByIC0gaykgLyAoMSAtIGspIHx8IDA7XG5cdGNvbnN0IG0gPSAoMSAtIGcgLSBrKSAvICgxIC0gaykgfHwgMDtcblx0Y29uc3QgeSA9ICgxIC0gYiAtIGspIC8gKDEgLSBrKSB8fCAwO1xuXG5cdHJldHVybiBbYyAqIDEwMCwgbSAqIDEwMCwgeSAqIDEwMCwgayAqIDEwMF07XG59O1xuXG5mdW5jdGlvbiBjb21wYXJhdGl2ZURpc3RhbmNlKHgsIHkpIHtcblx0Lypcblx0XHRTZWUgaHR0cHM6Ly9lbi5tLndpa2lwZWRpYS5vcmcvd2lraS9FdWNsaWRlYW5fZGlzdGFuY2UjU3F1YXJlZF9FdWNsaWRlYW5fZGlzdGFuY2Vcblx0Ki9cblx0cmV0dXJuIChcblx0XHQoKHhbMF0gLSB5WzBdKSAqKiAyKSArXG5cdFx0KCh4WzFdIC0geVsxXSkgKiogMikgK1xuXHRcdCgoeFsyXSAtIHlbMl0pICoqIDIpXG5cdCk7XG59XG5cbmNvbnZlcnQucmdiLmtleXdvcmQgPSBmdW5jdGlvbiAocmdiKSB7XG5cdGNvbnN0IHJldmVyc2VkID0gcmV2ZXJzZUtleXdvcmRzW3JnYl07XG5cdGlmIChyZXZlcnNlZCkge1xuXHRcdHJldHVybiByZXZlcnNlZDtcblx0fVxuXG5cdGxldCBjdXJyZW50Q2xvc2VzdERpc3RhbmNlID0gSW5maW5pdHk7XG5cdGxldCBjdXJyZW50Q2xvc2VzdEtleXdvcmQ7XG5cblx0Zm9yIChjb25zdCBrZXl3b3JkIG9mIE9iamVjdC5rZXlzKGNzc0tleXdvcmRzKSkge1xuXHRcdGNvbnN0IHZhbHVlID0gY3NzS2V5d29yZHNba2V5d29yZF07XG5cblx0XHQvLyBDb21wdXRlIGNvbXBhcmF0aXZlIGRpc3RhbmNlXG5cdFx0Y29uc3QgZGlzdGFuY2UgPSBjb21wYXJhdGl2ZURpc3RhbmNlKHJnYiwgdmFsdWUpO1xuXG5cdFx0Ly8gQ2hlY2sgaWYgaXRzIGxlc3MsIGlmIHNvIHNldCBhcyBjbG9zZXN0XG5cdFx0aWYgKGRpc3RhbmNlIDwgY3VycmVudENsb3Nlc3REaXN0YW5jZSkge1xuXHRcdFx0Y3VycmVudENsb3Nlc3REaXN0YW5jZSA9IGRpc3RhbmNlO1xuXHRcdFx0Y3VycmVudENsb3Nlc3RLZXl3b3JkID0ga2V5d29yZDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gY3VycmVudENsb3Nlc3RLZXl3b3JkO1xufTtcblxuY29udmVydC5rZXl3b3JkLnJnYiA9IGZ1bmN0aW9uIChrZXl3b3JkKSB7XG5cdHJldHVybiBjc3NLZXl3b3Jkc1trZXl3b3JkXTtcbn07XG5cbmNvbnZlcnQucmdiLnh5eiA9IGZ1bmN0aW9uIChyZ2IpIHtcblx0bGV0IHIgPSByZ2JbMF0gLyAyNTU7XG5cdGxldCBnID0gcmdiWzFdIC8gMjU1O1xuXHRsZXQgYiA9IHJnYlsyXSAvIDI1NTtcblxuXHQvLyBBc3N1bWUgc1JHQlxuXHRyID0gciA+IDAuMDQwNDUgPyAoKChyICsgMC4wNTUpIC8gMS4wNTUpICoqIDIuNCkgOiAociAvIDEyLjkyKTtcblx0ZyA9IGcgPiAwLjA0MDQ1ID8gKCgoZyArIDAuMDU1KSAvIDEuMDU1KSAqKiAyLjQpIDogKGcgLyAxMi45Mik7XG5cdGIgPSBiID4gMC4wNDA0NSA/ICgoKGIgKyAwLjA1NSkgLyAxLjA1NSkgKiogMi40KSA6IChiIC8gMTIuOTIpO1xuXG5cdGNvbnN0IHggPSAociAqIDAuNDEyNCkgKyAoZyAqIDAuMzU3NikgKyAoYiAqIDAuMTgwNSk7XG5cdGNvbnN0IHkgPSAociAqIDAuMjEyNikgKyAoZyAqIDAuNzE1MikgKyAoYiAqIDAuMDcyMik7XG5cdGNvbnN0IHogPSAociAqIDAuMDE5MykgKyAoZyAqIDAuMTE5MikgKyAoYiAqIDAuOTUwNSk7XG5cblx0cmV0dXJuIFt4ICogMTAwLCB5ICogMTAwLCB6ICogMTAwXTtcbn07XG5cbmNvbnZlcnQucmdiLmxhYiA9IGZ1bmN0aW9uIChyZ2IpIHtcblx0Y29uc3QgeHl6ID0gY29udmVydC5yZ2IueHl6KHJnYik7XG5cdGxldCB4ID0geHl6WzBdO1xuXHRsZXQgeSA9IHh5elsxXTtcblx0bGV0IHogPSB4eXpbMl07XG5cblx0eCAvPSA5NS4wNDc7XG5cdHkgLz0gMTAwO1xuXHR6IC89IDEwOC44ODM7XG5cblx0eCA9IHggPiAwLjAwODg1NiA/ICh4ICoqICgxIC8gMykpIDogKDcuNzg3ICogeCkgKyAoMTYgLyAxMTYpO1xuXHR5ID0geSA+IDAuMDA4ODU2ID8gKHkgKiogKDEgLyAzKSkgOiAoNy43ODcgKiB5KSArICgxNiAvIDExNik7XG5cdHogPSB6ID4gMC4wMDg4NTYgPyAoeiAqKiAoMSAvIDMpKSA6ICg3Ljc4NyAqIHopICsgKDE2IC8gMTE2KTtcblxuXHRjb25zdCBsID0gKDExNiAqIHkpIC0gMTY7XG5cdGNvbnN0IGEgPSA1MDAgKiAoeCAtIHkpO1xuXHRjb25zdCBiID0gMjAwICogKHkgLSB6KTtcblxuXHRyZXR1cm4gW2wsIGEsIGJdO1xufTtcblxuY29udmVydC5oc2wucmdiID0gZnVuY3Rpb24gKGhzbCkge1xuXHRjb25zdCBoID0gaHNsWzBdIC8gMzYwO1xuXHRjb25zdCBzID0gaHNsWzFdIC8gMTAwO1xuXHRjb25zdCBsID0gaHNsWzJdIC8gMTAwO1xuXHRsZXQgdDI7XG5cdGxldCB0Mztcblx0bGV0IHZhbDtcblxuXHRpZiAocyA9PT0gMCkge1xuXHRcdHZhbCA9IGwgKiAyNTU7XG5cdFx0cmV0dXJuIFt2YWwsIHZhbCwgdmFsXTtcblx0fVxuXG5cdGlmIChsIDwgMC41KSB7XG5cdFx0dDIgPSBsICogKDEgKyBzKTtcblx0fSBlbHNlIHtcblx0XHR0MiA9IGwgKyBzIC0gbCAqIHM7XG5cdH1cblxuXHRjb25zdCB0MSA9IDIgKiBsIC0gdDI7XG5cblx0Y29uc3QgcmdiID0gWzAsIDAsIDBdO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuXHRcdHQzID0gaCArIDEgLyAzICogLShpIC0gMSk7XG5cdFx0aWYgKHQzIDwgMCkge1xuXHRcdFx0dDMrKztcblx0XHR9XG5cblx0XHRpZiAodDMgPiAxKSB7XG5cdFx0XHR0My0tO1xuXHRcdH1cblxuXHRcdGlmICg2ICogdDMgPCAxKSB7XG5cdFx0XHR2YWwgPSB0MSArICh0MiAtIHQxKSAqIDYgKiB0Mztcblx0XHR9IGVsc2UgaWYgKDIgKiB0MyA8IDEpIHtcblx0XHRcdHZhbCA9IHQyO1xuXHRcdH0gZWxzZSBpZiAoMyAqIHQzIDwgMikge1xuXHRcdFx0dmFsID0gdDEgKyAodDIgLSB0MSkgKiAoMiAvIDMgLSB0MykgKiA2O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YWwgPSB0MTtcblx0XHR9XG5cblx0XHRyZ2JbaV0gPSB2YWwgKiAyNTU7XG5cdH1cblxuXHRyZXR1cm4gcmdiO1xufTtcblxuY29udmVydC5oc2wuaHN2ID0gZnVuY3Rpb24gKGhzbCkge1xuXHRjb25zdCBoID0gaHNsWzBdO1xuXHRsZXQgcyA9IGhzbFsxXSAvIDEwMDtcblx0bGV0IGwgPSBoc2xbMl0gLyAxMDA7XG5cdGxldCBzbWluID0gcztcblx0Y29uc3QgbG1pbiA9IE1hdGgubWF4KGwsIDAuMDEpO1xuXG5cdGwgKj0gMjtcblx0cyAqPSAobCA8PSAxKSA/IGwgOiAyIC0gbDtcblx0c21pbiAqPSBsbWluIDw9IDEgPyBsbWluIDogMiAtIGxtaW47XG5cdGNvbnN0IHYgPSAobCArIHMpIC8gMjtcblx0Y29uc3Qgc3YgPSBsID09PSAwID8gKDIgKiBzbWluKSAvIChsbWluICsgc21pbikgOiAoMiAqIHMpIC8gKGwgKyBzKTtcblxuXHRyZXR1cm4gW2gsIHN2ICogMTAwLCB2ICogMTAwXTtcbn07XG5cbmNvbnZlcnQuaHN2LnJnYiA9IGZ1bmN0aW9uIChoc3YpIHtcblx0Y29uc3QgaCA9IGhzdlswXSAvIDYwO1xuXHRjb25zdCBzID0gaHN2WzFdIC8gMTAwO1xuXHRsZXQgdiA9IGhzdlsyXSAvIDEwMDtcblx0Y29uc3QgaGkgPSBNYXRoLmZsb29yKGgpICUgNjtcblxuXHRjb25zdCBmID0gaCAtIE1hdGguZmxvb3IoaCk7XG5cdGNvbnN0IHAgPSAyNTUgKiB2ICogKDEgLSBzKTtcblx0Y29uc3QgcSA9IDI1NSAqIHYgKiAoMSAtIChzICogZikpO1xuXHRjb25zdCB0ID0gMjU1ICogdiAqICgxIC0gKHMgKiAoMSAtIGYpKSk7XG5cdHYgKj0gMjU1O1xuXG5cdHN3aXRjaCAoaGkpIHtcblx0XHRjYXNlIDA6XG5cdFx0XHRyZXR1cm4gW3YsIHQsIHBdO1xuXHRcdGNhc2UgMTpcblx0XHRcdHJldHVybiBbcSwgdiwgcF07XG5cdFx0Y2FzZSAyOlxuXHRcdFx0cmV0dXJuIFtwLCB2LCB0XTtcblx0XHRjYXNlIDM6XG5cdFx0XHRyZXR1cm4gW3AsIHEsIHZdO1xuXHRcdGNhc2UgNDpcblx0XHRcdHJldHVybiBbdCwgcCwgdl07XG5cdFx0Y2FzZSA1OlxuXHRcdFx0cmV0dXJuIFt2LCBwLCBxXTtcblx0fVxufTtcblxuY29udmVydC5oc3YuaHNsID0gZnVuY3Rpb24gKGhzdikge1xuXHRjb25zdCBoID0gaHN2WzBdO1xuXHRjb25zdCBzID0gaHN2WzFdIC8gMTAwO1xuXHRjb25zdCB2ID0gaHN2WzJdIC8gMTAwO1xuXHRjb25zdCB2bWluID0gTWF0aC5tYXgodiwgMC4wMSk7XG5cdGxldCBzbDtcblx0bGV0IGw7XG5cblx0bCA9ICgyIC0gcykgKiB2O1xuXHRjb25zdCBsbWluID0gKDIgLSBzKSAqIHZtaW47XG5cdHNsID0gcyAqIHZtaW47XG5cdHNsIC89IChsbWluIDw9IDEpID8gbG1pbiA6IDIgLSBsbWluO1xuXHRzbCA9IHNsIHx8IDA7XG5cdGwgLz0gMjtcblxuXHRyZXR1cm4gW2gsIHNsICogMTAwLCBsICogMTAwXTtcbn07XG5cbi8vIGh0dHA6Ly9kZXYudzMub3JnL2Nzc3dnL2Nzcy1jb2xvci8jaHdiLXRvLXJnYlxuY29udmVydC5od2IucmdiID0gZnVuY3Rpb24gKGh3Yikge1xuXHRjb25zdCBoID0gaHdiWzBdIC8gMzYwO1xuXHRsZXQgd2ggPSBod2JbMV0gLyAxMDA7XG5cdGxldCBibCA9IGh3YlsyXSAvIDEwMDtcblx0Y29uc3QgcmF0aW8gPSB3aCArIGJsO1xuXHRsZXQgZjtcblxuXHQvLyBXaCArIGJsIGNhbnQgYmUgPiAxXG5cdGlmIChyYXRpbyA+IDEpIHtcblx0XHR3aCAvPSByYXRpbztcblx0XHRibCAvPSByYXRpbztcblx0fVxuXG5cdGNvbnN0IGkgPSBNYXRoLmZsb29yKDYgKiBoKTtcblx0Y29uc3QgdiA9IDEgLSBibDtcblx0ZiA9IDYgKiBoIC0gaTtcblxuXHRpZiAoKGkgJiAweDAxKSAhPT0gMCkge1xuXHRcdGYgPSAxIC0gZjtcblx0fVxuXG5cdGNvbnN0IG4gPSB3aCArIGYgKiAodiAtIHdoKTsgLy8gTGluZWFyIGludGVycG9sYXRpb25cblxuXHRsZXQgcjtcblx0bGV0IGc7XG5cdGxldCBiO1xuXHQvKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cy1wZXItbGluZSxuby1tdWx0aS1zcGFjZXMgKi9cblx0c3dpdGNoIChpKSB7XG5cdFx0ZGVmYXVsdDpcblx0XHRjYXNlIDY6XG5cdFx0Y2FzZSAwOiByID0gdjsgIGcgPSBuOyAgYiA9IHdoOyBicmVhaztcblx0XHRjYXNlIDE6IHIgPSBuOyAgZyA9IHY7ICBiID0gd2g7IGJyZWFrO1xuXHRcdGNhc2UgMjogciA9IHdoOyBnID0gdjsgIGIgPSBuOyBicmVhaztcblx0XHRjYXNlIDM6IHIgPSB3aDsgZyA9IG47ICBiID0gdjsgYnJlYWs7XG5cdFx0Y2FzZSA0OiByID0gbjsgIGcgPSB3aDsgYiA9IHY7IGJyZWFrO1xuXHRcdGNhc2UgNTogciA9IHY7ICBnID0gd2g7IGIgPSBuOyBicmVhaztcblx0fVxuXHQvKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzLXBlci1saW5lLG5vLW11bHRpLXNwYWNlcyAqL1xuXG5cdHJldHVybiBbciAqIDI1NSwgZyAqIDI1NSwgYiAqIDI1NV07XG59O1xuXG5jb252ZXJ0LmNteWsucmdiID0gZnVuY3Rpb24gKGNteWspIHtcblx0Y29uc3QgYyA9IGNteWtbMF0gLyAxMDA7XG5cdGNvbnN0IG0gPSBjbXlrWzFdIC8gMTAwO1xuXHRjb25zdCB5ID0gY215a1syXSAvIDEwMDtcblx0Y29uc3QgayA9IGNteWtbM10gLyAxMDA7XG5cblx0Y29uc3QgciA9IDEgLSBNYXRoLm1pbigxLCBjICogKDEgLSBrKSArIGspO1xuXHRjb25zdCBnID0gMSAtIE1hdGgubWluKDEsIG0gKiAoMSAtIGspICsgayk7XG5cdGNvbnN0IGIgPSAxIC0gTWF0aC5taW4oMSwgeSAqICgxIC0gaykgKyBrKTtcblxuXHRyZXR1cm4gW3IgKiAyNTUsIGcgKiAyNTUsIGIgKiAyNTVdO1xufTtcblxuY29udmVydC54eXoucmdiID0gZnVuY3Rpb24gKHh5eikge1xuXHRjb25zdCB4ID0geHl6WzBdIC8gMTAwO1xuXHRjb25zdCB5ID0geHl6WzFdIC8gMTAwO1xuXHRjb25zdCB6ID0geHl6WzJdIC8gMTAwO1xuXHRsZXQgcjtcblx0bGV0IGc7XG5cdGxldCBiO1xuXG5cdHIgPSAoeCAqIDMuMjQwNikgKyAoeSAqIC0xLjUzNzIpICsgKHogKiAtMC40OTg2KTtcblx0ZyA9ICh4ICogLTAuOTY4OSkgKyAoeSAqIDEuODc1OCkgKyAoeiAqIDAuMDQxNSk7XG5cdGIgPSAoeCAqIDAuMDU1NykgKyAoeSAqIC0wLjIwNDApICsgKHogKiAxLjA1NzApO1xuXG5cdC8vIEFzc3VtZSBzUkdCXG5cdHIgPSByID4gMC4wMDMxMzA4XG5cdFx0PyAoKDEuMDU1ICogKHIgKiogKDEuMCAvIDIuNCkpKSAtIDAuMDU1KVxuXHRcdDogciAqIDEyLjkyO1xuXG5cdGcgPSBnID4gMC4wMDMxMzA4XG5cdFx0PyAoKDEuMDU1ICogKGcgKiogKDEuMCAvIDIuNCkpKSAtIDAuMDU1KVxuXHRcdDogZyAqIDEyLjkyO1xuXG5cdGIgPSBiID4gMC4wMDMxMzA4XG5cdFx0PyAoKDEuMDU1ICogKGIgKiogKDEuMCAvIDIuNCkpKSAtIDAuMDU1KVxuXHRcdDogYiAqIDEyLjkyO1xuXG5cdHIgPSBNYXRoLm1pbihNYXRoLm1heCgwLCByKSwgMSk7XG5cdGcgPSBNYXRoLm1pbihNYXRoLm1heCgwLCBnKSwgMSk7XG5cdGIgPSBNYXRoLm1pbihNYXRoLm1heCgwLCBiKSwgMSk7XG5cblx0cmV0dXJuIFtyICogMjU1LCBnICogMjU1LCBiICogMjU1XTtcbn07XG5cbmNvbnZlcnQueHl6LmxhYiA9IGZ1bmN0aW9uICh4eXopIHtcblx0bGV0IHggPSB4eXpbMF07XG5cdGxldCB5ID0geHl6WzFdO1xuXHRsZXQgeiA9IHh5elsyXTtcblxuXHR4IC89IDk1LjA0Nztcblx0eSAvPSAxMDA7XG5cdHogLz0gMTA4Ljg4MztcblxuXHR4ID0geCA+IDAuMDA4ODU2ID8gKHggKiogKDEgLyAzKSkgOiAoNy43ODcgKiB4KSArICgxNiAvIDExNik7XG5cdHkgPSB5ID4gMC4wMDg4NTYgPyAoeSAqKiAoMSAvIDMpKSA6ICg3Ljc4NyAqIHkpICsgKDE2IC8gMTE2KTtcblx0eiA9IHogPiAwLjAwODg1NiA/ICh6ICoqICgxIC8gMykpIDogKDcuNzg3ICogeikgKyAoMTYgLyAxMTYpO1xuXG5cdGNvbnN0IGwgPSAoMTE2ICogeSkgLSAxNjtcblx0Y29uc3QgYSA9IDUwMCAqICh4IC0geSk7XG5cdGNvbnN0IGIgPSAyMDAgKiAoeSAtIHopO1xuXG5cdHJldHVybiBbbCwgYSwgYl07XG59O1xuXG5jb252ZXJ0LmxhYi54eXogPSBmdW5jdGlvbiAobGFiKSB7XG5cdGNvbnN0IGwgPSBsYWJbMF07XG5cdGNvbnN0IGEgPSBsYWJbMV07XG5cdGNvbnN0IGIgPSBsYWJbMl07XG5cdGxldCB4O1xuXHRsZXQgeTtcblx0bGV0IHo7XG5cblx0eSA9IChsICsgMTYpIC8gMTE2O1xuXHR4ID0gYSAvIDUwMCArIHk7XG5cdHogPSB5IC0gYiAvIDIwMDtcblxuXHRjb25zdCB5MiA9IHkgKiogMztcblx0Y29uc3QgeDIgPSB4ICoqIDM7XG5cdGNvbnN0IHoyID0geiAqKiAzO1xuXHR5ID0geTIgPiAwLjAwODg1NiA/IHkyIDogKHkgLSAxNiAvIDExNikgLyA3Ljc4Nztcblx0eCA9IHgyID4gMC4wMDg4NTYgPyB4MiA6ICh4IC0gMTYgLyAxMTYpIC8gNy43ODc7XG5cdHogPSB6MiA+IDAuMDA4ODU2ID8gejIgOiAoeiAtIDE2IC8gMTE2KSAvIDcuNzg3O1xuXG5cdHggKj0gOTUuMDQ3O1xuXHR5ICo9IDEwMDtcblx0eiAqPSAxMDguODgzO1xuXG5cdHJldHVybiBbeCwgeSwgel07XG59O1xuXG5jb252ZXJ0LmxhYi5sY2ggPSBmdW5jdGlvbiAobGFiKSB7XG5cdGNvbnN0IGwgPSBsYWJbMF07XG5cdGNvbnN0IGEgPSBsYWJbMV07XG5cdGNvbnN0IGIgPSBsYWJbMl07XG5cdGxldCBoO1xuXG5cdGNvbnN0IGhyID0gTWF0aC5hdGFuMihiLCBhKTtcblx0aCA9IGhyICogMzYwIC8gMiAvIE1hdGguUEk7XG5cblx0aWYgKGggPCAwKSB7XG5cdFx0aCArPSAzNjA7XG5cdH1cblxuXHRjb25zdCBjID0gTWF0aC5zcXJ0KGEgKiBhICsgYiAqIGIpO1xuXG5cdHJldHVybiBbbCwgYywgaF07XG59O1xuXG5jb252ZXJ0LmxjaC5sYWIgPSBmdW5jdGlvbiAobGNoKSB7XG5cdGNvbnN0IGwgPSBsY2hbMF07XG5cdGNvbnN0IGMgPSBsY2hbMV07XG5cdGNvbnN0IGggPSBsY2hbMl07XG5cblx0Y29uc3QgaHIgPSBoIC8gMzYwICogMiAqIE1hdGguUEk7XG5cdGNvbnN0IGEgPSBjICogTWF0aC5jb3MoaHIpO1xuXHRjb25zdCBiID0gYyAqIE1hdGguc2luKGhyKTtcblxuXHRyZXR1cm4gW2wsIGEsIGJdO1xufTtcblxuY29udmVydC5yZ2IuYW5zaTE2ID0gZnVuY3Rpb24gKGFyZ3MsIHNhdHVyYXRpb24gPSBudWxsKSB7XG5cdGNvbnN0IFtyLCBnLCBiXSA9IGFyZ3M7XG5cdGxldCB2YWx1ZSA9IHNhdHVyYXRpb24gPT09IG51bGwgPyBjb252ZXJ0LnJnYi5oc3YoYXJncylbMl0gOiBzYXR1cmF0aW9uOyAvLyBIc3YgLT4gYW5zaTE2IG9wdGltaXphdGlvblxuXG5cdHZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZSAvIDUwKTtcblxuXHRpZiAodmFsdWUgPT09IDApIHtcblx0XHRyZXR1cm4gMzA7XG5cdH1cblxuXHRsZXQgYW5zaSA9IDMwXG5cdFx0KyAoKE1hdGgucm91bmQoYiAvIDI1NSkgPDwgMilcblx0XHR8IChNYXRoLnJvdW5kKGcgLyAyNTUpIDw8IDEpXG5cdFx0fCBNYXRoLnJvdW5kKHIgLyAyNTUpKTtcblxuXHRpZiAodmFsdWUgPT09IDIpIHtcblx0XHRhbnNpICs9IDYwO1xuXHR9XG5cblx0cmV0dXJuIGFuc2k7XG59O1xuXG5jb252ZXJ0Lmhzdi5hbnNpMTYgPSBmdW5jdGlvbiAoYXJncykge1xuXHQvLyBPcHRpbWl6YXRpb24gaGVyZTsgd2UgYWxyZWFkeSBrbm93IHRoZSB2YWx1ZSBhbmQgZG9uJ3QgbmVlZCB0byBnZXRcblx0Ly8gaXQgY29udmVydGVkIGZvciB1cy5cblx0cmV0dXJuIGNvbnZlcnQucmdiLmFuc2kxNihjb252ZXJ0Lmhzdi5yZ2IoYXJncyksIGFyZ3NbMl0pO1xufTtcblxuY29udmVydC5yZ2IuYW5zaTI1NiA9IGZ1bmN0aW9uIChhcmdzKSB7XG5cdGNvbnN0IHIgPSBhcmdzWzBdO1xuXHRjb25zdCBnID0gYXJnc1sxXTtcblx0Y29uc3QgYiA9IGFyZ3NbMl07XG5cblx0Ly8gV2UgdXNlIHRoZSBleHRlbmRlZCBncmV5c2NhbGUgcGFsZXR0ZSBoZXJlLCB3aXRoIHRoZSBleGNlcHRpb24gb2Zcblx0Ly8gYmxhY2sgYW5kIHdoaXRlLiBub3JtYWwgcGFsZXR0ZSBvbmx5IGhhcyA0IGdyZXlzY2FsZSBzaGFkZXMuXG5cdGlmIChyID09PSBnICYmIGcgPT09IGIpIHtcblx0XHRpZiAociA8IDgpIHtcblx0XHRcdHJldHVybiAxNjtcblx0XHR9XG5cblx0XHRpZiAociA+IDI0OCkge1xuXHRcdFx0cmV0dXJuIDIzMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gTWF0aC5yb3VuZCgoKHIgLSA4KSAvIDI0NykgKiAyNCkgKyAyMzI7XG5cdH1cblxuXHRjb25zdCBhbnNpID0gMTZcblx0XHQrICgzNiAqIE1hdGgucm91bmQociAvIDI1NSAqIDUpKVxuXHRcdCsgKDYgKiBNYXRoLnJvdW5kKGcgLyAyNTUgKiA1KSlcblx0XHQrIE1hdGgucm91bmQoYiAvIDI1NSAqIDUpO1xuXG5cdHJldHVybiBhbnNpO1xufTtcblxuY29udmVydC5hbnNpMTYucmdiID0gZnVuY3Rpb24gKGFyZ3MpIHtcblx0bGV0IGNvbG9yID0gYXJncyAlIDEwO1xuXG5cdC8vIEhhbmRsZSBncmV5c2NhbGVcblx0aWYgKGNvbG9yID09PSAwIHx8IGNvbG9yID09PSA3KSB7XG5cdFx0aWYgKGFyZ3MgPiA1MCkge1xuXHRcdFx0Y29sb3IgKz0gMy41O1xuXHRcdH1cblxuXHRcdGNvbG9yID0gY29sb3IgLyAxMC41ICogMjU1O1xuXG5cdFx0cmV0dXJuIFtjb2xvciwgY29sb3IsIGNvbG9yXTtcblx0fVxuXG5cdGNvbnN0IG11bHQgPSAofn4oYXJncyA+IDUwKSArIDEpICogMC41O1xuXHRjb25zdCByID0gKChjb2xvciAmIDEpICogbXVsdCkgKiAyNTU7XG5cdGNvbnN0IGcgPSAoKChjb2xvciA+PiAxKSAmIDEpICogbXVsdCkgKiAyNTU7XG5cdGNvbnN0IGIgPSAoKChjb2xvciA+PiAyKSAmIDEpICogbXVsdCkgKiAyNTU7XG5cblx0cmV0dXJuIFtyLCBnLCBiXTtcbn07XG5cbmNvbnZlcnQuYW5zaTI1Ni5yZ2IgPSBmdW5jdGlvbiAoYXJncykge1xuXHQvLyBIYW5kbGUgZ3JleXNjYWxlXG5cdGlmIChhcmdzID49IDIzMikge1xuXHRcdGNvbnN0IGMgPSAoYXJncyAtIDIzMikgKiAxMCArIDg7XG5cdFx0cmV0dXJuIFtjLCBjLCBjXTtcblx0fVxuXG5cdGFyZ3MgLT0gMTY7XG5cblx0bGV0IHJlbTtcblx0Y29uc3QgciA9IE1hdGguZmxvb3IoYXJncyAvIDM2KSAvIDUgKiAyNTU7XG5cdGNvbnN0IGcgPSBNYXRoLmZsb29yKChyZW0gPSBhcmdzICUgMzYpIC8gNikgLyA1ICogMjU1O1xuXHRjb25zdCBiID0gKHJlbSAlIDYpIC8gNSAqIDI1NTtcblxuXHRyZXR1cm4gW3IsIGcsIGJdO1xufTtcblxuY29udmVydC5yZ2IuaGV4ID0gZnVuY3Rpb24gKGFyZ3MpIHtcblx0Y29uc3QgaW50ZWdlciA9ICgoTWF0aC5yb3VuZChhcmdzWzBdKSAmIDB4RkYpIDw8IDE2KVxuXHRcdCsgKChNYXRoLnJvdW5kKGFyZ3NbMV0pICYgMHhGRikgPDwgOClcblx0XHQrIChNYXRoLnJvdW5kKGFyZ3NbMl0pICYgMHhGRik7XG5cblx0Y29uc3Qgc3RyaW5nID0gaW50ZWdlci50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcblx0cmV0dXJuICcwMDAwMDAnLnN1YnN0cmluZyhzdHJpbmcubGVuZ3RoKSArIHN0cmluZztcbn07XG5cbmNvbnZlcnQuaGV4LnJnYiA9IGZ1bmN0aW9uIChhcmdzKSB7XG5cdGNvbnN0IG1hdGNoID0gYXJncy50b1N0cmluZygxNikubWF0Y2goL1thLWYwLTldezZ9fFthLWYwLTldezN9L2kpO1xuXHRpZiAoIW1hdGNoKSB7XG5cdFx0cmV0dXJuIFswLCAwLCAwXTtcblx0fVxuXG5cdGxldCBjb2xvclN0cmluZyA9IG1hdGNoWzBdO1xuXG5cdGlmIChtYXRjaFswXS5sZW5ndGggPT09IDMpIHtcblx0XHRjb2xvclN0cmluZyA9IGNvbG9yU3RyaW5nLnNwbGl0KCcnKS5tYXAoY2hhciA9PiB7XG5cdFx0XHRyZXR1cm4gY2hhciArIGNoYXI7XG5cdFx0fSkuam9pbignJyk7XG5cdH1cblxuXHRjb25zdCBpbnRlZ2VyID0gcGFyc2VJbnQoY29sb3JTdHJpbmcsIDE2KTtcblx0Y29uc3QgciA9IChpbnRlZ2VyID4+IDE2KSAmIDB4RkY7XG5cdGNvbnN0IGcgPSAoaW50ZWdlciA+PiA4KSAmIDB4RkY7XG5cdGNvbnN0IGIgPSBpbnRlZ2VyICYgMHhGRjtcblxuXHRyZXR1cm4gW3IsIGcsIGJdO1xufTtcblxuY29udmVydC5yZ2IuaGNnID0gZnVuY3Rpb24gKHJnYikge1xuXHRjb25zdCByID0gcmdiWzBdIC8gMjU1O1xuXHRjb25zdCBnID0gcmdiWzFdIC8gMjU1O1xuXHRjb25zdCBiID0gcmdiWzJdIC8gMjU1O1xuXHRjb25zdCBtYXggPSBNYXRoLm1heChNYXRoLm1heChyLCBnKSwgYik7XG5cdGNvbnN0IG1pbiA9IE1hdGgubWluKE1hdGgubWluKHIsIGcpLCBiKTtcblx0Y29uc3QgY2hyb21hID0gKG1heCAtIG1pbik7XG5cdGxldCBncmF5c2NhbGU7XG5cdGxldCBodWU7XG5cblx0aWYgKGNocm9tYSA8IDEpIHtcblx0XHRncmF5c2NhbGUgPSBtaW4gLyAoMSAtIGNocm9tYSk7XG5cdH0gZWxzZSB7XG5cdFx0Z3JheXNjYWxlID0gMDtcblx0fVxuXG5cdGlmIChjaHJvbWEgPD0gMCkge1xuXHRcdGh1ZSA9IDA7XG5cdH0gZWxzZVxuXHRpZiAobWF4ID09PSByKSB7XG5cdFx0aHVlID0gKChnIC0gYikgLyBjaHJvbWEpICUgNjtcblx0fSBlbHNlXG5cdGlmIChtYXggPT09IGcpIHtcblx0XHRodWUgPSAyICsgKGIgLSByKSAvIGNocm9tYTtcblx0fSBlbHNlIHtcblx0XHRodWUgPSA0ICsgKHIgLSBnKSAvIGNocm9tYTtcblx0fVxuXG5cdGh1ZSAvPSA2O1xuXHRodWUgJT0gMTtcblxuXHRyZXR1cm4gW2h1ZSAqIDM2MCwgY2hyb21hICogMTAwLCBncmF5c2NhbGUgKiAxMDBdO1xufTtcblxuY29udmVydC5oc2wuaGNnID0gZnVuY3Rpb24gKGhzbCkge1xuXHRjb25zdCBzID0gaHNsWzFdIC8gMTAwO1xuXHRjb25zdCBsID0gaHNsWzJdIC8gMTAwO1xuXG5cdGNvbnN0IGMgPSBsIDwgMC41ID8gKDIuMCAqIHMgKiBsKSA6ICgyLjAgKiBzICogKDEuMCAtIGwpKTtcblxuXHRsZXQgZiA9IDA7XG5cdGlmIChjIDwgMS4wKSB7XG5cdFx0ZiA9IChsIC0gMC41ICogYykgLyAoMS4wIC0gYyk7XG5cdH1cblxuXHRyZXR1cm4gW2hzbFswXSwgYyAqIDEwMCwgZiAqIDEwMF07XG59O1xuXG5jb252ZXJ0Lmhzdi5oY2cgPSBmdW5jdGlvbiAoaHN2KSB7XG5cdGNvbnN0IHMgPSBoc3ZbMV0gLyAxMDA7XG5cdGNvbnN0IHYgPSBoc3ZbMl0gLyAxMDA7XG5cblx0Y29uc3QgYyA9IHMgKiB2O1xuXHRsZXQgZiA9IDA7XG5cblx0aWYgKGMgPCAxLjApIHtcblx0XHRmID0gKHYgLSBjKSAvICgxIC0gYyk7XG5cdH1cblxuXHRyZXR1cm4gW2hzdlswXSwgYyAqIDEwMCwgZiAqIDEwMF07XG59O1xuXG5jb252ZXJ0LmhjZy5yZ2IgPSBmdW5jdGlvbiAoaGNnKSB7XG5cdGNvbnN0IGggPSBoY2dbMF0gLyAzNjA7XG5cdGNvbnN0IGMgPSBoY2dbMV0gLyAxMDA7XG5cdGNvbnN0IGcgPSBoY2dbMl0gLyAxMDA7XG5cblx0aWYgKGMgPT09IDAuMCkge1xuXHRcdHJldHVybiBbZyAqIDI1NSwgZyAqIDI1NSwgZyAqIDI1NV07XG5cdH1cblxuXHRjb25zdCBwdXJlID0gWzAsIDAsIDBdO1xuXHRjb25zdCBoaSA9IChoICUgMSkgKiA2O1xuXHRjb25zdCB2ID0gaGkgJSAxO1xuXHRjb25zdCB3ID0gMSAtIHY7XG5cdGxldCBtZyA9IDA7XG5cblx0LyogZXNsaW50LWRpc2FibGUgbWF4LXN0YXRlbWVudHMtcGVyLWxpbmUgKi9cblx0c3dpdGNoIChNYXRoLmZsb29yKGhpKSkge1xuXHRcdGNhc2UgMDpcblx0XHRcdHB1cmVbMF0gPSAxOyBwdXJlWzFdID0gdjsgcHVyZVsyXSA9IDA7IGJyZWFrO1xuXHRcdGNhc2UgMTpcblx0XHRcdHB1cmVbMF0gPSB3OyBwdXJlWzFdID0gMTsgcHVyZVsyXSA9IDA7IGJyZWFrO1xuXHRcdGNhc2UgMjpcblx0XHRcdHB1cmVbMF0gPSAwOyBwdXJlWzFdID0gMTsgcHVyZVsyXSA9IHY7IGJyZWFrO1xuXHRcdGNhc2UgMzpcblx0XHRcdHB1cmVbMF0gPSAwOyBwdXJlWzFdID0gdzsgcHVyZVsyXSA9IDE7IGJyZWFrO1xuXHRcdGNhc2UgNDpcblx0XHRcdHB1cmVbMF0gPSB2OyBwdXJlWzFdID0gMDsgcHVyZVsyXSA9IDE7IGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRwdXJlWzBdID0gMTsgcHVyZVsxXSA9IDA7IHB1cmVbMl0gPSB3O1xuXHR9XG5cdC8qIGVzbGludC1lbmFibGUgbWF4LXN0YXRlbWVudHMtcGVyLWxpbmUgKi9cblxuXHRtZyA9ICgxLjAgLSBjKSAqIGc7XG5cblx0cmV0dXJuIFtcblx0XHQoYyAqIHB1cmVbMF0gKyBtZykgKiAyNTUsXG5cdFx0KGMgKiBwdXJlWzFdICsgbWcpICogMjU1LFxuXHRcdChjICogcHVyZVsyXSArIG1nKSAqIDI1NVxuXHRdO1xufTtcblxuY29udmVydC5oY2cuaHN2ID0gZnVuY3Rpb24gKGhjZykge1xuXHRjb25zdCBjID0gaGNnWzFdIC8gMTAwO1xuXHRjb25zdCBnID0gaGNnWzJdIC8gMTAwO1xuXG5cdGNvbnN0IHYgPSBjICsgZyAqICgxLjAgLSBjKTtcblx0bGV0IGYgPSAwO1xuXG5cdGlmICh2ID4gMC4wKSB7XG5cdFx0ZiA9IGMgLyB2O1xuXHR9XG5cblx0cmV0dXJuIFtoY2dbMF0sIGYgKiAxMDAsIHYgKiAxMDBdO1xufTtcblxuY29udmVydC5oY2cuaHNsID0gZnVuY3Rpb24gKGhjZykge1xuXHRjb25zdCBjID0gaGNnWzFdIC8gMTAwO1xuXHRjb25zdCBnID0gaGNnWzJdIC8gMTAwO1xuXG5cdGNvbnN0IGwgPSBnICogKDEuMCAtIGMpICsgMC41ICogYztcblx0bGV0IHMgPSAwO1xuXG5cdGlmIChsID4gMC4wICYmIGwgPCAwLjUpIHtcblx0XHRzID0gYyAvICgyICogbCk7XG5cdH0gZWxzZVxuXHRpZiAobCA+PSAwLjUgJiYgbCA8IDEuMCkge1xuXHRcdHMgPSBjIC8gKDIgKiAoMSAtIGwpKTtcblx0fVxuXG5cdHJldHVybiBbaGNnWzBdLCBzICogMTAwLCBsICogMTAwXTtcbn07XG5cbmNvbnZlcnQuaGNnLmh3YiA9IGZ1bmN0aW9uIChoY2cpIHtcblx0Y29uc3QgYyA9IGhjZ1sxXSAvIDEwMDtcblx0Y29uc3QgZyA9IGhjZ1syXSAvIDEwMDtcblx0Y29uc3QgdiA9IGMgKyBnICogKDEuMCAtIGMpO1xuXHRyZXR1cm4gW2hjZ1swXSwgKHYgLSBjKSAqIDEwMCwgKDEgLSB2KSAqIDEwMF07XG59O1xuXG5jb252ZXJ0Lmh3Yi5oY2cgPSBmdW5jdGlvbiAoaHdiKSB7XG5cdGNvbnN0IHcgPSBod2JbMV0gLyAxMDA7XG5cdGNvbnN0IGIgPSBod2JbMl0gLyAxMDA7XG5cdGNvbnN0IHYgPSAxIC0gYjtcblx0Y29uc3QgYyA9IHYgLSB3O1xuXHRsZXQgZyA9IDA7XG5cblx0aWYgKGMgPCAxKSB7XG5cdFx0ZyA9ICh2IC0gYykgLyAoMSAtIGMpO1xuXHR9XG5cblx0cmV0dXJuIFtod2JbMF0sIGMgKiAxMDAsIGcgKiAxMDBdO1xufTtcblxuY29udmVydC5hcHBsZS5yZ2IgPSBmdW5jdGlvbiAoYXBwbGUpIHtcblx0cmV0dXJuIFsoYXBwbGVbMF0gLyA2NTUzNSkgKiAyNTUsIChhcHBsZVsxXSAvIDY1NTM1KSAqIDI1NSwgKGFwcGxlWzJdIC8gNjU1MzUpICogMjU1XTtcbn07XG5cbmNvbnZlcnQucmdiLmFwcGxlID0gZnVuY3Rpb24gKHJnYikge1xuXHRyZXR1cm4gWyhyZ2JbMF0gLyAyNTUpICogNjU1MzUsIChyZ2JbMV0gLyAyNTUpICogNjU1MzUsIChyZ2JbMl0gLyAyNTUpICogNjU1MzVdO1xufTtcblxuY29udmVydC5ncmF5LnJnYiA9IGZ1bmN0aW9uIChhcmdzKSB7XG5cdHJldHVybiBbYXJnc1swXSAvIDEwMCAqIDI1NSwgYXJnc1swXSAvIDEwMCAqIDI1NSwgYXJnc1swXSAvIDEwMCAqIDI1NV07XG59O1xuXG5jb252ZXJ0LmdyYXkuaHNsID0gZnVuY3Rpb24gKGFyZ3MpIHtcblx0cmV0dXJuIFswLCAwLCBhcmdzWzBdXTtcbn07XG5cbmNvbnZlcnQuZ3JheS5oc3YgPSBjb252ZXJ0LmdyYXkuaHNsO1xuXG5jb252ZXJ0LmdyYXkuaHdiID0gZnVuY3Rpb24gKGdyYXkpIHtcblx0cmV0dXJuIFswLCAxMDAsIGdyYXlbMF1dO1xufTtcblxuY29udmVydC5ncmF5LmNteWsgPSBmdW5jdGlvbiAoZ3JheSkge1xuXHRyZXR1cm4gWzAsIDAsIDAsIGdyYXlbMF1dO1xufTtcblxuY29udmVydC5ncmF5LmxhYiA9IGZ1bmN0aW9uIChncmF5KSB7XG5cdHJldHVybiBbZ3JheVswXSwgMCwgMF07XG59O1xuXG5jb252ZXJ0LmdyYXkuaGV4ID0gZnVuY3Rpb24gKGdyYXkpIHtcblx0Y29uc3QgdmFsID0gTWF0aC5yb3VuZChncmF5WzBdIC8gMTAwICogMjU1KSAmIDB4RkY7XG5cdGNvbnN0IGludGVnZXIgPSAodmFsIDw8IDE2KSArICh2YWwgPDwgOCkgKyB2YWw7XG5cblx0Y29uc3Qgc3RyaW5nID0gaW50ZWdlci50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcblx0cmV0dXJuICcwMDAwMDAnLnN1YnN0cmluZyhzdHJpbmcubGVuZ3RoKSArIHN0cmluZztcbn07XG5cbmNvbnZlcnQucmdiLmdyYXkgPSBmdW5jdGlvbiAocmdiKSB7XG5cdGNvbnN0IHZhbCA9IChyZ2JbMF0gKyByZ2JbMV0gKyByZ2JbMl0pIC8gMztcblx0cmV0dXJuIFt2YWwgLyAyNTUgKiAxMDBdO1xufTtcbiIsImNvbnN0IGNvbnZlcnNpb25zID0gcmVxdWlyZSgnLi9jb252ZXJzaW9ucycpO1xuY29uc3Qgcm91dGUgPSByZXF1aXJlKCcuL3JvdXRlJyk7XG5cbmNvbnN0IGNvbnZlcnQgPSB7fTtcblxuY29uc3QgbW9kZWxzID0gT2JqZWN0LmtleXMoY29udmVyc2lvbnMpO1xuXG5mdW5jdGlvbiB3cmFwUmF3KGZuKSB7XG5cdGNvbnN0IHdyYXBwZWRGbiA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG5cdFx0Y29uc3QgYXJnMCA9IGFyZ3NbMF07XG5cdFx0aWYgKGFyZzAgPT09IHVuZGVmaW5lZCB8fCBhcmcwID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gYXJnMDtcblx0XHR9XG5cblx0XHRpZiAoYXJnMC5sZW5ndGggPiAxKSB7XG5cdFx0XHRhcmdzID0gYXJnMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gZm4oYXJncyk7XG5cdH07XG5cblx0Ly8gUHJlc2VydmUgLmNvbnZlcnNpb24gcHJvcGVydHkgaWYgdGhlcmUgaXMgb25lXG5cdGlmICgnY29udmVyc2lvbicgaW4gZm4pIHtcblx0XHR3cmFwcGVkRm4uY29udmVyc2lvbiA9IGZuLmNvbnZlcnNpb247XG5cdH1cblxuXHRyZXR1cm4gd3JhcHBlZEZuO1xufVxuXG5mdW5jdGlvbiB3cmFwUm91bmRlZChmbikge1xuXHRjb25zdCB3cmFwcGVkRm4gPSBmdW5jdGlvbiAoLi4uYXJncykge1xuXHRcdGNvbnN0IGFyZzAgPSBhcmdzWzBdO1xuXG5cdFx0aWYgKGFyZzAgPT09IHVuZGVmaW5lZCB8fCBhcmcwID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gYXJnMDtcblx0XHR9XG5cblx0XHRpZiAoYXJnMC5sZW5ndGggPiAxKSB7XG5cdFx0XHRhcmdzID0gYXJnMDtcblx0XHR9XG5cblx0XHRjb25zdCByZXN1bHQgPSBmbihhcmdzKTtcblxuXHRcdC8vIFdlJ3JlIGFzc3VtaW5nIHRoZSByZXN1bHQgaXMgYW4gYXJyYXkgaGVyZS5cblx0XHQvLyBzZWUgbm90aWNlIGluIGNvbnZlcnNpb25zLmpzOyBkb24ndCB1c2UgYm94IHR5cGVzXG5cdFx0Ly8gaW4gY29udmVyc2lvbiBmdW5jdGlvbnMuXG5cdFx0aWYgKHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRmb3IgKGxldCBsZW4gPSByZXN1bHQubGVuZ3RoLCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdHJlc3VsdFtpXSA9IE1hdGgucm91bmQocmVzdWx0W2ldKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdC8vIFByZXNlcnZlIC5jb252ZXJzaW9uIHByb3BlcnR5IGlmIHRoZXJlIGlzIG9uZVxuXHRpZiAoJ2NvbnZlcnNpb24nIGluIGZuKSB7XG5cdFx0d3JhcHBlZEZuLmNvbnZlcnNpb24gPSBmbi5jb252ZXJzaW9uO1xuXHR9XG5cblx0cmV0dXJuIHdyYXBwZWRGbjtcbn1cblxubW9kZWxzLmZvckVhY2goZnJvbU1vZGVsID0+IHtcblx0Y29udmVydFtmcm9tTW9kZWxdID0ge307XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnZlcnRbZnJvbU1vZGVsXSwgJ2NoYW5uZWxzJywge3ZhbHVlOiBjb252ZXJzaW9uc1tmcm9tTW9kZWxdLmNoYW5uZWxzfSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb252ZXJ0W2Zyb21Nb2RlbF0sICdsYWJlbHMnLCB7dmFsdWU6IGNvbnZlcnNpb25zW2Zyb21Nb2RlbF0ubGFiZWxzfSk7XG5cblx0Y29uc3Qgcm91dGVzID0gcm91dGUoZnJvbU1vZGVsKTtcblx0Y29uc3Qgcm91dGVNb2RlbHMgPSBPYmplY3Qua2V5cyhyb3V0ZXMpO1xuXG5cdHJvdXRlTW9kZWxzLmZvckVhY2godG9Nb2RlbCA9PiB7XG5cdFx0Y29uc3QgZm4gPSByb3V0ZXNbdG9Nb2RlbF07XG5cblx0XHRjb252ZXJ0W2Zyb21Nb2RlbF1bdG9Nb2RlbF0gPSB3cmFwUm91bmRlZChmbik7XG5cdFx0Y29udmVydFtmcm9tTW9kZWxdW3RvTW9kZWxdLnJhdyA9IHdyYXBSYXcoZm4pO1xuXHR9KTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnZlcnQ7XG4iLCJjb25zdCBjb252ZXJzaW9ucyA9IHJlcXVpcmUoJy4vY29udmVyc2lvbnMnKTtcblxuLypcblx0VGhpcyBmdW5jdGlvbiByb3V0ZXMgYSBtb2RlbCB0byBhbGwgb3RoZXIgbW9kZWxzLlxuXG5cdGFsbCBmdW5jdGlvbnMgdGhhdCBhcmUgcm91dGVkIGhhdmUgYSBwcm9wZXJ0eSBgLmNvbnZlcnNpb25gIGF0dGFjaGVkXG5cdHRvIHRoZSByZXR1cm5lZCBzeW50aGV0aWMgZnVuY3Rpb24uIFRoaXMgcHJvcGVydHkgaXMgYW4gYXJyYXlcblx0b2Ygc3RyaW5ncywgZWFjaCB3aXRoIHRoZSBzdGVwcyBpbiBiZXR3ZWVuIHRoZSAnZnJvbScgYW5kICd0bydcblx0Y29sb3IgbW9kZWxzIChpbmNsdXNpdmUpLlxuXG5cdGNvbnZlcnNpb25zIHRoYXQgYXJlIG5vdCBwb3NzaWJsZSBzaW1wbHkgYXJlIG5vdCBpbmNsdWRlZC5cbiovXG5cbmZ1bmN0aW9uIGJ1aWxkR3JhcGgoKSB7XG5cdGNvbnN0IGdyYXBoID0ge307XG5cdC8vIGh0dHBzOi8vanNwZXJmLmNvbS9vYmplY3Qta2V5cy12cy1mb3ItaW4td2l0aC1jbG9zdXJlLzNcblx0Y29uc3QgbW9kZWxzID0gT2JqZWN0LmtleXMoY29udmVyc2lvbnMpO1xuXG5cdGZvciAobGV0IGxlbiA9IG1vZGVscy5sZW5ndGgsIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRncmFwaFttb2RlbHNbaV1dID0ge1xuXHRcdFx0Ly8gaHR0cDovL2pzcGVyZi5jb20vMS12cy1pbmZpbml0eVxuXHRcdFx0Ly8gbWljcm8tb3B0LCBidXQgdGhpcyBpcyBzaW1wbGUuXG5cdFx0XHRkaXN0YW5jZTogLTEsXG5cdFx0XHRwYXJlbnQ6IG51bGxcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIGdyYXBoO1xufVxuXG4vLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CcmVhZHRoLWZpcnN0X3NlYXJjaFxuZnVuY3Rpb24gZGVyaXZlQkZTKGZyb21Nb2RlbCkge1xuXHRjb25zdCBncmFwaCA9IGJ1aWxkR3JhcGgoKTtcblx0Y29uc3QgcXVldWUgPSBbZnJvbU1vZGVsXTsgLy8gVW5zaGlmdCAtPiBxdWV1ZSAtPiBwb3BcblxuXHRncmFwaFtmcm9tTW9kZWxdLmRpc3RhbmNlID0gMDtcblxuXHR3aGlsZSAocXVldWUubGVuZ3RoKSB7XG5cdFx0Y29uc3QgY3VycmVudCA9IHF1ZXVlLnBvcCgpO1xuXHRcdGNvbnN0IGFkamFjZW50cyA9IE9iamVjdC5rZXlzKGNvbnZlcnNpb25zW2N1cnJlbnRdKTtcblxuXHRcdGZvciAobGV0IGxlbiA9IGFkamFjZW50cy5sZW5ndGgsIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGNvbnN0IGFkamFjZW50ID0gYWRqYWNlbnRzW2ldO1xuXHRcdFx0Y29uc3Qgbm9kZSA9IGdyYXBoW2FkamFjZW50XTtcblxuXHRcdFx0aWYgKG5vZGUuZGlzdGFuY2UgPT09IC0xKSB7XG5cdFx0XHRcdG5vZGUuZGlzdGFuY2UgPSBncmFwaFtjdXJyZW50XS5kaXN0YW5jZSArIDE7XG5cdFx0XHRcdG5vZGUucGFyZW50ID0gY3VycmVudDtcblx0XHRcdFx0cXVldWUudW5zaGlmdChhZGphY2VudCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGdyYXBoO1xufVxuXG5mdW5jdGlvbiBsaW5rKGZyb20sIHRvKSB7XG5cdHJldHVybiBmdW5jdGlvbiAoYXJncykge1xuXHRcdHJldHVybiB0byhmcm9tKGFyZ3MpKTtcblx0fTtcbn1cblxuZnVuY3Rpb24gd3JhcENvbnZlcnNpb24odG9Nb2RlbCwgZ3JhcGgpIHtcblx0Y29uc3QgcGF0aCA9IFtncmFwaFt0b01vZGVsXS5wYXJlbnQsIHRvTW9kZWxdO1xuXHRsZXQgZm4gPSBjb252ZXJzaW9uc1tncmFwaFt0b01vZGVsXS5wYXJlbnRdW3RvTW9kZWxdO1xuXG5cdGxldCBjdXIgPSBncmFwaFt0b01vZGVsXS5wYXJlbnQ7XG5cdHdoaWxlIChncmFwaFtjdXJdLnBhcmVudCkge1xuXHRcdHBhdGgudW5zaGlmdChncmFwaFtjdXJdLnBhcmVudCk7XG5cdFx0Zm4gPSBsaW5rKGNvbnZlcnNpb25zW2dyYXBoW2N1cl0ucGFyZW50XVtjdXJdLCBmbik7XG5cdFx0Y3VyID0gZ3JhcGhbY3VyXS5wYXJlbnQ7XG5cdH1cblxuXHRmbi5jb252ZXJzaW9uID0gcGF0aDtcblx0cmV0dXJuIGZuO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmcm9tTW9kZWwpIHtcblx0Y29uc3QgZ3JhcGggPSBkZXJpdmVCRlMoZnJvbU1vZGVsKTtcblx0Y29uc3QgY29udmVyc2lvbiA9IHt9O1xuXG5cdGNvbnN0IG1vZGVscyA9IE9iamVjdC5rZXlzKGdyYXBoKTtcblx0Zm9yIChsZXQgbGVuID0gbW9kZWxzLmxlbmd0aCwgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdGNvbnN0IHRvTW9kZWwgPSBtb2RlbHNbaV07XG5cdFx0Y29uc3Qgbm9kZSA9IGdyYXBoW3RvTW9kZWxdO1xuXG5cdFx0aWYgKG5vZGUucGFyZW50ID09PSBudWxsKSB7XG5cdFx0XHQvLyBObyBwb3NzaWJsZSBjb252ZXJzaW9uLCBvciB0aGlzIG5vZGUgaXMgdGhlIHNvdXJjZSBtb2RlbC5cblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGNvbnZlcnNpb25bdG9Nb2RlbF0gPSB3cmFwQ29udmVyc2lvbih0b01vZGVsLCBncmFwaCk7XG5cdH1cblxuXHRyZXR1cm4gY29udmVyc2lvbjtcbn07XG5cbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCJhbGljZWJsdWVcIjogWzI0MCwgMjQ4LCAyNTVdLFxyXG5cdFwiYW50aXF1ZXdoaXRlXCI6IFsyNTAsIDIzNSwgMjE1XSxcclxuXHRcImFxdWFcIjogWzAsIDI1NSwgMjU1XSxcclxuXHRcImFxdWFtYXJpbmVcIjogWzEyNywgMjU1LCAyMTJdLFxyXG5cdFwiYXp1cmVcIjogWzI0MCwgMjU1LCAyNTVdLFxyXG5cdFwiYmVpZ2VcIjogWzI0NSwgMjQ1LCAyMjBdLFxyXG5cdFwiYmlzcXVlXCI6IFsyNTUsIDIyOCwgMTk2XSxcclxuXHRcImJsYWNrXCI6IFswLCAwLCAwXSxcclxuXHRcImJsYW5jaGVkYWxtb25kXCI6IFsyNTUsIDIzNSwgMjA1XSxcclxuXHRcImJsdWVcIjogWzAsIDAsIDI1NV0sXHJcblx0XCJibHVldmlvbGV0XCI6IFsxMzgsIDQzLCAyMjZdLFxyXG5cdFwiYnJvd25cIjogWzE2NSwgNDIsIDQyXSxcclxuXHRcImJ1cmx5d29vZFwiOiBbMjIyLCAxODQsIDEzNV0sXHJcblx0XCJjYWRldGJsdWVcIjogWzk1LCAxNTgsIDE2MF0sXHJcblx0XCJjaGFydHJldXNlXCI6IFsxMjcsIDI1NSwgMF0sXHJcblx0XCJjaG9jb2xhdGVcIjogWzIxMCwgMTA1LCAzMF0sXHJcblx0XCJjb3JhbFwiOiBbMjU1LCAxMjcsIDgwXSxcclxuXHRcImNvcm5mbG93ZXJibHVlXCI6IFsxMDAsIDE0OSwgMjM3XSxcclxuXHRcImNvcm5zaWxrXCI6IFsyNTUsIDI0OCwgMjIwXSxcclxuXHRcImNyaW1zb25cIjogWzIyMCwgMjAsIDYwXSxcclxuXHRcImN5YW5cIjogWzAsIDI1NSwgMjU1XSxcclxuXHRcImRhcmtibHVlXCI6IFswLCAwLCAxMzldLFxyXG5cdFwiZGFya2N5YW5cIjogWzAsIDEzOSwgMTM5XSxcclxuXHRcImRhcmtnb2xkZW5yb2RcIjogWzE4NCwgMTM0LCAxMV0sXHJcblx0XCJkYXJrZ3JheVwiOiBbMTY5LCAxNjksIDE2OV0sXHJcblx0XCJkYXJrZ3JlZW5cIjogWzAsIDEwMCwgMF0sXHJcblx0XCJkYXJrZ3JleVwiOiBbMTY5LCAxNjksIDE2OV0sXHJcblx0XCJkYXJra2hha2lcIjogWzE4OSwgMTgzLCAxMDddLFxyXG5cdFwiZGFya21hZ2VudGFcIjogWzEzOSwgMCwgMTM5XSxcclxuXHRcImRhcmtvbGl2ZWdyZWVuXCI6IFs4NSwgMTA3LCA0N10sXHJcblx0XCJkYXJrb3JhbmdlXCI6IFsyNTUsIDE0MCwgMF0sXHJcblx0XCJkYXJrb3JjaGlkXCI6IFsxNTMsIDUwLCAyMDRdLFxyXG5cdFwiZGFya3JlZFwiOiBbMTM5LCAwLCAwXSxcclxuXHRcImRhcmtzYWxtb25cIjogWzIzMywgMTUwLCAxMjJdLFxyXG5cdFwiZGFya3NlYWdyZWVuXCI6IFsxNDMsIDE4OCwgMTQzXSxcclxuXHRcImRhcmtzbGF0ZWJsdWVcIjogWzcyLCA2MSwgMTM5XSxcclxuXHRcImRhcmtzbGF0ZWdyYXlcIjogWzQ3LCA3OSwgNzldLFxyXG5cdFwiZGFya3NsYXRlZ3JleVwiOiBbNDcsIDc5LCA3OV0sXHJcblx0XCJkYXJrdHVycXVvaXNlXCI6IFswLCAyMDYsIDIwOV0sXHJcblx0XCJkYXJrdmlvbGV0XCI6IFsxNDgsIDAsIDIxMV0sXHJcblx0XCJkZWVwcGlua1wiOiBbMjU1LCAyMCwgMTQ3XSxcclxuXHRcImRlZXBza3libHVlXCI6IFswLCAxOTEsIDI1NV0sXHJcblx0XCJkaW1ncmF5XCI6IFsxMDUsIDEwNSwgMTA1XSxcclxuXHRcImRpbWdyZXlcIjogWzEwNSwgMTA1LCAxMDVdLFxyXG5cdFwiZG9kZ2VyYmx1ZVwiOiBbMzAsIDE0NCwgMjU1XSxcclxuXHRcImZpcmVicmlja1wiOiBbMTc4LCAzNCwgMzRdLFxyXG5cdFwiZmxvcmFsd2hpdGVcIjogWzI1NSwgMjUwLCAyNDBdLFxyXG5cdFwiZm9yZXN0Z3JlZW5cIjogWzM0LCAxMzksIDM0XSxcclxuXHRcImZ1Y2hzaWFcIjogWzI1NSwgMCwgMjU1XSxcclxuXHRcImdhaW5zYm9yb1wiOiBbMjIwLCAyMjAsIDIyMF0sXHJcblx0XCJnaG9zdHdoaXRlXCI6IFsyNDgsIDI0OCwgMjU1XSxcclxuXHRcImdvbGRcIjogWzI1NSwgMjE1LCAwXSxcclxuXHRcImdvbGRlbnJvZFwiOiBbMjE4LCAxNjUsIDMyXSxcclxuXHRcImdyYXlcIjogWzEyOCwgMTI4LCAxMjhdLFxyXG5cdFwiZ3JlZW5cIjogWzAsIDEyOCwgMF0sXHJcblx0XCJncmVlbnllbGxvd1wiOiBbMTczLCAyNTUsIDQ3XSxcclxuXHRcImdyZXlcIjogWzEyOCwgMTI4LCAxMjhdLFxyXG5cdFwiaG9uZXlkZXdcIjogWzI0MCwgMjU1LCAyNDBdLFxyXG5cdFwiaG90cGlua1wiOiBbMjU1LCAxMDUsIDE4MF0sXHJcblx0XCJpbmRpYW5yZWRcIjogWzIwNSwgOTIsIDkyXSxcclxuXHRcImluZGlnb1wiOiBbNzUsIDAsIDEzMF0sXHJcblx0XCJpdm9yeVwiOiBbMjU1LCAyNTUsIDI0MF0sXHJcblx0XCJraGFraVwiOiBbMjQwLCAyMzAsIDE0MF0sXHJcblx0XCJsYXZlbmRlclwiOiBbMjMwLCAyMzAsIDI1MF0sXHJcblx0XCJsYXZlbmRlcmJsdXNoXCI6IFsyNTUsIDI0MCwgMjQ1XSxcclxuXHRcImxhd25ncmVlblwiOiBbMTI0LCAyNTIsIDBdLFxyXG5cdFwibGVtb25jaGlmZm9uXCI6IFsyNTUsIDI1MCwgMjA1XSxcclxuXHRcImxpZ2h0Ymx1ZVwiOiBbMTczLCAyMTYsIDIzMF0sXHJcblx0XCJsaWdodGNvcmFsXCI6IFsyNDAsIDEyOCwgMTI4XSxcclxuXHRcImxpZ2h0Y3lhblwiOiBbMjI0LCAyNTUsIDI1NV0sXHJcblx0XCJsaWdodGdvbGRlbnJvZHllbGxvd1wiOiBbMjUwLCAyNTAsIDIxMF0sXHJcblx0XCJsaWdodGdyYXlcIjogWzIxMSwgMjExLCAyMTFdLFxyXG5cdFwibGlnaHRncmVlblwiOiBbMTQ0LCAyMzgsIDE0NF0sXHJcblx0XCJsaWdodGdyZXlcIjogWzIxMSwgMjExLCAyMTFdLFxyXG5cdFwibGlnaHRwaW5rXCI6IFsyNTUsIDE4MiwgMTkzXSxcclxuXHRcImxpZ2h0c2FsbW9uXCI6IFsyNTUsIDE2MCwgMTIyXSxcclxuXHRcImxpZ2h0c2VhZ3JlZW5cIjogWzMyLCAxNzgsIDE3MF0sXHJcblx0XCJsaWdodHNreWJsdWVcIjogWzEzNSwgMjA2LCAyNTBdLFxyXG5cdFwibGlnaHRzbGF0ZWdyYXlcIjogWzExOSwgMTM2LCAxNTNdLFxyXG5cdFwibGlnaHRzbGF0ZWdyZXlcIjogWzExOSwgMTM2LCAxNTNdLFxyXG5cdFwibGlnaHRzdGVlbGJsdWVcIjogWzE3NiwgMTk2LCAyMjJdLFxyXG5cdFwibGlnaHR5ZWxsb3dcIjogWzI1NSwgMjU1LCAyMjRdLFxyXG5cdFwibGltZVwiOiBbMCwgMjU1LCAwXSxcclxuXHRcImxpbWVncmVlblwiOiBbNTAsIDIwNSwgNTBdLFxyXG5cdFwibGluZW5cIjogWzI1MCwgMjQwLCAyMzBdLFxyXG5cdFwibWFnZW50YVwiOiBbMjU1LCAwLCAyNTVdLFxyXG5cdFwibWFyb29uXCI6IFsxMjgsIDAsIDBdLFxyXG5cdFwibWVkaXVtYXF1YW1hcmluZVwiOiBbMTAyLCAyMDUsIDE3MF0sXHJcblx0XCJtZWRpdW1ibHVlXCI6IFswLCAwLCAyMDVdLFxyXG5cdFwibWVkaXVtb3JjaGlkXCI6IFsxODYsIDg1LCAyMTFdLFxyXG5cdFwibWVkaXVtcHVycGxlXCI6IFsxNDcsIDExMiwgMjE5XSxcclxuXHRcIm1lZGl1bXNlYWdyZWVuXCI6IFs2MCwgMTc5LCAxMTNdLFxyXG5cdFwibWVkaXVtc2xhdGVibHVlXCI6IFsxMjMsIDEwNCwgMjM4XSxcclxuXHRcIm1lZGl1bXNwcmluZ2dyZWVuXCI6IFswLCAyNTAsIDE1NF0sXHJcblx0XCJtZWRpdW10dXJxdW9pc2VcIjogWzcyLCAyMDksIDIwNF0sXHJcblx0XCJtZWRpdW12aW9sZXRyZWRcIjogWzE5OSwgMjEsIDEzM10sXHJcblx0XCJtaWRuaWdodGJsdWVcIjogWzI1LCAyNSwgMTEyXSxcclxuXHRcIm1pbnRjcmVhbVwiOiBbMjQ1LCAyNTUsIDI1MF0sXHJcblx0XCJtaXN0eXJvc2VcIjogWzI1NSwgMjI4LCAyMjVdLFxyXG5cdFwibW9jY2FzaW5cIjogWzI1NSwgMjI4LCAxODFdLFxyXG5cdFwibmF2YWpvd2hpdGVcIjogWzI1NSwgMjIyLCAxNzNdLFxyXG5cdFwibmF2eVwiOiBbMCwgMCwgMTI4XSxcclxuXHRcIm9sZGxhY2VcIjogWzI1MywgMjQ1LCAyMzBdLFxyXG5cdFwib2xpdmVcIjogWzEyOCwgMTI4LCAwXSxcclxuXHRcIm9saXZlZHJhYlwiOiBbMTA3LCAxNDIsIDM1XSxcclxuXHRcIm9yYW5nZVwiOiBbMjU1LCAxNjUsIDBdLFxyXG5cdFwib3JhbmdlcmVkXCI6IFsyNTUsIDY5LCAwXSxcclxuXHRcIm9yY2hpZFwiOiBbMjE4LCAxMTIsIDIxNF0sXHJcblx0XCJwYWxlZ29sZGVucm9kXCI6IFsyMzgsIDIzMiwgMTcwXSxcclxuXHRcInBhbGVncmVlblwiOiBbMTUyLCAyNTEsIDE1Ml0sXHJcblx0XCJwYWxldHVycXVvaXNlXCI6IFsxNzUsIDIzOCwgMjM4XSxcclxuXHRcInBhbGV2aW9sZXRyZWRcIjogWzIxOSwgMTEyLCAxNDddLFxyXG5cdFwicGFwYXlhd2hpcFwiOiBbMjU1LCAyMzksIDIxM10sXHJcblx0XCJwZWFjaHB1ZmZcIjogWzI1NSwgMjE4LCAxODVdLFxyXG5cdFwicGVydVwiOiBbMjA1LCAxMzMsIDYzXSxcclxuXHRcInBpbmtcIjogWzI1NSwgMTkyLCAyMDNdLFxyXG5cdFwicGx1bVwiOiBbMjIxLCAxNjAsIDIyMV0sXHJcblx0XCJwb3dkZXJibHVlXCI6IFsxNzYsIDIyNCwgMjMwXSxcclxuXHRcInB1cnBsZVwiOiBbMTI4LCAwLCAxMjhdLFxyXG5cdFwicmViZWNjYXB1cnBsZVwiOiBbMTAyLCA1MSwgMTUzXSxcclxuXHRcInJlZFwiOiBbMjU1LCAwLCAwXSxcclxuXHRcInJvc3licm93blwiOiBbMTg4LCAxNDMsIDE0M10sXHJcblx0XCJyb3lhbGJsdWVcIjogWzY1LCAxMDUsIDIyNV0sXHJcblx0XCJzYWRkbGVicm93blwiOiBbMTM5LCA2OSwgMTldLFxyXG5cdFwic2FsbW9uXCI6IFsyNTAsIDEyOCwgMTE0XSxcclxuXHRcInNhbmR5YnJvd25cIjogWzI0NCwgMTY0LCA5Nl0sXHJcblx0XCJzZWFncmVlblwiOiBbNDYsIDEzOSwgODddLFxyXG5cdFwic2Vhc2hlbGxcIjogWzI1NSwgMjQ1LCAyMzhdLFxyXG5cdFwic2llbm5hXCI6IFsxNjAsIDgyLCA0NV0sXHJcblx0XCJzaWx2ZXJcIjogWzE5MiwgMTkyLCAxOTJdLFxyXG5cdFwic2t5Ymx1ZVwiOiBbMTM1LCAyMDYsIDIzNV0sXHJcblx0XCJzbGF0ZWJsdWVcIjogWzEwNiwgOTAsIDIwNV0sXHJcblx0XCJzbGF0ZWdyYXlcIjogWzExMiwgMTI4LCAxNDRdLFxyXG5cdFwic2xhdGVncmV5XCI6IFsxMTIsIDEyOCwgMTQ0XSxcclxuXHRcInNub3dcIjogWzI1NSwgMjUwLCAyNTBdLFxyXG5cdFwic3ByaW5nZ3JlZW5cIjogWzAsIDI1NSwgMTI3XSxcclxuXHRcInN0ZWVsYmx1ZVwiOiBbNzAsIDEzMCwgMTgwXSxcclxuXHRcInRhblwiOiBbMjEwLCAxODAsIDE0MF0sXHJcblx0XCJ0ZWFsXCI6IFswLCAxMjgsIDEyOF0sXHJcblx0XCJ0aGlzdGxlXCI6IFsyMTYsIDE5MSwgMjE2XSxcclxuXHRcInRvbWF0b1wiOiBbMjU1LCA5OSwgNzFdLFxyXG5cdFwidHVycXVvaXNlXCI6IFs2NCwgMjI0LCAyMDhdLFxyXG5cdFwidmlvbGV0XCI6IFsyMzgsIDEzMCwgMjM4XSxcclxuXHRcIndoZWF0XCI6IFsyNDUsIDIyMiwgMTc5XSxcclxuXHRcIndoaXRlXCI6IFsyNTUsIDI1NSwgMjU1XSxcclxuXHRcIndoaXRlc21va2VcIjogWzI0NSwgMjQ1LCAyNDVdLFxyXG5cdFwieWVsbG93XCI6IFsyNTUsIDI1NSwgMF0sXHJcblx0XCJ5ZWxsb3dncmVlblwiOiBbMTU0LCAyMDUsIDUwXVxyXG59O1xyXG4iLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgc2VwID0gcmVxdWlyZSgncGF0aCcpLnNlcCB8fCAnLyc7XG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmaWxlVXJpVG9QYXRoO1xuXG4vKipcbiAqIEZpbGUgVVJJIHRvIFBhdGggZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVyaVxuICogQHJldHVybiB7U3RyaW5nfSBwYXRoXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZpbGVVcmlUb1BhdGggKHVyaSkge1xuICBpZiAoJ3N0cmluZycgIT0gdHlwZW9mIHVyaSB8fFxuICAgICAgdXJpLmxlbmd0aCA8PSA3IHx8XG4gICAgICAnZmlsZTovLycgIT0gdXJpLnN1YnN0cmluZygwLCA3KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ211c3QgcGFzcyBpbiBhIGZpbGU6Ly8gVVJJIHRvIGNvbnZlcnQgdG8gYSBmaWxlIHBhdGgnKTtcbiAgfVxuXG4gIHZhciByZXN0ID0gZGVjb2RlVVJJKHVyaS5zdWJzdHJpbmcoNykpO1xuICB2YXIgZmlyc3RTbGFzaCA9IHJlc3QuaW5kZXhPZignLycpO1xuICB2YXIgaG9zdCA9IHJlc3Quc3Vic3RyaW5nKDAsIGZpcnN0U2xhc2gpO1xuICB2YXIgcGF0aCA9IHJlc3Quc3Vic3RyaW5nKGZpcnN0U2xhc2ggKyAxKTtcblxuICAvLyAyLiAgU2NoZW1lIERlZmluaXRpb25cbiAgLy8gQXMgYSBzcGVjaWFsIGNhc2UsIDxob3N0PiBjYW4gYmUgdGhlIHN0cmluZyBcImxvY2FsaG9zdFwiIG9yIHRoZSBlbXB0eVxuICAvLyBzdHJpbmc7IHRoaXMgaXMgaW50ZXJwcmV0ZWQgYXMgXCJ0aGUgbWFjaGluZSBmcm9tIHdoaWNoIHRoZSBVUkwgaXNcbiAgLy8gYmVpbmcgaW50ZXJwcmV0ZWRcIi5cbiAgaWYgKCdsb2NhbGhvc3QnID09IGhvc3QpIGhvc3QgPSAnJztcblxuICBpZiAoaG9zdCkge1xuICAgIGhvc3QgPSBzZXAgKyBzZXAgKyBob3N0O1xuICB9XG5cbiAgLy8gMy4yICBEcml2ZXMsIGRyaXZlIGxldHRlcnMsIG1vdW50IHBvaW50cywgZmlsZSBzeXN0ZW0gcm9vdFxuICAvLyBEcml2ZSBsZXR0ZXJzIGFyZSBtYXBwZWQgaW50byB0aGUgdG9wIG9mIGEgZmlsZSBVUkkgaW4gdmFyaW91cyB3YXlzLFxuICAvLyBkZXBlbmRpbmcgb24gdGhlIGltcGxlbWVudGF0aW9uOyBzb21lIGFwcGxpY2F0aW9ucyBzdWJzdGl0dXRlXG4gIC8vIHZlcnRpY2FsIGJhciAoXCJ8XCIpIGZvciB0aGUgY29sb24gYWZ0ZXIgdGhlIGRyaXZlIGxldHRlciwgeWllbGRpbmdcbiAgLy8gXCJmaWxlOi8vL2N8L3RtcC90ZXN0LnR4dFwiLiAgSW4gc29tZSBjYXNlcywgdGhlIGNvbG9uIGlzIGxlZnRcbiAgLy8gdW5jaGFuZ2VkLCBhcyBpbiBcImZpbGU6Ly8vYzovdG1wL3Rlc3QudHh0XCIuICBJbiBvdGhlciBjYXNlcywgdGhlXG4gIC8vIGNvbG9uIGlzIHNpbXBseSBvbWl0dGVkLCBhcyBpbiBcImZpbGU6Ly8vYy90bXAvdGVzdC50eHRcIi5cbiAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXiguKylcXHwvLCAnJDE6Jyk7XG5cbiAgLy8gZm9yIFdpbmRvd3MsIHdlIG5lZWQgdG8gaW52ZXJ0IHRoZSBwYXRoIHNlcGFyYXRvcnMgZnJvbSB3aGF0IGEgVVJJIHVzZXNcbiAgaWYgKHNlcCA9PSAnXFxcXCcpIHtcbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8vZywgJ1xcXFwnKTtcbiAgfVxuXG4gIGlmICgvXi4rXFw6Ly50ZXN0KHBhdGgpKSB7XG4gICAgLy8gaGFzIFdpbmRvd3MgZHJpdmUgYXQgYmVnaW5uaW5nIG9mIHBhdGhcbiAgfSBlbHNlIHtcbiAgICAvLyB1bml4IHBhdGjigKZcbiAgICBwYXRoID0gc2VwICsgcGF0aDtcbiAgfVxuXG4gIHJldHVybiBob3N0ICsgcGF0aDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoZmxhZywgYXJndiA9IHByb2Nlc3MuYXJndikgPT4ge1xuXHRjb25zdCBwcmVmaXggPSBmbGFnLnN0YXJ0c1dpdGgoJy0nKSA/ICcnIDogKGZsYWcubGVuZ3RoID09PSAxID8gJy0nIDogJy0tJyk7XG5cdGNvbnN0IHBvc2l0aW9uID0gYXJndi5pbmRleE9mKHByZWZpeCArIGZsYWcpO1xuXHRjb25zdCB0ZXJtaW5hdG9yUG9zaXRpb24gPSBhcmd2LmluZGV4T2YoJy0tJyk7XG5cdHJldHVybiBwb3NpdGlvbiAhPT0gLTEgJiYgKHRlcm1pbmF0b3JQb3NpdGlvbiA9PT0gLTEgfHwgcG9zaXRpb24gPCB0ZXJtaW5hdG9yUG9zaXRpb24pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IG9zID0gcmVxdWlyZSgnb3MnKTtcbmNvbnN0IHR0eSA9IHJlcXVpcmUoJ3R0eScpO1xuY29uc3QgaGFzRmxhZyA9IHJlcXVpcmUoJ2hhcy1mbGFnJyk7XG5cbmNvbnN0IHtlbnZ9ID0gcHJvY2VzcztcblxubGV0IGZvcmNlQ29sb3I7XG5pZiAoaGFzRmxhZygnbm8tY29sb3InKSB8fFxuXHRoYXNGbGFnKCduby1jb2xvcnMnKSB8fFxuXHRoYXNGbGFnKCdjb2xvcj1mYWxzZScpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9yPW5ldmVyJykpIHtcblx0Zm9yY2VDb2xvciA9IDA7XG59IGVsc2UgaWYgKGhhc0ZsYWcoJ2NvbG9yJykgfHxcblx0aGFzRmxhZygnY29sb3JzJykgfHxcblx0aGFzRmxhZygnY29sb3I9dHJ1ZScpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9yPWFsd2F5cycpKSB7XG5cdGZvcmNlQ29sb3IgPSAxO1xufVxuXG5pZiAoJ0ZPUkNFX0NPTE9SJyBpbiBlbnYpIHtcblx0aWYgKGVudi5GT1JDRV9DT0xPUiA9PT0gJ3RydWUnKSB7XG5cdFx0Zm9yY2VDb2xvciA9IDE7XG5cdH0gZWxzZSBpZiAoZW52LkZPUkNFX0NPTE9SID09PSAnZmFsc2UnKSB7XG5cdFx0Zm9yY2VDb2xvciA9IDA7XG5cdH0gZWxzZSB7XG5cdFx0Zm9yY2VDb2xvciA9IGVudi5GT1JDRV9DT0xPUi5sZW5ndGggPT09IDAgPyAxIDogTWF0aC5taW4ocGFyc2VJbnQoZW52LkZPUkNFX0NPTE9SLCAxMCksIDMpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHRyYW5zbGF0ZUxldmVsKGxldmVsKSB7XG5cdGlmIChsZXZlbCA9PT0gMCkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0bGV2ZWwsXG5cdFx0aGFzQmFzaWM6IHRydWUsXG5cdFx0aGFzMjU2OiBsZXZlbCA+PSAyLFxuXHRcdGhhczE2bTogbGV2ZWwgPj0gM1xuXHR9O1xufVxuXG5mdW5jdGlvbiBzdXBwb3J0c0NvbG9yKGhhdmVTdHJlYW0sIHN0cmVhbUlzVFRZKSB7XG5cdGlmIChmb3JjZUNvbG9yID09PSAwKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblxuXHRpZiAoaGFzRmxhZygnY29sb3I9MTZtJykgfHxcblx0XHRoYXNGbGFnKCdjb2xvcj1mdWxsJykgfHxcblx0XHRoYXNGbGFnKCdjb2xvcj10cnVlY29sb3InKSkge1xuXHRcdHJldHVybiAzO1xuXHR9XG5cblx0aWYgKGhhc0ZsYWcoJ2NvbG9yPTI1NicpKSB7XG5cdFx0cmV0dXJuIDI7XG5cdH1cblxuXHRpZiAoaGF2ZVN0cmVhbSAmJiAhc3RyZWFtSXNUVFkgJiYgZm9yY2VDb2xvciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblxuXHRjb25zdCBtaW4gPSBmb3JjZUNvbG9yIHx8IDA7XG5cblx0aWYgKGVudi5URVJNID09PSAnZHVtYicpIHtcblx0XHRyZXR1cm4gbWluO1xuXHR9XG5cblx0aWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcblx0XHQvLyBXaW5kb3dzIDEwIGJ1aWxkIDEwNTg2IGlzIHRoZSBmaXJzdCBXaW5kb3dzIHJlbGVhc2UgdGhhdCBzdXBwb3J0cyAyNTYgY29sb3JzLlxuXHRcdC8vIFdpbmRvd3MgMTAgYnVpbGQgMTQ5MzEgaXMgdGhlIGZpcnN0IHJlbGVhc2UgdGhhdCBzdXBwb3J0cyAxNm0vVHJ1ZUNvbG9yLlxuXHRcdGNvbnN0IG9zUmVsZWFzZSA9IG9zLnJlbGVhc2UoKS5zcGxpdCgnLicpO1xuXHRcdGlmIChcblx0XHRcdE51bWJlcihvc1JlbGVhc2VbMF0pID49IDEwICYmXG5cdFx0XHROdW1iZXIob3NSZWxlYXNlWzJdKSA+PSAxMDU4NlxuXHRcdCkge1xuXHRcdFx0cmV0dXJuIE51bWJlcihvc1JlbGVhc2VbMl0pID49IDE0OTMxID8gMyA6IDI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDE7XG5cdH1cblxuXHRpZiAoJ0NJJyBpbiBlbnYpIHtcblx0XHRpZiAoWydUUkFWSVMnLCAnQ0lSQ0xFQ0knLCAnQVBQVkVZT1InLCAnR0lUTEFCX0NJJywgJ0dJVEhVQl9BQ1RJT05TJywgJ0JVSUxES0lURSddLnNvbWUoc2lnbiA9PiBzaWduIGluIGVudikgfHwgZW52LkNJX05BTUUgPT09ICdjb2Rlc2hpcCcpIHtcblx0XHRcdHJldHVybiAxO1xuXHRcdH1cblxuXHRcdHJldHVybiBtaW47XG5cdH1cblxuXHRpZiAoJ1RFQU1DSVRZX1ZFUlNJT04nIGluIGVudikge1xuXHRcdHJldHVybiAvXig5XFwuKDAqWzEtOV1cXGQqKVxcLnxcXGR7Mix9XFwuKS8udGVzdChlbnYuVEVBTUNJVFlfVkVSU0lPTikgPyAxIDogMDtcblx0fVxuXG5cdGlmIChlbnYuQ09MT1JURVJNID09PSAndHJ1ZWNvbG9yJykge1xuXHRcdHJldHVybiAzO1xuXHR9XG5cblx0aWYgKCdURVJNX1BST0dSQU0nIGluIGVudikge1xuXHRcdGNvbnN0IHZlcnNpb24gPSBwYXJzZUludCgoZW52LlRFUk1fUFJPR1JBTV9WRVJTSU9OIHx8ICcnKS5zcGxpdCgnLicpWzBdLCAxMCk7XG5cblx0XHRzd2l0Y2ggKGVudi5URVJNX1BST0dSQU0pIHtcblx0XHRcdGNhc2UgJ2lUZXJtLmFwcCc6XG5cdFx0XHRcdHJldHVybiB2ZXJzaW9uID49IDMgPyAzIDogMjtcblx0XHRcdGNhc2UgJ0FwcGxlX1Rlcm1pbmFsJzpcblx0XHRcdFx0cmV0dXJuIDI7XG5cdFx0XHQvLyBObyBkZWZhdWx0XG5cdFx0fVxuXHR9XG5cblx0aWYgKC8tMjU2KGNvbG9yKT8kL2kudGVzdChlbnYuVEVSTSkpIHtcblx0XHRyZXR1cm4gMjtcblx0fVxuXG5cdGlmICgvXnNjcmVlbnxeeHRlcm18XnZ0MTAwfF52dDIyMHxecnh2dHxjb2xvcnxhbnNpfGN5Z3dpbnxsaW51eC9pLnRlc3QoZW52LlRFUk0pKSB7XG5cdFx0cmV0dXJuIDE7XG5cdH1cblxuXHRpZiAoJ0NPTE9SVEVSTScgaW4gZW52KSB7XG5cdFx0cmV0dXJuIDE7XG5cdH1cblxuXHRyZXR1cm4gbWluO1xufVxuXG5mdW5jdGlvbiBnZXRTdXBwb3J0TGV2ZWwoc3RyZWFtKSB7XG5cdGNvbnN0IGxldmVsID0gc3VwcG9ydHNDb2xvcihzdHJlYW0sIHN0cmVhbSAmJiBzdHJlYW0uaXNUVFkpO1xuXHRyZXR1cm4gdHJhbnNsYXRlTGV2ZWwobGV2ZWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c3VwcG9ydHNDb2xvcjogZ2V0U3VwcG9ydExldmVsLFxuXHRzdGRvdXQ6IHRyYW5zbGF0ZUxldmVsKHN1cHBvcnRzQ29sb3IodHJ1ZSwgdHR5LmlzYXR0eSgxKSkpLFxuXHRzdGRlcnI6IHRyYW5zbGF0ZUxldmVsKHN1cHBvcnRzQ29sb3IodHJ1ZSwgdHR5LmlzYXR0eSgyKSkpXG59O1xuIiwiLyogRmlsZTogICAgICBTaWRlRWZmZWN0cy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjUgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgXCIuLi9NZXNzYWdlTG9vcFwiO1xuaW1wb3J0IFwiLi4vSG9va1wiO1xuaW1wb3J0IFwiLi4vTm9kZUlwY1wiO1xuaW1wb3J0IFwiLi4vS2V5Ym9hcmRcIjtcbmltcG9ydCBcIi4uL01vbml0b3JcIjtcbmltcG9ydCBcIi4uL1RyZWVcIjtcblxuc2V0VGltZW91dCgoKTogdm9pZCA9Plxue1xuICAgIGltcG9ydChcIi4uL01haW5XaW5kb3dcIik7XG4gICAgaW1wb3J0KFwiLi4vUmVuZGVyZXJGdW5jdGlvbnMuR2VuZXJhdGVkXCIpO1xuICAgIGltcG9ydChcIi4vSW5pdGlhbGl6YXRpb25cIik7XG4gICAgaW1wb3J0KFwiLi9UcmF5XCIpO1xuICAgIGltcG9ydChcIi4uL1dpbkV2ZW50XCIpO1xufSk7XG5cbiIsIi8qIEZpbGU6ICAgIHV0aWwudHNcbiAqIEF1dGhvcjogIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogTGljZW5zZTogTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBISGFuZGxlIH0gZnJvbSBcIi4vVXRpbGl0eS5UeXBlc1wiO1xuaW1wb3J0IHsgVVJMIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB0eXBlIHsgRkJveCB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIFJlc29sdmVIdG1sUGF0aChIdG1sRmlsZU5hbWU6IHN0cmluZywgQ29tcG9uZW50Pzogc3RyaW5nKVxue1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gXCJkZXZlbG9wbWVudFwiKVxuICAgIHtcbiAgICAgICAgY29uc3QgUG9ydDogc3RyaW5nIHwgbnVtYmVyID0gcHJvY2Vzcy5lbnYuUE9SVCB8fCAxMjEyO1xuICAgICAgICBjb25zdCBVcmw6IFVSTCA9IG5ldyBVUkwoYGh0dHA6Ly9sb2NhbGhvc3Q6JHsgUG9ydCB9YCk7XG4gICAgICAgIFVybC5wYXRobmFtZSA9IEh0bWxGaWxlTmFtZTtcbiAgICAgICAgcmV0dXJuIFVybC5ocmVmO1xuICAgIH1cbiAgICBjb25zdCBCYXNlUGF0aDogc3RyaW5nID0gYGZpbGU6Ly8ke3BhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vUmVuZGVyZXIvXCIsIEh0bWxGaWxlTmFtZSl9YDtcbiAgICBpZiAoQ29tcG9uZW50ICE9PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICBjb25zdCBDb21wb25lbnRBcmd1bWVudDogc3RyaW5nID0gYD9Db21wb25lbnQ9JHsgQ29tcG9uZW50IH1gO1xuICAgICAgICByZXR1cm4gQmFzZVBhdGggKyBDb21wb25lbnRBcmd1bWVudDtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgcmV0dXJuIEJhc2VQYXRoO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IEFyZUJveGVzRXF1YWwgPSAoQTogRkJveCwgQjogRkJveCk6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gKFxuICAgICAgICBBLlggPT09IEIuWCAmJlxuICAgICAgICBBLlkgPT09IEIuWSAmJlxuICAgICAgICBBLldpZHRoID09PSBCLldpZHRoICYmXG4gICAgICAgIEEuSGVpZ2h0ID09PSBCLkhlaWdodFxuICAgICk7XG5cbn07XG5cbmV4cG9ydCBjb25zdCBBcmVIYW5kbGVzRXF1YWwgPSAoQTogSEhhbmRsZSwgQjogSEhhbmRsZSk6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gQS5IYW5kbGUgPT09IEIuSGFuZGxlO1xufTtcbiIsIi8qIEZpbGU6ICAgICAgTG9nLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcblxuLyoqIEBUT0RPICovXG5leHBvcnQgY29uc3QgTG9nID0gKC4uLkFyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pOiB2b2lkID0+XG57XG4gICAgY29uc29sZS5sb2coLi4uQXJndW1lbnRzKTtcbiAgICAvLyBwcm9jZXNzLnN0ZG91dC53cml0ZShcbiAgICAvLyAgICAgY2hhbGsuYmdNYWdlbnRhLndoaXRlKFwiIEJhY2tlbmQgXCIpICtcbiAgICAvLyAgICAgXCIgXCIgK1xuICAgIC8vICAgICBKU09OLnN0cmluZ2lmeShBcmd1bWVudHMsIG51bGwsIDQpXG4gICAgLy8gKTtcbn07XG4iLCIvKiBGaWxlOiAgICAgIGluZGV4LnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmV4cG9ydCAqIGZyb20gXCIuL0xvZ1wiO1xuIiwiLyogRmlsZTogICAgICBEaXNwYXRjaGVyLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmV4cG9ydCB0eXBlIFRTdWJzY3JpcHRpb25IYW5kbGU8VD4gPVxue1xuICAgIFN1YnNjcmliZShDYWxsYmFjazogKChBcmd1bWVudDogVCkgPT4gdm9pZCkpOiBudW1iZXI7XG4gICAgVW5zdWJzY3JpYmUoSWQ6IG51bWJlcik6IHZvaWQ7XG59O1xuXG5leHBvcnQgY2xhc3MgVERpc3BhdGNoZXI8VD5cbntcbiAgICBwcml2YXRlIE5leHRMaXN0ZW5lcklkOiBudW1iZXIgPSAwO1xuXG4gICAgcHJpdmF0ZSBMaXN0ZW5lcnM6IE1hcDxudW1iZXIsIChBcmd1bWVudDogVCkgPT4gdm9pZD4gPSBuZXcgTWFwPG51bWJlciwgKEFyZ3VtZW50OiBUKSA9PiB2b2lkPigpO1xuXG4gICAgcHVibGljIEdldEhhbmRsZSA9ICgpOiBUU3Vic2NyaXB0aW9uSGFuZGxlPFQ+ID0+XG4gICAge1xuICAgICAgICBjb25zdCBTdWJzY3JpYmUgPSAoQ2FsbGJhY2s6ICgoQXJndW1lbnQ6IFQpID0+IHZvaWQpKTogbnVtYmVyID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IElkOiBudW1iZXIgPSB0aGlzLk5leHRMaXN0ZW5lcklkKys7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5zZXQoSWQsIENhbGxiYWNrKTtcbiAgICAgICAgICAgIHJldHVybiBJZDtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBVbnN1YnNjcmliZSA9IChJZDogbnVtYmVyKTogdm9pZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5kZWxldGUoSWQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBTdWJzY3JpYmUsXG4gICAgICAgICAgICBVbnN1YnNjcmliZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBEaXNwYXRjaCA9IChNZXNzYWdlOiBUKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuTGlzdGVuZXJzLnNpemUgPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5mb3JFYWNoKChDYWxsYmFjazogKChBcmd1bWVudDogVCkgPT4gdm9pZCkpOiB2b2lkID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25hbWluZy1jb252ZW50aW9uICovXG5leHBvcnQgY2xhc3MgVERpc3BhdGNoZXJfREVQUkVDQVRFRDxUID0gdW5rbm93bj5cbntcbiAgICBwcml2YXRlIE5leHRMaXN0ZW5lcklkOiBudW1iZXIgPSAwO1xuXG4gICAgcHJpdmF0ZSBMaXN0ZW5lcnM6IE1hcDxudW1iZXIsIChBcmd1bWVudDogVCkgPT4gdm9pZD4gPSBuZXcgTWFwPG51bWJlciwgKEFyZ3VtZW50OiBUKSA9PiB2b2lkPigpO1xuXG4gICAgcHVibGljIFN1YnNjcmliZShDYWxsYmFjazogKChBcmd1bWVudDogVCkgPT4gdm9pZCkpOiBudW1iZXJcbiAgICB7XG4gICAgICAgIGNvbnN0IElkOiBudW1iZXIgPSB0aGlzLk5leHRMaXN0ZW5lcklkKys7XG4gICAgICAgIHRoaXMuTGlzdGVuZXJzLnNldChJZCwgQ2FsbGJhY2spO1xuICAgICAgICByZXR1cm4gSWQ7XG4gICAgfVxuXG4gICAgcHVibGljIFVuc3Vic2NyaWJlKElkOiBudW1iZXIpOiB2b2lkXG4gICAge1xuICAgICAgICB0aGlzLkxpc3RlbmVycy5kZWxldGUoSWQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBEaXNwYXRjaCA9IChNZXNzYWdlOiBUKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuTGlzdGVuZXJzLnNpemUgPiAwKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkxpc3RlbmVycy5mb3JFYWNoKChDYWxsYmFjazogKChBcmd1bWVudDogVCkgPT4gdm9pZCkpOiB2b2lkID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuIiwiaW1wb3J0IHsgSW5pdGlhbGl6ZUhvb2tzIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG5Jbml0aWFsaXplSG9va3MoKTtcbiIsIi8qIEZpbGU6ICAgICAgS2V5Ym9hcmQudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI0IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGS2V5Ym9hcmRFdmVudCB9IGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5pbXBvcnQgeyBTdWJzY3JpYmUgYXMgSXBjU3Vic2NyaWJlIH0gZnJvbSBcIi4vTm9kZUlwY1wiO1xuaW1wb3J0IHsgSXNWaXJ0dWFsS2V5IH0gZnJvbSBcIkAvRG9tYWluL0NvbW1vbi9Db21wb25lbnQvS2V5Ym9hcmQvS2V5Ym9hcmRcIjtcbmltcG9ydCB7IFREaXNwYXRjaGVyX0RFUFJFQ0FURUQgfSBmcm9tIFwiLi9EaXNwYXRjaGVyXCI7XG5cbmNsYXNzIEZLZXlib2FyZCBleHRlbmRzIFREaXNwYXRjaGVyX0RFUFJFQ0FURUQ8RktleWJvYXJkRXZlbnQ+XG57XG4gICAgcHVibGljIGNvbnN0cnVjdG9yKClcbiAgICB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBJc0tleURvd246IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIC8qKiBSZXR1cm5zIHRydWUgaWYgdGhlIGBPbktleWAgc2hvdWxkIGNvbnRpbnVlLiAqL1xuICAgIHByaXZhdGUgRGVib3VuY2UgPSAoU3RhdGU6IEZLZXlib2FyZEV2ZW50W1wiU3RhdGVcIl0pOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoU3RhdGUgPT09IFwiRG93blwiKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuSXNLZXlEb3duKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuSXNLZXlEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLklzS2V5RG93biA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHVibGljIE9uS2V5ID0gKC4uLkRhdGE6IEFycmF5PHVua25vd24+KTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgRXZlbnQ6IEZLZXlib2FyZEV2ZW50ID0gRGF0YVswXSBhcyBGS2V5Ym9hcmRFdmVudDtcbiAgICAgICAgY29uc3QgSXNEZWJvdW5jZWQ6IGJvb2xlYW4gPSB0aGlzLkRlYm91bmNlKEV2ZW50LlN0YXRlKTtcbiAgICAgICAgaWYgKElzRGVib3VuY2VkICYmIElzVmlydHVhbEtleShFdmVudC5Wa0NvZGUpKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLkRpc3BhdGNoKEV2ZW50KTtcbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBjb25zdCBLZXlib2FyZDogRktleWJvYXJkID0gbmV3IEZLZXlib2FyZCgpO1xuSXBjU3Vic2NyaWJlKFwiS2V5Ym9hcmRcIiwgS2V5Ym9hcmQuT25LZXkpO1xuIiwiLyogRmlsZTogICAgICBNYWluLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IFwiLi9Db3JlL1NpZGVFZmZlY3RzXCI7XG4iLCIvKiBGaWxlOiAgICBNYWluV2luZG93LnRzXG4gKiBBdXRob3I6ICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIExpY2Vuc2U6IE1JVFxuICovXG5cbmltcG9ydCAqIGFzIFBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IEFubm90YXRlUGFuZWwsIEJyaW5nSW50b1BhbmVsLCBHZXRQYW5lbFNjcmVlbnNob3QsIEdldFBhbmVscywgSXNXaW5kb3dUaWxlZCB9IGZyb20gXCIuL1RyZWVcIjtcbmltcG9ydCB7XG4gICAgQmx1ckJhY2tncm91bmQsXG4gICAgR2V0Rm9jdXNlZFdpbmRvdyxcbiAgICBHZXRXaW5kb3dUaXRsZSxcbiAgICB0eXBlIEhXaW5kb3csXG4gICAgVW5ibHVyQmFja2dyb3VuZCB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IEJyb3dzZXJXaW5kb3csIGFwcCwgaXBjTWFpbiwgc2NyZWVuIH0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgdHlwZSB7IEZBbm5vdGF0ZWRQYW5lbCwgRlBhbmVsIH0gZnJvbSBcIi4vVHJlZS5UeXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBGS2V5Ym9hcmRFdmVudCB9IGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZWaXJ0dWFsS2V5IH0gZnJvbSBcIkAvRG9tYWluL0NvbW1vbi9Db21wb25lbnQvS2V5Ym9hcmQvS2V5Ym9hcmQuVHlwZXNcIjtcbmltcG9ydCB7IEtleWJvYXJkIH0gZnJvbSBcIi4vS2V5Ym9hcmRcIjtcbmltcG9ydCB7IExvZyB9IGZyb20gXCIuL0RldmVsb3BtZW50XCI7XG5pbXBvcnQgeyBSZXNvbHZlSHRtbFBhdGggfSBmcm9tIFwiLi9Db3JlL1V0aWxpdHlcIjtcbmltcG9ydCB7IFZrIH0gZnJvbSBcIkAvRG9tYWluL0NvbW1vbi9Db21wb25lbnQvS2V5Ym9hcmQvS2V5Ym9hcmRcIjtcbmltcG9ydCBjaGFsayBmcm9tIFwiY2hhbGtcIjtcblxubGV0IE1haW5XaW5kb3c6IEJyb3dzZXJXaW5kb3cgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbmNvbnN0IEdldExlYXN0SW52aXNpYmxlUG9zaXRpb24gPSAoKTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9ID0+XG57XG4gICAgY29uc3QgRGlzcGxheXM6IEFycmF5PEVsZWN0cm9uLkRpc3BsYXk+ID0gc2NyZWVuLmdldEFsbERpc3BsYXlzKCk7XG5cbiAgICB0eXBlIEZNb25pdG9yQm91bmRzID0geyBsZWZ0OiBudW1iZXI7IHJpZ2h0OiBudW1iZXI7IHRvcDogbnVtYmVyOyBib3R0b206IG51bWJlciB9O1xuICAgIGNvbnN0IE1vbml0b3JCb3VuZHM6IEFycmF5PEZNb25pdG9yQm91bmRzPiA9IERpc3BsYXlzLm1hcCgoZGlzcGxheTogRWxlY3Ryb24uRGlzcGxheSk6IEZNb25pdG9yQm91bmRzID0+XG4gICAge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYm90dG9tOiBkaXNwbGF5LmJvdW5kcy55ICsgZGlzcGxheS5ib3VuZHMuaGVpZ2h0LFxuICAgICAgICAgICAgbGVmdDogZGlzcGxheS5ib3VuZHMueCxcbiAgICAgICAgICAgIHJpZ2h0OiBkaXNwbGF5LmJvdW5kcy54ICsgZGlzcGxheS5ib3VuZHMud2lkdGgsXG4gICAgICAgICAgICB0b3A6IGRpc3BsYXkuYm91bmRzLnlcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIE1vbml0b3JCb3VuZHMuc29ydCgoQTogRk1vbml0b3JCb3VuZHMsIEI6IEZNb25pdG9yQm91bmRzKSA9PiBBLmxlZnQgLSBCLmxlZnQgfHwgQS50b3AgLSBCLnRvcCk7XG5cbiAgICBjb25zdCBNYXhSaWdodDogbnVtYmVyID0gTWF0aC5tYXgoLi4uTW9uaXRvckJvdW5kcy5tYXAoKGJvdW5kczogRk1vbml0b3JCb3VuZHMpID0+IGJvdW5kcy5yaWdodCkpO1xuICAgIGNvbnN0IE1heEJvdHRvbTogbnVtYmVyID0gTWF0aC5tYXgoLi4uTW9uaXRvckJvdW5kcy5tYXAoKGJvdW5kczogRk1vbml0b3JCb3VuZHMpID0+IGJvdW5kcy5ib3R0b20pKTtcblxuICAgIGNvbnN0IEludmlzaWJsZVg6IG51bWJlciA9IChNYXhSaWdodCArIDEpICogMjtcbiAgICBjb25zdCBJbnZpc2libGVZOiBudW1iZXIgPSAoTWF4Qm90dG9tICsgMSkgKiAyO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogSW52aXNpYmxlWCxcbiAgICAgICAgeTogSW52aXNpYmxlWVxuICAgIH07XG59O1xuXG5jb25zdCBMYXVuY2hNYWluV2luZG93ID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT5cbntcbiAgICBjb25zb2xlLmxvZyhcIkxhdW5jaGluZyBtYWluIHdpbmRvdy5cIik7XG4gICAgTWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICAgICAgYWx3YXlzT25Ub3A6IHRydWUsXG4gICAgICAgIGZyYW1lOiBmYWxzZSxcbiAgICAgICAgaGVpZ2h0OiA5MDAsXG4gICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgIHNraXBUYXNrYmFyOiB0cnVlLFxuICAgICAgICB0aXRsZTogXCJTb3JyZWxsV20gTWFpbiBXaW5kb3dcIixcbiAgICAgICAgdGl0bGVCYXJTdHlsZTogXCJoaWRkZW5cIixcbiAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgICAgIHdlYlByZWZlcmVuY2VzOlxuICAgICAgICB7XG4gICAgICAgICAgICBkZXZUb29sczogZmFsc2UsXG4gICAgICAgICAgICAvLyBkZXZUb29sczogdHJ1ZSxcbiAgICAgICAgICAgIG5vZGVJbnRlZ3JhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHByZWxvYWQ6IGFwcC5pc1BhY2thZ2VkXG4gICAgICAgICAgICAgICAgPyBQYXRoLmpvaW4oX19kaXJuYW1lLCBcIlByZWxvYWQuanNcIilcbiAgICAgICAgICAgICAgICA6IFBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vLi4vLmVyYi9kbGwvcHJlbG9hZC5qc1wiKVxuICAgICAgICB9LFxuICAgICAgICB3aWR0aDogOTAwLFxuICAgICAgICAuLi5HZXRMZWFzdEludmlzaWJsZVBvc2l0aW9uKClcbiAgICB9KTtcblxuICAgIE1haW5XaW5kb3cub24oXCJzaG93XCIsIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCBfSXNBbHdheXNPblRvcDogYm9vbGVhbik6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJOYXZpZ2F0ZVwiLCBcIk1haW5cIik7XG4gICAgfSk7XG5cbiAgICBNYWluV2luZG93Lm9uKFxuICAgICAgICBcInBhZ2UtdGl0bGUtdXBkYXRlZFwiLFxuICAgICAgICAoRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCBfVGl0bGU6IHN0cmluZywgX0V4cGxpY2l0U2V0OiBib29sZWFuKTogdm9pZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgLy8gTWFpbldpbmRvdz8ud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLyoqIEBUT0RPIEZpbmQgYmV0dGVyIHBsYWNlIGZvciB0aGlzLiAqL1xuICAgIGlwY01haW4ub24oXCJHZXRBbm5vdGF0ZWRQYW5lbHNcIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLl9Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgUGFuZWxzOiBBcnJheTxGUGFuZWw+ID0gR2V0UGFuZWxzKCk7XG4gICAgICAgIGNvbnN0IEFubm90YXRlZFBhbmVsczogQXJyYXk8RkFubm90YXRlZFBhbmVsPiA9IChhd2FpdCBQcm9taXNlLmFsbChQYW5lbHMubWFwKEFubm90YXRlUGFuZWwpKSlcbiAgICAgICAgICAgIC5maWx0ZXIoKFZhbHVlOiBGQW5ub3RhdGVkUGFuZWwgfCB1bmRlZmluZWQpOiBib29sZWFuID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9KSBhcyBBcnJheTxGQW5ub3RhdGVkUGFuZWw+O1xuXG4gICAgICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJHZXRBbm5vdGF0ZWRQYW5lbHNcIiwgQW5ub3RhdGVkUGFuZWxzKTtcbiAgICB9KTtcblxuICAgIC8qKiBAVE9ETyBGaW5kIGJldHRlciBwbGFjZSBmb3IgdGhpcy4gKi9cbiAgICBpcGNNYWluLm9uKFwiR2V0UGFuZWxTY3JlZW5zaG90c1wiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uX0FyZ3VtZW50czogQXJyYXk8dW5rbm93bj4pID0+XG4gICAge1xuICAgICAgICBjb25zdCBQYW5lbHM6IEFycmF5PEZQYW5lbD4gPSBHZXRQYW5lbHMoKTtcbiAgICAgICAgY29uc3QgU2NyZWVuc2hvdHM6IEFycmF5PHN0cmluZz4gPSAoYXdhaXQgUHJvbWlzZS5hbGwoUGFuZWxzLm1hcChHZXRQYW5lbFNjcmVlbnNob3QpKSlcbiAgICAgICAgICAgIC5maWx0ZXIoKFZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBib29sZWFuID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFZhbHVlICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9KSBhcyBBcnJheTxzdHJpbmc+O1xuXG4gICAgICAgIE1haW5XaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoXCJHZXRQYW5lbFNjcmVlbnNob3RzXCIsIFNjcmVlbnNob3RzKTtcbiAgICB9KTtcblxuICAgIGlwY01haW4ub24oXCJCcmluZ0ludG9QYW5lbFwiLCBhc3luYyAoX0V2ZW50OiBFbGVjdHJvbi5FdmVudCwgLi4uQXJndW1lbnRzOiBBcnJheTx1bmtub3duPikgPT5cbiAgICB7XG4gICAgICAgIC8vIExvZyhcIkJyaW5nSW50b1BhbmVsXCIsIEFyZ3VtZW50c1swXSk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQnJpbmdJbnRvUGFuZWwgISEgISFcIiwgLi4uQXJndW1lbnRzKTtcbiAgICAgICAgQnJpbmdJbnRvUGFuZWwoQXJndW1lbnRzWzBdIGFzIEZBbm5vdGF0ZWRQYW5lbCk7XG4gICAgfSk7XG5cbiAgICBpcGNNYWluLm9uKFwiVGVhckRvd25cIiwgYXN5bmMgKF9FdmVudDogRWxlY3Ryb24uRXZlbnQsIC4uLl9Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PlxuICAgIHtcbiAgICAgICAgQWN0aXZlV2luZG93ID0gdW5kZWZpbmVkO1xuICAgICAgICBVbmJsdXJCYWNrZ3JvdW5kKCk7XG4gICAgfSk7XG5cbiAgICBpcGNNYWluLm9uKFwiTG9nXCIsIGFzeW5jIChfRXZlbnQ6IEVsZWN0cm9uLkV2ZW50LCAuLi5Bcmd1bWVudHM6IEFycmF5PHVua25vd24+KSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgU3RyaW5naWZpZWRBcmd1bWVudHM6IHN0cmluZyA9IEFyZ3VtZW50c1xuICAgICAgICAgICAgLm1hcCgoQXJndW1lbnQ6IHVua25vd24pOiBzdHJpbmcgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIEFyZ3VtZW50ID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgID8gQXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgOiBKU09OLnN0cmluZ2lmeShBcmd1bWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oKTtcblxuICAgICAgICBjb25zdCBCaXJkaWU6IHN0cmluZyA9IGNoYWxrLmJnTWFnZW50YShcIiDimpvvuI8gXCIpICsgXCIgXCI7XG4gICAgICAgIGxldCBPdXRTdHJpbmc6IHN0cmluZyA9IEJpcmRpZTtcbiAgICAgICAgZm9yIChsZXQgSW5kZXg6IG51bWJlciA9IDA7IEluZGV4IDwgU3RyaW5naWZpZWRBcmd1bWVudHMubGVuZ3RoOyBJbmRleCsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBDaGFyYWN0ZXI6IHN0cmluZyA9IFN0cmluZ2lmaWVkQXJndW1lbnRzW0luZGV4XTtcbiAgICAgICAgICAgIGlmIChDaGFyYWN0ZXIgPT09IFwiXFxuXCIgJiYgSW5kZXggIT09IFN0cmluZ2lmaWVkQXJndW1lbnRzLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgT3V0U3RyaW5nICs9IEJpcmRpZSArIENoYXJhY3RlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBPdXRTdHJpbmcgKz0gQ2hhcmFjdGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coT3V0U3RyaW5nKTtcbiAgICB9KTtcblxuICAgIE1haW5XaW5kb3cubG9hZFVSTChSZXNvbHZlSHRtbFBhdGgoXCJpbmRleC5odG1sXCIpKTtcbn07XG5cbi8qKiBUaGUgd2luZG93IHRoYXQgU29ycmVsbFdtIGlzIGJlaW5nIGRyYXduIG92ZXIuICovXG5sZXQgQWN0aXZlV2luZG93OiBIV2luZG93IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuZXhwb3J0IGNvbnN0IEdldEFjdGl2ZVdpbmRvdyA9ICgpOiBIV2luZG93IHwgdW5kZWZpbmVkID0+XG57XG4gICAgcmV0dXJuIEFjdGl2ZVdpbmRvdztcbn07XG5cbmZ1bmN0aW9uIE9uS2V5KEV2ZW50OiBGS2V5Ym9hcmRFdmVudCk6IHZvaWRcbntcbiAgICBjb25zdCB7IFN0YXRlLCBWa0NvZGUgfSA9IEV2ZW50O1xuICAgIGlmIChNYWluV2luZG93ID09PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqIEBUT0RPIE1ha2UgdGhpcyBhIG1vZGlmaWFibGUgc2V0dGluZy4gKi9cbiAgICBjb25zdCBBY3RpdmF0aW9uS2V5OiBGVmlydHVhbEtleSA9IFZrW1wiRjI0XCJdO1xuXG4gICAgaWYgKFZrQ29kZSA9PT0gQWN0aXZhdGlvbktleSlcbiAgICB7XG4gICAgICAgIGlmIChTdGF0ZSA9PT0gXCJEb3duXCIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChHZXRXaW5kb3dUaXRsZShHZXRGb2N1c2VkV2luZG93KCkpICE9PSBcIlNvcnJlbGxXbSBNYWluIFdpbmRvd1wiKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEFjdGl2ZVdpbmRvdyA9IEdldEZvY3VzZWRXaW5kb3coKTtcbiAgICAgICAgICAgICAgICBjb25zdCBJc1RpbGVkOiBib29sZWFuID0gSXNXaW5kb3dUaWxlZChHZXRGb2N1c2VkV2luZG93KCkpO1xuICAgICAgICAgICAgICAgIExvZyhgRm9jdXNlZCBXaW5kb3cgb2YgSXNUaWxlZCBjYWxsIGlzICR7IEdldFdpbmRvd1RpdGxlKEdldEZvY3VzZWRXaW5kb3coKSkgfS5gKTtcbiAgICAgICAgICAgICAgICBNYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoXCJOYXZpZ2F0ZVwiLCBcIlwiLCB7IElzVGlsZWQgfSk7XG4gICAgICAgICAgICAgICAgQmx1ckJhY2tncm91bmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIFVuYmx1ckJhY2tncm91bmQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICBNYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoXCJLZXlib2FyZFwiLCBFdmVudCk7XG4gICAgfVxufVxuXG5hcHAud2hlblJlYWR5KClcbiAgICAudGhlbihMYXVuY2hNYWluV2luZG93KVxuICAgIC5jYXRjaChjb25zb2xlLmxvZyk7XG5cbktleWJvYXJkLlN1YnNjcmliZShPbktleSk7XG4iLCIvKiBGaWxlOiAgICAgIE1lc3NhZ2VMb29wLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBHYWdlIFNvcnJlbGxcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuLyoqIFRoaXMgZmlsZSBtdXN0IGJlIHNpZGUtZWZmZWN0IGltcG9ydGVkIGJ5IGBNYWluYC4gKi9cblxuaW1wb3J0IHsgSW5pdGlhbGl6ZU1lc3NhZ2VMb29wIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuXG5jb25zdCBSdW5Jbml0aWFsaXplTWVzc2FnZUxvb3AgPSAoKTogdm9pZCA9Plxue1xuICAgIEluaXRpYWxpemVNZXNzYWdlTG9vcCgoKSA9PiB7IH0pO1xufTtcblxuUnVuSW5pdGlhbGl6ZU1lc3NhZ2VMb29wKCk7XG4iLCIvKiBGaWxlOiAgICAgIE1vbml0b3IudHNcbiAqIEF1dGhvcjogICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBDb3B5cmlnaHQ6IChjKSAyMDI1IFNvcnJlbGwgSW50ZWxsZWN0dWFsIFByb3BlcnRpZXNcbiAqIExpY2Vuc2U6ICAgTUlUXG4gKi9cblxuaW1wb3J0IHsgdHlwZSBGTW9uaXRvckluZm8sIEluaXRpYWxpemVNb25pdG9ycyB9IGZyb20gXCJAc29ycmVsbHdtL3dpbmRvd3NcIjtcbmltcG9ydCB7IFN1YnNjcmliZSB9IGZyb20gXCIuL05vZGVJcGNcIjtcbmltcG9ydCB7IFREaXNwYXRjaGVyLCB0eXBlIFRTdWJzY3JpcHRpb25IYW5kbGUgfSBmcm9tIFwiLi9EaXNwYXRjaGVyXCI7XG5cbmNvbnN0IE1vbml0b3JzOiBBcnJheTxGTW9uaXRvckluZm8+ID0gWyBdO1xuXG5leHBvcnQgY29uc3QgR2V0TW9uaXRvcnMgPSAoKTogQXJyYXk8Rk1vbml0b3JJbmZvPiA9Plxue1xuICAgIHJldHVybiBbIC4uLk1vbml0b3JzIF07XG59O1xuXG5jb25zdCBNb25pdG9yc0Rpc3BhdGNoZXI6IFREaXNwYXRjaGVyPEFycmF5PEZNb25pdG9ySW5mbz4+ID0gbmV3IFREaXNwYXRjaGVyPEFycmF5PEZNb25pdG9ySW5mbz4+KCk7XG5leHBvcnQgY29uc3QgTW9uaXRvcnNIYW5kbGU6IFRTdWJzY3JpcHRpb25IYW5kbGU8QXJyYXk8Rk1vbml0b3JJbmZvPj4gPSBNb25pdG9yc0Rpc3BhdGNoZXIuR2V0SGFuZGxlKCk7XG5cbmNvbnN0IE9uTW9uaXRvcnNDaGFuZ2VkID0gKC4uLkRhdGE6IEFycmF5PHVua25vd24+KTogdm9pZCA9Plxue1xuICAgIGNvbnN0IE5ld01vbml0b3JzOiBBcnJheTxGTW9uaXRvckluZm8+ID0gRGF0YVswXSBhcyBBcnJheTxGTW9uaXRvckluZm8+O1xuICAgIE1vbml0b3JzLmxlbmd0aCA9IDA7XG4gICAgTW9uaXRvcnMucHVzaCguLi5OZXdNb25pdG9ycyk7XG4gICAgTW9uaXRvcnNEaXNwYXRjaGVyLkRpc3BhdGNoKE5ld01vbml0b3JzKTtcbn07XG5cbmNvbnN0IEluaXRpYWxpemVNb25pdG9yVHJhY2tpbmcgPSAoKTogdm9pZCA9Plxue1xuICAgIE1vbml0b3JzLnB1c2goLi4uSW5pdGlhbGl6ZU1vbml0b3JzKCkpO1xuICAgIFN1YnNjcmliZShcIk1vbml0b3JzXCIsIE9uTW9uaXRvcnNDaGFuZ2VkKTtcbn07XG5cbkluaXRpYWxpemVNb25pdG9yVHJhY2tpbmcoKTtcbiIsIi8qIEZpbGU6ICAgICAgTm9kZUlwYy50c1xuICogQXV0aG9yOiAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIENvcHlyaWdodDogKGMpIDIwMjQgU29ycmVsbCBJbnRlbGxlY3R1YWwgUHJvcGVydGllc1xuICogTGljZW5zZTogICBNSVRcbiAqL1xuXG5pbXBvcnQgdHlwZSB7IEZJcGNDYWxsYmFjaywgRklwY0NhbGxiYWNrU2VyaWFsaXplZCB9IGZyb20gXCIuL05vZGVJcGMuVHlwZXNcIjtcbmltcG9ydCB7IEluaXRpYWxpemVJcGMgfSBmcm9tIFwiQHNvcnJlbGx3bS93aW5kb3dzXCI7XG5cbmxldCBOZXh0TGlzdGVuZXJJZDogbnVtYmVyID0gMDtcbmNvbnN0IExpc3RlbmVyczogTWFwPG51bWJlciwgRklwY0NhbGxiYWNrU2VyaWFsaXplZD4gPSBuZXcgTWFwPG51bWJlciwgRklwY0NhbGxiYWNrU2VyaWFsaXplZD4oKTtcblxuZXhwb3J0IGNvbnN0IFN1YnNjcmliZSA9IChDaGFubmVsOiBzdHJpbmcsIENhbGxiYWNrOiBGSXBjQ2FsbGJhY2spOiBudW1iZXIgPT5cbntcbiAgICBjb25zdCBJZDogbnVtYmVyID0gTmV4dExpc3RlbmVySWQrKztcbiAgICBMaXN0ZW5lcnMuc2V0KElkLCB7IENhbGxiYWNrLCBDaGFubmVsIH0pO1xuICAgIHJldHVybiBJZDtcbn07XG5cbmV4cG9ydCBjb25zdCBVbnN1YnNjcmliZSA9IChJZDogbnVtYmVyKTogdm9pZCA9Plxue1xuICAgIExpc3RlbmVycy5kZWxldGUoSWQpO1xufTtcblxuZnVuY3Rpb24gT25NZXNzYWdlKENoYW5uZWw6IHN0cmluZywgTWVzc2FnZTogdW5rbm93bilcbntcbiAgICBMaXN0ZW5lcnMuZm9yRWFjaCgoQ2FsbGJhY2s6IEZJcGNDYWxsYmFja1NlcmlhbGl6ZWQpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAoQ2FsbGJhY2suQ2hhbm5lbCA9PT0gQ2hhbm5lbClcbiAgICAgICAge1xuICAgICAgICAgICAgQ2FsbGJhY2suQ2FsbGJhY2soTWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuSW5pdGlhbGl6ZUlwYyhPbk1lc3NhZ2UpO1xuIiwiLyogRmlsZTogICAgICBUcmVlLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNSBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB7XG4gICAgQ2FwdHVyZVNjcmVlblNlY3Rpb25Ub1RlbXBQbmdGaWxlLFxuICAgIHR5cGUgRk1vbml0b3JJbmZvLFxuICAgIEdldEFwcGxpY2F0aW9uRnJpZW5kbHlOYW1lLFxuICAgIEdldE1vbml0b3JGcmllbmRseU5hbWUsXG4gICAgR2V0TW9uaXRvckZyb21XaW5kb3csXG4gICAgR2V0VGlsZWFibGVXaW5kb3dzLFxuICAgIEdldFdpbmRvd1RpdGxlLFxuICAgIHR5cGUgSE1vbml0b3IsXG4gICAgdHlwZSBIV2luZG93LFxuICAgIFNldFdpbmRvd1Bvc2l0aW9uIH0gZnJvbSBcIkBzb3JyZWxsd20vd2luZG93c1wiO1xuaW1wb3J0IHR5cGUge1xuICAgIEZBbm5vdGF0ZWRQYW5lbCxcbiAgICBGQ2VsbCxcbiAgICBGRm9yZXN0LFxuICAgIEZQYW5lbCxcbiAgICBGUGFuZWxCYXNlLFxuICAgIEZQYW5lbEhvcml6b250YWwsXG4gICAgRlZlcnRleCB9IGZyb20gXCIuL1RyZWUuVHlwZXNcIjtcbmltcG9ydCB7IEFyZUJveGVzRXF1YWwsIEFyZUhhbmRsZXNFcXVhbCB9IGZyb20gXCIuL0NvcmUvVXRpbGl0eVwiO1xuaW1wb3J0IHsgcHJvbWlzZXMgYXMgRnMgfSBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IEdldEFjdGl2ZVdpbmRvdyB9IGZyb20gXCIuL01haW5XaW5kb3dcIjtcbmltcG9ydCB7IEdldE1vbml0b3JzIH0gZnJvbSBcIi4vTW9uaXRvclwiO1xuaW1wb3J0IHsgTG9nIH0gZnJvbSBcIi4vRGV2ZWxvcG1lbnRcIjtcbmltcG9ydCB0eXBlIHsgVFByZWRpY2F0ZSB9IGZyb20gXCJAL1V0aWxpdHlcIjtcblxuY29uc3QgRm9yZXN0OiBGRm9yZXN0ID0gWyBdO1xuXG5leHBvcnQgY29uc3QgR2V0Rm9yZXN0ID0gKCk6IEZGb3Jlc3QgPT5cbntcbiAgICByZXR1cm4gWyAuLi5Gb3Jlc3QgXTtcbn07XG5cbi8qKiBAVE9ETyAqL1xuZXhwb3J0IGNvbnN0IExvZ0ZvcmVzdCA9ICgpOiB2b2lkID0+XG57XG59O1xuXG5jb25zdCBDZWxsID0gKEhhbmRsZTogSFdpbmRvdyk6IEZDZWxsID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgSGFuZGxlLFxuICAgICAgICBTaXplOiB7IEhlaWdodDogMCwgV2lkdGg6IDAsIFg6IDAsIFk6IDAgfSxcbiAgICAgICAgWk9yZGVyOiAwXG4gICAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBVcGRhdGVGb3Jlc3QgPSAoVXBkYXRlRnVuY3Rpb246IChPbGRGb3Jlc3Q6IEZGb3Jlc3QpID0+IEZGb3Jlc3QpOiB2b2lkID0+XG57XG4gICAgY29uc3QgTmV3Rm9yZXN0OiBGRm9yZXN0ID0gVXBkYXRlRnVuY3Rpb24oWyAuLi5Gb3Jlc3QgXSk7XG4gICAgRm9yZXN0Lmxlbmd0aCA9IDA7XG4gICAgRm9yZXN0LnB1c2goLi4uTmV3Rm9yZXN0KTtcblxuICAgIC8vIEBUT0RPIE1vdmUgYW5kIHJlc2l6ZSwgYW5kIHNvcnQgWk9yZGVyIG9mIGFsbCB3aW5kb3dzIGJlaW5nIHRpbGVkIGJ5IFNvcnJlbGxXbS5cbn07XG5cbmNvbnN0IEluaXRpYWxpemVUcmVlID0gKCk6IHZvaWQgPT5cbntcbiAgICBjb25zdCBNb25pdG9yczogQXJyYXk8Rk1vbml0b3JJbmZvPiA9IEdldE1vbml0b3JzKCk7XG5cbiAgICBjb25zb2xlLmxvZyhNb25pdG9ycyk7XG5cbiAgICBGb3Jlc3QucHVzaCguLi5Nb25pdG9ycy5tYXAoKE1vbml0b3I6IEZNb25pdG9ySW5mbyk6IEZQYW5lbEhvcml6b250YWwgPT5cbiAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBIZXJlLCBNb25pdG9ySGFuZGxlIGlzICR7IE1vbml0b3IuSGFuZGxlIH0uYCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBDaGlsZHJlbjogWyBdLFxuICAgICAgICAgICAgTW9uaXRvcklkOiBNb25pdG9yLkhhbmRsZSxcbiAgICAgICAgICAgIFNpemU6IE1vbml0b3IuU2l6ZSxcbiAgICAgICAgICAgIFR5cGU6IFwiSG9yaXpvbnRhbFwiLFxuICAgICAgICAgICAgWk9yZGVyOiAwXG4gICAgICAgIH07XG4gICAgfSkpO1xuXG4gICAgY29uc29sZS5sb2coRm9yZXN0KTtcblxuICAgIGNvbnN0IFRpbGVhYmxlV2luZG93czogQXJyYXk8SFdpbmRvdz4gPSBHZXRUaWxlYWJsZVdpbmRvd3MoKTtcblxuICAgIGNvbnNvbGUubG9nKGBGb3VuZCAkeyBUaWxlYWJsZVdpbmRvd3MubGVuZ3RoIH0gdGlsZWFibGUgd2luZG93cy5gKTtcblxuICAgIFRpbGVhYmxlV2luZG93cy5mb3JFYWNoKChIYW5kbGU6IEhXaW5kb3cpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBjb25zdCBNb25pdG9yOiBITW9uaXRvciA9IEdldE1vbml0b3JGcm9tV2luZG93KEhhbmRsZSk7XG4gICAgICAgIGNvbnN0IFJvb3RQYW5lbDogRlBhbmVsQmFzZSB8IHVuZGVmaW5lZCA9XG4gICAgICAgICAgICBGb3Jlc3QuZmluZCgoUGFuZWw6IEZQYW5lbEJhc2UpOiBib29sZWFuID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYE1vbml0b3IgaXMgJHsgSlNPTi5zdHJpbmdpZnkoTW9uaXRvcikgfSBhbmQgUGFuZWwuTW9uaXRvcklkIGlzICR7IEpTT04uc3RyaW5naWZ5KFBhbmVsLk1vbml0b3JJZCkgfS5gKTtcbiAgICAgICAgICAgICAgICBjb25zdCBJbmZvOiBGTW9uaXRvckluZm8gfCB1bmRlZmluZWQgPVxuICAgICAgICAgICAgICAgICAgICBNb25pdG9ycy5maW5kKChGb286IEZNb25pdG9ySW5mbyk6IGJvb2xlYW4gPT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZvby5IYW5kbGUuSGFuZGxlID09PSBQYW5lbC5Nb25pdG9ySWQ/LkhhbmRsZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgU2l6ZSAkeyBKU09OLnN0cmluZ2lmeShJbmZvPy5TaXplKSB9IFdvcmtTaXplICR7IEpTT04uc3RyaW5naWZ5KEluZm8/LldvcmtTaXplKSB9LmApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBhbmVsLk1vbml0b3JJZD8uSGFuZGxlID09PSBNb25pdG9yLkhhbmRsZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChSb290UGFuZWwgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgLy8gQFRPRE9cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi8J+SofCfkqHwn5Kh8J+SoSBSb290UGFuZWwgd2FzIHVuZGVmaW5lZC5cIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBSb290UGFuZWwuQ2hpbGRyZW4ucHVzaChDZWxsKEhhbmRsZSkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBGb3Jlc3QuZm9yRWFjaCgoUGFuZWw6IEZQYW5lbCk6IHZvaWQgPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IE1vbml0b3JJbmZvOiBGTW9uaXRvckluZm8gfCB1bmRlZmluZWQgPVxuICAgICAgICAgICAgTW9uaXRvcnMuZmluZCgoSW5Nb25pdG9yOiBGTW9uaXRvckluZm8pOiBib29sZWFuID0+IEluTW9uaXRvci5IYW5kbGUgPT09IFBhbmVsLk1vbml0b3JJZCk7XG5cbiAgICAgICAgaWYgKE1vbml0b3JJbmZvID09PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vIEBUT0RPXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICBQYW5lbC5DaGlsZHJlbiA9IFBhbmVsLkNoaWxkcmVuLm1hcCgoQ2hpbGQ6IEZWZXJ0ZXgsIEluZGV4OiBudW1iZXIpOiBGVmVydGV4ID0+XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc3QgVW5pZm9ybVdpZHRoOiBudW1iZXIgPSBNb25pdG9ySW5mby5Xb3JrU2l6ZS5XaWR0aCAvIFBhbmVsLkNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBPdXRDaGlsZDogRlZlcnRleCA9IHsgLi4uQ2hpbGQgfTtcbiAgICAgICAgICAgICAgICBPdXRDaGlsZC5TaXplID1cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIC4uLk1vbml0b3JJbmZvLldvcmtTaXplLFxuICAgICAgICAgICAgICAgICAgICBXaWR0aDogVW5pZm9ybVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICBYOiBVbmlmb3JtV2lkdGggKiBJbmRleCArIE1vbml0b3JJbmZvLldvcmtTaXplLlhcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIE91dENoaWxkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IENlbGxzOiBBcnJheTxGQ2VsbD4gPSBHZXRBbGxDZWxscyhGb3Jlc3QpO1xuXG4gICAgQ2VsbHMuZm9yRWFjaCgoQ2VsbDogRkNlbGwpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBjb25zb2xlLmxvZyhgU2V0dGluZyBwb3NpdGlvbiBvZiAkeyBHZXRXaW5kb3dUaXRsZShDZWxsLkhhbmRsZSkgfSB0byAkeyBKU09OLnN0cmluZ2lmeShDZWxsLlNpemUpIH0uYCk7XG4gICAgICAgIFNldFdpbmRvd1Bvc2l0aW9uKENlbGwuSGFuZGxlLCBDZWxsLlNpemUpO1xuICAgICAgICAvKiBBdCBsZWFzdCBmb3Igbm93LCBpZ25vcmUgU29ycmVsbFdtIHdpbmRvd3MuICovXG4gICAgICAgIC8vIGlmIChHZXRXaW5kb3dUaXRsZShDZWxsLkhhbmRsZSkgIT09IFwiU29ycmVsbFdtXCIpXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICAgIFNldFdpbmRvd1Bvc2l0aW9uKENlbGwuSGFuZGxlLCBDZWxsLlNpemUpO1xuICAgICAgICAvLyB9XG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZyhgQ2FsbGVkIFNldFdpbmRvd1Bvc2l0aW9uIGZvciAkeyBDZWxscy5sZW5ndGggfSB3aW5kb3dzLmApO1xufTtcblxuY29uc3QgSXNDZWxsID0gKFZlcnRleDogRlZlcnRleCk6IFZlcnRleCBpcyBGQ2VsbCA9Plxue1xuICAgIHJldHVybiBcIkhhbmRsZVwiIGluIFZlcnRleDtcbn07XG5cbmV4cG9ydCBjb25zdCBGbGF0dGVuID0gKCk6IEFycmF5PEZWZXJ0ZXg+ID0+XG57XG4gICAgY29uc3QgT3V0QXJyYXk6IEFycmF5PEZWZXJ0ZXg+ID0gWyBdO1xuXG4gICAgVHJhdmVyc2UoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIE91dEFycmF5LnB1c2goVmVydGV4KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gT3V0QXJyYXk7XG59O1xuXG4vKipcbiAqIFJ1biBhIGZ1bmN0aW9uIGZvciBlYWNoIHZlcnRleCB1bnRpbCB0aGUgZnVuY3Rpb24gcmV0dXJucyBgZmFsc2VgIGZvclxuICogYW4gaXRlcmF0aW9uLlxuICovXG5leHBvcnQgY29uc3QgVHJhdmVyc2UgPSAoUHJlZGljYXRlOiBUUHJlZGljYXRlPEZWZXJ0ZXg+LCBFbnRyeT86IEZWZXJ0ZXgpOiB2b2lkID0+XG57XG4gICAgbGV0IENvbnRpbnVlczogYm9vbGVhbiA9IHRydWU7XG4gICAgY29uc3QgUmVjdXJyZW5jZSA9IChWZXJ0ZXg6IEZWZXJ0ZXgpOiB2b2lkID0+XG4gICAge1xuICAgICAgICBpZiAoQ29udGludWVzKVxuICAgICAgICB7XG4gICAgICAgICAgICBDb250aW51ZXMgPSBQcmVkaWNhdGUoVmVydGV4KTtcbiAgICAgICAgICAgIGlmIChDb250aW51ZXMgJiYgXCJDaGlsZHJlblwiIGluIFZlcnRleClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IENoaWxkIG9mIFZlcnRleC5DaGlsZHJlbilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlY3VycmVuY2UoQ2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoRW50cnkpXG4gICAge1xuICAgICAgICBSZWN1cnJlbmNlKEVudHJ5KTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgZm9yIChjb25zdCBQYW5lbCBvZiBGb3Jlc3QpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFJlY3VycmVuY2UoUGFuZWwpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuY29uc3QgR2V0QWxsQ2VsbHMgPSAoUGFuZWxzOiBBcnJheTxGUGFuZWw+KTogQXJyYXk8RkNlbGw+ID0+XG57XG4gICAgY29uc3QgUmVzdWx0OiBBcnJheTxGQ2VsbD4gPSBbIF07XG5cbiAgICBmdW5jdGlvbiBUcmF2ZXJzZShWZXJ0ZXg6IEZWZXJ0ZXgpOiB2b2lkXG4gICAge1xuICAgICAgICBpZiAoXCJIYW5kbGVcIiBpbiBWZXJ0ZXgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFJlc3VsdC5wdXNoKFZlcnRleCBhcyBGQ2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoXCJDaGlsZHJlblwiIGluIFZlcnRleClcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yIChjb25zdCBDaGlsZCBvZiBWZXJ0ZXguQ2hpbGRyZW4pXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgVHJhdmVyc2UoQ2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBQYW5lbCBvZiBQYW5lbHMpXG4gICAge1xuICAgICAgICBmb3IgKGNvbnN0IENoaWxkIG9mIFBhbmVsLkNoaWxkcmVuKVxuICAgICAgICB7XG4gICAgICAgICAgICBUcmF2ZXJzZShDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUmVzdWx0O1xufTtcblxuZXhwb3J0IGNvbnN0IEV4aXN0cyA9IChQcmVkaWNhdGU6IChWZXJ0ZXg6IEZWZXJ0ZXgpID0+IGJvb2xlYW4pOiBib29sZWFuID0+XG57XG4gICAgbGV0IERvZXNFeGlzdDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIFRyYXZlcnNlKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoIURvZXNFeGlzdClcbiAgICAgICAge1xuICAgICAgICAgICAgRG9lc0V4aXN0ID0gUHJlZGljYXRlKFZlcnRleCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gIURvZXNFeGlzdDtcbiAgICB9KTtcblxuICAgIHJldHVybiBEb2VzRXhpc3Q7XG59O1xuXG4vKiogQFRPRE8gKi9cbmV4cG9ydCBjb25zdCBFeGlzdHNFeGFjdGx5T25lID0gKFByZWRpY2F0ZTogKFZlcnRleDogRlZlcnRleCkgPT4gYm9vbGVhbik6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgRm9yQWxsID0gKFByZWRpY2F0ZTogKFZlcnRleDogRlZlcnRleCkgPT4gYm9vbGVhbik6IGJvb2xlYW4gPT5cbntcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5leHBvcnQgY29uc3QgSXNXaW5kb3dUaWxlZCA9IChIYW5kbGU6IEhXaW5kb3cpOiBib29sZWFuID0+XG57XG4gICAgcmV0dXJuIEV4aXN0cygoVmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgaWYgKElzQ2VsbChWZXJ0ZXgpKVxuICAgICAgICB7XG4gICAgICAgICAgICBMb2coXCJIYW5kbGVzIGFyZTogXCIsIFZlcnRleC5IYW5kbGUsIEhhbmRsZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIElzQ2VsbChWZXJ0ZXgpICYmIEFyZUhhbmRsZXNFcXVhbChWZXJ0ZXguSGFuZGxlLCBIYW5kbGUpO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IEdldFBhbmVscyA9ICgpOiBBcnJheTxGUGFuZWw+ID0+XG57XG4gICAgY29uc3QgVmVydGljZXM6IEFycmF5PEZWZXJ0ZXg+ID0gRmxhdHRlbigpO1xuICAgIHJldHVybiBWZXJ0aWNlcy5maWx0ZXIoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT4gIUlzQ2VsbChWZXJ0ZXgpKSBhcyBBcnJheTxGUGFuZWw+O1xufTtcblxuZXhwb3J0IGNvbnN0IFB1Ymxpc2ggPSAoKTogdm9pZCA9Plxue1xuICAgIFRyYXZlcnNlKChWZXJ0ZXg6IEZWZXJ0ZXgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICBpZiAoSXNDZWxsKFZlcnRleCkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFNldFdpbmRvd1Bvc2l0aW9uKFxuICAgICAgICAgICAgICAgIFZlcnRleC5IYW5kbGUsXG4gICAgICAgICAgICAgICAgVmVydGV4LlNpemVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIFBhbmVsQ29udGFpbnNWZXJ0ZXgoY3VycmVudFZlcnRleDogRlZlcnRleCwgdGFyZ2V0VmVydGV4OiBGVmVydGV4KTogYm9vbGVhblxue1xuICAgIGlmIChjdXJyZW50VmVydGV4ID09PSB0YXJnZXRWZXJ0ZXgpXG4gICAge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGlzIGlzIGEgcGFuZWwsIGNoZWNrIGl0cyBjaGlsZHJlbiByZWN1cnNpdmVseVxuICAgIGlmIChcIkNoaWxkcmVuXCIgaW4gY3VycmVudFZlcnRleClcbiAgICB7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY3VycmVudFZlcnRleC5DaGlsZHJlbilcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKFBhbmVsQ29udGFpbnNWZXJ0ZXgoY2hpbGQsIHRhcmdldFZlcnRleCkpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBjb25zdCBHZXRSb290UGFuZWwgPSAoVmVydGV4OiBGVmVydGV4KTogRlBhbmVsIHwgdW5kZWZpbmVkID0+XG57XG4gICAgZm9yIChjb25zdCBQYW5lbCBvZiBGb3Jlc3QpXG4gICAge1xuICAgICAgICBpZiAoUGFuZWxDb250YWluc1ZlcnRleChQYW5lbCwgVmVydGV4KSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIFBhbmVsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbmNvbnN0IEdldFBhbmVsQXBwbGljYXRpb25OYW1lcyA9IChQYW5lbDogRlBhbmVsKTogQXJyYXk8c3RyaW5nPiA9Plxue1xuICAgIGNvbnN0IFJlc3VsdE5hbWVzOiBBcnJheTxzdHJpbmc+ID0gWyBdO1xuXG4gICAgVHJhdmVyc2UoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIGlmIChcIkhhbmRsZVwiIGluIFZlcnRleClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgRnJpZW5kbHlOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBHZXRBcHBsaWNhdGlvbkZyaWVuZGx5TmFtZShWZXJ0ZXguSGFuZGxlKTtcbiAgICAgICAgICAgIGlmIChGcmllbmRseU5hbWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZXN1bHROYW1lcy5wdXNoKEZyaWVuZGx5TmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChSZXN1bHROYW1lcy5sZW5ndGggPj0gMylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LCBQYW5lbCk7XG5cbiAgICByZXR1cm4gUmVzdWx0TmFtZXM7XG59O1xuXG5leHBvcnQgY29uc3QgQW5ub3RhdGVQYW5lbCA9IChQYW5lbDogRlBhbmVsKTogRkFubm90YXRlZFBhbmVsIHwgdW5kZWZpbmVkID0+XG57XG4gICAgY29uc3QgUm9vdFBhbmVsOiBGUGFuZWwgfCB1bmRlZmluZWQgPSBHZXRSb290UGFuZWwoUGFuZWwpO1xuICAgIGlmIChSb290UGFuZWwgIT09IHVuZGVmaW5lZCAmJiBSb290UGFuZWwuTW9uaXRvcklkICE9PSB1bmRlZmluZWQpXG4gICAge1xuICAgICAgICBjb25zdCBBcHBsaWNhdGlvbk5hbWVzOiBBcnJheTxzdHJpbmc+ID0gR2V0UGFuZWxBcHBsaWNhdGlvbk5hbWVzKFBhbmVsKTtcbiAgICAgICAgY29uc3QgSXNSb290OiBib29sZWFuID0gUm9vdFBhbmVsID09PSBQYW5lbDtcbiAgICAgICAgY29uc3QgTW9uaXRvcjogc3RyaW5nID0gR2V0TW9uaXRvckZyaWVuZGx5TmFtZShSb290UGFuZWwuTW9uaXRvcklkKSB8fCBcIlwiO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5QYW5lbCxcblxuICAgICAgICAgICAgQXBwbGljYXRpb25OYW1lcyxcbiAgICAgICAgICAgIElzUm9vdCxcbiAgICAgICAgICAgIE1vbml0b3IsXG4gICAgICAgICAgICBTY3JlZW5zaG90OiB1bmRlZmluZWRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxuZXhwb3J0IGNvbnN0IEdldFBhbmVsU2NyZWVuc2hvdCA9IGFzeW5jIChQYW5lbDogRlBhbmVsKTogUHJvbWlzZTxzdHJpbmcgfCB1bmRlZmluZWQ+ID0+XG57XG4gICAgY29uc3QgU2NyZWVuc2hvdEJ1ZmZlcjogQnVmZmVyID1cbiAgICAgICAgYXdhaXQgRnMucmVhZEZpbGUoQ2FwdHVyZVNjcmVlblNlY3Rpb25Ub1RlbXBQbmdGaWxlKFBhbmVsLlNpemUpKTtcblxuICAgIHJldHVybiBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxcIiArIFNjcmVlbnNob3RCdWZmZXIudG9TdHJpbmcoXCJiYXNlNjRcIik7XG59O1xuXG5leHBvcnQgY29uc3QgTWFrZVNpemVzVW5pZm9ybSA9IChQYW5lbDogRlBhbmVsKTogdm9pZCA9Plxue1xuICAgIFBhbmVsLkNoaWxkcmVuLmZvckVhY2goKENoaWxkOiBGVmVydGV4LCBJbmRleDogbnVtYmVyKTogdm9pZCA9PlxuICAgIHtcbiAgICAgICAgaWYgKFBhbmVsLlR5cGUgPT09IFwiSG9yaXpvbnRhbFwiKVxuICAgICAgICB7XG4gICAgICAgICAgICBDaGlsZC5TaXplLldpZHRoID0gUGFuZWwuU2l6ZS5XaWR0aCAvIFBhbmVsLkNoaWxkcmVuLmxlbmd0aDtcbiAgICAgICAgICAgIENoaWxkLlNpemUuWCA9IFBhbmVsLlNpemUuWCArIEluZGV4ICogQ2hpbGQuU2l6ZS5XaWR0aDtcbiAgICAgICAgICAgIENoaWxkLlNpemUuSGVpZ2h0ID0gUGFuZWwuU2l6ZS5IZWlnaHQ7XG4gICAgICAgICAgICBDaGlsZC5TaXplLlkgPSBQYW5lbC5TaXplLlk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoUGFuZWwuVHlwZSA9PT0gXCJWZXJ0aWNhbFwiKVxuICAgICAgICB7XG4gICAgICAgICAgICBDaGlsZC5TaXplLkhlaWdodCA9IFBhbmVsLlNpemUuSGVpZ2h0IC8gUGFuZWwuQ2hpbGRyZW4ubGVuZ3RoO1xuICAgICAgICAgICAgQ2hpbGQuU2l6ZS5ZID0gUGFuZWwuU2l6ZS5ZICsgSW5kZXggKiBDaGlsZC5TaXplLkhlaWdodDtcbiAgICAgICAgICAgIENoaWxkLlNpemUuV2lkdGggPSBQYW5lbC5TaXplLldpZHRoO1xuICAgICAgICAgICAgQ2hpbGQuU2l6ZS5YID0gUGFuZWwuU2l6ZS5YO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgQnJpbmdJbnRvUGFuZWwgPSAoSW5QYW5lbDogRkFubm90YXRlZFBhbmVsKTogdm9pZCA9Plxue1xuICAgIGNvbnN0IEhhbmRsZTogSFdpbmRvdyB8IHVuZGVmaW5lZCA9IEdldEFjdGl2ZVdpbmRvdygpO1xuICAgIGlmIChIYW5kbGUgIT09IHVuZGVmaW5lZClcbiAgICB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBCcmluZ2luZ0ludG9QYW5lbDogJHsgR2V0V2luZG93VGl0bGUoSGFuZGxlKSB9LmApO1xuICAgICAgICBjb25zdCBQYW5lbDogRlBhbmVsIHwgdW5kZWZpbmVkID0gR2V0UGFuZWxGcm9tQW5ub3RhdGVkKEluUGFuZWwpO1xuICAgICAgICBpZiAoUGFuZWwgIT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJCcmluZ0ludG9QYW5lbDogUGFuZWxGcm9tQW5ub3RhdGVkIHdhcyBkZWZpbmVkIVwiKTtcbiAgICAgICAgICAgIGNvbnN0IE91dENlbGw6IEZDZWxsID0gQ2VsbChIYW5kbGUpO1xuICAgICAgICAgICAgUGFuZWwuQ2hpbGRyZW4ucHVzaChPdXRDZWxsKTtcbiAgICAgICAgICAgIE1ha2VTaXplc1VuaWZvcm0oUGFuZWwpO1xuICAgICAgICAgICAgUHVibGlzaCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJCcmluZ0ludG9QYW5lbDogUGFuZWxGcm9tQW5ub3RhdGVkIHdhcyBVTkRFRklORUQuXCIpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IEFyZVBhbmVsc0VxdWFsID0gKEE6IEZQYW5lbCB8IEZBbm5vdGF0ZWRQYW5lbCwgQjogRlBhbmVsIHwgRkFubm90YXRlZFBhbmVsKTogYm9vbGVhbiA9Plxue1xuICAgIHJldHVybiBBcmVCb3hlc0VxdWFsKEEuU2l6ZSwgQi5TaXplKTtcbn07XG5cbmV4cG9ydCBjb25zdCBGaW5kID0gKFByZWRpY2F0ZTogVFByZWRpY2F0ZTxGVmVydGV4Pik6IEZWZXJ0ZXggfCB1bmRlZmluZWQgPT5cbntcbiAgICBsZXQgT3V0OiBGVmVydGV4IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gICAgVHJhdmVyc2UoKFZlcnRleDogRlZlcnRleCk6IGJvb2xlYW4gPT5cbiAgICB7XG4gICAgICAgIGlmIChPdXQgPT09IHVuZGVmaW5lZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgU2F0aXNmaWVzOiBib29sZWFuID0gUHJlZGljYXRlKFZlcnRleCk7XG4gICAgICAgICAgICBpZiAoU2F0aXNmaWVzKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIE91dCA9IFZlcnRleDtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIE91dDtcbn07XG5cbmV4cG9ydCBjb25zdCBJc1BhbmVsID0gKFZlcnRleDogRlZlcnRleCk6IFZlcnRleCBpcyBGUGFuZWwgPT5cbntcbiAgICByZXR1cm4gXCJDaGlsZHJlblwiIGluIFZlcnRleDtcbn07XG5cbmV4cG9ydCBjb25zdCBHZXRQYW5lbEZyb21Bbm5vdGF0ZWQgPSAoUGFuZWw6IEZBbm5vdGF0ZWRQYW5lbCk6IEZQYW5lbCB8IHVuZGVmaW5lZCA9Plxue1xuICAgIGNvbnN0IExvZ2dlZFBhbmVsOiBQYXJ0aWFsPEZQYW5lbD4gPVxuICAgIHtcbiAgICAgICAgU2l6ZTogUGFuZWwuU2l6ZSxcbiAgICAgICAgVHlwZTogUGFuZWwuVHlwZVxuICAgIH07XG5cbiAgICBjb25zb2xlLmxvZyhcIkJlZ2lucyBHZXRQYW5lbEZyb21Bbm5vdGF0ZWQsIFBhbmVsIGlzXCIsIExvZ2dlZFBhbmVsKTtcbiAgICByZXR1cm4gRmluZCgoVmVydGV4OiBGVmVydGV4KTogYm9vbGVhbiA9PlxuICAgIHtcbiAgICAgICAgaWYgKElzUGFuZWwoVmVydGV4KSlcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWZXJ0ZXggaXMgYSBwYW5lbC5cIiwgVmVydGV4KTtcbiAgICAgICAgICAgIGNvbnN0IEFyZUVxdWFsOiBib29sZWFuID0gQXJlUGFuZWxzRXF1YWwoUGFuZWwsIFZlcnRleCk7XG5cbiAgICAgICAgICAgIGlmIChBcmVFcXVhbClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBhbmVscyBhcmUgZXF1YWxcIiwgUGFuZWwsIFZlcnRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYW5lbHMgYXJlIE5PVCBlcXVhbFwiLCBQYW5lbCwgVmVydGV4KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIEFyZUVxdWFsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJWZXJ0ZXggd2FzIE5PVCBhIHBhbmVsXCIsIFZlcnRleCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9KSBhcyBGUGFuZWwgfCB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgY29uc3QgUmVtb3ZlQW5ub3RhdGlvbnMgPSAoeyBDaGlsZHJlbiwgTW9uaXRvcklkLCBTaXplLCBUeXBlLCBaT3JkZXIgfTogRkFubm90YXRlZFBhbmVsKTogRlBhbmVsID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgQ2hpbGRyZW4sXG4gICAgICAgIE1vbml0b3JJZCxcbiAgICAgICAgU2l6ZSxcbiAgICAgICAgVHlwZSxcbiAgICAgICAgWk9yZGVyXG4gICAgfTtcbn07XG5cbkluaXRpYWxpemVUcmVlKCk7XG4iLCIvKiBGaWxlOiAgICAgIEtleWJvYXJkLnRzXG4gKiBBdXRob3I6ICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQ29weXJpZ2h0OiAoYykgMjAyNCBTb3JyZWxsIEludGVsbGVjdHVhbCBQcm9wZXJ0aWVzXG4gKiBMaWNlbnNlOiAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHsgRktleUlkLCBGVmlydHVhbEtleSB9IGZyb20gXCIuL0tleWJvYXJkLlR5cGVzXCI7XG5cbi8qIGVzbGludC1kaXNhYmxlIHNvcnQta2V5cyAqL1xuXG4vKiogRGV2ZWxvcGVyLWZyaWVuZGx5IG5hbWVzIG9mIGtleSBjb2Rlcy4gKi9cbmV4cG9ydCBjb25zdCBLZXlJZHNCeUlkOiBSZWFkb25seTxSZWNvcmQ8RlZpcnR1YWxLZXksIEZLZXlJZD4+ID1cbntcbiAgICAweDA1OiBcIk1vdXNlWDFcIixcbiAgICAweDA2OiBcIk1vdXNlWDJcIixcbiAgICAweDA4OiBcIkJhY2tzcGFjZVwiLFxuICAgIDB4MDk6IFwiVGFiXCIsXG4gICAgMHgwRDogXCJFbnRlclwiLFxuICAgIDB4MTA6IFwiU2hpZnRcIixcbiAgICAweDExOiBcIkN0cmxcIixcbiAgICAweDEyOiBcIkFsdFwiLFxuICAgIDB4MTM6IFwiUGF1c2VcIixcbiAgICAweDIwOiBcIlNwYWNlXCIsXG4gICAgMHgyMTogXCJQZ1VwXCIsXG4gICAgMHgyMjogXCJQZ0Rvd25cIixcbiAgICAweDIzOiBcIkVuZFwiLFxuICAgIDB4MjQ6IFwiSG9tZVwiLFxuICAgIDB4MjU6IFwiTGVmdEFycm93XCIsXG4gICAgMHgyNjogXCJVcEFycm93XCIsXG4gICAgMHgyNzogXCJSaWdodEFycm93XCIsXG4gICAgMHgyODogXCJEb3duQXJyb3dcIixcbiAgICAweDJEOiBcIkluc1wiLFxuICAgIDB4MkU6IFwiRGVsXCIsXG4gICAgMHgzMDogXCIwXCIsXG4gICAgMHgzMTogXCIxXCIsXG4gICAgMHgzMjogXCIyXCIsXG4gICAgMHgzMzogXCIzXCIsXG4gICAgMHgzNDogXCI0XCIsXG4gICAgMHgzNTogXCI1XCIsXG4gICAgMHgzNjogXCI2XCIsXG4gICAgMHgzNzogXCI3XCIsXG4gICAgMHgzODogXCI4XCIsXG4gICAgMHgzOTogXCI5XCIsXG4gICAgMHg0MTogXCJBXCIsXG4gICAgMHg0MjogXCJCXCIsXG4gICAgMHg0MzogXCJDXCIsXG4gICAgMHg0NDogXCJEXCIsXG4gICAgMHg0NTogXCJFXCIsXG4gICAgMHg0NjogXCJGXCIsXG4gICAgMHg0NzogXCJHXCIsXG4gICAgMHg0ODogXCJIXCIsXG4gICAgMHg0OTogXCJJXCIsXG4gICAgMHg0QTogXCJKXCIsXG4gICAgMHg0QjogXCJLXCIsXG4gICAgMHg0QzogXCJMXCIsXG4gICAgMHg0RDogXCJNXCIsXG4gICAgMHg0RTogXCJOXCIsXG4gICAgMHg0RjogXCJPXCIsXG4gICAgMHg1MDogXCJQXCIsXG4gICAgMHg1MTogXCJRXCIsXG4gICAgMHg1MjogXCJSXCIsXG4gICAgMHg1MzogXCJTXCIsXG4gICAgMHg1NDogXCJUXCIsXG4gICAgMHg1NTogXCJVXCIsXG4gICAgMHg1NjogXCJWXCIsXG4gICAgMHg1NzogXCJXXCIsXG4gICAgMHg1ODogXCJYXCIsXG4gICAgMHg1OTogXCJZXCIsXG4gICAgMHg1QTogXCJaXCIsXG4gICAgMHg1QjogXCJMV2luXCIsXG4gICAgMHg1QzogXCJSV2luXCIsXG4gICAgMHg1RDogXCJBcHBsaWNhdGlvbnNcIixcbiAgICAweDYwOiBcIk51bTBcIixcbiAgICAweDYxOiBcIk51bTFcIixcbiAgICAweDYyOiBcIk51bTJcIixcbiAgICAweDYzOiBcIk51bTNcIixcbiAgICAweDY0OiBcIk51bTRcIixcbiAgICAweDY1OiBcIk51bTVcIixcbiAgICAweDY2OiBcIk51bTZcIixcbiAgICAweDY3OiBcIk51bTdcIixcbiAgICAweDY4OiBcIk51bThcIixcbiAgICAweDY5OiBcIk51bTlcIixcbiAgICAweDZBOiBcIk11bHRpcGx5XCIsXG4gICAgMHg2QjogXCJBZGRcIixcbiAgICAweDZEOiBcIlN1YnRyYWN0XCIsXG4gICAgMHg2RTogXCJOdW1EZWNpbWFsXCIsXG4gICAgMHg2RjogXCJOdW1EaXZpZGVcIixcbiAgICAweDcwOiBcIkYxXCIsXG4gICAgMHg3MTogXCJGMlwiLFxuICAgIDB4NzI6IFwiRjNcIixcbiAgICAweDczOiBcIkY0XCIsXG4gICAgMHg3NDogXCJGNVwiLFxuICAgIDB4NzU6IFwiRjZcIixcbiAgICAweDc2OiBcIkY3XCIsXG4gICAgMHg3NzogXCJGOFwiLFxuICAgIDB4Nzg6IFwiRjlcIixcbiAgICAweDc5OiBcIkYxMFwiLFxuICAgIDB4N0E6IFwiRjExXCIsXG4gICAgMHg3QjogXCJGMTJcIixcbiAgICAweDdDOiBcIkYxM1wiLFxuICAgIDB4N0Q6IFwiRjE0XCIsXG4gICAgMHg3RTogXCJGMTVcIixcbiAgICAweDdGOiBcIkYxNlwiLFxuICAgIDB4ODA6IFwiRjE3XCIsXG4gICAgMHg4MTogXCJGMThcIixcbiAgICAweDgyOiBcIkYxOVwiLFxuICAgIDB4ODM6IFwiRjIwXCIsXG4gICAgMHg4NDogXCJGMjFcIixcbiAgICAweDg1OiBcIkYyMlwiLFxuICAgIDB4ODY6IFwiRjIzXCIsXG4gICAgMHg4NzogXCJGMjRcIixcbiAgICAweEEwOiBcIkxTaGlmdFwiLFxuICAgIDB4QTE6IFwiUlNoaWZ0XCIsXG4gICAgMHhBMjogXCJMQ3RybFwiLFxuICAgIDB4QTM6IFwiUkN0cmxcIixcbiAgICAweEE0OiBcIkxBbHRcIixcbiAgICAweEE1OiBcIlJBbHRcIixcbiAgICAweEE2OiBcIkJyb3dzZXJCYWNrXCIsXG4gICAgMHhBNzogXCJCcm93c2VyRm9yd2FyZFwiLFxuICAgIDB4QTg6IFwiQnJvd3NlclJlZnJlc2hcIixcbiAgICAweEE5OiBcIkJyb3dzZXJTdG9wXCIsXG4gICAgMHhBQTogXCJCcm93c2VyU2VhcmNoXCIsXG4gICAgMHhBQjogXCJCcm93c2VyRmF2b3JpdGVzXCIsXG4gICAgMHhBQzogXCJCcm93c2VyU3RhcnRcIixcbiAgICAweEIwOiBcIk5leHRUcmFja1wiLFxuICAgIDB4QjE6IFwiUHJldmlvdXNUcmFja1wiLFxuICAgIDB4QjI6IFwiU3RvcE1lZGlhXCIsXG4gICAgMHhCMzogXCJQbGF5UGF1c2VNZWRpYVwiLFxuICAgIDB4QjQ6IFwiU3RhcnRNYWlsXCIsXG4gICAgMHhCNTogXCJTZWxlY3RNZWRpYVwiLFxuICAgIDB4QjY6IFwiU3RhcnRBcHBsaWNhdGlvbk9uZVwiLFxuICAgIDB4Qjc6IFwiU3RhcnRBcHBsaWNhdGlvblR3b1wiLFxuICAgIDB4QkE6IFwiO1wiLFxuICAgIDB4QkI6IFwiK1wiLFxuICAgIDB4QkM6IFwiLFwiLFxuICAgIDB4QkQ6IFwiLVwiLFxuICAgIDB4QkU6IFwiLlwiLFxuICAgIDB4QkY6IFwiL1wiLFxuICAgIDB4QzA6IFwiYFwiLFxuICAgIDB4REI6IFwiW1wiLFxuICAgIDB4REM6IFwiXFxcXFwiLFxuICAgIDB4REQ6IFwiXVwiLFxuICAgIDB4REU6IFwiJ1wiXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgR2V0S2V5TmFtZSA9IChWa0NvZGU6IEZWaXJ0dWFsS2V5KTogRktleUlkID0+XG57XG4gICAgcmV0dXJuIEtleUlkc0J5SWRbVmtDb2RlXTtcbn07XG5cbi8qKiBEZXZlbG9wZXItZnJpZW5kbHkgbmFtZXMgb2Yga2V5IGNvZGVzLiAqL1xuZXhwb3J0IGNvbnN0IFZrOiBSZWFkb25seTxSZWNvcmQ8RktleUlkLCBGVmlydHVhbEtleT4+ID1cbntcbiAgICBNb3VzZVgxOiAweDA1LFxuICAgIE1vdXNlWDI6IDB4MDYsXG4gICAgQmFja3NwYWNlOiAweDA4LFxuICAgIFRhYjogMHgwOSxcbiAgICBFbnRlcjogMHgwRCxcbiAgICBTaGlmdDogMHgxMCxcbiAgICBDdHJsOiAweDExLFxuICAgIEFsdDogMHgxMixcbiAgICBQYXVzZTogMHgxMyxcbiAgICBTcGFjZTogMHgyMCxcbiAgICBQZ1VwOiAweDIxLFxuICAgIFBnRG93bjogMHgyMixcbiAgICBFbmQ6IDB4MjMsXG4gICAgSG9tZTogMHgyNCxcbiAgICBMZWZ0QXJyb3c6IDB4MjUsXG4gICAgVXBBcnJvdzogMHgyNixcbiAgICBSaWdodEFycm93OiAweDI3LFxuICAgIERvd25BcnJvdzogMHgyOCxcbiAgICBJbnM6IDB4MkQsXG4gICAgRGVsOiAweDJFLFxuICAgIDA6IDB4MzAsXG4gICAgMTogMHgzMSxcbiAgICAyOiAweDMyLFxuICAgIDM6IDB4MzMsXG4gICAgNDogMHgzNCxcbiAgICA1OiAweDM1LFxuICAgIDY6IDB4MzYsXG4gICAgNzogMHgzNyxcbiAgICA4OiAweDM4LFxuICAgIDk6IDB4MzksXG4gICAgQTogMHg0MSxcbiAgICBCOiAweDQyLFxuICAgIEM6IDB4NDMsXG4gICAgRDogMHg0NCxcbiAgICBFOiAweDQ1LFxuICAgIEY6IDB4NDYsXG4gICAgRzogMHg0NyxcbiAgICBIOiAweDQ4LFxuICAgIEk6IDB4NDksXG4gICAgSjogMHg0QSxcbiAgICBLOiAweDRCLFxuICAgIEw6IDB4NEMsXG4gICAgTTogMHg0RCxcbiAgICBOOiAweDRFLFxuICAgIE86IDB4NEYsXG4gICAgUDogMHg1MCxcbiAgICBROiAweDUxLFxuICAgIFI6IDB4NTIsXG4gICAgUzogMHg1MyxcbiAgICBUOiAweDU0LFxuICAgIFU6IDB4NTUsXG4gICAgVjogMHg1NixcbiAgICBXOiAweDU3LFxuICAgIFg6IDB4NTgsXG4gICAgWTogMHg1OSxcbiAgICBaOiAweDVBLFxuICAgIExXaW46IDB4NUIsXG4gICAgUldpbjogMHg1QyxcbiAgICBBcHBsaWNhdGlvbnM6IDB4NUQsXG4gICAgTnVtMDogMHg2MCxcbiAgICBOdW0xOiAweDYxLFxuICAgIE51bTI6IDB4NjIsXG4gICAgTnVtMzogMHg2MyxcbiAgICBOdW00OiAweDY0LFxuICAgIE51bTU6IDB4NjUsXG4gICAgTnVtNjogMHg2NixcbiAgICBOdW03OiAweDY3LFxuICAgIE51bTg6IDB4NjgsXG4gICAgTnVtOTogMHg2OSxcbiAgICBNdWx0aXBseTogMHg2QSxcbiAgICBBZGQ6IDB4NkIsXG4gICAgU3VidHJhY3Q6IDB4NkQsXG4gICAgTnVtRGVjaW1hbDogMHg2RSxcbiAgICBOdW1EaXZpZGU6IDB4NkYsXG4gICAgRjE6IDB4NzAsXG4gICAgRjI6IDB4NzEsXG4gICAgRjM6IDB4NzIsXG4gICAgRjQ6IDB4NzMsXG4gICAgRjU6IDB4NzQsXG4gICAgRjY6IDB4NzUsXG4gICAgRjc6IDB4NzYsXG4gICAgRjg6IDB4NzcsXG4gICAgRjk6IDB4NzgsXG4gICAgRjEwOiAweDc5LFxuICAgIEYxMTogMHg3QSxcbiAgICBGMTI6IDB4N0IsXG4gICAgRjEzOiAweDdDLFxuICAgIEYxNDogMHg3RCxcbiAgICBGMTU6IDB4N0UsXG4gICAgRjE2OiAweDdGLFxuICAgIEYxNzogMHg4MCxcbiAgICBGMTg6IDB4ODEsXG4gICAgRjE5OiAweDgyLFxuICAgIEYyMDogMHg4MyxcbiAgICBGMjE6IDB4ODQsXG4gICAgRjIyOiAweDg1LFxuICAgIEYyMzogMHg4NixcbiAgICBGMjQ6IDB4ODcsXG4gICAgTFNoaWZ0OiAweEEwLFxuICAgIFJTaGlmdDogMHhBMSxcbiAgICBMQ3RybDogMHhBMixcbiAgICBSQ3RybDogMHhBMyxcbiAgICBMQWx0OiAweEE0LFxuICAgIFJBbHQ6IDB4QTUsXG4gICAgQnJvd3NlckJhY2s6IDB4QTYsXG4gICAgQnJvd3NlckZvcndhcmQ6IDB4QTcsXG4gICAgQnJvd3NlclJlZnJlc2g6IDB4QTgsXG4gICAgQnJvd3NlclN0b3A6IDB4QTksXG4gICAgQnJvd3NlclNlYXJjaDogMHhBQSxcbiAgICBCcm93c2VyRmF2b3JpdGVzOiAweEFCLFxuICAgIEJyb3dzZXJTdGFydDogMHhBQyxcbiAgICBOZXh0VHJhY2s6IDB4QjAsXG4gICAgUHJldmlvdXNUcmFjazogMHhCMSxcbiAgICBTdG9wTWVkaWE6IDB4QjIsXG4gICAgUGxheVBhdXNlTWVkaWE6IDB4QjMsXG4gICAgU3RhcnRNYWlsOiAweEI0LFxuICAgIFNlbGVjdE1lZGlhOiAweEI1LFxuICAgIFN0YXJ0QXBwbGljYXRpb25PbmU6IDB4QjYsXG4gICAgU3RhcnRBcHBsaWNhdGlvblR3bzogMHhCNyxcbiAgICBcIjtcIjogMHhCQSxcbiAgICBcIitcIjogMHhCQixcbiAgICBcIixcIjogMHhCQyxcbiAgICBcIi1cIjogMHhCRCxcbiAgICBcIi5cIjogMHhCRSxcbiAgICBcIi9cIjogMHhCRixcbiAgICBcImBcIjogMHhDMCxcbiAgICBcIltcIjogMHhEQixcbiAgICBcIlxcXFxcIjogMHhEQyxcbiAgICBcIl1cIjogMHhERCxcbiAgICBcIidcIjogMHhERVxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IFZpcnR1YWxLZXlzOiBSZWFkb25seTxBcnJheTxGVmlydHVhbEtleT4+ID1cbltcbiAgICAweDA1LFxuICAgIDB4MDYsXG4gICAgMHgwOCxcbiAgICAweDA5LFxuICAgIDB4MEQsXG4gICAgMHgxMCxcbiAgICAweDExLFxuICAgIDB4MTIsXG4gICAgMHgxMyxcbiAgICAweDIwLFxuICAgIDB4MjEsXG4gICAgMHgyMixcbiAgICAweDIzLFxuICAgIDB4MjQsXG4gICAgMHgyNSxcbiAgICAweDI2LFxuICAgIDB4MjcsXG4gICAgMHgyOCxcbiAgICAweDJELFxuICAgIDB4MkUsXG4gICAgMHgzMCxcbiAgICAweDMxLFxuICAgIDB4MzIsXG4gICAgMHgzMyxcbiAgICAweDM0LFxuICAgIDB4MzUsXG4gICAgMHgzNixcbiAgICAweDM3LFxuICAgIDB4MzgsXG4gICAgMHgzOSxcbiAgICAweDQxLFxuICAgIDB4NDIsXG4gICAgMHg0MyxcbiAgICAweDQ0LFxuICAgIDB4NDUsXG4gICAgMHg0NixcbiAgICAweDQ3LFxuICAgIDB4NDgsXG4gICAgMHg0OSxcbiAgICAweDRBLFxuICAgIDB4NEIsXG4gICAgMHg0QyxcbiAgICAweDRELFxuICAgIDB4NEUsXG4gICAgMHg0RixcbiAgICAweDUwLFxuICAgIDB4NTEsXG4gICAgMHg1MixcbiAgICAweDUzLFxuICAgIDB4NTQsXG4gICAgMHg1NSxcbiAgICAweDU2LFxuICAgIDB4NTcsXG4gICAgMHg1OCxcbiAgICAweDU5LFxuICAgIDB4NUEsXG4gICAgMHg1QixcbiAgICAweDVDLFxuICAgIDB4NUQsXG4gICAgMHg2MCxcbiAgICAweDYxLFxuICAgIDB4NjIsXG4gICAgMHg2MyxcbiAgICAweDY0LFxuICAgIDB4NjUsXG4gICAgMHg2NixcbiAgICAweDY3LFxuICAgIDB4NjgsXG4gICAgMHg2OSxcbiAgICAweDZBLFxuICAgIDB4NkIsXG4gICAgMHg2RCxcbiAgICAweDZFLFxuICAgIDB4NkYsXG4gICAgMHg3MCxcbiAgICAweDcxLFxuICAgIDB4NzIsXG4gICAgMHg3MyxcbiAgICAweDc0LFxuICAgIDB4NzUsXG4gICAgMHg3NixcbiAgICAweDc3LFxuICAgIDB4NzgsXG4gICAgMHg3OSxcbiAgICAweDdBLFxuICAgIDB4N0IsXG4gICAgMHg3QyxcbiAgICAweDdELFxuICAgIDB4N0UsXG4gICAgMHg3RixcbiAgICAweDgwLFxuICAgIDB4ODEsXG4gICAgMHg4MixcbiAgICAweDgzLFxuICAgIDB4ODQsXG4gICAgMHg4NSxcbiAgICAweDg2LFxuICAgIDB4ODcsXG4gICAgMHhBMCxcbiAgICAweEExLFxuICAgIDB4QTIsXG4gICAgMHhBMyxcbiAgICAweEE0LFxuICAgIDB4QTUsXG4gICAgMHhBNixcbiAgICAweEE3LFxuICAgIDB4QTgsXG4gICAgMHhBOSxcbiAgICAweEFBLFxuICAgIDB4QUIsXG4gICAgMHhBQyxcbiAgICAweEIwLFxuICAgIDB4QjEsXG4gICAgMHhCMixcbiAgICAweEIzLFxuICAgIDB4QjQsXG4gICAgMHhCNSxcbiAgICAweEI2LFxuICAgIDB4QjcsXG4gICAgMHhCQSxcbiAgICAweEJCLFxuICAgIDB4QkMsXG4gICAgMHhCRCxcbiAgICAweEJFLFxuICAgIDB4QkYsXG4gICAgMHhDMCxcbiAgICAweERCLFxuICAgIDB4REMsXG4gICAgMHhERCxcbiAgICAweERFXG5dIGFzIGNvbnN0O1xuXG4vKiBlc2xpbnQtZW5hYmxlIHNvcnQta2V5cyAqL1xuXG4vKiogSXMgdGhlIGBLZXlDb2RlYCBhIFZLIENvZGUgKip0aGF0IHRoaXMgYXBwIHVzZXMqKi4gKi9cbmV4cG9ydCBjb25zdCBJc1ZpcnR1YWxLZXkgPSAoS2V5Q29kZTogbnVtYmVyKTogS2V5Q29kZSBpcyBGVmlydHVhbEtleSA9Plxue1xuICAgIHJldHVybiBWaXJ0dWFsS2V5cy5pbmNsdWRlcyhLZXlDb2RlIGFzIEZWaXJ0dWFsS2V5KTtcbn07XG4iLCJ2YXIgbXlNb2R1bGUgPSByZXF1aXJlKFwiYmluZGluZ3NcIikoXCJoZWxsb1wiKTtcbm1vZHVsZS5leHBvcnRzID0gbXlNb2R1bGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhc3NlcnRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYnVmZmVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNoaWxkX3Byb2Nlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29uc3RhbnRzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJldmVudHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInF1ZXJ5c3RyaW5nXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInN0cmVhbVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdHJpbmdfZGVjb2RlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0dHlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXJsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV0aWxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiemxpYlwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcblx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuLy8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbl9fd2VicGFja19yZXF1aXJlX18uYyA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmYgPSB7fTtcbi8vIFRoaXMgZmlsZSBjb250YWlucyBvbmx5IHRoZSBlbnRyeSBjaHVuay5cbi8vIFRoZSBjaHVuayBsb2FkaW5nIGZ1bmN0aW9uIGZvciBhZGRpdGlvbmFsIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5lID0gKGNodW5rSWQpID0+IHtcblx0cmV0dXJuIFByb21pc2UuYWxsKE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uZikucmVkdWNlKChwcm9taXNlcywga2V5KSA9PiB7XG5cdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5mW2tleV0oY2h1bmtJZCwgcHJvbWlzZXMpO1xuXHRcdHJldHVybiBwcm9taXNlcztcblx0fSwgW10pKTtcbn07IiwiLy8gVGhpcyBmdW5jdGlvbiBhbGxvdyB0byByZWZlcmVuY2UgYXN5bmMgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnUgPSAoY2h1bmtJZCkgPT4ge1xuXHQvLyByZXR1cm4gdXJsIGZvciBmaWxlbmFtZXMgYmFzZWQgb24gdGVtcGxhdGVcblx0cmV0dXJuIFwiXCIgKyBjaHVua0lkICsgXCIuYnVuZGxlLmRldi5qc1wiO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5ubWQgPSAobW9kdWxlKSA9PiB7XG5cdG1vZHVsZS5wYXRocyA9IFtdO1xuXHRpZiAoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XG5cdHJldHVybiBtb2R1bGU7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBjaHVua3Ncbi8vIFwiMVwiIG1lYW5zIFwibG9hZGVkXCIsIG90aGVyd2lzZSBub3QgbG9hZGVkIHlldFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDFcbn07XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxudmFyIGluc3RhbGxDaHVuayA9IChjaHVuaykgPT4ge1xuXHR2YXIgbW9yZU1vZHVsZXMgPSBjaHVuay5tb2R1bGVzLCBjaHVua0lkcyA9IGNodW5rLmlkcywgcnVudGltZSA9IGNodW5rLnJ1bnRpbWU7XG5cdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHR9XG5cdH1cblx0aWYocnVudGltZSkgcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkc1tpXV0gPSAxO1xuXG59O1xuXG4vLyByZXF1aXJlKCkgY2h1bmsgbG9hZGluZyBmb3IgamF2YXNjcmlwdFxuX193ZWJwYWNrX3JlcXVpcmVfXy5mLnJlcXVpcmUgPSAoY2h1bmtJZCwgcHJvbWlzZXMpID0+IHtcblx0Ly8gXCIxXCIgaXMgdGhlIHNpZ25hbCBmb3IgXCJhbHJlYWR5IGxvYWRlZFwiXG5cdGlmKCFpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRpZih0cnVlKSB7IC8vIGFsbCBjaHVua3MgaGF2ZSBKU1xuXHRcdFx0aW5zdGFsbENodW5rKHJlcXVpcmUoXCIuL1wiICsgX193ZWJwYWNrX3JlcXVpcmVfXy51KGNodW5rSWQpKSk7XG5cdFx0fSBlbHNlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDE7XG5cdH1cbn07XG5cbi8vIG5vIGV4dGVybmFsIGluc3RhbGwgY2h1bmtcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdCIsIiIsIi8vIG1vZHVsZSBjYWNoZSBhcmUgdXNlZCBzbyBlbnRyeSBpbmxpbmluZyBpcyBkaXNhYmxlZFxuLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL1NvdXJjZS9NYWluL01haW4udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=