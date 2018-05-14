import { autoDetectRenderer } from './autoDetectRenderer';
import Container from './display/Container';
import { shared, Ticker } from './ticker';
import settings from './settings';
import { UPDATE_PRIORITY } from './const';

/**
 * 使用这个类，可以轻松的创建一个PIXI应用。
 * 它会自动的创建渲染器，心跳定时器(帧循环)，主容器(舞台)。
 * Convenience class to create a new PIXI application.
 * This class automatically creates the renderer, ticker
 * and root container.
 *
 * @example
 * // 创建应用
 * const app = new PIXI.Application();
 *
 * // 添加视图(view)到DOM
 * document.body.appendChild(app.view);
 *
 * // 演示添加一个可视(display)对象
 * app.stage.addChild(PIXI.Sprite.fromImage('something.png'));
 *
 * @class
 * @memberof PIXI
 */
export default class Application
{
    // eslint-disable-next-line valid-jsdoc
    /**
     * @param {object} [options] - 渲染器选项参数
     * @param {boolean} [options.autoStart=true] - 在实例化后自动启动帧循环开始渲染。
     *     注意，在已经运行过以后，哪怕设置这个参数为false，也不会停止共享的帧循环(shared ticker)，
     *     即使你设置options.sharedTicker为true。你只能亲自停止它。
     * @param {number} [options.width=800] - 渲染器视图的宽度
     * @param {number} [options.height=600] - 渲染器视图的高
     * @param {HTMLCanvasElement} [options.view] - 传入一个canvas作为渲染用的视图，可选, optional
     * @param {boolean} [options.transparent=false] - 渲染视图是否透明，默认为false
     * @param {boolean} [options.antialias=false] - 设置抗锯齿（目前只在chrome中有效）
     * @param {boolean} [options.preserveDrawingBuffer=false] - 激活绘图缓冲保存。如果你需要在WebGL渲染的情况下调用toDataUrl，请设置该属性为true。
     * @param {number} [options.resolution=1] - 渲染器的分辨率/设备的像素比（The resolution / device pixel ratio），Apple的视网膜(retina)屏幕下，该值为2。 
     * @param {boolean} [options.forceCanvas=false] - 强制使用Canvas渲染，而不使用WebGL
     * @param {number} [options.backgroundColor=0x000000] - 被渲染区域的背景颜色（options.transparent为false才会显示）
     * @param {boolean} [options.clearBeforeRender=true] - 是否清除画布上的内容后再渲染
     * @param {boolean} [options.roundPixels=false] - 如果设置为true，PixiJS会使用Math.floor()对x/y坐标值向下取整，从而停止像素插值
     * @param {boolean} [options.forceFXAA=false] - 在原生上应用FXAA抗锯齿，FXAA更快，但可能也并不总是那么好 **只支持WebGL渲染**
     * @param {boolean} [options.legacy=false] - 设置为`true`以确保兼容少数旧机型，如果你的项目出现莫名其妙的闪屏，可以尝试设置该值为true。**只针对WebGL渲染**
     * @param {string} [options.powerPreference] - 该参数会传给WebGL上下文，对拥有双显卡的设备可以设置为"high-performance" **只针对WebGL渲染**
     * @param {boolean} [options.sharedTicker=false] - 设置为`true`会使用PIXI.ticker.shared，设置为`false`，会创建一个新的ticker
     * @param {boolean} [options.sharedLoader=false] - 设置为`true`会使用PIXI.loaders.shared, 设置为`false`，会创建以个新的Loader.
     */
    constructor(options, arg2, arg3, arg4, arg5)
    {
        // Support for constructor(width, height, options, noWebGL, useSharedTicker)
        if (typeof options === 'number')
        {
            options = Object.assign({
                width: options,
                height: arg2 || settings.RENDER_OPTIONS.height,
                forceCanvas: !!arg4,
                sharedTicker: !!arg5,
            }, arg3);
        }

        /**
         * 选项参数
         * @member {object}
         * @protected
         */
        this._options = options = Object.assign({
            autoStart: true,
            sharedTicker: false,
            forceCanvas: false,
            sharedLoader: false,
        }, options);

        /**
         * 会自动判断是否支持WebGL，如果支持，会使用WebGL渲染器，否则使用Canvas渲染器
         * @member {PIXI.WebGLRenderer|PIXI.CanvasRenderer}
         */
        this.renderer = autoDetectRenderer(options);

        /**
         * 舞台是被渲染的主可视化容器（root display container）
         * @member {PIXI.Container}
         */
        this.stage = new Container();

        /**
         * 心跳定时器的引用
         * @member {PIXI.ticker.Ticker}
         * @private
         */
        this._ticker = null;

        /**
         * 用来渲染更新的心跳定时器
         * @member {PIXI.ticker.Ticker}
         * @default PIXI.ticker.shared
         */
        this.ticker = options.sharedTicker ? shared : new Ticker();

        // Start the rendering
        if (options.autoStart)
        {
            this.start();
        }
    }

    set ticker(ticker) // eslint-disable-line require-jsdoc
    {
        if (this._ticker)
        {
            this._ticker.remove(this.render, this);
        }
        this._ticker = ticker;
        if (ticker)
        {
            ticker.add(this.render, this, UPDATE_PRIORITY.LOW);
        }
    }
    get ticker() // eslint-disable-line require-jsdoc
    {
        return this._ticker;
    }

    /**
     * 渲染当前的舞台
     */
    render()
    {
        this.renderer.render(this.stage);
    }

    /**
     * 停止渲染
     */
    stop()
    {
        this._ticker.stop();
    }

    /**
     * 开始渲染
     */
    start()
    {
        this._ticker.start();
    }

    /**
     * 被渲染的Canvas元素
     * @member {HTMLCanvasElement}
     * @readonly
     */
    get view()
    {
        return this.renderer.view;
    }

    /**
     * 渲染器的屏幕矩形. 可以直接用它作为全屏的filterArea或者hitArea，这些操作都是安全的。
     * @member {PIXI.Rectangle}
     * @readonly
     */
    get screen()
    {
        return this.renderer.screen;
    }

    /**
     * 销毁，无法再使用
     * @param {Boolean} [removeView=false] Automatically remove canvas from DOM.
     */
    destroy(removeView)
    {
        if (this._ticker)
        {
            const oldTicker = this._ticker;

            this.ticker = null;
            oldTicker.destroy();
        }

        this.stage.destroy();
        this.stage = null;

        this.renderer.destroy(removeView);
        this.renderer = null;

        this._options = null;
    }
}
