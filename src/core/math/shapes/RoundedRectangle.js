import { SHAPES } from '../../const';

/**
 * 圆角矩形对象描述了一个带圆角的图形区域。
 * 通过圆角矩形左上角的坐标(x,y)、它的宽高和它的半径来表示。
 *
 * @class
 * @memberof PIXI
 */
export default class RoundedRectangle
{
    /**
     * @param {number} [x=0] - 圆角矩形左上角的X坐标
     * @param {number} [y=0] - 圆角矩形左上角的Y坐标
     * @param {number} [width=0] - 圆角矩形整体的宽度
     * @param {number} [height=0] - 圆角矩形整体的高度
     * @param {number} [radius=20] - 控制圆角的半径
     */
    constructor(x = 0, y = 0, width = 0, height = 0, radius = 20)
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
         * @member {number}
         * @default 20
         */
        this.radius = radius;

        /**
         * 对象的类型，主要被用来避免`instanceof`检测
         *
         * @member {number}
         * @readonly
         * @default PIXI.SHAPES.RREC
         * @see PIXI.SHAPES
         */
        this.type = SHAPES.RREC;
    }

    /**
     * 克隆这个圆角矩形对象
     *
     * @return {PIXI.RoundedRectangle} 新拷贝的圆角矩形
     */
    clone()
    {
        return new RoundedRectangle(this.x, this.y, this.width, this.height, this.radius);
    }

    /**
     * 检查传入的X和Y坐标是否包含在这个圆角矩形内。
     *
     * @param {number} x - 测试点的X坐标
     * @param {number} y - 测试点的Y坐标
     * @return {boolean} x/y坐标是否在这个圆角矩形内
     */
    contains(x, y)
    {
        if (this.width <= 0 || this.height <= 0)
        {
            return false;
        }
        if (x >= this.x && x <= this.x + this.width)
        {
            if (y >= this.y && y <= this.y + this.height)
            {
                if ((y >= this.y + this.radius && y <= this.y + this.height - this.radius)
                || (x >= this.x + this.radius && x <= this.x + this.width - this.radius))
                {
                    return true;
                }
                let dx = x - (this.x + this.radius);
                let dy = y - (this.y + this.radius);
                const radius2 = this.radius * this.radius;

                if ((dx * dx) + (dy * dy) <= radius2)
                {
                    return true;
                }
                dx = x - (this.x + this.width - this.radius);
                if ((dx * dx) + (dy * dy) <= radius2)
                {
                    return true;
                }
                dy = y - (this.y + this.height - this.radius);
                if ((dx * dx) + (dy * dy) <= radius2)
                {
                    return true;
                }
                dx = x - (this.x + this.radius);
                if ((dx * dx) + (dy * dy) <= radius2)
                {
                    return true;
                }
            }
        }

        return false;
    }
}
