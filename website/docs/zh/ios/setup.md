# iOS 配置

Voltra 渲染到原生 iOS 实时活动和小组件,所以你需要一个嵌入了 Lynx SDK 并
注册了 Voltra 原生模块的 iOS 宿主 app。最快的路径是直接用仓库里的
[**参考宿主**](https://github.com/Huxpro/voltra-lynx/tree/main/voltra-lynx/host/ios):
这是一个可运行的 Xcode 工程(xcodegen + CocoaPods),原生模块和 Widget
Extension 都已经接好了。

本页覆盖两种工作流:

- **模拟器**:支持热重载(Debug 构建,需开发服务器)
- **真机 iPhone**:打包嵌入 JS bundle(Release 构建,可离线运行)

## 一键 AI 构建提示词(模拟器)

把下面这段贴到 Claude Code、Cursor 或任意编码 agent 里。它会带你从一份
全新克隆走到模拟器上跑起一条实时活动。

> 在一台已启动的 iOS 模拟器上构建并启动 Voltra Lynx iOS demo。
>
> 仓库:`<repo root>`。iOS 宿主:`voltra-lynx/host/ios/LynxVoltra/`。
> JS bundle 源:`voltra-lynx/packages/example-app/`。
>
> 前置条件见 `voltra-lynx/host/ios/README.md` §Prerequisites。严格按
> §Rebuild from clean 的步骤顺序执行。`xcrun simctl launch …` 之后,用
> `xcrun simctl io <sim_id> screenshot ./lynx-app-launch.png` 截一张
> 主屏,并报告文件路径。开发服务器必须保持后台运行,不要杀掉。
>
> 验收标准:模拟器显示 Voltra demo 导航屏(不是白屏,不是红色错误屏),
> 并且至少有一次点击能在灵动岛里真实拉起一条实时活动。

## 模拟器:全新 checkout 7 步起步

```bash
# 1. 安装整个 monorepo 的 JS 依赖
cd voltra-lynx && pnpm install

# 2. 后台启动 Lynx 开发服务器
( cd packages/example-app && pnpm dev ) &
curl -sI http://localhost:3000/main.lynx.bundle | head -1   # HTTP/1.1 200

# 3. 用 project.yml 重新生成 Xcode 工程
cd host/ios/LynxVoltra
rm -rf LynxVoltra.xcodeproj LynxVoltra.xcworkspace Pods Podfile.lock build
xcodegen generate

# 4. 安装 Pods(Lynx 3.7.0 + PrimJS 3.7.0)
pod install

# 5. 给模拟器构建
SIM_ID=$(xcrun simctl list devices booted | grep -oE '\([A-F0-9-]{36}\)' | tr -d '()' | head -1)
xcodebuild \
  -workspace LynxVoltra.xcworkspace \
  -scheme LynxVoltra \
  -configuration Debug \
  -sdk iphonesimulator \
  -derivedDataPath ./build \
  -destination "platform=iOS Simulator,id=$SIM_ID" \
  build

# 6. 安装并启动
APP=./build/Build/Products/Debug-iphonesimulator/LynxVoltra.app
xcrun simctl install "$SIM_ID" "$APP"
xcrun simctl launch  "$SIM_ID" com.voltra.lynx.demo

# 7. 验证
xcrun simctl io "$SIM_ID" screenshot ./lynx-app-launch.png
open ./lynx-app-launch.png
```

启动后会看到 Voltra 导航屏:一个 demo 列表(Basic、Flight Tracker、
Music Player、Workout Tracker、Weather Widget 等)。点任意一个 demo,
对应的 SwiftUI 实时活动就会出现在灵动岛里。

## 真机 iPhone:Release / 嵌入 bundle

如果想要在真机上做离线 demo(装完之后不需要开发服务器,也不需要 Mac),
请用 Release 构建。`ViewController.swift` 会自动切换路径:

```swift
private static let templateURL: String = {
  #if DEBUG
    return "http://localhost:3000/main.lynx.bundle"  // 模拟器 / 开发态
  #else
    return "main.lynx"                                // Release / 嵌入态
  #endif
}()
```

…同时 `project.yml` 里声明了一个构建前脚本:仅当 `CONFIGURATION = Release`
时,会在 `packages/example-app/` 里执行 `pnpm build`,并把
`dist/main.lynx.bundle` 拷进 `.app` 的资源里。

### 真机配置清单

| 必须项 | 怎么做 |
|---|---|
| 开发者模式 | 设置 → 隐私与安全性 → 开发者模式 → 开启,然后重启 |
| 信任此 Mac | 插上数据线;在手机上点"信任";输入锁屏密码 |
| iPhone 解锁并连接 | 锁屏会禁用设备协调 |
| Apple Developer Team ID | Xcode → 设置 → 账户。仓库默认是 `ZBB74974C5`,把 `project.yml` 里的 `DEVELOPMENT_TEAM` 改成你自己的 |

```bash
xcrun devicectl list devices
# 找 State = "connected" 或 "available"。如果是 "unavailable",重插一下。
```

### 真机构建

```bash
cd voltra-lynx/host/ios/LynxVoltra
rm -rf build   # 重要:只清 build/,留下 Pods/

xcodebuild \
  -workspace LynxVoltra.xcworkspace \
  -scheme LynxVoltra \
  -configuration Release \
  -sdk iphoneos \
  -derivedDataPath ./build \
  -destination "generic/platform=iOS" \
  -allowProvisioningUpdates \
  build
```

:::warning
如果刚刚给模拟器构建过,直接 `iphoneos` 构建会因为
`'Lynx/LynxConfig.h' file not found` 而失败,除非先 `rm -rf build/`。
Swift 桥接头扫描会缓存模拟器架构的 header maps,跟设备架构冲突。
:::

### 安装到设备

```bash
DEVICE_UDID=$(xcrun devicectl list devices --filter-state connected \
              | grep -oE '[A-F0-9-]{36}' | head -1)
APP=./build/Build/Products/Release-iphoneos/LynxVoltra.app

xcrun devicectl device install app --device "$DEVICE_UDID" "$APP"
xcrun devicectl device process launch --device "$DEVICE_UDID" \
       com.voltra.lynx.demo
```

如果 `devicectl` 报
`CoreDeviceService was unable to locate a device matching the requested
device identifier`,这是 CoreDevice 在抽风,通常是因为设备的 iOS 版本比
Xcode 自带的 DeviceSupport 还新(比如 Xcode 26.0 配 iOS 26.4.2 的
iPhone)。这种情况下回退到 Xcode UI:

```bash
open voltra-lynx/host/ios/LynxVoltra/LynxVoltra.xcworkspace
```

在工具栏选择你的 iPhone,把 Edit Scheme → Run → Build Configuration 设为
**Release**,然后 Cmd+R。Xcode 会按需下载缺失的 DeviceSupport、签名、
安装并启动。

### 首次启动时信任开发者证书

iOS 会拒绝运行用陌生开发者证书签名的 app,直到你信任它一次:

> 设置 → 通用 → VPN 与设备管理 →
> **Apple Development: huxpro@gmail.com** → 信任

之后 app 就会以 **LynxVoltra** 的名字出现在主屏。打开它后,嵌入的
`main.lynx.bundle` 会经由 `DemoLynxProvider` 从 `Bundle.main` 加载,
不再需要开发服务器。

### 免费 Apple 账号下的实时活动 / 小组件

用 **免费** 的 Apple Developer 账号,实时活动和主屏小组件可以正常工作,
但 provisioning profile 会在 **7 天**后过期,需要每周重新构建并重装一次。
付费的 Apple Developer Program 账号下,签名是长期有效的。

App Group `group.com.voltra.lynx.demo`(用于在 app 和扩展之间共享小组件
数据)只要两个 target 用同一个 team 签名,Xcode 会自动帮你 provisioning。
