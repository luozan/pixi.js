import Point from '../Point';
import { SHAPES } from '../../const';

/**
 * @class
 * @memberof PIXI
 */
export default class Polygon
{
    /**
     * @param {PIXI.Point[]|number[]} points - 这个参数可以是构成多边形的顶点数组，
     * 直接传入一个数字类型的数组，会被理解成[x,y, x,y, ...]的形式，
     * 或者传入多边形所有的顶点，例如`new PIXI.Polygon(new PIXI.Point(), new PIXI.Point(), ...)`，
     * 或者直接传入x和y的值，例如`new Polygon(x,y, x,y, x,y, ...)`，x和y必须是数字类型的。
     */
    constructor(...points)
    {
        if (Array.isArray(points[0]))
        {
            points = points[0];
        }

        // if this is an array of points, convert it to a flat array of numbers
        if (points[0] instanceof Point)
        {
            const p = [];

            for (let i = 0, il = points.length; i < il; i++)
            {
                p.push(points[i].x, points[i].y);
            }

            points = p;
        }

        this.closed = true;

        /**
         * 存放多边形顶点的数组
         *
         * @member {number[]}
         */
        this.points = points;

        /**
         * 对象的类型，主要被用来避免`instanceof`检测
         *
         * @member {number}
         * @readOnly
         * @default PIXI.SHAPES.POLY
         * @see PIXI.SHAPES
         */
        this.type = SHAPES.POLY;
    }

    /**
     * 创建该多边形对象实例的克隆
     *
     * @return {PIXI.Polygon} 多边形对象的克隆
     */
    clone()
    {
        return new Polygon(this.points.slice());
    }

    /**
     * 关闭多边形, 必要时添加点。
     *
     */
    close()
    {
        const points = this.points;

        // close the poly if the value is true!
        if (points[0] !== points[points.length - 2] || points[1] !== points[points.length - 1])
        {
            points.push(points[0], points[1]);
        }
    }

    /**
     * 检查传入的X和Y坐标是否包含在这个多边形内。
     *
     * @param {number} x - 测试点的X坐标
     * @param {number} y - 测试点的Y坐标
     * @return {boolean} x/y坐标是否在这个多边形内
     */
    contains(x, y)
    {
        let inside = false;

        // use some raycasting to test hits
        // https://github.com/substack/point-in-polygon/blob/master/index.js
        const length = this.points.length / 2;

        for (let i = 0, j = length - 1; i < length; j = i++)
        {
            const xi = this.points[i * 2];
            const yi = this.points[(i * 2) + 1];
            const xj = this.points[j * 2];
            const yj = this.points[(j * 2) + 1];
            const intersect = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * ((y - yi) / (yj - yi))) + xi);

            if (intersect)
            {
                inside = !inside;
            }
        }

        return inside;
    }
}
