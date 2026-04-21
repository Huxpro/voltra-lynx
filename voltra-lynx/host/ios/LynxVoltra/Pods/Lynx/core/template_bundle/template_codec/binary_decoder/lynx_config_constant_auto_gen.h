// Copyright 2025 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#ifndef CORE_TEMPLATE_BUNDLE_TEMPLATE_CODEC_BINARY_DECODER_LYNX_CONFIG_CONSTANT_H_
#define CORE_TEMPLATE_BUNDLE_TEMPLATE_CODEC_BINARY_DECODER_LYNX_CONFIG_CONSTANT_H_

namespace lynx {
namespace tasm {
namespace config {
static constexpr const char kUserDefinedExtraInfo[] = "extraInfo";
static constexpr const char kCustomCSSInheritanceList[] =
    "customCSSInheritanceList";
static constexpr const char kVersion[] = "version";
static constexpr const char kCliVersion[] = "cli";
static constexpr const char kReactVersion[] = "reactVersion";
static constexpr const char kCustomData[] = "customData";
static constexpr const char kTapSlop[] = "tapSlop";
static constexpr const char kPreferredFps[] = "preferredFps";
static constexpr const char kQuirksMode[] = "quirksMode";
static constexpr const char kEnableLynxScrollFluency[] =
    "enableLynxScrollFluency";
static constexpr const char kLepusGCThreshold[] = "lepusGCThreshold";
static constexpr const char kPipelineSchedulerConfig[] =
    "pipelineSchedulerConfig";
static constexpr const char kLogBoxImageSizeWarningThreshold[] =
    "redBoxImageSizeWarningThreshold";
static constexpr const char kLepusQuickjsStacksize[] = "lepusQuickjsStacksize";
static constexpr const char kObserverFrameRate[] = "observerFrameRate";
static constexpr const char kLongPressDuration[] = "longPressDuration";
static constexpr const char kUseNewImage[] = "useNewImage";
static constexpr const char kEnableTextBoringLayout[] =
    "enableTextBoringLayout";
static constexpr const char kEnableTextLayerRender[] = "enableTextLayerRender";
static constexpr const char kEnableUseMapBuffer[] = "enableUseMapBuffer";
static constexpr const char kEnableFiberElementForRadonDiff[] =
    "enableFiberElementForRadonDiff";
static constexpr const char kEnableOptPushStyleToBundle[] =
    "enableOptPushStyleToBundle";
static constexpr const char kEnableTextLayoutCache[] = "enableTextLayoutCache";
static constexpr const char kEnableUnifiedPipeline[] = "enableUnifiedPipeline";
static constexpr const char kEnableUseContextPool[] = "enableUseContextPool";
static constexpr const char kEnableCSSLazyImport[] = "enableCSSLazyImport";
static constexpr const char kEnableNewAnimator[] = "enableNewAnimator";
static constexpr const char kEnableComponentAsyncDecode[] =
    "enableComponentAsyncDecode";
static constexpr const char kEnableSignalAPI[] = "enableSignalAPI";
static constexpr const char kEnableNativeScheduleCreateViewAsync[] =
    "enableNativeScheduleCreateViewAsync";
static constexpr const char kEnableNativeList[] = "enableNativeList";
static constexpr const char kTrailNewImage[] = "trailNewImage";
static constexpr const char kAsyncRedirect[] = "asyncRedirect";
static constexpr const char kEnableUIOperationOptimize[] =
    "enableUIOperationOptimize";
static constexpr const char kEnableMicrotaskPromisePolyfill[] =
    "enableMicrotaskPromisePolyfill";
static constexpr const char kMapContainerType[] = "mapContainerType";
static constexpr const char kFlatten[] = "flatten";
static constexpr const char kImplicit[] = "implicit";
static constexpr const char kLepusStrict[] = "lepusStrict";
static constexpr const char kLepusNullPropAsUndef[] = "lepusNullPropAsUndef";
static constexpr const char kDataStrictMode[] = "dataStrictMode";
static constexpr const char kEnableAsyncDisplay[] = "enableAsyncDisplay";
static constexpr const char kEnableImageDownsampling[] =
    "enableImageDownsampling";
static constexpr const char kEnableNewImage[] = "enableNewImage";
static constexpr const char kEnableTextNonContiguousLayout[] =
    "enableTextNonContiguousLayout";
static constexpr const char kEnableViewReceiveTouch[] =
    "enableViewReceiveTouch";
static constexpr const char kEnableEventThrough[] = "enableEventThrough";
static constexpr const char kRemoveComponentElement[] =
    "removeComponentElement";
static constexpr const char kStrictPropType[] = "strictPropType";
static constexpr const char kSyncImageAttach[] = "syncImageAttach";
static constexpr const char kUseImagePostProcessor[] = "useImagePostProcessor";
static constexpr const char kUseNewSwiper[] = "useNewSwiper";
static constexpr const char kEnableAsyncInitVideoEngine[] =
    "enableAsyncInitVideoEngine";
static constexpr const char kEnableComponentLifecycleAlignWebview[] =
    "enableComponentLifecycleAlignWebview";
static constexpr const char kEnableListNewArchitecture[] =
    "enableListNewArchitecture";
static constexpr const char kEnableNewListContainer[] =
    "enableNewListContainer";
static constexpr const char kEnableListPlug[] = "enableListPlug";
static constexpr const char kEnableListMoveOperation[] =
    "enableListMoveOperation";
static constexpr const char kEnableCreateViewAsync[] = "enableCreateViewAsync";
static constexpr const char kEnableVsyncAlignedFlush[] =
    "enableVsyncAlignedFlush";
static constexpr const char kEnableAccessibilityElement[] =
    "enableAccessibilityElement";
static constexpr const char kEnableOverlapForAccessibilityElement[] =
    "enableOverlapForAccessibilityElement";
static constexpr const char kEnableNewAccessibility[] =
    "enableNewAccessibility";
static constexpr const char kEnableNewLayoutOnly[] = "enableNewLayoutOnly";
static constexpr const char kEnableReactOnlyPropsId[] =
    "enableReactOnlyPropsId";
static constexpr const char kEnableGlobalComponentMap[] =
    "enableGlobalComponentMap";
static constexpr const char kEnableTextRefactor[] = "enableTextRefactor";
static constexpr const char kEnableTextOverflow[] = "enableTextOverflow";
static constexpr const char kEnableNewClipMode[] = "enableNewClipMode";
static constexpr const char kAutoResumeAnimation[] = "autoResumeAnimation";
static constexpr const char kEnableNewTransformOrigin[] =
    "enableNewTransformOrigin";
static constexpr const char kEnableCircularDataCheck[] =
    "enableCircularDataCheck";
static constexpr const char kEnableReduceInitDataCopy[] =
    "enableReduceInitDataCopy";
static constexpr const char kEnableSimultaneousTap[] = "enableSimultaneousTap";
static constexpr const char kEnableComponentLayoutOnly[] =
    "enableComponentLayoutOnly";
static constexpr const char kExtendedLayoutOnlyOpt[] = "extendedLayoutOnlyOpt";
static constexpr const char kEnableTouchRefactor[] = "enableTouchRefactor";
static constexpr const char kEnableEndGestureAtLastFingerUp[] =
    "enableEndGestureAtLastFingerUp";
static constexpr const char kDisableLongpressAfterScroll[] =
    "disableLongpressAfterScroll";
static constexpr const char kKeyboardCallbackPassRelativeHeight[] =
    "keyboardCallbackPassRelativeHeight";
static constexpr const char kEnableCheckDataWhenUpdatePage[] =
    "enableCheckDataWhenUpdatePage";
static constexpr const char kEnableBackgroundShapeLayer[] =
    "enableBackgroundShapeLayer";
static constexpr const char kCompileRender[] = "compileRender";
static constexpr const char kEnableTextLanguageAlignment[] =
    "enableTextLanguageAlignment";
static constexpr const char kEnableXTextLayoutReused[] =
    "enableXTextLayoutReused";
static constexpr const char kEnableRemoveComponentExtraData[] =
    "enableRemoveComponentExtraData";
static constexpr const char kEnableExposureUIMargin[] =
    "enableExposureUIMargin";
static constexpr const char kEnableNewGesture[] = "enableNewGesture";
static constexpr const char kEnablePlatformGesture[] = "enablePlatformGesture";
static constexpr const char kEnableHarmonyNewOverlay[] =
    "enableHarmonyNewOverlay";
static constexpr const char kEnableCheckLocalImage[] = "enableCheckLocalImage";
static constexpr const char kEnableAsyncRequestImage[] =
    "enableAsyncRequestImage";
static constexpr const char kEnableComponentNullProp[] =
    "enableComponentNullProp";
static constexpr const char kEnableCascadePseudo[] = "enableCascadePseudo";
static constexpr const char kAutoExpose[] = "autoExpose";
static constexpr const char kDisableQuickTracingGC[] = "disableQuickTracingGC";
static constexpr const char kFixCSSImportRuleOrder[] = "fixCSSImportRuleOrder";
static constexpr const char kEnableReloadLifecycle[] = "enableReloadLifecycle";
static constexpr const char kEnableA11y[] = "enableA11y";
static constexpr const char kEnableA11yIDMutationObserver[] =
    "enableA11yIDMutationObserver";
static constexpr const char kEnableCheckExposureOptimize[] =
    "enableCheckExposureOptimize";
static constexpr const char kEnableDisexposureWhenLynxHidden[] =
    "enableDisexposureWhenLynxHidden";
static constexpr const char kEnableExposureWhenLayout[] =
    "enableExposureWhenLayout";
static constexpr const char kEnableExposureWhenReload[] =
    "enableExposureWhenReload";
static constexpr const char kEnableAirDetectRemovedKeysWhenUpdateData[] =
    "enableAirDetectRemovedKeysWhenUpdateData";
static constexpr const char kEnableJSDataProcessor[] = "enableJSDataProcessor";
static constexpr const char kEnableJsBindingApiThrowException[] =
    "enableJsBindingApiThrowException";
static constexpr const char kEnableBindICU[] = "enableICU";
static constexpr const char kEnableQueryComponentSync[] =
    "enableQueryComponentSync";
static constexpr const char kEnableAsyncFlushSubtree[] =
    "enableAsyncResolveSubtree";
static constexpr const char kAbsoluteInContentBound[] =
    "absoluteInContentBound";
static constexpr const char kEnableFixedNew[] = "enableFixedNew";
static constexpr const char kEnableCSSInheritance[] = "enableCSSInheritance";
static constexpr const char kCSSAlignWithLegacyW3C[] = "CSSAlignWithLegacyW3C";
static constexpr const char kUnifyVWVHBehavior[] = "unifyVWVHBehavior";
static constexpr const char kFontScaleEffectiveOnlyOnSp[] =
    "fontScaleEffectiveOnlyOnSp";
static constexpr const char kEnableNewIntersectionObserver[] =
    "enableNewIntersectionObserver";
static constexpr const char kForceCalcNewStyleKey[] = "forceCalcNewStyle";
static constexpr const char kIncludeFontPadding[] = "includeFontPadding";
static constexpr const char kRemoveDescendantSelectorScope[] =
    "removeDescendantSelectorScope";
static constexpr const char kEnableMultiTouch[] = "enableMultiTouch";
static constexpr const char kEnableMultiTouchParamsCompatible[] =
    "enableMultiTouchParamsCompatible";
static constexpr const char kEnableHarmonyVisibleAreaChangeForExposure[] =
    "enableHarmonyVisibleAreaChangeForExposure";
static constexpr const char kEnableTextGradientOpt[] = "enableTextGradientOpt";
static constexpr const char kEnableEventHandleRefactor[] =
    "enableEventHandleRefactor";
static constexpr const char kEnableReuseLoadScriptExports[] =
    "enableReuseLoadScriptExports";
static constexpr const char kEnableCSSInlineVariables[] =
    "enableCSSInlineVariables";
static constexpr const char kEnableMTSPreExecute[] = "enableMTSPreExecute";
static constexpr const char kEnablePropertyBasedSimpleStyle[] =
    "enablePropertyBasedSimpleStyle";
static constexpr const char kEnableUnifyFixedBehavior[] =
    "enableUnifyFixedBehavior";
static constexpr const char kEnableTransformedTouchPosition[] =
    "enableTransformedTouchPosition";
static constexpr const char kEnableBatchLayoutTaskWithSyncLayout[] =
    "enableBatchLayoutTaskWithSyncLayout";
static constexpr const char kEnableiOSAnimationLayerForExposure[] =
    "enableiOSAnimationLayerForExposure";
static constexpr const char kEnableFetchAPIStandardStreaming[] =
    "enableFetchAPIStandardStreaming";
}  // namespace config
}  // namespace tasm
}  // namespace lynx
#endif  // CORE_TEMPLATE_BUNDLE_TEMPLATE_CODEC_BINARY_DECODER_LYNX_CONFIG_CONSTANT_H_
