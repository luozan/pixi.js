import { Point, ObservablePoint } from '../math';
import TransformBase from './TransformBase';

/**
 * 处理传统2D矩阵变换的通用类。Generic class to deal with traditional 2D matrix transforms
 * 本地变换是通过position，scale，skew和rotation计算出来的。
 *
 * @class
 * @extends PIXI.TransformBase
 * @memberof PIXI
 */
export default class Transform extends TransformBase
{
    /**
     *
     */
    constructor()
    {
        super();

         /**
         * 对象相对于父对象本地坐标系的坐标位置。
         *
         * @member {PIXI.Point}
         */
        this.position = new Point(0, 0);

        /**
         * 对象的缩放因数。
         *
         * @member {PIXI.Point}
         */
        this.scale = new Point(1, 1);

        /**
         * 在x轴和y轴上的倾斜量。
         *
         * @member {PIXI.ObservablePoint}
         */
        this.skew = new ObservablePoint(this.updateSkew, this, 0, 0);

        /**
         * 显示对象的轴心点，对象会围绕它旋转。
         *
         * @member {PIXI.Point}
         */
        this.pivot = new Point(0, 0);

        /**
         * 对象的旋转角度，使用弧度。
         *
         * @member {Number}
         * @private
         */
        this._rotation = 0;

        this._cx = 1; // cos rotation + skewY;
        this._sx = 0; // sin rotation + skewY;
        this._cy = 0; // cos rotation + Math.PI/2 - skewX;
        this._sy = 1; // sin rotation + Math.PI/2 - skewX;
    }

    /**
     * 当skew或者rotation改变的时候，更新倾斜度。
     *
     * @private
     */
    updateSkew()
    {
        this._cx = Math.cos(this._rotation + this.skew._y);
        this._sx = Math.sin(this._rotation + this.skew._y);
        this._cy = -Math.sin(this._rotation - this.skew._x); // cos, added PI/2
        this._sy = Math.cos(this._rotation - this.skew._x); // sin, added PI/2
    }

    /**
     * 只更新本地矩阵。
     */
    updateLocalTransform()
    {
        const lt = this.localTransform;

        lt.a = this._cx * this.scale.x;
        lt.b = this._sx * this.scale.x;
        lt.c = this._cy * this.scale.y;
        lt.d = this._sy * this.scale.y;

        lt.tx = this.position.x - ((this.pivot.x * lt.a) + (this.pivot.y * lt.c));
        lt.ty = this.position.y - ((this.pivot.x * lt.b) + (this.pivot.y * lt.d));
    }

    /**
     * 通过父对象的transform更新对象的值。
     *
     * @param {PIXI.Transform} parentTransform - 该对象的父对象的变换。
     */
    updateTransform(parentTransform)
    {
        const lt = this.localTransform;

        lt.a = this._cx * this.scale.x;
        lt.b = this._sx * this.scale.x;
        lt.c = this._cy * this.scale.y;
        lt.d = this._sy * this.scale.y;

        lt.tx = this.position.x - ((this.pivot.x * lt.a) + (this.pivot.y * lt.c));
        lt.ty = this.position.y - ((this.pivot.x * lt.b) + (this.pivot.y * lt.d));

        // concat the parent matrix with the objects transform.
        const pt = parentTransform.worldTransform;
        const wt = this.worldTransform;

        wt.a = (lt.a * pt.a) + (lt.b * pt.c);
        wt.b = (lt.a * pt.b) + (lt.b * pt.d);
        wt.c = (lt.c * pt.a) + (lt.d * pt.c);
        wt.d = (lt.c * pt.b) + (lt.d * pt.d);
        wt.tx = (lt.tx * pt.a) + (lt.ty * pt.c) + pt.tx;
        wt.ty = (lt.tx * pt.b) + (lt.ty * pt.d) + pt.ty;

        this._worldID ++;
    }

    /**
     * 分解一个矩阵，并且用它设置transform属性。
     *
     * @param {PIXI.Matrix} matrix - 用来分解的矩阵
     */
    setFromMatrix(matrix)
    {
        matrix.decompose(this);
    }

    /**
     * 对象的旋转角度，使用弧度。
     *
     * @member {number}
     */
    get rotation()
    {
        return this._rotation;
    }

    set rotation(value) // eslint-disable-line require-jsdoc
    {
        this._rotation = value;
        this.updateSkew();
    }
}
