(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("@sorrell/wm-windows"));
	else if(typeof define === 'function' && define.amd)
		define(["@sorrell/wm-windows"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("@sorrell/wm-windows")) : factory(root["@sorrell/wm-windows"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, (__WEBPACK_EXTERNAL_MODULE__sorrell_wm_windows__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../node_modules/ansi-styles/index.js"
/*!********************************************!*\
  !*** ../node_modules/ansi-styles/index.js ***!
  \********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

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
		colorConvert = __webpack_require__(/*! color-convert */ "../node_modules/color-convert/index.js");
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


/***/ },

/***/ "../node_modules/chalk/source/index.js"
/*!*********************************************!*\
  !*** ../node_modules/chalk/source/index.js ***!
  \*********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

const ansiStyles = __webpack_require__(/*! ansi-styles */ "../node_modules/ansi-styles/index.js");
const {stdout: stdoutColor, stderr: stderrColor} = __webpack_require__(/*! supports-color */ "../node_modules/supports-color/index.js");
const {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
} = __webpack_require__(/*! ./util */ "../node_modules/chalk/source/util.js");

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
		template = __webpack_require__(/*! ./templates */ "../node_modules/chalk/source/templates.js");
	}

	return template(chalk, parts.join(''));
};

Object.defineProperties(Chalk.prototype, styles);

const chalk = Chalk(); // eslint-disable-line new-cap
chalk.supportsColor = stdoutColor;
chalk.stderr = Chalk({level: stderrColor ? stderrColor.level : 0}); // eslint-disable-line new-cap
chalk.stderr.supportsColor = stderrColor;

module.exports = chalk;


/***/ },

/***/ "../node_modules/chalk/source/templates.js"
/*!*************************************************!*\
  !*** ../node_modules/chalk/source/templates.js ***!
  \*************************************************/
(module) {

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


/***/ },

/***/ "../node_modules/chalk/source/util.js"
/*!********************************************!*\
  !*** ../node_modules/chalk/source/util.js ***!
  \********************************************/
(module) {

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


/***/ },

/***/ "../node_modules/color-convert/conversions.js"
/*!****************************************************!*\
  !*** ../node_modules/color-convert/conversions.js ***!
  \****************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

/* MIT license */
/* eslint-disable no-mixed-operators */
const cssKeywords = __webpack_require__(/*! color-name */ "../node_modules/color-name/index.js");

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


/***/ },

/***/ "../node_modules/color-convert/index.js"
/*!**********************************************!*\
  !*** ../node_modules/color-convert/index.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

const conversions = __webpack_require__(/*! ./conversions */ "../node_modules/color-convert/conversions.js");
const route = __webpack_require__(/*! ./route */ "../node_modules/color-convert/route.js");

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


/***/ },

/***/ "../node_modules/color-convert/route.js"
/*!**********************************************!*\
  !*** ../node_modules/color-convert/route.js ***!
  \**********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

const conversions = __webpack_require__(/*! ./conversions */ "../node_modules/color-convert/conversions.js");

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



/***/ },

/***/ "../node_modules/color-name/index.js"
/*!*******************************************!*\
  !*** ../node_modules/color-name/index.js ***!
  \*******************************************/
(module) {

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


/***/ },

/***/ "../node_modules/has-flag/index.js"
/*!*****************************************!*\
  !*** ../node_modules/has-flag/index.js ***!
  \*****************************************/
(module) {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ },

/***/ "../node_modules/supports-color/index.js"
/*!***********************************************!*\
  !*** ../node_modules/supports-color/index.js ***!
  \***********************************************/
(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(/*! os */ "os");
const tty = __webpack_require__(/*! tty */ "tty");
const hasFlag = __webpack_require__(/*! has-flag */ "../node_modules/has-flag/index.js");

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


/***/ },

/***/ "./Source/Main/Development/DevSettings.ts"
/*!************************************************!*\
  !*** ./Source/Main/Development/DevSettings.ts ***!
  \************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * @file      DevSettings.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetDevSettings = void 0;
const DevSettings = __importStar(__webpack_require__(/*! ../../../Configuration/Development/DevSettings.json */ "./Configuration/Development/DevSettings.json"));
const GetDevSettings = () => {
    const { $schema: _, ...Settings } = DevSettings;
    return Settings;
};
exports.GetDevSettings = GetDevSettings;


/***/ },

/***/ "./Source/Main/Development/Log/Log.ts"
/*!********************************************!*\
  !*** ./Source/Main/Development/Log/Log.ts ***!
  \********************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * @file      Log.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogFrontend = LogFrontend;
exports.GetTime = GetTime;
exports.HandleBase64Strings = HandleBase64Strings;
exports.GetLogger = GetLogger;
const LogFormat_1 = __webpack_require__(/*! ./LogFormat */ "./Source/Main/Development/Log/LogFormat.ts");
const chalk_1 = __importDefault(__webpack_require__(/*! chalk */ "../node_modules/chalk/source/index.js"));
const DevSettings_1 = __webpack_require__(/*! #/Development/DevSettings */ "./Source/Main/Development/DevSettings.ts");
const util_1 = __importDefault(__webpack_require__(/*! util */ "util"));
chalk_1.default.level = 3;
const LogSettings = (0, DevSettings_1.GetDevSettings)().Log;
function FormatCategory(Category) {
    const HashStringToBackgroundColor = (Input) => {
        let HashValue = 2166136261;
        for (let Index = 0; Index < Input.length; Index++) {
            HashValue ^= Input.charCodeAt(Index);
            HashValue = Math.imul(HashValue, 16777619);
        }
        HashValue >>>= 0;
        const Hue = HashValue % 360;
        const Saturation = 58 + ((HashValue >>> 8) % 23);
        let Lightness = 26 + ((HashValue >>> 16) % 12);
        let RgbColor = ConvertHslToRgb(Hue, Saturation / 100, Lightness / 100);
        const ShouldAdjustRgbColor = () => {
            return (CalculateContrastRatioWithWhite(RgbColor.Red, RgbColor.Green, RgbColor.Blue) < 4.5 &&
                Lightness > 12);
        };
        while (ShouldAdjustRgbColor()) {
            Lightness--;
            RgbColor = ConvertHslToRgb(Hue, Saturation / 100, Lightness / 100);
        }
        return ConvertRgbToHexColor(RgbColor.Red, RgbColor.Green, RgbColor.Blue);
    };
    const ConvertHslToRgb = (Hue, Saturation, Lightness) => {
        const Chroma = (1 - Math.abs(2 * Lightness - 1)) * Saturation;
        const HuePrime = Hue / 60;
        const SecondComponent = Chroma * (1 - Math.abs((HuePrime % 2) - 1));
        const MatchValue = Lightness - Chroma / 2;
        let RedPrime = 0;
        let GreenPrime = 0;
        let BluePrime = 0;
        if (HuePrime >= 0 && HuePrime < 1) {
            RedPrime = Chroma;
            GreenPrime = SecondComponent;
        }
        else if (HuePrime >= 1 && HuePrime < 2) {
            RedPrime = SecondComponent;
            GreenPrime = Chroma;
        }
        else if (HuePrime >= 2 && HuePrime < 3) {
            GreenPrime = Chroma;
            BluePrime = SecondComponent;
        }
        else if (HuePrime >= 3 && HuePrime < 4) {
            GreenPrime = SecondComponent;
            BluePrime = Chroma;
        }
        else if (HuePrime >= 4 && HuePrime < 5) {
            RedPrime = SecondComponent;
            BluePrime = Chroma;
        }
        else {
            RedPrime = Chroma;
            BluePrime = SecondComponent;
        }
        return {
            Blue: Math.round((BluePrime + MatchValue) * 255),
            Green: Math.round((GreenPrime + MatchValue) * 255),
            Red: Math.round((RedPrime + MatchValue) * 255)
        };
    };
    const CalculateContrastRatioWithWhite = (Red, Green, Blue) => {
        const RelativeLuminance = CalculateSrgbRelativeLuminance(Red, Green, Blue);
        return (1.0 + 0.05) / (RelativeLuminance + 0.05);
    };
    const CalculateSrgbRelativeLuminance = (Red, Green, Blue) => {
        const RedChannel = ConvertSrgbChannelToLinear(Red / 255);
        const GreenChannel = ConvertSrgbChannelToLinear(Green / 255);
        const BlueChannel = ConvertSrgbChannelToLinear(Blue / 255);
        return 0.2126 * RedChannel + 0.7152 * GreenChannel + 0.0722 * BlueChannel;
    };
    const ConvertSrgbChannelToLinear = (Channel) => {
        if (Channel <= 0.04045) {
            return Channel / 12.92;
        }
        return Math.pow((Channel + 0.055) / 1.055, 2.4);
    };
    const ConvertRgbToHexColor = (Red, Green, Blue) => {
        return ("#" +
            ConvertByteToHex(Red) +
            ConvertByteToHex(Green) +
            ConvertByteToHex(Blue));
    };
    const ConvertByteToHex = (Value) => {
        return Value.toString(16).padStart(2, "0").toUpperCase();
    };
    return chalk_1.default.hex("#FFFFFF").bgHex(HashStringToBackgroundColor(Category))(` ${Category} `);
}
;
// const FormatCategoryBasic = (Category: string): string =>
// {
//     const PaddedCategory: string = ` ${ Category } `;
//     let HashValue: number = 0;
//     for (let Index: number = 0; Index < Category.length; Index++)
//     {
//         HashValue = (HashValue << 5) - HashValue + PaddedCategory.charCodeAt(Index);
//         HashValue |= 0;
//     }
//     const BackgroundColors: TArray<FChalkBackground> =
//     [
//         "bgBlack",
//         "bgRed",
//         "bgGreen",
//         "bgYellow",
//         "bgBlue",
//         "bgMagenta",
//         "bgCyan",
//         "bgWhite",
//         "bgGray",
//         "bgGrey"
//     ];
//     const HashedIndex: number = Math.abs(HashValue) % BackgroundColors.length;
//     const SelectedBackground: FChalkBackground = BackgroundColors[HashedIndex];
//     const BrightBackgrounds: TArray<FChalkBackground> =
//     [
//         "bgWhite",
//         "bgYellow",
//         "bgCyan",
//         "bgGray",
//         "bgGrey"
//     ];
//     const IsBright: boolean = BrightBackgrounds.includes(SelectedBackground);
//     const ForegroundColor: FChalkForeground = IsBright ? "black" : "whiteBright";
//     /* @ts-expect-error Type safety hell, using union types that mix functions with objects. */
//     return Chalk[SelectedBackground][ForegroundColor](PaddedCategory);
// };
function FormatLevel(Level) {
    const Colors = {
        Error: chalk_1.default.bgRedBright.whiteBright,
        Normal: chalk_1.default.bgGray,
        Verbose: chalk_1.default.bgCyan.whiteBright,
        Warn: chalk_1.default.bgYellow.whiteBright
    };
    if (typeof Colors[Level] !== "function") {
        throw new Error(`Colors[Level] is ${Level}.`);
    }
    return Colors[Level](` ${Level} `);
}
;
const DisabledCategoriesAttempted = {
    "*": [],
    Backend: [],
    Frontend: [],
    Native: []
};
function LogInternal(Origin, Category, Level, ...Arguments) {
    if (Origin !== "Meta") {
        const DisabledCategories = [
            ...LogSettings.Category.DisabledCategories[Origin],
            ...LogSettings.Category.DisabledCategories["*"]
        ];
        const ShouldLogGivenStatements = !(Category in DisabledCategories);
        if (!ShouldLogGivenStatements) {
            const IsCategoryDisabledUniversally = Category in LogSettings.Category.DisabledCategories["*"];
            const AttemptedCategories = IsCategoryDisabledUniversally
                ? [
                    ...DisabledCategoriesAttempted[Origin],
                    ...DisabledCategoriesAttempted["*"]
                ]
                : DisabledCategoriesAttempted[Origin];
            const ShouldLogDisabledCategory = (LogSettings.Category.LogDisabledCategoryAttempts &&
                !AttemptedCategories.includes(Category));
            if (ShouldLogDisabledCategory) {
                DisabledCategoriesAttempted[IsCategoryDisabledUniversally ? "*" : Origin].push(Category);
                LogInternal("Meta", "Log", "Normal", 
                /* eslint-disable-next-line @stylistic/max-len */
                `The category "${Category}" was logged about, from ${Origin} code.  Further attempts to log this category from this origin will not be reported.`);
            }
            return;
        }
    }
    const OriginEmojiMap = {
        Backend: "λ",
        Frontend: "ƒ",
        Meta: "◈",
        Native: "ϑ"
    };
    const OriginEmoji = OriginEmojiMap[Origin];
    const FormattedArguments = Arguments.map((Argument) => {
        return util_1.default.format(Argument);
    });
    const GetOutStatements = () => {
        const OutStatementsArray = [
            chalk_1.default.bgHex("#AAAAAA").white(` ${OriginEmoji} `),
            FormatLevel(Level),
            FormatCategory(Category),
            " ",
            ...FormattedArguments
        ];
        const OutStatementsBase = OutStatementsArray.join("");
        if (LogSettings.Size.LimitStatementLength.Enabled) {
            const PrefixLength = OutStatementsArray.slice(0, 4).reduce((TotalLength, Statement) => {
                return TotalLength + (Statement?.length ?? 0);
            }, 0);
            const TotalLength = PrefixLength + LogSettings.Size.LimitStatementLength.MaxLength;
            return OutStatementsBase.slice(0, TotalLength);
        }
        else {
            return OutStatementsBase;
        }
    };
    const Stream = Level === "Error"
        ? process.stderr
        : process.stdout;
    Stream.write(GetOutStatements() + "\n");
}
/** This should only be used when registering the Log event. */
function LogFrontend(Category, Level, ...Statements) {
    const Parse = (Statement) => {
        if (typeof Statement === "string") {
            try {
                const ParsedObject = JSON.parse(Statement);
                if (typeof ParsedObject === "object") {
                    return ParsedObject;
                }
                else {
                    return Statement;
                }
            }
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            catch (_Error) {
                return Statement;
            }
        }
        else {
            return Statement;
        }
    };
    const StatementsUntokenized = Statements.map(Parse).map(HandleFrontendTokens);
    LogInternal("Frontend", Category, Level, ...StatementsUntokenized);
}
;
function GetTime() {
    const Now = new Date();
    const Minutes = Now
        .getMinutes()
        .toString()
        .padStart(2, "0");
    const Seconds = Now
        .getSeconds()
        .toString()
        .padStart(2, "0");
    const Milliseconds = Now
        .getMilliseconds()
        .toString()
        .padStart(3, "0");
    return `${Minutes}:${Seconds}.${Milliseconds}`;
}
;
const FrontendTokens = {
    __GetTime__: GetTime
};
function HandleFrontendTokens(Statement) {
    const IsFrontendToken = (In) => {
        if (typeof In === "string") {
            return Object.keys(FrontendTokens).includes(In);
        }
        else {
            return false;
        }
    };
    if (IsFrontendToken(Statement)) {
        return FrontendTokens[Statement]();
    }
    else {
        return Statement;
    }
}
;
function HandleAlwaysApplyFormat(Statement, Statements) {
    if (LogSettings.Format.AlwaysApplyFormat) {
        if (typeof Statement === "string" && Statements.length === 1) {
            return Statement;
        }
        else if (typeof Statement === "object") {
            return (0, LogFormat_1.Format)(Statement);
        }
        else {
            return (0, LogFormat_1.FormatInline)(Statement);
        }
    }
    else {
        return Statement;
    }
}
;
function HandleBase64Strings(Statement, _Statements) {
    if (typeof Statement === "string" && !LogSettings.Format.AlwaysApplyFormat) {
        return (0, LogFormat_1.FormatBase64String)(Statement);
    }
    else {
        return Statement;
    }
}
;
/** Use this to create a logger within a given module so that the log category is set for that module. */
function GetLogger(Category) {
    const MakeLoggerInternal = (Level) => {
        return (...Statements) => {
            const MultiMap = (InArray, ...Handlers) => {
                let Out = InArray.map((Statement) => {
                    return [Statement, Statements];
                });
                Handlers.forEach((Handler) => {
                    Out = Out.map(([Statement, Statements]) => {
                        return [Handler(Statement, Statements), Statements];
                    });
                });
                return Out.map(([Statement]) => {
                    return Statement;
                });
            };
            // const FormattedStatements: TArray<unknown> = Statements;
            const FormattedStatements = MultiMap(Statements, HandleBase64Strings, HandleAlwaysApplyFormat);
            // const FormattedStatements: TArray<unknown> =
            //     IsSimple
            //         ? Statements
            //         : LogSettings.Format.AlwaysApplyFormat
            //             ? (Statements as TArray<FLogValueType>).map((Statement: FLogValueType): string =>
            //             {
            //                 if (typeof Statement === "object")
            //                 {
            //                     return Format(Statement);
            //                 }
            //                 else
            //                 {
            //                     return FormatInline(Statement);
            //                 }
            //             })
            //             : Statements;
            //     // : Formatters.map((Formatter: FLogFormatFunction): unknown =>
            //     // {
            //     //     return Statements.map(Formatter);
            //     // }).flat(20);
            const SpacedOutStatements = FormattedStatements.flatMap((Statement) => {
                return [Statement, " "];
            });
            LogInternal("Backend", Category, Level, ...SpacedOutStatements);
        };
    };
    const Logger = MakeLoggerInternal("Normal");
    Logger.Error = MakeLoggerInternal("Error");
    Logger.Verbose = MakeLoggerInternal("Verbose");
    Logger.Warn = MakeLoggerInternal("Warn");
    return Logger;
}


/***/ },

/***/ "./Source/Main/Development/Log/LogFormat.ts"
/*!**************************************************!*\
  !*** ./Source/Main/Development/Log/LogFormat.ts ***!
  \**************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * @file      LogUtility.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormatBase64String = exports.FormatInline = exports.Format = void 0;
const chalk_1 = __importDefault(__webpack_require__(/*! chalk */ "../node_modules/chalk/source/index.js"));
const DevSettings_1 = __webpack_require__(/*! #/Development/DevSettings */ "./Source/Main/Development/DevSettings.ts");
const functional_1 = __webpack_require__(/*! @sorrell/utilities/functional */ "../Package/Utilities/Distribution/functional.cjs");
chalk_1.default.level = 3;
const LogSettings = (0, DevSettings_1.GetDevSettings)().Log;
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
const GetWithoutAnsi = (In) => {
    /* eslint-disable-next-line @stylistic/max-len, no-control-regex */
    const AnsiEscapeSequencePattern = /[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[a-zA-Z\d]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g;
    return In.replace(AnsiEscapeSequencePattern, "");
};
const GetLength = (In) => {
    return GetWithoutAnsi(In).length;
};
const StyleString = (In) => {
    const Style = {
        Double: `"${In}"`,
        None: In,
        Single: `'${In}'`
    };
    const BaseString = Style[LogSettings.Format.QuoteStyle];
    return LogSettings.Format.Colors
        ? chalk_1.default.hex("#CA5010")(BaseString)
        : BaseString;
};
const StyleSymbol = (In) => {
    return LogSettings.Format.Colors
        ? chalk_1.default.hex("#00B7C3")(In.toString())
        : In.toString();
};
const StyleNumber = (In) => {
    return LogSettings.Format.Colors
        ? chalk_1.default.green(FormatDigits(In))
        : FormatDigits(In);
};
const FormatString = ({ Depth, Value }) => {
    return {
        Depth,
        String: (IsBase64String(Value) && LogSettings.Format.TruncateBase64Strings)
            ? (0, exports.FormatBase64String)(Value)
            : StyleString(Value)
    };
};
const FormatSymbol = ({ Depth, Value }) => {
    return {
        Depth,
        String: StyleSymbol(Value)
    };
};
const Inline = (In) => {
    const SearchedIndices = {
        "<": [],
        "[": [],
        "{": []
    };
    const Recurrence = (LogStrings) => {
        const GetString = (InLogString) => InLogString.String;
        const GetInnermostContainer = (InLogStrings) => {
            const Strings = InLogStrings.map(GetString);
            const StartDelimiters = ["<", "[", "{"];
            const InnermostStartIndex = Math.max(...StartDelimiters
                .map((StartDelimiter) => {
                if (SearchedIndices[StartDelimiter].includes(-1)) {
                    return -1;
                }
                const StopSearchIndex = Math.min(...SearchedIndices[StartDelimiter]);
                const Out = Strings
                    .slice(0, StopSearchIndex)
                    .lastIndexOf(StartDelimiter);
                if (Out === -1) {
                    SearchedIndices[StartDelimiter].push(-1);
                }
                return Out;
            }).flat(20));
            if (InnermostStartIndex === -1) {
                return undefined;
            }
            SearchedIndices[Strings[InnermostStartIndex]].push(InnermostStartIndex);
            const GetFirstIndexOfValueAfterIndex = (Values, TargetValue, AfterIndex) => {
                const StartIndex = Math.min(Math.max(AfterIndex + 1, 0), Values.length);
                for (let Index = StartIndex; Index < Values.length; Index++) {
                    if (Object.is(Values[Index], TargetValue)) {
                        return Index;
                    }
                }
                return undefined;
            };
            const InnermostLogString = InLogStrings[InnermostStartIndex];
            if (InnermostLogString === undefined) {
                return undefined;
            }
            const InnermostStartDelimiter = InnermostLogString.String;
            const InnermostStopDelimiter = InnermostStartDelimiter === "{"
                ? "}"
                : InnermostStartDelimiter === "<"
                    ? ">"
                    : "]";
            const InnermostStopIndex = GetFirstIndexOfValueAfterIndex(Strings, InnermostStopDelimiter, InnermostStartIndex);
            if (InnermostStopIndex === undefined) {
                return undefined;
            }
            const InnermostContainer = InLogStrings.slice(InnermostStartIndex, InnermostStopIndex + 1);
            const StopSubArray = InLogStrings.length >= InnermostStopIndex + 1
                ? InLogStrings.slice(InnermostStopIndex + 1, undefined)
                : [];
            return {
                Container: InnermostContainer,
                StartSubArray: InLogStrings.slice(0, InnermostStartIndex),
                StopSubArray
            };
        };
        const ShouldInline = (ContainerLogStrings) => {
            const TotalWidth = ContainerLogStrings[0].Depth * LogSettings.Size.TabWidth +
                ContainerLogStrings.reduce((Accumulator, CurrentValue) => {
                    return Accumulator + GetLength(CurrentValue.String);
                }, 0);
            return TotalWidth <= LogSettings.Size.MaxTerminalWidth;
        };
        const InnermostContainer = GetInnermostContainer(LogStrings);
        if (InnermostContainer !== undefined) {
            const { Container, StartSubArray, StopSubArray } = InnermostContainer;
            if (ShouldInline(InnermostContainer.Container)) {
                const Inlined = {
                    Depth: Container[0].Depth,
                    String: Container.map(GetString).join(" ")
                };
                return [...StartSubArray, Inlined, ...StopSubArray];
            }
        }
        return LogStrings;
    };
    const ShouldRecur = () => {
        return (!SearchedIndices["<"].includes(-1) ||
            !SearchedIndices["{"].includes(-1) ||
            !SearchedIndices["["].includes(-1));
    };
    let Out = [...In];
    while (ShouldRecur()) {
        Out = Recurrence([...Out]);
    }
    return Out;
};
const FormatDigits = (Value) => {
    const Separators = {
        Comma: ",",
        None: "",
        Space: " ",
        Underscore: "_"
    };
    const Separator = Separators[LogSettings.Format.DigitSeparator];
    const GroupIntegralDigits = (IntegralDigits) => {
        if (IntegralDigits.length <= 3) {
            return IntegralDigits;
        }
        const Groups = [];
        for (let Index = IntegralDigits.length; Index > 0; Index -= 3) {
            const StartIndex = Math.max(0, Index - 3);
            Groups.push(IntegralDigits.slice(StartIndex, Index));
        }
        Groups.reverse();
        return Groups.join(Separator);
    };
    const GroupFractionalDigits = (FractionalDigits) => {
        if (FractionalDigits.length <= 3) {
            return FractionalDigits;
        }
        const Groups = [];
        for (let Index = 0; Index < FractionalDigits.length; Index += 3) {
            Groups.push(FractionalDigits.slice(Index, Index + 3));
        }
        return Groups.join(Separator);
    };
    const ConvertScientificNotationToPlainDecimal = (NumberText) => {
        const ExponentMarkerIndex = NumberText.search(/[eE]/);
        if (ExponentMarkerIndex === -1) {
            return NumberText;
        }
        const MantissaText = NumberText.slice(0, ExponentMarkerIndex);
        const ExponentText = NumberText.slice(ExponentMarkerIndex + 1);
        const ExponentValue = Number(ExponentText);
        let SignText = "";
        let UnsignedMantissaText = MantissaText;
        if (UnsignedMantissaText.startsWith("-")) {
            SignText = "-";
            UnsignedMantissaText = UnsignedMantissaText.slice(1);
        }
        else if (UnsignedMantissaText.startsWith("+")) {
            UnsignedMantissaText = UnsignedMantissaText.slice(1);
        }
        const DecimalPointIndex = UnsignedMantissaText.indexOf(".");
        const DigitsOnly = UnsignedMantissaText.replace(".", "");
        const DigitsBeforeDecimal = (DecimalPointIndex === -1)
            ? DigitsOnly.length
            : DecimalPointIndex;
        const NewDecimalIndex = DigitsBeforeDecimal + ExponentValue;
        if (NewDecimalIndex <= 0) {
            const LeadingZerosCount = -NewDecimalIndex;
            return SignText + "0." + "0".repeat(LeadingZerosCount) + DigitsOnly;
        }
        if (NewDecimalIndex >= DigitsOnly.length) {
            const TrailingZerosCount = NewDecimalIndex - DigitsOnly.length;
            return SignText + DigitsOnly + "0".repeat(TrailingZerosCount);
        }
        return SignText + DigitsOnly.slice(0, NewDecimalIndex) + "." + DigitsOnly.slice(NewDecimalIndex);
    };
    if (typeof Value === "bigint") {
        const IsNegative = Value < 0n;
        const AbsoluteValue = IsNegative ? -Value : Value;
        const IntegralDigits = AbsoluteValue.toString();
        const GroupedIntegralDigits = GroupIntegralDigits(IntegralDigits);
        return (IsNegative ? "-" : "") + GroupedIntegralDigits;
    }
    if (!Number.isFinite(Value)) {
        return String(Value);
    }
    const IsNegative = Value < 0 || Object.is(Value, -0);
    const AbsoluteValue = Math.abs(Value);
    const PlainDecimalText = ConvertScientificNotationToPlainDecimal(AbsoluteValue.toString());
    const Parts = PlainDecimalText.split(".");
    const IntegralDigits = Parts[0] ?? "0";
    const FractionalDigits = Parts[1];
    const GroupedIntegralDigits = GroupIntegralDigits(IntegralDigits);
    if (FractionalDigits === undefined || FractionalDigits.length === 0) {
        return (IsNegative ? "-" : "") + GroupedIntegralDigits;
    }
    const GroupedFractionalDigits = GroupFractionalDigits(FractionalDigits);
    return (IsNegative ? "-" : "") + GroupedIntegralDigits + "." + GroupedFractionalDigits;
};
const FormatNumber = ({ Depth, Value }) => {
    return {
        Depth,
        String: StyleNumber(Value)
    };
};
const FormatNull = ({ Depth }) => {
    return [{
            Depth,
            String: LogSettings.Format.Colors ? chalk_1.default.yellow("null") : "null"
        }];
};
const FormatUndefined = ({ Depth }) => {
    return {
        Depth,
        String: LogSettings.Format.Colors ? chalk_1.default.gray("undefined") : "undefined"
    };
};
const FormatFunction = ({ Depth }) => {
    return {
        Depth,
        String: LogSettings.Format.Colors ? chalk_1.default.red("[ Function ]") : "[ Function ]"
    };
};
const FormatBoolean = ({ Depth, Value }) => {
    const StringBase = Value ? "true" : "false";
    const StyleFunction = LogSettings.Format.Colors
        ? (Value ? chalk_1.default.blue : chalk_1.default.red)
        : functional_1.Identity;
    const String = StyleFunction(StringBase);
    return {
        Depth,
        String
    };
};
const Delimiters = {
    Array: ["[", "]"],
    KeyValuePair: ["{", "}"],
    Map: ["<", ">"],
    Record: ["{", "}"],
    Set: ["{", "}"]
};
const GetDelimiters = (Depth, ContainerType) => {
    const MakeDelimiterLogString = (String) => ({ Depth, String });
    return Delimiters[ContainerType].map(MakeDelimiterLogString);
};
const FormatArray = (LogArray) => {
    return FormatContainer("Array", LogArray);
};
const FormatMap = ({ Depth, Value }) => {
    const FormatKeyValuePair = ({ Depth, Key, Value }) => {
        const [StartDelimiterLogString, StopDelimiterLogString] = GetDelimiters(Depth, "KeyValuePair");
        const FormatMapKey = ({ Depth, Key }) => {
            const Out = FormatValue({ Depth: Depth + 1, Value: Key })[0];
            Out.String += ",";
            return Out;
        };
        const FormatMapValue = ({ Depth, Value }) => {
            return FormatValue({ Depth: Depth + 1, Value });
        };
        const KeyLogString = FormatMapKey({ Depth, Key });
        const ValueLogStrings = FormatMapValue({ Depth, Value });
        return [StartDelimiterLogString, KeyLogString, ...ValueLogStrings, StopDelimiterLogString];
    };
    const [StartDelimiterLogString, StopDelimiterLogString] = GetDelimiters(Depth, "Map");
    const GetKeyValuePairs = (InMap) => {
        const Out = [];
        InMap.forEach((Value, Key) => {
            Out.push({ Depth: Depth + 1, Key, Value: Value });
        });
        return Out;
    };
    const InnerLogStrings = GetKeyValuePairs(Value).map(FormatKeyValuePair).flat(20);
    return [StartDelimiterLogString, ...InnerLogStrings, StopDelimiterLogString];
};
const FormatRecord = ({ Depth, Value }) => {
    const [StartDelimiterLogString, StopDelimiterLogString] = GetDelimiters(Depth, "Record");
    const GetKeyValuePairs = (InRecord) => {
        const Out = [];
        Object.keys(InRecord).forEach((Key) => {
            Out.push({ Depth, Key, Value: InRecord[Key] });
        });
        return Out;
    };
    const KeyValuePairs = GetKeyValuePairs(Value);
    const FormatKeyValuePair = ({ Depth, Key, Value }, Index) => {
        // const [ StartDelimiterLogString, StopDelimiterLogString ] = GetDelimiters(Depth, "Record");
        const FormatRecordKey = ({ Depth, Key }) => {
            const Out = FormatValue({ Depth: Depth + 1, Value: Key })[0];
            Out.String += ":";
            return Out;
        };
        const FormatRecordValue = ({ Depth, Value }) => {
            const Out = FormatValue({ Depth: Depth + 1, Value });
            if (Index !== KeyValuePairs.length - 1) {
                const Last = Out.at(-1);
                if (Last !== undefined) {
                    Last.String += ",";
                }
            }
            return Out;
        };
        const KeyLogString = FormatRecordKey({ Depth, Key });
        const ValueLogStrings = FormatRecordValue({ Depth, Value });
        if (ValueLogStrings.length === 1) {
            const Out = {
                Depth: Depth + 1,
                String: KeyLogString.String + " " + ValueLogStrings[0].String
            };
            return [Out];
        }
        else {
            return [KeyLogString, ...ValueLogStrings];
        }
    };
    const InnerLogStrings = KeyValuePairs.map(FormatKeyValuePair).flat(20);
    return [StartDelimiterLogString, ...InnerLogStrings, StopDelimiterLogString];
};
const FormatContainer = (ContainerType, { Depth, Value }) => {
    const [StartDelimiterLogString, StopDelimiterLogString] = GetDelimiters(Depth, ContainerType);
    const MakeLogValue = (In) => ({ Depth: Depth + 1, Value: In });
    const ValueArray = Array.isArray(Value)
        ? Value
        : Array.from(Value);
    const AppendComma = ({ Depth, String }, Index) => {
        return Index !== ValueArray.length - 1
            ? {
                Depth,
                String: String + ","
            }
            : {
                Depth,
                String
            };
    };
    const InnerLogStrings = ValueArray.map(MakeLogValue).map(FormatValue).flat(20).map(AppendComma);
    if (InnerLogStrings.length === 0) {
        return [{
                Depth,
                String: StartDelimiterLogString.String + " " + StopDelimiterLogString.String
            }];
    }
    else {
        return [StartDelimiterLogString, ...InnerLogStrings, StopDelimiterLogString];
    }
};
const FormatSet = (LogSet) => {
    return FormatContainer("Set", LogSet);
};
const FormatObject = ({ Depth, Value }) => {
    let Formatter = FormatRecord;
    if (Value instanceof Map) {
        Formatter = FormatMap;
    }
    else if (Value instanceof Set) {
        Formatter = FormatSet;
    }
    else if (Array.isArray(Value)) {
        Formatter = FormatArray;
    }
    else if (Value === null) {
        Formatter = FormatNull;
    }
    return Formatter({ Depth, Value });
};
const FormatValue = ({ Depth, Value }) => {
    const Formatters = {
        bigint: FormatNumber,
        boolean: FormatBoolean,
        function: FormatFunction,
        number: FormatNumber,
        object: FormatObject,
        string: FormatString,
        symbol: FormatSymbol,
        undefined: FormatUndefined
    };
    const Values = Formatters[typeof Value]({ Depth, Value });
    return Array.isArray(Values)
        ? Values
        : [Values];
};
const Format = (Value) => {
    const InlinedArray = Inline(FormatValue({ Depth: 0, Value }));
    const Out = InlinedArray
        .map(({ Depth, String }, Index) => {
        const StopDelimiters = [">", "]", "}"];
        const StartDelimiters = ["<", "[", "{"];
        const Character = GetWithoutAnsi(String)[GetWithoutAnsi(String).length - 1] || "";
        if (StopDelimiters.includes(Character)) {
            if (Index !== InlinedArray.length - 1) {
                const Next = InlinedArray[Index + 1];
                if (Next !== undefined) {
                    const NextStringStart = Next.String[0];
                    if (NextStringStart !== undefined) {
                        if (StartDelimiters.includes(NextStringStart)) {
                            String += ",";
                        }
                    }
                }
            }
        }
        return " ".repeat(LogSettings.Size.TabWidth * Depth) + String;
    })
        .join("\n");
    return Out;
};
exports.Format = Format;
const FormatInline = (Value) => {
    return (0, exports.Format)(Value).replaceAll("\n", " ");
};
exports.FormatInline = FormatInline;
const IsBase64String = (In) => {
    // const NormalizedInput: string = In.replace(/\s+/g, "");
    // if (NormalizedInput.length === 0 || NormalizedInput.length % 4 !== 0)
    // {
    //     return false;
    // }
    // return /^[A-Za-z0-9+/]*={0,2}$/.test(NormalizedInput);
    return (In.startsWith("data:") &&
        In.includes(";") &&
        In.length > 20);
};
const FormatBase64String = (In) => {
    if (!LogSettings.Format.TruncateBase64Strings) {
        return In;
    }
    if (IsBase64String(In)) {
        return chalk_1.default.gray(`[ Base64 (${In.slice("data:".length).split(";")[0]}) ]`);
    }
    else {
        return In;
    }
};
exports.FormatBase64String = FormatBase64String;


/***/ },

/***/ "./Source/Main/Development/Log/LogStyle.ts"
/*!*************************************************!*\
  !*** ./Source/Main/Development/Log/LogStyle.ts ***!
  \*************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * @file      LogStyle.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Code = Code;
exports.Bold = Bold;
exports.Italic = Italic;
exports.Underline = Underline;
exports.Background = Background;
exports.Foreground = Foreground;
exports.ComposeStyles = ComposeStyles;
const chalk_1 = __importDefault(__webpack_require__(/*! chalk */ "../node_modules/chalk/source/index.js"));
function Code(In) {
    return chalk_1.default.hex("#EB4657")(In);
}
;
function Bold(In) {
    return chalk_1.default.bold(In);
}
;
function Italic(In) {
    return chalk_1.default.italic(In);
}
;
function Underline(In) {
    return chalk_1.default.underline(In);
}
function IsHexColor(In) {
    return In.includes("#");
}
function Background(Color) {
    if (IsHexColor(Color)) {
        return (In) => {
            return chalk_1.default.bgHex(Color)(In);
        };
    }
    else {
        return (In) => {
            return chalk_1.default[ColorKeywords.Background[Color]](In);
        };
    }
}
;
function Foreground(Color) {
    if (IsHexColor(Color)) {
        return (In) => {
            return chalk_1.default.hex(Color)(In);
        };
    }
    else {
        return (In) => {
            return chalk_1.default[ColorKeywords.Foreground[Color]](In);
        };
    }
}
;
function ComposeStyles(...StyleFunctions) {
    function Identity(In) {
        return In;
    }
    function Reducer(PreviousValue, CurrentValue) {
        return function (In) {
            return PreviousValue(CurrentValue(In));
        };
    }
    return StyleFunctions.reduce(Reducer, Identity);
}
;
const ColorKeywords = {
    Background: {
        Black: "bgBlack",
        BlackBright: "bgBlack",
        Blue: "bgBlue",
        BlueBright: "bgBlue",
        Cyan: "bgCyan",
        CyanBright: "bgCyan",
        Gray: "bgGray",
        Green: "bgGreen",
        GreenBright: "bgGreen",
        Magenta: "bgMagenta",
        MagentaBright: "bgMagenta",
        Red: "bgRed",
        RedBright: "bgRed",
        White: "bgWhite",
        WhiteBright: "bgWhite",
        Yellow: "bgYellow",
        YellowBright: "bgYellow"
    },
    Foreground: {
        Black: "black",
        BlackBright: "blackBright",
        Blue: "blue",
        BlueBright: "blueBright",
        Cyan: "cyan",
        CyanBright: "cyanBright",
        Gray: "gray",
        Green: "green",
        GreenBright: "greenBright",
        Magenta: "magenta",
        MagentaBright: "magentaBright",
        Red: "red",
        RedBright: "redBright",
        White: "white",
        WhiteBright: "whiteBright",
        Yellow: "yellow",
        YellowBright: "yellowBright"
    }
};


/***/ },

/***/ "./Source/Main/Development/Log/LogStyleShorthands.ts"
/*!***********************************************************!*\
  !*** ./Source/Main/Development/Log/LogStyleShorthands.ts ***!
  \***********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * @file      LogStyleShorthands.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Fg = exports.Compose = exports.C = exports.Bg = exports.B = void 0;
const LogStyle_1 = __webpack_require__(/*! ./LogStyle */ "./Source/Main/Development/Log/LogStyle.ts");
exports.B = LogStyle_1.Bold;
exports.Bg = LogStyle_1.Background;
exports.C = LogStyle_1.Code;
exports.Compose = LogStyle_1.ComposeStyles;
exports.Fg = LogStyle_1.Foreground;


/***/ },

/***/ "./Source/Main/Hook.ts"
/*!*****************************!*\
  !*** ./Source/Main/Hook.ts ***!
  \*****************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * @file      Hook.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
(0, wm_windows_1.InitializeHooks)();


/***/ },

/***/ "./Source/Main/Initialize/EntryPoint.ts"
/*!**********************************************!*\
  !*** ./Source/Main/Initialize/EntryPoint.ts ***!
  \**********************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * @file      Main.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 * Comment:   This is the entry point that Electron first loads.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./SideEffects */ "./Source/Main/Initialize/SideEffects.ts");


/***/ },

/***/ "./Source/Main/Initialize/SideEffects.ts"
/*!***********************************************!*\
  !*** ./Source/Main/Initialize/SideEffects.ts ***!
  \***********************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * @file      SideEffects.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Log_1 = __webpack_require__(/*! #/Development/Log/Log */ "./Source/Main/Development/Log/Log.ts");
const LogStyleShorthands_1 = __webpack_require__(/*! #/Development/Log/LogStyleShorthands */ "./Source/Main/Development/Log/LogStyleShorthands.ts");
const Log = (0, Log_1.GetLogger)("SideEffects");
Log(`Importing ${(0, LogStyleShorthands_1.C)("MessageLoop")}...`);
__webpack_require__(/*! ../MessageLoop */ "./Source/Main/MessageLoop.ts");
Log(`Importing ${(0, LogStyleShorthands_1.C)("Hook")}...`);
__webpack_require__(/*! ../Hook */ "./Source/Main/Hook.ts");
setTimeout(async () => {
    Log(`Normal side-effect imports are finished.  Performing ${(0, LogStyleShorthands_1.C)("await import")}s...`);
    Log(`${(0, LogStyleShorthands_1.C)("await import")}ing ${(0, LogStyleShorthands_1.C)("../Development/Log/Log")}...`);
    await Promise.resolve(/*! import() */).then(__webpack_require__.t.bind(__webpack_require__, /*! ../Development/Log/Log */ "./Source/Main/Development/Log/Log.ts", 23));
    Log(`${(0, LogStyleShorthands_1.C)("await import")}ing ${(0, LogStyleShorthands_1.C)("../Initialize/Initialize")}...`);
    await __webpack_require__.e(/*! import() */ "Source_Main_Initialize_Initialize_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./Initialize */ "./Source/Main/Initialize/Initialize.ts"));
    Log(`${(0, LogStyleShorthands_1.C)("await import")}ing ${(0, LogStyleShorthands_1.C)("../Event/NodeIpc")}...`);
    await __webpack_require__.e(/*! import() */ "Source_Main_Event_NodeIpc_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../Event/NodeIpc */ "./Source/Main/Event/NodeIpc.ts"));
    Log(`${(0, LogStyleShorthands_1.C)("await import")}ing ${(0, LogStyleShorthands_1.C)("../Keyboard/Keyboard")}...`);
    await Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_electron-settings_dist_settings_js"), __webpack_require__.e("Source_Main_Initialize_Initialize_ts-Source_Shared_index_ts"), __webpack_require__.e("Source_Main_Development_index_ts"), __webpack_require__.e("Source_Main_Keyboard_Keyboard_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ../Keyboard/Keyboard */ "./Source/Main/Keyboard/Keyboard.ts"));
    Log(`${(0, LogStyleShorthands_1.C)("await import")}ing ${(0, LogStyleShorthands_1.C)("../Monitor")}...`);
    await __webpack_require__.e(/*! import() */ "Source_Main_Monitor_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../Monitor */ "./Source/Main/Monitor.ts"));
    Log(`${(0, LogStyleShorthands_1.C)("await import")}ing ${(0, LogStyleShorthands_1.C)("../Tree/Tree")}...`);
    await Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_electron-settings_dist_settings_js"), __webpack_require__.e("Source_Main_Initialize_Initialize_ts-Source_Shared_index_ts"), __webpack_require__.e("Source_Main_Development_index_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ../Tree/Tree */ "./Source/Main/Tree/Tree.ts"));
    Log(`${(0, LogStyleShorthands_1.C)("await import")}ing ${(0, LogStyleShorthands_1.C)("../Settings/InitializeSettings")}...`);
    await Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_electron-settings_dist_settings_js"), __webpack_require__.e("Source_Main_Initialize_Initialize_ts-Source_Shared_index_ts"), __webpack_require__.e("Source_Main_Settings_InitializeSettings_ts")]).then(__webpack_require__.t.bind(__webpack_require__, /*! ../Settings/InitializeSettings */ "./Source/Main/Settings/InitializeSettings.ts", 23));
    Log(`${(0, LogStyleShorthands_1.C)("await import")}ing ${(0, LogStyleShorthands_1.C)("../Notification")}...`);
    await __webpack_require__.e(/*! import() */ "Source_Main_Notification_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../Notification */ "./Source/Main/Notification.ts"));
    Log(`${(0, LogStyleShorthands_1.C)("await import")}s are finished.  Performing non-awaited ${(0, LogStyleShorthands_1.C)("import")}s...`);
    Log(`${(0, LogStyleShorthands_1.C)("import")}ing ${(0, LogStyleShorthands_1.C)("../Window/BrowserWindow/BrowserWindow")}...`);
    Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_electron-settings_dist_settings_js"), __webpack_require__.e("Source_Main_Initialize_Initialize_ts-Source_Shared_index_ts"), __webpack_require__.e("Source_Main_Development_index_ts"), __webpack_require__.e("Source_Main_Window_BrowserWindow_BrowserWindow_ts")]).then(__webpack_require__.t.bind(__webpack_require__, /*! ../Window/BrowserWindow/BrowserWindow */ "./Source/Main/Window/BrowserWindow/BrowserWindow.ts", 23));
    Log(`${(0, LogStyleShorthands_1.C)("import")}ing ${(0, LogStyleShorthands_1.C)("../CheckAdmin")}...`);
    __webpack_require__.e(/*! import() */ "Source_Main_CheckAdmin_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../CheckAdmin */ "./Source/Main/CheckAdmin.ts"));
    Log(`${(0, LogStyleShorthands_1.C)("import")}ing ${(0, LogStyleShorthands_1.C)("../Window/Overlay/InitializeOverlayWindow")}...`);
    Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_electron-settings_dist_settings_js"), __webpack_require__.e("Source_Main_Initialize_Initialize_ts-Source_Shared_index_ts"), __webpack_require__.e("Source_Main_Development_index_ts"), __webpack_require__.e("Source_Main_Window_BrowserWindow_index_ts"), __webpack_require__.e("Source_Main_Window_Overlay_InitializeOverlayWindow_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ../Window/Overlay/InitializeOverlayWindow */ "./Source/Main/Window/Overlay/InitializeOverlayWindow.ts"));
    Log(`${(0, LogStyleShorthands_1.C)("import")}ing ${(0, LogStyleShorthands_1.C)("./Electron")}...`);
    Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_electron-settings_dist_settings_js"), __webpack_require__.e("vendors-node_modules_electron-updater_out_main_js"), __webpack_require__.e("vendors-node_modules_electron-devtools-installer_dist_index_js-node_modules_electron-log_src_-9c499e"), __webpack_require__.e("Source_Main_Initialize_Initialize_ts-Source_Shared_index_ts"), __webpack_require__.e("Source_Main_Development_index_ts"), __webpack_require__.e("Source_Main_Window_BrowserWindow_index_ts"), __webpack_require__.e("Source_Main_Initialize_Electron_ts")]).then(__webpack_require__.t.bind(__webpack_require__, /*! ./Electron */ "./Source/Main/Initialize/Electron.ts", 23));
    Log(`${(0, LogStyleShorthands_1.C)("import")}ing ${(0, LogStyleShorthands_1.C)("../Tray/InitializeTray")}...`);
    Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_electron-settings_dist_settings_js"), __webpack_require__.e("vendors-node_modules_electron-updater_out_main_js"), __webpack_require__.e("Source_Main_Initialize_Initialize_ts-Source_Shared_index_ts"), __webpack_require__.e("Source_Main_Development_index_ts"), __webpack_require__.e("Source_Main_Window_BrowserWindow_index_ts"), __webpack_require__.e("Source_Main_Window_Settings_SettingsWindow_ts"), __webpack_require__.e("Source_Main_Tray_InitializeTray_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ../Tray/InitializeTray */ "./Source/Main/Tray/InitializeTray.ts"));
    Log(`${(0, LogStyleShorthands_1.C)("import")}ing ${(0, LogStyleShorthands_1.C)("../WinEvent")}...`);
    Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_electron-settings_dist_settings_js"), __webpack_require__.e("Source_Main_Initialize_Initialize_ts-Source_Shared_index_ts"), __webpack_require__.e("Source_Main_Development_index_ts"), __webpack_require__.e("Source_Main_WinEvent_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ../WinEvent */ "./Source/Main/WinEvent.ts"));
    Log(`${(0, LogStyleShorthands_1.C)("import")}ing ${(0, LogStyleShorthands_1.C)("../BorderManager")}...`);
    __webpack_require__.e(/*! import() */ "Source_Main_BorderManager_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../BorderManager */ "./Source/Main/BorderManager.ts"));
    Log(`${(0, LogStyleShorthands_1.C)("import")}ing ${(0, LogStyleShorthands_1.C)("../WindowTracker")}...`);
    __webpack_require__.e(/*! import() */ "Source_Main_WindowTracker_ts").then(__webpack_require__.bind(__webpack_require__, /*! ../WindowTracker */ "./Source/Main/WindowTracker.ts"));
    Log(`${(0, LogStyleShorthands_1.C)("import")}ing ${(0, LogStyleShorthands_1.C)("../Window/Settings/SettingsWindow")}...`);
    Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_electron-settings_dist_settings_js"), __webpack_require__.e("vendors-node_modules_electron-updater_out_main_js"), __webpack_require__.e("Source_Main_Initialize_Initialize_ts-Source_Shared_index_ts"), __webpack_require__.e("Source_Main_Development_index_ts"), __webpack_require__.e("Source_Main_Window_BrowserWindow_index_ts"), __webpack_require__.e("Source_Main_Window_Settings_SettingsWindow_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ../Window/Settings/SettingsWindow */ "./Source/Main/Window/Settings/SettingsWindow.ts"));
    Log(`${(0, LogStyleShorthands_1.C)("import")}ing ${(0, LogStyleShorthands_1.C)("../Store")}...`);
    Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_electron-settings_dist_settings_js"), __webpack_require__.e("Source_Main_Initialize_Initialize_ts-Source_Shared_index_ts"), __webpack_require__.e("Source_Main_Store_ts")]).then(__webpack_require__.t.bind(__webpack_require__, /*! ../Store */ "./Source/Main/Store.ts", 23));
    Log(`${(0, LogStyleShorthands_1.C)("import")}ing ${(0, LogStyleShorthands_1.C)("../Development/DummyWindows")}...`);
    Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_electron-settings_dist_settings_js"), __webpack_require__.e("Source_Main_Initialize_Initialize_ts-Source_Shared_index_ts"), __webpack_require__.e("Source_Main_Development_index_ts"), __webpack_require__.e("Source_Main_Window_BrowserWindow_index_ts"), __webpack_require__.e("Source_Main_Development_DummyWindows_ts")]).then(__webpack_require__.t.bind(__webpack_require__, /*! ../Development/DummyWindows */ "./Source/Main/Development/DummyWindows.ts", 23));
    Log("All side-effect imports are complete!");
});


/***/ },

/***/ "./Source/Main/MessageLoop.ts"
/*!************************************!*\
  !*** ./Source/Main/MessageLoop.ts ***!
  \************************************/
(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * @file      MessageLoop.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024 Gage Sorrell
 * @license   MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/** This file must be side-effect imported by `Main`. */
const wm_windows_1 = __webpack_require__(/*! @sorrell/wm-windows */ "@sorrell/wm-windows");
const RunInitializeMessageLoop = () => {
    (0, wm_windows_1.InitializeMessageLoop)(() => {
    });
};
RunInitializeMessageLoop();


/***/ },

/***/ "assert"
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
(module) {

"use strict";
module.exports = require("assert");

/***/ },

/***/ "buffer"
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
(module) {

"use strict";
module.exports = require("buffer");

/***/ },

/***/ "child_process"
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
(module) {

"use strict";
module.exports = require("child_process");

/***/ },

/***/ "constants"
/*!****************************!*\
  !*** external "constants" ***!
  \****************************/
(module) {

"use strict";
module.exports = require("constants");

/***/ },

/***/ "crypto"
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
(module) {

"use strict";
module.exports = require("crypto");

/***/ },

/***/ "electron"
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
(module) {

"use strict";
module.exports = require("electron");

/***/ },

/***/ "events"
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
(module) {

"use strict";
module.exports = require("events");

/***/ },

/***/ "fs"
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
(module) {

"use strict";
module.exports = require("fs");

/***/ },

/***/ "http"
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
(module) {

"use strict";
module.exports = require("http");

/***/ },

/***/ "https"
/*!************************!*\
  !*** external "https" ***!
  \************************/
(module) {

"use strict";
module.exports = require("https");

/***/ },

/***/ "os"
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
(module) {

"use strict";
module.exports = require("os");

/***/ },

/***/ "path"
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
(module) {

"use strict";
module.exports = require("path");

/***/ },

/***/ "stream"
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
(module) {

"use strict";
module.exports = require("stream");

/***/ },

/***/ "tty"
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
(module) {

"use strict";
module.exports = require("tty");

/***/ },

/***/ "url"
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
(module) {

"use strict";
module.exports = require("url");

/***/ },

/***/ "util"
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
(module) {

"use strict";
module.exports = require("util");

/***/ },

/***/ "worker_threads"
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
(module) {

"use strict";
module.exports = require("worker_threads");

/***/ },

/***/ "zlib"
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
(module) {

"use strict";
module.exports = require("zlib");

/***/ },

/***/ "@sorrell/wm-windows"
/*!**************************************!*\
  !*** external "@sorrell/wm-windows" ***!
  \**************************************/
(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__sorrell_wm_windows__;

/***/ },

/***/ "../Package/Utilities/Distribution/functional.cjs"
/*!********************************************************!*\
  !*** ../Package/Utilities/Distribution/functional.cjs ***!
  \********************************************************/
(module) {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// Source/Functional/index.ts
var Functional_exports = {};
__export(Functional_exports, {
  Identity: () => Identity
});
module.exports = __toCommonJS(Functional_exports);

// Source/Functional/Functional.ts
function Identity(...Arguments) {
  return Arguments;
}
/**
 * @file      Functional.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
/**
 * @file      Functional.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */
//# sourceMappingURL=functional.cjs.map


/***/ },

/***/ "./Configuration/Development/DevSettings.json"
/*!****************************************************!*\
  !*** ./Configuration/Development/DevSettings.json ***!
  \****************************************************/
(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"$schema":"./DevSettings.Schema.json","Log":{"Category":{"DisabledCategories":{"*":["Event"],"Backend":[],"Frontend":[],"Native":[]},"LogDisabledCategoryAttempts":true},"Format":{"AlwaysApplyFormat":true,"Colors":true,"DigitSeparator":"Space","QuoteStyle":"Double","TruncateBase64Strings":true},"Size":{"LimitStatementLength":{"Enabled":false,"MaxLength":256},"MaxTerminalWidth":60,"TabWidth":4}},"SettingsWindow":{"ShowOnLaunch":{"Enabled":false,"Position":{"Height":920,"Width":1080,"X":-1080,"Y":-400}}},"StaticMode":{"Enabled":false,"WindowShape":{"Height":1920,"Width":1080,"X":-1080,"Y":0}},"CreateDummyWindows":{"Enabled":true,"ConfigurationPath":"./Dummy.MainMonitor.Simple.Horizontal.json"}}');

/***/ }

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
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
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
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
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
/******/ 					var installedChunk = require("./" + __webpack_require__.u(chunkId));
/******/ 					if (!installedChunks[chunkId]) {
/******/ 						installChunk(installedChunk);
/******/ 					}
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
/******/ 	var __webpack_exports__ = __webpack_require__(__webpack_require__.s = "./Source/Main/Initialize/EntryPoint.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LE9BQU87QUFDakMsa0JBQWtCLFFBQVEsT0FBTztBQUNqQyxrQkFBa0IsUUFBUSxPQUFPO0FBQ2pDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBFQUEwRTs7QUFFMUU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlEQUFpRCxFQUFFLFVBQVUsRUFBRTtBQUMvRDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsYUFBYSxhQUFhO0FBQzFDO0FBQ0EsZ0JBQWdCLGFBQWEsYUFBYTtBQUMxQztBQUNBLGdCQUFnQixhQUFhLGFBQWE7QUFDMUM7QUFDQSxnQkFBZ0IsYUFBYSxhQUFhO0FBQzFDO0FBQ0EsZ0JBQWdCLGFBQWEsYUFBYTtBQUMxQztBQUNBLGdCQUFnQixhQUFhO0FBQzdCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7QUN0MEJBLG9CQUFvQixtQkFBTyxDQUFDLG1FQUFlO0FBQzNDLGNBQWMsbUJBQU8sQ0FBQyx1REFBUzs7QUFFL0I7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBLHdDQUF3QyxTQUFTO0FBQ2pEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx3REFBd0QsdUNBQXVDO0FBQy9GLHNEQUFzRCxxQ0FBcUM7O0FBRTNGO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGLENBQUM7O0FBRUQ7Ozs7Ozs7Ozs7O0FDaEZBLG9CQUFvQixtQkFBTyxDQUFDLG1FQUFlOztBQUUzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0NBQXNDLFNBQVM7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7O0FBRTVCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwwQ0FBMEMsU0FBUztBQUNuRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQ0FBc0MsU0FBUztBQUMvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7OztBQy9GWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGLEU7Ozs7O1dDUkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxFOzs7OztXQ0pBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RCxFOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRTs7Ozs7V0NKQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQkFBZ0IscUJBQXFCO1dBQ3JDOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsYUFBYTtXQUNiO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsSUFBSTtXQUNKO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUEsa0I7Ozs7O1VFeENBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4uL25vZGVfbW9kdWxlcy9hbnNpLXN0eWxlcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uLi9ub2RlX21vZHVsZXMvY2hhbGsvc291cmNlL2luZGV4LmpzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4uL25vZGVfbW9kdWxlcy9jaGFsay9zb3VyY2UvdGVtcGxhdGVzLmpzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4uL25vZGVfbW9kdWxlcy9jaGFsay9zb3VyY2UvdXRpbC5qcyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uLi9ub2RlX21vZHVsZXMvY29sb3ItY29udmVydC9jb252ZXJzaW9ucy5qcyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uLi9ub2RlX21vZHVsZXMvY29sb3ItY29udmVydC9pbmRleC5qcyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uLi9ub2RlX21vZHVsZXMvY29sb3ItY29udmVydC9yb3V0ZS5qcyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uLi9ub2RlX21vZHVsZXMvY29sb3ItbmFtZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uLi9ub2RlX21vZHVsZXMvaGFzLWZsYWcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi4vbm9kZV9tb2R1bGVzL3N1cHBvcnRzLWNvbG9yL2luZGV4LmpzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vRGV2ZWxvcG1lbnQvRGV2U2V0dGluZ3MudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9EZXZlbG9wbWVudC9Mb2cvTG9nLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vRGV2ZWxvcG1lbnQvTG9nL0xvZ0Zvcm1hdC50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL0RldmVsb3BtZW50L0xvZy9Mb2dTdHlsZS50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL0RldmVsb3BtZW50L0xvZy9Mb2dTdHlsZVNob3J0aGFuZHMudHMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vLi9Tb3VyY2UvTWFpbi9Ib29rLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vSW5pdGlhbGl6ZS9FbnRyeVBvaW50LnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtLy4vU291cmNlL01haW4vSW5pdGlhbGl6ZS9TaWRlRWZmZWN0cy50cyIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uL1NvdXJjZS9NYWluL01lc3NhZ2VMb29wLnRzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJhc3NlcnRcIiIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiYnVmZmVyXCIiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImNoaWxkX3Byb2Nlc3NcIiIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiY29uc3RhbnRzXCIiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImNyeXB0b1wiIiwid2VicGFjazovL0Bzb3JyZWxsL3dtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJlbGVjdHJvblwiIiwid2VicGFjazovL0Bzb3JyZWxsL3dtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJldmVudHNcIiIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZnNcIiIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiaHR0cFwiIiwid2VicGFjazovL0Bzb3JyZWxsL3dtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJodHRwc1wiIiwid2VicGFjazovL0Bzb3JyZWxsL3dtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJvc1wiIiwid2VicGFjazovL0Bzb3JyZWxsL3dtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInN0cmVhbVwiIiwid2VicGFjazovL0Bzb3JyZWxsL3dtL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJ0dHlcIiIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwidXJsXCIiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInV0aWxcIiIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwid29ya2VyX3RocmVhZHNcIiIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiemxpYlwiIiwid2VicGFjazovL0Bzb3JyZWxsL3dtL2V4dGVybmFsIHVtZCBcIkBzb3JyZWxsL3dtLXdpbmRvd3NcIiIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS8uLi9QYWNrYWdlL1V0aWxpdGllcy9EaXN0cmlidXRpb24vZnVuY3Rpb25hbC5janMiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vd2VicGFjay9ydW50aW1lL2NyZWF0ZSBmYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0Bzb3JyZWxsL3dtL3dlYnBhY2svcnVudGltZS9lbnN1cmUgY2h1bmsiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vd2VicGFjay9ydW50aW1lL2dldCBqYXZhc2NyaXB0IGNodW5rIGZpbGVuYW1lIiwid2VicGFjazovL0Bzb3JyZWxsL3dtL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL0Bzb3JyZWxsL3dtL3dlYnBhY2svcnVudGltZS9yZXF1aXJlIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9Ac29ycmVsbC93bS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQHNvcnJlbGwvd20vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcIkBzb3JyZWxsL3dtLXdpbmRvd3NcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wiQHNvcnJlbGwvd20td2luZG93c1wiXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZmFjdG9yeShyZXF1aXJlKFwiQHNvcnJlbGwvd20td2luZG93c1wiKSkgOiBmYWN0b3J5KHJvb3RbXCJAc29ycmVsbC93bS13aW5kb3dzXCJdKTtcblx0XHRmb3IodmFyIGkgaW4gYSkgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyA/IGV4cG9ydHMgOiByb290KVtpXSA9IGFbaV07XG5cdH1cbn0pKGdsb2JhbCwgKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfX3NvcnJlbGxfd21fd2luZG93c19fKSA9PiB7XG5yZXR1cm4gIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB3cmFwQW5zaTE2ID0gKGZuLCBvZmZzZXQpID0+ICguLi5hcmdzKSA9PiB7XG5cdGNvbnN0IGNvZGUgPSBmbiguLi5hcmdzKTtcblx0cmV0dXJuIGBcXHUwMDFCWyR7Y29kZSArIG9mZnNldH1tYDtcbn07XG5cbmNvbnN0IHdyYXBBbnNpMjU2ID0gKGZuLCBvZmZzZXQpID0+ICguLi5hcmdzKSA9PiB7XG5cdGNvbnN0IGNvZGUgPSBmbiguLi5hcmdzKTtcblx0cmV0dXJuIGBcXHUwMDFCWyR7MzggKyBvZmZzZXR9OzU7JHtjb2RlfW1gO1xufTtcblxuY29uc3Qgd3JhcEFuc2kxNm0gPSAoZm4sIG9mZnNldCkgPT4gKC4uLmFyZ3MpID0+IHtcblx0Y29uc3QgcmdiID0gZm4oLi4uYXJncyk7XG5cdHJldHVybiBgXFx1MDAxQlskezM4ICsgb2Zmc2V0fTsyOyR7cmdiWzBdfTske3JnYlsxXX07JHtyZ2JbMl19bWA7XG59O1xuXG5jb25zdCBhbnNpMmFuc2kgPSBuID0+IG47XG5jb25zdCByZ2IycmdiID0gKHIsIGcsIGIpID0+IFtyLCBnLCBiXTtcblxuY29uc3Qgc2V0TGF6eVByb3BlcnR5ID0gKG9iamVjdCwgcHJvcGVydHksIGdldCkgPT4ge1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSwge1xuXHRcdGdldDogKCkgPT4ge1xuXHRcdFx0Y29uc3QgdmFsdWUgPSBnZXQoKTtcblxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgcHJvcGVydHksIHtcblx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9LFxuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Y29uZmlndXJhYmxlOiB0cnVlXG5cdH0pO1xufTtcblxuLyoqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCdjb2xvci1jb252ZXJ0Jyl9ICovXG5sZXQgY29sb3JDb252ZXJ0O1xuY29uc3QgbWFrZUR5bmFtaWNTdHlsZXMgPSAod3JhcCwgdGFyZ2V0U3BhY2UsIGlkZW50aXR5LCBpc0JhY2tncm91bmQpID0+IHtcblx0aWYgKGNvbG9yQ29udmVydCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0Y29sb3JDb252ZXJ0ID0gcmVxdWlyZSgnY29sb3ItY29udmVydCcpO1xuXHR9XG5cblx0Y29uc3Qgb2Zmc2V0ID0gaXNCYWNrZ3JvdW5kID8gMTAgOiAwO1xuXHRjb25zdCBzdHlsZXMgPSB7fTtcblxuXHRmb3IgKGNvbnN0IFtzb3VyY2VTcGFjZSwgc3VpdGVdIG9mIE9iamVjdC5lbnRyaWVzKGNvbG9yQ29udmVydCkpIHtcblx0XHRjb25zdCBuYW1lID0gc291cmNlU3BhY2UgPT09ICdhbnNpMTYnID8gJ2Fuc2knIDogc291cmNlU3BhY2U7XG5cdFx0aWYgKHNvdXJjZVNwYWNlID09PSB0YXJnZXRTcGFjZSkge1xuXHRcdFx0c3R5bGVzW25hbWVdID0gd3JhcChpZGVudGl0eSwgb2Zmc2V0KTtcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBzdWl0ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdHN0eWxlc1tuYW1lXSA9IHdyYXAoc3VpdGVbdGFyZ2V0U3BhY2VdLCBvZmZzZXQpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBzdHlsZXM7XG59O1xuXG5mdW5jdGlvbiBhc3NlbWJsZVN0eWxlcygpIHtcblx0Y29uc3QgY29kZXMgPSBuZXcgTWFwKCk7XG5cdGNvbnN0IHN0eWxlcyA9IHtcblx0XHRtb2RpZmllcjoge1xuXHRcdFx0cmVzZXQ6IFswLCAwXSxcblx0XHRcdC8vIDIxIGlzbid0IHdpZGVseSBzdXBwb3J0ZWQgYW5kIDIyIGRvZXMgdGhlIHNhbWUgdGhpbmdcblx0XHRcdGJvbGQ6IFsxLCAyMl0sXG5cdFx0XHRkaW06IFsyLCAyMl0sXG5cdFx0XHRpdGFsaWM6IFszLCAyM10sXG5cdFx0XHR1bmRlcmxpbmU6IFs0LCAyNF0sXG5cdFx0XHRpbnZlcnNlOiBbNywgMjddLFxuXHRcdFx0aGlkZGVuOiBbOCwgMjhdLFxuXHRcdFx0c3RyaWtldGhyb3VnaDogWzksIDI5XVxuXHRcdH0sXG5cdFx0Y29sb3I6IHtcblx0XHRcdGJsYWNrOiBbMzAsIDM5XSxcblx0XHRcdHJlZDogWzMxLCAzOV0sXG5cdFx0XHRncmVlbjogWzMyLCAzOV0sXG5cdFx0XHR5ZWxsb3c6IFszMywgMzldLFxuXHRcdFx0Ymx1ZTogWzM0LCAzOV0sXG5cdFx0XHRtYWdlbnRhOiBbMzUsIDM5XSxcblx0XHRcdGN5YW46IFszNiwgMzldLFxuXHRcdFx0d2hpdGU6IFszNywgMzldLFxuXG5cdFx0XHQvLyBCcmlnaHQgY29sb3Jcblx0XHRcdGJsYWNrQnJpZ2h0OiBbOTAsIDM5XSxcblx0XHRcdHJlZEJyaWdodDogWzkxLCAzOV0sXG5cdFx0XHRncmVlbkJyaWdodDogWzkyLCAzOV0sXG5cdFx0XHR5ZWxsb3dCcmlnaHQ6IFs5MywgMzldLFxuXHRcdFx0Ymx1ZUJyaWdodDogWzk0LCAzOV0sXG5cdFx0XHRtYWdlbnRhQnJpZ2h0OiBbOTUsIDM5XSxcblx0XHRcdGN5YW5CcmlnaHQ6IFs5NiwgMzldLFxuXHRcdFx0d2hpdGVCcmlnaHQ6IFs5NywgMzldXG5cdFx0fSxcblx0XHRiZ0NvbG9yOiB7XG5cdFx0XHRiZ0JsYWNrOiBbNDAsIDQ5XSxcblx0XHRcdGJnUmVkOiBbNDEsIDQ5XSxcblx0XHRcdGJnR3JlZW46IFs0MiwgNDldLFxuXHRcdFx0YmdZZWxsb3c6IFs0MywgNDldLFxuXHRcdFx0YmdCbHVlOiBbNDQsIDQ5XSxcblx0XHRcdGJnTWFnZW50YTogWzQ1LCA0OV0sXG5cdFx0XHRiZ0N5YW46IFs0NiwgNDldLFxuXHRcdFx0YmdXaGl0ZTogWzQ3LCA0OV0sXG5cblx0XHRcdC8vIEJyaWdodCBjb2xvclxuXHRcdFx0YmdCbGFja0JyaWdodDogWzEwMCwgNDldLFxuXHRcdFx0YmdSZWRCcmlnaHQ6IFsxMDEsIDQ5XSxcblx0XHRcdGJnR3JlZW5CcmlnaHQ6IFsxMDIsIDQ5XSxcblx0XHRcdGJnWWVsbG93QnJpZ2h0OiBbMTAzLCA0OV0sXG5cdFx0XHRiZ0JsdWVCcmlnaHQ6IFsxMDQsIDQ5XSxcblx0XHRcdGJnTWFnZW50YUJyaWdodDogWzEwNSwgNDldLFxuXHRcdFx0YmdDeWFuQnJpZ2h0OiBbMTA2LCA0OV0sXG5cdFx0XHRiZ1doaXRlQnJpZ2h0OiBbMTA3LCA0OV1cblx0XHR9XG5cdH07XG5cblx0Ly8gQWxpYXMgYnJpZ2h0IGJsYWNrIGFzIGdyYXkgKGFuZCBncmV5KVxuXHRzdHlsZXMuY29sb3IuZ3JheSA9IHN0eWxlcy5jb2xvci5ibGFja0JyaWdodDtcblx0c3R5bGVzLmJnQ29sb3IuYmdHcmF5ID0gc3R5bGVzLmJnQ29sb3IuYmdCbGFja0JyaWdodDtcblx0c3R5bGVzLmNvbG9yLmdyZXkgPSBzdHlsZXMuY29sb3IuYmxhY2tCcmlnaHQ7XG5cdHN0eWxlcy5iZ0NvbG9yLmJnR3JleSA9IHN0eWxlcy5iZ0NvbG9yLmJnQmxhY2tCcmlnaHQ7XG5cblx0Zm9yIChjb25zdCBbZ3JvdXBOYW1lLCBncm91cF0gb2YgT2JqZWN0LmVudHJpZXMoc3R5bGVzKSkge1xuXHRcdGZvciAoY29uc3QgW3N0eWxlTmFtZSwgc3R5bGVdIG9mIE9iamVjdC5lbnRyaWVzKGdyb3VwKSkge1xuXHRcdFx0c3R5bGVzW3N0eWxlTmFtZV0gPSB7XG5cdFx0XHRcdG9wZW46IGBcXHUwMDFCWyR7c3R5bGVbMF19bWAsXG5cdFx0XHRcdGNsb3NlOiBgXFx1MDAxQlske3N0eWxlWzFdfW1gXG5cdFx0XHR9O1xuXG5cdFx0XHRncm91cFtzdHlsZU5hbWVdID0gc3R5bGVzW3N0eWxlTmFtZV07XG5cblx0XHRcdGNvZGVzLnNldChzdHlsZVswXSwgc3R5bGVbMV0pO1xuXHRcdH1cblxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdHlsZXMsIGdyb3VwTmFtZSwge1xuXHRcdFx0dmFsdWU6IGdyb3VwLFxuXHRcdFx0ZW51bWVyYWJsZTogZmFsc2Vcblx0XHR9KTtcblx0fVxuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdHlsZXMsICdjb2RlcycsIHtcblx0XHR2YWx1ZTogY29kZXMsXG5cdFx0ZW51bWVyYWJsZTogZmFsc2Vcblx0fSk7XG5cblx0c3R5bGVzLmNvbG9yLmNsb3NlID0gJ1xcdTAwMUJbMzltJztcblx0c3R5bGVzLmJnQ29sb3IuY2xvc2UgPSAnXFx1MDAxQls0OW0nO1xuXG5cdHNldExhenlQcm9wZXJ0eShzdHlsZXMuY29sb3IsICdhbnNpJywgKCkgPT4gbWFrZUR5bmFtaWNTdHlsZXMod3JhcEFuc2kxNiwgJ2Fuc2kxNicsIGFuc2kyYW5zaSwgZmFsc2UpKTtcblx0c2V0TGF6eVByb3BlcnR5KHN0eWxlcy5jb2xvciwgJ2Fuc2kyNTYnLCAoKSA9PiBtYWtlRHluYW1pY1N0eWxlcyh3cmFwQW5zaTI1NiwgJ2Fuc2kyNTYnLCBhbnNpMmFuc2ksIGZhbHNlKSk7XG5cdHNldExhenlQcm9wZXJ0eShzdHlsZXMuY29sb3IsICdhbnNpMTZtJywgKCkgPT4gbWFrZUR5bmFtaWNTdHlsZXMod3JhcEFuc2kxNm0sICdyZ2InLCByZ2IycmdiLCBmYWxzZSkpO1xuXHRzZXRMYXp5UHJvcGVydHkoc3R5bGVzLmJnQ29sb3IsICdhbnNpJywgKCkgPT4gbWFrZUR5bmFtaWNTdHlsZXMod3JhcEFuc2kxNiwgJ2Fuc2kxNicsIGFuc2kyYW5zaSwgdHJ1ZSkpO1xuXHRzZXRMYXp5UHJvcGVydHkoc3R5bGVzLmJnQ29sb3IsICdhbnNpMjU2JywgKCkgPT4gbWFrZUR5bmFtaWNTdHlsZXMod3JhcEFuc2kyNTYsICdhbnNpMjU2JywgYW5zaTJhbnNpLCB0cnVlKSk7XG5cdHNldExhenlQcm9wZXJ0eShzdHlsZXMuYmdDb2xvciwgJ2Fuc2kxNm0nLCAoKSA9PiBtYWtlRHluYW1pY1N0eWxlcyh3cmFwQW5zaTE2bSwgJ3JnYicsIHJnYjJyZ2IsIHRydWUpKTtcblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG4vLyBNYWtlIHRoZSBleHBvcnQgaW1tdXRhYmxlXG5PYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCAnZXhwb3J0cycsIHtcblx0ZW51bWVyYWJsZTogdHJ1ZSxcblx0Z2V0OiBhc3NlbWJsZVN0eWxlc1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBhbnNpU3R5bGVzID0gcmVxdWlyZSgnYW5zaS1zdHlsZXMnKTtcbmNvbnN0IHtzdGRvdXQ6IHN0ZG91dENvbG9yLCBzdGRlcnI6IHN0ZGVyckNvbG9yfSA9IHJlcXVpcmUoJ3N1cHBvcnRzLWNvbG9yJyk7XG5jb25zdCB7XG5cdHN0cmluZ1JlcGxhY2VBbGwsXG5cdHN0cmluZ0VuY2FzZUNSTEZXaXRoRmlyc3RJbmRleFxufSA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCB7aXNBcnJheX0gPSBBcnJheTtcblxuLy8gYHN1cHBvcnRzQ29sb3IubGV2ZWxgIOKGkiBgYW5zaVN0eWxlcy5jb2xvcltuYW1lXWAgbWFwcGluZ1xuY29uc3QgbGV2ZWxNYXBwaW5nID0gW1xuXHQnYW5zaScsXG5cdCdhbnNpJyxcblx0J2Fuc2kyNTYnLFxuXHQnYW5zaTE2bSdcbl07XG5cbmNvbnN0IHN0eWxlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbmNvbnN0IGFwcGx5T3B0aW9ucyA9IChvYmplY3QsIG9wdGlvbnMgPSB7fSkgPT4ge1xuXHRpZiAob3B0aW9ucy5sZXZlbCAmJiAhKE51bWJlci5pc0ludGVnZXIob3B0aW9ucy5sZXZlbCkgJiYgb3B0aW9ucy5sZXZlbCA+PSAwICYmIG9wdGlvbnMubGV2ZWwgPD0gMykpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgbGV2ZWxgIG9wdGlvbiBzaG91bGQgYmUgYW4gaW50ZWdlciBmcm9tIDAgdG8gMycpO1xuXHR9XG5cblx0Ly8gRGV0ZWN0IGxldmVsIGlmIG5vdCBzZXQgbWFudWFsbHlcblx0Y29uc3QgY29sb3JMZXZlbCA9IHN0ZG91dENvbG9yID8gc3Rkb3V0Q29sb3IubGV2ZWwgOiAwO1xuXHRvYmplY3QubGV2ZWwgPSBvcHRpb25zLmxldmVsID09PSB1bmRlZmluZWQgPyBjb2xvckxldmVsIDogb3B0aW9ucy5sZXZlbDtcbn07XG5cbmNsYXNzIENoYWxrQ2xhc3Mge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0cnVjdG9yLXJldHVyblxuXHRcdHJldHVybiBjaGFsa0ZhY3Rvcnkob3B0aW9ucyk7XG5cdH1cbn1cblxuY29uc3QgY2hhbGtGYWN0b3J5ID0gb3B0aW9ucyA9PiB7XG5cdGNvbnN0IGNoYWxrID0ge307XG5cdGFwcGx5T3B0aW9ucyhjaGFsaywgb3B0aW9ucyk7XG5cblx0Y2hhbGsudGVtcGxhdGUgPSAoLi4uYXJndW1lbnRzXykgPT4gY2hhbGtUYWcoY2hhbGsudGVtcGxhdGUsIC4uLmFyZ3VtZW50c18pO1xuXG5cdE9iamVjdC5zZXRQcm90b3R5cGVPZihjaGFsaywgQ2hhbGsucHJvdG90eXBlKTtcblx0T2JqZWN0LnNldFByb3RvdHlwZU9mKGNoYWxrLnRlbXBsYXRlLCBjaGFsayk7XG5cblx0Y2hhbGsudGVtcGxhdGUuY29uc3RydWN0b3IgPSAoKSA9PiB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdgY2hhbGsuY29uc3RydWN0b3IoKWAgaXMgZGVwcmVjYXRlZC4gVXNlIGBuZXcgY2hhbGsuSW5zdGFuY2UoKWAgaW5zdGVhZC4nKTtcblx0fTtcblxuXHRjaGFsay50ZW1wbGF0ZS5JbnN0YW5jZSA9IENoYWxrQ2xhc3M7XG5cblx0cmV0dXJuIGNoYWxrLnRlbXBsYXRlO1xufTtcblxuZnVuY3Rpb24gQ2hhbGsob3B0aW9ucykge1xuXHRyZXR1cm4gY2hhbGtGYWN0b3J5KG9wdGlvbnMpO1xufVxuXG5mb3IgKGNvbnN0IFtzdHlsZU5hbWUsIHN0eWxlXSBvZiBPYmplY3QuZW50cmllcyhhbnNpU3R5bGVzKSkge1xuXHRzdHlsZXNbc3R5bGVOYW1lXSA9IHtcblx0XHRnZXQoKSB7XG5cdFx0XHRjb25zdCBidWlsZGVyID0gY3JlYXRlQnVpbGRlcih0aGlzLCBjcmVhdGVTdHlsZXIoc3R5bGUub3Blbiwgc3R5bGUuY2xvc2UsIHRoaXMuX3N0eWxlciksIHRoaXMuX2lzRW1wdHkpO1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIHN0eWxlTmFtZSwge3ZhbHVlOiBidWlsZGVyfSk7XG5cdFx0XHRyZXR1cm4gYnVpbGRlcjtcblx0XHR9XG5cdH07XG59XG5cbnN0eWxlcy52aXNpYmxlID0ge1xuXHRnZXQoKSB7XG5cdFx0Y29uc3QgYnVpbGRlciA9IGNyZWF0ZUJ1aWxkZXIodGhpcywgdGhpcy5fc3R5bGVyLCB0cnVlKTtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3Zpc2libGUnLCB7dmFsdWU6IGJ1aWxkZXJ9KTtcblx0XHRyZXR1cm4gYnVpbGRlcjtcblx0fVxufTtcblxuY29uc3QgdXNlZE1vZGVscyA9IFsncmdiJywgJ2hleCcsICdrZXl3b3JkJywgJ2hzbCcsICdoc3YnLCAnaHdiJywgJ2Fuc2knLCAnYW5zaTI1NiddO1xuXG5mb3IgKGNvbnN0IG1vZGVsIG9mIHVzZWRNb2RlbHMpIHtcblx0c3R5bGVzW21vZGVsXSA9IHtcblx0XHRnZXQoKSB7XG5cdFx0XHRjb25zdCB7bGV2ZWx9ID0gdGhpcztcblx0XHRcdHJldHVybiBmdW5jdGlvbiAoLi4uYXJndW1lbnRzXykge1xuXHRcdFx0XHRjb25zdCBzdHlsZXIgPSBjcmVhdGVTdHlsZXIoYW5zaVN0eWxlcy5jb2xvcltsZXZlbE1hcHBpbmdbbGV2ZWxdXVttb2RlbF0oLi4uYXJndW1lbnRzXyksIGFuc2lTdHlsZXMuY29sb3IuY2xvc2UsIHRoaXMuX3N0eWxlcik7XG5cdFx0XHRcdHJldHVybiBjcmVhdGVCdWlsZGVyKHRoaXMsIHN0eWxlciwgdGhpcy5faXNFbXB0eSk7XG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn1cblxuZm9yIChjb25zdCBtb2RlbCBvZiB1c2VkTW9kZWxzKSB7XG5cdGNvbnN0IGJnTW9kZWwgPSAnYmcnICsgbW9kZWxbMF0udG9VcHBlckNhc2UoKSArIG1vZGVsLnNsaWNlKDEpO1xuXHRzdHlsZXNbYmdNb2RlbF0gPSB7XG5cdFx0Z2V0KCkge1xuXHRcdFx0Y29uc3Qge2xldmVsfSA9IHRoaXM7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3VtZW50c18pIHtcblx0XHRcdFx0Y29uc3Qgc3R5bGVyID0gY3JlYXRlU3R5bGVyKGFuc2lTdHlsZXMuYmdDb2xvcltsZXZlbE1hcHBpbmdbbGV2ZWxdXVttb2RlbF0oLi4uYXJndW1lbnRzXyksIGFuc2lTdHlsZXMuYmdDb2xvci5jbG9zZSwgdGhpcy5fc3R5bGVyKTtcblx0XHRcdFx0cmV0dXJuIGNyZWF0ZUJ1aWxkZXIodGhpcywgc3R5bGVyLCB0aGlzLl9pc0VtcHR5KTtcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xufVxuXG5jb25zdCBwcm90byA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKCgpID0+IHt9LCB7XG5cdC4uLnN0eWxlcyxcblx0bGV2ZWw6IHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9nZW5lcmF0b3IubGV2ZWw7XG5cdFx0fSxcblx0XHRzZXQobGV2ZWwpIHtcblx0XHRcdHRoaXMuX2dlbmVyYXRvci5sZXZlbCA9IGxldmVsO1xuXHRcdH1cblx0fVxufSk7XG5cbmNvbnN0IGNyZWF0ZVN0eWxlciA9IChvcGVuLCBjbG9zZSwgcGFyZW50KSA9PiB7XG5cdGxldCBvcGVuQWxsO1xuXHRsZXQgY2xvc2VBbGw7XG5cdGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZCkge1xuXHRcdG9wZW5BbGwgPSBvcGVuO1xuXHRcdGNsb3NlQWxsID0gY2xvc2U7XG5cdH0gZWxzZSB7XG5cdFx0b3BlbkFsbCA9IHBhcmVudC5vcGVuQWxsICsgb3Blbjtcblx0XHRjbG9zZUFsbCA9IGNsb3NlICsgcGFyZW50LmNsb3NlQWxsO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRvcGVuLFxuXHRcdGNsb3NlLFxuXHRcdG9wZW5BbGwsXG5cdFx0Y2xvc2VBbGwsXG5cdFx0cGFyZW50XG5cdH07XG59O1xuXG5jb25zdCBjcmVhdGVCdWlsZGVyID0gKHNlbGYsIF9zdHlsZXIsIF9pc0VtcHR5KSA9PiB7XG5cdGNvbnN0IGJ1aWxkZXIgPSAoLi4uYXJndW1lbnRzXykgPT4ge1xuXHRcdGlmIChpc0FycmF5KGFyZ3VtZW50c19bMF0pICYmIGlzQXJyYXkoYXJndW1lbnRzX1swXS5yYXcpKSB7XG5cdFx0XHQvLyBDYWxsZWQgYXMgYSB0ZW1wbGF0ZSBsaXRlcmFsLCBmb3IgZXhhbXBsZTogY2hhbGsucmVkYDIgKyAzID0ge2JvbGQgJHsyKzN9fWBcblx0XHRcdHJldHVybiBhcHBseVN0eWxlKGJ1aWxkZXIsIGNoYWxrVGFnKGJ1aWxkZXIsIC4uLmFyZ3VtZW50c18pKTtcblx0XHR9XG5cblx0XHQvLyBTaW5nbGUgYXJndW1lbnQgaXMgaG90IHBhdGgsIGltcGxpY2l0IGNvZXJjaW9uIGlzIGZhc3RlciB0aGFuIGFueXRoaW5nXG5cdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWltcGxpY2l0LWNvZXJjaW9uXG5cdFx0cmV0dXJuIGFwcGx5U3R5bGUoYnVpbGRlciwgKGFyZ3VtZW50c18ubGVuZ3RoID09PSAxKSA/ICgnJyArIGFyZ3VtZW50c19bMF0pIDogYXJndW1lbnRzXy5qb2luKCcgJykpO1xuXHR9O1xuXG5cdC8vIFdlIGFsdGVyIHRoZSBwcm90b3R5cGUgYmVjYXVzZSB3ZSBtdXN0IHJldHVybiBhIGZ1bmN0aW9uLCBidXQgdGhlcmUgaXNcblx0Ly8gbm8gd2F5IHRvIGNyZWF0ZSBhIGZ1bmN0aW9uIHdpdGggYSBkaWZmZXJlbnQgcHJvdG90eXBlXG5cdE9iamVjdC5zZXRQcm90b3R5cGVPZihidWlsZGVyLCBwcm90byk7XG5cblx0YnVpbGRlci5fZ2VuZXJhdG9yID0gc2VsZjtcblx0YnVpbGRlci5fc3R5bGVyID0gX3N0eWxlcjtcblx0YnVpbGRlci5faXNFbXB0eSA9IF9pc0VtcHR5O1xuXG5cdHJldHVybiBidWlsZGVyO1xufTtcblxuY29uc3QgYXBwbHlTdHlsZSA9IChzZWxmLCBzdHJpbmcpID0+IHtcblx0aWYgKHNlbGYubGV2ZWwgPD0gMCB8fCAhc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHNlbGYuX2lzRW1wdHkgPyAnJyA6IHN0cmluZztcblx0fVxuXG5cdGxldCBzdHlsZXIgPSBzZWxmLl9zdHlsZXI7XG5cblx0aWYgKHN0eWxlciA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIHN0cmluZztcblx0fVxuXG5cdGNvbnN0IHtvcGVuQWxsLCBjbG9zZUFsbH0gPSBzdHlsZXI7XG5cdGlmIChzdHJpbmcuaW5kZXhPZignXFx1MDAxQicpICE9PSAtMSkge1xuXHRcdHdoaWxlIChzdHlsZXIgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0Ly8gUmVwbGFjZSBhbnkgaW5zdGFuY2VzIGFscmVhZHkgcHJlc2VudCB3aXRoIGEgcmUtb3BlbmluZyBjb2RlXG5cdFx0XHQvLyBvdGhlcndpc2Ugb25seSB0aGUgcGFydCBvZiB0aGUgc3RyaW5nIHVudGlsIHNhaWQgY2xvc2luZyBjb2RlXG5cdFx0XHQvLyB3aWxsIGJlIGNvbG9yZWQsIGFuZCB0aGUgcmVzdCB3aWxsIHNpbXBseSBiZSAncGxhaW4nLlxuXHRcdFx0c3RyaW5nID0gc3RyaW5nUmVwbGFjZUFsbChzdHJpbmcsIHN0eWxlci5jbG9zZSwgc3R5bGVyLm9wZW4pO1xuXG5cdFx0XHRzdHlsZXIgPSBzdHlsZXIucGFyZW50O1xuXHRcdH1cblx0fVxuXG5cdC8vIFdlIGNhbiBtb3ZlIGJvdGggbmV4dCBhY3Rpb25zIG91dCBvZiBsb29wLCBiZWNhdXNlIHJlbWFpbmluZyBhY3Rpb25zIGluIGxvb3Agd29uJ3QgaGF2ZVxuXHQvLyBhbnkvdmlzaWJsZSBlZmZlY3Qgb24gcGFydHMgd2UgYWRkIGhlcmUuIENsb3NlIHRoZSBzdHlsaW5nIGJlZm9yZSBhIGxpbmVicmVhayBhbmQgcmVvcGVuXG5cdC8vIGFmdGVyIG5leHQgbGluZSB0byBmaXggYSBibGVlZCBpc3N1ZSBvbiBtYWNPUzogaHR0cHM6Ly9naXRodWIuY29tL2NoYWxrL2NoYWxrL3B1bGwvOTJcblx0Y29uc3QgbGZJbmRleCA9IHN0cmluZy5pbmRleE9mKCdcXG4nKTtcblx0aWYgKGxmSW5kZXggIT09IC0xKSB7XG5cdFx0c3RyaW5nID0gc3RyaW5nRW5jYXNlQ1JMRldpdGhGaXJzdEluZGV4KHN0cmluZywgY2xvc2VBbGwsIG9wZW5BbGwsIGxmSW5kZXgpO1xuXHR9XG5cblx0cmV0dXJuIG9wZW5BbGwgKyBzdHJpbmcgKyBjbG9zZUFsbDtcbn07XG5cbmxldCB0ZW1wbGF0ZTtcbmNvbnN0IGNoYWxrVGFnID0gKGNoYWxrLCAuLi5zdHJpbmdzKSA9PiB7XG5cdGNvbnN0IFtmaXJzdFN0cmluZ10gPSBzdHJpbmdzO1xuXG5cdGlmICghaXNBcnJheShmaXJzdFN0cmluZykgfHwgIWlzQXJyYXkoZmlyc3RTdHJpbmcucmF3KSkge1xuXHRcdC8vIElmIGNoYWxrKCkgd2FzIGNhbGxlZCBieSBpdHNlbGYgb3Igd2l0aCBhIHN0cmluZyxcblx0XHQvLyByZXR1cm4gdGhlIHN0cmluZyBpdHNlbGYgYXMgYSBzdHJpbmcuXG5cdFx0cmV0dXJuIHN0cmluZ3Muam9pbignICcpO1xuXHR9XG5cblx0Y29uc3QgYXJndW1lbnRzXyA9IHN0cmluZ3Muc2xpY2UoMSk7XG5cdGNvbnN0IHBhcnRzID0gW2ZpcnN0U3RyaW5nLnJhd1swXV07XG5cblx0Zm9yIChsZXQgaSA9IDE7IGkgPCBmaXJzdFN0cmluZy5sZW5ndGg7IGkrKykge1xuXHRcdHBhcnRzLnB1c2goXG5cdFx0XHRTdHJpbmcoYXJndW1lbnRzX1tpIC0gMV0pLnJlcGxhY2UoL1t7fVxcXFxdL2csICdcXFxcJCYnKSxcblx0XHRcdFN0cmluZyhmaXJzdFN0cmluZy5yYXdbaV0pXG5cdFx0KTtcblx0fVxuXG5cdGlmICh0ZW1wbGF0ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGVtcGxhdGUgPSByZXF1aXJlKCcuL3RlbXBsYXRlcycpO1xuXHR9XG5cblx0cmV0dXJuIHRlbXBsYXRlKGNoYWxrLCBwYXJ0cy5qb2luKCcnKSk7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhDaGFsay5wcm90b3R5cGUsIHN0eWxlcyk7XG5cbmNvbnN0IGNoYWxrID0gQ2hhbGsoKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuZXctY2FwXG5jaGFsay5zdXBwb3J0c0NvbG9yID0gc3Rkb3V0Q29sb3I7XG5jaGFsay5zdGRlcnIgPSBDaGFsayh7bGV2ZWw6IHN0ZGVyckNvbG9yID8gc3RkZXJyQ29sb3IubGV2ZWwgOiAwfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbmV3LWNhcFxuY2hhbGsuc3RkZXJyLnN1cHBvcnRzQ29sb3IgPSBzdGRlcnJDb2xvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBjaGFsaztcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IFRFTVBMQVRFX1JFR0VYID0gLyg/OlxcXFwodSg/OlthLWZcXGRdezR9fFxce1thLWZcXGRdezEsNn1cXH0pfHhbYS1mXFxkXXsyfXwuKSl8KD86XFx7KH4pPyhcXHcrKD86XFwoW14pXSpcXCkpPyg/OlxcLlxcdysoPzpcXChbXildKlxcKSk/KSopKD86WyBcXHRdfCg/PVxccj9cXG4pKSl8KFxcfSl8KCg/Oi58W1xcclxcblxcZl0pKz8pL2dpO1xuY29uc3QgU1RZTEVfUkVHRVggPSAvKD86XnxcXC4pKFxcdyspKD86XFwoKFteKV0qKVxcKSk/L2c7XG5jb25zdCBTVFJJTkdfUkVHRVggPSAvXihbJ1wiXSkoKD86XFxcXC58KD8hXFwxKVteXFxcXF0pKilcXDEkLztcbmNvbnN0IEVTQ0FQRV9SRUdFWCA9IC9cXFxcKHUoPzpbYS1mXFxkXXs0fXx7W2EtZlxcZF17MSw2fX0pfHhbYS1mXFxkXXsyfXwuKXwoW15cXFxcXSkvZ2k7XG5cbmNvbnN0IEVTQ0FQRVMgPSBuZXcgTWFwKFtcblx0WyduJywgJ1xcbiddLFxuXHRbJ3InLCAnXFxyJ10sXG5cdFsndCcsICdcXHQnXSxcblx0WydiJywgJ1xcYiddLFxuXHRbJ2YnLCAnXFxmJ10sXG5cdFsndicsICdcXHYnXSxcblx0WycwJywgJ1xcMCddLFxuXHRbJ1xcXFwnLCAnXFxcXCddLFxuXHRbJ2UnLCAnXFx1MDAxQiddLFxuXHRbJ2EnLCAnXFx1MDAwNyddXG5dKTtcblxuZnVuY3Rpb24gdW5lc2NhcGUoYykge1xuXHRjb25zdCB1ID0gY1swXSA9PT0gJ3UnO1xuXHRjb25zdCBicmFja2V0ID0gY1sxXSA9PT0gJ3snO1xuXG5cdGlmICgodSAmJiAhYnJhY2tldCAmJiBjLmxlbmd0aCA9PT0gNSkgfHwgKGNbMF0gPT09ICd4JyAmJiBjLmxlbmd0aCA9PT0gMykpIHtcblx0XHRyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChjLnNsaWNlKDEpLCAxNikpO1xuXHR9XG5cblx0aWYgKHUgJiYgYnJhY2tldCkge1xuXHRcdHJldHVybiBTdHJpbmcuZnJvbUNvZGVQb2ludChwYXJzZUludChjLnNsaWNlKDIsIC0xKSwgMTYpKTtcblx0fVxuXG5cdHJldHVybiBFU0NBUEVTLmdldChjKSB8fCBjO1xufVxuXG5mdW5jdGlvbiBwYXJzZUFyZ3VtZW50cyhuYW1lLCBhcmd1bWVudHNfKSB7XG5cdGNvbnN0IHJlc3VsdHMgPSBbXTtcblx0Y29uc3QgY2h1bmtzID0gYXJndW1lbnRzXy50cmltKCkuc3BsaXQoL1xccyosXFxzKi9nKTtcblx0bGV0IG1hdGNoZXM7XG5cblx0Zm9yIChjb25zdCBjaHVuayBvZiBjaHVua3MpIHtcblx0XHRjb25zdCBudW1iZXIgPSBOdW1iZXIoY2h1bmspO1xuXHRcdGlmICghTnVtYmVyLmlzTmFOKG51bWJlcikpIHtcblx0XHRcdHJlc3VsdHMucHVzaChudW1iZXIpO1xuXHRcdH0gZWxzZSBpZiAoKG1hdGNoZXMgPSBjaHVuay5tYXRjaChTVFJJTkdfUkVHRVgpKSkge1xuXHRcdFx0cmVzdWx0cy5wdXNoKG1hdGNoZXNbMl0ucmVwbGFjZShFU0NBUEVfUkVHRVgsIChtLCBlc2NhcGUsIGNoYXJhY3RlcikgPT4gZXNjYXBlID8gdW5lc2NhcGUoZXNjYXBlKSA6IGNoYXJhY3RlcikpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgQ2hhbGsgdGVtcGxhdGUgc3R5bGUgYXJndW1lbnQ6ICR7Y2h1bmt9IChpbiBzdHlsZSAnJHtuYW1lfScpYCk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIHBhcnNlU3R5bGUoc3R5bGUpIHtcblx0U1RZTEVfUkVHRVgubGFzdEluZGV4ID0gMDtcblxuXHRjb25zdCByZXN1bHRzID0gW107XG5cdGxldCBtYXRjaGVzO1xuXG5cdHdoaWxlICgobWF0Y2hlcyA9IFNUWUxFX1JFR0VYLmV4ZWMoc3R5bGUpKSAhPT0gbnVsbCkge1xuXHRcdGNvbnN0IG5hbWUgPSBtYXRjaGVzWzFdO1xuXG5cdFx0aWYgKG1hdGNoZXNbMl0pIHtcblx0XHRcdGNvbnN0IGFyZ3MgPSBwYXJzZUFyZ3VtZW50cyhuYW1lLCBtYXRjaGVzWzJdKTtcblx0XHRcdHJlc3VsdHMucHVzaChbbmFtZV0uY29uY2F0KGFyZ3MpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzdWx0cy5wdXNoKFtuYW1lXSk7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHJlc3VsdHM7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkU3R5bGUoY2hhbGssIHN0eWxlcykge1xuXHRjb25zdCBlbmFibGVkID0ge307XG5cblx0Zm9yIChjb25zdCBsYXllciBvZiBzdHlsZXMpIHtcblx0XHRmb3IgKGNvbnN0IHN0eWxlIG9mIGxheWVyLnN0eWxlcykge1xuXHRcdFx0ZW5hYmxlZFtzdHlsZVswXV0gPSBsYXllci5pbnZlcnNlID8gbnVsbCA6IHN0eWxlLnNsaWNlKDEpO1xuXHRcdH1cblx0fVxuXG5cdGxldCBjdXJyZW50ID0gY2hhbGs7XG5cdGZvciAoY29uc3QgW3N0eWxlTmFtZSwgc3R5bGVzXSBvZiBPYmplY3QuZW50cmllcyhlbmFibGVkKSkge1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShzdHlsZXMpKSB7XG5cdFx0XHRjb250aW51ZTtcblx0XHR9XG5cblx0XHRpZiAoIShzdHlsZU5hbWUgaW4gY3VycmVudCkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgVW5rbm93biBDaGFsayBzdHlsZTogJHtzdHlsZU5hbWV9YCk7XG5cdFx0fVxuXG5cdFx0Y3VycmVudCA9IHN0eWxlcy5sZW5ndGggPiAwID8gY3VycmVudFtzdHlsZU5hbWVdKC4uLnN0eWxlcykgOiBjdXJyZW50W3N0eWxlTmFtZV07XG5cdH1cblxuXHRyZXR1cm4gY3VycmVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSAoY2hhbGssIHRlbXBvcmFyeSkgPT4ge1xuXHRjb25zdCBzdHlsZXMgPSBbXTtcblx0Y29uc3QgY2h1bmtzID0gW107XG5cdGxldCBjaHVuayA9IFtdO1xuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtcGFyYW1zXG5cdHRlbXBvcmFyeS5yZXBsYWNlKFRFTVBMQVRFX1JFR0VYLCAobSwgZXNjYXBlQ2hhcmFjdGVyLCBpbnZlcnNlLCBzdHlsZSwgY2xvc2UsIGNoYXJhY3RlcikgPT4ge1xuXHRcdGlmIChlc2NhcGVDaGFyYWN0ZXIpIHtcblx0XHRcdGNodW5rLnB1c2godW5lc2NhcGUoZXNjYXBlQ2hhcmFjdGVyKSk7XG5cdFx0fSBlbHNlIGlmIChzdHlsZSkge1xuXHRcdFx0Y29uc3Qgc3RyaW5nID0gY2h1bmsuam9pbignJyk7XG5cdFx0XHRjaHVuayA9IFtdO1xuXHRcdFx0Y2h1bmtzLnB1c2goc3R5bGVzLmxlbmd0aCA9PT0gMCA/IHN0cmluZyA6IGJ1aWxkU3R5bGUoY2hhbGssIHN0eWxlcykoc3RyaW5nKSk7XG5cdFx0XHRzdHlsZXMucHVzaCh7aW52ZXJzZSwgc3R5bGVzOiBwYXJzZVN0eWxlKHN0eWxlKX0pO1xuXHRcdH0gZWxzZSBpZiAoY2xvc2UpIHtcblx0XHRcdGlmIChzdHlsZXMubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRm91bmQgZXh0cmFuZW91cyB9IGluIENoYWxrIHRlbXBsYXRlIGxpdGVyYWwnKTtcblx0XHRcdH1cblxuXHRcdFx0Y2h1bmtzLnB1c2goYnVpbGRTdHlsZShjaGFsaywgc3R5bGVzKShjaHVuay5qb2luKCcnKSkpO1xuXHRcdFx0Y2h1bmsgPSBbXTtcblx0XHRcdHN0eWxlcy5wb3AoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2h1bmsucHVzaChjaGFyYWN0ZXIpO1xuXHRcdH1cblx0fSk7XG5cblx0Y2h1bmtzLnB1c2goY2h1bmsuam9pbignJykpO1xuXG5cdGlmIChzdHlsZXMubGVuZ3RoID4gMCkge1xuXHRcdGNvbnN0IGVyck1lc3NhZ2UgPSBgQ2hhbGsgdGVtcGxhdGUgbGl0ZXJhbCBpcyBtaXNzaW5nICR7c3R5bGVzLmxlbmd0aH0gY2xvc2luZyBicmFja2V0JHtzdHlsZXMubGVuZ3RoID09PSAxID8gJycgOiAncyd9IChcXGB9XFxgKWA7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGVyck1lc3NhZ2UpO1xuXHR9XG5cblx0cmV0dXJuIGNodW5rcy5qb2luKCcnKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHN0cmluZ1JlcGxhY2VBbGwgPSAoc3RyaW5nLCBzdWJzdHJpbmcsIHJlcGxhY2VyKSA9PiB7XG5cdGxldCBpbmRleCA9IHN0cmluZy5pbmRleE9mKHN1YnN0cmluZyk7XG5cdGlmIChpbmRleCA9PT0gLTEpIHtcblx0XHRyZXR1cm4gc3RyaW5nO1xuXHR9XG5cblx0Y29uc3Qgc3Vic3RyaW5nTGVuZ3RoID0gc3Vic3RyaW5nLmxlbmd0aDtcblx0bGV0IGVuZEluZGV4ID0gMDtcblx0bGV0IHJldHVyblZhbHVlID0gJyc7XG5cdGRvIHtcblx0XHRyZXR1cm5WYWx1ZSArPSBzdHJpbmcuc3Vic3RyKGVuZEluZGV4LCBpbmRleCAtIGVuZEluZGV4KSArIHN1YnN0cmluZyArIHJlcGxhY2VyO1xuXHRcdGVuZEluZGV4ID0gaW5kZXggKyBzdWJzdHJpbmdMZW5ndGg7XG5cdFx0aW5kZXggPSBzdHJpbmcuaW5kZXhPZihzdWJzdHJpbmcsIGVuZEluZGV4KTtcblx0fSB3aGlsZSAoaW5kZXggIT09IC0xKTtcblxuXHRyZXR1cm5WYWx1ZSArPSBzdHJpbmcuc3Vic3RyKGVuZEluZGV4KTtcblx0cmV0dXJuIHJldHVyblZhbHVlO1xufTtcblxuY29uc3Qgc3RyaW5nRW5jYXNlQ1JMRldpdGhGaXJzdEluZGV4ID0gKHN0cmluZywgcHJlZml4LCBwb3N0Zml4LCBpbmRleCkgPT4ge1xuXHRsZXQgZW5kSW5kZXggPSAwO1xuXHRsZXQgcmV0dXJuVmFsdWUgPSAnJztcblx0ZG8ge1xuXHRcdGNvbnN0IGdvdENSID0gc3RyaW5nW2luZGV4IC0gMV0gPT09ICdcXHInO1xuXHRcdHJldHVyblZhbHVlICs9IHN0cmluZy5zdWJzdHIoZW5kSW5kZXgsIChnb3RDUiA/IGluZGV4IC0gMSA6IGluZGV4KSAtIGVuZEluZGV4KSArIHByZWZpeCArIChnb3RDUiA/ICdcXHJcXG4nIDogJ1xcbicpICsgcG9zdGZpeDtcblx0XHRlbmRJbmRleCA9IGluZGV4ICsgMTtcblx0XHRpbmRleCA9IHN0cmluZy5pbmRleE9mKCdcXG4nLCBlbmRJbmRleCk7XG5cdH0gd2hpbGUgKGluZGV4ICE9PSAtMSk7XG5cblx0cmV0dXJuVmFsdWUgKz0gc3RyaW5nLnN1YnN0cihlbmRJbmRleCk7XG5cdHJldHVybiByZXR1cm5WYWx1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRzdHJpbmdSZXBsYWNlQWxsLFxuXHRzdHJpbmdFbmNhc2VDUkxGV2l0aEZpcnN0SW5kZXhcbn07XG4iLCIvKiBNSVQgbGljZW5zZSAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tbWl4ZWQtb3BlcmF0b3JzICovXG5jb25zdCBjc3NLZXl3b3JkcyA9IHJlcXVpcmUoJ2NvbG9yLW5hbWUnKTtcblxuLy8gTk9URTogY29udmVyc2lvbnMgc2hvdWxkIG9ubHkgcmV0dXJuIHByaW1pdGl2ZSB2YWx1ZXMgKGkuZS4gYXJyYXlzLCBvclxuLy8gICAgICAgdmFsdWVzIHRoYXQgZ2l2ZSBjb3JyZWN0IGB0eXBlb2ZgIHJlc3VsdHMpLlxuLy8gICAgICAgZG8gbm90IHVzZSBib3ggdmFsdWVzIHR5cGVzIChpLmUuIE51bWJlcigpLCBTdHJpbmcoKSwgZXRjLilcblxuY29uc3QgcmV2ZXJzZUtleXdvcmRzID0ge307XG5mb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhjc3NLZXl3b3JkcykpIHtcblx0cmV2ZXJzZUtleXdvcmRzW2Nzc0tleXdvcmRzW2tleV1dID0ga2V5O1xufVxuXG5jb25zdCBjb252ZXJ0ID0ge1xuXHRyZ2I6IHtjaGFubmVsczogMywgbGFiZWxzOiAncmdiJ30sXG5cdGhzbDoge2NoYW5uZWxzOiAzLCBsYWJlbHM6ICdoc2wnfSxcblx0aHN2OiB7Y2hhbm5lbHM6IDMsIGxhYmVsczogJ2hzdid9LFxuXHRod2I6IHtjaGFubmVsczogMywgbGFiZWxzOiAnaHdiJ30sXG5cdGNteWs6IHtjaGFubmVsczogNCwgbGFiZWxzOiAnY215ayd9LFxuXHR4eXo6IHtjaGFubmVsczogMywgbGFiZWxzOiAneHl6J30sXG5cdGxhYjoge2NoYW5uZWxzOiAzLCBsYWJlbHM6ICdsYWInfSxcblx0bGNoOiB7Y2hhbm5lbHM6IDMsIGxhYmVsczogJ2xjaCd9LFxuXHRoZXg6IHtjaGFubmVsczogMSwgbGFiZWxzOiBbJ2hleCddfSxcblx0a2V5d29yZDoge2NoYW5uZWxzOiAxLCBsYWJlbHM6IFsna2V5d29yZCddfSxcblx0YW5zaTE2OiB7Y2hhbm5lbHM6IDEsIGxhYmVsczogWydhbnNpMTYnXX0sXG5cdGFuc2kyNTY6IHtjaGFubmVsczogMSwgbGFiZWxzOiBbJ2Fuc2kyNTYnXX0sXG5cdGhjZzoge2NoYW5uZWxzOiAzLCBsYWJlbHM6IFsnaCcsICdjJywgJ2cnXX0sXG5cdGFwcGxlOiB7Y2hhbm5lbHM6IDMsIGxhYmVsczogWydyMTYnLCAnZzE2JywgJ2IxNiddfSxcblx0Z3JheToge2NoYW5uZWxzOiAxLCBsYWJlbHM6IFsnZ3JheSddfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb252ZXJ0O1xuXG4vLyBIaWRlIC5jaGFubmVscyBhbmQgLmxhYmVscyBwcm9wZXJ0aWVzXG5mb3IgKGNvbnN0IG1vZGVsIG9mIE9iamVjdC5rZXlzKGNvbnZlcnQpKSB7XG5cdGlmICghKCdjaGFubmVscycgaW4gY29udmVydFttb2RlbF0pKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdtaXNzaW5nIGNoYW5uZWxzIHByb3BlcnR5OiAnICsgbW9kZWwpO1xuXHR9XG5cblx0aWYgKCEoJ2xhYmVscycgaW4gY29udmVydFttb2RlbF0pKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdtaXNzaW5nIGNoYW5uZWwgbGFiZWxzIHByb3BlcnR5OiAnICsgbW9kZWwpO1xuXHR9XG5cblx0aWYgKGNvbnZlcnRbbW9kZWxdLmxhYmVscy5sZW5ndGggIT09IGNvbnZlcnRbbW9kZWxdLmNoYW5uZWxzKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdjaGFubmVsIGFuZCBsYWJlbCBjb3VudHMgbWlzbWF0Y2g6ICcgKyBtb2RlbCk7XG5cdH1cblxuXHRjb25zdCB7Y2hhbm5lbHMsIGxhYmVsc30gPSBjb252ZXJ0W21vZGVsXTtcblx0ZGVsZXRlIGNvbnZlcnRbbW9kZWxdLmNoYW5uZWxzO1xuXHRkZWxldGUgY29udmVydFttb2RlbF0ubGFiZWxzO1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoY29udmVydFttb2RlbF0sICdjaGFubmVscycsIHt2YWx1ZTogY2hhbm5lbHN9KTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnZlcnRbbW9kZWxdLCAnbGFiZWxzJywge3ZhbHVlOiBsYWJlbHN9KTtcbn1cblxuY29udmVydC5yZ2IuaHNsID0gZnVuY3Rpb24gKHJnYikge1xuXHRjb25zdCByID0gcmdiWzBdIC8gMjU1O1xuXHRjb25zdCBnID0gcmdiWzFdIC8gMjU1O1xuXHRjb25zdCBiID0gcmdiWzJdIC8gMjU1O1xuXHRjb25zdCBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKTtcblx0Y29uc3QgbWF4ID0gTWF0aC5tYXgociwgZywgYik7XG5cdGNvbnN0IGRlbHRhID0gbWF4IC0gbWluO1xuXHRsZXQgaDtcblx0bGV0IHM7XG5cblx0aWYgKG1heCA9PT0gbWluKSB7XG5cdFx0aCA9IDA7XG5cdH0gZWxzZSBpZiAociA9PT0gbWF4KSB7XG5cdFx0aCA9IChnIC0gYikgLyBkZWx0YTtcblx0fSBlbHNlIGlmIChnID09PSBtYXgpIHtcblx0XHRoID0gMiArIChiIC0gcikgLyBkZWx0YTtcblx0fSBlbHNlIGlmIChiID09PSBtYXgpIHtcblx0XHRoID0gNCArIChyIC0gZykgLyBkZWx0YTtcblx0fVxuXG5cdGggPSBNYXRoLm1pbihoICogNjAsIDM2MCk7XG5cblx0aWYgKGggPCAwKSB7XG5cdFx0aCArPSAzNjA7XG5cdH1cblxuXHRjb25zdCBsID0gKG1pbiArIG1heCkgLyAyO1xuXG5cdGlmIChtYXggPT09IG1pbikge1xuXHRcdHMgPSAwO1xuXHR9IGVsc2UgaWYgKGwgPD0gMC41KSB7XG5cdFx0cyA9IGRlbHRhIC8gKG1heCArIG1pbik7XG5cdH0gZWxzZSB7XG5cdFx0cyA9IGRlbHRhIC8gKDIgLSBtYXggLSBtaW4pO1xuXHR9XG5cblx0cmV0dXJuIFtoLCBzICogMTAwLCBsICogMTAwXTtcbn07XG5cbmNvbnZlcnQucmdiLmhzdiA9IGZ1bmN0aW9uIChyZ2IpIHtcblx0bGV0IHJkaWY7XG5cdGxldCBnZGlmO1xuXHRsZXQgYmRpZjtcblx0bGV0IGg7XG5cdGxldCBzO1xuXG5cdGNvbnN0IHIgPSByZ2JbMF0gLyAyNTU7XG5cdGNvbnN0IGcgPSByZ2JbMV0gLyAyNTU7XG5cdGNvbnN0IGIgPSByZ2JbMl0gLyAyNTU7XG5cdGNvbnN0IHYgPSBNYXRoLm1heChyLCBnLCBiKTtcblx0Y29uc3QgZGlmZiA9IHYgLSBNYXRoLm1pbihyLCBnLCBiKTtcblx0Y29uc3QgZGlmZmMgPSBmdW5jdGlvbiAoYykge1xuXHRcdHJldHVybiAodiAtIGMpIC8gNiAvIGRpZmYgKyAxIC8gMjtcblx0fTtcblxuXHRpZiAoZGlmZiA9PT0gMCkge1xuXHRcdGggPSAwO1xuXHRcdHMgPSAwO1xuXHR9IGVsc2Uge1xuXHRcdHMgPSBkaWZmIC8gdjtcblx0XHRyZGlmID0gZGlmZmMocik7XG5cdFx0Z2RpZiA9IGRpZmZjKGcpO1xuXHRcdGJkaWYgPSBkaWZmYyhiKTtcblxuXHRcdGlmIChyID09PSB2KSB7XG5cdFx0XHRoID0gYmRpZiAtIGdkaWY7XG5cdFx0fSBlbHNlIGlmIChnID09PSB2KSB7XG5cdFx0XHRoID0gKDEgLyAzKSArIHJkaWYgLSBiZGlmO1xuXHRcdH0gZWxzZSBpZiAoYiA9PT0gdikge1xuXHRcdFx0aCA9ICgyIC8gMykgKyBnZGlmIC0gcmRpZjtcblx0XHR9XG5cblx0XHRpZiAoaCA8IDApIHtcblx0XHRcdGggKz0gMTtcblx0XHR9IGVsc2UgaWYgKGggPiAxKSB7XG5cdFx0XHRoIC09IDE7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIFtcblx0XHRoICogMzYwLFxuXHRcdHMgKiAxMDAsXG5cdFx0diAqIDEwMFxuXHRdO1xufTtcblxuY29udmVydC5yZ2IuaHdiID0gZnVuY3Rpb24gKHJnYikge1xuXHRjb25zdCByID0gcmdiWzBdO1xuXHRjb25zdCBnID0gcmdiWzFdO1xuXHRsZXQgYiA9IHJnYlsyXTtcblx0Y29uc3QgaCA9IGNvbnZlcnQucmdiLmhzbChyZ2IpWzBdO1xuXHRjb25zdCB3ID0gMSAvIDI1NSAqIE1hdGgubWluKHIsIE1hdGgubWluKGcsIGIpKTtcblxuXHRiID0gMSAtIDEgLyAyNTUgKiBNYXRoLm1heChyLCBNYXRoLm1heChnLCBiKSk7XG5cblx0cmV0dXJuIFtoLCB3ICogMTAwLCBiICogMTAwXTtcbn07XG5cbmNvbnZlcnQucmdiLmNteWsgPSBmdW5jdGlvbiAocmdiKSB7XG5cdGNvbnN0IHIgPSByZ2JbMF0gLyAyNTU7XG5cdGNvbnN0IGcgPSByZ2JbMV0gLyAyNTU7XG5cdGNvbnN0IGIgPSByZ2JbMl0gLyAyNTU7XG5cblx0Y29uc3QgayA9IE1hdGgubWluKDEgLSByLCAxIC0gZywgMSAtIGIpO1xuXHRjb25zdCBjID0gKDEgLSByIC0gaykgLyAoMSAtIGspIHx8IDA7XG5cdGNvbnN0IG0gPSAoMSAtIGcgLSBrKSAvICgxIC0gaykgfHwgMDtcblx0Y29uc3QgeSA9ICgxIC0gYiAtIGspIC8gKDEgLSBrKSB8fCAwO1xuXG5cdHJldHVybiBbYyAqIDEwMCwgbSAqIDEwMCwgeSAqIDEwMCwgayAqIDEwMF07XG59O1xuXG5mdW5jdGlvbiBjb21wYXJhdGl2ZURpc3RhbmNlKHgsIHkpIHtcblx0Lypcblx0XHRTZWUgaHR0cHM6Ly9lbi5tLndpa2lwZWRpYS5vcmcvd2lraS9FdWNsaWRlYW5fZGlzdGFuY2UjU3F1YXJlZF9FdWNsaWRlYW5fZGlzdGFuY2Vcblx0Ki9cblx0cmV0dXJuIChcblx0XHQoKHhbMF0gLSB5WzBdKSAqKiAyKSArXG5cdFx0KCh4WzFdIC0geVsxXSkgKiogMikgK1xuXHRcdCgoeFsyXSAtIHlbMl0pICoqIDIpXG5cdCk7XG59XG5cbmNvbnZlcnQucmdiLmtleXdvcmQgPSBmdW5jdGlvbiAocmdiKSB7XG5cdGNvbnN0IHJldmVyc2VkID0gcmV2ZXJzZUtleXdvcmRzW3JnYl07XG5cdGlmIChyZXZlcnNlZCkge1xuXHRcdHJldHVybiByZXZlcnNlZDtcblx0fVxuXG5cdGxldCBjdXJyZW50Q2xvc2VzdERpc3RhbmNlID0gSW5maW5pdHk7XG5cdGxldCBjdXJyZW50Q2xvc2VzdEtleXdvcmQ7XG5cblx0Zm9yIChjb25zdCBrZXl3b3JkIG9mIE9iamVjdC5rZXlzKGNzc0tleXdvcmRzKSkge1xuXHRcdGNvbnN0IHZhbHVlID0gY3NzS2V5d29yZHNba2V5d29yZF07XG5cblx0XHQvLyBDb21wdXRlIGNvbXBhcmF0aXZlIGRpc3RhbmNlXG5cdFx0Y29uc3QgZGlzdGFuY2UgPSBjb21wYXJhdGl2ZURpc3RhbmNlKHJnYiwgdmFsdWUpO1xuXG5cdFx0Ly8gQ2hlY2sgaWYgaXRzIGxlc3MsIGlmIHNvIHNldCBhcyBjbG9zZXN0XG5cdFx0aWYgKGRpc3RhbmNlIDwgY3VycmVudENsb3Nlc3REaXN0YW5jZSkge1xuXHRcdFx0Y3VycmVudENsb3Nlc3REaXN0YW5jZSA9IGRpc3RhbmNlO1xuXHRcdFx0Y3VycmVudENsb3Nlc3RLZXl3b3JkID0ga2V5d29yZDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gY3VycmVudENsb3Nlc3RLZXl3b3JkO1xufTtcblxuY29udmVydC5rZXl3b3JkLnJnYiA9IGZ1bmN0aW9uIChrZXl3b3JkKSB7XG5cdHJldHVybiBjc3NLZXl3b3Jkc1trZXl3b3JkXTtcbn07XG5cbmNvbnZlcnQucmdiLnh5eiA9IGZ1bmN0aW9uIChyZ2IpIHtcblx0bGV0IHIgPSByZ2JbMF0gLyAyNTU7XG5cdGxldCBnID0gcmdiWzFdIC8gMjU1O1xuXHRsZXQgYiA9IHJnYlsyXSAvIDI1NTtcblxuXHQvLyBBc3N1bWUgc1JHQlxuXHRyID0gciA+IDAuMDQwNDUgPyAoKChyICsgMC4wNTUpIC8gMS4wNTUpICoqIDIuNCkgOiAociAvIDEyLjkyKTtcblx0ZyA9IGcgPiAwLjA0MDQ1ID8gKCgoZyArIDAuMDU1KSAvIDEuMDU1KSAqKiAyLjQpIDogKGcgLyAxMi45Mik7XG5cdGIgPSBiID4gMC4wNDA0NSA/ICgoKGIgKyAwLjA1NSkgLyAxLjA1NSkgKiogMi40KSA6IChiIC8gMTIuOTIpO1xuXG5cdGNvbnN0IHggPSAociAqIDAuNDEyNCkgKyAoZyAqIDAuMzU3NikgKyAoYiAqIDAuMTgwNSk7XG5cdGNvbnN0IHkgPSAociAqIDAuMjEyNikgKyAoZyAqIDAuNzE1MikgKyAoYiAqIDAuMDcyMik7XG5cdGNvbnN0IHogPSAociAqIDAuMDE5MykgKyAoZyAqIDAuMTE5MikgKyAoYiAqIDAuOTUwNSk7XG5cblx0cmV0dXJuIFt4ICogMTAwLCB5ICogMTAwLCB6ICogMTAwXTtcbn07XG5cbmNvbnZlcnQucmdiLmxhYiA9IGZ1bmN0aW9uIChyZ2IpIHtcblx0Y29uc3QgeHl6ID0gY29udmVydC5yZ2IueHl6KHJnYik7XG5cdGxldCB4ID0geHl6WzBdO1xuXHRsZXQgeSA9IHh5elsxXTtcblx0bGV0IHogPSB4eXpbMl07XG5cblx0eCAvPSA5NS4wNDc7XG5cdHkgLz0gMTAwO1xuXHR6IC89IDEwOC44ODM7XG5cblx0eCA9IHggPiAwLjAwODg1NiA/ICh4ICoqICgxIC8gMykpIDogKDcuNzg3ICogeCkgKyAoMTYgLyAxMTYpO1xuXHR5ID0geSA+IDAuMDA4ODU2ID8gKHkgKiogKDEgLyAzKSkgOiAoNy43ODcgKiB5KSArICgxNiAvIDExNik7XG5cdHogPSB6ID4gMC4wMDg4NTYgPyAoeiAqKiAoMSAvIDMpKSA6ICg3Ljc4NyAqIHopICsgKDE2IC8gMTE2KTtcblxuXHRjb25zdCBsID0gKDExNiAqIHkpIC0gMTY7XG5cdGNvbnN0IGEgPSA1MDAgKiAoeCAtIHkpO1xuXHRjb25zdCBiID0gMjAwICogKHkgLSB6KTtcblxuXHRyZXR1cm4gW2wsIGEsIGJdO1xufTtcblxuY29udmVydC5oc2wucmdiID0gZnVuY3Rpb24gKGhzbCkge1xuXHRjb25zdCBoID0gaHNsWzBdIC8gMzYwO1xuXHRjb25zdCBzID0gaHNsWzFdIC8gMTAwO1xuXHRjb25zdCBsID0gaHNsWzJdIC8gMTAwO1xuXHRsZXQgdDI7XG5cdGxldCB0Mztcblx0bGV0IHZhbDtcblxuXHRpZiAocyA9PT0gMCkge1xuXHRcdHZhbCA9IGwgKiAyNTU7XG5cdFx0cmV0dXJuIFt2YWwsIHZhbCwgdmFsXTtcblx0fVxuXG5cdGlmIChsIDwgMC41KSB7XG5cdFx0dDIgPSBsICogKDEgKyBzKTtcblx0fSBlbHNlIHtcblx0XHR0MiA9IGwgKyBzIC0gbCAqIHM7XG5cdH1cblxuXHRjb25zdCB0MSA9IDIgKiBsIC0gdDI7XG5cblx0Y29uc3QgcmdiID0gWzAsIDAsIDBdO1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuXHRcdHQzID0gaCArIDEgLyAzICogLShpIC0gMSk7XG5cdFx0aWYgKHQzIDwgMCkge1xuXHRcdFx0dDMrKztcblx0XHR9XG5cblx0XHRpZiAodDMgPiAxKSB7XG5cdFx0XHR0My0tO1xuXHRcdH1cblxuXHRcdGlmICg2ICogdDMgPCAxKSB7XG5cdFx0XHR2YWwgPSB0MSArICh0MiAtIHQxKSAqIDYgKiB0Mztcblx0XHR9IGVsc2UgaWYgKDIgKiB0MyA8IDEpIHtcblx0XHRcdHZhbCA9IHQyO1xuXHRcdH0gZWxzZSBpZiAoMyAqIHQzIDwgMikge1xuXHRcdFx0dmFsID0gdDEgKyAodDIgLSB0MSkgKiAoMiAvIDMgLSB0MykgKiA2O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YWwgPSB0MTtcblx0XHR9XG5cblx0XHRyZ2JbaV0gPSB2YWwgKiAyNTU7XG5cdH1cblxuXHRyZXR1cm4gcmdiO1xufTtcblxuY29udmVydC5oc2wuaHN2ID0gZnVuY3Rpb24gKGhzbCkge1xuXHRjb25zdCBoID0gaHNsWzBdO1xuXHRsZXQgcyA9IGhzbFsxXSAvIDEwMDtcblx0bGV0IGwgPSBoc2xbMl0gLyAxMDA7XG5cdGxldCBzbWluID0gcztcblx0Y29uc3QgbG1pbiA9IE1hdGgubWF4KGwsIDAuMDEpO1xuXG5cdGwgKj0gMjtcblx0cyAqPSAobCA8PSAxKSA/IGwgOiAyIC0gbDtcblx0c21pbiAqPSBsbWluIDw9IDEgPyBsbWluIDogMiAtIGxtaW47XG5cdGNvbnN0IHYgPSAobCArIHMpIC8gMjtcblx0Y29uc3Qgc3YgPSBsID09PSAwID8gKDIgKiBzbWluKSAvIChsbWluICsgc21pbikgOiAoMiAqIHMpIC8gKGwgKyBzKTtcblxuXHRyZXR1cm4gW2gsIHN2ICogMTAwLCB2ICogMTAwXTtcbn07XG5cbmNvbnZlcnQuaHN2LnJnYiA9IGZ1bmN0aW9uIChoc3YpIHtcblx0Y29uc3QgaCA9IGhzdlswXSAvIDYwO1xuXHRjb25zdCBzID0gaHN2WzFdIC8gMTAwO1xuXHRsZXQgdiA9IGhzdlsyXSAvIDEwMDtcblx0Y29uc3QgaGkgPSBNYXRoLmZsb29yKGgpICUgNjtcblxuXHRjb25zdCBmID0gaCAtIE1hdGguZmxvb3IoaCk7XG5cdGNvbnN0IHAgPSAyNTUgKiB2ICogKDEgLSBzKTtcblx0Y29uc3QgcSA9IDI1NSAqIHYgKiAoMSAtIChzICogZikpO1xuXHRjb25zdCB0ID0gMjU1ICogdiAqICgxIC0gKHMgKiAoMSAtIGYpKSk7XG5cdHYgKj0gMjU1O1xuXG5cdHN3aXRjaCAoaGkpIHtcblx0XHRjYXNlIDA6XG5cdFx0XHRyZXR1cm4gW3YsIHQsIHBdO1xuXHRcdGNhc2UgMTpcblx0XHRcdHJldHVybiBbcSwgdiwgcF07XG5cdFx0Y2FzZSAyOlxuXHRcdFx0cmV0dXJuIFtwLCB2LCB0XTtcblx0XHRjYXNlIDM6XG5cdFx0XHRyZXR1cm4gW3AsIHEsIHZdO1xuXHRcdGNhc2UgNDpcblx0XHRcdHJldHVybiBbdCwgcCwgdl07XG5cdFx0Y2FzZSA1OlxuXHRcdFx0cmV0dXJuIFt2LCBwLCBxXTtcblx0fVxufTtcblxuY29udmVydC5oc3YuaHNsID0gZnVuY3Rpb24gKGhzdikge1xuXHRjb25zdCBoID0gaHN2WzBdO1xuXHRjb25zdCBzID0gaHN2WzFdIC8gMTAwO1xuXHRjb25zdCB2ID0gaHN2WzJdIC8gMTAwO1xuXHRjb25zdCB2bWluID0gTWF0aC5tYXgodiwgMC4wMSk7XG5cdGxldCBzbDtcblx0bGV0IGw7XG5cblx0bCA9ICgyIC0gcykgKiB2O1xuXHRjb25zdCBsbWluID0gKDIgLSBzKSAqIHZtaW47XG5cdHNsID0gcyAqIHZtaW47XG5cdHNsIC89IChsbWluIDw9IDEpID8gbG1pbiA6IDIgLSBsbWluO1xuXHRzbCA9IHNsIHx8IDA7XG5cdGwgLz0gMjtcblxuXHRyZXR1cm4gW2gsIHNsICogMTAwLCBsICogMTAwXTtcbn07XG5cbi8vIGh0dHA6Ly9kZXYudzMub3JnL2Nzc3dnL2Nzcy1jb2xvci8jaHdiLXRvLXJnYlxuY29udmVydC5od2IucmdiID0gZnVuY3Rpb24gKGh3Yikge1xuXHRjb25zdCBoID0gaHdiWzBdIC8gMzYwO1xuXHRsZXQgd2ggPSBod2JbMV0gLyAxMDA7XG5cdGxldCBibCA9IGh3YlsyXSAvIDEwMDtcblx0Y29uc3QgcmF0aW8gPSB3aCArIGJsO1xuXHRsZXQgZjtcblxuXHQvLyBXaCArIGJsIGNhbnQgYmUgPiAxXG5cdGlmIChyYXRpbyA+IDEpIHtcblx0XHR3aCAvPSByYXRpbztcblx0XHRibCAvPSByYXRpbztcblx0fVxuXG5cdGNvbnN0IGkgPSBNYXRoLmZsb29yKDYgKiBoKTtcblx0Y29uc3QgdiA9IDEgLSBibDtcblx0ZiA9IDYgKiBoIC0gaTtcblxuXHRpZiAoKGkgJiAweDAxKSAhPT0gMCkge1xuXHRcdGYgPSAxIC0gZjtcblx0fVxuXG5cdGNvbnN0IG4gPSB3aCArIGYgKiAodiAtIHdoKTsgLy8gTGluZWFyIGludGVycG9sYXRpb25cblxuXHRsZXQgcjtcblx0bGV0IGc7XG5cdGxldCBiO1xuXHQvKiBlc2xpbnQtZGlzYWJsZSBtYXgtc3RhdGVtZW50cy1wZXItbGluZSxuby1tdWx0aS1zcGFjZXMgKi9cblx0c3dpdGNoIChpKSB7XG5cdFx0ZGVmYXVsdDpcblx0XHRjYXNlIDY6XG5cdFx0Y2FzZSAwOiByID0gdjsgIGcgPSBuOyAgYiA9IHdoOyBicmVhaztcblx0XHRjYXNlIDE6IHIgPSBuOyAgZyA9IHY7ICBiID0gd2g7IGJyZWFrO1xuXHRcdGNhc2UgMjogciA9IHdoOyBnID0gdjsgIGIgPSBuOyBicmVhaztcblx0XHRjYXNlIDM6IHIgPSB3aDsgZyA9IG47ICBiID0gdjsgYnJlYWs7XG5cdFx0Y2FzZSA0OiByID0gbjsgIGcgPSB3aDsgYiA9IHY7IGJyZWFrO1xuXHRcdGNhc2UgNTogciA9IHY7ICBnID0gd2g7IGIgPSBuOyBicmVhaztcblx0fVxuXHQvKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzLXBlci1saW5lLG5vLW11bHRpLXNwYWNlcyAqL1xuXG5cdHJldHVybiBbciAqIDI1NSwgZyAqIDI1NSwgYiAqIDI1NV07XG59O1xuXG5jb252ZXJ0LmNteWsucmdiID0gZnVuY3Rpb24gKGNteWspIHtcblx0Y29uc3QgYyA9IGNteWtbMF0gLyAxMDA7XG5cdGNvbnN0IG0gPSBjbXlrWzFdIC8gMTAwO1xuXHRjb25zdCB5ID0gY215a1syXSAvIDEwMDtcblx0Y29uc3QgayA9IGNteWtbM10gLyAxMDA7XG5cblx0Y29uc3QgciA9IDEgLSBNYXRoLm1pbigxLCBjICogKDEgLSBrKSArIGspO1xuXHRjb25zdCBnID0gMSAtIE1hdGgubWluKDEsIG0gKiAoMSAtIGspICsgayk7XG5cdGNvbnN0IGIgPSAxIC0gTWF0aC5taW4oMSwgeSAqICgxIC0gaykgKyBrKTtcblxuXHRyZXR1cm4gW3IgKiAyNTUsIGcgKiAyNTUsIGIgKiAyNTVdO1xufTtcblxuY29udmVydC54eXoucmdiID0gZnVuY3Rpb24gKHh5eikge1xuXHRjb25zdCB4ID0geHl6WzBdIC8gMTAwO1xuXHRjb25zdCB5ID0geHl6WzFdIC8gMTAwO1xuXHRjb25zdCB6ID0geHl6WzJdIC8gMTAwO1xuXHRsZXQgcjtcblx0bGV0IGc7XG5cdGxldCBiO1xuXG5cdHIgPSAoeCAqIDMuMjQwNikgKyAoeSAqIC0xLjUzNzIpICsgKHogKiAtMC40OTg2KTtcblx0ZyA9ICh4ICogLTAuOTY4OSkgKyAoeSAqIDEuODc1OCkgKyAoeiAqIDAuMDQxNSk7XG5cdGIgPSAoeCAqIDAuMDU1NykgKyAoeSAqIC0wLjIwNDApICsgKHogKiAxLjA1NzApO1xuXG5cdC8vIEFzc3VtZSBzUkdCXG5cdHIgPSByID4gMC4wMDMxMzA4XG5cdFx0PyAoKDEuMDU1ICogKHIgKiogKDEuMCAvIDIuNCkpKSAtIDAuMDU1KVxuXHRcdDogciAqIDEyLjkyO1xuXG5cdGcgPSBnID4gMC4wMDMxMzA4XG5cdFx0PyAoKDEuMDU1ICogKGcgKiogKDEuMCAvIDIuNCkpKSAtIDAuMDU1KVxuXHRcdDogZyAqIDEyLjkyO1xuXG5cdGIgPSBiID4gMC4wMDMxMzA4XG5cdFx0PyAoKDEuMDU1ICogKGIgKiogKDEuMCAvIDIuNCkpKSAtIDAuMDU1KVxuXHRcdDogYiAqIDEyLjkyO1xuXG5cdHIgPSBNYXRoLm1pbihNYXRoLm1heCgwLCByKSwgMSk7XG5cdGcgPSBNYXRoLm1pbihNYXRoLm1heCgwLCBnKSwgMSk7XG5cdGIgPSBNYXRoLm1pbihNYXRoLm1heCgwLCBiKSwgMSk7XG5cblx0cmV0dXJuIFtyICogMjU1LCBnICogMjU1LCBiICogMjU1XTtcbn07XG5cbmNvbnZlcnQueHl6LmxhYiA9IGZ1bmN0aW9uICh4eXopIHtcblx0bGV0IHggPSB4eXpbMF07XG5cdGxldCB5ID0geHl6WzFdO1xuXHRsZXQgeiA9IHh5elsyXTtcblxuXHR4IC89IDk1LjA0Nztcblx0eSAvPSAxMDA7XG5cdHogLz0gMTA4Ljg4MztcblxuXHR4ID0geCA+IDAuMDA4ODU2ID8gKHggKiogKDEgLyAzKSkgOiAoNy43ODcgKiB4KSArICgxNiAvIDExNik7XG5cdHkgPSB5ID4gMC4wMDg4NTYgPyAoeSAqKiAoMSAvIDMpKSA6ICg3Ljc4NyAqIHkpICsgKDE2IC8gMTE2KTtcblx0eiA9IHogPiAwLjAwODg1NiA/ICh6ICoqICgxIC8gMykpIDogKDcuNzg3ICogeikgKyAoMTYgLyAxMTYpO1xuXG5cdGNvbnN0IGwgPSAoMTE2ICogeSkgLSAxNjtcblx0Y29uc3QgYSA9IDUwMCAqICh4IC0geSk7XG5cdGNvbnN0IGIgPSAyMDAgKiAoeSAtIHopO1xuXG5cdHJldHVybiBbbCwgYSwgYl07XG59O1xuXG5jb252ZXJ0LmxhYi54eXogPSBmdW5jdGlvbiAobGFiKSB7XG5cdGNvbnN0IGwgPSBsYWJbMF07XG5cdGNvbnN0IGEgPSBsYWJbMV07XG5cdGNvbnN0IGIgPSBsYWJbMl07XG5cdGxldCB4O1xuXHRsZXQgeTtcblx0bGV0IHo7XG5cblx0eSA9IChsICsgMTYpIC8gMTE2O1xuXHR4ID0gYSAvIDUwMCArIHk7XG5cdHogPSB5IC0gYiAvIDIwMDtcblxuXHRjb25zdCB5MiA9IHkgKiogMztcblx0Y29uc3QgeDIgPSB4ICoqIDM7XG5cdGNvbnN0IHoyID0geiAqKiAzO1xuXHR5ID0geTIgPiAwLjAwODg1NiA/IHkyIDogKHkgLSAxNiAvIDExNikgLyA3Ljc4Nztcblx0eCA9IHgyID4gMC4wMDg4NTYgPyB4MiA6ICh4IC0gMTYgLyAxMTYpIC8gNy43ODc7XG5cdHogPSB6MiA+IDAuMDA4ODU2ID8gejIgOiAoeiAtIDE2IC8gMTE2KSAvIDcuNzg3O1xuXG5cdHggKj0gOTUuMDQ3O1xuXHR5ICo9IDEwMDtcblx0eiAqPSAxMDguODgzO1xuXG5cdHJldHVybiBbeCwgeSwgel07XG59O1xuXG5jb252ZXJ0LmxhYi5sY2ggPSBmdW5jdGlvbiAobGFiKSB7XG5cdGNvbnN0IGwgPSBsYWJbMF07XG5cdGNvbnN0IGEgPSBsYWJbMV07XG5cdGNvbnN0IGIgPSBsYWJbMl07XG5cdGxldCBoO1xuXG5cdGNvbnN0IGhyID0gTWF0aC5hdGFuMihiLCBhKTtcblx0aCA9IGhyICogMzYwIC8gMiAvIE1hdGguUEk7XG5cblx0aWYgKGggPCAwKSB7XG5cdFx0aCArPSAzNjA7XG5cdH1cblxuXHRjb25zdCBjID0gTWF0aC5zcXJ0KGEgKiBhICsgYiAqIGIpO1xuXG5cdHJldHVybiBbbCwgYywgaF07XG59O1xuXG5jb252ZXJ0LmxjaC5sYWIgPSBmdW5jdGlvbiAobGNoKSB7XG5cdGNvbnN0IGwgPSBsY2hbMF07XG5cdGNvbnN0IGMgPSBsY2hbMV07XG5cdGNvbnN0IGggPSBsY2hbMl07XG5cblx0Y29uc3QgaHIgPSBoIC8gMzYwICogMiAqIE1hdGguUEk7XG5cdGNvbnN0IGEgPSBjICogTWF0aC5jb3MoaHIpO1xuXHRjb25zdCBiID0gYyAqIE1hdGguc2luKGhyKTtcblxuXHRyZXR1cm4gW2wsIGEsIGJdO1xufTtcblxuY29udmVydC5yZ2IuYW5zaTE2ID0gZnVuY3Rpb24gKGFyZ3MsIHNhdHVyYXRpb24gPSBudWxsKSB7XG5cdGNvbnN0IFtyLCBnLCBiXSA9IGFyZ3M7XG5cdGxldCB2YWx1ZSA9IHNhdHVyYXRpb24gPT09IG51bGwgPyBjb252ZXJ0LnJnYi5oc3YoYXJncylbMl0gOiBzYXR1cmF0aW9uOyAvLyBIc3YgLT4gYW5zaTE2IG9wdGltaXphdGlvblxuXG5cdHZhbHVlID0gTWF0aC5yb3VuZCh2YWx1ZSAvIDUwKTtcblxuXHRpZiAodmFsdWUgPT09IDApIHtcblx0XHRyZXR1cm4gMzA7XG5cdH1cblxuXHRsZXQgYW5zaSA9IDMwXG5cdFx0KyAoKE1hdGgucm91bmQoYiAvIDI1NSkgPDwgMilcblx0XHR8IChNYXRoLnJvdW5kKGcgLyAyNTUpIDw8IDEpXG5cdFx0fCBNYXRoLnJvdW5kKHIgLyAyNTUpKTtcblxuXHRpZiAodmFsdWUgPT09IDIpIHtcblx0XHRhbnNpICs9IDYwO1xuXHR9XG5cblx0cmV0dXJuIGFuc2k7XG59O1xuXG5jb252ZXJ0Lmhzdi5hbnNpMTYgPSBmdW5jdGlvbiAoYXJncykge1xuXHQvLyBPcHRpbWl6YXRpb24gaGVyZTsgd2UgYWxyZWFkeSBrbm93IHRoZSB2YWx1ZSBhbmQgZG9uJ3QgbmVlZCB0byBnZXRcblx0Ly8gaXQgY29udmVydGVkIGZvciB1cy5cblx0cmV0dXJuIGNvbnZlcnQucmdiLmFuc2kxNihjb252ZXJ0Lmhzdi5yZ2IoYXJncyksIGFyZ3NbMl0pO1xufTtcblxuY29udmVydC5yZ2IuYW5zaTI1NiA9IGZ1bmN0aW9uIChhcmdzKSB7XG5cdGNvbnN0IHIgPSBhcmdzWzBdO1xuXHRjb25zdCBnID0gYXJnc1sxXTtcblx0Y29uc3QgYiA9IGFyZ3NbMl07XG5cblx0Ly8gV2UgdXNlIHRoZSBleHRlbmRlZCBncmV5c2NhbGUgcGFsZXR0ZSBoZXJlLCB3aXRoIHRoZSBleGNlcHRpb24gb2Zcblx0Ly8gYmxhY2sgYW5kIHdoaXRlLiBub3JtYWwgcGFsZXR0ZSBvbmx5IGhhcyA0IGdyZXlzY2FsZSBzaGFkZXMuXG5cdGlmIChyID09PSBnICYmIGcgPT09IGIpIHtcblx0XHRpZiAociA8IDgpIHtcblx0XHRcdHJldHVybiAxNjtcblx0XHR9XG5cblx0XHRpZiAociA+IDI0OCkge1xuXHRcdFx0cmV0dXJuIDIzMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gTWF0aC5yb3VuZCgoKHIgLSA4KSAvIDI0NykgKiAyNCkgKyAyMzI7XG5cdH1cblxuXHRjb25zdCBhbnNpID0gMTZcblx0XHQrICgzNiAqIE1hdGgucm91bmQociAvIDI1NSAqIDUpKVxuXHRcdCsgKDYgKiBNYXRoLnJvdW5kKGcgLyAyNTUgKiA1KSlcblx0XHQrIE1hdGgucm91bmQoYiAvIDI1NSAqIDUpO1xuXG5cdHJldHVybiBhbnNpO1xufTtcblxuY29udmVydC5hbnNpMTYucmdiID0gZnVuY3Rpb24gKGFyZ3MpIHtcblx0bGV0IGNvbG9yID0gYXJncyAlIDEwO1xuXG5cdC8vIEhhbmRsZSBncmV5c2NhbGVcblx0aWYgKGNvbG9yID09PSAwIHx8IGNvbG9yID09PSA3KSB7XG5cdFx0aWYgKGFyZ3MgPiA1MCkge1xuXHRcdFx0Y29sb3IgKz0gMy41O1xuXHRcdH1cblxuXHRcdGNvbG9yID0gY29sb3IgLyAxMC41ICogMjU1O1xuXG5cdFx0cmV0dXJuIFtjb2xvciwgY29sb3IsIGNvbG9yXTtcblx0fVxuXG5cdGNvbnN0IG11bHQgPSAofn4oYXJncyA+IDUwKSArIDEpICogMC41O1xuXHRjb25zdCByID0gKChjb2xvciAmIDEpICogbXVsdCkgKiAyNTU7XG5cdGNvbnN0IGcgPSAoKChjb2xvciA+PiAxKSAmIDEpICogbXVsdCkgKiAyNTU7XG5cdGNvbnN0IGIgPSAoKChjb2xvciA+PiAyKSAmIDEpICogbXVsdCkgKiAyNTU7XG5cblx0cmV0dXJuIFtyLCBnLCBiXTtcbn07XG5cbmNvbnZlcnQuYW5zaTI1Ni5yZ2IgPSBmdW5jdGlvbiAoYXJncykge1xuXHQvLyBIYW5kbGUgZ3JleXNjYWxlXG5cdGlmIChhcmdzID49IDIzMikge1xuXHRcdGNvbnN0IGMgPSAoYXJncyAtIDIzMikgKiAxMCArIDg7XG5cdFx0cmV0dXJuIFtjLCBjLCBjXTtcblx0fVxuXG5cdGFyZ3MgLT0gMTY7XG5cblx0bGV0IHJlbTtcblx0Y29uc3QgciA9IE1hdGguZmxvb3IoYXJncyAvIDM2KSAvIDUgKiAyNTU7XG5cdGNvbnN0IGcgPSBNYXRoLmZsb29yKChyZW0gPSBhcmdzICUgMzYpIC8gNikgLyA1ICogMjU1O1xuXHRjb25zdCBiID0gKHJlbSAlIDYpIC8gNSAqIDI1NTtcblxuXHRyZXR1cm4gW3IsIGcsIGJdO1xufTtcblxuY29udmVydC5yZ2IuaGV4ID0gZnVuY3Rpb24gKGFyZ3MpIHtcblx0Y29uc3QgaW50ZWdlciA9ICgoTWF0aC5yb3VuZChhcmdzWzBdKSAmIDB4RkYpIDw8IDE2KVxuXHRcdCsgKChNYXRoLnJvdW5kKGFyZ3NbMV0pICYgMHhGRikgPDwgOClcblx0XHQrIChNYXRoLnJvdW5kKGFyZ3NbMl0pICYgMHhGRik7XG5cblx0Y29uc3Qgc3RyaW5nID0gaW50ZWdlci50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcblx0cmV0dXJuICcwMDAwMDAnLnN1YnN0cmluZyhzdHJpbmcubGVuZ3RoKSArIHN0cmluZztcbn07XG5cbmNvbnZlcnQuaGV4LnJnYiA9IGZ1bmN0aW9uIChhcmdzKSB7XG5cdGNvbnN0IG1hdGNoID0gYXJncy50b1N0cmluZygxNikubWF0Y2goL1thLWYwLTldezZ9fFthLWYwLTldezN9L2kpO1xuXHRpZiAoIW1hdGNoKSB7XG5cdFx0cmV0dXJuIFswLCAwLCAwXTtcblx0fVxuXG5cdGxldCBjb2xvclN0cmluZyA9IG1hdGNoWzBdO1xuXG5cdGlmIChtYXRjaFswXS5sZW5ndGggPT09IDMpIHtcblx0XHRjb2xvclN0cmluZyA9IGNvbG9yU3RyaW5nLnNwbGl0KCcnKS5tYXAoY2hhciA9PiB7XG5cdFx0XHRyZXR1cm4gY2hhciArIGNoYXI7XG5cdFx0fSkuam9pbignJyk7XG5cdH1cblxuXHRjb25zdCBpbnRlZ2VyID0gcGFyc2VJbnQoY29sb3JTdHJpbmcsIDE2KTtcblx0Y29uc3QgciA9IChpbnRlZ2VyID4+IDE2KSAmIDB4RkY7XG5cdGNvbnN0IGcgPSAoaW50ZWdlciA+PiA4KSAmIDB4RkY7XG5cdGNvbnN0IGIgPSBpbnRlZ2VyICYgMHhGRjtcblxuXHRyZXR1cm4gW3IsIGcsIGJdO1xufTtcblxuY29udmVydC5yZ2IuaGNnID0gZnVuY3Rpb24gKHJnYikge1xuXHRjb25zdCByID0gcmdiWzBdIC8gMjU1O1xuXHRjb25zdCBnID0gcmdiWzFdIC8gMjU1O1xuXHRjb25zdCBiID0gcmdiWzJdIC8gMjU1O1xuXHRjb25zdCBtYXggPSBNYXRoLm1heChNYXRoLm1heChyLCBnKSwgYik7XG5cdGNvbnN0IG1pbiA9IE1hdGgubWluKE1hdGgubWluKHIsIGcpLCBiKTtcblx0Y29uc3QgY2hyb21hID0gKG1heCAtIG1pbik7XG5cdGxldCBncmF5c2NhbGU7XG5cdGxldCBodWU7XG5cblx0aWYgKGNocm9tYSA8IDEpIHtcblx0XHRncmF5c2NhbGUgPSBtaW4gLyAoMSAtIGNocm9tYSk7XG5cdH0gZWxzZSB7XG5cdFx0Z3JheXNjYWxlID0gMDtcblx0fVxuXG5cdGlmIChjaHJvbWEgPD0gMCkge1xuXHRcdGh1ZSA9IDA7XG5cdH0gZWxzZVxuXHRpZiAobWF4ID09PSByKSB7XG5cdFx0aHVlID0gKChnIC0gYikgLyBjaHJvbWEpICUgNjtcblx0fSBlbHNlXG5cdGlmIChtYXggPT09IGcpIHtcblx0XHRodWUgPSAyICsgKGIgLSByKSAvIGNocm9tYTtcblx0fSBlbHNlIHtcblx0XHRodWUgPSA0ICsgKHIgLSBnKSAvIGNocm9tYTtcblx0fVxuXG5cdGh1ZSAvPSA2O1xuXHRodWUgJT0gMTtcblxuXHRyZXR1cm4gW2h1ZSAqIDM2MCwgY2hyb21hICogMTAwLCBncmF5c2NhbGUgKiAxMDBdO1xufTtcblxuY29udmVydC5oc2wuaGNnID0gZnVuY3Rpb24gKGhzbCkge1xuXHRjb25zdCBzID0gaHNsWzFdIC8gMTAwO1xuXHRjb25zdCBsID0gaHNsWzJdIC8gMTAwO1xuXG5cdGNvbnN0IGMgPSBsIDwgMC41ID8gKDIuMCAqIHMgKiBsKSA6ICgyLjAgKiBzICogKDEuMCAtIGwpKTtcblxuXHRsZXQgZiA9IDA7XG5cdGlmIChjIDwgMS4wKSB7XG5cdFx0ZiA9IChsIC0gMC41ICogYykgLyAoMS4wIC0gYyk7XG5cdH1cblxuXHRyZXR1cm4gW2hzbFswXSwgYyAqIDEwMCwgZiAqIDEwMF07XG59O1xuXG5jb252ZXJ0Lmhzdi5oY2cgPSBmdW5jdGlvbiAoaHN2KSB7XG5cdGNvbnN0IHMgPSBoc3ZbMV0gLyAxMDA7XG5cdGNvbnN0IHYgPSBoc3ZbMl0gLyAxMDA7XG5cblx0Y29uc3QgYyA9IHMgKiB2O1xuXHRsZXQgZiA9IDA7XG5cblx0aWYgKGMgPCAxLjApIHtcblx0XHRmID0gKHYgLSBjKSAvICgxIC0gYyk7XG5cdH1cblxuXHRyZXR1cm4gW2hzdlswXSwgYyAqIDEwMCwgZiAqIDEwMF07XG59O1xuXG5jb252ZXJ0LmhjZy5yZ2IgPSBmdW5jdGlvbiAoaGNnKSB7XG5cdGNvbnN0IGggPSBoY2dbMF0gLyAzNjA7XG5cdGNvbnN0IGMgPSBoY2dbMV0gLyAxMDA7XG5cdGNvbnN0IGcgPSBoY2dbMl0gLyAxMDA7XG5cblx0aWYgKGMgPT09IDAuMCkge1xuXHRcdHJldHVybiBbZyAqIDI1NSwgZyAqIDI1NSwgZyAqIDI1NV07XG5cdH1cblxuXHRjb25zdCBwdXJlID0gWzAsIDAsIDBdO1xuXHRjb25zdCBoaSA9IChoICUgMSkgKiA2O1xuXHRjb25zdCB2ID0gaGkgJSAxO1xuXHRjb25zdCB3ID0gMSAtIHY7XG5cdGxldCBtZyA9IDA7XG5cblx0LyogZXNsaW50LWRpc2FibGUgbWF4LXN0YXRlbWVudHMtcGVyLWxpbmUgKi9cblx0c3dpdGNoIChNYXRoLmZsb29yKGhpKSkge1xuXHRcdGNhc2UgMDpcblx0XHRcdHB1cmVbMF0gPSAxOyBwdXJlWzFdID0gdjsgcHVyZVsyXSA9IDA7IGJyZWFrO1xuXHRcdGNhc2UgMTpcblx0XHRcdHB1cmVbMF0gPSB3OyBwdXJlWzFdID0gMTsgcHVyZVsyXSA9IDA7IGJyZWFrO1xuXHRcdGNhc2UgMjpcblx0XHRcdHB1cmVbMF0gPSAwOyBwdXJlWzFdID0gMTsgcHVyZVsyXSA9IHY7IGJyZWFrO1xuXHRcdGNhc2UgMzpcblx0XHRcdHB1cmVbMF0gPSAwOyBwdXJlWzFdID0gdzsgcHVyZVsyXSA9IDE7IGJyZWFrO1xuXHRcdGNhc2UgNDpcblx0XHRcdHB1cmVbMF0gPSB2OyBwdXJlWzFdID0gMDsgcHVyZVsyXSA9IDE7IGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRwdXJlWzBdID0gMTsgcHVyZVsxXSA9IDA7IHB1cmVbMl0gPSB3O1xuXHR9XG5cdC8qIGVzbGludC1lbmFibGUgbWF4LXN0YXRlbWVudHMtcGVyLWxpbmUgKi9cblxuXHRtZyA9ICgxLjAgLSBjKSAqIGc7XG5cblx0cmV0dXJuIFtcblx0XHQoYyAqIHB1cmVbMF0gKyBtZykgKiAyNTUsXG5cdFx0KGMgKiBwdXJlWzFdICsgbWcpICogMjU1LFxuXHRcdChjICogcHVyZVsyXSArIG1nKSAqIDI1NVxuXHRdO1xufTtcblxuY29udmVydC5oY2cuaHN2ID0gZnVuY3Rpb24gKGhjZykge1xuXHRjb25zdCBjID0gaGNnWzFdIC8gMTAwO1xuXHRjb25zdCBnID0gaGNnWzJdIC8gMTAwO1xuXG5cdGNvbnN0IHYgPSBjICsgZyAqICgxLjAgLSBjKTtcblx0bGV0IGYgPSAwO1xuXG5cdGlmICh2ID4gMC4wKSB7XG5cdFx0ZiA9IGMgLyB2O1xuXHR9XG5cblx0cmV0dXJuIFtoY2dbMF0sIGYgKiAxMDAsIHYgKiAxMDBdO1xufTtcblxuY29udmVydC5oY2cuaHNsID0gZnVuY3Rpb24gKGhjZykge1xuXHRjb25zdCBjID0gaGNnWzFdIC8gMTAwO1xuXHRjb25zdCBnID0gaGNnWzJdIC8gMTAwO1xuXG5cdGNvbnN0IGwgPSBnICogKDEuMCAtIGMpICsgMC41ICogYztcblx0bGV0IHMgPSAwO1xuXG5cdGlmIChsID4gMC4wICYmIGwgPCAwLjUpIHtcblx0XHRzID0gYyAvICgyICogbCk7XG5cdH0gZWxzZVxuXHRpZiAobCA+PSAwLjUgJiYgbCA8IDEuMCkge1xuXHRcdHMgPSBjIC8gKDIgKiAoMSAtIGwpKTtcblx0fVxuXG5cdHJldHVybiBbaGNnWzBdLCBzICogMTAwLCBsICogMTAwXTtcbn07XG5cbmNvbnZlcnQuaGNnLmh3YiA9IGZ1bmN0aW9uIChoY2cpIHtcblx0Y29uc3QgYyA9IGhjZ1sxXSAvIDEwMDtcblx0Y29uc3QgZyA9IGhjZ1syXSAvIDEwMDtcblx0Y29uc3QgdiA9IGMgKyBnICogKDEuMCAtIGMpO1xuXHRyZXR1cm4gW2hjZ1swXSwgKHYgLSBjKSAqIDEwMCwgKDEgLSB2KSAqIDEwMF07XG59O1xuXG5jb252ZXJ0Lmh3Yi5oY2cgPSBmdW5jdGlvbiAoaHdiKSB7XG5cdGNvbnN0IHcgPSBod2JbMV0gLyAxMDA7XG5cdGNvbnN0IGIgPSBod2JbMl0gLyAxMDA7XG5cdGNvbnN0IHYgPSAxIC0gYjtcblx0Y29uc3QgYyA9IHYgLSB3O1xuXHRsZXQgZyA9IDA7XG5cblx0aWYgKGMgPCAxKSB7XG5cdFx0ZyA9ICh2IC0gYykgLyAoMSAtIGMpO1xuXHR9XG5cblx0cmV0dXJuIFtod2JbMF0sIGMgKiAxMDAsIGcgKiAxMDBdO1xufTtcblxuY29udmVydC5hcHBsZS5yZ2IgPSBmdW5jdGlvbiAoYXBwbGUpIHtcblx0cmV0dXJuIFsoYXBwbGVbMF0gLyA2NTUzNSkgKiAyNTUsIChhcHBsZVsxXSAvIDY1NTM1KSAqIDI1NSwgKGFwcGxlWzJdIC8gNjU1MzUpICogMjU1XTtcbn07XG5cbmNvbnZlcnQucmdiLmFwcGxlID0gZnVuY3Rpb24gKHJnYikge1xuXHRyZXR1cm4gWyhyZ2JbMF0gLyAyNTUpICogNjU1MzUsIChyZ2JbMV0gLyAyNTUpICogNjU1MzUsIChyZ2JbMl0gLyAyNTUpICogNjU1MzVdO1xufTtcblxuY29udmVydC5ncmF5LnJnYiA9IGZ1bmN0aW9uIChhcmdzKSB7XG5cdHJldHVybiBbYXJnc1swXSAvIDEwMCAqIDI1NSwgYXJnc1swXSAvIDEwMCAqIDI1NSwgYXJnc1swXSAvIDEwMCAqIDI1NV07XG59O1xuXG5jb252ZXJ0LmdyYXkuaHNsID0gZnVuY3Rpb24gKGFyZ3MpIHtcblx0cmV0dXJuIFswLCAwLCBhcmdzWzBdXTtcbn07XG5cbmNvbnZlcnQuZ3JheS5oc3YgPSBjb252ZXJ0LmdyYXkuaHNsO1xuXG5jb252ZXJ0LmdyYXkuaHdiID0gZnVuY3Rpb24gKGdyYXkpIHtcblx0cmV0dXJuIFswLCAxMDAsIGdyYXlbMF1dO1xufTtcblxuY29udmVydC5ncmF5LmNteWsgPSBmdW5jdGlvbiAoZ3JheSkge1xuXHRyZXR1cm4gWzAsIDAsIDAsIGdyYXlbMF1dO1xufTtcblxuY29udmVydC5ncmF5LmxhYiA9IGZ1bmN0aW9uIChncmF5KSB7XG5cdHJldHVybiBbZ3JheVswXSwgMCwgMF07XG59O1xuXG5jb252ZXJ0LmdyYXkuaGV4ID0gZnVuY3Rpb24gKGdyYXkpIHtcblx0Y29uc3QgdmFsID0gTWF0aC5yb3VuZChncmF5WzBdIC8gMTAwICogMjU1KSAmIDB4RkY7XG5cdGNvbnN0IGludGVnZXIgPSAodmFsIDw8IDE2KSArICh2YWwgPDwgOCkgKyB2YWw7XG5cblx0Y29uc3Qgc3RyaW5nID0gaW50ZWdlci50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcblx0cmV0dXJuICcwMDAwMDAnLnN1YnN0cmluZyhzdHJpbmcubGVuZ3RoKSArIHN0cmluZztcbn07XG5cbmNvbnZlcnQucmdiLmdyYXkgPSBmdW5jdGlvbiAocmdiKSB7XG5cdGNvbnN0IHZhbCA9IChyZ2JbMF0gKyByZ2JbMV0gKyByZ2JbMl0pIC8gMztcblx0cmV0dXJuIFt2YWwgLyAyNTUgKiAxMDBdO1xufTtcbiIsImNvbnN0IGNvbnZlcnNpb25zID0gcmVxdWlyZSgnLi9jb252ZXJzaW9ucycpO1xuY29uc3Qgcm91dGUgPSByZXF1aXJlKCcuL3JvdXRlJyk7XG5cbmNvbnN0IGNvbnZlcnQgPSB7fTtcblxuY29uc3QgbW9kZWxzID0gT2JqZWN0LmtleXMoY29udmVyc2lvbnMpO1xuXG5mdW5jdGlvbiB3cmFwUmF3KGZuKSB7XG5cdGNvbnN0IHdyYXBwZWRGbiA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG5cdFx0Y29uc3QgYXJnMCA9IGFyZ3NbMF07XG5cdFx0aWYgKGFyZzAgPT09IHVuZGVmaW5lZCB8fCBhcmcwID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gYXJnMDtcblx0XHR9XG5cblx0XHRpZiAoYXJnMC5sZW5ndGggPiAxKSB7XG5cdFx0XHRhcmdzID0gYXJnMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gZm4oYXJncyk7XG5cdH07XG5cblx0Ly8gUHJlc2VydmUgLmNvbnZlcnNpb24gcHJvcGVydHkgaWYgdGhlcmUgaXMgb25lXG5cdGlmICgnY29udmVyc2lvbicgaW4gZm4pIHtcblx0XHR3cmFwcGVkRm4uY29udmVyc2lvbiA9IGZuLmNvbnZlcnNpb247XG5cdH1cblxuXHRyZXR1cm4gd3JhcHBlZEZuO1xufVxuXG5mdW5jdGlvbiB3cmFwUm91bmRlZChmbikge1xuXHRjb25zdCB3cmFwcGVkRm4gPSBmdW5jdGlvbiAoLi4uYXJncykge1xuXHRcdGNvbnN0IGFyZzAgPSBhcmdzWzBdO1xuXG5cdFx0aWYgKGFyZzAgPT09IHVuZGVmaW5lZCB8fCBhcmcwID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gYXJnMDtcblx0XHR9XG5cblx0XHRpZiAoYXJnMC5sZW5ndGggPiAxKSB7XG5cdFx0XHRhcmdzID0gYXJnMDtcblx0XHR9XG5cblx0XHRjb25zdCByZXN1bHQgPSBmbihhcmdzKTtcblxuXHRcdC8vIFdlJ3JlIGFzc3VtaW5nIHRoZSByZXN1bHQgaXMgYW4gYXJyYXkgaGVyZS5cblx0XHQvLyBzZWUgbm90aWNlIGluIGNvbnZlcnNpb25zLmpzOyBkb24ndCB1c2UgYm94IHR5cGVzXG5cdFx0Ly8gaW4gY29udmVyc2lvbiBmdW5jdGlvbnMuXG5cdFx0aWYgKHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRmb3IgKGxldCBsZW4gPSByZXN1bHQubGVuZ3RoLCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdHJlc3VsdFtpXSA9IE1hdGgucm91bmQocmVzdWx0W2ldKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cdC8vIFByZXNlcnZlIC5jb252ZXJzaW9uIHByb3BlcnR5IGlmIHRoZXJlIGlzIG9uZVxuXHRpZiAoJ2NvbnZlcnNpb24nIGluIGZuKSB7XG5cdFx0d3JhcHBlZEZuLmNvbnZlcnNpb24gPSBmbi5jb252ZXJzaW9uO1xuXHR9XG5cblx0cmV0dXJuIHdyYXBwZWRGbjtcbn1cblxubW9kZWxzLmZvckVhY2goZnJvbU1vZGVsID0+IHtcblx0Y29udmVydFtmcm9tTW9kZWxdID0ge307XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnZlcnRbZnJvbU1vZGVsXSwgJ2NoYW5uZWxzJywge3ZhbHVlOiBjb252ZXJzaW9uc1tmcm9tTW9kZWxdLmNoYW5uZWxzfSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb252ZXJ0W2Zyb21Nb2RlbF0sICdsYWJlbHMnLCB7dmFsdWU6IGNvbnZlcnNpb25zW2Zyb21Nb2RlbF0ubGFiZWxzfSk7XG5cblx0Y29uc3Qgcm91dGVzID0gcm91dGUoZnJvbU1vZGVsKTtcblx0Y29uc3Qgcm91dGVNb2RlbHMgPSBPYmplY3Qua2V5cyhyb3V0ZXMpO1xuXG5cdHJvdXRlTW9kZWxzLmZvckVhY2godG9Nb2RlbCA9PiB7XG5cdFx0Y29uc3QgZm4gPSByb3V0ZXNbdG9Nb2RlbF07XG5cblx0XHRjb252ZXJ0W2Zyb21Nb2RlbF1bdG9Nb2RlbF0gPSB3cmFwUm91bmRlZChmbik7XG5cdFx0Y29udmVydFtmcm9tTW9kZWxdW3RvTW9kZWxdLnJhdyA9IHdyYXBSYXcoZm4pO1xuXHR9KTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnZlcnQ7XG4iLCJjb25zdCBjb252ZXJzaW9ucyA9IHJlcXVpcmUoJy4vY29udmVyc2lvbnMnKTtcblxuLypcblx0VGhpcyBmdW5jdGlvbiByb3V0ZXMgYSBtb2RlbCB0byBhbGwgb3RoZXIgbW9kZWxzLlxuXG5cdGFsbCBmdW5jdGlvbnMgdGhhdCBhcmUgcm91dGVkIGhhdmUgYSBwcm9wZXJ0eSBgLmNvbnZlcnNpb25gIGF0dGFjaGVkXG5cdHRvIHRoZSByZXR1cm5lZCBzeW50aGV0aWMgZnVuY3Rpb24uIFRoaXMgcHJvcGVydHkgaXMgYW4gYXJyYXlcblx0b2Ygc3RyaW5ncywgZWFjaCB3aXRoIHRoZSBzdGVwcyBpbiBiZXR3ZWVuIHRoZSAnZnJvbScgYW5kICd0bydcblx0Y29sb3IgbW9kZWxzIChpbmNsdXNpdmUpLlxuXG5cdGNvbnZlcnNpb25zIHRoYXQgYXJlIG5vdCBwb3NzaWJsZSBzaW1wbHkgYXJlIG5vdCBpbmNsdWRlZC5cbiovXG5cbmZ1bmN0aW9uIGJ1aWxkR3JhcGgoKSB7XG5cdGNvbnN0IGdyYXBoID0ge307XG5cdC8vIGh0dHBzOi8vanNwZXJmLmNvbS9vYmplY3Qta2V5cy12cy1mb3ItaW4td2l0aC1jbG9zdXJlLzNcblx0Y29uc3QgbW9kZWxzID0gT2JqZWN0LmtleXMoY29udmVyc2lvbnMpO1xuXG5cdGZvciAobGV0IGxlbiA9IG1vZGVscy5sZW5ndGgsIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRncmFwaFttb2RlbHNbaV1dID0ge1xuXHRcdFx0Ly8gaHR0cDovL2pzcGVyZi5jb20vMS12cy1pbmZpbml0eVxuXHRcdFx0Ly8gbWljcm8tb3B0LCBidXQgdGhpcyBpcyBzaW1wbGUuXG5cdFx0XHRkaXN0YW5jZTogLTEsXG5cdFx0XHRwYXJlbnQ6IG51bGxcblx0XHR9O1xuXHR9XG5cblx0cmV0dXJuIGdyYXBoO1xufVxuXG4vLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CcmVhZHRoLWZpcnN0X3NlYXJjaFxuZnVuY3Rpb24gZGVyaXZlQkZTKGZyb21Nb2RlbCkge1xuXHRjb25zdCBncmFwaCA9IGJ1aWxkR3JhcGgoKTtcblx0Y29uc3QgcXVldWUgPSBbZnJvbU1vZGVsXTsgLy8gVW5zaGlmdCAtPiBxdWV1ZSAtPiBwb3BcblxuXHRncmFwaFtmcm9tTW9kZWxdLmRpc3RhbmNlID0gMDtcblxuXHR3aGlsZSAocXVldWUubGVuZ3RoKSB7XG5cdFx0Y29uc3QgY3VycmVudCA9IHF1ZXVlLnBvcCgpO1xuXHRcdGNvbnN0IGFkamFjZW50cyA9IE9iamVjdC5rZXlzKGNvbnZlcnNpb25zW2N1cnJlbnRdKTtcblxuXHRcdGZvciAobGV0IGxlbiA9IGFkamFjZW50cy5sZW5ndGgsIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGNvbnN0IGFkamFjZW50ID0gYWRqYWNlbnRzW2ldO1xuXHRcdFx0Y29uc3Qgbm9kZSA9IGdyYXBoW2FkamFjZW50XTtcblxuXHRcdFx0aWYgKG5vZGUuZGlzdGFuY2UgPT09IC0xKSB7XG5cdFx0XHRcdG5vZGUuZGlzdGFuY2UgPSBncmFwaFtjdXJyZW50XS5kaXN0YW5jZSArIDE7XG5cdFx0XHRcdG5vZGUucGFyZW50ID0gY3VycmVudDtcblx0XHRcdFx0cXVldWUudW5zaGlmdChhZGphY2VudCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGdyYXBoO1xufVxuXG5mdW5jdGlvbiBsaW5rKGZyb20sIHRvKSB7XG5cdHJldHVybiBmdW5jdGlvbiAoYXJncykge1xuXHRcdHJldHVybiB0byhmcm9tKGFyZ3MpKTtcblx0fTtcbn1cblxuZnVuY3Rpb24gd3JhcENvbnZlcnNpb24odG9Nb2RlbCwgZ3JhcGgpIHtcblx0Y29uc3QgcGF0aCA9IFtncmFwaFt0b01vZGVsXS5wYXJlbnQsIHRvTW9kZWxdO1xuXHRsZXQgZm4gPSBjb252ZXJzaW9uc1tncmFwaFt0b01vZGVsXS5wYXJlbnRdW3RvTW9kZWxdO1xuXG5cdGxldCBjdXIgPSBncmFwaFt0b01vZGVsXS5wYXJlbnQ7XG5cdHdoaWxlIChncmFwaFtjdXJdLnBhcmVudCkge1xuXHRcdHBhdGgudW5zaGlmdChncmFwaFtjdXJdLnBhcmVudCk7XG5cdFx0Zm4gPSBsaW5rKGNvbnZlcnNpb25zW2dyYXBoW2N1cl0ucGFyZW50XVtjdXJdLCBmbik7XG5cdFx0Y3VyID0gZ3JhcGhbY3VyXS5wYXJlbnQ7XG5cdH1cblxuXHRmbi5jb252ZXJzaW9uID0gcGF0aDtcblx0cmV0dXJuIGZuO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmcm9tTW9kZWwpIHtcblx0Y29uc3QgZ3JhcGggPSBkZXJpdmVCRlMoZnJvbU1vZGVsKTtcblx0Y29uc3QgY29udmVyc2lvbiA9IHt9O1xuXG5cdGNvbnN0IG1vZGVscyA9IE9iamVjdC5rZXlzKGdyYXBoKTtcblx0Zm9yIChsZXQgbGVuID0gbW9kZWxzLmxlbmd0aCwgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdGNvbnN0IHRvTW9kZWwgPSBtb2RlbHNbaV07XG5cdFx0Y29uc3Qgbm9kZSA9IGdyYXBoW3RvTW9kZWxdO1xuXG5cdFx0aWYgKG5vZGUucGFyZW50ID09PSBudWxsKSB7XG5cdFx0XHQvLyBObyBwb3NzaWJsZSBjb252ZXJzaW9uLCBvciB0aGlzIG5vZGUgaXMgdGhlIHNvdXJjZSBtb2RlbC5cblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdGNvbnZlcnNpb25bdG9Nb2RlbF0gPSB3cmFwQ29udmVyc2lvbih0b01vZGVsLCBncmFwaCk7XG5cdH1cblxuXHRyZXR1cm4gY29udmVyc2lvbjtcbn07XG5cbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0XCJhbGljZWJsdWVcIjogWzI0MCwgMjQ4LCAyNTVdLFxyXG5cdFwiYW50aXF1ZXdoaXRlXCI6IFsyNTAsIDIzNSwgMjE1XSxcclxuXHRcImFxdWFcIjogWzAsIDI1NSwgMjU1XSxcclxuXHRcImFxdWFtYXJpbmVcIjogWzEyNywgMjU1LCAyMTJdLFxyXG5cdFwiYXp1cmVcIjogWzI0MCwgMjU1LCAyNTVdLFxyXG5cdFwiYmVpZ2VcIjogWzI0NSwgMjQ1LCAyMjBdLFxyXG5cdFwiYmlzcXVlXCI6IFsyNTUsIDIyOCwgMTk2XSxcclxuXHRcImJsYWNrXCI6IFswLCAwLCAwXSxcclxuXHRcImJsYW5jaGVkYWxtb25kXCI6IFsyNTUsIDIzNSwgMjA1XSxcclxuXHRcImJsdWVcIjogWzAsIDAsIDI1NV0sXHJcblx0XCJibHVldmlvbGV0XCI6IFsxMzgsIDQzLCAyMjZdLFxyXG5cdFwiYnJvd25cIjogWzE2NSwgNDIsIDQyXSxcclxuXHRcImJ1cmx5d29vZFwiOiBbMjIyLCAxODQsIDEzNV0sXHJcblx0XCJjYWRldGJsdWVcIjogWzk1LCAxNTgsIDE2MF0sXHJcblx0XCJjaGFydHJldXNlXCI6IFsxMjcsIDI1NSwgMF0sXHJcblx0XCJjaG9jb2xhdGVcIjogWzIxMCwgMTA1LCAzMF0sXHJcblx0XCJjb3JhbFwiOiBbMjU1LCAxMjcsIDgwXSxcclxuXHRcImNvcm5mbG93ZXJibHVlXCI6IFsxMDAsIDE0OSwgMjM3XSxcclxuXHRcImNvcm5zaWxrXCI6IFsyNTUsIDI0OCwgMjIwXSxcclxuXHRcImNyaW1zb25cIjogWzIyMCwgMjAsIDYwXSxcclxuXHRcImN5YW5cIjogWzAsIDI1NSwgMjU1XSxcclxuXHRcImRhcmtibHVlXCI6IFswLCAwLCAxMzldLFxyXG5cdFwiZGFya2N5YW5cIjogWzAsIDEzOSwgMTM5XSxcclxuXHRcImRhcmtnb2xkZW5yb2RcIjogWzE4NCwgMTM0LCAxMV0sXHJcblx0XCJkYXJrZ3JheVwiOiBbMTY5LCAxNjksIDE2OV0sXHJcblx0XCJkYXJrZ3JlZW5cIjogWzAsIDEwMCwgMF0sXHJcblx0XCJkYXJrZ3JleVwiOiBbMTY5LCAxNjksIDE2OV0sXHJcblx0XCJkYXJra2hha2lcIjogWzE4OSwgMTgzLCAxMDddLFxyXG5cdFwiZGFya21hZ2VudGFcIjogWzEzOSwgMCwgMTM5XSxcclxuXHRcImRhcmtvbGl2ZWdyZWVuXCI6IFs4NSwgMTA3LCA0N10sXHJcblx0XCJkYXJrb3JhbmdlXCI6IFsyNTUsIDE0MCwgMF0sXHJcblx0XCJkYXJrb3JjaGlkXCI6IFsxNTMsIDUwLCAyMDRdLFxyXG5cdFwiZGFya3JlZFwiOiBbMTM5LCAwLCAwXSxcclxuXHRcImRhcmtzYWxtb25cIjogWzIzMywgMTUwLCAxMjJdLFxyXG5cdFwiZGFya3NlYWdyZWVuXCI6IFsxNDMsIDE4OCwgMTQzXSxcclxuXHRcImRhcmtzbGF0ZWJsdWVcIjogWzcyLCA2MSwgMTM5XSxcclxuXHRcImRhcmtzbGF0ZWdyYXlcIjogWzQ3LCA3OSwgNzldLFxyXG5cdFwiZGFya3NsYXRlZ3JleVwiOiBbNDcsIDc5LCA3OV0sXHJcblx0XCJkYXJrdHVycXVvaXNlXCI6IFswLCAyMDYsIDIwOV0sXHJcblx0XCJkYXJrdmlvbGV0XCI6IFsxNDgsIDAsIDIxMV0sXHJcblx0XCJkZWVwcGlua1wiOiBbMjU1LCAyMCwgMTQ3XSxcclxuXHRcImRlZXBza3libHVlXCI6IFswLCAxOTEsIDI1NV0sXHJcblx0XCJkaW1ncmF5XCI6IFsxMDUsIDEwNSwgMTA1XSxcclxuXHRcImRpbWdyZXlcIjogWzEwNSwgMTA1LCAxMDVdLFxyXG5cdFwiZG9kZ2VyYmx1ZVwiOiBbMzAsIDE0NCwgMjU1XSxcclxuXHRcImZpcmVicmlja1wiOiBbMTc4LCAzNCwgMzRdLFxyXG5cdFwiZmxvcmFsd2hpdGVcIjogWzI1NSwgMjUwLCAyNDBdLFxyXG5cdFwiZm9yZXN0Z3JlZW5cIjogWzM0LCAxMzksIDM0XSxcclxuXHRcImZ1Y2hzaWFcIjogWzI1NSwgMCwgMjU1XSxcclxuXHRcImdhaW5zYm9yb1wiOiBbMjIwLCAyMjAsIDIyMF0sXHJcblx0XCJnaG9zdHdoaXRlXCI6IFsyNDgsIDI0OCwgMjU1XSxcclxuXHRcImdvbGRcIjogWzI1NSwgMjE1LCAwXSxcclxuXHRcImdvbGRlbnJvZFwiOiBbMjE4LCAxNjUsIDMyXSxcclxuXHRcImdyYXlcIjogWzEyOCwgMTI4LCAxMjhdLFxyXG5cdFwiZ3JlZW5cIjogWzAsIDEyOCwgMF0sXHJcblx0XCJncmVlbnllbGxvd1wiOiBbMTczLCAyNTUsIDQ3XSxcclxuXHRcImdyZXlcIjogWzEyOCwgMTI4LCAxMjhdLFxyXG5cdFwiaG9uZXlkZXdcIjogWzI0MCwgMjU1LCAyNDBdLFxyXG5cdFwiaG90cGlua1wiOiBbMjU1LCAxMDUsIDE4MF0sXHJcblx0XCJpbmRpYW5yZWRcIjogWzIwNSwgOTIsIDkyXSxcclxuXHRcImluZGlnb1wiOiBbNzUsIDAsIDEzMF0sXHJcblx0XCJpdm9yeVwiOiBbMjU1LCAyNTUsIDI0MF0sXHJcblx0XCJraGFraVwiOiBbMjQwLCAyMzAsIDE0MF0sXHJcblx0XCJsYXZlbmRlclwiOiBbMjMwLCAyMzAsIDI1MF0sXHJcblx0XCJsYXZlbmRlcmJsdXNoXCI6IFsyNTUsIDI0MCwgMjQ1XSxcclxuXHRcImxhd25ncmVlblwiOiBbMTI0LCAyNTIsIDBdLFxyXG5cdFwibGVtb25jaGlmZm9uXCI6IFsyNTUsIDI1MCwgMjA1XSxcclxuXHRcImxpZ2h0Ymx1ZVwiOiBbMTczLCAyMTYsIDIzMF0sXHJcblx0XCJsaWdodGNvcmFsXCI6IFsyNDAsIDEyOCwgMTI4XSxcclxuXHRcImxpZ2h0Y3lhblwiOiBbMjI0LCAyNTUsIDI1NV0sXHJcblx0XCJsaWdodGdvbGRlbnJvZHllbGxvd1wiOiBbMjUwLCAyNTAsIDIxMF0sXHJcblx0XCJsaWdodGdyYXlcIjogWzIxMSwgMjExLCAyMTFdLFxyXG5cdFwibGlnaHRncmVlblwiOiBbMTQ0LCAyMzgsIDE0NF0sXHJcblx0XCJsaWdodGdyZXlcIjogWzIxMSwgMjExLCAyMTFdLFxyXG5cdFwibGlnaHRwaW5rXCI6IFsyNTUsIDE4MiwgMTkzXSxcclxuXHRcImxpZ2h0c2FsbW9uXCI6IFsyNTUsIDE2MCwgMTIyXSxcclxuXHRcImxpZ2h0c2VhZ3JlZW5cIjogWzMyLCAxNzgsIDE3MF0sXHJcblx0XCJsaWdodHNreWJsdWVcIjogWzEzNSwgMjA2LCAyNTBdLFxyXG5cdFwibGlnaHRzbGF0ZWdyYXlcIjogWzExOSwgMTM2LCAxNTNdLFxyXG5cdFwibGlnaHRzbGF0ZWdyZXlcIjogWzExOSwgMTM2LCAxNTNdLFxyXG5cdFwibGlnaHRzdGVlbGJsdWVcIjogWzE3NiwgMTk2LCAyMjJdLFxyXG5cdFwibGlnaHR5ZWxsb3dcIjogWzI1NSwgMjU1LCAyMjRdLFxyXG5cdFwibGltZVwiOiBbMCwgMjU1LCAwXSxcclxuXHRcImxpbWVncmVlblwiOiBbNTAsIDIwNSwgNTBdLFxyXG5cdFwibGluZW5cIjogWzI1MCwgMjQwLCAyMzBdLFxyXG5cdFwibWFnZW50YVwiOiBbMjU1LCAwLCAyNTVdLFxyXG5cdFwibWFyb29uXCI6IFsxMjgsIDAsIDBdLFxyXG5cdFwibWVkaXVtYXF1YW1hcmluZVwiOiBbMTAyLCAyMDUsIDE3MF0sXHJcblx0XCJtZWRpdW1ibHVlXCI6IFswLCAwLCAyMDVdLFxyXG5cdFwibWVkaXVtb3JjaGlkXCI6IFsxODYsIDg1LCAyMTFdLFxyXG5cdFwibWVkaXVtcHVycGxlXCI6IFsxNDcsIDExMiwgMjE5XSxcclxuXHRcIm1lZGl1bXNlYWdyZWVuXCI6IFs2MCwgMTc5LCAxMTNdLFxyXG5cdFwibWVkaXVtc2xhdGVibHVlXCI6IFsxMjMsIDEwNCwgMjM4XSxcclxuXHRcIm1lZGl1bXNwcmluZ2dyZWVuXCI6IFswLCAyNTAsIDE1NF0sXHJcblx0XCJtZWRpdW10dXJxdW9pc2VcIjogWzcyLCAyMDksIDIwNF0sXHJcblx0XCJtZWRpdW12aW9sZXRyZWRcIjogWzE5OSwgMjEsIDEzM10sXHJcblx0XCJtaWRuaWdodGJsdWVcIjogWzI1LCAyNSwgMTEyXSxcclxuXHRcIm1pbnRjcmVhbVwiOiBbMjQ1LCAyNTUsIDI1MF0sXHJcblx0XCJtaXN0eXJvc2VcIjogWzI1NSwgMjI4LCAyMjVdLFxyXG5cdFwibW9jY2FzaW5cIjogWzI1NSwgMjI4LCAxODFdLFxyXG5cdFwibmF2YWpvd2hpdGVcIjogWzI1NSwgMjIyLCAxNzNdLFxyXG5cdFwibmF2eVwiOiBbMCwgMCwgMTI4XSxcclxuXHRcIm9sZGxhY2VcIjogWzI1MywgMjQ1LCAyMzBdLFxyXG5cdFwib2xpdmVcIjogWzEyOCwgMTI4LCAwXSxcclxuXHRcIm9saXZlZHJhYlwiOiBbMTA3LCAxNDIsIDM1XSxcclxuXHRcIm9yYW5nZVwiOiBbMjU1LCAxNjUsIDBdLFxyXG5cdFwib3JhbmdlcmVkXCI6IFsyNTUsIDY5LCAwXSxcclxuXHRcIm9yY2hpZFwiOiBbMjE4LCAxMTIsIDIxNF0sXHJcblx0XCJwYWxlZ29sZGVucm9kXCI6IFsyMzgsIDIzMiwgMTcwXSxcclxuXHRcInBhbGVncmVlblwiOiBbMTUyLCAyNTEsIDE1Ml0sXHJcblx0XCJwYWxldHVycXVvaXNlXCI6IFsxNzUsIDIzOCwgMjM4XSxcclxuXHRcInBhbGV2aW9sZXRyZWRcIjogWzIxOSwgMTEyLCAxNDddLFxyXG5cdFwicGFwYXlhd2hpcFwiOiBbMjU1LCAyMzksIDIxM10sXHJcblx0XCJwZWFjaHB1ZmZcIjogWzI1NSwgMjE4LCAxODVdLFxyXG5cdFwicGVydVwiOiBbMjA1LCAxMzMsIDYzXSxcclxuXHRcInBpbmtcIjogWzI1NSwgMTkyLCAyMDNdLFxyXG5cdFwicGx1bVwiOiBbMjIxLCAxNjAsIDIyMV0sXHJcblx0XCJwb3dkZXJibHVlXCI6IFsxNzYsIDIyNCwgMjMwXSxcclxuXHRcInB1cnBsZVwiOiBbMTI4LCAwLCAxMjhdLFxyXG5cdFwicmViZWNjYXB1cnBsZVwiOiBbMTAyLCA1MSwgMTUzXSxcclxuXHRcInJlZFwiOiBbMjU1LCAwLCAwXSxcclxuXHRcInJvc3licm93blwiOiBbMTg4LCAxNDMsIDE0M10sXHJcblx0XCJyb3lhbGJsdWVcIjogWzY1LCAxMDUsIDIyNV0sXHJcblx0XCJzYWRkbGVicm93blwiOiBbMTM5LCA2OSwgMTldLFxyXG5cdFwic2FsbW9uXCI6IFsyNTAsIDEyOCwgMTE0XSxcclxuXHRcInNhbmR5YnJvd25cIjogWzI0NCwgMTY0LCA5Nl0sXHJcblx0XCJzZWFncmVlblwiOiBbNDYsIDEzOSwgODddLFxyXG5cdFwic2Vhc2hlbGxcIjogWzI1NSwgMjQ1LCAyMzhdLFxyXG5cdFwic2llbm5hXCI6IFsxNjAsIDgyLCA0NV0sXHJcblx0XCJzaWx2ZXJcIjogWzE5MiwgMTkyLCAxOTJdLFxyXG5cdFwic2t5Ymx1ZVwiOiBbMTM1LCAyMDYsIDIzNV0sXHJcblx0XCJzbGF0ZWJsdWVcIjogWzEwNiwgOTAsIDIwNV0sXHJcblx0XCJzbGF0ZWdyYXlcIjogWzExMiwgMTI4LCAxNDRdLFxyXG5cdFwic2xhdGVncmV5XCI6IFsxMTIsIDEyOCwgMTQ0XSxcclxuXHRcInNub3dcIjogWzI1NSwgMjUwLCAyNTBdLFxyXG5cdFwic3ByaW5nZ3JlZW5cIjogWzAsIDI1NSwgMTI3XSxcclxuXHRcInN0ZWVsYmx1ZVwiOiBbNzAsIDEzMCwgMTgwXSxcclxuXHRcInRhblwiOiBbMjEwLCAxODAsIDE0MF0sXHJcblx0XCJ0ZWFsXCI6IFswLCAxMjgsIDEyOF0sXHJcblx0XCJ0aGlzdGxlXCI6IFsyMTYsIDE5MSwgMjE2XSxcclxuXHRcInRvbWF0b1wiOiBbMjU1LCA5OSwgNzFdLFxyXG5cdFwidHVycXVvaXNlXCI6IFs2NCwgMjI0LCAyMDhdLFxyXG5cdFwidmlvbGV0XCI6IFsyMzgsIDEzMCwgMjM4XSxcclxuXHRcIndoZWF0XCI6IFsyNDUsIDIyMiwgMTc5XSxcclxuXHRcIndoaXRlXCI6IFsyNTUsIDI1NSwgMjU1XSxcclxuXHRcIndoaXRlc21va2VcIjogWzI0NSwgMjQ1LCAyNDVdLFxyXG5cdFwieWVsbG93XCI6IFsyNTUsIDI1NSwgMF0sXHJcblx0XCJ5ZWxsb3dncmVlblwiOiBbMTU0LCAyMDUsIDUwXVxyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZsYWcsIGFyZ3YgPSBwcm9jZXNzLmFyZ3YpID0+IHtcblx0Y29uc3QgcHJlZml4ID0gZmxhZy5zdGFydHNXaXRoKCctJykgPyAnJyA6IChmbGFnLmxlbmd0aCA9PT0gMSA/ICctJyA6ICctLScpO1xuXHRjb25zdCBwb3NpdGlvbiA9IGFyZ3YuaW5kZXhPZihwcmVmaXggKyBmbGFnKTtcblx0Y29uc3QgdGVybWluYXRvclBvc2l0aW9uID0gYXJndi5pbmRleE9mKCctLScpO1xuXHRyZXR1cm4gcG9zaXRpb24gIT09IC0xICYmICh0ZXJtaW5hdG9yUG9zaXRpb24gPT09IC0xIHx8IHBvc2l0aW9uIDwgdGVybWluYXRvclBvc2l0aW9uKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJyk7XG5jb25zdCB0dHkgPSByZXF1aXJlKCd0dHknKTtcbmNvbnN0IGhhc0ZsYWcgPSByZXF1aXJlKCdoYXMtZmxhZycpO1xuXG5jb25zdCB7ZW52fSA9IHByb2Nlc3M7XG5cbmxldCBmb3JjZUNvbG9yO1xuaWYgKGhhc0ZsYWcoJ25vLWNvbG9yJykgfHxcblx0aGFzRmxhZygnbm8tY29sb3JzJykgfHxcblx0aGFzRmxhZygnY29sb3I9ZmFsc2UnKSB8fFxuXHRoYXNGbGFnKCdjb2xvcj1uZXZlcicpKSB7XG5cdGZvcmNlQ29sb3IgPSAwO1xufSBlbHNlIGlmIChoYXNGbGFnKCdjb2xvcicpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9ycycpIHx8XG5cdGhhc0ZsYWcoJ2NvbG9yPXRydWUnKSB8fFxuXHRoYXNGbGFnKCdjb2xvcj1hbHdheXMnKSkge1xuXHRmb3JjZUNvbG9yID0gMTtcbn1cblxuaWYgKCdGT1JDRV9DT0xPUicgaW4gZW52KSB7XG5cdGlmIChlbnYuRk9SQ0VfQ09MT1IgPT09ICd0cnVlJykge1xuXHRcdGZvcmNlQ29sb3IgPSAxO1xuXHR9IGVsc2UgaWYgKGVudi5GT1JDRV9DT0xPUiA9PT0gJ2ZhbHNlJykge1xuXHRcdGZvcmNlQ29sb3IgPSAwO1xuXHR9IGVsc2Uge1xuXHRcdGZvcmNlQ29sb3IgPSBlbnYuRk9SQ0VfQ09MT1IubGVuZ3RoID09PSAwID8gMSA6IE1hdGgubWluKHBhcnNlSW50KGVudi5GT1JDRV9DT0xPUiwgMTApLCAzKTtcblx0fVxufVxuXG5mdW5jdGlvbiB0cmFuc2xhdGVMZXZlbChsZXZlbCkge1xuXHRpZiAobGV2ZWwgPT09IDApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGxldmVsLFxuXHRcdGhhc0Jhc2ljOiB0cnVlLFxuXHRcdGhhczI1NjogbGV2ZWwgPj0gMixcblx0XHRoYXMxNm06IGxldmVsID49IDNcblx0fTtcbn1cblxuZnVuY3Rpb24gc3VwcG9ydHNDb2xvcihoYXZlU3RyZWFtLCBzdHJlYW1Jc1RUWSkge1xuXHRpZiAoZm9yY2VDb2xvciA9PT0gMCkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0aWYgKGhhc0ZsYWcoJ2NvbG9yPTE2bScpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9ZnVsbCcpIHx8XG5cdFx0aGFzRmxhZygnY29sb3I9dHJ1ZWNvbG9yJykpIHtcblx0XHRyZXR1cm4gMztcblx0fVxuXG5cdGlmIChoYXNGbGFnKCdjb2xvcj0yNTYnKSkge1xuXHRcdHJldHVybiAyO1xuXHR9XG5cblx0aWYgKGhhdmVTdHJlYW0gJiYgIXN0cmVhbUlzVFRZICYmIGZvcmNlQ29sb3IgPT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0Y29uc3QgbWluID0gZm9yY2VDb2xvciB8fCAwO1xuXG5cdGlmIChlbnYuVEVSTSA9PT0gJ2R1bWInKSB7XG5cdFx0cmV0dXJuIG1pbjtcblx0fVxuXG5cdGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG5cdFx0Ly8gV2luZG93cyAxMCBidWlsZCAxMDU4NiBpcyB0aGUgZmlyc3QgV2luZG93cyByZWxlYXNlIHRoYXQgc3VwcG9ydHMgMjU2IGNvbG9ycy5cblx0XHQvLyBXaW5kb3dzIDEwIGJ1aWxkIDE0OTMxIGlzIHRoZSBmaXJzdCByZWxlYXNlIHRoYXQgc3VwcG9ydHMgMTZtL1RydWVDb2xvci5cblx0XHRjb25zdCBvc1JlbGVhc2UgPSBvcy5yZWxlYXNlKCkuc3BsaXQoJy4nKTtcblx0XHRpZiAoXG5cdFx0XHROdW1iZXIob3NSZWxlYXNlWzBdKSA+PSAxMCAmJlxuXHRcdFx0TnVtYmVyKG9zUmVsZWFzZVsyXSkgPj0gMTA1ODZcblx0XHQpIHtcblx0XHRcdHJldHVybiBOdW1iZXIob3NSZWxlYXNlWzJdKSA+PSAxNDkzMSA/IDMgOiAyO1xuXHRcdH1cblxuXHRcdHJldHVybiAxO1xuXHR9XG5cblx0aWYgKCdDSScgaW4gZW52KSB7XG5cdFx0aWYgKFsnVFJBVklTJywgJ0NJUkNMRUNJJywgJ0FQUFZFWU9SJywgJ0dJVExBQl9DSScsICdHSVRIVUJfQUNUSU9OUycsICdCVUlMREtJVEUnXS5zb21lKHNpZ24gPT4gc2lnbiBpbiBlbnYpIHx8IGVudi5DSV9OQU1FID09PSAnY29kZXNoaXAnKSB7XG5cdFx0XHRyZXR1cm4gMTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbWluO1xuXHR9XG5cblx0aWYgKCdURUFNQ0lUWV9WRVJTSU9OJyBpbiBlbnYpIHtcblx0XHRyZXR1cm4gL14oOVxcLigwKlsxLTldXFxkKilcXC58XFxkezIsfVxcLikvLnRlc3QoZW52LlRFQU1DSVRZX1ZFUlNJT04pID8gMSA6IDA7XG5cdH1cblxuXHRpZiAoZW52LkNPTE9SVEVSTSA9PT0gJ3RydWVjb2xvcicpIHtcblx0XHRyZXR1cm4gMztcblx0fVxuXG5cdGlmICgnVEVSTV9QUk9HUkFNJyBpbiBlbnYpIHtcblx0XHRjb25zdCB2ZXJzaW9uID0gcGFyc2VJbnQoKGVudi5URVJNX1BST0dSQU1fVkVSU0lPTiB8fCAnJykuc3BsaXQoJy4nKVswXSwgMTApO1xuXG5cdFx0c3dpdGNoIChlbnYuVEVSTV9QUk9HUkFNKSB7XG5cdFx0XHRjYXNlICdpVGVybS5hcHAnOlxuXHRcdFx0XHRyZXR1cm4gdmVyc2lvbiA+PSAzID8gMyA6IDI7XG5cdFx0XHRjYXNlICdBcHBsZV9UZXJtaW5hbCc6XG5cdFx0XHRcdHJldHVybiAyO1xuXHRcdFx0Ly8gTm8gZGVmYXVsdFxuXHRcdH1cblx0fVxuXG5cdGlmICgvLTI1Nihjb2xvcik/JC9pLnRlc3QoZW52LlRFUk0pKSB7XG5cdFx0cmV0dXJuIDI7XG5cdH1cblxuXHRpZiAoL15zY3JlZW58Xnh0ZXJtfF52dDEwMHxednQyMjB8XnJ4dnR8Y29sb3J8YW5zaXxjeWd3aW58bGludXgvaS50ZXN0KGVudi5URVJNKSkge1xuXHRcdHJldHVybiAxO1xuXHR9XG5cblx0aWYgKCdDT0xPUlRFUk0nIGluIGVudikge1xuXHRcdHJldHVybiAxO1xuXHR9XG5cblx0cmV0dXJuIG1pbjtcbn1cblxuZnVuY3Rpb24gZ2V0U3VwcG9ydExldmVsKHN0cmVhbSkge1xuXHRjb25zdCBsZXZlbCA9IHN1cHBvcnRzQ29sb3Ioc3RyZWFtLCBzdHJlYW0gJiYgc3RyZWFtLmlzVFRZKTtcblx0cmV0dXJuIHRyYW5zbGF0ZUxldmVsKGxldmVsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHN1cHBvcnRzQ29sb3I6IGdldFN1cHBvcnRMZXZlbCxcblx0c3Rkb3V0OiB0cmFuc2xhdGVMZXZlbChzdXBwb3J0c0NvbG9yKHRydWUsIHR0eS5pc2F0dHkoMSkpKSxcblx0c3RkZXJyOiB0cmFuc2xhdGVMZXZlbChzdXBwb3J0c0NvbG9yKHRydWUsIHR0eS5pc2F0dHkoMikpKVxufTtcbiIsIi8qKlxuICogQGZpbGUgICAgICBEZXZTZXR0aW5ncy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCAqIGFzIERldlNldHRpbmdzIGZyb20gXCIuLi8uLi8uLi9Db25maWd1cmF0aW9uL0RldmVsb3BtZW50L0RldlNldHRpbmdzLmpzb25cIjtcbmltcG9ydCB0eXBlIHsgRkRldlNldHRpbmdzIH0gZnJvbSBcIi4vRGV2U2V0dGluZ3MuVHlwZXNcIjtcblxuZXhwb3J0IGNvbnN0IEdldERldlNldHRpbmdzID0gKCk6IEZEZXZTZXR0aW5ncyA9Plxue1xuICAgIGNvbnN0IHsgJHNjaGVtYTogXywgLi4uU2V0dGluZ3MgfSA9IERldlNldHRpbmdzO1xuICAgIHJldHVybiBTZXR0aW5ncyBhcyBGRGV2U2V0dGluZ3M7XG59O1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIExvZy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbmltcG9ydCB0eXBlIHtcbiAgICBGTG9nRnJvbnRlbmRUb2tlbnMsXG4gICAgRkxvZ0Z1bmN0aW9uLFxuICAgIEZMb2dTZXR0aW5ncyxcbiAgICBGTG9nZ2VyLFxuICAgIEZMb2dnZXJJbnRlcmltIH0gZnJvbSBcIi4uLy4uLy4uL1NoYXJlZFwiO1xuaW1wb3J0IHR5cGUgeyBGTG9nSGFuZGxlciwgRlNob3J0VGltZXN0YW1wIH0gZnJvbSBcIi4vTG9nLlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZMb2dMZXZlbCwgRkxvZ09yaWdpbkludGVybmFsIH0gZnJvbSBcIkBzb3JyZWxsL3dtLXdpbmRvd3NcIjtcbmltcG9ydCB7IEZvcm1hdCwgRm9ybWF0QmFzZTY0U3RyaW5nLCBGb3JtYXRJbmxpbmUgfSBmcm9tIFwiLi9Mb2dGb3JtYXRcIjtcbmltcG9ydCBDaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCB0eXBlIHsgRkxvZ1ZhbHVlVHlwZSB9IGZyb20gXCIuL0xvZ0Zvcm1hdC5UeXBlc1wiO1xuaW1wb3J0IHsgR2V0RGV2U2V0dGluZ3MgfSBmcm9tIFwiIy9EZXZlbG9wbWVudC9EZXZTZXR0aW5nc1wiO1xuaW1wb3J0IFV0aWwgZnJvbSBcInV0aWxcIjtcblxuQ2hhbGsubGV2ZWwgPSAzO1xuXG5jb25zdCBMb2dTZXR0aW5nczogRkxvZ1NldHRpbmdzID0gR2V0RGV2U2V0dGluZ3MoKS5Mb2c7XG5cbmZ1bmN0aW9uIEZvcm1hdENhdGVnb3J5KENhdGVnb3J5OiBzdHJpbmcpOiBzdHJpbmdcbntcbiAgICB0eXBlIEZSZ2IgPSBSZWNvcmQ8XCJSZWRcIiB8IFwiR3JlZW5cIiB8IFwiQmx1ZVwiLCBudW1iZXI+O1xuXG4gICAgY29uc3QgSGFzaFN0cmluZ1RvQmFja2dyb3VuZENvbG9yID0gKElucHV0OiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICB7XG4gICAgICAgIGxldCBIYXNoVmFsdWU6IG51bWJlciA9IDIxNjYxMzYyNjE7XG5cbiAgICAgICAgZm9yIChsZXQgSW5kZXg6IG51bWJlciA9IDA7IEluZGV4IDwgSW5wdXQubGVuZ3RoOyBJbmRleCsrKVxuICAgICAgICB7XG4gICAgICAgICAgICBIYXNoVmFsdWUgXj0gSW5wdXQuY2hhckNvZGVBdChJbmRleCk7XG4gICAgICAgICAgICBIYXNoVmFsdWUgPSBNYXRoLmltdWwoSGFzaFZhbHVlLCAxNjc3NzYxOSk7XG4gICAgICAgIH1cblxuICAgICAgICBIYXNoVmFsdWUgPj4+PSAwO1xuXG4gICAgICAgIGNvbnN0IEh1ZTogbnVtYmVyID0gSGFzaFZhbHVlICUgMzYwO1xuICAgICAgICBjb25zdCBTYXR1cmF0aW9uOiBudW1iZXIgPSA1OCArICgoSGFzaFZhbHVlID4+PiA4KSAlIDIzKTtcblxuICAgICAgICBsZXQgTGlnaHRuZXNzOiBudW1iZXIgPSAyNiArICgoSGFzaFZhbHVlID4+PiAxNikgJSAxMik7XG5cbiAgICAgICAgbGV0IFJnYkNvbG9yOiBGUmdiID0gQ29udmVydEhzbFRvUmdiKEh1ZSwgU2F0dXJhdGlvbiAvIDEwMCwgTGlnaHRuZXNzIC8gMTAwKTtcblxuICAgICAgICBjb25zdCBTaG91bGRBZGp1c3RSZ2JDb2xvciA9ICgpOiBib29sZWFuID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgQ2FsY3VsYXRlQ29udHJhc3RSYXRpb1dpdGhXaGl0ZShSZ2JDb2xvci5SZWQsIFJnYkNvbG9yLkdyZWVuLCBSZ2JDb2xvci5CbHVlKSA8IDQuNSAmJlxuICAgICAgICAgICAgICAgIExpZ2h0bmVzcyA+IDEyXG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuXG4gICAgICAgIHdoaWxlIChTaG91bGRBZGp1c3RSZ2JDb2xvcigpKVxuICAgICAgICB7XG4gICAgICAgICAgICBMaWdodG5lc3MtLTtcbiAgICAgICAgICAgIFJnYkNvbG9yID0gQ29udmVydEhzbFRvUmdiKEh1ZSwgU2F0dXJhdGlvbiAvIDEwMCwgTGlnaHRuZXNzIC8gMTAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBDb252ZXJ0UmdiVG9IZXhDb2xvcihSZ2JDb2xvci5SZWQsIFJnYkNvbG9yLkdyZWVuLCBSZ2JDb2xvci5CbHVlKTtcbiAgICB9O1xuXG4gICAgY29uc3QgQ29udmVydEhzbFRvUmdiID0gKEh1ZTogbnVtYmVyLCBTYXR1cmF0aW9uOiBudW1iZXIsIExpZ2h0bmVzczogbnVtYmVyKTogRlJnYiA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgQ2hyb21hOiBudW1iZXIgPSAoMSAtIE1hdGguYWJzKDIgKiBMaWdodG5lc3MgLSAxKSkgKiBTYXR1cmF0aW9uO1xuICAgICAgICBjb25zdCBIdWVQcmltZTogbnVtYmVyID0gSHVlIC8gNjA7XG4gICAgICAgIGNvbnN0IFNlY29uZENvbXBvbmVudDogbnVtYmVyID0gQ2hyb21hICogKDEgLSBNYXRoLmFicygoSHVlUHJpbWUgJSAyKSAtIDEpKTtcbiAgICAgICAgY29uc3QgTWF0Y2hWYWx1ZTogbnVtYmVyID0gTGlnaHRuZXNzIC0gQ2hyb21hIC8gMjtcblxuICAgICAgICBsZXQgUmVkUHJpbWU6IG51bWJlciA9IDA7XG4gICAgICAgIGxldCBHcmVlblByaW1lOiBudW1iZXIgPSAwO1xuICAgICAgICBsZXQgQmx1ZVByaW1lOiBudW1iZXIgPSAwO1xuXG4gICAgICAgIGlmIChIdWVQcmltZSA+PSAwICYmIEh1ZVByaW1lIDwgMSlcbiAgICAgICAge1xuICAgICAgICAgICAgUmVkUHJpbWUgPSBDaHJvbWE7XG4gICAgICAgICAgICBHcmVlblByaW1lID0gU2Vjb25kQ29tcG9uZW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEh1ZVByaW1lID49IDEgJiYgSHVlUHJpbWUgPCAyKVxuICAgICAgICB7XG4gICAgICAgICAgICBSZWRQcmltZSA9IFNlY29uZENvbXBvbmVudDtcbiAgICAgICAgICAgIEdyZWVuUHJpbWUgPSBDaHJvbWE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoSHVlUHJpbWUgPj0gMiAmJiBIdWVQcmltZSA8IDMpXG4gICAgICAgIHtcbiAgICAgICAgICAgIEdyZWVuUHJpbWUgPSBDaHJvbWE7XG4gICAgICAgICAgICBCbHVlUHJpbWUgPSBTZWNvbmRDb21wb25lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoSHVlUHJpbWUgPj0gMyAmJiBIdWVQcmltZSA8IDQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIEdyZWVuUHJpbWUgPSBTZWNvbmRDb21wb25lbnQ7XG4gICAgICAgICAgICBCbHVlUHJpbWUgPSBDaHJvbWE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoSHVlUHJpbWUgPj0gNCAmJiBIdWVQcmltZSA8IDUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFJlZFByaW1lID0gU2Vjb25kQ29tcG9uZW50O1xuICAgICAgICAgICAgQmx1ZVByaW1lID0gQ2hyb21hO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgUmVkUHJpbWUgPSBDaHJvbWE7XG4gICAgICAgICAgICBCbHVlUHJpbWUgPSBTZWNvbmRDb21wb25lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgQmx1ZTogTWF0aC5yb3VuZCgoQmx1ZVByaW1lICsgTWF0Y2hWYWx1ZSkgKiAyNTUpLFxuICAgICAgICAgICAgR3JlZW46IE1hdGgucm91bmQoKEdyZWVuUHJpbWUgKyBNYXRjaFZhbHVlKSAqIDI1NSksXG4gICAgICAgICAgICBSZWQ6IE1hdGgucm91bmQoKFJlZFByaW1lICsgTWF0Y2hWYWx1ZSkgKiAyNTUpXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGNvbnN0IENhbGN1bGF0ZUNvbnRyYXN0UmF0aW9XaXRoV2hpdGUgPSAoUmVkOiBudW1iZXIsIEdyZWVuOiBudW1iZXIsIEJsdWU6IG51bWJlcik6IG51bWJlciA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgUmVsYXRpdmVMdW1pbmFuY2U6IG51bWJlciA9IENhbGN1bGF0ZVNyZ2JSZWxhdGl2ZUx1bWluYW5jZShSZWQsIEdyZWVuLCBCbHVlKTtcblxuICAgICAgICByZXR1cm4gKDEuMCArIDAuMDUpIC8gKFJlbGF0aXZlTHVtaW5hbmNlICsgMC4wNSk7XG4gICAgfTtcblxuICAgIGNvbnN0IENhbGN1bGF0ZVNyZ2JSZWxhdGl2ZUx1bWluYW5jZSA9IChSZWQ6IG51bWJlciwgR3JlZW46IG51bWJlciwgQmx1ZTogbnVtYmVyKTogbnVtYmVyID0+XG4gICAge1xuICAgICAgICBjb25zdCBSZWRDaGFubmVsOiBudW1iZXIgPSBDb252ZXJ0U3JnYkNoYW5uZWxUb0xpbmVhcihSZWQgLyAyNTUpO1xuICAgICAgICBjb25zdCBHcmVlbkNoYW5uZWw6IG51bWJlciA9IENvbnZlcnRTcmdiQ2hhbm5lbFRvTGluZWFyKEdyZWVuIC8gMjU1KTtcbiAgICAgICAgY29uc3QgQmx1ZUNoYW5uZWw6IG51bWJlciA9IENvbnZlcnRTcmdiQ2hhbm5lbFRvTGluZWFyKEJsdWUgLyAyNTUpO1xuXG4gICAgICAgIHJldHVybiAwLjIxMjYgKiBSZWRDaGFubmVsICsgMC43MTUyICogR3JlZW5DaGFubmVsICsgMC4wNzIyICogQmx1ZUNoYW5uZWw7XG4gICAgfTtcblxuICAgIGNvbnN0IENvbnZlcnRTcmdiQ2hhbm5lbFRvTGluZWFyID0gKENoYW5uZWw6IG51bWJlcik6IG51bWJlciA9PlxuICAgIHtcbiAgICAgICAgaWYgKENoYW5uZWwgPD0gMC4wNDA0NSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIENoYW5uZWwgLyAxMi45MjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBNYXRoLnBvdygoQ2hhbm5lbCArIDAuMDU1KSAvIDEuMDU1LCAyLjQpO1xuICAgIH07XG5cbiAgICBjb25zdCBDb252ZXJ0UmdiVG9IZXhDb2xvciA9IChSZWQ6IG51bWJlciwgR3JlZW46IG51bWJlciwgQmx1ZTogbnVtYmVyKTogc3RyaW5nID0+XG4gICAge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgXCIjXCIgK1xuICAgICAgICAgICAgQ29udmVydEJ5dGVUb0hleChSZWQpICtcbiAgICAgICAgICAgIENvbnZlcnRCeXRlVG9IZXgoR3JlZW4pICtcbiAgICAgICAgICAgIENvbnZlcnRCeXRlVG9IZXgoQmx1ZSlcbiAgICAgICAgKTtcbiAgICB9O1xuXG4gICAgY29uc3QgQ29udmVydEJ5dGVUb0hleCA9IChWYWx1ZTogbnVtYmVyKTogc3RyaW5nID0+XG4gICAge1xuICAgICAgICByZXR1cm4gVmFsdWUudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKS50b1VwcGVyQ2FzZSgpO1xuICAgIH07XG5cbiAgICByZXR1cm4gQ2hhbGsuaGV4KFwiI0ZGRkZGRlwiKS5iZ0hleChIYXNoU3RyaW5nVG9CYWNrZ3JvdW5kQ29sb3IoQ2F0ZWdvcnkpKShgICR7IENhdGVnb3J5IH0gYCk7XG59O1xuXG4vLyBjb25zdCBGb3JtYXRDYXRlZ29yeUJhc2ljID0gKENhdGVnb3J5OiBzdHJpbmcpOiBzdHJpbmcgPT5cbi8vIHtcbi8vICAgICBjb25zdCBQYWRkZWRDYXRlZ29yeTogc3RyaW5nID0gYCAkeyBDYXRlZ29yeSB9IGA7XG4vLyAgICAgbGV0IEhhc2hWYWx1ZTogbnVtYmVyID0gMDtcbi8vICAgICBmb3IgKGxldCBJbmRleDogbnVtYmVyID0gMDsgSW5kZXggPCBDYXRlZ29yeS5sZW5ndGg7IEluZGV4KyspXG4vLyAgICAge1xuLy8gICAgICAgICBIYXNoVmFsdWUgPSAoSGFzaFZhbHVlIDw8IDUpIC0gSGFzaFZhbHVlICsgUGFkZGVkQ2F0ZWdvcnkuY2hhckNvZGVBdChJbmRleCk7XG4vLyAgICAgICAgIEhhc2hWYWx1ZSB8PSAwO1xuLy8gICAgIH1cblxuLy8gICAgIGNvbnN0IEJhY2tncm91bmRDb2xvcnM6IFRBcnJheTxGQ2hhbGtCYWNrZ3JvdW5kPiA9XG4vLyAgICAgW1xuLy8gICAgICAgICBcImJnQmxhY2tcIixcbi8vICAgICAgICAgXCJiZ1JlZFwiLFxuLy8gICAgICAgICBcImJnR3JlZW5cIixcbi8vICAgICAgICAgXCJiZ1llbGxvd1wiLFxuLy8gICAgICAgICBcImJnQmx1ZVwiLFxuLy8gICAgICAgICBcImJnTWFnZW50YVwiLFxuLy8gICAgICAgICBcImJnQ3lhblwiLFxuLy8gICAgICAgICBcImJnV2hpdGVcIixcbi8vICAgICAgICAgXCJiZ0dyYXlcIixcbi8vICAgICAgICAgXCJiZ0dyZXlcIlxuLy8gICAgIF07XG5cbi8vICAgICBjb25zdCBIYXNoZWRJbmRleDogbnVtYmVyID0gTWF0aC5hYnMoSGFzaFZhbHVlKSAlIEJhY2tncm91bmRDb2xvcnMubGVuZ3RoO1xuXG4vLyAgICAgY29uc3QgU2VsZWN0ZWRCYWNrZ3JvdW5kOiBGQ2hhbGtCYWNrZ3JvdW5kID0gQmFja2dyb3VuZENvbG9yc1tIYXNoZWRJbmRleF07XG5cbi8vICAgICBjb25zdCBCcmlnaHRCYWNrZ3JvdW5kczogVEFycmF5PEZDaGFsa0JhY2tncm91bmQ+ID1cbi8vICAgICBbXG4vLyAgICAgICAgIFwiYmdXaGl0ZVwiLFxuLy8gICAgICAgICBcImJnWWVsbG93XCIsXG4vLyAgICAgICAgIFwiYmdDeWFuXCIsXG4vLyAgICAgICAgIFwiYmdHcmF5XCIsXG4vLyAgICAgICAgIFwiYmdHcmV5XCJcbi8vICAgICBdO1xuXG4vLyAgICAgY29uc3QgSXNCcmlnaHQ6IGJvb2xlYW4gPSBCcmlnaHRCYWNrZ3JvdW5kcy5pbmNsdWRlcyhTZWxlY3RlZEJhY2tncm91bmQpO1xuXG4vLyAgICAgY29uc3QgRm9yZWdyb3VuZENvbG9yOiBGQ2hhbGtGb3JlZ3JvdW5kID0gSXNCcmlnaHQgPyBcImJsYWNrXCIgOiBcIndoaXRlQnJpZ2h0XCI7XG5cbi8vICAgICAvKiBAdHMtZXhwZWN0LWVycm9yIFR5cGUgc2FmZXR5IGhlbGwsIHVzaW5nIHVuaW9uIHR5cGVzIHRoYXQgbWl4IGZ1bmN0aW9ucyB3aXRoIG9iamVjdHMuICovXG4vLyAgICAgcmV0dXJuIENoYWxrW1NlbGVjdGVkQmFja2dyb3VuZF1bRm9yZWdyb3VuZENvbG9yXShQYWRkZWRDYXRlZ29yeSk7XG4vLyB9O1xuXG5mdW5jdGlvbiBGb3JtYXRMZXZlbChMZXZlbDogRkxvZ0xldmVsKTogc3RyaW5nXG57XG4gICAgY29uc3QgQ29sb3JzOiBSZWNvcmQ8RkxvZ0xldmVsLCAoVGV4dDogc3RyaW5nKSA9PiBzdHJpbmc+ID1cbiAgICB7XG4gICAgICAgIEVycm9yOiBDaGFsay5iZ1JlZEJyaWdodC53aGl0ZUJyaWdodCxcbiAgICAgICAgTm9ybWFsOiBDaGFsay5iZ0dyYXksXG4gICAgICAgIFZlcmJvc2U6IENoYWxrLmJnQ3lhbi53aGl0ZUJyaWdodCxcbiAgICAgICAgV2FybjogQ2hhbGsuYmdZZWxsb3cud2hpdGVCcmlnaHRcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBDb2xvcnNbTGV2ZWxdICE9PSBcImZ1bmN0aW9uXCIpXG4gICAge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbG9yc1tMZXZlbF0gaXMgJHsgTGV2ZWwgfS5gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gQ29sb3JzW0xldmVsXShgICR7IExldmVsIH0gYCk7XG59O1xuXG5jb25zdCBEaXNhYmxlZENhdGVnb3JpZXNBdHRlbXB0ZWQ6IHR5cGVvZiBMb2dTZXR0aW5ncy5DYXRlZ29yeS5EaXNhYmxlZENhdGVnb3JpZXMgPVxue1xuICAgIFwiKlwiOiBbIF0sXG4gICAgQmFja2VuZDogWyBdLFxuICAgIEZyb250ZW5kOiBbIF0sXG4gICAgTmF0aXZlOiBbIF1cbn07XG5cbmZ1bmN0aW9uIExvZ0ludGVybmFsKFxuICAgIE9yaWdpbjogRkxvZ09yaWdpbkludGVybmFsLFxuICAgIENhdGVnb3J5OiBzdHJpbmcsXG4gICAgTGV2ZWw6IEZMb2dMZXZlbCxcbiAgICAuLi5Bcmd1bWVudHM6IFRBcnJheTx1bmtub3duPlxuKTogdm9pZFxue1xuXG4gICAgaWYgKE9yaWdpbiAhPT0gXCJNZXRhXCIpXG4gICAge1xuICAgICAgICBjb25zdCBEaXNhYmxlZENhdGVnb3JpZXM6IFRBcnJheTxzdHJpbmc+ID1cbiAgICAgICAgW1xuICAgICAgICAgICAgLi4uTG9nU2V0dGluZ3MuQ2F0ZWdvcnkuRGlzYWJsZWRDYXRlZ29yaWVzW09yaWdpbl0sXG4gICAgICAgICAgICAuLi5Mb2dTZXR0aW5ncy5DYXRlZ29yeS5EaXNhYmxlZENhdGVnb3JpZXNbXCIqXCJdXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgU2hvdWxkTG9nR2l2ZW5TdGF0ZW1lbnRzOiBib29sZWFuID0gIShDYXRlZ29yeSBpbiBEaXNhYmxlZENhdGVnb3JpZXMpO1xuICAgICAgICBpZiAoIVNob3VsZExvZ0dpdmVuU3RhdGVtZW50cylcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgSXNDYXRlZ29yeURpc2FibGVkVW5pdmVyc2FsbHk6IGJvb2xlYW4gPVxuICAgICAgICAgICAgICAgIENhdGVnb3J5IGluIExvZ1NldHRpbmdzLkNhdGVnb3J5LkRpc2FibGVkQ2F0ZWdvcmllc1tcIipcIl07XG5cbiAgICAgICAgICAgIGNvbnN0IEF0dGVtcHRlZENhdGVnb3JpZXM6IFRBcnJheTxzdHJpbmc+ID0gSXNDYXRlZ29yeURpc2FibGVkVW5pdmVyc2FsbHlcbiAgICAgICAgICAgICAgICA/IFtcbiAgICAgICAgICAgICAgICAgICAgLi4uRGlzYWJsZWRDYXRlZ29yaWVzQXR0ZW1wdGVkW09yaWdpbl0sXG4gICAgICAgICAgICAgICAgICAgIC4uLkRpc2FibGVkQ2F0ZWdvcmllc0F0dGVtcHRlZFtcIipcIl1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgOiBEaXNhYmxlZENhdGVnb3JpZXNBdHRlbXB0ZWRbT3JpZ2luXTtcblxuICAgICAgICAgICAgY29uc3QgU2hvdWxkTG9nRGlzYWJsZWRDYXRlZ29yeTogYm9vbGVhbiA9IChcbiAgICAgICAgICAgICAgICBMb2dTZXR0aW5ncy5DYXRlZ29yeS5Mb2dEaXNhYmxlZENhdGVnb3J5QXR0ZW1wdHMgJiZcbiAgICAgICAgICAgICAgICAhQXR0ZW1wdGVkQ2F0ZWdvcmllcy5pbmNsdWRlcyhDYXRlZ29yeSlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmIChTaG91bGRMb2dEaXNhYmxlZENhdGVnb3J5KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIERpc2FibGVkQ2F0ZWdvcmllc0F0dGVtcHRlZFtJc0NhdGVnb3J5RGlzYWJsZWRVbml2ZXJzYWxseSA/IFwiKlwiIDogT3JpZ2luXS5wdXNoKENhdGVnb3J5KTtcbiAgICAgICAgICAgICAgICBMb2dJbnRlcm5hbChcbiAgICAgICAgICAgICAgICAgICAgXCJNZXRhXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiTG9nXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiTm9ybWFsXCIsXG4gICAgICAgICAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAc3R5bGlzdGljL21heC1sZW4gKi9cbiAgICAgICAgICAgICAgICAgICAgYFRoZSBjYXRlZ29yeSBcIiR7IENhdGVnb3J5IH1cIiB3YXMgbG9nZ2VkIGFib3V0LCBmcm9tICR7IE9yaWdpbiB9IGNvZGUuICBGdXJ0aGVyIGF0dGVtcHRzIHRvIGxvZyB0aGlzIGNhdGVnb3J5IGZyb20gdGhpcyBvcmlnaW4gd2lsbCBub3QgYmUgcmVwb3J0ZWQuYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IE9yaWdpbkVtb2ppTWFwOiBSZWNvcmQ8RkxvZ09yaWdpbkludGVybmFsLCBzdHJpbmc+ID1cbiAgICB7XG4gICAgICAgIEJhY2tlbmQ6IFwizrtcIixcbiAgICAgICAgRnJvbnRlbmQ6IFwixpJcIixcbiAgICAgICAgTWV0YTogXCLil4hcIixcbiAgICAgICAgTmF0aXZlOiBcIs+RXCJcbiAgICB9O1xuXG4gICAgY29uc3QgT3JpZ2luRW1vamk6IHN0cmluZyA9IE9yaWdpbkVtb2ppTWFwW09yaWdpbl07XG5cbiAgICBjb25zdCBGb3JtYXR0ZWRBcmd1bWVudHM6IFRBcnJheTxzdHJpbmc+ID0gQXJndW1lbnRzLm1hcCgoQXJndW1lbnQ6IHVua25vd24pOiBzdHJpbmcgPT5cbiAgICB7XG4gICAgICAgIHJldHVybiBVdGlsLmZvcm1hdChBcmd1bWVudCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBHZXRPdXRTdGF0ZW1lbnRzID0gKCk6IHN0cmluZyA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgT3V0U3RhdGVtZW50c0FycmF5OiBUQXJyYXk8c3RyaW5nPiA9XG4gICAgICAgIFtcbiAgICAgICAgICAgIENoYWxrLmJnSGV4KFwiI0FBQUFBQVwiKS53aGl0ZShgICR7IE9yaWdpbkVtb2ppIH0gYCksXG4gICAgICAgICAgICBGb3JtYXRMZXZlbChMZXZlbCksXG4gICAgICAgICAgICBGb3JtYXRDYXRlZ29yeShDYXRlZ29yeSksXG4gICAgICAgICAgICBcIiBcIixcbiAgICAgICAgICAgIC4uLkZvcm1hdHRlZEFyZ3VtZW50c1xuICAgICAgICBdO1xuXG4gICAgICAgIGNvbnN0IE91dFN0YXRlbWVudHNCYXNlOiBzdHJpbmcgPSBPdXRTdGF0ZW1lbnRzQXJyYXkuam9pbihcIlwiKTtcblxuICAgICAgICBpZiAoTG9nU2V0dGluZ3MuU2l6ZS5MaW1pdFN0YXRlbWVudExlbmd0aC5FbmFibGVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBQcmVmaXhMZW5ndGg6IG51bWJlciA9IE91dFN0YXRlbWVudHNBcnJheS5zbGljZSgwLCA0KS5yZWR1Y2UoXG4gICAgICAgICAgICAgICAgKFRvdGFsTGVuZ3RoOiBudW1iZXIsIFN0YXRlbWVudDogc3RyaW5nKTogbnVtYmVyID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVG90YWxMZW5ndGggKyAoU3RhdGVtZW50Py5sZW5ndGggPz8gMCk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG5cbiAgICAgICAgICAgIGNvbnN0IFRvdGFsTGVuZ3RoOiBudW1iZXIgPSBQcmVmaXhMZW5ndGggKyBMb2dTZXR0aW5ncy5TaXplLkxpbWl0U3RhdGVtZW50TGVuZ3RoLk1heExlbmd0aDtcblxuICAgICAgICAgICAgcmV0dXJuIE91dFN0YXRlbWVudHNCYXNlLnNsaWNlKDAsIFRvdGFsTGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBPdXRTdGF0ZW1lbnRzQmFzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBTdHJlYW06IE5vZGVKUy5Xcml0ZVN0cmVhbSA9IExldmVsID09PSBcIkVycm9yXCJcbiAgICAgICAgPyBwcm9jZXNzLnN0ZGVyclxuICAgICAgICA6IHByb2Nlc3Muc3Rkb3V0O1xuXG4gICAgU3RyZWFtLndyaXRlKEdldE91dFN0YXRlbWVudHMoKSArIFwiXFxuXCIpO1xufVxuXG4vKiogVGhpcyBzaG91bGQgb25seSBiZSB1c2VkIHdoZW4gcmVnaXN0ZXJpbmcgdGhlIExvZyBldmVudC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBMb2dGcm9udGVuZChcbiAgICBDYXRlZ29yeTogc3RyaW5nLFxuICAgIExldmVsOiBGTG9nTGV2ZWwsXG4gICAgLi4uU3RhdGVtZW50czogVEFycmF5PHVua25vd24+XG4pOiB2b2lkXG57XG4gICAgY29uc3QgUGFyc2UgPSAoU3RhdGVtZW50OiB1bmtub3duKTogdW5rbm93biA9PlxuICAgIHtcbiAgICAgICAgaWYgKHR5cGVvZiBTdGF0ZW1lbnQgPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IFBhcnNlZE9iamVjdDogdW5rbm93biA9IEpTT04ucGFyc2UoU3RhdGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIFBhcnNlZE9iamVjdCA9PT0gXCJvYmplY3RcIilcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQYXJzZWRPYmplY3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTdGF0ZW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFycyAqL1xuICAgICAgICAgICAgY2F0Y2ggKF9FcnJvcjogdW5rbm93bilcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RhdGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIFN0YXRlbWVudDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBTdGF0ZW1lbnRzVW50b2tlbml6ZWQ6IFRBcnJheTx1bmtub3duPiA9IFN0YXRlbWVudHMubWFwKFBhcnNlKS5tYXAoSGFuZGxlRnJvbnRlbmRUb2tlbnMpO1xuXG4gICAgTG9nSW50ZXJuYWwoXCJGcm9udGVuZFwiLCBDYXRlZ29yeSwgTGV2ZWwsIC4uLlN0YXRlbWVudHNVbnRva2VuaXplZCk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gR2V0VGltZSgpOiBGU2hvcnRUaW1lc3RhbXBcbntcbiAgICBjb25zdCBOb3c6IERhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgY29uc3QgTWludXRlczogc3RyaW5nID0gTm93XG4gICAgICAgIC5nZXRNaW51dGVzKClcbiAgICAgICAgLnRvU3RyaW5nKClcbiAgICAgICAgLnBhZFN0YXJ0KDIsIFwiMFwiKTtcblxuICAgIGNvbnN0IFNlY29uZHM6IHN0cmluZyA9IE5vd1xuICAgICAgICAuZ2V0U2Vjb25kcygpXG4gICAgICAgIC50b1N0cmluZygpXG4gICAgICAgIC5wYWRTdGFydCgyLCBcIjBcIik7XG5cbiAgICBjb25zdCBNaWxsaXNlY29uZHM6IHN0cmluZyA9IE5vd1xuICAgICAgICAuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICAgICAgLnRvU3RyaW5nKClcbiAgICAgICAgLnBhZFN0YXJ0KDMsIFwiMFwiKTtcblxuICAgIHJldHVybiBgJHsgTWludXRlcyB9OiR7IFNlY29uZHMgfS4keyBNaWxsaXNlY29uZHMgfWA7XG59O1xuXG5jb25zdCBGcm9udGVuZFRva2VuczogUmVhZG9ubHk8UmVjb3JkPEZMb2dGcm9udGVuZFRva2VucywgKCkgPT4gc3RyaW5nPj4gPVxue1xuICAgIF9fR2V0VGltZV9fOiBHZXRUaW1lXG59IGFzIGNvbnN0O1xuXG5mdW5jdGlvbiBIYW5kbGVGcm9udGVuZFRva2VucyhTdGF0ZW1lbnQ6IHVua25vd24pOiB1bmtub3duXG57XG4gICAgY29uc3QgSXNGcm9udGVuZFRva2VuID0gKEluOiB1bmtub3duKTogSW4gaXMgRkxvZ0Zyb250ZW5kVG9rZW5zID0+XG4gICAge1xuICAgICAgICBpZiAodHlwZW9mIEluID09PSBcInN0cmluZ1wiKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoRnJvbnRlbmRUb2tlbnMpLmluY2x1ZGVzKEluKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoSXNGcm9udGVuZFRva2VuKFN0YXRlbWVudCkpXG4gICAge1xuICAgICAgICByZXR1cm4gRnJvbnRlbmRUb2tlbnNbU3RhdGVtZW50XSgpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICByZXR1cm4gU3RhdGVtZW50O1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIEhhbmRsZUFsd2F5c0FwcGx5Rm9ybWF0KFN0YXRlbWVudDogdW5rbm93biwgU3RhdGVtZW50czogVEFycmF5PHVua25vd24+KTogdW5rbm93blxue1xuICAgIGlmIChMb2dTZXR0aW5ncy5Gb3JtYXQuQWx3YXlzQXBwbHlGb3JtYXQpXG4gICAge1xuICAgICAgICBpZiAodHlwZW9mIFN0YXRlbWVudCA9PT0gXCJzdHJpbmdcIiAmJiBTdGF0ZW1lbnRzLmxlbmd0aCA9PT0gMSlcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIFN0YXRlbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgU3RhdGVtZW50ID09PSBcIm9iamVjdFwiKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gRm9ybWF0KFN0YXRlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gRm9ybWF0SW5saW5lKFN0YXRlbWVudCBhcyBGTG9nVmFsdWVUeXBlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICByZXR1cm4gU3RhdGVtZW50O1xuICAgIH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5kbGVCYXNlNjRTdHJpbmdzKFN0YXRlbWVudDogdW5rbm93biwgX1N0YXRlbWVudHM6IFRBcnJheTx1bmtub3duPik6IHVua25vd25cbntcbiAgICBpZiAodHlwZW9mIFN0YXRlbWVudCA9PT0gXCJzdHJpbmdcIiAmJiAhTG9nU2V0dGluZ3MuRm9ybWF0LkFsd2F5c0FwcGx5Rm9ybWF0KVxuICAgIHtcbiAgICAgICAgcmV0dXJuIEZvcm1hdEJhc2U2NFN0cmluZyhTdGF0ZW1lbnQpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICByZXR1cm4gU3RhdGVtZW50O1xuICAgIH1cbn07XG5cbi8qKiBVc2UgdGhpcyB0byBjcmVhdGUgYSBsb2dnZXIgd2l0aGluIGEgZ2l2ZW4gbW9kdWxlIHNvIHRoYXQgdGhlIGxvZyBjYXRlZ29yeSBpcyBzZXQgZm9yIHRoYXQgbW9kdWxlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIEdldExvZ2dlcihDYXRlZ29yeTogc3RyaW5nKTogRkxvZ2dlclxue1xuICAgIGNvbnN0IE1ha2VMb2dnZXJJbnRlcm5hbCA9IChMZXZlbDogRkxvZ0xldmVsKTogRkxvZ0Z1bmN0aW9uID0+XG4gICAge1xuICAgICAgICByZXR1cm4gKC4uLlN0YXRlbWVudHM6IFRBcnJheTx1bmtub3duPik6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgLy8gY29uc3QgSXNTaW1wbGU6IGJvb2xlYW4gPSBTdGF0ZW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgU3RhdGVtZW50c1sxXSA9PT0gXCJzdHJpbmdcIjtcbiAgICAgICAgICAgIHR5cGUgRlN0YXRlbWVudFR1cGxlID0gWyB1bmtub3duLCBUQXJyYXk8dW5rbm93bj4gXTtcblxuICAgICAgICAgICAgY29uc3QgTXVsdGlNYXAgPSAoXG4gICAgICAgICAgICAgICAgSW5BcnJheTogVEFycmF5PHVua25vd24+LFxuICAgICAgICAgICAgICAgIC4uLkhhbmRsZXJzOiBUQXJyYXk8RkxvZ0hhbmRsZXI+XG4gICAgICAgICAgICApOiBUQXJyYXk8dW5rbm93bj4gPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsZXQgT3V0OiBUQXJyYXk8RlN0YXRlbWVudFR1cGxlPiA9IEluQXJyYXkubWFwKChTdGF0ZW1lbnQ6IHVua25vd24pOiBGU3RhdGVtZW50VHVwbGUgPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbIFN0YXRlbWVudCwgU3RhdGVtZW50cyBdO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgSGFuZGxlcnMuZm9yRWFjaCgoSGFuZGxlcjogRkxvZ0hhbmRsZXIpOiB2b2lkID0+XG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBPdXQgPSBPdXQubWFwKChbIFN0YXRlbWVudCwgU3RhdGVtZW50cyBdOiBGU3RhdGVtZW50VHVwbGUpOiBGU3RhdGVtZW50VHVwbGUgPT5cbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgSGFuZGxlcihTdGF0ZW1lbnQsIFN0YXRlbWVudHMpLCBTdGF0ZW1lbnRzIF07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIE91dC5tYXAoKFsgU3RhdGVtZW50IF06IEZTdGF0ZW1lbnRUdXBsZSk6IHVua25vd24gPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBTdGF0ZW1lbnQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBjb25zdCBGb3JtYXR0ZWRTdGF0ZW1lbnRzOiBUQXJyYXk8dW5rbm93bj4gPSBTdGF0ZW1lbnRzO1xuICAgICAgICAgICAgY29uc3QgRm9ybWF0dGVkU3RhdGVtZW50czogVEFycmF5PHVua25vd24+ID0gTXVsdGlNYXAoXG4gICAgICAgICAgICAgICAgU3RhdGVtZW50cyxcbiAgICAgICAgICAgICAgICBIYW5kbGVCYXNlNjRTdHJpbmdzLFxuICAgICAgICAgICAgICAgIEhhbmRsZUFsd2F5c0FwcGx5Rm9ybWF0XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBjb25zdCBGb3JtYXR0ZWRTdGF0ZW1lbnRzOiBUQXJyYXk8dW5rbm93bj4gPVxuICAgICAgICAgICAgLy8gICAgIElzU2ltcGxlXG4gICAgICAgICAgICAvLyAgICAgICAgID8gU3RhdGVtZW50c1xuICAgICAgICAgICAgLy8gICAgICAgICA6IExvZ1NldHRpbmdzLkZvcm1hdC5BbHdheXNBcHBseUZvcm1hdFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgPyAoU3RhdGVtZW50cyBhcyBUQXJyYXk8RkxvZ1ZhbHVlVHlwZT4pLm1hcCgoU3RhdGVtZW50OiBGTG9nVmFsdWVUeXBlKTogc3RyaW5nID0+XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBTdGF0ZW1lbnQgPT09IFwib2JqZWN0XCIpXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICByZXR1cm4gRm9ybWF0KFN0YXRlbWVudCk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJldHVybiBGb3JtYXRJbmxpbmUoU3RhdGVtZW50KTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgOiBTdGF0ZW1lbnRzO1xuICAgICAgICAgICAgLy8gICAgIC8vIDogRm9ybWF0dGVycy5tYXAoKEZvcm1hdHRlcjogRkxvZ0Zvcm1hdEZ1bmN0aW9uKTogdW5rbm93biA9PlxuICAgICAgICAgICAgLy8gICAgIC8vIHtcbiAgICAgICAgICAgIC8vICAgICAvLyAgICAgcmV0dXJuIFN0YXRlbWVudHMubWFwKEZvcm1hdHRlcik7XG4gICAgICAgICAgICAvLyAgICAgLy8gfSkuZmxhdCgyMCk7XG5cbiAgICAgICAgICAgIGNvbnN0IFNwYWNlZE91dFN0YXRlbWVudHM6IFRBcnJheTx1bmtub3duPiA9XG4gICAgICAgICAgICAgICAgRm9ybWF0dGVkU3RhdGVtZW50cy5mbGF0TWFwKChTdGF0ZW1lbnQ6IHVua25vd24pOiBUQXJyYXk8dW5rbm93bj4gPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbIFN0YXRlbWVudCwgXCIgXCIgXTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgTG9nSW50ZXJuYWwoXCJCYWNrZW5kXCIsIENhdGVnb3J5LCBMZXZlbCwgLi4uU3BhY2VkT3V0U3RhdGVtZW50cyk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGNvbnN0IExvZ2dlcjogRkxvZ2dlckludGVyaW0gPSBNYWtlTG9nZ2VySW50ZXJuYWwoXCJOb3JtYWxcIik7XG4gICAgTG9nZ2VyLkVycm9yID0gTWFrZUxvZ2dlckludGVybmFsKFwiRXJyb3JcIik7XG4gICAgTG9nZ2VyLlZlcmJvc2UgPSBNYWtlTG9nZ2VySW50ZXJuYWwoXCJWZXJib3NlXCIpO1xuICAgIExvZ2dlci5XYXJuID0gTWFrZUxvZ2dlckludGVybmFsKFwiV2FyblwiKTtcblxuICAgIHJldHVybiBMb2dnZXIgYXMgRkxvZ2dlcjtcbn1cbiIsIi8qKlxuICogQGZpbGUgICAgICBMb2dVdGlsaXR5LnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUge1xuICAgIEZBcnJheVR5cGVOYW1lLFxuICAgIEZDb250YWluZXJUeXBlLFxuICAgIEZEZWxpbWl0ZXJTdGFydFN0cmluZyxcbiAgICBGRGVsaW1pdGVycyxcbiAgICBGS2V5VmFsdWVQYWlyLFxuICAgIEZMb2dBcnJheSxcbiAgICBGTG9nTWFwLFxuICAgIEZMb2dSZWNvcmQsXG4gICAgRkxvZ1NldCxcbiAgICBGTG9nU3RyaW5nLFxuICAgIEZMb2dTdHJpbmdBcnJheSxcbiAgICBGTG9nVmFsdWVUeXBlLFxuICAgIEZNYXAsXG4gICAgRlByaW1pdGl2ZSxcbiAgICBGUmVjb3JkLFxuICAgIEZUeXBlb2YsXG4gICAgRlNldFR5cGVOYW1lLFxuICAgIFRMb2dDb250YWluZXIsXG4gICAgVExvZ1ByaW1pdGl2ZSxcbiAgICBUTG9nVmFsdWVcbn0gZnJvbSBcIi4vTG9nRm9ybWF0LlR5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IEZMb2dEaWdpdFNlcGFyYXRvciwgRkxvZ1F1b3RlU3R5bGUsIEZMb2dTZXR0aW5ncyB9IGZyb20gXCIuLi8uLi8uLi9TaGFyZWRcIjtcbmltcG9ydCBDaGFsayBmcm9tIFwiY2hhbGtcIjtcbmltcG9ydCB7IEdldERldlNldHRpbmdzIH0gZnJvbSBcIiMvRGV2ZWxvcG1lbnQvRGV2U2V0dGluZ3NcIjtcbmltcG9ydCB7IElkZW50aXR5IH0gZnJvbSBcIkBzb3JyZWxsL3V0aWxpdGllcy9mdW5jdGlvbmFsXCI7XG5cbkNoYWxrLmxldmVsID0gMztcblxuY29uc3QgTG9nU2V0dGluZ3M6IEZMb2dTZXR0aW5ncyA9IEdldERldlNldHRpbmdzKCkuTG9nO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWZ1bmN0aW9uLXR5cGUgKi9cblxuY29uc3QgR2V0V2l0aG91dEFuc2kgPSAoSW46IHN0cmluZyk6IHN0cmluZyA9Plxue1xuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAc3R5bGlzdGljL21heC1sZW4sIG5vLWNvbnRyb2wtcmVnZXggKi9cbiAgICBjb25zdCBBbnNpRXNjYXBlU2VxdWVuY2VQYXR0ZXJuOiBSZWdFeHAgPSAvW1xcdTAwMUJcXHUwMDlCXVtbXFxdKCkjOz9dKig/Oig/Oig/OlthLXpBLVpcXGRdKig/OjtbYS16QS1aXFxkXSopKik/XFx1MDAwNyl8KD86KD86XFxkezEsNH0oPzo7XFxkezAsNH0pKik/W1xcZEEtUFItVFpjZi1ucS11eT0+PH5dKSkvZztcblxuICAgIHJldHVybiBJbi5yZXBsYWNlKEFuc2lFc2NhcGVTZXF1ZW5jZVBhdHRlcm4sIFwiXCIpO1xufTtcblxuY29uc3QgR2V0TGVuZ3RoID0gKEluOiBzdHJpbmcpOiBudW1iZXIgPT5cbntcbiAgICByZXR1cm4gR2V0V2l0aG91dEFuc2koSW4pLmxlbmd0aDtcbn07XG5cbmNvbnN0IFN0eWxlU3RyaW5nID0gKEluOiBzdHJpbmcpOiBzdHJpbmcgPT5cbntcbiAgICBjb25zdCBTdHlsZTogUmVjb3JkPEZMb2dRdW90ZVN0eWxlLCBzdHJpbmc+ID1cbiAgICB7XG4gICAgICAgIERvdWJsZTogYFwiJHsgSW4gfVwiYCxcbiAgICAgICAgTm9uZTogSW4sXG4gICAgICAgIFNpbmdsZTogYCckeyBJbiB9J2BcbiAgICB9O1xuXG4gICAgY29uc3QgQmFzZVN0cmluZzogc3RyaW5nID0gU3R5bGVbTG9nU2V0dGluZ3MuRm9ybWF0LlF1b3RlU3R5bGVdO1xuXG4gICAgcmV0dXJuIExvZ1NldHRpbmdzLkZvcm1hdC5Db2xvcnNcbiAgICAgICAgPyBDaGFsay5oZXgoXCIjQ0E1MDEwXCIpKEJhc2VTdHJpbmcpXG4gICAgICAgIDogQmFzZVN0cmluZztcbn07XG5cbmNvbnN0IFN0eWxlU3ltYm9sID0gKEluOiBzeW1ib2wpOiBzdHJpbmcgPT5cbntcbiAgICByZXR1cm4gTG9nU2V0dGluZ3MuRm9ybWF0LkNvbG9yc1xuICAgICAgICA/IENoYWxrLmhleChcIiMwMEI3QzNcIikoSW4udG9TdHJpbmcoKSlcbiAgICAgICAgOiBJbi50b1N0cmluZygpO1xufTtcblxuY29uc3QgU3R5bGVOdW1iZXIgPSAoSW46IGJpZ2ludCB8IG51bWJlcik6IHN0cmluZyA9Plxue1xuICAgIHJldHVybiBMb2dTZXR0aW5ncy5Gb3JtYXQuQ29sb3JzXG4gICAgICAgID8gQ2hhbGsuZ3JlZW4oRm9ybWF0RGlnaXRzKEluKSlcbiAgICAgICAgOiBGb3JtYXREaWdpdHMoSW4pO1xufTtcblxuY29uc3QgRm9ybWF0U3RyaW5nID0gKHsgRGVwdGgsIFZhbHVlIH06IFRMb2dQcmltaXRpdmU8c3RyaW5nPik6IEZMb2dTdHJpbmcgPT5cbntcbiAgICByZXR1cm4ge1xuICAgICAgICBEZXB0aCxcbiAgICAgICAgU3RyaW5nOiAoSXNCYXNlNjRTdHJpbmcoVmFsdWUpICYmIExvZ1NldHRpbmdzLkZvcm1hdC5UcnVuY2F0ZUJhc2U2NFN0cmluZ3MpXG4gICAgICAgICAgICA/IEZvcm1hdEJhc2U2NFN0cmluZyhWYWx1ZSlcbiAgICAgICAgICAgIDogU3R5bGVTdHJpbmcoVmFsdWUpXG4gICAgfTtcbn07XG5cbmNvbnN0IEZvcm1hdFN5bWJvbCA9ICh7IERlcHRoLCBWYWx1ZSB9OiBUTG9nUHJpbWl0aXZlPHN5bWJvbD4pOiBGTG9nU3RyaW5nID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGVwdGgsXG4gICAgICAgIFN0cmluZzogU3R5bGVTeW1ib2woVmFsdWUpXG4gICAgfTtcbn07XG5cbmNvbnN0IElubGluZSA9IChJbjogRkxvZ1N0cmluZ0FycmF5KTogRkxvZ1N0cmluZ0FycmF5ID0+XG57XG4gICAgY29uc3QgU2VhcmNoZWRJbmRpY2VzOiBSZWNvcmQ8RkRlbGltaXRlclN0YXJ0U3RyaW5nLCBUQXJyYXk8bnVtYmVyPj4gPVxuICAgIHtcbiAgICAgICAgXCI8XCI6IFsgXSxcbiAgICAgICAgXCJbXCI6IFsgXSxcbiAgICAgICAgXCJ7XCI6IFsgXVxuICAgIH07XG5cbiAgICBjb25zdCBSZWN1cnJlbmNlID0gKExvZ1N0cmluZ3M6IEZMb2dTdHJpbmdBcnJheSk6IEZMb2dTdHJpbmdBcnJheSA9PlxuICAgIHtcbiAgICAgICAgdHlwZSBGR2V0SW5uZXJtb3N0Q29udGFpbmVyUmV0dXJuVHlwZSA9XG4gICAgICAgICAgICB8IHVuZGVmaW5lZFxuICAgICAgICAgICAgfCB7XG4gICAgICAgICAgICAgICAgQ29udGFpbmVyOiBGTG9nU3RyaW5nQXJyYXk7XG4gICAgICAgICAgICAgICAgU3RhcnRTdWJBcnJheTogVEFycmF5PEZMb2dTdHJpbmc+O1xuICAgICAgICAgICAgICAgIFN0b3BTdWJBcnJheTogVEFycmF5PEZMb2dTdHJpbmc+O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBHZXRTdHJpbmcgPSAoSW5Mb2dTdHJpbmc6IEZMb2dTdHJpbmcpOiBzdHJpbmcgPT4gSW5Mb2dTdHJpbmcuU3RyaW5nO1xuICAgICAgICBjb25zdCBHZXRJbm5lcm1vc3RDb250YWluZXIgPSAoSW5Mb2dTdHJpbmdzOiBGTG9nU3RyaW5nQXJyYXkpOiBGR2V0SW5uZXJtb3N0Q29udGFpbmVyUmV0dXJuVHlwZSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBTdHJpbmdzOiBUQXJyYXk8c3RyaW5nPiA9IEluTG9nU3RyaW5ncy5tYXAoR2V0U3RyaW5nKTtcbiAgICAgICAgICAgIGNvbnN0IFN0YXJ0RGVsaW1pdGVyczogVEFycmF5PEZEZWxpbWl0ZXJTdGFydFN0cmluZz4gPSBbIFwiPFwiLCBcIltcIiwgXCJ7XCIgXTtcbiAgICAgICAgICAgIGNvbnN0IElubmVybW9zdFN0YXJ0SW5kZXg6IG51bWJlciA9IE1hdGgubWF4KC4uLlN0YXJ0RGVsaW1pdGVyc1xuICAgICAgICAgICAgICAgIC5tYXAoKFN0YXJ0RGVsaW1pdGVyOiBGRGVsaW1pdGVyU3RhcnRTdHJpbmcpOiBudW1iZXIgPT5cbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChTZWFyY2hlZEluZGljZXNbU3RhcnREZWxpbWl0ZXJdLmluY2x1ZGVzKC0xKSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgU3RvcFNlYXJjaEluZGV4OiBudW1iZXIgPSBNYXRoLm1pbiguLi5TZWFyY2hlZEluZGljZXNbU3RhcnREZWxpbWl0ZXJdKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBPdXQ6IG51bWJlciA9IFN0cmluZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zbGljZSgwLCBTdG9wU2VhcmNoSW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAubGFzdEluZGV4T2YoU3RhcnREZWxpbWl0ZXIpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChPdXQgPT09IC0xKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTZWFyY2hlZEluZGljZXNbU3RhcnREZWxpbWl0ZXJdLnB1c2goLTEpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE91dDtcbiAgICAgICAgICAgICAgICB9KS5mbGF0KDIwKSk7XG5cbiAgICAgICAgICAgIGlmIChJbm5lcm1vc3RTdGFydEluZGV4ID09PSAtMSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBTZWFyY2hlZEluZGljZXNbU3RyaW5nc1tJbm5lcm1vc3RTdGFydEluZGV4XSBhcyBGRGVsaW1pdGVyU3RhcnRTdHJpbmddLnB1c2goSW5uZXJtb3N0U3RhcnRJbmRleCk7XG5cbiAgICAgICAgICAgIGNvbnN0IEdldEZpcnN0SW5kZXhPZlZhbHVlQWZ0ZXJJbmRleCA9IDxUeXBlPihcbiAgICAgICAgICAgICAgICBWYWx1ZXM6IFJlYWRvbmx5PFRBcnJheTxUeXBlPj4sXG4gICAgICAgICAgICAgICAgVGFyZ2V0VmFsdWU6IFR5cGUsXG4gICAgICAgICAgICAgICAgQWZ0ZXJJbmRleDogbnVtYmVyXG4gICAgICAgICAgICApOiBudW1iZXIgfCB1bmRlZmluZWQgPT5cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBTdGFydEluZGV4OiBudW1iZXIgPSBNYXRoLm1pbihNYXRoLm1heChBZnRlckluZGV4ICsgMSwgMCksIFZhbHVlcy5sZW5ndGgpO1xuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgSW5kZXg6IG51bWJlciA9IFN0YXJ0SW5kZXg7IEluZGV4IDwgVmFsdWVzLmxlbmd0aDsgSW5kZXgrKylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QuaXMoVmFsdWVzW0luZGV4XSwgVGFyZ2V0VmFsdWUpKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgSW5uZXJtb3N0TG9nU3RyaW5nOiBGTG9nU3RyaW5nIHwgdW5kZWZpbmVkID0gSW5Mb2dTdHJpbmdzW0lubmVybW9zdFN0YXJ0SW5kZXhdO1xuICAgICAgICAgICAgaWYgKElubmVybW9zdExvZ1N0cmluZyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IElubmVybW9zdFN0YXJ0RGVsaW1pdGVyOiBzdHJpbmcgPSBJbm5lcm1vc3RMb2dTdHJpbmcuU3RyaW5nO1xuICAgICAgICAgICAgY29uc3QgSW5uZXJtb3N0U3RvcERlbGltaXRlcjogc3RyaW5nID1cbiAgICAgICAgICAgICAgICBJbm5lcm1vc3RTdGFydERlbGltaXRlciA9PT0gXCJ7XCJcbiAgICAgICAgICAgICAgICAgICAgPyBcIn1cIlxuICAgICAgICAgICAgICAgICAgICA6IElubmVybW9zdFN0YXJ0RGVsaW1pdGVyID09PSBcIjxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgPyBcIj5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgOiBcIl1cIjtcblxuICAgICAgICAgICAgY29uc3QgSW5uZXJtb3N0U3RvcEluZGV4OiBudW1iZXIgfCB1bmRlZmluZWQgPSBHZXRGaXJzdEluZGV4T2ZWYWx1ZUFmdGVySW5kZXgoXG4gICAgICAgICAgICAgICAgU3RyaW5ncyxcbiAgICAgICAgICAgICAgICBJbm5lcm1vc3RTdG9wRGVsaW1pdGVyLFxuICAgICAgICAgICAgICAgIElubmVybW9zdFN0YXJ0SW5kZXhcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmIChJbm5lcm1vc3RTdG9wSW5kZXggPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBJbm5lcm1vc3RDb250YWluZXI6IEZMb2dTdHJpbmdBcnJheSA9XG4gICAgICAgICAgICAgICAgSW5Mb2dTdHJpbmdzLnNsaWNlKElubmVybW9zdFN0YXJ0SW5kZXgsIElubmVybW9zdFN0b3BJbmRleCArIDEpIGFzIEZMb2dTdHJpbmdBcnJheTtcbiAgICAgICAgICAgIGNvbnN0IFN0b3BTdWJBcnJheTogVEFycmF5PEZMb2dTdHJpbmc+ID0gSW5Mb2dTdHJpbmdzLmxlbmd0aCA+PSBJbm5lcm1vc3RTdG9wSW5kZXggKyAxXG4gICAgICAgICAgICAgICAgPyBJbkxvZ1N0cmluZ3Muc2xpY2UoSW5uZXJtb3N0U3RvcEluZGV4ICsgMSwgdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIDogWyBdO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIENvbnRhaW5lcjogSW5uZXJtb3N0Q29udGFpbmVyLFxuICAgICAgICAgICAgICAgIFN0YXJ0U3ViQXJyYXk6IEluTG9nU3RyaW5ncy5zbGljZSgwLCBJbm5lcm1vc3RTdGFydEluZGV4KSxcbiAgICAgICAgICAgICAgICBTdG9wU3ViQXJyYXlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgU2hvdWxkSW5saW5lID0gKENvbnRhaW5lckxvZ1N0cmluZ3M6IEZMb2dTdHJpbmdBcnJheSk6IGJvb2xlYW4gPT5cbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgVG90YWxXaWR0aDogbnVtYmVyID1cbiAgICAgICAgICAgICAgICBDb250YWluZXJMb2dTdHJpbmdzWzBdLkRlcHRoICogTG9nU2V0dGluZ3MuU2l6ZS5UYWJXaWR0aCArXG4gICAgICAgICAgICAgICAgQ29udGFpbmVyTG9nU3RyaW5ncy5yZWR1Y2UoKEFjY3VtdWxhdG9yOiBudW1iZXIsIEN1cnJlbnRWYWx1ZTogRkxvZ1N0cmluZyk6IG51bWJlciA9PlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEFjY3VtdWxhdG9yICsgR2V0TGVuZ3RoKEN1cnJlbnRWYWx1ZS5TdHJpbmcpO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuXG4gICAgICAgICAgICByZXR1cm4gVG90YWxXaWR0aCA8PSBMb2dTZXR0aW5ncy5TaXplLk1heFRlcm1pbmFsV2lkdGg7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgSW5uZXJtb3N0Q29udGFpbmVyOiBGR2V0SW5uZXJtb3N0Q29udGFpbmVyUmV0dXJuVHlwZSA9IEdldElubmVybW9zdENvbnRhaW5lcihMb2dTdHJpbmdzKTtcbiAgICAgICAgaWYgKElubmVybW9zdENvbnRhaW5lciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCB7IENvbnRhaW5lciwgU3RhcnRTdWJBcnJheSwgU3RvcFN1YkFycmF5IH0gPSBJbm5lcm1vc3RDb250YWluZXI7XG4gICAgICAgICAgICBpZiAoU2hvdWxkSW5saW5lKElubmVybW9zdENvbnRhaW5lci5Db250YWluZXIpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IElubGluZWQ6IEZMb2dTdHJpbmcgPVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgRGVwdGg6IENvbnRhaW5lclswXS5EZXB0aCxcbiAgICAgICAgICAgICAgICAgICAgU3RyaW5nOiBDb250YWluZXIubWFwKEdldFN0cmluZykuam9pbihcIiBcIilcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBbIC4uLlN0YXJ0U3ViQXJyYXksIElubGluZWQsIC4uLlN0b3BTdWJBcnJheSBdIGFzIEZMb2dTdHJpbmdBcnJheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBMb2dTdHJpbmdzO1xuICAgIH07XG5cbiAgICBjb25zdCBTaG91bGRSZWN1ciA9ICgpOiBib29sZWFuID0+XG4gICAge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgIVNlYXJjaGVkSW5kaWNlc1tcIjxcIl0uaW5jbHVkZXMoLTEpIHx8XG4gICAgICAgICAgICAhU2VhcmNoZWRJbmRpY2VzW1wie1wiXS5pbmNsdWRlcygtMSkgfHxcbiAgICAgICAgICAgICFTZWFyY2hlZEluZGljZXNbXCJbXCJdLmluY2x1ZGVzKC0xKVxuICAgICAgICApO1xuICAgIH07XG5cbiAgICBsZXQgT3V0OiBGTG9nU3RyaW5nQXJyYXkgPSBbIC4uLkluIF07XG5cbiAgICB3aGlsZSAoU2hvdWxkUmVjdXIoKSlcbiAgICB7XG4gICAgICAgIE91dCA9IFJlY3VycmVuY2UoWyAuLi5PdXQgXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIE91dDtcbn07XG5cbmNvbnN0IEZvcm1hdERpZ2l0cyA9IChWYWx1ZTogbnVtYmVyIHwgYmlnaW50KTogc3RyaW5nID0+XG57XG4gICAgY29uc3QgU2VwYXJhdG9yczogUmVjb3JkPEZMb2dEaWdpdFNlcGFyYXRvciwgc3RyaW5nPiA9XG4gICAge1xuICAgICAgICBDb21tYTogXCIsXCIsXG4gICAgICAgIE5vbmU6IFwiXCIsXG4gICAgICAgIFNwYWNlOiBcIiBcIixcbiAgICAgICAgVW5kZXJzY29yZTogXCJfXCJcbiAgICB9O1xuXG4gICAgY29uc3QgU2VwYXJhdG9yOiBzdHJpbmcgPSBTZXBhcmF0b3JzW0xvZ1NldHRpbmdzLkZvcm1hdC5EaWdpdFNlcGFyYXRvcl07XG5cbiAgICBjb25zdCBHcm91cEludGVncmFsRGlnaXRzID0gKEludGVncmFsRGlnaXRzOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICB7XG4gICAgICAgIGlmIChJbnRlZ3JhbERpZ2l0cy5sZW5ndGggPD0gMylcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEludGVncmFsRGlnaXRzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgR3JvdXBzOiBUQXJyYXk8c3RyaW5nPiA9IFsgXTtcbiAgICAgICAgZm9yIChsZXQgSW5kZXg6IG51bWJlciA9IEludGVncmFsRGlnaXRzLmxlbmd0aDsgSW5kZXggPiAwOyBJbmRleCAtPSAzKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBTdGFydEluZGV4OiBudW1iZXIgPSBNYXRoLm1heCgwLCBJbmRleCAtIDMpO1xuICAgICAgICAgICAgR3JvdXBzLnB1c2goSW50ZWdyYWxEaWdpdHMuc2xpY2UoU3RhcnRJbmRleCwgSW5kZXgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIEdyb3Vwcy5yZXZlcnNlKCk7XG4gICAgICAgIHJldHVybiBHcm91cHMuam9pbihTZXBhcmF0b3IpO1xuICAgIH07XG5cbiAgICBjb25zdCBHcm91cEZyYWN0aW9uYWxEaWdpdHMgPSAoRnJhY3Rpb25hbERpZ2l0czogc3RyaW5nKTogc3RyaW5nID0+XG4gICAge1xuICAgICAgICBpZiAoRnJhY3Rpb25hbERpZ2l0cy5sZW5ndGggPD0gMylcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEZyYWN0aW9uYWxEaWdpdHM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBHcm91cHM6IFRBcnJheTxzdHJpbmc+ID0gW107XG4gICAgICAgIGZvciAobGV0IEluZGV4OiBudW1iZXIgPSAwOyBJbmRleCA8IEZyYWN0aW9uYWxEaWdpdHMubGVuZ3RoOyBJbmRleCArPSAzKVxuICAgICAgICB7XG4gICAgICAgICAgICBHcm91cHMucHVzaChGcmFjdGlvbmFsRGlnaXRzLnNsaWNlKEluZGV4LCBJbmRleCArIDMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBHcm91cHMuam9pbihTZXBhcmF0b3IpO1xuICAgIH07XG5cbiAgICBjb25zdCBDb252ZXJ0U2NpZW50aWZpY05vdGF0aW9uVG9QbGFpbkRlY2ltYWwgPSAoTnVtYmVyVGV4dDogc3RyaW5nKTogc3RyaW5nID0+XG4gICAge1xuICAgICAgICBjb25zdCBFeHBvbmVudE1hcmtlckluZGV4OiBudW1iZXIgPSBOdW1iZXJUZXh0LnNlYXJjaCgvW2VFXS8pO1xuICAgICAgICBpZiAoRXhwb25lbnRNYXJrZXJJbmRleCA9PT0gLTEpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXJUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgTWFudGlzc2FUZXh0OiBzdHJpbmcgPSBOdW1iZXJUZXh0LnNsaWNlKDAsIEV4cG9uZW50TWFya2VySW5kZXgpO1xuICAgICAgICBjb25zdCBFeHBvbmVudFRleHQ6IHN0cmluZyA9IE51bWJlclRleHQuc2xpY2UoRXhwb25lbnRNYXJrZXJJbmRleCArIDEpO1xuICAgICAgICBjb25zdCBFeHBvbmVudFZhbHVlOiBudW1iZXIgPSBOdW1iZXIoRXhwb25lbnRUZXh0KTtcblxuICAgICAgICBsZXQgU2lnblRleHQ6IHN0cmluZyA9IFwiXCI7XG4gICAgICAgIGxldCBVbnNpZ25lZE1hbnRpc3NhVGV4dDogc3RyaW5nID0gTWFudGlzc2FUZXh0O1xuXG4gICAgICAgIGlmIChVbnNpZ25lZE1hbnRpc3NhVGV4dC5zdGFydHNXaXRoKFwiLVwiKSlcbiAgICAgICAge1xuICAgICAgICAgICAgU2lnblRleHQgPSBcIi1cIjtcbiAgICAgICAgICAgIFVuc2lnbmVkTWFudGlzc2FUZXh0ID0gVW5zaWduZWRNYW50aXNzYVRleHQuc2xpY2UoMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoVW5zaWduZWRNYW50aXNzYVRleHQuc3RhcnRzV2l0aChcIitcIikpXG4gICAgICAgIHtcbiAgICAgICAgICAgIFVuc2lnbmVkTWFudGlzc2FUZXh0ID0gVW5zaWduZWRNYW50aXNzYVRleHQuc2xpY2UoMSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBEZWNpbWFsUG9pbnRJbmRleDogbnVtYmVyID0gVW5zaWduZWRNYW50aXNzYVRleHQuaW5kZXhPZihcIi5cIik7XG4gICAgICAgIGNvbnN0IERpZ2l0c09ubHk6IHN0cmluZyA9IFVuc2lnbmVkTWFudGlzc2FUZXh0LnJlcGxhY2UoXCIuXCIsIFwiXCIpO1xuICAgICAgICBjb25zdCBEaWdpdHNCZWZvcmVEZWNpbWFsOiBudW1iZXIgPSAoRGVjaW1hbFBvaW50SW5kZXggPT09IC0xKVxuICAgICAgICAgICAgPyBEaWdpdHNPbmx5Lmxlbmd0aFxuICAgICAgICAgICAgOiBEZWNpbWFsUG9pbnRJbmRleDtcblxuICAgICAgICBjb25zdCBOZXdEZWNpbWFsSW5kZXg6IG51bWJlciA9IERpZ2l0c0JlZm9yZURlY2ltYWwgKyBFeHBvbmVudFZhbHVlO1xuXG4gICAgICAgIGlmIChOZXdEZWNpbWFsSW5kZXggPD0gMClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgTGVhZGluZ1plcm9zQ291bnQ6IG51bWJlciA9IC1OZXdEZWNpbWFsSW5kZXg7XG4gICAgICAgICAgICByZXR1cm4gU2lnblRleHQgKyBcIjAuXCIgKyBcIjBcIi5yZXBlYXQoTGVhZGluZ1plcm9zQ291bnQpICsgRGlnaXRzT25seTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChOZXdEZWNpbWFsSW5kZXggPj0gRGlnaXRzT25seS5sZW5ndGgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IFRyYWlsaW5nWmVyb3NDb3VudDogbnVtYmVyID0gTmV3RGVjaW1hbEluZGV4IC0gRGlnaXRzT25seS5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm4gU2lnblRleHQgKyBEaWdpdHNPbmx5ICsgXCIwXCIucmVwZWF0KFRyYWlsaW5nWmVyb3NDb3VudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gU2lnblRleHQgKyBEaWdpdHNPbmx5LnNsaWNlKDAsIE5ld0RlY2ltYWxJbmRleCkgKyBcIi5cIiArIERpZ2l0c09ubHkuc2xpY2UoTmV3RGVjaW1hbEluZGV4KTtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBWYWx1ZSA9PT0gXCJiaWdpbnRcIilcbiAgICB7XG4gICAgICAgIGNvbnN0IElzTmVnYXRpdmU6IGJvb2xlYW4gPSBWYWx1ZSA8IDBuO1xuICAgICAgICBjb25zdCBBYnNvbHV0ZVZhbHVlOiBiaWdpbnQgPSBJc05lZ2F0aXZlID8gLVZhbHVlIDogVmFsdWU7XG5cbiAgICAgICAgY29uc3QgSW50ZWdyYWxEaWdpdHM6IHN0cmluZyA9IEFic29sdXRlVmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgY29uc3QgR3JvdXBlZEludGVncmFsRGlnaXRzOiBzdHJpbmcgPSBHcm91cEludGVncmFsRGlnaXRzKEludGVncmFsRGlnaXRzKTtcblxuICAgICAgICByZXR1cm4gKElzTmVnYXRpdmUgPyBcIi1cIiA6IFwiXCIpICsgR3JvdXBlZEludGVncmFsRGlnaXRzO1xuICAgIH1cblxuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKFZhbHVlKSlcbiAgICB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoVmFsdWUpO1xuICAgIH1cblxuICAgIGNvbnN0IElzTmVnYXRpdmU6IGJvb2xlYW4gPSBWYWx1ZSA8IDAgfHwgT2JqZWN0LmlzKFZhbHVlLCAtMCk7XG4gICAgY29uc3QgQWJzb2x1dGVWYWx1ZTogbnVtYmVyID0gTWF0aC5hYnMoVmFsdWUpO1xuXG4gICAgY29uc3QgUGxhaW5EZWNpbWFsVGV4dDogc3RyaW5nID0gQ29udmVydFNjaWVudGlmaWNOb3RhdGlvblRvUGxhaW5EZWNpbWFsKEFic29sdXRlVmFsdWUudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgUGFydHM6IFRBcnJheTxzdHJpbmc+ID0gUGxhaW5EZWNpbWFsVGV4dC5zcGxpdChcIi5cIik7XG4gICAgY29uc3QgSW50ZWdyYWxEaWdpdHM6IHN0cmluZyA9IFBhcnRzWzBdID8/IFwiMFwiO1xuICAgIGNvbnN0IEZyYWN0aW9uYWxEaWdpdHM6IHN0cmluZyB8IHVuZGVmaW5lZCA9IFBhcnRzWzFdO1xuXG4gICAgY29uc3QgR3JvdXBlZEludGVncmFsRGlnaXRzOiBzdHJpbmcgPSBHcm91cEludGVncmFsRGlnaXRzKEludGVncmFsRGlnaXRzKTtcblxuICAgIGlmIChGcmFjdGlvbmFsRGlnaXRzID09PSB1bmRlZmluZWQgfHwgRnJhY3Rpb25hbERpZ2l0cy5sZW5ndGggPT09IDApXG4gICAge1xuICAgICAgICByZXR1cm4gKElzTmVnYXRpdmUgPyBcIi1cIiA6IFwiXCIpICsgR3JvdXBlZEludGVncmFsRGlnaXRzO1xuICAgIH1cblxuICAgIGNvbnN0IEdyb3VwZWRGcmFjdGlvbmFsRGlnaXRzOiBzdHJpbmcgPSBHcm91cEZyYWN0aW9uYWxEaWdpdHMoRnJhY3Rpb25hbERpZ2l0cyk7XG5cbiAgICByZXR1cm4gKElzTmVnYXRpdmUgPyBcIi1cIiA6IFwiXCIpICsgR3JvdXBlZEludGVncmFsRGlnaXRzICsgXCIuXCIgKyBHcm91cGVkRnJhY3Rpb25hbERpZ2l0cztcbn07XG5cbmNvbnN0IEZvcm1hdE51bWJlciA9ICh7IERlcHRoLCBWYWx1ZSB9OiBUTG9nUHJpbWl0aXZlPG51bWJlcj4gfCBUTG9nUHJpbWl0aXZlPGJpZ2ludD4pOiBGTG9nU3RyaW5nID0+XG57XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBEZXB0aCxcbiAgICAgICAgU3RyaW5nOiBTdHlsZU51bWJlcihWYWx1ZSlcbiAgICB9O1xufTtcblxuY29uc3QgRm9ybWF0TnVsbCA9ICh7IERlcHRoIH06IFRMb2dQcmltaXRpdmU8bnVsbD4pOiBUQXJyYXk8RkxvZ1N0cmluZz4gPT5cbntcbiAgICByZXR1cm4gWyB7XG4gICAgICAgIERlcHRoLFxuICAgICAgICBTdHJpbmc6IExvZ1NldHRpbmdzLkZvcm1hdC5Db2xvcnMgPyBDaGFsay55ZWxsb3coXCJudWxsXCIpIDogXCJudWxsXCJcbiAgICB9IF07XG59O1xuXG5jb25zdCBGb3JtYXRVbmRlZmluZWQgPSAoeyBEZXB0aCB9OiBUTG9nUHJpbWl0aXZlPHVuZGVmaW5lZD4pOiBGTG9nU3RyaW5nID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGVwdGgsXG4gICAgICAgIFN0cmluZzogTG9nU2V0dGluZ3MuRm9ybWF0LkNvbG9ycyA/IENoYWxrLmdyYXkoXCJ1bmRlZmluZWRcIikgOiBcInVuZGVmaW5lZFwiXG4gICAgfTtcbn07XG5cbmNvbnN0IEZvcm1hdEZ1bmN0aW9uID0gKHsgRGVwdGggfTogVExvZ1ByaW1pdGl2ZTxGdW5jdGlvbj4pOiBGTG9nU3RyaW5nID0+XG57XG4gICAgcmV0dXJuIHtcbiAgICAgICAgRGVwdGgsXG4gICAgICAgIFN0cmluZzogTG9nU2V0dGluZ3MuRm9ybWF0LkNvbG9ycyA/IENoYWxrLnJlZChcIlsgRnVuY3Rpb24gXVwiKSA6IFwiWyBGdW5jdGlvbiBdXCJcbiAgICB9O1xufTtcblxuY29uc3QgRm9ybWF0Qm9vbGVhbiA9ICh7IERlcHRoLCBWYWx1ZSB9OiBUTG9nUHJpbWl0aXZlPGJvb2xlYW4+KTogRkxvZ1N0cmluZyA9Plxue1xuICAgIGNvbnN0IFN0cmluZ0Jhc2U6IHN0cmluZyA9IFZhbHVlID8gXCJ0cnVlXCIgOiBcImZhbHNlXCI7XG4gICAgY29uc3QgU3R5bGVGdW5jdGlvbjogRnVuY3Rpb24gPSBMb2dTZXR0aW5ncy5Gb3JtYXQuQ29sb3JzXG4gICAgICAgID8gKFZhbHVlID8gQ2hhbGsuYmx1ZSA6IENoYWxrLnJlZClcbiAgICAgICAgOiBJZGVudGl0eTtcblxuICAgIGNvbnN0IFN0cmluZzogc3RyaW5nID0gU3R5bGVGdW5jdGlvbihTdHJpbmdCYXNlKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIERlcHRoLFxuICAgICAgICBTdHJpbmdcbiAgICB9O1xufTtcblxuY29uc3QgRGVsaW1pdGVyczogRkRlbGltaXRlcnMgPVxue1xuICAgIEFycmF5OiBbIFwiW1wiLCBcIl1cIiBdLFxuICAgIEtleVZhbHVlUGFpcjogWyBcIntcIiwgXCJ9XCIgXSxcbiAgICBNYXA6IFsgXCI8XCIsIFwiPlwiIF0sXG4gICAgUmVjb3JkOiBbIFwie1wiLCBcIn1cIiBdLFxuICAgIFNldDogWyBcIntcIiwgXCJ9XCIgXVxufTtcblxuY29uc3QgR2V0RGVsaW1pdGVycyA9IChEZXB0aDogbnVtYmVyLCBDb250YWluZXJUeXBlOiBGQ29udGFpbmVyVHlwZSk6IFsgRkxvZ1N0cmluZywgRkxvZ1N0cmluZyBdID0+XG57XG4gICAgY29uc3QgTWFrZURlbGltaXRlckxvZ1N0cmluZyA9IChTdHJpbmc6IHN0cmluZyk6IEZMb2dTdHJpbmcgPT4gKHsgRGVwdGgsIFN0cmluZyB9KTtcbiAgICByZXR1cm4gRGVsaW1pdGVyc1tDb250YWluZXJUeXBlXS5tYXAoTWFrZURlbGltaXRlckxvZ1N0cmluZykgYXMgWyBGTG9nU3RyaW5nLCBGTG9nU3RyaW5nIF07XG59O1xuXG5jb25zdCBGb3JtYXRBcnJheSA9IChMb2dBcnJheTogRkxvZ0FycmF5KTogVEFycmF5PEZMb2dTdHJpbmc+ID0+XG57XG4gICAgcmV0dXJuIEZvcm1hdENvbnRhaW5lcihcIkFycmF5XCIsIExvZ0FycmF5KTtcbn07XG5cbmNvbnN0IEZvcm1hdE1hcCA9ICh7IERlcHRoLCBWYWx1ZSB9OiBGTG9nTWFwKTogVEFycmF5PEZMb2dTdHJpbmc+ID0+XG57XG4gICAgY29uc3QgRm9ybWF0S2V5VmFsdWVQYWlyID0gKHsgRGVwdGgsIEtleSwgVmFsdWUgfTogRktleVZhbHVlUGFpcik6IEZMb2dTdHJpbmdBcnJheSA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgWyBTdGFydERlbGltaXRlckxvZ1N0cmluZywgU3RvcERlbGltaXRlckxvZ1N0cmluZyBdID0gR2V0RGVsaW1pdGVycyhEZXB0aCwgXCJLZXlWYWx1ZVBhaXJcIik7XG5cbiAgICAgICAgY29uc3QgRm9ybWF0TWFwS2V5ID0gKHsgRGVwdGgsIEtleSB9OiBPbWl0PEZLZXlWYWx1ZVBhaXIsIFwiVmFsdWVcIj4pOiBGTG9nU3RyaW5nID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIGNvbnN0IE91dDogRkxvZ1N0cmluZyA9IEZvcm1hdFZhbHVlKHsgRGVwdGg6IERlcHRoICsgMSwgVmFsdWU6IEtleSB9KVswXTtcbiAgICAgICAgICAgIE91dC5TdHJpbmcgKz0gXCIsXCI7XG4gICAgICAgICAgICByZXR1cm4gT3V0O1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IEZvcm1hdE1hcFZhbHVlID0gKHsgRGVwdGgsIFZhbHVlIH06IE9taXQ8RktleVZhbHVlUGFpciwgXCJLZXlcIj4pOiBGTG9nU3RyaW5nQXJyYXkgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIEZvcm1hdFZhbHVlKHsgRGVwdGg6IERlcHRoICsgMSwgVmFsdWUgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgS2V5TG9nU3RyaW5nOiBGTG9nU3RyaW5nID0gRm9ybWF0TWFwS2V5KHsgRGVwdGgsIEtleSB9KTtcbiAgICAgICAgY29uc3QgVmFsdWVMb2dTdHJpbmdzOiBGTG9nU3RyaW5nQXJyYXkgPSBGb3JtYXRNYXBWYWx1ZSh7IERlcHRoLCBWYWx1ZSB9KTtcblxuICAgICAgICByZXR1cm4gWyBTdGFydERlbGltaXRlckxvZ1N0cmluZywgS2V5TG9nU3RyaW5nLCAuLi5WYWx1ZUxvZ1N0cmluZ3MsIFN0b3BEZWxpbWl0ZXJMb2dTdHJpbmcgXTtcbiAgICB9O1xuXG4gICAgY29uc3QgWyBTdGFydERlbGltaXRlckxvZ1N0cmluZywgU3RvcERlbGltaXRlckxvZ1N0cmluZyBdID0gR2V0RGVsaW1pdGVycyhEZXB0aCwgXCJNYXBcIik7XG4gICAgY29uc3QgR2V0S2V5VmFsdWVQYWlycyA9IChJbk1hcDogRk1hcCk6IFRBcnJheTxGS2V5VmFsdWVQYWlyPiA9PlxuICAgIHtcbiAgICAgICAgY29uc3QgT3V0OiBUQXJyYXk8RktleVZhbHVlUGFpcj4gPSBbIF07XG5cbiAgICAgICAgSW5NYXAuZm9yRWFjaCgoVmFsdWU6IHVua25vd24sIEtleTogRlByaW1pdGl2ZSk6IHZvaWQgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgT3V0LnB1c2goeyBEZXB0aDogRGVwdGggKyAxLCBLZXksIFZhbHVlOiBWYWx1ZSBhcyBUTG9nVmFsdWUgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBPdXQ7XG4gICAgfTtcblxuICAgIGNvbnN0IElubmVyTG9nU3RyaW5nczogRkxvZ1N0cmluZ0FycmF5ID1cbiAgICAgICAgR2V0S2V5VmFsdWVQYWlycyhWYWx1ZSkubWFwKEZvcm1hdEtleVZhbHVlUGFpcikuZmxhdCgyMCkgYXMgRkxvZ1N0cmluZ0FycmF5O1xuXG4gICAgcmV0dXJuIFsgU3RhcnREZWxpbWl0ZXJMb2dTdHJpbmcsIC4uLklubmVyTG9nU3RyaW5ncywgU3RvcERlbGltaXRlckxvZ1N0cmluZyBdO1xufTtcblxuY29uc3QgRm9ybWF0UmVjb3JkID0gKHsgRGVwdGgsIFZhbHVlIH06IEZMb2dSZWNvcmQpOiBUQXJyYXk8RkxvZ1N0cmluZz4gPT5cbntcbiAgICBjb25zdCBbIFN0YXJ0RGVsaW1pdGVyTG9nU3RyaW5nLCBTdG9wRGVsaW1pdGVyTG9nU3RyaW5nIF0gPSBHZXREZWxpbWl0ZXJzKERlcHRoLCBcIlJlY29yZFwiKTtcblxuICAgIGNvbnN0IEdldEtleVZhbHVlUGFpcnMgPSAoSW5SZWNvcmQ6IEZSZWNvcmQpOiBUQXJyYXk8RktleVZhbHVlUGFpcj4gPT5cbiAgICB7XG4gICAgICAgIGNvbnN0IE91dDogVEFycmF5PEZLZXlWYWx1ZVBhaXI+ID0gWyBdO1xuXG4gICAgICAgIE9iamVjdC5rZXlzKEluUmVjb3JkKS5mb3JFYWNoKChLZXk6IFByb3BlcnR5S2V5KTogdm9pZCA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBPdXQucHVzaCh7IERlcHRoLCBLZXksIFZhbHVlOiBJblJlY29yZFtLZXldIGFzIFRMb2dWYWx1ZSB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIE91dDtcbiAgICB9O1xuXG4gICAgY29uc3QgS2V5VmFsdWVQYWlyczogVEFycmF5PEZLZXlWYWx1ZVBhaXI+ID0gR2V0S2V5VmFsdWVQYWlycyhWYWx1ZSk7XG5cbiAgICBjb25zdCBGb3JtYXRLZXlWYWx1ZVBhaXIgPSAoeyBEZXB0aCwgS2V5LCBWYWx1ZSB9OiBGS2V5VmFsdWVQYWlyLCBJbmRleDogbnVtYmVyKTogRkxvZ1N0cmluZ0FycmF5ID0+XG4gICAge1xuICAgICAgICAvLyBjb25zdCBbIFN0YXJ0RGVsaW1pdGVyTG9nU3RyaW5nLCBTdG9wRGVsaW1pdGVyTG9nU3RyaW5nIF0gPSBHZXREZWxpbWl0ZXJzKERlcHRoLCBcIlJlY29yZFwiKTtcblxuICAgICAgICBjb25zdCBGb3JtYXRSZWNvcmRLZXkgPSAoeyBEZXB0aCwgS2V5IH06IE9taXQ8RktleVZhbHVlUGFpciwgXCJWYWx1ZVwiPik6IEZMb2dTdHJpbmcgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgY29uc3QgT3V0OiBGTG9nU3RyaW5nID0gRm9ybWF0VmFsdWUoeyBEZXB0aDogRGVwdGggKyAxLCBWYWx1ZTogS2V5IH0pWzBdO1xuICAgICAgICAgICAgT3V0LlN0cmluZyArPSBcIjpcIjtcbiAgICAgICAgICAgIHJldHVybiBPdXQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgRm9ybWF0UmVjb3JkVmFsdWUgPSAoeyBEZXB0aCwgVmFsdWUgfTogT21pdDxGS2V5VmFsdWVQYWlyLCBcIktleVwiPik6IEZMb2dTdHJpbmdBcnJheSA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBPdXQ6IEZMb2dTdHJpbmdBcnJheSA9IEZvcm1hdFZhbHVlKHsgRGVwdGg6IERlcHRoICsgMSwgVmFsdWUgfSk7XG4gICAgICAgICAgICBpZiAoSW5kZXggIT09IEtleVZhbHVlUGFpcnMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBMYXN0OiBGTG9nU3RyaW5nIHwgdW5kZWZpbmVkID0gT3V0LmF0KC0xKTtcbiAgICAgICAgICAgICAgICBpZiAoTGFzdCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgTGFzdC5TdHJpbmcgKz0gXCIsXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIE91dDtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBLZXlMb2dTdHJpbmc6IEZMb2dTdHJpbmcgPSBGb3JtYXRSZWNvcmRLZXkoeyBEZXB0aCwgS2V5IH0pO1xuICAgICAgICBjb25zdCBWYWx1ZUxvZ1N0cmluZ3M6IEZMb2dTdHJpbmdBcnJheSA9IEZvcm1hdFJlY29yZFZhbHVlKHsgRGVwdGgsIFZhbHVlIH0pO1xuXG4gICAgICAgIGlmIChWYWx1ZUxvZ1N0cmluZ3MubGVuZ3RoID09PSAxKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBPdXQ6IEZMb2dTdHJpbmcgPVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIERlcHRoOiBEZXB0aCArIDEsXG4gICAgICAgICAgICAgICAgU3RyaW5nOiBLZXlMb2dTdHJpbmcuU3RyaW5nICsgXCIgXCIgKyBWYWx1ZUxvZ1N0cmluZ3NbMF0uU3RyaW5nXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gWyBPdXQgXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBbIEtleUxvZ1N0cmluZywgLi4uVmFsdWVMb2dTdHJpbmdzIF07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgSW5uZXJMb2dTdHJpbmdzOiBGTG9nU3RyaW5nQXJyYXkgPVxuICAgICAgICBLZXlWYWx1ZVBhaXJzLm1hcChGb3JtYXRLZXlWYWx1ZVBhaXIpLmZsYXQoMjApIGFzIEZMb2dTdHJpbmdBcnJheTtcblxuICAgIHJldHVybiBbIFN0YXJ0RGVsaW1pdGVyTG9nU3RyaW5nLCAuLi5Jbm5lckxvZ1N0cmluZ3MsIFN0b3BEZWxpbWl0ZXJMb2dTdHJpbmcgXTtcbn07XG5cbmNvbnN0IEZvcm1hdENvbnRhaW5lciA9IChcbiAgICBDb250YWluZXJUeXBlOiBGU2V0VHlwZU5hbWUgfCBGQXJyYXlUeXBlTmFtZSxcbiAgICB7IERlcHRoLCBWYWx1ZSB9OiBGTG9nU2V0IHwgRkxvZ0FycmF5XG4pOiBUQXJyYXk8RkxvZ1N0cmluZz4gPT5cbntcbiAgICBjb25zdCBbIFN0YXJ0RGVsaW1pdGVyTG9nU3RyaW5nLCBTdG9wRGVsaW1pdGVyTG9nU3RyaW5nIF0gPSBHZXREZWxpbWl0ZXJzKERlcHRoLCBDb250YWluZXJUeXBlKTtcblxuICAgIGNvbnN0IE1ha2VMb2dWYWx1ZSA9IChJbjogRkxvZ1ZhbHVlVHlwZSk6IFRMb2dWYWx1ZSA9PiAoeyBEZXB0aDogRGVwdGggKyAxLCBWYWx1ZTogSW4gfSk7XG5cbiAgICBjb25zdCBWYWx1ZUFycmF5OiBUQXJyYXk8RkxvZ1ZhbHVlVHlwZT4gPSBBcnJheS5pc0FycmF5KFZhbHVlKVxuICAgICAgICA/IFZhbHVlXG4gICAgICAgIDogQXJyYXkuZnJvbShWYWx1ZSk7XG5cbiAgICBjb25zdCBBcHBlbmRDb21tYSA9ICh7IERlcHRoLCBTdHJpbmcgfTogRkxvZ1N0cmluZywgSW5kZXg6IG51bWJlcik6IEZMb2dTdHJpbmcgPT5cbiAgICB7XG4gICAgICAgIHJldHVybiBJbmRleCAhPT0gVmFsdWVBcnJheS5sZW5ndGggLSAxXG4gICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICBEZXB0aCxcbiAgICAgICAgICAgICAgICBTdHJpbmc6IFN0cmluZyArIFwiLFwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICBEZXB0aCxcbiAgICAgICAgICAgICAgICBTdHJpbmdcbiAgICAgICAgICAgIH07XG4gICAgfTtcblxuICAgIGNvbnN0IElubmVyTG9nU3RyaW5nczogRkxvZ1N0cmluZ0FycmF5ID1cbiAgICAgICAgVmFsdWVBcnJheS5tYXAoTWFrZUxvZ1ZhbHVlKS5tYXAoRm9ybWF0VmFsdWUpLmZsYXQoMjApLm1hcChBcHBlbmRDb21tYSkgYXMgRkxvZ1N0cmluZ0FycmF5O1xuXG4gICAgaWYgKElubmVyTG9nU3RyaW5ncy5sZW5ndGggPT09IDApXG4gICAge1xuICAgICAgICByZXR1cm4gWyB7XG4gICAgICAgICAgICBEZXB0aCxcbiAgICAgICAgICAgIFN0cmluZzogU3RhcnREZWxpbWl0ZXJMb2dTdHJpbmcuU3RyaW5nICsgXCIgXCIgKyBTdG9wRGVsaW1pdGVyTG9nU3RyaW5nLlN0cmluZ1xuICAgICAgICB9IF07XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgIHJldHVybiBbIFN0YXJ0RGVsaW1pdGVyTG9nU3RyaW5nLCAuLi5Jbm5lckxvZ1N0cmluZ3MsIFN0b3BEZWxpbWl0ZXJMb2dTdHJpbmcgXTtcbiAgICB9XG59O1xuXG5jb25zdCBGb3JtYXRTZXQgPSAoTG9nU2V0OiBGTG9nU2V0KTogVEFycmF5PEZMb2dTdHJpbmc+ID0+XG57XG4gICAgcmV0dXJuIEZvcm1hdENvbnRhaW5lcihcIlNldFwiLCBMb2dTZXQpO1xufTtcblxuY29uc3QgRm9ybWF0T2JqZWN0ID0gKHsgRGVwdGgsIFZhbHVlIH06IFRMb2dDb250YWluZXIpOiBUQXJyYXk8RkxvZ1N0cmluZz4gPT5cbntcbiAgICBsZXQgRm9ybWF0dGVyOiBGdW5jdGlvbiA9IEZvcm1hdFJlY29yZDtcbiAgICBpZiAoVmFsdWUgaW5zdGFuY2VvZiBNYXApXG4gICAge1xuICAgICAgICBGb3JtYXR0ZXIgPSBGb3JtYXRNYXA7XG4gICAgfVxuICAgIGVsc2UgaWYgKFZhbHVlIGluc3RhbmNlb2YgU2V0KVxuICAgIHtcbiAgICAgICAgRm9ybWF0dGVyID0gRm9ybWF0U2V0O1xuICAgIH1cbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KFZhbHVlKSlcbiAgICB7XG4gICAgICAgIEZvcm1hdHRlciA9IEZvcm1hdEFycmF5O1xuICAgIH1cbiAgICBlbHNlIGlmIChWYWx1ZSA9PT0gbnVsbClcbiAgICB7XG4gICAgICAgIEZvcm1hdHRlciA9IEZvcm1hdE51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIEZvcm1hdHRlcih7IERlcHRoLCBWYWx1ZSB9KTtcbn07XG5cbmNvbnN0IEZvcm1hdFZhbHVlID0gKHsgRGVwdGgsIFZhbHVlIH06IFRMb2dWYWx1ZSk6IEZMb2dTdHJpbmdBcnJheSA9Plxue1xuICAgIGNvbnN0IEZvcm1hdHRlcnM6IFJlY29yZDxGVHlwZW9mLCBGdW5jdGlvbj4gPVxuICAgIHtcbiAgICAgICAgYmlnaW50OiBGb3JtYXROdW1iZXIsXG4gICAgICAgIGJvb2xlYW46IEZvcm1hdEJvb2xlYW4sXG4gICAgICAgIGZ1bmN0aW9uOiBGb3JtYXRGdW5jdGlvbixcbiAgICAgICAgbnVtYmVyOiBGb3JtYXROdW1iZXIsXG4gICAgICAgIG9iamVjdDogRm9ybWF0T2JqZWN0LFxuICAgICAgICBzdHJpbmc6IEZvcm1hdFN0cmluZyxcbiAgICAgICAgc3ltYm9sOiBGb3JtYXRTeW1ib2wsXG4gICAgICAgIHVuZGVmaW5lZDogRm9ybWF0VW5kZWZpbmVkXG4gICAgfTtcblxuICAgIGNvbnN0IFZhbHVlczogRkxvZ1N0cmluZyB8IEZMb2dTdHJpbmdBcnJheSA9IEZvcm1hdHRlcnNbdHlwZW9mIFZhbHVlXSh7IERlcHRoLCBWYWx1ZSB9KTtcblxuICAgIHJldHVybiBBcnJheS5pc0FycmF5KFZhbHVlcylcbiAgICAgICAgPyBWYWx1ZXNcbiAgICAgICAgOiBbIFZhbHVlcyBdO1xufTtcblxuZXhwb3J0IGNvbnN0IEZvcm1hdCA9IChWYWx1ZTogRkxvZ1ZhbHVlVHlwZSk6IHN0cmluZyA9Plxue1xuICAgIGNvbnN0IElubGluZWRBcnJheTogRkxvZ1N0cmluZ0FycmF5ID0gSW5saW5lKEZvcm1hdFZhbHVlKHsgRGVwdGg6IDAsIFZhbHVlIH0pKTtcbiAgICBjb25zdCBPdXQ6IHN0cmluZyA9IElubGluZWRBcnJheVxuICAgICAgICAubWFwKCh7IERlcHRoLCBTdHJpbmcgfTogRkxvZ1N0cmluZywgSW5kZXg6IG51bWJlcik6IHN0cmluZyA9PlxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBTdG9wRGVsaW1pdGVyczogVEFycmF5PHN0cmluZz4gPSBbIFwiPlwiLCBcIl1cIiwgXCJ9XCIgXTtcbiAgICAgICAgICAgIGNvbnN0IFN0YXJ0RGVsaW1pdGVyczogVEFycmF5PHN0cmluZz4gPSBbIFwiPFwiLCBcIltcIiwgXCJ7XCIgXTtcbiAgICAgICAgICAgIGNvbnN0IENoYXJhY3Rlcjogc3RyaW5nID0gR2V0V2l0aG91dEFuc2koU3RyaW5nKVtHZXRXaXRob3V0QW5zaShTdHJpbmcpLmxlbmd0aCAtIDFdIHx8IFwiXCI7XG4gICAgICAgICAgICBpZiAoU3RvcERlbGltaXRlcnMuaW5jbHVkZXMoQ2hhcmFjdGVyKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAoSW5kZXggIT09IElubGluZWRBcnJheS5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgTmV4dDogRkxvZ1N0cmluZyB8IHVuZGVmaW5lZCA9IElubGluZWRBcnJheVtJbmRleCArIDFdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoTmV4dCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBOZXh0U3RyaW5nU3RhcnQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IE5leHQuU3RyaW5nWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE5leHRTdHJpbmdTdGFydCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTdGFydERlbGltaXRlcnMuaW5jbHVkZXMoTmV4dFN0cmluZ1N0YXJ0KSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZyArPSBcIixcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBcIiBcIi5yZXBlYXQoTG9nU2V0dGluZ3MuU2l6ZS5UYWJXaWR0aCAqIERlcHRoKSArIFN0cmluZztcbiAgICAgICAgfSlcbiAgICAgICAgLmpvaW4oXCJcXG5cIik7XG5cbiAgICByZXR1cm4gT3V0O1xufTtcblxuZXhwb3J0IGNvbnN0IEZvcm1hdElubGluZSA9IChWYWx1ZTogRkxvZ1ZhbHVlVHlwZSk6IHN0cmluZyA9Plxue1xuICAgIHJldHVybiBGb3JtYXQoVmFsdWUpLnJlcGxhY2VBbGwoXCJcXG5cIiwgXCIgXCIpO1xufTtcblxuY29uc3QgSXNCYXNlNjRTdHJpbmcgPSAoSW46IHN0cmluZyk6IGJvb2xlYW4gPT5cbntcbiAgICAvLyBjb25zdCBOb3JtYWxpemVkSW5wdXQ6IHN0cmluZyA9IEluLnJlcGxhY2UoL1xccysvZywgXCJcIik7XG5cbiAgICAvLyBpZiAoTm9ybWFsaXplZElucHV0Lmxlbmd0aCA9PT0gMCB8fCBOb3JtYWxpemVkSW5wdXQubGVuZ3RoICUgNCAhPT0gMClcbiAgICAvLyB7XG4gICAgLy8gICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyB9XG5cbiAgICAvLyByZXR1cm4gL15bQS1aYS16MC05Ky9dKj17MCwyfSQvLnRlc3QoTm9ybWFsaXplZElucHV0KTtcbiAgICByZXR1cm4gKFxuICAgICAgICBJbi5zdGFydHNXaXRoKFwiZGF0YTpcIikgJiZcbiAgICAgICAgSW4uaW5jbHVkZXMoXCI7XCIpICYmXG4gICAgICAgIEluLmxlbmd0aCA+IDIwXG4gICAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBGb3JtYXRCYXNlNjRTdHJpbmcgPSAoSW46IHN0cmluZyk6IHN0cmluZyA9Plxue1xuICAgIGlmICghTG9nU2V0dGluZ3MuRm9ybWF0LlRydW5jYXRlQmFzZTY0U3RyaW5ncylcbiAgICB7XG4gICAgICAgIHJldHVybiBJbjtcbiAgICB9XG5cbiAgICBpZiAoSXNCYXNlNjRTdHJpbmcoSW4pKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIENoYWxrLmdyYXkoYFsgQmFzZTY0ICgkeyBJbi5zbGljZShcImRhdGE6XCIubGVuZ3RoKS5zcGxpdChcIjtcIilbMF0gfSkgXWApO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICByZXR1cm4gSW47XG4gICAgfVxuXG59O1xuIiwiLyoqXG4gKiBAZmlsZSAgICAgIExvZ1N0eWxlLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHR5cGUgeyBGQ29sb3JLZXl3b3JkcywgRkxvZ0NvbG9yLCBGTG9nU3R5bGVGdW5jdGlvbiB9IGZyb20gXCIuL0xvZ1N0eWxlLlR5cGVzXCI7XG5pbXBvcnQgQ2hhbGsgZnJvbSBcImNoYWxrXCI7XG5pbXBvcnQgdHlwZSB7IEZIZXhDb2xvciB9IGZyb20gXCJAc29ycmVsbC93bS13aW5kb3dzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBDb2RlKEluOiBzdHJpbmcpOiBzdHJpbmdcbntcbiAgICByZXR1cm4gQ2hhbGsuaGV4KFwiI0VCNDY1N1wiKShJbik7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gQm9sZChJbjogc3RyaW5nKTogc3RyaW5nXG57XG4gICAgcmV0dXJuIENoYWxrLmJvbGQoSW4pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEl0YWxpYyhJbjogc3RyaW5nKTogc3RyaW5nXG57XG4gICAgcmV0dXJuIENoYWxrLml0YWxpYyhJbik7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gVW5kZXJsaW5lKEluOiBzdHJpbmcpOiBzdHJpbmdcbntcbiAgICByZXR1cm4gQ2hhbGsudW5kZXJsaW5lKEluKTtcbn1cblxuZnVuY3Rpb24gSXNIZXhDb2xvcihJbjogc3RyaW5nKTogSW4gaXMgRkhleENvbG9yXG57XG4gICAgcmV0dXJuIEluLmluY2x1ZGVzKFwiI1wiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEJhY2tncm91bmQoQ29sb3I6IEZIZXhDb2xvciB8IEZMb2dDb2xvcik6IEZMb2dTdHlsZUZ1bmN0aW9uXG57XG4gICAgaWYgKElzSGV4Q29sb3IoQ29sb3IpKVxuICAgIHtcbiAgICAgICAgcmV0dXJuIChJbjogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBDaGFsay5iZ0hleChDb2xvcikoSW4pO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICByZXR1cm4gKEluOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIENoYWxrW0NvbG9yS2V5d29yZHMuQmFja2dyb3VuZFtDb2xvcl1dKEluKTtcbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gRm9yZWdyb3VuZChDb2xvcjogRkhleENvbG9yIHwgRkxvZ0NvbG9yKTogRkxvZ1N0eWxlRnVuY3Rpb25cbntcbiAgICBpZiAoSXNIZXhDb2xvcihDb2xvcikpXG4gICAge1xuICAgICAgICByZXR1cm4gKEluOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIENoYWxrLmhleChDb2xvcikoSW4pO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICByZXR1cm4gKEluOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIENoYWxrW0NvbG9yS2V5d29yZHMuRm9yZWdyb3VuZFtDb2xvcl1dKEluKTtcbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gQ29tcG9zZVN0eWxlcyguLi5TdHlsZUZ1bmN0aW9uczogQXJyYXk8RkxvZ1N0eWxlRnVuY3Rpb24+KTogRkxvZ1N0eWxlRnVuY3Rpb25cbntcbiAgICBmdW5jdGlvbiBJZGVudGl0eShJbjogc3RyaW5nKTogc3RyaW5nXG4gICAge1xuICAgICAgICByZXR1cm4gSW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gUmVkdWNlcihQcmV2aW91c1ZhbHVlOiBGTG9nU3R5bGVGdW5jdGlvbiwgQ3VycmVudFZhbHVlOiBGTG9nU3R5bGVGdW5jdGlvbik6IEZMb2dTdHlsZUZ1bmN0aW9uXG4gICAge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oSW46IHN0cmluZyk6IHN0cmluZ1xuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gUHJldmlvdXNWYWx1ZShDdXJyZW50VmFsdWUoSW4pKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gU3R5bGVGdW5jdGlvbnMucmVkdWNlKFJlZHVjZXIsIElkZW50aXR5KTtcbn07XG5cbmNvbnN0IENvbG9yS2V5d29yZHM6IEZDb2xvcktleXdvcmRzID1cbntcbiAgICBCYWNrZ3JvdW5kOlxuICAgIHtcbiAgICAgICAgQmxhY2s6IFwiYmdCbGFja1wiLFxuICAgICAgICBCbGFja0JyaWdodDogXCJiZ0JsYWNrXCIsXG4gICAgICAgIEJsdWU6IFwiYmdCbHVlXCIsXG4gICAgICAgIEJsdWVCcmlnaHQ6IFwiYmdCbHVlXCIsXG4gICAgICAgIEN5YW46IFwiYmdDeWFuXCIsXG4gICAgICAgIEN5YW5CcmlnaHQ6IFwiYmdDeWFuXCIsXG4gICAgICAgIEdyYXk6IFwiYmdHcmF5XCIsXG4gICAgICAgIEdyZWVuOiBcImJnR3JlZW5cIixcbiAgICAgICAgR3JlZW5CcmlnaHQ6IFwiYmdHcmVlblwiLFxuICAgICAgICBNYWdlbnRhOiBcImJnTWFnZW50YVwiLFxuICAgICAgICBNYWdlbnRhQnJpZ2h0OiBcImJnTWFnZW50YVwiLFxuICAgICAgICBSZWQ6IFwiYmdSZWRcIixcbiAgICAgICAgUmVkQnJpZ2h0OiBcImJnUmVkXCIsXG4gICAgICAgIFdoaXRlOiBcImJnV2hpdGVcIixcbiAgICAgICAgV2hpdGVCcmlnaHQ6IFwiYmdXaGl0ZVwiLFxuICAgICAgICBZZWxsb3c6IFwiYmdZZWxsb3dcIixcbiAgICAgICAgWWVsbG93QnJpZ2h0OiBcImJnWWVsbG93XCJcbiAgICB9LFxuICAgIEZvcmVncm91bmQ6XG4gICAge1xuICAgICAgICBCbGFjazogXCJibGFja1wiLFxuICAgICAgICBCbGFja0JyaWdodDogXCJibGFja0JyaWdodFwiLFxuICAgICAgICBCbHVlOiBcImJsdWVcIixcbiAgICAgICAgQmx1ZUJyaWdodDogXCJibHVlQnJpZ2h0XCIsXG4gICAgICAgIEN5YW46IFwiY3lhblwiLFxuICAgICAgICBDeWFuQnJpZ2h0OiBcImN5YW5CcmlnaHRcIixcbiAgICAgICAgR3JheTogXCJncmF5XCIsXG4gICAgICAgIEdyZWVuOiBcImdyZWVuXCIsXG4gICAgICAgIEdyZWVuQnJpZ2h0OiBcImdyZWVuQnJpZ2h0XCIsXG4gICAgICAgIE1hZ2VudGE6IFwibWFnZW50YVwiLFxuICAgICAgICBNYWdlbnRhQnJpZ2h0OiBcIm1hZ2VudGFCcmlnaHRcIixcbiAgICAgICAgUmVkOiBcInJlZFwiLFxuICAgICAgICBSZWRCcmlnaHQ6IFwicmVkQnJpZ2h0XCIsXG4gICAgICAgIFdoaXRlOiBcIndoaXRlXCIsXG4gICAgICAgIFdoaXRlQnJpZ2h0OiBcIndoaXRlQnJpZ2h0XCIsXG4gICAgICAgIFllbGxvdzogXCJ5ZWxsb3dcIixcbiAgICAgICAgWWVsbG93QnJpZ2h0OiBcInllbGxvd0JyaWdodFwiXG4gICAgfVxufSBhcyBjb25zdDtcbiIsIi8qKlxuICogQGZpbGUgICAgICBMb2dTdHlsZVNob3J0aGFuZHMudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG5pbXBvcnQgeyBCYWNrZ3JvdW5kLCBCb2xkLCBDb2RlLCBDb21wb3NlU3R5bGVzLCBGb3JlZ3JvdW5kIH0gZnJvbSBcIi4vTG9nU3R5bGVcIjtcblxuZXhwb3J0IGNvbnN0IEI6IHR5cGVvZiBCb2xkID0gQm9sZDtcbmV4cG9ydCBjb25zdCBCZzogdHlwZW9mIEJhY2tncm91bmQgPSBCYWNrZ3JvdW5kO1xuZXhwb3J0IGNvbnN0IEM6IHR5cGVvZiBDb2RlID0gQ29kZTtcbmV4cG9ydCBjb25zdCBDb21wb3NlOiB0eXBlb2YgQ29tcG9zZVN0eWxlcyA9IENvbXBvc2VTdHlsZXM7XG5leHBvcnQgY29uc3QgRmc6IHR5cGVvZiBGb3JlZ3JvdW5kID0gRm9yZWdyb3VuZDtcbiIsIi8qKlxuICogQGZpbGUgICAgICBIb29rLnRzXG4gKiBAYXV0aG9yICAgIEdhZ2UgU29ycmVsbCA8Z2FnZUBzb3JyZWxsLnNoPlxuICogQGNvcHlyaWdodCAoYykgMjAyNiBHYWdlIFNvcnJlbGxcbiAqIEBsaWNlbnNlICAgTUlUXG4gKi9cblxuaW1wb3J0IHsgSW5pdGlhbGl6ZUhvb2tzIH0gZnJvbSBcIkBzb3JyZWxsL3dtLXdpbmRvd3NcIjtcblxuSW5pdGlhbGl6ZUhvb2tzKCk7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgTWFpbi50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjQgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICogQ29tbWVudDogICBUaGlzIGlzIHRoZSBlbnRyeSBwb2ludCB0aGF0IEVsZWN0cm9uIGZpcnN0IGxvYWRzLlxuICovXG5cbmltcG9ydCBcIi4vU2lkZUVmZmVjdHNcIjtcbiIsIi8qKlxuICogQGZpbGUgICAgICBTaWRlRWZmZWN0cy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjUgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlIHNvcnQtaW1wb3J0cyAqL1xuXG4vKipcbiAqIFdlYnBhY2sgY29tcGxhaW5zIGFib3V0IHRoZSB1c2Ugb2YgYGltcG9ydCgpYCwgZGVzcGl0ZSBiZWluZyBhYmxlIHRvIHJlc29sdmUgdGhlIG1vZHVsZXMuXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXRzLWNvbW1lbnQgKi9cbi8vIEB0cy1ub2NoZWNrXG5cbmltcG9ydCB0eXBlIHsgRkxvZ2dlciB9IGZyb20gXCIuLi8uLi9TaGFyZWRcIjtcbmltcG9ydCB7IEdldExvZ2dlciB9IGZyb20gXCIjL0RldmVsb3BtZW50L0xvZy9Mb2dcIjtcbmltcG9ydCB7IEMgfSBmcm9tIFwiIy9EZXZlbG9wbWVudC9Mb2cvTG9nU3R5bGVTaG9ydGhhbmRzXCI7XG5cbmNvbnN0IExvZzogRkxvZ2dlciA9IEdldExvZ2dlcihcIlNpZGVFZmZlY3RzXCIpO1xuXG5Mb2coYEltcG9ydGluZyAkeyBDKFwiTWVzc2FnZUxvb3BcIikgfS4uLmApO1xuaW1wb3J0IFwiLi4vTWVzc2FnZUxvb3BcIjtcbkxvZyhgSW1wb3J0aW5nICR7IEMoXCJIb29rXCIpIH0uLi5gKTtcbmltcG9ydCBcIi4uL0hvb2tcIjtcblxuc2V0VGltZW91dChhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9Plxue1xuICAgIExvZyhgTm9ybWFsIHNpZGUtZWZmZWN0IGltcG9ydHMgYXJlIGZpbmlzaGVkLiAgUGVyZm9ybWluZyAkeyBDKFwiYXdhaXQgaW1wb3J0XCIpIH1zLi4uYCk7XG5cbiAgICBMb2coYCR7IEMoXCJhd2FpdCBpbXBvcnRcIikgfWluZyAkeyBDKFwiLi4vRGV2ZWxvcG1lbnQvTG9nL0xvZ1wiKSB9Li4uYCk7XG4gICAgYXdhaXQgaW1wb3J0KFwiLi4vRGV2ZWxvcG1lbnQvTG9nL0xvZ1wiKTtcbiAgICBMb2coYCR7IEMoXCJhd2FpdCBpbXBvcnRcIikgfWluZyAkeyBDKFwiLi4vSW5pdGlhbGl6ZS9Jbml0aWFsaXplXCIpIH0uLi5gKTtcbiAgICBhd2FpdCBpbXBvcnQoXCIuL0luaXRpYWxpemVcIik7XG4gICAgTG9nKGAkeyBDKFwiYXdhaXQgaW1wb3J0XCIpIH1pbmcgJHsgQyhcIi4uL0V2ZW50L05vZGVJcGNcIikgfS4uLmApO1xuICAgIGF3YWl0IGltcG9ydChcIi4uL0V2ZW50L05vZGVJcGNcIik7XG4gICAgTG9nKGAkeyBDKFwiYXdhaXQgaW1wb3J0XCIpIH1pbmcgJHsgQyhcIi4uL0tleWJvYXJkL0tleWJvYXJkXCIpIH0uLi5gKTtcbiAgICBhd2FpdCBpbXBvcnQoXCIuLi9LZXlib2FyZC9LZXlib2FyZFwiKTtcbiAgICBMb2coYCR7IEMoXCJhd2FpdCBpbXBvcnRcIikgfWluZyAkeyBDKFwiLi4vTW9uaXRvclwiKSB9Li4uYCk7XG4gICAgYXdhaXQgaW1wb3J0KFwiLi4vTW9uaXRvclwiKTtcbiAgICBMb2coYCR7IEMoXCJhd2FpdCBpbXBvcnRcIikgfWluZyAkeyBDKFwiLi4vVHJlZS9UcmVlXCIpIH0uLi5gKTtcbiAgICBhd2FpdCBpbXBvcnQoXCIuLi9UcmVlL1RyZWVcIik7XG4gICAgTG9nKGAkeyBDKFwiYXdhaXQgaW1wb3J0XCIpIH1pbmcgJHsgQyhcIi4uL1NldHRpbmdzL0luaXRpYWxpemVTZXR0aW5nc1wiKSB9Li4uYCk7XG4gICAgYXdhaXQgaW1wb3J0KFwiLi4vU2V0dGluZ3MvSW5pdGlhbGl6ZVNldHRpbmdzXCIpO1xuICAgIExvZyhgJHsgQyhcImF3YWl0IGltcG9ydFwiKSB9aW5nICR7IEMoXCIuLi9Ob3RpZmljYXRpb25cIikgfS4uLmApO1xuICAgIGF3YWl0IGltcG9ydChcIi4uL05vdGlmaWNhdGlvblwiKTtcblxuICAgIExvZyhgJHsgQyhcImF3YWl0IGltcG9ydFwiKSB9cyBhcmUgZmluaXNoZWQuICBQZXJmb3JtaW5nIG5vbi1hd2FpdGVkICR7IEMoXCJpbXBvcnRcIikgfXMuLi5gKTtcblxuICAgIExvZyhgJHsgQyhcImltcG9ydFwiKSB9aW5nICR7IEMoXCIuLi9XaW5kb3cvQnJvd3NlcldpbmRvdy9Ccm93c2VyV2luZG93XCIpIH0uLi5gKTtcbiAgICBpbXBvcnQoXCIuLi9XaW5kb3cvQnJvd3NlcldpbmRvdy9Ccm93c2VyV2luZG93XCIpO1xuICAgIExvZyhgJHsgQyhcImltcG9ydFwiKSB9aW5nICR7IEMoXCIuLi9DaGVja0FkbWluXCIpIH0uLi5gKTtcbiAgICBpbXBvcnQoXCIuLi9DaGVja0FkbWluXCIpO1xuICAgIExvZyhgJHsgQyhcImltcG9ydFwiKSB9aW5nICR7IEMoXCIuLi9XaW5kb3cvT3ZlcmxheS9Jbml0aWFsaXplT3ZlcmxheVdpbmRvd1wiKSB9Li4uYCk7XG4gICAgaW1wb3J0KFwiLi4vV2luZG93L092ZXJsYXkvSW5pdGlhbGl6ZU92ZXJsYXlXaW5kb3dcIik7XG4gICAgTG9nKGAkeyBDKFwiaW1wb3J0XCIpIH1pbmcgJHsgQyhcIi4vRWxlY3Ryb25cIikgfS4uLmApO1xuICAgIGltcG9ydChcIi4vRWxlY3Ryb25cIik7XG4gICAgTG9nKGAkeyBDKFwiaW1wb3J0XCIpIH1pbmcgJHsgQyhcIi4uL1RyYXkvSW5pdGlhbGl6ZVRyYXlcIikgfS4uLmApO1xuICAgIGltcG9ydChcIi4uL1RyYXkvSW5pdGlhbGl6ZVRyYXlcIik7XG4gICAgTG9nKGAkeyBDKFwiaW1wb3J0XCIpIH1pbmcgJHsgQyhcIi4uL1dpbkV2ZW50XCIpIH0uLi5gKTtcbiAgICBpbXBvcnQoXCIuLi9XaW5FdmVudFwiKTtcbiAgICBMb2coYCR7IEMoXCJpbXBvcnRcIikgfWluZyAkeyBDKFwiLi4vQm9yZGVyTWFuYWdlclwiKSB9Li4uYCk7XG4gICAgaW1wb3J0KFwiLi4vQm9yZGVyTWFuYWdlclwiKTtcbiAgICBMb2coYCR7IEMoXCJpbXBvcnRcIikgfWluZyAkeyBDKFwiLi4vV2luZG93VHJhY2tlclwiKSB9Li4uYCk7XG4gICAgaW1wb3J0KFwiLi4vV2luZG93VHJhY2tlclwiKTtcbiAgICBMb2coYCR7IEMoXCJpbXBvcnRcIikgfWluZyAkeyBDKFwiLi4vV2luZG93L1NldHRpbmdzL1NldHRpbmdzV2luZG93XCIpIH0uLi5gKTtcbiAgICBpbXBvcnQoXCIuLi9XaW5kb3cvU2V0dGluZ3MvU2V0dGluZ3NXaW5kb3dcIik7XG4gICAgTG9nKGAkeyBDKFwiaW1wb3J0XCIpIH1pbmcgJHsgQyhcIi4uL1N0b3JlXCIpIH0uLi5gKTtcbiAgICBpbXBvcnQoXCIuLi9TdG9yZVwiKTtcbiAgICBMb2coYCR7IEMoXCJpbXBvcnRcIikgfWluZyAkeyBDKFwiLi4vRGV2ZWxvcG1lbnQvRHVtbXlXaW5kb3dzXCIpIH0uLi5gKTtcbiAgICBpbXBvcnQoXCIuLi9EZXZlbG9wbWVudC9EdW1teVdpbmRvd3NcIik7XG5cbiAgICBMb2coXCJBbGwgc2lkZS1lZmZlY3QgaW1wb3J0cyBhcmUgY29tcGxldGUhXCIpO1xufSk7XG4iLCIvKipcbiAqIEBmaWxlICAgICAgTWVzc2FnZUxvb3AudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI0IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuXG4vKiogVGhpcyBmaWxlIG11c3QgYmUgc2lkZS1lZmZlY3QgaW1wb3J0ZWQgYnkgYE1haW5gLiAqL1xuXG5pbXBvcnQgeyBJbml0aWFsaXplTWVzc2FnZUxvb3AgfSBmcm9tIFwiQHNvcnJlbGwvd20td2luZG93c1wiO1xuXG5jb25zdCBSdW5Jbml0aWFsaXplTWVzc2FnZUxvb3AgPSAoKTogdm9pZCA9Plxue1xuICAgIEluaXRpYWxpemVNZXNzYWdlTG9vcCgoKSA9PlxuICAgIHtcblxuICAgIH0pO1xufTtcblxuUnVuSW5pdGlhbGl6ZU1lc3NhZ2VMb29wKCk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhc3NlcnRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYnVmZmVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNoaWxkX3Byb2Nlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29uc3RhbnRzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNyeXB0b1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJldmVudHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJvc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInN0cmVhbVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ0dHlcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXJsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV0aWxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwid29ya2VyX3RocmVhZHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiemxpYlwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfX3NvcnJlbGxfd21fd2luZG93c19fOyIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZGVmUHJvcCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbnZhciBfX2dldE93blByb3BEZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbnZhciBfX2dldE93blByb3BOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO1xudmFyIF9faGFzT3duUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgX19leHBvcnQgPSAodGFyZ2V0LCBhbGwpID0+IHtcbiAgZm9yICh2YXIgbmFtZSBpbiBhbGwpXG4gICAgX19kZWZQcm9wKHRhcmdldCwgbmFtZSwgeyBnZXQ6IGFsbFtuYW1lXSwgZW51bWVyYWJsZTogdHJ1ZSB9KTtcbn07XG52YXIgX19jb3B5UHJvcHMgPSAodG8sIGZyb20sIGV4Y2VwdCwgZGVzYykgPT4ge1xuICBpZiAoZnJvbSAmJiB0eXBlb2YgZnJvbSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgZnJvbSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZm9yIChsZXQga2V5IG9mIF9fZ2V0T3duUHJvcE5hbWVzKGZyb20pKVxuICAgICAgaWYgKCFfX2hhc093blByb3AuY2FsbCh0bywga2V5KSAmJiBrZXkgIT09IGV4Y2VwdClcbiAgICAgICAgX19kZWZQcm9wKHRvLCBrZXksIHsgZ2V0OiAoKSA9PiBmcm9tW2tleV0sIGVudW1lcmFibGU6ICEoZGVzYyA9IF9fZ2V0T3duUHJvcERlc2MoZnJvbSwga2V5KSkgfHwgZGVzYy5lbnVtZXJhYmxlIH0pO1xuICB9XG4gIHJldHVybiB0bztcbn07XG52YXIgX190b0NvbW1vbkpTID0gKG1vZCkgPT4gX19jb3B5UHJvcHMoX19kZWZQcm9wKHt9LCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KSwgbW9kKTtcblxuLy8gU291cmNlL0Z1bmN0aW9uYWwvaW5kZXgudHNcbnZhciBGdW5jdGlvbmFsX2V4cG9ydHMgPSB7fTtcbl9fZXhwb3J0KEZ1bmN0aW9uYWxfZXhwb3J0cywge1xuICBJZGVudGl0eTogKCkgPT4gSWRlbnRpdHlcbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBfX3RvQ29tbW9uSlMoRnVuY3Rpb25hbF9leHBvcnRzKTtcblxuLy8gU291cmNlL0Z1bmN0aW9uYWwvRnVuY3Rpb25hbC50c1xuZnVuY3Rpb24gSWRlbnRpdHkoLi4uQXJndW1lbnRzKSB7XG4gIHJldHVybiBBcmd1bWVudHM7XG59XG4vKipcbiAqIEBmaWxlICAgICAgRnVuY3Rpb25hbC50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG4vKipcbiAqIEBmaWxlICAgICAgRnVuY3Rpb25hbC5UeXBlcy50c1xuICogQGF1dGhvciAgICBHYWdlIFNvcnJlbGwgPGdhZ2VAc29ycmVsbC5zaD5cbiAqIEBjb3B5cmlnaHQgKGMpIDIwMjYgR2FnZSBTb3JyZWxsXG4gKiBAbGljZW5zZSAgIE1JVFxuICovXG4vKipcbiAqIEBmaWxlICAgICAgaW5kZXgudHNcbiAqIEBhdXRob3IgICAgR2FnZSBTb3JyZWxsIDxnYWdlQHNvcnJlbGwuc2g+XG4gKiBAY29weXJpZ2h0IChjKSAyMDI2IEdhZ2UgU29ycmVsbFxuICogQGxpY2Vuc2UgICBNSVRcbiAqL1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnVuY3Rpb25hbC5janMubWFwXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHRsb2FkZWQ6IGZhbHNlLFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgbW9kdWxlSWQgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4vLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuX193ZWJwYWNrX3JlcXVpcmVfXy5jID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fO1xuXG4iLCJ2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgPyAob2JqKSA9PiAoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaikpIDogKG9iaikgPT4gKG9iai5fX3Byb3RvX18pO1xudmFyIGxlYWZQcm90b3R5cGVzO1xuLy8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4vLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbi8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuLy8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4vLyBtb2RlICYgMTY6IHJldHVybiB2YWx1ZSB3aGVuIGl0J3MgUHJvbWlzZS1saWtlXG4vLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuXHRpZihtb2RlICYgMSkgdmFsdWUgPSB0aGlzKHZhbHVlKTtcblx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcblx0aWYodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSkge1xuXHRcdGlmKChtb2RlICYgNCkgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuXHRcdGlmKChtb2RlICYgMTYpICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nKSByZXR1cm4gdmFsdWU7XG5cdH1cblx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcblx0dmFyIGRlZiA9IHt9O1xuXHRsZWFmUHJvdG90eXBlcyA9IGxlYWZQcm90b3R5cGVzIHx8IFtudWxsLCBnZXRQcm90byh7fSksIGdldFByb3RvKFtdKSwgZ2V0UHJvdG8oZ2V0UHJvdG8pXTtcblx0Zm9yKHZhciBjdXJyZW50ID0gbW9kZSAmIDIgJiYgdmFsdWU7ICh0eXBlb2YgY3VycmVudCA9PSAnb2JqZWN0JyB8fCB0eXBlb2YgY3VycmVudCA9PSAnZnVuY3Rpb24nKSAmJiAhfmxlYWZQcm90b3R5cGVzLmluZGV4T2YoY3VycmVudCk7IGN1cnJlbnQgPSBnZXRQcm90byhjdXJyZW50KSkge1xuXHRcdE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGN1cnJlbnQpLmZvckVhY2goKGtleSkgPT4gKGRlZltrZXldID0gKCkgPT4gKHZhbHVlW2tleV0pKSk7XG5cdH1cblx0ZGVmWydkZWZhdWx0J10gPSAoKSA9PiAodmFsdWUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGRlZik7XG5cdHJldHVybiBucztcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5mID0ge307XG4vLyBUaGlzIGZpbGUgY29udGFpbnMgb25seSB0aGUgZW50cnkgY2h1bmsuXG4vLyBUaGUgY2h1bmsgbG9hZGluZyBmdW5jdGlvbiBmb3IgYWRkaXRpb25hbCBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18uZSA9IChjaHVua0lkKSA9PiB7XG5cdHJldHVybiBQcm9taXNlLmFsbChPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLmYpLnJlZHVjZSgocHJvbWlzZXMsIGtleSkgPT4ge1xuXHRcdF9fd2VicGFja19yZXF1aXJlX18uZltrZXldKGNodW5rSWQsIHByb21pc2VzKTtcblx0XHRyZXR1cm4gcHJvbWlzZXM7XG5cdH0sIFtdKSk7XG59OyIsIi8vIFRoaXMgZnVuY3Rpb24gYWxsb3cgdG8gcmVmZXJlbmNlIGFzeW5jIGNodW5rc1xuX193ZWJwYWNrX3JlcXVpcmVfXy51ID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLmJ1bmRsZS5kZXYuanNcIjtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubm1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUucGF0aHMgPSBbXTtcblx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRyZXR1cm4gbW9kdWxlO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgY2h1bmtzXG4vLyBcIjFcIiBtZWFucyBcImxvYWRlZFwiLCBvdGhlcndpc2Ugbm90IGxvYWRlZCB5ZXRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAxXG59O1xuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbnZhciBpbnN0YWxsQ2h1bmsgPSAoY2h1bmspID0+IHtcblx0dmFyIG1vcmVNb2R1bGVzID0gY2h1bmsubW9kdWxlcywgY2h1bmtJZHMgPSBjaHVuay5pZHMsIHJ1bnRpbWUgPSBjaHVuay5ydW50aW1lO1xuXHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0fVxuXHR9XG5cdGlmKHJ1bnRpbWUpIHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBjaHVua0lkcy5sZW5ndGg7IGkrKylcblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZHNbaV1dID0gMTtcblxufTtcblxuLy8gcmVxdWlyZSgpIGNodW5rIGxvYWRpbmcgZm9yIGphdmFzY3JpcHRcbl9fd2VicGFja19yZXF1aXJlX18uZi5yZXF1aXJlID0gKGNodW5rSWQsIHByb21pc2VzKSA9PiB7XG5cdC8vIFwiMVwiIGlzIHRoZSBzaWduYWwgZm9yIFwiYWxyZWFkeSBsb2FkZWRcIlxuXHRpZighaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0aWYodHJ1ZSkgeyAvLyBhbGwgY2h1bmtzIGhhdmUgSlNcblx0XHRcdHZhciBpbnN0YWxsZWRDaHVuayA9IHJlcXVpcmUoXCIuL1wiICsgX193ZWJwYWNrX3JlcXVpcmVfXy51KGNodW5rSWQpKTtcblx0XHRcdGlmICghaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRcdGluc3RhbGxDaHVuayhpbnN0YWxsZWRDaHVuayk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDE7XG5cdH1cbn07XG5cbi8vIG5vIGV4dGVybmFsIGluc3RhbGwgY2h1bmtcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdCIsIiIsIi8vIG1vZHVsZSBjYWNoZSBhcmUgdXNlZCBzbyBlbnRyeSBpbmxpbmluZyBpcyBkaXNhYmxlZFxuLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL1NvdXJjZS9NYWluL0luaXRpYWxpemUvRW50cnlQb2ludC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==