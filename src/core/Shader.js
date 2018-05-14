import { GLShader } from 'pixi-gl-core';
import settings from './settings';

function checkPrecision(src, def)
{
    if (src instanceof Array)
    {
        if (src[0].substring(0, 9) !== 'precision')
        {
            const copy = src.slice(0);

            copy.unshift(`precision ${def} float;`);

            return copy;
        }
    }
    else if (src.trim().substring(0, 9) !== 'precision')
    {
        return `precision ${def} float;\n${src}`;
    }

    return src;
}

/**
 * 为Pixi封装的WebGL着色器类。
 * 如果vertexSrc或者fragmentSrc中没有声明浮点精度，则需要传入precision字符串。
 *
 * @class
 * @extends GLShader
 * @memberof PIXI
 */
export default class Shader extends GLShader
{
    /**
     *
     * @param {WebGLRenderingContext} gl - 当前渲染中的WebGL上下文。
     * @param {string|string[]} vertexSrc - 字符串数组类型的顶点着色器源码。
     * @param {string|string[]} fragmentSrc - 字符串数组类型的片元着色器源码。
     * @param {object} [attributeLocations] - 存放着色器变量指针的键值对。
                       e.g. {position:0, uvs:1}.
     * @param {string} [precision] - 着色器的浮点精度。选项有：'lowp', 'mediump' or 'highp'。
     */
    constructor(gl, vertexSrc, fragmentSrc, attributeLocations, precision)
    {
        super(gl, checkPrecision(vertexSrc, precision || settings.PRECISION_VERTEX),
            checkPrecision(fragmentSrc, precision || settings.PRECISION_FRAGMENT), undefined, attributeLocations);
    }
}
