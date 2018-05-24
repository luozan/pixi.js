import Rectangle from './Rectangle';
import { SHAPES } from '../../const';

/**
 * 椭圆形对象常被用作显示对象的碰撞区域
 *
 * @class
 * @memberof PIXI
 */
export default class Ellipse
{
    /**
     * @param {number} [x=0] - 椭圆圆心的X坐标
     * @param {number} [y=0] - 椭圆圆心的Y坐标
     * @param {number} [width=0] - 椭圆宽度的一半
     * @param {number} [height=0] - 椭圆高度的一半
     */
    constructor(x = 0, y = 0, width = 0, height = 0)
    {
        /**
         * @member {number}
         * @default 0
         */
        this.x = x;

        /**
         * @member {number}
         * @default 0
         */
        this.y = y;

        /**
         * @member {number}
         * @default 0
         */
        this.width = width;

        /**
         * @member {number}
         * @default 0
         */
        this.height = height;

        /**
         * 对象的类型，主要被用来避免`instanceof`检测
         *
         * @member {number}
         * @readOnly
         * @default PIXI.SHAPES.ELIP
         * @see PIXI.SHAPES
         */
        this.type = SHAPES.ELIP;
    }

    /**
     * 创建该Ellipse对象实例的克隆
     *
     * @return {PIXI.Ellipse} 椭圆形对象的克隆
     */
    clone()
    {
        return new Ellipse(this.x, this.y, this.width, this.height);
    }

    /**
     * 检查传入的X和Y坐标是否包含在这个椭圆形内。
     *
     * @param {number} x - 测试点的X坐标
     * @param {number} y - 测试点的Y坐标
     * @return {boolean} x/y坐标是否在这个椭圆形内
     */
    contains(x, y)
    {
        if (this.width <= 0 || this.height <= 0)
        {
            return false;
        }

        // normalize the coords to an ellipse with center 0,0
        let normx = ((x - this.x) / this.width);
        let normy = ((y - this.y) / this.height);

        normx *= normx;
        normy *= normy;

        return (normx + normy <= 1);
    }

    /**
     * 返回这个椭圆形的包围盒，返回结果是个Rectangle对象
     *
     * @return {PIXI.Rectangle} 包围盒矩形对象
     */
    getBounds()
    {
        return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
    }
}
