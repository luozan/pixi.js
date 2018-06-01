import { SHAPES } from '../../const';

/**
 * 矩形对象是一个由它的位置定义的区域，
 * 通过矩形左上角的坐标(x,y)和它的宽高来表示。
 *
 * @class
 * @memberof PIXI
 */
export default class Rectangle
{
    /**
     * @param {number} [x=0] - 矩形左上角的X坐标
     * @param {number} [y=0] - 矩形左上角的Y坐标
     * @param {number} [width=0] - 矩形整体的宽度
     * @param {number} [height=0] - 矩形整体的高度
     */
    constructor(x = 0, y = 0, width = 0, height = 0)
    {
        /**
         * @member {number}
         * @default 0
         */
        this.x = Number(x);

        /**
         * @member {number}
         * @default 0
         */
        this.y = Number(y);

        /**
         * @member {number}
         * @default 0
         */
        this.width = Number(width);

        /**
         * @member {number}
         * @default 0
         */
        this.height = Number(height);

        /**
         * 对象的类型，主要被用来避免`instanceof`检测
         *
         * @member {number}
         * @readOnly
         * @default PIXI.SHAPES.RECT
         * @see PIXI.SHAPES
         */
        this.type = SHAPES.RECT;
    }

    /**
     * 返回矩形最左侧的X坐标
     *
     * @member {number}
     */
    get left()
    {
        return this.x;
    }

    /**
     * 返回矩形最右侧的X坐标
     *
     * @member {number}
     */
    get right()
    {
        return this.x + this.width;
    }

    /**
     * 返回矩形最上面的Y坐标
     *
     * @member {number}
     */
    get top()
    {
        return this.y;
    }

    /**
     * 返回矩形最下面的Y坐标
     *
     * @member {number}
     */
    get bottom()
    {
        return this.y + this.height;
    }

    /**
     * 一个所有值为0的空矩形
     *
     * @static
     * @constant
     */
    static get EMPTY()
    {
        return new Rectangle(0, 0, 0, 0);
    }

    /**
     * 克隆这个矩形对象
     *
     * @return {PIXI.Rectangle} 新拷贝的矩形
     */
    clone()
    {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    /**
     * 复制另一个矩形的参数到这个矩形
     *
     * @param {PIXI.Rectangle} rectangle - 被复制的矩形
     * @return {PIXI.Rectangle} 返回这个矩形本身
     */
    copy(rectangle)
    {
        this.x = rectangle.x;
        this.y = rectangle.y;
        this.width = rectangle.width;
        this.height = rectangle.height;

        return this;
    }

    /**
     * 检查传入的X和Y坐标是否包含在这个矩形内。
     *
     * @param {number} x - 测试点的X坐标
     * @param {number} y - 测试点的Y坐标
     * @return {boolean} x/y坐标是否在这个矩形内
     */
    contains(x, y)
    {
        if (this.width <= 0 || this.height <= 0)
        {
            return false;
        }

        if (x >= this.x && x < this.x + this.width)
        {
            if (y >= this.y && y < this.y + this.height)
            {
                return true;
            }
        }

        return false;
    }

    /**
     * 用传入的内边距撑大这个矩形
     *
     * @param {number} paddingX - 水平内边距
     * @param {number} [paddingY] - 垂直内边距
     */
    pad(paddingX, paddingY)
    {
        paddingX = paddingX || 0;
        paddingY = paddingY || ((paddingY !== 0) ? paddingX : 0);

        this.x -= paddingX;
        this.y -= paddingY;

        this.width += paddingX * 2;
        this.height += paddingY * 2;
    }

    /**
     * 用这个矩形去拟合传入的矩形
     *
     * @param {PIXI.Rectangle} rectangle - 用来拟合的矩形
     */
    fit(rectangle)
    {
        if (this.x < rectangle.x)
        {
            this.width += this.x;
            if (this.width < 0)
            {
                this.width = 0;
            }

            this.x = rectangle.x;
        }

        if (this.y < rectangle.y)
        {
            this.height += this.y;
            if (this.height < 0)
            {
                this.height = 0;
            }
            this.y = rectangle.y;
        }

        if (this.x + this.width > rectangle.x + rectangle.width)
        {
            this.width = rectangle.width - this.x;
            if (this.width < 0)
            {
                this.width = 0;
            }
        }

        if (this.y + this.height > rectangle.y + rectangle.height)
        {
            this.height = rectangle.height - this.y;
            if (this.height < 0)
            {
                this.height = 0;
            }
        }
    }

    /**
     * 扩大这个矩形去容纳传入的矩形
     *
     * @param {PIXI.Rectangle} rectangle - 被包住的矩形
     */
    enlarge(rectangle)
    {
        const x1 = Math.min(this.x, rectangle.x);
        const x2 = Math.max(this.x + this.width, rectangle.x + rectangle.width);
        const y1 = Math.min(this.y, rectangle.y);
        const y2 = Math.max(this.y + this.height, rectangle.y + rectangle.height);

        this.x = x1;
        this.width = x2 - x1;
        this.y = y1;
        this.height = y2 - y1;
    }
}
