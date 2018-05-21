/**
 * GraphicsData对象.
 *
 * @class
 * @memberof PIXI
 */
export default class GraphicsData
{
    /**
     *
     * @param {number} lineWidth - 线条的宽度
     * @param {number} lineColor - 线条的颜色
     * @param {number} lineAlpha - 线条的透明度通道值
     * @param {number} fillColor - 填充的颜色
     * @param {number} fillAlpha - 填充的透明度通道值
     * @param {boolean} fill - 是否使用一个颜色填充这个图形
     * @param {boolean} nativeLines - 绘制线条的方式
     * @param {PIXI.Circle|PIXI.Rectangle|PIXI.Ellipse|PIXI.Polygon} shape - 用来绘制的形状对象。
     */
    constructor(lineWidth, lineColor, lineAlpha, fillColor, fillAlpha, fill, nativeLines, shape)
    {
        /**
         * 线条的宽度
         * @member {number}
         */
        this.lineWidth = lineWidth;

        /**
         * 如果该值为true，将会使用LINES代替TRIANGLE_STRIP绘制线条。
         * @member {boolean}
         */
        this.nativeLines = nativeLines;

        /**
         * 线条的颜色
         * @member {number}
         */
        this.lineColor = lineColor;

        /**
         * 线条的透明度通道值
         * @member {number}
         */
        this.lineAlpha = lineAlpha;

        /**
         * 缓存线条的混色
         * @member {number}
         * @private
         */
        this._lineTint = lineColor;

        /**
         * 填充的颜色
         * @member {number}
         */
        this.fillColor = fillColor;

        /**
         * 填充的透明度通道值
         * @member {number}
         */
        this.fillAlpha = fillAlpha;

        /**
         * 缓存填充的混色
         * @member {number}
         * @private
         */
        this._fillTint = fillColor;

        /**
         * 是否使用一个颜色填充这个图形
         * @member {boolean}
         */
        this.fill = fill;

        this.holes = [];

        /**
         * 用来绘制的形状对象。
         * @member {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle}
         */
        this.shape = shape;

        /**
         * 形状的类型，参考Const.Shapes文件中的所有类型
         * @member {number}
         */
        this.type = shape.type;
    }

    /**
     * 使用这个对象的值创建一个新的GraphicsData对象。
     *
     * @return {PIXI.GraphicsData} 被克隆的GraphicsData对象
     */
    clone()
    {
        return new GraphicsData(
            this.lineWidth,
            this.lineColor,
            this.lineAlpha,
            this.fillColor,
            this.fillAlpha,
            this.fill,
            this.nativeLines,
            this.shape
        );
    }

    /**
     * 添加一个洞到这个形状
     *
     * @param {PIXI.Rectangle|PIXI.Circle} shape - 洞的形状
     */
    addHole(shape)
    {
        this.holes.push(shape);
    }

    /**
     * 销毁这个对象
     */
    destroy()
    {
        this.shape = null;
        this.holes = null;
    }
}
