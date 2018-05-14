import maxRecommendedTextures from './utils/maxRecommendedTextures';
import canUploadSameBuffer from './utils/canUploadSameBuffer';

/**
 * 用户的可自定义的全局设置，用于覆盖默认的PIXI设置， such
 * 例如一个渲染器的默认分辨率、帧率、浮点精度等等。
 * @example
 * // 使用本地窗口分辨率作为默认分辨率
 * // 在渲染的时候将会支持高像素密度显示
 * PIXI.settings.RESOLUTION = window.devicePixelRatio.
 *
 * // 在缩放的时候禁用插值，将使纹理像素化
 * PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
 * @namespace PIXI.settings
 */
export default {

    /**
     * 帧率，每毫秒的目标帧数。
     *
     * @static
     * @memberof PIXI.settings
     * @type {number}
     * @default 0.06
     */
    TARGET_FPMS: 0.06,

    /**
     * 如果设置为true，WebGL会尝试在默认情况下使用纹理金字塔（mipmap）。
     * 只有当被上传的基础纹理尺寸为2的次方时，纹理金字塔操作才会成功。
     *
     * @static
     * @memberof PIXI.settings
     * @type {boolean}
     * @default true
     */
    MIPMAP_TEXTURES: true,

    /**
     * 渲染器的默认分辨率/设备像素比。
     *
     * @static
     * @memberof PIXI.settings
     * @type {number}
     * @default 1
     */
    RESOLUTION: 1,

    /**
     * 默认滤镜分辨率。
     *
     * @static
     * @memberof PIXI.settings
     * @type {number}
     * @default 1
     */
    FILTER_RESOLUTION: 1,

    /**
     * 该设备支持的最大纹理数量。
     *
     * @static
     * @memberof PIXI.settings
     * @type {number}
     * @default 32
     */
    SPRITE_MAX_TEXTURES: maxRecommendedTextures(32),

    // TODO: maybe change to SPRITE.BATCH_SIZE: 2000
    // TODO: maybe add PARTICLE.BATCH_SIZE: 15000

    /**
     * 默认精灵批量大小。
     *
     * 该默认值用来平衡桌面和移动设备。
     *
     * @static
     * @memberof PIXI.settings
     * @type {number}
     * @default 4096
     */
    SPRITE_BATCH_SIZE: 4096,

    /**
     * 表示URL的前缀是视网膜资源(retina asset)。
     *
     * @static
     * @memberof PIXI.settings
     * @type {RegExp}
     * @example `@2x`
     * @default /@([0-9\.]+)x/
     */
    RETINA_PREFIX: /@([0-9\.]+)x/,

    /**
     * {@link PIXI.WebGLRenderer}和{@link PIXI.CanvasRenderer}的默认渲染选项。
     *
     * @static
     * @constant
     * @memberof PIXI.settings
     * @type {object}
     * @property {HTMLCanvasElement} view=null
     * @property {number} resolution=1
     * @property {boolean} antialias=false
     * @property {boolean} forceFXAA=false
     * @property {boolean} autoResize=false
     * @property {boolean} transparent=false
     * @property {number} backgroundColor=0x000000
     * @property {boolean} clearBeforeRender=true
     * @property {boolean} preserveDrawingBuffer=false
     * @property {boolean} roundPixels=false
     * @property {number} width=800
     * @property {number} height=600
     * @property {boolean} legacy=false
     */
    RENDER_OPTIONS: {
        view: null,
        antialias: false,
        forceFXAA: false,
        autoResize: false,
        transparent: false,
        backgroundColor: 0x000000,
        clearBeforeRender: true,
        preserveDrawingBuffer: false,
        roundPixels: false,
        width: 800,
        height: 600,
        legacy: false,
    },

    /**
     * 默认变换类型。
     *
     * @static
     * @memberof PIXI.settings
     * @type {PIXI.TRANSFORM_MODE}
     * @default PIXI.TRANSFORM_MODE.STATIC
     */
    TRANSFORM_MODE: 0,

    /**
     * 默认垃圾回收模式。
     *
     * @static
     * @memberof PIXI.settings
     * @type {PIXI.GC_MODES}
     * @default PIXI.GC_MODES.AUTO
     */
    GC_MODE: 0,

    /**
     * 垃圾回收的默认最大闲置数。
     *
     * @static
     * @memberof PIXI.settings
     * @type {number}
     * @default 3600
     */
    GC_MAX_IDLE: 60 * 60,

    /**
     * 垃圾回收的默认最大检查计数。
     *
     * @static
     * @memberof PIXI.settings
     * @type {number}
     * @default 600
     */
    GC_MAX_CHECK_COUNT: 60 * 10,

    /**
     * PIXI所支持的默认循环模式。
     *
     * @static
     * @memberof PIXI.settings
     * @type {PIXI.WRAP_MODES}
     * @default PIXI.WRAP_MODES.CLAMP
     */
    WRAP_MODE: 0,

    /**
     * PIXI所支持的缩放模型。
     *
     * @static
     * @memberof PIXI.settings
     * @type {PIXI.SCALE_MODES}
     * @default PIXI.SCALE_MODES.LINEAR
     */
    SCALE_MODE: 0,

    /**
     * 在顶点着色器中指定的默认浮点数精度。
     *
     * @static
     * @memberof PIXI.settings
     * @type {PIXI.PRECISION}
     * @default PIXI.PRECISION.HIGH
     */
    PRECISION_VERTEX: 'highp',

    /**
     * 在片元着色器中指定的默认浮点数精度。
     *
     * @static
     * @memberof PIXI.settings
     * @type {PIXI.PRECISION}
     * @default PIXI.PRECISION.MEDIUM
     */
    PRECISION_FRAGMENT: 'mediump',

    /**
     * 在单独的一帧中能否上传同样的缓冲。
     *
     * @static
     * @constant
     * @memberof PIXI.settings
     * @type {boolean}
     */
    CAN_UPLOAD_SAME_BUFFER: canUploadSameBuffer(),

    /**
     * 默认网格`canvasPadding`.
     *
     * @see PIXI.mesh.Mesh#canvasPadding
     * @static
     * @constant
     * @memberof PIXI.settings
     * @type {number}
     */
    MESH_CANVAS_PADDING: 0,
};
