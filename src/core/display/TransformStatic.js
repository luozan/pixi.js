import { ObservablePoint } from '../math';
import TransformBase from './TransformBase';

/**
 * 与Transform类不同，这个类只有在对象属性发生改变过后才会更新变换。
 *
 * @class
 * @extends PIXI.TransformBase
 * @memberof PIXI
 */
export default class TransformStatic extends TransformBase
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
         * @member {PIXI.ObservablePoint}
         */
        this.position = new ObservablePoint(this.onChange, this, 0, 0);

        /**
         * 对象的缩放因数。
         *
         * @member {PIXI.ObservablePoint}
         */
        this.scale = new ObservablePoint(this.onChange, this, 1, 1);

        /**
         * 显示对象的轴心点，对象会围绕它旋转。
         *
         * @member {PIXI.ObservablePoint}
         */
        this.pivot = new ObservablePoint(this.onChange, this, 0, 0);

        /**
         * 在x轴和y轴上的倾斜量。
         *
         * @member {PIXI.ObservablePoint}
         */
        this.skew = new ObservablePoint(this.updateSkew, this, 0, 0);

        this._rotation = 0;

        this._cx = 1; // cos rotation + skewY;
        this._sx = 0; // sin rotation + skewY;
        this._cy = 0; // cos rotation + Math.PI/2 - skewX;
        this._sy = 1; // sin rotation + Math.PI/2 - skewX;

        this._localID = 0;
        this._currentLocalID = 0;
    }

    /**
     * 当一个值改变的时候被调用。
     *
     * @private
     */
    onChange()
    {
        this._localID ++;
    }

    /**
     * 当skew或rotation属性发生改变的时候被调用。
     *
     * @private
     */
    updateSkew()
    {
        this._cx = Math.cos(this._rotation + this.skew._y);
        this._sx = Math.sin(this._rotation + this.skew._y);
        this._cy = -Math.sin(this._rotation - this.skew._x); // cos, added PI/2
        this._sy = Math.cos(this._rotation - this.skew._x); // sin, added PI/2

        this._localID ++;
    }

    /**
     * 只更新本地矩阵。
     */
    updateLocalTransform()
    {
        const lt = this.localTransform;

        if (this._localID !== this._currentLocalID)
        {
            // get the matrix values of the displayobject based on its transform properties..
            lt.a = this._cx * this.scale._x;
            lt.b = this._sx * this.scale._x;
            lt.c = this._cy * this.scale._y;
            lt.d = this._sy * this.scale._y;

            lt.tx = this.position._x - ((this.pivot._x * lt.a) + (this.pivot._y * lt.c));
            lt.ty = this.position._y - ((this.pivot._x * lt.b) + (this.pivot._y * lt.d));
            this._currentLocalID = this._localID;

            // force an update..
            this._parentID = -1;
        }
    }

    /**
     * 通过父对象的transform更新对象的值。
     *
     * @param {PIXI.Transform} parentTransform - 该对象的父对象的变换。
     */
    updateTransform(parentTransform)
    {
        const lt = this.localTransform;

        if (this._localID !== this._currentLocalID)
        {
            // get the matrix values of the displayobject based on its transform properties..
            lt.a = this._cx * this.scale._x;
            lt.b = this._sx * this.scale._x;
            lt.c = this._cy * this.scale._y;
            lt.d = this._sy * this.scale._y;

            lt.tx = this.position._x - ((this.pivot._x * lt.a) + (this.pivot._y * lt.c));
            lt.ty = this.position._y - ((this.pivot._x * lt.b) + (this.pivot._y * lt.d));
            this._currentLocalID = this._localID;

            // force an update..
            this._parentID = -1;
        }

        if (this._parentID !== parentTransform._worldID)
        {
            // concat the parent matrix with the objects transform.
            const pt = parentTransform.worldTransform;
            const wt = this.worldTransform;

            wt.a = (lt.a * pt.a) + (lt.b * pt.c);
            wt.b = (lt.a * pt.b) + (lt.b * pt.d);
            wt.c = (lt.c * pt.a) + (lt.d * pt.c);
            wt.d = (lt.c * pt.b) + (lt.d * pt.d);
            wt.tx = (lt.tx * pt.a) + (lt.ty * pt.c) + pt.tx;
            wt.ty = (lt.tx * pt.b) + (lt.ty * pt.d) + pt.ty;

            this._parentID = parentTransform._worldID;

            // update the id of the transform..
            this._worldID ++;
        }
    }

    /**
     * 分解一个矩阵，并且用它设置transform属性。
     *
     * @param {PIXI.Matrix} matrix - 用来分解的矩阵
     */
    setFromMatrix(matrix)
    {
        matrix.decompose(this);
        this._localID ++;
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
