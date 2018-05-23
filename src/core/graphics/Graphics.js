import Container from '../display/Container';
import RenderTexture from '../textures/RenderTexture';
import Texture from '../textures/Texture';
import GraphicsData from './GraphicsData';
import Sprite from '../sprites/Sprite';
import { Matrix, Point, Rectangle, RoundedRectangle, Ellipse, Polygon, Circle } from '../math';
import { hex2rgb, rgb2hex } from '../utils';
import { SHAPES, BLEND_MODES, PI_2 } from '../const';
import Bounds from '../display/Bounds';
import bezierCurveTo from './utils/bezierCurveTo';
import CanvasRenderer from '../renderers/canvas/CanvasRenderer';

let canvasRenderer;
const tempMatrix = new Matrix();
const tempPoint = new Point();
const tempColor1 = new Float32Array(4);
const tempColor2 = new Float32Array(4);

/**
 * 这个图形类包含绘制基本图形的各种方法，例如直线、圆和矩形，显示并且填充上色。
 *
 * @class
 * @extends PIXI.Container
 * @memberof PIXI
 */
export default class Graphics extends Container
{
    /**
     *
     * @param {boolean} [nativeLines=false] - 如果该值为true，将会使用LINES代替TRIANGLE_STRIP绘制线条。
     */
    constructor(nativeLines = false)
    {
        super();

        /**
         * 在填充这个Graphics对象时被使用的透明度通道值。
         *
         * @member {number}
         * @default 1
         */
        this.fillAlpha = 1;

        /**
         * 被绘制的线条的宽度（厚度）。
         *
         * @member {number}
         * @default 0
         */
        this.lineWidth = 0;

        /**
         * 如果该值为true，将会使用LINES代替TRIANGLE_STRIP绘制线条。
         *
         * @member {boolean}
         */
        this.nativeLines = nativeLines;

        /**
         * 被绘制的线条的颜色。
         *
         * @member {string}
         * @default 0
         */
        this.lineColor = 0;

        /**
         * 图形数据
         *
         * @member {PIXI.GraphicsData[]}
         * @private
         */
        this.graphicsData = [];

        /**
         * 对图形混色。这是个十六进制值。用0xFFFFFF可以重置混色的颜色。
         * reset the tint.
         *
         * @member {number}
         * @default 0xFFFFFF
         */
        this.tint = 0xFFFFFF;

        /**
         * 前一次混色的值，用来匹配当前的混色值，并且检查是否有改变。
         *
         * @member {number}
         * @private
         * @default 0xFFFFFF
         */
        this._prevTint = 0xFFFFFF;

        /**
         * 对图形使用的混合模式。设置为`PIXI.BLEND_MODES.NORMAL`可重置混合模式。
         *
         * @member {number}
         * @default PIXI.BLEND_MODES.NORMAL;
         * @see PIXI.BLEND_MODES
         */
        this.blendMode = BLEND_MODES.NORMAL;

        /**
         * 当前路径
         *
         * @member {PIXI.GraphicsData}
         * @private
         */
        this.currentPath = null;

        /**
         * WebGL渲染器所需要的存放WebGL相关属性的数组。
         *
         * @member {object<number, object>}
         * @private
         */
        // TODO - _webgl should use a prototype object, not a random undocumented object...
        this._webGL = {};

        /**
         * 这个形状是否被用来当做遮罩使用。
         *
         * @member {boolean}
         */
        this.isMask = false;

        /**
         * 包围盒的内边距，用于包围盒的计算。
         *
         * @member {number}
         */
        this.boundsPadding = 0;

        /**
         * 本地包围盒的缓存，防止重新计算
         *
         * @member {PIXI.Rectangle}
         * @private
         */
        this._localBounds = new Bounds();

        /**
         * 被用来检测图形对象是否发生改变。如果该值设置为true，那么图形对象将被重新计算。
         *
         * @member {boolean}
         * @private
         */
        this.dirty = 0;

        /**
         * 被用来通过id比较，检测我们是否需要做一次快速矩形检测。
         * @type {Number}
         */
        this.fastRectDirty = -1;

        /**
         * 被用来检测我们是否清除图形的webgl数据
         * @type {Number}
         */
        this.clearDirty = 0;

        /**
         * 被用来检测我们是否需要重新计算本地包围盒。
         * @type {Number}
         */
        this.boundsDirty = -1;

        /**
         * 被用来检测被缓存的sprite对象是否需要更新。
         *
         * @member {boolean}
         * @private
         */
        this.cachedSpriteDirty = false;

        this._spriteRect = null;
        this._fastRect = false;

        /**
         * 当cacheAsBitmap设置为true时，该图形对象将作为sprite渲染。
         * 如果你的图形元素不经常改变，那么该属性就十分有用了。
         * 虽然它能提升对象渲染的速度，但是会占用更多的纹理内存。
         * 如果你需要图形对象有抗锯齿的效果，那么该属性也会有用。因为将使用canvas渲染它。of the object in exchange for taking up texture memory. It is also useful if you need the graphics
         * 如果你总是不断的重绘这个图形元素，那么不建议使用该属性。
         *
         * @name cacheAsBitmap
         * @member {boolean}
         * @memberof PIXI.Graphics#
         * @default false
         */
    }

    /**
     * 使用该对象的值，新创建一个同样的Graphics对象。
     * 注意，仅仅是对象的属性被克隆，而不是它的变换（position,scale,等等）
     *
     * @return {PIXI.Graphics} 该图形对象的克隆
     */
    clone()
    {
        const clone = new Graphics();

        clone.renderable = this.renderable;
        clone.fillAlpha = this.fillAlpha;
        clone.lineWidth = this.lineWidth;
        clone.lineColor = this.lineColor;
        clone.tint = this.tint;
        clone.blendMode = this.blendMode;
        clone.isMask = this.isMask;
        clone.boundsPadding = this.boundsPadding;
        clone.dirty = 0;
        clone.cachedSpriteDirty = this.cachedSpriteDirty;

        // copy graphics data
        for (let i = 0; i < this.graphicsData.length; ++i)
        {
            clone.graphicsData.push(this.graphicsData[i].clone());
        }

        clone.currentPath = clone.graphicsData[clone.graphicsData.length - 1];

        clone.updateLocalBounds();

        return clone;
    }

    /**
     * 指定线条样式，用于之后调用的绘制图形的方法，例如lineTo()方法或者drawCircle()方法。
     *
     * @param {number} [lineWidth=0] - 线条的宽度，将更新对象储存的样式
     * @param {number} [color=0] - 线条的颜色，将更新对象储存的样式
     * @param {number} [alpha=1] - 线条的透明度通道值，将更新对象储存的样式
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    lineStyle(lineWidth = 0, color = 0, alpha = 1)
    {
        this.lineWidth = lineWidth;
        this.lineColor = color;
        this.lineAlpha = alpha;

        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length)
            {
                // halfway through a line? start a new one!
                const shape = new Polygon(this.currentPath.shape.points.slice(-2));

                shape.closed = false;

                this.drawShape(shape);
            }
            else
            {
                // otherwise its empty so lets just set the line properties
                this.currentPath.lineWidth = this.lineWidth;
                this.currentPath.lineColor = this.lineColor;
                this.currentPath.lineAlpha = this.lineAlpha;
            }
        }

        return this;
    }

    /**
     * 移动当前的绘制坐标位置到x，y。
     *
     * @param {number} x - 移动到的X坐标
     * @param {number} y - 移动到的Y坐标
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    moveTo(x, y)
    {
        const shape = new Polygon([x, y]);

        shape.closed = false;
        this.drawShape(shape);

        return this;
    }

    /**
     * 使用当前线条样式绘制一条直线，从当前的绘制坐标位置到（x，y）；
     * 之后会把当前的绘制坐标位置设置为（x，y）。
     *
     * @param {number} x - 绘制到的X坐标
     * @param {number} y - 绘制到的Y坐标
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    lineTo(x, y)
    {
        this.currentPath.shape.points.push(x, y);
        this.dirty++;

        return this;
    }

    /**
     * 计算表示一条二次贝塞尔曲线的点，并且绘制出来。
     * 基于: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
     *
     * @param {number} cpX - 控制点的x坐标
     * @param {number} cpY - 控制点的y坐标
     * @param {number} toX - 终点的x坐标
     * @param {number} toY - 终点的y坐标
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    quadraticCurveTo(cpX, cpY, toX, toY)
    {
        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length === 0)
            {
                this.currentPath.shape.points = [0, 0];
            }
        }
        else
        {
            this.moveTo(0, 0);
        }

        const n = 20;
        const points = this.currentPath.shape.points;
        let xa = 0;
        let ya = 0;

        if (points.length === 0)
        {
            this.moveTo(0, 0);
        }

        const fromX = points[points.length - 2];
        const fromY = points[points.length - 1];

        for (let i = 1; i <= n; ++i)
        {
            const j = i / n;

            xa = fromX + ((cpX - fromX) * j);
            ya = fromY + ((cpY - fromY) * j);

            points.push(xa + (((cpX + ((toX - cpX) * j)) - xa) * j),
                ya + (((cpY + ((toY - cpY) * j)) - ya) * j));
        }

        this.dirty++;

        return this;
    }

    /**
     * 计算表示一条贝塞尔曲线的点，并且绘制出来。
     *
     * @param {number} cpX - 控制点的x坐标
     * @param {number} cpY - 控制点的y坐标
     * @param {number} cpX2 - 第二个控制点的x坐标
     * @param {number} cpY2 - 第二个控制点的y坐标
     * @param {number} toX - 终点的x坐标
     * @param {number} toY - 终点的y坐标
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY)
    {
        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length === 0)
            {
                this.currentPath.shape.points = [0, 0];
            }
        }
        else
        {
            this.moveTo(0, 0);
        }

        const points = this.currentPath.shape.points;

        const fromX = points[points.length - 2];
        const fromY = points[points.length - 1];

        points.length -= 2;

        bezierCurveTo(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY, points);

        this.dirty++;

        return this;
    }

    /**
     * arcTo()方法会在画布上的两个切线之间创建一个圆弧/曲线。
     *
     * 采用自 https://code.google.com/p/fxcanvas/ - 感谢谷歌!
     *
     * @param {number} x1 - 圆弧起点的x坐标
     * @param {number} y1 - 圆弧起点的y坐标
     * @param {number} x2 - 圆弧终点的x坐标
     * @param {number} y2 - 圆弧终点的y坐标
     * @param {number} radius - 圆弧的半径
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    arcTo(x1, y1, x2, y2, radius)
    {
        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length === 0)
            {
                this.currentPath.shape.points.push(x1, y1);
            }
        }
        else
        {
            this.moveTo(x1, y1);
        }

        const points = this.currentPath.shape.points;
        const fromX = points[points.length - 2];
        const fromY = points[points.length - 1];
        const a1 = fromY - y1;
        const b1 = fromX - x1;
        const a2 = y2 - y1;
        const b2 = x2 - x1;
        const mm = Math.abs((a1 * b2) - (b1 * a2));

        if (mm < 1.0e-8 || radius === 0)
        {
            if (points[points.length - 2] !== x1 || points[points.length - 1] !== y1)
            {
                points.push(x1, y1);
            }
        }
        else
        {
            const dd = (a1 * a1) + (b1 * b1);
            const cc = (a2 * a2) + (b2 * b2);
            const tt = (a1 * a2) + (b1 * b2);
            const k1 = radius * Math.sqrt(dd) / mm;
            const k2 = radius * Math.sqrt(cc) / mm;
            const j1 = k1 * tt / dd;
            const j2 = k2 * tt / cc;
            const cx = (k1 * b2) + (k2 * b1);
            const cy = (k1 * a2) + (k2 * a1);
            const px = b1 * (k2 + j1);
            const py = a1 * (k2 + j1);
            const qx = b2 * (k1 + j2);
            const qy = a2 * (k1 + j2);
            const startAngle = Math.atan2(py - cy, px - cx);
            const endAngle = Math.atan2(qy - cy, qx - cx);

            this.arc(cx + x1, cy + y1, radius, startAngle, endAngle, b1 * a2 > b2 * a1);
        }

        this.dirty++;

        return this;
    }

    /**
     * 圆弧方法会创建一个圆弧/曲线（被用来创建圆形或者圆形的一部分）。
     *
     * @param {number} cx - 圆心的X坐标
     * @param {number} cy - 圆心的Y坐标
     * @param {number} radius - 圆的半径
     * @param {number} startAngle - 开始角度，使用弧度（0弧度在3点钟方向）
     * @param {number} endAngle - 结束角度，使用弧度
     * @param {boolean} [anticlockwise=false] - 指定是逆时针方向绘制还是顺时针方向绘制。
     * 默认值为False，表示顺时针，当为True时，表示逆时针。
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    arc(cx, cy, radius, startAngle, endAngle, anticlockwise = false)
    {
        if (startAngle === endAngle)
        {
            return this;
        }

        if (!anticlockwise && endAngle <= startAngle)
        {
            endAngle += PI_2;
        }
        else if (anticlockwise && startAngle <= endAngle)
        {
            startAngle += PI_2;
        }

        const sweep = endAngle - startAngle;
        const segs = Math.ceil(Math.abs(sweep) / PI_2) * 40;

        if (sweep === 0)
        {
            return this;
        }

        const startX = cx + (Math.cos(startAngle) * radius);
        const startY = cy + (Math.sin(startAngle) * radius);

        // If the currentPath exists, take its points. Otherwise call `moveTo` to start a path.
        let points = this.currentPath ? this.currentPath.shape.points : null;

        if (points)
        {
            if (points[points.length - 2] !== startX || points[points.length - 1] !== startY)
            {
                points.push(startX, startY);
            }
        }
        else
        {
            this.moveTo(startX, startY);
            points = this.currentPath.shape.points;
        }

        const theta = sweep / (segs * 2);
        const theta2 = theta * 2;

        const cTheta = Math.cos(theta);
        const sTheta = Math.sin(theta);

        const segMinus = segs - 1;

        const remainder = (segMinus % 1) / segMinus;

        for (let i = 0; i <= segMinus; ++i)
        {
            const real = i + (remainder * i);

            const angle = ((theta) + startAngle + (theta2 * real));

            const c = Math.cos(angle);
            const s = -Math.sin(angle);

            points.push(
                (((cTheta * c) + (sTheta * s)) * radius) + cx,
                (((cTheta * -s) + (sTheta * c)) * radius) + cy
            );
        }

        this.dirty++;

        return this;
    }

    /**
     * 指定一个颜色，在之后调用的其他Graphics方法（例如lineTo()或者drawCircle()）绘制图形时，填充图形颜色。
     *
     * @param {number} [color=0] - 填充的颜色
     * @param {number} [alpha=1] - 填充的透明度通道值
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    beginFill(color = 0, alpha = 1)
    {
        this.filling = true;
        this.fillColor = color;
        this.fillAlpha = alpha;

        if (this.currentPath)
        {
            if (this.currentPath.shape.points.length <= 2)
            {
                this.currentPath.fill = this.filling;
                this.currentPath.fillColor = this.fillColor;
                this.currentPath.fillAlpha = this.fillAlpha;
            }
        }

        return this;
    }

    /**
     * 应用一个填充到线条或者图形，使用最后一次调用beginFill()方法时设置的参数。
     *
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    endFill()
    {
        this.filling = false;
        this.fillColor = null;
        this.fillAlpha = 1;

        return this;
    }

    /**
     *  画一个矩形
     * 
     * @param {number} x - 矩形左上角的X坐标
     * @param {number} y - 矩形左上角的Y坐标
     * @param {number} width - 矩形的宽度
     * @param {number} height - 矩形的高度
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    drawRect(x, y, width, height)
    {
        this.drawShape(new Rectangle(x, y, width, height));

        return this;
    }

    /**
     * 画一个圆角矩形
     * 
     * @param {number} x - 矩形左上角的X坐标
     * @param {number} y - 矩形左上角的Y坐标
     * @param {number} width - 矩形的宽度
     * @param {number} height - 矩形的高度
     * @param {number} radius - 矩形四个角的半径
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    drawRoundedRect(x, y, width, height, radius)
    {
        this.drawShape(new RoundedRectangle(x, y, width, height, radius));

        return this;
    }

    /**
     * 画一个圆形
     *
     * @param {number} x - 圆心的X坐标
     * @param {number} y - 圆心的Y坐标
     * @param {number} radius - 圆的半径
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    drawCircle(x, y, radius)
    {
        this.drawShape(new Circle(x, y, radius));

        return this;
    }

    /**
     * 画一个椭圆
     *
     * @param {number} x - 椭圆圆心的X坐标
     * @param {number} y - 椭圆圆心的Y坐标
     * @param {number} width - 椭圆宽的一半
     * @param {number} height - 椭圆高的一半
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    drawEllipse(x, y, width, height)
    {
        this.drawShape(new Ellipse(x, y, width, height));

        return this;
    }

    /**
     * 使用传入的路径画一个多边形。
     *
     * @param {number[]|PIXI.Point[]|PIXI.Polygon} path - 被用来构建多边形的路径数据。
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    drawPolygon(path)
    {
        // prevents an argument assignment deopt
        // see section 3.1: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
        let points = path;

        let closed = true;

        if (points instanceof Polygon)
        {
            closed = points.closed;
            points = points.points;
        }

        if (!Array.isArray(points))
        {
            // prevents an argument leak deopt
            // see section 3.2: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
            points = new Array(arguments.length);

            for (let i = 0; i < points.length; ++i)
            {
                points[i] = arguments[i]; // eslint-disable-line prefer-rest-params
            }
        }

        const shape = new Polygon(points);

        shape.closed = closed;

        this.drawShape(shape);

        return this;
    }

    /**
     * 画一个任意数量顶点的星形
     *
     * @param {number} x - 星形的中心点的X坐标。
     * @param {number} y - 星形的中心点的Y坐标。
     * @param {number} points - 星形的顶点数量，必须 > 1。
     * @param {number} radius - 星形外角的角度。
     * @param {number} [innerRadius] - 两个顶点之间的内角角度，默认为`radius`的一半。
     * @param {number} [rotation=0] - 星形的旋转角度，使用弧度，为0的时候，处在竖直方向。
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    drawStar(x, y, points, radius, innerRadius, rotation = 0)
    {
        innerRadius = innerRadius || radius / 2;

        const startAngle = (-1 * Math.PI / 2) + rotation;
        const len = points * 2;
        const delta = PI_2 / len;
        const polygon = [];

        for (let i = 0; i < len; i++)
        {
            const r = i % 2 ? innerRadius : radius;
            const angle = (i * delta) + startAngle;

            polygon.push(
                x + (r * Math.cos(angle)),
                y + (r * Math.sin(angle))
            );
        }

        return this.drawPolygon(polygon);
    }

    /**
     * 清除该Graphics对象绘制的图形，并且重置填充颜色和线条样式的设置。
     *
     * @return {PIXI.Graphics} 这个Graphics对象。方便链式调用。
     */
    clear()
    {
        if (this.lineWidth || this.filling || this.graphicsData.length > 0)
        {
            this.lineWidth = 0;
            this.filling = false;

            this.boundsDirty = -1;
            this.dirty++;
            this.clearDirty++;
            this.graphicsData.length = 0;
        }

        this.currentPath = null;
        this._spriteRect = null;

        return this;
    }

    /**
     * 为True时，表示图形由一个矩形组成。 
     * 因此可以像Sprite对象一样画出来，并且使用gl.scissor剪裁它。
     *
     * @returns {boolean} 仅仅是一个矩形的时候返回True。
     */
    isFastRect()
    {
        return this.graphicsData.length === 1
            && this.graphicsData[0].shape.type === SHAPES.RECT
            && !this.graphicsData[0].lineWidth;
    }

    /**
     * 使用WebGL渲染器渲染该对象。
     *
     * @private
     * @param {PIXI.WebGLRenderer} renderer - 渲染器
     */
    _renderWebGL(renderer)
    {
        // if the sprite is not visible or the alpha is 0 then no need to render this element
        if (this.dirty !== this.fastRectDirty)
        {
            this.fastRectDirty = this.dirty;
            this._fastRect = this.isFastRect();
        }

        // TODO this check can be moved to dirty?
        if (this._fastRect)
        {
            this._renderSpriteRect(renderer);
        }
        else
        {
            renderer.setObjectRenderer(renderer.plugins.graphics);
            renderer.plugins.graphics.render(this);
        }
    }

    /**
     * 用sprite对象渲染一个矩形(sprite rectangle)。
     *
     * @private
     * @param {PIXI.WebGLRenderer} renderer - 渲染器
     */
    _renderSpriteRect(renderer)
    {
        const rect = this.graphicsData[0].shape;

        if (!this._spriteRect)
        {
            this._spriteRect = new Sprite(new Texture(Texture.WHITE));
        }

        const sprite = this._spriteRect;

        if (this.tint === 0xffffff)
        {
            sprite.tint = this.graphicsData[0].fillColor;
        }
        else
        {
            const t1 = tempColor1;
            const t2 = tempColor2;

            hex2rgb(this.graphicsData[0].fillColor, t1);
            hex2rgb(this.tint, t2);

            t1[0] *= t2[0];
            t1[1] *= t2[1];
            t1[2] *= t2[2];

            sprite.tint = rgb2hex(t1);
        }
        sprite.alpha = this.graphicsData[0].fillAlpha;
        sprite.worldAlpha = this.worldAlpha * sprite.alpha;
        sprite.blendMode = this.blendMode;

        sprite._texture._frame.width = rect.width;
        sprite._texture._frame.height = rect.height;

        sprite.transform.worldTransform = this.transform.worldTransform;

        sprite.anchor.set(-rect.x / rect.width, -rect.y / rect.height);
        sprite._onAnchorUpdate();

        sprite._renderWebGL(renderer);
    }

    /**
     * 使用Canvas渲染器渲染该对象。
     *
     * @private
     * @param {PIXI.CanvasRenderer} renderer - 渲染器
     */
    _renderCanvas(renderer)
    {
        if (this.isMask === true)
        {
            return;
        }

        renderer.plugins.graphics.render(this);
    }

    /**
     * 重新计算图形的包围盒，作为一个rectangle对象。
     *
     * @private
     */
    _calculateBounds()
    {
        if (this.boundsDirty !== this.dirty)
        {
            this.boundsDirty = this.dirty;
            this.updateLocalBounds();

            this.cachedSpriteDirty = true;
        }

        const lb = this._localBounds;

        this._bounds.addFrame(this.transform, lb.minX, lb.minY, lb.maxX, lb.maxY);
    }

    /**
     * 检测一个点是否在该图形对象内。
     *
     * @param {PIXI.Point} point - 被检测的点
     * @return {boolean} 检测结果
     */
    containsPoint(point)
    {
        this.worldTransform.applyInverse(point, tempPoint);

        const graphicsData = this.graphicsData;

        for (let i = 0; i < graphicsData.length; ++i)
        {
            const data = graphicsData[i];

            if (!data.fill)
            {
                continue;
            }

            // only deal with fills..
            if (data.shape)
            {
                if (data.shape.contains(tempPoint.x, tempPoint.y))
                {
                    if (data.holes)
                    {
                        for (let i = 0; i < data.holes.length; i++)
                        {
                            const hole = data.holes[i];

                            if (hole.contains(tempPoint.x, tempPoint.y))
                            {
                                return false;
                            }
                        }
                    }

                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 更新对象的包围盒
     *
     */
    updateLocalBounds()
    {
        let minX = Infinity;
        let maxX = -Infinity;

        let minY = Infinity;
        let maxY = -Infinity;

        if (this.graphicsData.length)
        {
            let shape = 0;
            let x = 0;
            let y = 0;
            let w = 0;
            let h = 0;

            for (let i = 0; i < this.graphicsData.length; i++)
            {
                const data = this.graphicsData[i];
                const type = data.type;
                const lineWidth = data.lineWidth;

                shape = data.shape;

                if (type === SHAPES.RECT || type === SHAPES.RREC)
                {
                    x = shape.x - (lineWidth / 2);
                    y = shape.y - (lineWidth / 2);
                    w = shape.width + lineWidth;
                    h = shape.height + lineWidth;

                    minX = x < minX ? x : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y < minY ? y : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                }
                else if (type === SHAPES.CIRC)
                {
                    x = shape.x;
                    y = shape.y;
                    w = shape.radius + (lineWidth / 2);
                    h = shape.radius + (lineWidth / 2);

                    minX = x - w < minX ? x - w : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y - h < minY ? y - h : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                }
                else if (type === SHAPES.ELIP)
                {
                    x = shape.x;
                    y = shape.y;
                    w = shape.width + (lineWidth / 2);
                    h = shape.height + (lineWidth / 2);

                    minX = x - w < minX ? x - w : minX;
                    maxX = x + w > maxX ? x + w : maxX;

                    minY = y - h < minY ? y - h : minY;
                    maxY = y + h > maxY ? y + h : maxY;
                }
                else
                {
                    // POLY
                    const points = shape.points;
                    let x2 = 0;
                    let y2 = 0;
                    let dx = 0;
                    let dy = 0;
                    let rw = 0;
                    let rh = 0;
                    let cx = 0;
                    let cy = 0;

                    for (let j = 0; j + 2 < points.length; j += 2)
                    {
                        x = points[j];
                        y = points[j + 1];
                        x2 = points[j + 2];
                        y2 = points[j + 3];
                        dx = Math.abs(x2 - x);
                        dy = Math.abs(y2 - y);
                        h = lineWidth;
                        w = Math.sqrt((dx * dx) + (dy * dy));

                        if (w < 1e-9)
                        {
                            continue;
                        }

                        rw = ((h / w * dy) + dx) / 2;
                        rh = ((h / w * dx) + dy) / 2;
                        cx = (x2 + x) / 2;
                        cy = (y2 + y) / 2;

                        minX = cx - rw < minX ? cx - rw : minX;
                        maxX = cx + rw > maxX ? cx + rw : maxX;

                        minY = cy - rh < minY ? cy - rh : minY;
                        maxY = cy + rh > maxY ? cy + rh : maxY;
                    }
                }
            }
        }
        else
        {
            minX = 0;
            maxX = 0;
            minY = 0;
            maxY = 0;
        }

        const padding = this.boundsPadding;

        this._localBounds.minX = minX - padding;
        this._localBounds.maxX = maxX + padding;

        this._localBounds.minY = minY - padding;
        this._localBounds.maxY = maxY + padding;
    }

    /**
     * 用这个Graphics对象绘制传入的形状。可以是Circle，Rectangle，Ellipse，Line和多边形中的任何一个。
     *
     * @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - 被绘制的形状
     * @return {PIXI.GraphicsData} 生成的GraphicsData对象
     */
    drawShape(shape)
    {
        if (this.currentPath)
        {
            // check current path!
            if (this.currentPath.shape.points.length <= 2)
            {
                this.graphicsData.pop();
            }
        }

        this.currentPath = null;

        const data = new GraphicsData(
            this.lineWidth,
            this.lineColor,
            this.lineAlpha,
            this.fillColor,
            this.fillAlpha,
            this.filling,
            this.nativeLines,
            shape
        );

        this.graphicsData.push(data);

        if (data.type === SHAPES.POLY)
        {
            data.shape.closed = data.shape.closed || this.filling;
            this.currentPath = data;
        }

        this.dirty++;

        return data;
    }

    /**
     * 生成一个画布纹理
     *
     * @param {number} scaleMode - 纹理的缩放模式
     * @param {number} resolution - 纹理的设备像素比。
     * @return {PIXI.Texture} 新的纹理。
     */
    generateCanvasTexture(scaleMode, resolution = 1)
    {
        const bounds = this.getLocalBounds();

        const canvasBuffer = RenderTexture.create(bounds.width, bounds.height, scaleMode, resolution);

        if (!canvasRenderer)
        {
            canvasRenderer = new CanvasRenderer();
        }

        this.transform.updateLocalTransform();
        this.transform.localTransform.copy(tempMatrix);

        tempMatrix.invert();

        tempMatrix.tx -= bounds.x;
        tempMatrix.ty -= bounds.y;

        canvasRenderer.render(this, canvasBuffer, true, tempMatrix);

        const texture = Texture.fromCanvas(canvasBuffer.baseTexture._canvasRenderTarget.canvas, scaleMode, 'graphics');

        texture.baseTexture.resolution = resolution;
        texture.baseTexture.update();

        return texture;
    }

    /**
     * 关闭当前路径
     *
     * @return {PIXI.Graphics} 返回这个对象本身。
     */
    closePath()
    {
        // ok so close path assumes next one is a hole!
        const currentPath = this.currentPath;

        if (currentPath && currentPath.shape)
        {
            currentPath.shape.close();
        }

        return this;
    }

    /**
     * 添加一个洞到当前路径
     *
     * @return {PIXI.Graphics} 返回这个对象本身。
     */
    addHole()
    {
        // this is a hole!
        const hole = this.graphicsData.pop();

        this.currentPath = this.graphicsData[this.graphicsData.length - 1];

        this.currentPath.addHole(hole.shape);
        this.currentPath = null;

        return this;
    }

    /**
     * 销毁这个Graphics对象。
     *
     * @param {object|boolean} [options] - 选项参数。 如果传入一个布尔值，那么所有子选项都会设置成这个值。
     * @param {boolean} [options.children=false] - 如果设置为true，该对象的所有子对象都会被调用销毁方法。
     * 'options'将被传入给子对象的销毁方法。
     * @param {boolean} [options.texture=false] - 只对Sprite类型的子对象有用。
     * 如果options.children设置为ture，则会销毁精灵子对象的纹理。
     * @param {boolean} [options.baseTexture=false] - 只对Sprite类型的子对象有用。
     * 如果options.children设置为ture，则会销毁精灵子对象的基本纹理。
     */
    destroy(options)
    {
        super.destroy(options);

        // destroy each of the GraphicsData objects
        for (let i = 0; i < this.graphicsData.length; ++i)
        {
            this.graphicsData[i].destroy();
        }

        // for each webgl data entry, destroy the WebGLGraphicsData
        for (const id in this._webgl)
        {
            for (let j = 0; j < this._webgl[id].data.length; ++j)
            {
                this._webgl[id].data[j].destroy();
            }
        }

        if (this._spriteRect)
        {
            this._spriteRect.destroy();
        }

        this.graphicsData = null;

        this.currentPath = null;
        this._webgl = null;
        this._localBounds = null;
    }

}

Graphics._SPRITE_TEXTURE = null;
