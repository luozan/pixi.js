/**
 * 当前PIXI版本的字符串
 *
 * @static
 * @constant
 * @memberof PIXI
 * @name VERSION
 * @type {string}
 */
export const VERSION = __VERSION__;

/**
 * 2π
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {number}
 */
export const PI_2 = Math.PI * 2;

/**
 * 弧度转角度
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {number}
 */
export const RAD_TO_DEG = 180 / Math.PI;

/**
 * 角度转弧度
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {number}
 */
export const DEG_TO_RAD = Math.PI / 180;

/**
 * 标识渲染器类型的常量
 *
 * @static
 * @constant
 * @memberof PIXI
 * @name RENDERER_TYPE
 * @type {object}
 * @property {number} UNKNOWN - 未知渲染类型。
 * @property {number} WEBGL - WebGL渲染类型。
 * @property {number} CANVAS - Canvas渲染类型。
 */
export const RENDERER_TYPE = {
    UNKNOWN:    0,
    WEBGL:      1,
    CANVAS:     2,
};

/**
 * PIXI所支持的各种混合模式。
 *
 * 注意 - WebGL渲染器仅支持NORMAL，ADD，MULTIPLY和SCREEN混合模式。
 * 其他默认和NORMAL同样效果。
 *
 * @static
 * @constant
 * @memberof PIXI
 * @name BLEND_MODES
 * @type {object}
 * @property {number} NORMAL
 * @property {number} ADD
 * @property {number} MULTIPLY
 * @property {number} SCREEN
 * @property {number} OVERLAY
 * @property {number} DARKEN
 * @property {number} LIGHTEN
 * @property {number} COLOR_DODGE
 * @property {number} COLOR_BURN
 * @property {number} HARD_LIGHT
 * @property {number} SOFT_LIGHT
 * @property {number} DIFFERENCE
 * @property {number} EXCLUSION
 * @property {number} HUE
 * @property {number} SATURATION
 * @property {number} COLOR
 * @property {number} LUMINOSITY
 */
export const BLEND_MODES = {
    NORMAL:         0,
    ADD:            1,
    MULTIPLY:       2,
    SCREEN:         3,
    OVERLAY:        4,
    DARKEN:         5,
    LIGHTEN:        6,
    COLOR_DODGE:    7,
    COLOR_BURN:     8,
    HARD_LIGHT:     9,
    SOFT_LIGHT:     10,
    DIFFERENCE:     11,
    EXCLUSION:      12,
    HUE:            13,
    SATURATION:     14,
    COLOR:          15,
    LUMINOSITY:     16,
    NORMAL_NPM:     17,
    ADD_NPM:        18,
    SCREEN_NPM:     19,
};

/**
 * 各种WebGL绘制模式。在某些特定的情况和特定的渲染器下，这些可以被用来指定所使用的GL drawMode。
 *
 * @static
 * @constant
 * @memberof PIXI
 * @name DRAW_MODES
 * @type {object}
 * @property {number} POINTS
 * @property {number} LINES
 * @property {number} LINE_LOOP
 * @property {number} LINE_STRIP
 * @property {number} TRIANGLES
 * @property {number} TRIANGLE_STRIP
 * @property {number} TRIANGLE_FAN
 */
export const DRAW_MODES = {
    POINTS:         0,
    LINES:          1,
    LINE_LOOP:      2,
    LINE_STRIP:     3,
    TRIANGLES:      4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN:   6,
};

/**
 * PIXI所支持的缩放模式。
 *
 * {@link PIXI.settings.SCALE_MODE} 缩放模式影响将来缩放操作的默认模式。
 * 它可以被重新指定为LINEAR或者NEAREST中的任何一个，这取决于哪个更合适。
 * It can be re-assigned to either LINEAR or NEAREST, depending upon suitability.
 *
 * @static
 * @constant
 * @memberof PIXI
 * @name SCALE_MODES
 * @type {object}
 * @property {number} LINEAR 平滑缩放
 * @property {number} NEAREST 像素化缩放
 */
export const SCALE_MODES = {
    LINEAR:     0,
    NEAREST:    1,
};

/**
 * PIXI所支持的循环模式。
 *
 * {@link PIXI.settings.WRAP_MODE} 循环模式影响将来操作的默认循环模式。
 * 它可以被重新指定为CLAMP或者PEPEAT中的任何一个，这取决于哪个更合适。
 * 如果纹理宽高并非是2的次方，那么不管是不是WebGL都将使用CLAMP，如果纹理宽高是2的次方，那么只会使用PEPEAT。
 *  
 * 该属性只对WebGL有效。
 *
 * @static
 * @constant
 * @name WRAP_MODES
 * @memberof PIXI
 * @type {object}
 * @property {number} CLAMP - 拉伸纹理
 * @property {number} REPEAT - 重复平铺纹理
 * @property {number} MIRRORED_REPEAT - 镜像重复平铺纹理
 */
export const WRAP_MODES = {
    CLAMP:          0,
    REPEAT:         1,
    MIRRORED_REPEAT: 2,
};

/**
 * PIXI所支持的垃圾回收模式。
 *
 * {@link PIXI.settings.GC_MODE} PixiJS纹理的垃圾回收模式是AUTO。
 * 如果设置给GC_MODE，渲染器将会不时检查纹理的使用情况。如果纹理在一段时间内没有使用，则会从GPU移除。
 * 当再次请求被移除的资源时，则会重新上传。这一切会在幕后悄然无声地进行，应当确认GPU不会被塞满。
 *
 * 对于移动设备非常方便！
 * 该属性只对WebGL有效。
 *
 * @static
 * @constant
 * @name GC_MODES
 * @memberof PIXI
 * @type {object}
 * @property {number} AUTO - 定期自动地进行垃圾回收。
 * @property {number} MANUAL - 手动进行垃圾回收。
 */
export const GC_MODES = {
    AUTO:           0,
    MANUAL:         1,
};

/**
 * 图像类型扩展名的正则表达式。
 *
 * @static
 * @constant
 * @memberof PIXI
 * @type {RegExp|string}
 * @example `image.png`
 */
export const URL_FILE_EXTENSION = /\.(\w{3,4})(?:$|\?|#)/i;

/**
 * data URL的正则表达式。
 * Based on: {@link https://github.com/ragingwind/data-uri-regex}
 *
 * @static
 * @constant
 * @name DATA_URI
 * @memberof PIXI
 * @type {RegExp|string}
 * @example data:image/png;base64
 */
export const DATA_URI = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;(charset=[\w-]+|base64))?,(.*)/i;

/**
 * SVG宽高的正则表达式。
 *
 * @static
 * @constant
 * @name SVG_SIZE
 * @memberof PIXI
 * @type {RegExp|string}
 * @example &lt;svg width="100" height="100"&gt;&lt;/svg&gt;
 */
export const SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i; // eslint-disable-line max-len

/**
 * 用来标识形状的常量，主要是为了防止“instanceof”调用。
 *
 * @static
 * @constant
 * @name SHAPES
 * @memberof PIXI
 * @type {object}
 * @property {number} POLY 多边形
 * @property {number} RECT 矩形
 * @property {number} CIRC 圆形
 * @property {number} ELIP 椭圆
 * @property {number} RREC 圆角矩形
 */
export const SHAPES = {
    POLY: 0,
    RECT: 1,
    CIRC: 2,
    ELIP: 3,
    RREC: 4,
};

/**
 * 指定shader浮点数精度的常量。
 *
 * @static
 * @constant
 * @name PRECISION
 * @memberof PIXI
 * @type {object}
 * @property {string} LOW='lowp'
 * @property {string} MEDIUM='mediump'
 * @property {string} HIGH='highp'
 */
export const PRECISION = {
    LOW: 'lowp',
    MEDIUM: 'mediump',
    HIGH: 'highp',
};

/**
 * 指定变换类型的常量。
 *
 * @static
 * @constant
 * @name TRANSFORM_MODE
 * @memberof PIXI
 * @type {object}
 * @property {number} STATIC
 * @property {number} DYNAMIC
 */
export const TRANSFORM_MODE = {
    STATIC:     0,
    DYNAMIC:    1,
};

/**
 * 在文本上定义渐变类型的常量。
 *
 * @static
 * @constant
 * @name TEXT_GRADIENT
 * @memberof PIXI
 * @type {object}
 * @property {number} LINEAR_VERTICAL 垂直渐变
 * @property {number} LINEAR_HORIZONTAL 线性渐变
 */
export const TEXT_GRADIENT = {
    LINEAR_VERTICAL: 0,
    LINEAR_HORIZONTAL: 1,
};

/**
 * 表示更新优先顺序，用于PIXI内部的类注册到{@link PIXI.ticker.Ticker}对象时。
 * 高优先级项会第一时间更新，低优先级项，例如渲染，则会在之后更新。
 *
 * @static
 * @constant
 * @name UPDATE_PRIORITY
 * @memberof PIXI
 * @type {object}
 * @property {number} INTERACTION=50 高优先级, 用于{@link PIXI.interaction.InteractionManager}
 * @property {number} HIGH=25 高优先级更新, 用于{@link PIXI.VideoBaseTexture} 和 {@link PIXI.extras.AnimatedSprite}
 * @property {number} NORMAL=0 默认优先级，用于ticker events，参考{@link PIXI.ticker.Ticker#add}。
 * @property {number} LOW=-25 低优先级，用于{@link PIXI.Application} 渲染时.
 * @property {number} UTILITY=-50 最低优先级，用于通用的{@link PIXI.prepare.BasePrepare}.
 */
export const UPDATE_PRIORITY = {
    INTERACTION: 50,
    HIGH: 25,
    NORMAL: 0,
    LOW: -25,
    UTILITY: -50,
};
