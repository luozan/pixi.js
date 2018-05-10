PixiJS — HTML5 渲染引擎
=============

![pixi.js logo](http://pixijs.download/pixijs-banner.png)

[![Inline docs](http://inch-ci.org/github/pixijs/pixi.js.svg?branch=dev)](http://inch-ci.org/github/pixijs/pixi.js)
[![Build Status](https://travis-ci.org/pixijs/pixi.js.svg?branch=dev)](https://travis-ci.org/pixijs/pixi.js)

PixiJS的目标是提供一个能在所有设备上运行，并且快速、轻量级的2D图形库。
PixiJS 渲染引擎能让每一个人享受到硬件加速，而无需预先学习WebGL知识。
强调一下，PixiJS渲染是真的快，真的真的快！

如果你想要了解PixiJS最新消息，那么可以选择follow官方的Twitter([@doormat23](https://twitter.com/doormat23), [@rolnaaba](https://twitter.com/rolnaaba), [@bigtimebuddy](https://twitter.com/bigtimebuddy), [@ivanpopelyshev](https://twitter.com/ivanpopelyshev))，我们会即时把信息告诉你！
你也可以通过官网获取消息，无论是Twitter还是网站，都会第一时间发布最新的进展！

**你的支持可以帮助将们P将ixiJS做得更好。打赏请访问[Patreon](https://www.patreon.com/user?u=2384552&ty=h&u=2384552)，官方爱你到永远。**

### PixiJS可以用来做什么以及什么时候用使用它

PixiJS 是一个用渲染库，可以用来创建丰富的、可交互的图形，或是跨平台的应用和游戏，并且无需掌握Webgl的API又或着处理浏览器和设备的兼容性问题。

PixiJS 完全支持[WebGL](https://en.wikipedia.org/wiki/WebGL)，如有需要也可以无缝地回滚到[Canvas2D](https://en.wikipedia.org/wiki/Canvas_element)。
作为一个框架，PixiJS是创作可交互内容的不二之选，*特别是近年来，Adebe Flash退出以后*。
你可以用它创作任何拥有丰富图形且可交互的网站、应用以及HTML5游戏。
PixiJS跨平台兼容，和从Webgl到Canvas2D自动降级处理的特性，意味着你可以花很少的工作，享受更多的开发乐趣。
如果你想快速地创造出优雅、精致的体验，而又不需要深入到复杂而又底层的代码中，还要同时避免令人头疼不已的浏览器兼容性问题，那还犹豫什么，赶紧在你的下一个项目中施加PixiJS的魔法吧！

**助力你的开发并且展现你的想象力！**

### 学习 ###
- 网站：更多PixiJS的信息尽在[官网](http://www.pixijs.com/)。
- 入门：查看 @kittykatattack 的[教程合集](https://github.com/kittykatattack/learningPixi)*（有中文版）*。
- 示例：陷入困境，快来试试PixiJS[官方示例](http://pixijs.github.io/examples/)！
- 文档：想要学习PixiJS的API，当然要看[API文档](https://pixijs.github.io/docs/)。
- Wiki：想要获取其他各种各样的教程和资源，可以访问[on the Wiki](https://github.com/pixijs/pixi.js/wiki)。

### 社区 ###
- 论坛：访问[论坛](http://www.html5gamedevs.com/forum/15-pixijs/)或者[Stackoverflow](http://stackoverflow.com/search?q=pixi.js)，询问有关Pixi的问题，两个都是好去处。
- 案例：访问[gallery](http://www.pixijs.com/gallery)去观看开发者们令人惊讶的作品。
- 交流：你可以加入我们的[Gitter](https://gitter.im/pixijs/pixi.js) 一起交流PixiJS。 我们现在也有一个 Slack 频道。如果你想加入请给我发送邮件(mat@goodboydigital.com)，我会邀请你加入。

### 安装 ###

开始使用PixiJS非常简单！只需下载一个预先构建好的[PixiJS](https://github.com/pixijs/pixi.js/wiki/FAQs#where-can-i-get-a-build)！

还有两种方式，可以任选一种，通过[npm](https://docs.npmjs.com/getting-started/what-is-npm)安装PixiJS，或者简单的在你的HTML页面里直接嵌入一个CDN URL。

#### 通过NPM安装

```sh
npm install pixi.js
```
PixiJS没有默认的export。正确导入的方式如下：

```js
import * as PIXI from 'pixi.js'
```

#### 通过CDN安装 (via cdnjs)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.7.1/pixi.min.js"></script>
```

_Note: URL中的`4.7.1` 可以被替换成任何[发布版](https://github.com/pixijs/pixi.js/releases) 的版本号._

### Demos ###

- [滤镜(Filters) Demo](http://pixijs.io/pixi-filters/tools/demo/)
- [精灵跑酷(Run Pixie Run)](http://work.goodboydigital.com/runpixierun/)
- [Flash vs HTML](http://flashvhtml.com)
- [性能演示(Bunny Demo)](http://www.goodboydigital.com/pixijs/bunnymark)
- [风暴来临(Storm Brewing)](http://www.goodboydigital.com/pixijs/storm)
- [渲染纹理(Render Texture) Demo](http://www.goodboydigital.com/pixijs/examples/11)
- [基本图形(Primitives) Demo](http://www.goodboydigital.com/pixijs/examples/13)
- [遮罩(Masking) Demo](http://www.goodboydigital.com/pixijs/examples/14)
- [交互(Interaction) Demo](http://www.goodboydigital.com/pixijs/examples/6)
- [photonstorm的球(photonstorm's Balls) Demo](http://gametest.mobi/pixi/balls)
- [photonstorm的图形变换(photonstorm's Morph) Demo](http://gametest.mobi/pixi/morph)

感谢[@photonstorm](https://twitter.com/photonstorm)
提供并允许我们分享最后两个例子的源码:)

### 贡献 ###

想成为PixiJS项目的一份子？很好！非常欢迎！我们可以一起实现它:)
无论你是发现了bug，还是有一个不错的特性请求，又或者你想要一个项目开发规划中的任务，你都可以随意去做！

但是在提交你的代码前，请务必阅读[贡献指南](.github/CONTRIBUTING.md)

### 当前特性 ###

- WebGL渲染器 (具有自动、智能、能渲染批量图形的特性，以及非常快的性能)
- Canvas渲染器 (史上最快！)
- 全景图(Full scene graph)
- 超级简单好用的API(和Flash display list API相似)
- 支持纹理集(texture atlases)
- 资源加载器 / 精灵表(雪碧图、sprite sheet)加载器Asset loader / sprite sheet loader
- 自动判断应该使用哪个渲染器
- 完整的鼠标和多点触摸(Multi-touch)交互
- 文本(Text)
- 位图文字文本(BitmapFont text)
- 多行文本(Multiline Text)
- 渲染纹理(Render Texture)
- 基本矢量图形(Primitive Drawing)
- 遮罩(Masking)
- 滤镜(Filters)
- [用户插件](https://github.com/pixijs/pixi.js/wiki/v3-Pixi-Plugins)

### 基础示例 ###

```js
// Application会创建一个WebGL渲染器，当然，也有可能使用一个回滚后的Canvas渲染。
// 它还会创建、设置心跳定时器(the ticker)和主舞台(root stage) Pixi.Container
const app = new PIXI.Application();

// Application会为你创建一个cnavas元素(element)，你可以在之后插入到DOM中。
document.body.appendChild(app.view);

// 加载我们需要的纹理(Texture)
PIXI.loader.add('bunny', 'bunny.png').load((loader, resources) => {
    // 用图片'bunny.png'创建的纹理，创建一个精灵(Sprite)
    const bunny = new PIXI.Sprite(resources.bunny.texture);

    // 设置bunny的位置
    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;

    // 为了让它围绕中心点旋转，设置锚点到纹理的中心
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    // 把bunny添加到我们创建的舞台中
    app.stage.addChild(bunny);

    // 监听每一帧的更新
    app.ticker.add(() => {
         // 每一帧，我们都会旋转一下bunny
        bunny.rotation += 0.01;
    });
});
```

### 如何构建 (build) ###

大多数用户无需构建这个项目。如果你需要的仅仅是使用PixiJS，
那么只要下载一个我们的[预先发布版](https://github.com/pixijs/pixi.js/releases)。
只有在你开发、修改PixiJS源码的时候，才需要构建它。

如果你还没有安装Node.js和NPM，先去安装它们。然后在你clone到本地的仓库里，用npm安装构建所需要的依赖：


```sh
npm install
```

然后去构建源码，运行下面的命令：

```sh
npm run dist
```

这将创建一个的压缩版本`dist/pixi.min.js`和一个未压缩版本`dist/pixi.js`，文件中包括了这个PixiJS项目中所有的插件。

如果有你不需要的插件，那么使用"interaction"或者"extras"参数就能排除掉：

```sh
npm run dist -- --exclude extras --exclude interaction
```

你也可以使用缩写`-e`：

```sh
npm run dist -- -e extras -e interaction -e filters
```

### 如何生成文档  ###

可以用npm生成文档：

```sh
npm run docs
```

该文档使用 [Jaguar.js](https://github.com/pixijs/jaguarjs-jsdoc)和jsdoc格式, 配置文件路径： [scripts/jsdoc.conf.json](scripts/jsdoc.conf.json)

### License ###

该项目使用 (http://opensource.org/licenses/MIT) MIT License.

[![Analytics](https://ga-beacon.appspot.com/UA-39213431-2/pixi.js/index)](https://github.com/igrigorik/ga-beacon)