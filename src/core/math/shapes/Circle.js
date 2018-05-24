import Rectangle from './Rectangle';
import { SHAPES } from '../../const';

/**
 * Circle对象常被用作显示对象的碰撞区域
 *
 * @class
 * @memberof PIXI
 */
export default class Circle
{
    /**
     * @param {number} [x=0] - 圆心的X坐标
     * @param {number} [y=0] - 圆心的Y坐标
     * @param {number} [radius=0] - 圆的半径
     */
    constructor(x = 0, y = 0, radius = 0)
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
        this.radius = radius;

        /**
         * 对象的类型，主要被用来避免`instanceof`检测
         *
         * @member {number}
         * @readOnly
         * @default PIXI.SHAPES.CIRC
         * @see PIXI.SHAPES
         */
        this.type = SHAPES.CIRC;
    }

    /**
     * 创建该Circle实例的克隆
     *
     * @return {PIXI.Circle} Circle对象的克隆
     */
    clone()
    {
        return new Circle(this.x, this.y, this.radius);
    }

    /**
     * 检查传入的X和Y坐标是否包含在这个圆形内。
     *
     * @param {number} x - 测试点的X坐标
     * @param {number} y - 测试点的Y坐标
     * @return {boolean} x/y坐标是否在这个圆形内
     */
    contains(x, y)
    {
        if (this.radius <= 0)
        {
            return false;
        }

        const r2 = this.radius * this.radius;
        let dx = (this.x - x);
        let dy = (this.y - y);

        dx *= dx;
        dy *= dy;

        return (dx + dy <= r2);
    }

    /**
    * 返回这个圆形的包围盒，返回结果是个Rectangle对象
    *
    * @return {PIXI.Rectangle} 包围盒矩形对象
    */
    getBounds()
    {
        return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
}
