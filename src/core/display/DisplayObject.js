import EventEmitter from 'eventemitter3';
import { TRANSFORM_MODE } from '../const';
import settings from '../settings';
import TransformStatic from './TransformStatic';
import Transform from './Transform';
import Bounds from './Bounds';
import { Rectangle } from '../math';
// _tempDisplayObjectParent = new DisplayObject();

/**
 * 在屏幕中被渲染的所有对象的基类。
 * 这是一个抽象类，应该从它继承，而不应当单独使用它。
 
 * @class
 * @extends EventEmitter
 * @memberof PIXI
 */
export default class DisplayObject extends EventEmitter
{
    /**
     *
     */
    constructor()
    {
        super();

        const TransformClass = settings.TRANSFORM_MODE === TRANSFORM_MODE.STATIC ? TransformStatic : Transform;

        this.tempDisplayObjectParent = null;

        // TODO: need to create Transform from factory
        /**
         * 这个对象的世界坐标变换和本地坐标变换。
         * 这个属性是只读属性，请不要赋值给它，除非你清楚地知道你在做什么。
         *
         * @member {PIXI.TransformBase}
         */
        this.transform = new TransformClass();

        /**
         * 透明度。
         *
         * @member {number}
         */
        this.alpha = 1;

        /**
         * 对象是否可见。如果为false，将不会绘制这个对象，同时updateTransform函数也不会被调用。
         *
         * 只影响该对象和它的子对象。你可以手动获取bound或者调用updateTransform。
         *
         * @member {boolean}
         */
        this.visible = true;

        /**
         * 该对象是否被渲染。如果设置为flase，将不会绘制这个对象，但仍然会调用updateTransform方法。
         *
         * 只影响该对象和它的子对象。你可以手动获取bound。
         *
         * @member {boolean}
         */
        this.renderable = true;

        /**
         * 包含这个显示对象的显示对象容器。
         *
         * @member {PIXI.Container}
         * @readonly
         */
        this.parent = null;

        /**
         * 用来乘以该显示对象的alpha。
         *
         * @member {number}
         * @readonly
         */
        this.worldAlpha = 1;

        /**
         * 滤镜的作用区域。这被用作优化，
         * 而不是用来在每一帧计算显示对象的大小。你可以设置这个矩形。
         *
         * 也可以作为一个交互事件的遮罩。
         *
         * @member {PIXI.Rectangle}
         */
        this.filterArea = null;

        this._filters = null;
        this._enabledFilters = null;

        /**
         * 对象的包围盒，这被用来计算并且储存显示对象的包围盒。
         *
         * @member {PIXI.Rectangle}
         * @private
         */
        this._bounds = new Bounds();
        this._boundsID = 0;
        this._lastBoundsID = -1;
        this._boundsRect = null;
        this._localBoundsRect = null;

        /**
         * 缓存了对象的遮罩。
         *
         * @member {PIXI.Graphics|PIXI.Sprite}
         * @private
         */
        this._mask = null;

        /**
         * 对象是否被调用destroy()销毁。如果该值为true，则不应该再使用这个对象。
         *
         * @member {boolean}
         * @private
         * @readonly
         */
        this._destroyed = false;

        /**
         * 当显示对象被添加到容器中时触发。
         *
         * @event PIXI.DisplayObject#added
         * @param {PIXI.Container} container - 添加进的容器。
         */

        /**
         * 当这个显示对象从容器中移除时触发。
         *
         * @event PIXI.DisplayObject#removed
         * @param {PIXI.Container} container - 被从中移除的容器。
         */
    }

    /**
     * @private
     * @member {PIXI.DisplayObject}
     */
    get _tempDisplayObjectParent()
    {
        if (this.tempDisplayObjectParent === null)
        {
            this.tempDisplayObjectParent = new DisplayObject();
        }

        return this.tempDisplayObjectParent;
    }

    /**
     * 渲染时更新对象的变换
     *
     * TODO - Optimization pass!
     */
    updateTransform()
    {
        this.transform.updateTransform(this.parent.transform);
        // multiply the alphas..
        this.worldAlpha = this.alpha * this.parent.worldAlpha;

        this._bounds.updateID++;
    }

    /**
     * 递归更新从容器根部到这个对象为止的所有对象的变换。
     * 用于toLocal()的内部函数。
     */
    _recursivePostUpdateTransform()
    {
        if (this.parent)
        {
            this.parent._recursivePostUpdateTransform();
            this.transform.updateTransform(this.parent.transform);
        }
        else
        {
            this.transform.updateTransform(this._tempDisplayObjectParent.transform);
        }
    }

    /**
     * 重新获取显示对象的包围盒，返回一个矩形对象。
     *
     * @param {boolean} skipUpdate - 设置为true将停止正在进行更新中的场景图变换。
     *  这意味着这个计算返回的数据可能过期，但是这么做会提升性能。
     * @param {PIXI.Rectangle} rect - 可选的参数，传入一个矩形对象储存计算出的包围盒结果。
     * @return {PIXI.Rectangle} 矩形类型的边界范围。
     */
    getBounds(skipUpdate, rect)
    {
        if (!skipUpdate)
        {
            if (!this.parent)
            {
                this.parent = this._tempDisplayObjectParent;
                this.updateTransform();
                this.parent = null;
            }
            else
            {
                this._recursivePostUpdateTransform();
                this.updateTransform();
            }
        }

        if (this._boundsID !== this._lastBoundsID)
        {
            this.calculateBounds();
        }

        if (!rect)
        {
            if (!this._boundsRect)
            {
                this._boundsRect = new Rectangle();
            }

            rect = this._boundsRect;
        }

        return this._bounds.getRectangle(rect);
    }

    /**
     * 重新获取显示对象的本地坐标系包围盒，返回一个Rectangle对象。
     *
     * @param {PIXI.Rectangle} [rect] - 可选的参数，传入一个矩形对象储存计算出的包围盒的结果。
     * @return {PIXI.Rectangle} 矩形类型的边界范围。
     */
    getLocalBounds(rect)
    {
        const transformRef = this.transform;
        const parentRef = this.parent;

        this.parent = null;
        this.transform = this._tempDisplayObjectParent.transform;

        if (!rect)
        {
            if (!this._localBoundsRect)
            {
                this._localBoundsRect = new Rectangle();
            }

            rect = this._localBoundsRect;
        }

        const bounds = this.getBounds(false, rect);

        this.parent = parentRef;
        this.transform = transformRef;

        return bounds;
    }

    /**
     * 将一个相对于该显示对象的本地坐标转换为全局坐标。
     *
     * @param {PIXI.Point} position - 相对于该显示对象的本地坐标。
     * @param {PIXI.Point} [point] - 一个用来储存结果的Point对象，可选。
     *  （否则将new一个Point对象）
     * @param {boolean} [skipUpdate=false] - 是否跳过更新变换。
     * @return {PIXI.Point} 一个Point对象，表示转换后的坐标。
     */
    toGlobal(position, point, skipUpdate = false)
    {
        if (!skipUpdate)
        {
            this._recursivePostUpdateTransform();

            // this parent check is for just in case the item is a root object.
            // If it is we need to give it a temporary parent so that displayObjectUpdateTransform works correctly
            // this is mainly to avoid a parent check in the main loop. Every little helps for performance :)
            if (!this.parent)
            {
                this.parent = this._tempDisplayObjectParent;
                this.displayObjectUpdateTransform();
                this.parent = null;
            }
            else
            {
                this.displayObjectUpdateTransform();
            }
        }

        // don't need to update the lot
        return this.worldTransform.apply(position, point);
    }

    /**
     * 将一个世界坐标转换为相对于该显示对象的本地坐标。
     *
     * @param {PIXI.Point} position - 相对于世界坐标系原点的坐标。
     * @param {PIXI.DisplayObject} [from] - 用来计算全局坐标的DisplayObject。
     * @param {PIXI.Point} [point] - 一个用来储存结果的Point对象，可选。
     *  (否则将new一个Point对象)
     * @param {boolean} [skipUpdate=false] - 是否跳过更新变换。
     * @return {PIXI.Point} 一个Point对象，表示转换后的坐标。
     */
    toLocal(position, from, point, skipUpdate)
    {
        if (from)
        {
            position = from.toGlobal(position, point, skipUpdate);
        }

        if (!skipUpdate)
        {
            this._recursivePostUpdateTransform();

            // this parent check is for just in case the item is a root object.
            // If it is we need to give it a temporary parent so that displayObjectUpdateTransform works correctly
            // this is mainly to avoid a parent check in the main loop. Every little helps for performance :)
            if (!this.parent)
            {
                this.parent = this._tempDisplayObjectParent;
                this.displayObjectUpdateTransform();
                this.parent = null;
            }
            else
            {
                this.displayObjectUpdateTransform();
            }
        }

        // simply apply the matrix..
        return this.worldTransform.applyInverse(position, point);
    }

    /**
     * 使用WebGL渲染器渲染对象。
     *
     * @param {PIXI.WebGLRenderer} renderer - 渲染器
     */
    renderWebGL(renderer) // eslint-disable-line no-unused-vars
    {
        // OVERWRITE;
    }

    /**
     * 使用Canvas渲染器渲染对象。
     *
     * @param {PIXI.CanvasRenderer} renderer - 渲染器
     */
    renderCanvas(renderer) // eslint-disable-line no-unused-vars
    {
        // OVERWRITE;
    }

    /**
     * 设置该显示对象的父容器
     *
     * @param {PIXI.Container} container - 用来添加该显示对象的容器。
     * @return {PIXI.Container} 该显示对象被添加进的容器。
     */
    setParent(container)
    {
        if (!container || !container.addChild)
        {
            throw new Error('setParent: Argument must be a Container');
        }

        container.addChild(this);

        return container;
    }

    /**
     * 用来一次性设置position、scale、skew和pivot的方法。
     *
     * @param {number} [x=0] - The X position
     * @param {number} [y=0] - The Y position
     * @param {number} [scaleX=1] - The X scale value
     * @param {number} [scaleY=1] - The Y scale value
     * @param {number} [rotation=0] - The rotation
     * @param {number} [skewX=0] - The X skew value
     * @param {number} [skewY=0] - The Y skew value
     * @param {number} [pivotX=0] - The X pivot value
     * @param {number} [pivotY=0] - The Y pivot value
     * @return {PIXI.DisplayObject} The DisplayObject instance
     */
    setTransform(x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0, skewX = 0, skewY = 0, pivotX = 0, pivotY = 0)
    {
        this.position.x = x;
        this.position.y = y;
        this.scale.x = !scaleX ? 1 : scaleX;
        this.scale.y = !scaleY ? 1 : scaleY;
        this.rotation = rotation;
        this.skew.x = skewX;
        this.skew.y = skewY;
        this.pivot.x = pivotX;
        this.pivot.y = pivotY;

        return this;
    }

    /**
     * 显示对象通用的基本销毁方法。
     * 这会自动的将显示对象从其父容器中移除，同时会移除所有事件监听器和内部引用。
     * 不要在调用该方法后，使用该显示对象。
     *
     */
    destroy()
    {
        this.removeAllListeners();
        if (this.parent)
        {
            this.parent.removeChild(this);
        }
        this.transform = null;

        this.parent = null;

        this._bounds = null;
        this._currentBounds = null;
        this._mask = null;

        this.filterArea = null;

        this.interactive = false;
        this.interactiveChildren = false;

        this._destroyed = true;
    }

    /**
     * 该显示对象相对于父对象本地坐标系的X轴坐标位置。
     * position.x的别名
     *
     * @member {number}
     */
    get x()
    {
        return this.position.x;
    }

    set x(value) // eslint-disable-line require-jsdoc
    {
        this.transform.position.x = value;
    }

    /**
     * 该显示对象相对于父对象本地坐标系的Y轴坐标位置。
     * position.y的别名
     *
     * @member {number}
     */
    get y()
    {
        return this.position.y;
    }

    set y(value) // eslint-disable-line require-jsdoc
    {
        this.transform.position.y = value;
    }

    /**
     * 该对象当前基于世界（父对象）因素的变换。
     *
     * @member {PIXI.Matrix}
     * @readonly
     */
    get worldTransform()
    {
        return this.transform.worldTransform;
    }

    /**
     * 该对象当前受本地因素（postion、scale等等）影响的变换
     *
     * @member {PIXI.Matrix}
     * @readonly
     */
    get localTransform()
    {
        return this.transform.localTransform;
    }

    /**
     * 该对象相对于父对象本地坐标系的坐标位置。
     * Assignment by value since pixi-v4.
     *
     * @member {PIXI.Point|PIXI.ObservablePoint}
     */
    get position()
    {
        return this.transform.position;
    }

    set position(value) // eslint-disable-line require-jsdoc
    {
        this.transform.position.copy(value);
    }

    /**
     * 对象的缩放系数。
     * Assignment by value since pixi-v4.
     *
     * @member {PIXI.Point|PIXI.ObservablePoint}
     */
    get scale()
    {
        return this.transform.scale;
    }

    set scale(value) // eslint-disable-line require-jsdoc
    {
        this.transform.scale.copy(value);
    }

    /**
     * 显示对象的轴心点，显示对象会围绕这个点旋转。
     * Assignment by value since pixi-v4.
     *
     * @member {PIXI.Point|PIXI.ObservablePoint}
     */
    get pivot()
    {
        return this.transform.pivot;
    }

    set pivot(value) // eslint-disable-line require-jsdoc
    {
        this.transform.pivot.copy(value);
    }

    /**
     * 该对象的倾斜因数，使用弧度。
     * Assignment by value since pixi-v4.
     *
     * @member {PIXI.ObservablePoint}
     */
    get skew()
    {
        return this.transform.skew;
    }

    set skew(value) // eslint-disable-line require-jsdoc
    {
        this.transform.skew.copy(value);
    }

    /**
     * 该对象旋转的角度，使用弧度。
     *
     * @member {number}
     */
    get rotation()
    {
        return this.transform.rotation;
    }

    set rotation(value) // eslint-disable-line require-jsdoc
    {
        this.transform.rotation = value;
    }

    /**
     * 表示该对象是否全局可见。即父级对象和该对象都没有被隐藏，则返回true。
     *
     * @member {boolean}
     * @readonly
     */
    get worldVisible()
    {
        let item = this;

        do
        {
            if (!item.visible)
            {
                return false;
            }

            item = item.parent;
        } while (item);

        return true;
    }

    /**
     * 给这个显示对象设置一个遮罩。遮罩是一个对象，使对象按遮罩的形状显示内容。
     * 在PIXI规则的遮罩一定是PIXI.Graphics或者PIXI.Sprite对象。
     * 这使得在画布中可以更快的按形状裁剪图形，制作遮罩的效果。
     * 设置该属性为null，即可移除遮罩。
     *
     * @todo 目前, PIXI.CanvasRenderer 不支持使用PIXI.Sprite作为遮罩.
     *
     * @member {PIXI.Graphics|PIXI.Sprite}
     */
    get mask()
    {
        return this._mask;
    }

    set mask(value) // eslint-disable-line require-jsdoc
    {
        if (this._mask)
        {
            this._mask.renderable = true;
            this._mask.isMask = false;
        }

        this._mask = value;

        if (this._mask)
        {
            this._mask.renderable = false;
            this._mask.isMask = true;
        }
    }

    /**
     * 为显示对象设置滤镜。
     * * 重点: 该特性只支持WebGL，Canvas渲染器会忽略它。
     * 将该属性设置为null，即可移除滤镜。
     *
     * @member {PIXI.Filter[]}
     */
    get filters()
    {
        return this._filters && this._filters.slice();
    }

    set filters(value) // eslint-disable-line require-jsdoc
    {
        this._filters = value && value.slice();
    }
}

// performance increase to avoid using call.. (10x faster)
DisplayObject.prototype.displayObjectUpdateTransform = DisplayObject.prototype.updateTransform;
