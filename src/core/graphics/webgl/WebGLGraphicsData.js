import glCore from 'pixi-gl-core';

/**
 * 储存WebGL渲染器所需要的所有WebGL具体属性的对象
 *
 * @class
 * @private
 * @memberof PIXI
 */
export default class WebGLGraphicsData
{
    /**
     * @param {WebGLRenderingContext} gl - 当前使用的WebGL绘图上下文
     * @param {PIXI.Shader} shader - 着色器
     * @param {object} attribsState - VAO状态
     */
    constructor(gl, shader, attribsState)
    {
        /**
         * 当前使用的WebGL绘图上下文
         *
         * @member {WebGLRenderingContext}
         */
        this.gl = gl;

        // TODO does this need to be split before uploading??
        /**
         * 颜色组件的数组(r,g,b)
         * @member {number[]}
         */
        this.color = [0, 0, 0]; // color split!

        /**
         * 储存绘制所需要的点的数组
         * @member {PIXI.Point[]}
         */
        this.points = [];

        /**
         * 顶点索引数组
         * @member {number[]}
         */
        this.indices = [];
        /**
         * 主缓冲
         * @member {WebGLBuffer}
         */
        this.buffer = glCore.GLBuffer.createVertexBuffer(gl);

        /**
         * 顶点缓冲
         * @member {WebGLBuffer}
         */
        this.indexBuffer = glCore.GLBuffer.createIndexBuffer(gl);

        /**
         * 这个图形是否被弄脏(是否需要更新)。
         * @member {boolean}
         */
        this.dirty = true;

        /**
         * Whether this graphics is nativeLines or not
         * @member {boolean}
         */
        this.nativeLines = false;

        this.glPoints = null;
        this.glIndices = null;

        /**
         *
         * @member {PIXI.Shader}
         */
        this.shader = shader;

        this.vao = new glCore.VertexArrayObject(gl, attribsState)
        .addIndex(this.indexBuffer)
        .addAttribute(this.buffer, shader.attributes.aVertexPosition, gl.FLOAT, false, 4 * 6, 0)
        .addAttribute(this.buffer, shader.attributes.aColor, gl.FLOAT, false, 4 * 6, 2 * 4);
    }

    /**
     * 重置顶点和索引
     */
    reset()
    {
        this.points.length = 0;
        this.indices.length = 0;
    }

    /**
     * 绑定缓冲区，并上传数据
     */
    upload()
    {
        this.glPoints = new Float32Array(this.points);
        this.buffer.upload(this.glPoints);

        this.glIndices = new Uint16Array(this.indices);
        this.indexBuffer.upload(this.glIndices);

        this.dirty = false;
    }

    /**
     * 清空所有数据
     */
    destroy()
    {
        this.color = null;
        this.points = null;
        this.indices = null;

        this.vao.destroy();
        this.buffer.destroy();
        this.indexBuffer.destroy();

        this.gl = null;

        this.buffer = null;
        this.indexBuffer = null;

        this.glPoints = null;
        this.glIndices = null;
    }
}
