# 简介

Voltra 是一个用 ReactLynx JSX 构建 iOS 实时活动(Live Activity)、灵动岛
(Dynamic Island)以及 Android 主屏幕小组件的库。在此之前,这些功能都需要
写 Swift 或 Kotlin 原生代码才能实现。

Voltra 为你提供了 JavaScript API 和 JSX 组件,它们会自动映射为各平台的
原生原语(iOS 上是 SwiftUI,Android 上是 Jetpack Compose Glance)。

## 为什么用 Voltra?

- **一份代码,两个平台。** 写一份 JSX,同时发布到 iOS 和 Android。
- **不需要写原生代码。** 构建小组件和实时活动时,UI 部分不用碰 Xcode 或 Android Studio。
- **热重载。** Rspeedy 会即时更新 bundle,实时活动会在毫秒级内重新渲染。
- **推送更新。** 在任意 JavaScript 运行时通过 APNS / FCM 向实时活动下发更新。

## 工作原理

Voltra 把你写的 ReactLynx JSX 序列化为一份轻量级 JSON 负载,平台扩展程序
会把它解释为 SwiftUI 或 Compose Glance 视图。这套机制让开发时支持热重载,
也让服务端渲染推送更新成为可能。

下面是一个实时活动的例子:

```tsx
import { useLiveActivity } from '@use-voltra/lynx/ios-client'
import { Voltra } from '@use-voltra/ios'

const ui = (
  <Voltra.VStack style={{ padding: 16, borderRadius: '18px', backgroundColor: '#101828' }}>
    <Voltra.Symbol name="car.fill" scale="large" tintColor="#38BDF8" />
    <Voltra.Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '600' }}>
      司机已出发
    </Voltra.Text>
    <Voltra.Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 8 }}>
      A 栋 · 大堂接送
    </Voltra.Text>
  </Voltra.VStack>
)

useLiveActivity({ lockScreen: ui }, { activityName: 'pickup', autoStart: true })
```

如果你在 React Native 上用过 Voltra,API 是完全一样的。JSX、组件形状和负载
格式在不同运行时之间保持一致。

## 服务端推送更新

同样的组件可以在 Node.js 服务端渲染。在服务端生成负载,通过 APNS / FCM 推送
出去,即可在 app 没有运行的情况下更新实时活动:

```tsx
import { renderLiveActivityToString } from '@use-voltra/server'
import { Voltra } from '@use-voltra/ios'

const payload = renderLiveActivityToString({
  lockScreen: (
    <Voltra.VStack style={{ padding: 16, borderRadius: '18px', backgroundColor: '#101828' }}>
      <Voltra.Symbol name="car.fill" scale="large" tintColor="#38BDF8" />
      <Voltra.Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '600' }}>
        司机已到达
      </Voltra.Text>
    </Voltra.VStack>
  ),
})
```

准备好了吗?前往 [安装](./installation),或者直接跳到平台指南:
[iOS](/ios/setup) 或 [Android](/android/setup)。
