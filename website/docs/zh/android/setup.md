# Android 配置

Voltra 通过 Jetpack Compose Glance 渲染小组件和 Live Update,所以你需要一个
嵌入了 Lynx SDK 并注册了 Voltra 原生模块的 Android 宿主 app。最快的路径是
直接用
[**参考宿主**](https://github.com/Huxpro/voltra-lynx/tree/main/voltra-lynx/host/android):
一个可运行的 Gradle 工程,原生模块和 Glance widget receiver 都已经接好了。

## 一键 AI 构建提示词

> 在已连接的设备或模拟器上构建并安装 Voltra Lynx Android demo。
>
> 工作树:`voltra-lynx/host/android/`。JS bundle 源:
> `voltra-lynx/packages/example-app/`。
>
> 阅读 `voltra-lynx/host/android/README.md` §Rebuild from clean。在执行
> `./gradlew installDebug` **之前** 先启动 Lynx 开发服务器(在
> `packages/example-app` 里跑 `pnpm dev`)。`LynxView` 运行时会从
> `http://10.0.2.2:3000/main.lynx.bundle` 加载(模拟器的宿主 loopback)。
> 真机调试需要 `adb reverse tcp:3000 tcp:3000`。
>
> 验收标准:跑完
> `adb shell am start -n com.voltra.lynx.demo/.SplashActivity`,再用
> `adb exec-out screencap -p > /tmp/android-app-launch.png` 截屏,屏幕
> 不是空白,而是 Voltra demo 屏。

## 前置条件

| 工具 | 版本 | 安装方式 |
|---|---|---|
| Android Studio | Hedgehog (2023.1) 或更新 | https://developer.android.com/studio |
| Android SDK | 最低 API 26(Glance 要求),目标 API 35 | 通过 Android Studio SDK Manager |
| JDK | 17 | `brew install --cask temurin` |
| Node.js | 20+ | `brew install node` |
| pnpm | 9+ | `npm i -g pnpm` |
| `adb` | 最新 | 随 Android Studio 一起装 |

需要一台运行中的模拟器(Glance 小组件要求 API 26+)或者一台开了 USB
调试的真机。

```bash
# 如果还没有 local.properties,创建一个;告诉 Gradle 你的 SDK 位置
echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties
```

## 构建并安装

```bash
cd voltra-lynx
pnpm install
( cd packages/example-app && pnpm dev ) &     # 监听 http://localhost:3000

# 模拟器不需要额外步骤,`10.0.2.2` 就是宿主 loopback
# 真机的话,通过 USB 把端口转发过去:
adb reverse tcp:3000 tcp:3000

cd host/android
./gradlew :app:installDebug
adb shell am start -n com.voltra.lynx.demo/.SplashActivity
```

第一次构建会下载 Gradle 8.x + Android Gradle Plugin + Lynx SDK 制品。
第一次大概 3 到 10 分钟,后面增量构建在 30 秒内。

## 验证

```bash
adb exec-out screencap -p > /tmp/android-app-launch.png
open /tmp/android-app-launch.png    # Linux 上用 xdg-open
```

应该能看到 Voltra demo 导航屏。点 *Material Colors Widget* 或
*Chart Widget* 就能把一个 Glance 小组件放到主屏上。

## 宿主目录结构

```
host/android/
├── settings.gradle.kts             ← 包含 :app 和 :voltra 两个模块
├── build.gradle.kts                ← 根级 plugin 版本
├── gradle/libs.versions.toml       ← version catalog
├── app/                            ← demo 应用
│   └── src/main/
│       └── java/com/voltra/lynx/demo/
│           ├── VoltraApplication.kt    ← LynxEnv 初始化 + 模块注册
│           ├── SplashActivity.kt       ← LynxView 宿主
│           └── BuiltinTemplateProvider.kt
└── voltra/                         ← 库模块(从上游 vendored 来的代码)
    └── src/main/java/voltra/
        ├── VoltraLynxModule.kt         ← Layer 3(新增,558 LoC)
        ├── widget/                     ← Layer 4 · Glance 渲染
        ├── glance/                     ← RemoteViews 生成器 + 样式工具
        ├── notification/               ← live update 和 ongoing notification
        ├── styling/                    ← 样式解析器和转换器
        └── parsing/                    ← 负载解析器 + 解压
```

`VoltraLynxModule.kt` 是 558 行新代码,暴露了 28 个用 `@LynxMethod`
标注的方法。`voltra/` 下面的其他代码跟上游 Voltra 的 Android 原生代码
字节级一致。

## 故障排查

| 现象 | 原因 | 修复 |
|---|---|---|
| `SDK location not found` | `local.properties` 缺失 | `echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties` |
| App 打开是白屏 | 模拟器连不上 dev server | 在模拟器浏览器里访问 `http://10.0.2.2:3000/main.lynx.bundle` 确认通 |
| Glance 小组件渲染成灰色框 | AppWidget host 还没重新绑定 | 在 launcher 的 widget picker 里重新添加小组件 |
| `compileSdk = 36` 告警 | 用了边缘 SDK | 装 API 36 平台,或者把 `app/build.gradle.kts` 里的 `compileSdk` 降回 35 |
