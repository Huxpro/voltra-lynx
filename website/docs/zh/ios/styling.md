# 样式说明

Lynx 接受 Web CSS 的一个子集。有几条属性的行为跟 React Native 和 Web
不太一样,有些写错形状还会静默失效。写 Voltra JSX 之前值得快速过一遍。

## 布局

Lynx **同时支持 `display: flex`(完整的 CSS Flexbox)和 `display: linear`**
(类 Android LinearLayout)。Voltra-Lynx 优先用 flex;它跟 React Native 与
Web 的写法 1:1 对应。要注意的点是:`<view>` 的默认 `display` 是 `linear`,
所以要用 flex 时,需要在父节点上显式声明。

| 模式 | Web / RN | Lynx(推荐) | Lynx(linear 回退方案) |
|---|---|---|---|
| 横向行布局 | `display: 'flex', flexDirection: 'row'` | 同左 | `display: 'linear', linearDirection: 'row'` |
| 填满剩余空间(父节点是 flex) | `flex: 1` | `flex: 1` | — |
| 填满剩余空间(父节点是 linear,默认) | — | — | `linearWeight: 1` |
| 滚动方向 | `scroll-y` | `scroll-orientation="vertical"` | 同左 |
| 根视图尺寸 | `flex: 1` | `width: '100%', height: '100%'` | 同左 |

### `<scroll-view>` 规则

两条不太显然的规则,来自 Lynx 的
[`<scroll-view>` 参考文档](https://lynxjs.org/api/elements/built-in/scroll-view.html):

1. **`<scroll-view>` 的直接子节点永远走 linear 布局。** 想在里面用 flex?
   把内容包在一个 `<view style={{ display: 'flex' }}>` 子节点里就行。
2. **`<scroll-view>` 上的 `flex: 1` 只有在父节点是 `display: 'flex'` 时才生效。**
   如果父节点是默认的 `<view>`(也就是 linear),scroll-view 会算出
   **零高度**。解决办法:要么在父节点上设 `display: 'flex', flexDirection: 'column'`,
   要么在 scroll-view 上继续用 `linearWeight: 1`。

## 样式

| 模式 | 错误写法 | 正确写法 | 失败现象 |
|---|---|---|---|
| 圆角 | `borderRadius: 12` | `borderRadius: '12px'` | 静默忽略 |
| 行高 | `lineHeight: 18` | `lineHeight: '18px'` 或者去掉 | 18 × 字号 的巨大行间距 |
| padding 简写 | `paddingHorizontal: 16` | `paddingLeft: 16, paddingRight: 16` | 不生效 |

- `borderRadius` 写裸数字会被静默忽略,必须写成带 `px` 的字符串。Voltra
  上游所有例子都需要这条转换。
- `lineHeight` 写裸数字会被解释成 **倍数**,不是像素值。`18` 的意思是
  18 倍字号,会产生巨大的行间距。要么删掉它(Lynx 的默认值一般已经够好),
  要么写成带 `px` 的字符串。

## 文本与事件

- `<text>` 永远是块级元素,没有 inline 布局。
- `<view>` 里不能直接放裸文本,要包在 `<text>` 里。
- 用 `bindtap`,不要用 `onPress` 或 `onClick`。
- 跑在 background thread 上的 `NativeModule` 调用需要 `'background only'`
  指令。

## 静态资源

- 引入图片:`import img from '../assets/foo.png'` → 返回 URL 字符串
- 在 CSS 里用:`backgroundImage: url(${img})`
- 在 JSX 里用:`<image src={img} />`
- Lynx 宿主 app 需要配好 resource fetcher,这样开发期才能从 dev server
  加载这些资源 URL。

## 移植 Voltra 官方文档的例子

[use-voltra.dev](https://www.use-voltra.dev/) 上的 Voltra 例子里 CSS
全用的是裸数字。往 Lynx app 里搬的时候:

1. `borderRadius: N` → `borderRadius: 'Npx'`
2. `lineHeight: N` → `lineHeight: 'Npx'`(或者直接删)
3. `paddingHorizontal` / `paddingVertical` → 拆成显式的四边 padding
4. `onPress` → `bindtap`

在 `<Voltra.*>` JSX 里,这些规则只对真的会渲染到 Lynx 视图树里的部分有
影响(比如 `<voltra-preview>`、某个屏幕)。发给原生渲染器的 JSON
负载只是透传样式对象;主屏上的小组件最终拿到的字节是一样的。
