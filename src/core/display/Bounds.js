import { Rectangle } from '../math';

/**
 * 边界矩形的“建造者”模式
 * 轴对齐包围盒（AABB包围盒）
 * 这不是个形状类！它是可变的，没有'EMPTY'或者类似的问题。
 *
 * @class
 * @memberof PIXI
 */
export default class Bounds
{
    /**
     *
     */
    constructor()
    {
        /**
         * @member {number}
         * @default 0
         */
        this.minX = Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.minY = Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.maxX = -Infinity;

        /**
         * @member {number}
         * @default 0
         */
        this.maxY = -Infinity;

        this.rect = null;
    }

    /**
     * 检查包围对象是否为空。
     *
     * @return {boolean} True为空.
     */
    isEmpty()
    {
        return this.minX > this.maxX || this.minY > this.maxY;
    }

    /**
     * 清除并重置包围对象。
     *
     */
    clear()
    {
        this.updateID++;

        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = -Infinity;
        this.maxY = -Infinity;
    }

    /**
     * 可能返回Rectangle.EMPTY常量，或者构建一个新的矩形，或者使用你传入的矩形。
     * 无法保证它会返回临时的矩形。
     *
     * @param {PIXI.Rectangle} rect - 如果AABB不为空，将使用该临时对象。
     * @returns {PIXI.Rectangle} 表示包围盒的矩形。
     */
    getRectangle(rect)
    {
        if (this.minX > this.maxX || this.minY > this.maxY)
        {
            return Rectangle.EMPTY;
        }

        rect = rect || new Rectangle(0, 0, 1, 1);

        rect.x = this.minX;
        rect.y = this.minY;
        rect.width = this.maxX - this.minX;
        rect.height = this.maxY - this.minY;

        return rect;
    }

    /**
     * 用一个点缩放包围盒。
     *
     * @param {PIXI.Point} point - 添加的点。
     */
    addPoint(point)
    {
        this.minX = Math.min(this.minX, point.x);
        this.maxX = Math.max(this.maxX, point.x);
        this.minY = Math.min(this.minY, point.y);
        this.maxY = Math.max(this.maxY, point.y);
    }

    /**
     * 添加一个四元组，不变换。
     *
     * @param {Float32Array} vertices - 添加的顶点。
     */
    addQuad(vertices)
    {
        let minX = this.minX;
        let minY = this.minY;
        let maxX = this.maxX;
        let maxY = this.maxY;

        let x = vertices[0];
        let y = vertices[1];

        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[2];
        y = vertices[3];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[4];
        y = vertices[5];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = vertices[6];
        y = vertices[7];
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    /**
     * 添加精灵帧，将被变换。
     *
     * @param {PIXI.TransformBase} transform - TODO
     * @param {number} x0 - TODO
     * @param {number} y0 - TODO
     * @param {number} x1 - TODO
     * @param {number} y1 - TODO
     */
    addFrame(transform, x0, y0, x1, y1)
    {
        const matrix = transform.worldTransform;
        const a = matrix.a;
        const b = matrix.b;
        const c = matrix.c;
        const d = matrix.d;
        const tx = matrix.tx;
        const ty = matrix.ty;

        let minX = this.minX;
        let minY = this.minY;
        let maxX = this.maxX;
        let maxY = this.maxY;

        let x = (a * x0) + (c * y0) + tx;
        let y = (b * x0) + (d * y0) + ty;

        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = (a * x1) + (c * y0) + tx;
        y = (b * x1) + (d * y0) + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = (a * x0) + (c * y1) + tx;
        y = (b * x0) + (d * y1) + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = (a * x1) + (c * y1) + tx;
        y = (b * x1) + (d * y1) + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    /**
     * 添加一个顶点数组。
     *
     * @param {PIXI.TransformBase} transform - TODO
     * @param {Float32Array} vertices - TODO
     * @param {number} beginOffset - TODO
     * @param {number} endOffset - TODO
     */
    addVertices(transform, vertices, beginOffset, endOffset)
    {
        const matrix = transform.worldTransform;
        const a = matrix.a;
        const b = matrix.b;
        const c = matrix.c;
        const d = matrix.d;
        const tx = matrix.tx;
        const ty = matrix.ty;

        let minX = this.minX;
        let minY = this.minY;
        let maxX = this.maxX;
        let maxY = this.maxY;

        for (let i = beginOffset; i < endOffset; i += 2)
        {
            const rawX = vertices[i];
            const rawY = vertices[i + 1];
            const x = (a * rawX) + (c * rawY) + tx;
            const y = (d * rawY) + (b * rawX) + ty;

            minX = x < minX ? x : minX;
            minY = y < minY ? y : minY;
            maxX = x > maxX ? x : maxX;
            maxY = y > maxY ? y : maxY;
        }

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    /**
     * 添加其他包围盒。
     *
     * @param {PIXI.Bounds} bounds - TODO
     */
    addBounds(bounds)
    {
        const minX = this.minX;
        const minY = this.minY;
        const maxX = this.maxX;
        const maxY = this.maxY;

        this.minX = bounds.minX < minX ? bounds.minX : minX;
        this.minY = bounds.minY < minY ? bounds.minY : minY;
        this.maxX = bounds.maxX > maxX ? bounds.maxX : maxX;
        this.maxY = bounds.maxY > maxY ? bounds.maxY : maxY;
    }

    /**
     * 添加其他包围盒，并添加遮罩。
     *
     * @param {PIXI.Bounds} bounds - TODO
     * @param {PIXI.Bounds} mask - TODO
     */
    addBoundsMask(bounds, mask)
    {
        const _minX = bounds.minX > mask.minX ? bounds.minX : mask.minX;
        const _minY = bounds.minY > mask.minY ? bounds.minY : mask.minY;
        const _maxX = bounds.maxX < mask.maxX ? bounds.maxX : mask.maxX;
        const _maxY = bounds.maxY < mask.maxY ? bounds.maxY : mask.maxY;

        if (_minX <= _maxX && _minY <= _maxY)
        {
            const minX = this.minX;
            const minY = this.minY;
            const maxX = this.maxX;
            const maxY = this.maxY;

            this.minX = _minX < minX ? _minX : minX;
            this.minY = _minY < minY ? _minY : minY;
            this.maxX = _maxX > maxX ? _maxX : maxX;
            this.maxY = _maxY > maxY ? _maxY : maxY;
        }
    }

    /**
     * 添加其他包围盒，并使用一个矩形遮罩
     *
     * @param {PIXI.Bounds} bounds - TODO
     * @param {PIXI.Rectangle} area - TODO
     */
    addBoundsArea(bounds, area)
    {
        const _minX = bounds.minX > area.x ? bounds.minX : area.x;
        const _minY = bounds.minY > area.y ? bounds.minY : area.y;
        const _maxX = bounds.maxX < area.x + area.width ? bounds.maxX : (area.x + area.width);
        const _maxY = bounds.maxY < area.y + area.height ? bounds.maxY : (area.y + area.height);

        if (_minX <= _maxX && _minY <= _maxY)
        {
            const minX = this.minX;
            const minY = this.minY;
            const maxX = this.maxX;
            const maxY = this.maxY;

            this.minX = _minX < minX ? _minX : minX;
            this.minY = _minY < minY ? _minY : minY;
            this.maxX = _maxX > maxX ? _maxX : maxX;
            this.maxY = _maxY > maxY ? _maxY : maxY;
        }
    }
}
