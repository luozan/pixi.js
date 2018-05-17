import Shader from '../../../Shader';

/**
 * 这个着色器是用于{@link PIXI.Graphics}绘制简单的基本图形。
 *
 * @class
 * @memberof PIXI
 * @extends PIXI.Shader
 */
export default class PrimitiveShader extends Shader
{
    /**
     * @param {WebGLRenderingContext} gl - 运行这个着色器的WebGL着色器管理器。
     */
    constructor(gl)
    {
        super(gl,
            // vertex shader
            [
                'attribute vec2 aVertexPosition;',
                'attribute vec4 aColor;',

                'uniform mat3 translationMatrix;',
                'uniform mat3 projectionMatrix;',

                'uniform float alpha;',
                'uniform vec3 tint;',

                'varying vec4 vColor;',

                'void main(void){',
                '   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);',
                '   vColor = aColor * vec4(tint * alpha, alpha);',
                '}',
            ].join('\n'),
            // fragment shader
            [
                'varying vec4 vColor;',

                'void main(void){',
                '   gl_FragColor = vColor;',
                '}',
            ].join('\n')
        );
    }
}
