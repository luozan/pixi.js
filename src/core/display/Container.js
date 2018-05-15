import { removeItems } from '../utils';
import DisplayObject from './DisplayObject';

/**
 * 一个容器，表示可视化对象的集合。
 * 这是所有可视化对象的基类，它充当其他对象的容器。
 *
 *```js
 * let container = new PIXI.Container();
 * container.addChild(sprite);
 * ```
 *
 * @class
 * @extends PIXI.DisplayObject
 * @memberof PIXI
 */
export default class Container extends DisplayObject
{
    /**
     *
     */
    constructor()
    {
        super();

        /**
         * 容器的子对象存放在这个数组中。
         *
         * @member {PIXI.DisplayObject[]}
         * @readonly
         */
        this.children = [];
    }

    /**
     * 能被重载的方法，可以在Container的子类中使用，每当子对象数组被修改时会被调用。
     *
     * @private
     */
    onChildrenChange()
    {
        /* empty */
    }

    /**
     * 添加一个或更多子对象到这个容器中。
     *
     * 当有多个参数项时，可以像这样被添加：`myContainer.addChild(thingOne, thingTwo, thingThree)`
     *
     * @param {...PIXI.DisplayObject} child - 将添加到容器中的一个或多个可视化对象。
     * @return {PIXI.DisplayObject} 被添加的第一个子对象。
     */
    addChild(child)
    {
        const argumentsLength = arguments.length;

        // if there is only one argument we can bypass looping through the them
        if (argumentsLength > 1)
        {
            // loop through the arguments property and add all children
            // use it the right way (.length and [i]) so that this function can still be optimised by JS runtimes
            for (let i = 0; i < argumentsLength; i++)
            {
                this.addChild(arguments[i]);
            }
        }
        else
        {
            // if the child has a parent then lets remove it as PixiJS objects can only exist in one place
            if (child.parent)
            {
                child.parent.removeChild(child);
            }

            child.parent = this;
            // ensure child transform will be recalculated
            child.transform._parentID = -1;

            this.children.push(child);

            // ensure bounds will be recalculated
            this._boundsID++;

            // TODO - lets either do all callbacks or all events.. not both!
            this.onChildrenChange(this.children.length - 1);
            child.emit('added', this);
        }

        return child;
    }

    /**
     * 添加一个子对象到容器中，并指定一个索引。如果索引越界，将会抛出一个错误。
     *
     * @param {PIXI.DisplayObject} child - 添加进的子对象
     * @param {number} index - 子对象被添加到的索引位置。
     * @return {PIXI.DisplayObject} 被添加的子对象。
     */
    addChildAt(child, index)
    {
        if (index < 0 || index > this.children.length)
        {
            throw new Error(`${child}addChildAt: The index ${index} supplied is out of bounds ${this.children.length}`);
        }

        if (child.parent)
        {
            child.parent.removeChild(child);
        }

        child.parent = this;
        // ensure child transform will be recalculated
        child.transform._parentID = -1;

        this.children.splice(index, 0, child);

        // ensure bounds will be recalculated
        this._boundsID++;

        // TODO - lets either do all callbacks or all events.. not both!
        this.onChildrenChange(index);
        child.emit('added', this);

        return child;
    }

    /**
     * 交换两个可视化对象在这个容器中的位置。
     *
     * @param {PIXI.DisplayObject} child - 交换用的第一个可视化对象。
     * @param {PIXI.DisplayObject} child2 - 交换用的第二个可视化对象。
     */
    swapChildren(child, child2)
    {
        if (child === child2)
        {
            return;
        }

        const index1 = this.getChildIndex(child);
        const index2 = this.getChildIndex(child2);

        this.children[index1] = child2;
        this.children[index2] = child;
        this.onChildrenChange(index1 < index2 ? index1 : index2);
    }

    /**
     * 返回一个可视化对象实例的索引位置。
     *
     * @param {PIXI.DisplayObject} child - 可视化对象实例。
     * @return {number} 可视化对象实例的索引位置。
     */
    getChildIndex(child)
    {
        const index = this.children.indexOf(child);

        if (index === -1)
        {
            throw new Error('The supplied DisplayObject must be a child of the caller');
        }

        return index;
    }

    /**
     * 改变一个子对象在容器中的索引位置。
     *
     * @param {PIXI.DisplayObject} child - 你想改变索引位置的子对象，它一个可视化对象实例。
     * @param {number} index - 想要设置的子可视化对象的索引位置。
     */
    setChildIndex(child, index)
    {
        if (index < 0 || index >= this.children.length)
        {
            throw new Error(`The index ${index} supplied is out of bounds ${this.children.length}`);
        }

        const currentIndex = this.getChildIndex(child);

        removeItems(this.children, currentIndex, 1); // remove from old position
        this.children.splice(index, 0, child); // add at new position

        this.onChildrenChange(index);
    }

    /**
     * 返回指定索引的子对象。
     *
     * @param {number} index - 用来获取子对象的索引。
     * @return {PIXI.DisplayObject} 如果存在的话，返回指定索引位置的子对象。
     */
    getChildAt(index)
    {
        if (index < 0 || index >= this.children.length)
        {
            throw new Error(`getChildAt: Index (${index}) does not exist.`);
        }

        return this.children[index];
    }

    /**
     * 从容器中移除一个或多个子对象。
     *
     * @param {...PIXI.DisplayObject} child - 想要从容器中移除的一个或多个可视化对象。
     * @return {PIXI.DisplayObject} 被移除的第一个子对象。
     */
    removeChild(child)
    {
        const argumentsLength = arguments.length;

        // if there is only one argument we can bypass looping through the them
        if (argumentsLength > 1)
        {
            // loop through the arguments property and add all children
            // use it the right way (.length and [i]) so that this function can still be optimised by JS runtimes
            for (let i = 0; i < argumentsLength; i++)
            {
                this.removeChild(arguments[i]);
            }
        }
        else
        {
            const index = this.children.indexOf(child);

            if (index === -1) return null;

            child.parent = null;
            // ensure child transform will be recalculated
            child.transform._parentID = -1;
            removeItems(this.children, index, 1);

            // ensure bounds will be recalculated
            this._boundsID++;

            // TODO - lets either do all callbacks or all events.. not both!
            this.onChildrenChange(index);
            child.emit('removed', this);
        }

        return child;
    }

    /**
     * 移除在指定索引位置的子对象。
     *
     * @param {number} index - 指定索引位置。
     * @return {PIXI.DisplayObject} 被移除的子对象。
     */
    removeChildAt(index)
    {
        const child = this.getChildAt(index);

        // ensure child transform will be recalculated..
        child.parent = null;
        child.transform._parentID = -1;
        removeItems(this.children, index, 1);

        // ensure bounds will be recalculated
        this._boundsID++;

        // TODO - lets either do all callbacks or all events.. not both!
        this.onChildrenChange(index);
        child.emit('removed', this);

        return child;
    }

    /**
     * 从容器中移除在指定的开始索引到结束索引之间的子对象。
     *
     * @param {number} [beginIndex=0] - 开始位置。
     * @param {number} [endIndex=this.children.length] - 结束位置。默认值是容器的大小。
     * @returns {DisplayObject[]} List of removed children
     */
    removeChildren(beginIndex = 0, endIndex)
    {
        const begin = beginIndex;
        const end = typeof endIndex === 'number' ? endIndex : this.children.length;
        const range = end - begin;
        let removed;

        if (range > 0 && range <= end)
        {
            removed = this.children.splice(begin, range);

            for (let i = 0; i < removed.length; ++i)
            {
                removed[i].parent = null;
                if (removed[i].transform)
                {
                    removed[i].transform._parentID = -1;
                }
            }

            this._boundsID++;

            this.onChildrenChange(beginIndex);

            for (let i = 0; i < removed.length; ++i)
            {
                removed[i].emit('removed', this);
            }

            return removed;
        }
        else if (range === 0 && this.children.length === 0)
        {
            return [];
        }

        throw new RangeError('removeChildren: numeric values are outside the acceptable range.');
    }

    /**
     * 在渲染时更新这个容器中所有子对象的变换。
     */
    updateTransform()
    {
        this._boundsID++;

        this.transform.updateTransform(this.parent.transform);

        // TODO: check render flags, how to process stuff here
        this.worldAlpha = this.alpha * this.parent.worldAlpha;

        for (let i = 0, j = this.children.length; i < j; ++i)
        {
            const child = this.children[i];

            if (child.visible)
            {
                child.updateTransform();
            }
        }
    }

    /**
     * 重新计算容器的包围盒。
     *
     */
    calculateBounds()
    {
        this._bounds.clear();

        this._calculateBounds();

        for (let i = 0; i < this.children.length; i++)
        {
            const child = this.children[i];

            if (!child.visible || !child.renderable)
            {
                continue;
            }

            child.calculateBounds();

            // TODO: filter+mask, need to mask both somehow
            if (child._mask)
            {
                child._mask.calculateBounds();
                this._bounds.addBoundsMask(child._bounds, child._mask._bounds);
            }
            else if (child.filterArea)
            {
                this._bounds.addBoundsArea(child._bounds, child.filterArea);
            }
            else
            {
                this._bounds.addBounds(child._bounds);
            }
        }

        this._lastBoundsID = this._boundsID;
    }

    /**
     * 重新计算对象的包围盒。
     * 重载这个方法，可以重新计算一个特定对象的包围盒（不包括它的子对象）。
     *
     */
    _calculateBounds()
    {
        // FILL IN//
    }

    /**
     * 使用WebGL渲染器渲染对象。
     *
     * @param {PIXI.WebGLRenderer} renderer - 渲染器
     */
    renderWebGL(renderer)
    {
        // if the object is not visible or the alpha is 0 then no need to render this element
        if (!this.visible || this.worldAlpha <= 0 || !this.renderable)
        {
            return;
        }

        // do a quick check to see if this element has a mask or a filter.
        if (this._mask || this._filters)
        {
            this.renderAdvancedWebGL(renderer);
        }
        else
        {
            this._renderWebGL(renderer);

            // simple render children!
            for (let i = 0, j = this.children.length; i < j; ++i)
            {
                this.children[i].renderWebGL(renderer);
            }
        }
    }

    /**
     * 使用带有新特性的WebGL渲染器渲染对象。
     *
     * @private
     * @param {PIXI.WebGLRenderer} renderer - 渲染器
     */
    renderAdvancedWebGL(renderer)
    {
        renderer.flush();

        const filters = this._filters;
        const mask = this._mask;

        // push filter first as we need to ensure the stencil buffer is correct for any masking
        if (filters)
        {
            if (!this._enabledFilters)
            {
                this._enabledFilters = [];
            }

            this._enabledFilters.length = 0;

            for (let i = 0; i < filters.length; i++)
            {
                if (filters[i].enabled)
                {
                    this._enabledFilters.push(filters[i]);
                }
            }

            if (this._enabledFilters.length)
            {
                renderer.filterManager.pushFilter(this, this._enabledFilters);
            }
        }

        if (mask)
        {
            renderer.maskManager.pushMask(this, this._mask);
        }

        // add this object to the batch, only rendered if it has a texture.
        this._renderWebGL(renderer);

        // now loop through the children and make sure they get rendered
        for (let i = 0, j = this.children.length; i < j; i++)
        {
            this.children[i].renderWebGL(renderer);
        }

        renderer.flush();

        if (mask)
        {
            renderer.maskManager.popMask(this, this._mask);
        }

        if (filters && this._enabledFilters && this._enabledFilters.length)
        {
            renderer.filterManager.popFilter();
        }
    }

    /**
     * 会被子类重载。
     *
     * @private
     * @param {PIXI.WebGLRenderer} renderer - 渲染器
     */
    _renderWebGL(renderer) // eslint-disable-line no-unused-vars
    {
        // this is where content itself gets rendered...
    }

    /**
     * 会被子类重载。
     *
     * @private
     * @param {PIXI.CanvasRenderer} renderer - 渲染器
     */
    _renderCanvas(renderer) // eslint-disable-line no-unused-vars
    {
        // this is where content itself gets rendered...
    }

    /**
     * 使用Canvas渲染器渲染对象。
     *
     * @param {PIXI.CanvasRenderer} renderer - 渲染器
     */
    renderCanvas(renderer)
    {
        // if not visible or the alpha is 0 then no need to render this
        if (!this.visible || this.worldAlpha <= 0 || !this.renderable)
        {
            return;
        }

        if (this._mask)
        {
            renderer.maskManager.pushMask(this._mask);
        }

        this._renderCanvas(renderer);
        for (let i = 0, j = this.children.length; i < j; ++i)
        {
            this.children[i].renderCanvas(renderer);
        }

        if (this._mask)
        {
            renderer.maskManager.popMask(renderer);
        }
    }

    /**
     * 清空内部的引用和监听器，并且从显示列表中移除所有子对象。
     * 调用`destroy`过后，不要再使用这个容器。
     *
     * @param {object|boolean} [options] - 选项参数。
     * 如果传入一个布尔类型的值，所有选项都将设置为该值。
     * @param {boolean} [options.children=false] - 如果设置为true，将调用所有子对象的销毁方法。
     *  'options' 将传给这些子对象的销毁方法。
     * @param {boolean} [options.texture=false] - 仅用于Sprite类型的子对象，如果options.children设置为true，
     *  则会销毁Sprite类型子对象的纹理。
     * @param {boolean} [options.baseTexture=false] - 仅用于Sprite类型的子对象，如果options.children设置为true，
     *  则会销毁Sprite类型子对象的基础纹理。
     */
    destroy(options)
    {
        super.destroy();

        const destroyChildren = typeof options === 'boolean' ? options : options && options.children;

        const oldChildren = this.removeChildren(0, this.children.length);

        if (destroyChildren)
        {
            for (let i = 0; i < oldChildren.length; ++i)
            {
                oldChildren[i].destroy(options);
            }
        }
    }

    /**
     * 容器的宽度，设置这个属性将会修改scale属性，产生缩放的效果。
     *
     * @member {number}
     */
    get width()
    {
        return this.scale.x * this.getLocalBounds().width;
    }

    set width(value) // eslint-disable-line require-jsdoc
    {
        const width = this.getLocalBounds().width;

        if (width !== 0)
        {
            this.scale.x = value / width;
        }
        else
        {
            this.scale.x = 1;
        }

        this._width = value;
    }

    /**
     * 容器的高度，设置这个属性将会修改scale属性，产生缩放的效果。
     *
     * @member {number}
     */
    get height()
    {
        return this.scale.y * this.getLocalBounds().height;
    }

    set height(value) // eslint-disable-line require-jsdoc
    {
        const height = this.getLocalBounds().height;

        if (height !== 0)
        {
            this.scale.y = value / height;
        }
        else
        {
            this.scale.y = 1;
        }

        this._height = value;
    }
}

// performance increase to avoid using call.. (10x faster)
Container.prototype.containerUpdateTransform = Container.prototype.updateTransform;
