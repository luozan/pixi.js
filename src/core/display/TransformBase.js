import { Matrix } from '../math';

/**
 * 处理2D矩阵变换的通用类
 *
 * @class
 * @memberof PIXI
 */
export default class TransformBase
{
    /**
     *
     */
    constructor()
    {
        /**
         * 全局的矩阵变换。可以通过一些如getLocalBounds()的函数临时地交换它。
         *
         * @member {PIXI.Matrix}
         */
        this.worldTransform = new Matrix();

        /**
         * 本地矩阵变换。
         *
         * @member {PIXI.Matrix}
         */
        this.localTransform = new Matrix();

        this._worldID = 0;
        this._parentID = 0;
    }

    /**
     * TransformBase没有分解，所以这个函数不做任何事。
     */
    updateLocalTransform()
    {
        // empty
    }

    /**
     * 通过父对象的transform更新对象的值。
     *
     * @param {PIXI.TransformBase} parentTransform - 该对象的父对象的变换。
     */
    updateTransform(parentTransform)
    {
        const pt = parentTransform.worldTransform;
        const wt = this.worldTransform;
        const lt = this.localTransform;

        // concat the parent matrix with the objects transform.
        wt.a = (lt.a * pt.a) + (lt.b * pt.c);
        wt.b = (lt.a * pt.b) + (lt.b * pt.d);
        wt.c = (lt.c * pt.a) + (lt.d * pt.c);
        wt.d = (lt.c * pt.b) + (lt.d * pt.d);
        wt.tx = (lt.tx * pt.a) + (lt.ty * pt.c) + pt.tx;
        wt.ty = (lt.tx * pt.b) + (lt.ty * pt.d) + pt.ty;

        this._worldID ++;
    }

}

/**
 * 通过父对象的transform更新对象的值。
 * @param  parentTransform {PIXI.Transform} 该对象的父对象的变换。
 *
 */
TransformBase.prototype.updateWorldTransform = TransformBase.prototype.updateTransform;

TransformBase.IDENTITY = new TransformBase();
