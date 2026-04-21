// Copyright 2025 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#ifndef CORE_TEMPLATE_BUNDLE_TEMPLATE_CODEC_BINARY_DECODER_LYNX_CONFIG_H_
#define CORE_TEMPLATE_BUNDLE_TEMPLATE_CODEC_BINARY_DECODER_LYNX_CONFIG_H_

#include <cstddef>
#include <string>

#include "base/include/value/base_value.h"
#include "core/renderer/css/dynamic_css_configs.h"
#include "core/renderer/css/parser/css_parser_configs.h"
#include "core/renderer/starlight/types/layout_configs.h"
#include "core/template_bundle/template_codec/ttml_constant.h"

namespace lynx {
namespace tasm {
enum class TernaryBool : uint8_t { TRUE_VALUE, FALSE_VALUE, UNDEFINE_VALUE };

/**
 * EntryConfig provide an independent config for entry.
 * Usually, a lazy bundle / card corresponds to an entry.
 */
class EntryConfig {
 public:
  EntryConfig() = default;
  virtual ~EntryConfig() = default;

  // layout configs
  inline const starlight::LayoutConfigs& GetLayoutConfigs() {
    return layout_configs_;
  }

  // default display linear
  inline void SetDefaultDisplayLinear(bool is_linear) {
    default_display_linear_ = is_linear;
    layout_configs_.default_display_linear_ = is_linear;
  }
  inline bool GetDefaultDisplayLinear() { return default_display_linear_; }

 protected:
  starlight::LayoutConfigs layout_configs_;

 private:
  bool default_display_linear_{false};
};

class LynxConfig : public EntryConfig {
 public:
  LynxConfig() = default;
  ~LynxConfig() override = default;

  inline void SetExtraInfo(lepus::Value extra_info) {
    extra_info_ = extra_info;
  }
  inline lepus::Value GetExtraInfo() const { return extra_info_; }

  inline void SetCustomCSSInheritList(
      std::unordered_set<CSSPropertyID> custom_css_inheritance_list) {
    css_configs_.custom_inherit_list_ = custom_css_inheritance_list;
  }
  inline std::unordered_set<CSSPropertyID> GetCustomCSSInheritList() const {
    return css_configs_.custom_inherit_list_;
  }

  inline void SetVersion(const std::string& page_version) {
    page_version_ = page_version;
  }
  inline std::string GetVersion() const { return page_version_; }

  inline void SetCliVersion(const std::string& cli_version) {
    cli_version_ = cli_version;
  }
  inline std::string GetCliVersion() const { return cli_version_; }

  inline void SetReactVersion(const std::string& react_version) {
    react_version_ = react_version;
  }
  inline std::string GetReactVersion() const { return react_version_; }

  inline void SetCustomData(const std::string& custom_data) {
    custom_data_ = custom_data;
  }
  inline std::string GetCustomData() const { return custom_data_; }

  inline void SetTapSlop(const std::string& tap_slop) { tap_slop_ = tap_slop; }
  inline std::string GetTapSlop() const { return tap_slop_; }

  inline void SetPreferredFps(const std::string& preferred_fps) {
    preferred_fps_ = preferred_fps;
  }
  inline std::string GetPreferredFps() const { return preferred_fps_; }

  inline void SetLepusGCThreshold(int64_t lepus_gc_threshold) {
    lepus_gc_threshold_ = lepus_gc_threshold;
  }
  inline int64_t GetLepusGCThreshold() const { return lepus_gc_threshold_; }

  inline void SetPipelineSchedulerConfig(uint64_t pipeline_scheduler_config) {
    pipeline_scheduler_config_ = pipeline_scheduler_config;
  }
  inline uint64_t GetPipelineSchedulerConfig() const {
    return pipeline_scheduler_config_;
  }

  inline void SetLogBoxImageSizeWarningThreshold(
      uint32_t log_box_image_size_warning_threshold) {
    log_box_image_size_warning_threshold_ =
        log_box_image_size_warning_threshold;
  }
  inline uint32_t GetLogBoxImageSizeWarningThreshold() const {
    return log_box_image_size_warning_threshold_;
  }

  inline void SetLepusQuickjsStackSize(uint32_t lepus_quickjs_stack_size) {
    lepus_quickjs_stack_size_ = lepus_quickjs_stack_size;
  }
  inline uint32_t GetLepusQuickjsStackSize() const {
    return lepus_quickjs_stack_size_;
  }

  inline void SetObserverFrameRate(int32_t observer_frame_rate) {
    observer_frame_rate_ = observer_frame_rate;
  }
  inline int32_t GetObserverFrameRate() const { return observer_frame_rate_; }

  inline void SetLongPressDuration(int32_t long_press_duration) {
    long_press_duration_ = long_press_duration;
  }
  inline int32_t GetLongPressDuration() const { return long_press_duration_; }

  inline void SetUseNewImage(TernaryBool use_new_image) {
    use_new_image_ = use_new_image;
  }
  inline TernaryBool GetUseNewImage() const { return use_new_image_; }

  inline void SetEnableTextBoringLayout(TernaryBool enable_text_boring_layout) {
    enable_text_boring_layout_ = enable_text_boring_layout;
  }
  inline TernaryBool GetEnableTextBoringLayout() const {
    return enable_text_boring_layout_;
  }

  inline void SetEnableTextLayerRender(TernaryBool enable_text_layer_render) {
    enable_text_layer_render_ = enable_text_layer_render;
  }
  inline TernaryBool GetEnableTextLayerRender() const {
    return enable_text_layer_render_;
  }

  inline void SetEnableUseMapBuffer(TernaryBool enable_use_map_buffer) {
    enable_use_map_buffer_ = enable_use_map_buffer;
  }
  inline TernaryBool GetEnableUseMapBuffer() const {
    return enable_use_map_buffer_;
  }

  inline void SetEnableOptPushStyleToBundle(
      TernaryBool enable_opt_push_style_to_bundle) {
    enable_opt_push_style_to_bundle_ = enable_opt_push_style_to_bundle;
  }
  inline TernaryBool GetEnableOptPushStyleToBundle() const {
    return enable_opt_push_style_to_bundle_;
  }

  inline void SetEnableTextLayoutCache(TernaryBool enable_text_layout_cache) {
    enable_text_layout_cache_ = enable_text_layout_cache;
  }
  inline TernaryBool GetEnableTextLayoutCache() const {
    return enable_text_layout_cache_;
  }

  inline void SetEnableUnifiedPipeline(TernaryBool enable_unified_pipeline) {
    enable_unified_pipeline_ = enable_unified_pipeline;
  }
  inline TernaryBool GetEnableUnifiedPipeline() const {
    return enable_unified_pipeline_;
  }

  inline void SetEnableUseContextPool(TernaryBool enable_use_context_pool) {
    enable_use_context_pool_ = enable_use_context_pool;
  }
  inline void SetEnableCSSLazyImport(TernaryBool enable_css_lazy_import) {
    enable_css_lazy_import_ = enable_css_lazy_import;
  }
  inline void SetEnableNewAnimator(TernaryBool enable_new_animator) {
    enable_new_animator_ = enable_new_animator;
  }
  inline void SetEnableComponentAsyncDecode(
      TernaryBool enable_component_async_decode) {
    enable_component_async_decode_ = enable_component_async_decode;
  }
  inline void SetEnableSignalAPI(TernaryBool enable_signal_api) {
    enable_signal_api_ = enable_signal_api;
  }
  inline TernaryBool GetEnableSignalAPI() const { return enable_signal_api_; }

  inline void SetEnableNativeScheduleCreateViewAsync(
      TernaryBool enable_native_schedule_create_view_async) {
    enable_native_schedule_create_view_async_ =
        enable_native_schedule_create_view_async;
  }
  inline TernaryBool GetEnableNativeScheduleCreateViewAsync() const {
    return enable_native_schedule_create_view_async_;
  }

  inline void SetEnableNativeList(TernaryBool enable_native_list) {
    enable_native_list_ = enable_native_list;
  }
  inline TernaryBool GetEnableNativeList() const { return enable_native_list_; }

  inline void SetTrailNewImage(TernaryBool trail_new_image) {
    trail_new_image_ = trail_new_image;
  }
  inline TernaryBool GetTrailNewImage() const { return trail_new_image_; }

  inline void SetAsyncRedirectUrl(TernaryBool async_redirect_url) {
    async_redirect_url_ = async_redirect_url;
  }
  inline TernaryBool GetAsyncRedirectUrl() const { return async_redirect_url_; }

  inline void SetEnableUIOperationOptimize(
      TernaryBool enable_ui_operation_optimize) {
    enable_ui_operation_optimize_ = enable_ui_operation_optimize;
  }
  inline TernaryBool GetEnableUIOperationOptimize() const {
    return enable_ui_operation_optimize_;
  }

  inline void SetEnableMicrotaskPromisePolyfill(
      TernaryBool enable_microtask_promise_polyfill) {
    enable_microtask_promise_polyfill_ = enable_microtask_promise_polyfill;
  }
  inline TernaryBool GetEnableMicrotaskPromisePolyfill() const {
    return enable_microtask_promise_polyfill_;
  }

  inline void SetMapContainerType(uint8_t map_container_type) {
    map_container_type_ = map_container_type;
  }
  inline uint8_t GetMapContainerType() const { return map_container_type_; }

  inline void SetGlobalFlattern(bool page_flatten) {
    page_flatten_ = page_flatten;
  }
  inline bool GetGlobalFlattern() const { return page_flatten_; }

  inline void SetGlobalImplicit(bool page_implicit) {
    page_implicit_ = page_implicit;
  }
  inline bool GetGlobalImplicit() const { return page_implicit_; }

  inline void SetEnableLepusStrictCheck(bool enable_lepus_strict_check) {
    enable_lepus_strict_check_ = enable_lepus_strict_check;
  }
  inline bool GetEnableLepusStrictCheck() const {
    return enable_lepus_strict_check_;
  }

  inline void SetEnableLepusNullPropAsUndef(
      bool enable_lepus_null_prop_as_undef) {
    enable_lepus_null_prop_as_undef_ = enable_lepus_null_prop_as_undef;
  }
  inline bool GetEnableLepusNullPropAsUndef() const {
    return enable_lepus_null_prop_as_undef_;
  }

  inline void SetDataStrictMode(bool data_strict_mode) {
    data_strict_mode_ = data_strict_mode;
  }
  inline bool GetDataStrictMode() const { return data_strict_mode_; }

  inline void SetEnableAsyncDisplay(bool enable_async_display) {
    enable_async_display_ = enable_async_display;
  }
  inline bool GetEnableAsyncDisplay() const { return enable_async_display_; }

  inline void SetEnableImageDownsampling(bool enable_image_downsampling) {
    enable_image_downsampling_ = enable_image_downsampling;
  }
  inline bool GetEnableImageDownsampling() const {
    return enable_image_downsampling_;
  }

  inline void SetEnableNewImage(bool enable_new_image) {
    enable_new_image_ = enable_new_image;
  }
  inline bool GetEnableNewImage() const { return enable_new_image_; }

  inline void SetEnableTextNonContiguousLayout(
      bool enable_text_non_contiguous_layout) {
    enable_text_non_contiguous_layout_ = enable_text_non_contiguous_layout;
  }
  inline bool GetEnableTextNonContiguousLayout() const {
    return enable_text_non_contiguous_layout_;
  }

  inline void SetEnableViewReceiveTouch(bool enable_view_receive_touch) {
    enable_view_receive_touch_ = enable_view_receive_touch;
  }
  inline bool GetEnableViewReceiveTouch() const {
    return enable_view_receive_touch_;
  }

  inline void SetEnableEventThrough(bool enable_event_through) {
    enable_event_through_ = enable_event_through;
  }
  inline bool GetEnableEventThrough() const { return enable_event_through_; }

  inline void SetRemoveComponentElement(bool need_remove_component_element) {
    need_remove_component_element_ = need_remove_component_element;
  }
  inline bool GetRemoveComponentElement() const {
    return need_remove_component_element_;
  }

  inline void SetStrictPropType(bool strict_prop_type) {
    strict_prop_type_ = strict_prop_type;
  }
  inline bool GetStrictPropType() const { return strict_prop_type_; }

  inline void SetSyncImageAttach(bool sync_image_attach) {
    sync_image_attach_ = sync_image_attach;
  }
  inline bool GetSyncImageAttach() const { return sync_image_attach_; }

  inline void SetUseImagePostProcessor(bool use_image_post_processor) {
    use_image_post_processor_ = use_image_post_processor;
  }
  inline bool GetUseImagePostProcessor() const {
    return use_image_post_processor_;
  }

  inline void SetUseNewSwiper(bool use_new_swiper) {
    use_new_swiper_ = use_new_swiper;
  }
  inline bool GetUseNewSwiper() const { return use_new_swiper_; }

  inline void SetEnableAsyncInitTTVideoEngine(bool async_init_tt_video_engine) {
    async_init_tt_video_engine_ = async_init_tt_video_engine;
  }
  inline bool GetEnableAsyncInitTTVideoEngine() const {
    return async_init_tt_video_engine_;
  }

  inline void SetEnableComponentLifecycleAlignWebview(
      bool enable_component_lifecycle_align_webview) {
    enable_component_lifecycle_align_webview_ =
        enable_component_lifecycle_align_webview;
  }
  inline bool GetEnableComponentLifecycleAlignWebview() const {
    return enable_component_lifecycle_align_webview_;
  }

  inline void SetListNewArchitecture(bool list_new_architecture) {
    list_new_architecture_ = list_new_architecture;
  }
  inline bool GetListNewArchitecture() const { return list_new_architecture_; }

  inline void SetEnableNewListContainer(bool enable_new_list_container) {
    enable_new_list_container_ = enable_new_list_container;
  }
  inline bool GetEnableNewListContainer() const {
    return enable_new_list_container_;
  }

  inline void SetEnableListPlug(bool list_enable_plug) {
    list_enable_plug_ = list_enable_plug;
  }
  inline bool GetEnableListPlug() const { return list_enable_plug_; }

  inline void SetEnableListMoveOperation(bool list_enable_move_operation) {
    list_enable_move_operation_ = list_enable_move_operation;
  }
  inline bool GetEnableListMoveOperation() const {
    return list_enable_move_operation_;
  }

  inline void SetEnableCreateViewAsync(bool enable_create_view_async) {
    enable_create_view_async_ = enable_create_view_async;
  }
  inline bool GetEnableCreateViewAsync() const {
    return enable_create_view_async_;
  }

  inline void SetEnableVsyncAlignedFlush(bool enable_vsync_aligned_flush) {
    enable_vsync_aligned_flush_ = enable_vsync_aligned_flush;
  }
  inline bool GetEnableVsyncAlignedFlush() const {
    return enable_vsync_aligned_flush_;
  }

  inline void SetEnableAccessibilityElement(bool enable_accessibility_element) {
    enable_accessibility_element_ = enable_accessibility_element;
  }
  inline bool GetEnableAccessibilityElement() const {
    return enable_accessibility_element_;
  }

  inline void SetEnableOverlapForAccessibilityElement(
      bool enable_overlap_for_accessibility_element) {
    enable_overlap_for_accessibility_element_ =
        enable_overlap_for_accessibility_element;
  }
  inline bool GetEnableOverlapForAccessibilityElement() const {
    return enable_overlap_for_accessibility_element_;
  }

  inline void SetEnableNewAccessibility(bool enable_new_accessibility) {
    enable_new_accessibility_ = enable_new_accessibility;
  }
  inline bool GetEnableNewAccessibility() const {
    return enable_new_accessibility_;
  }

  inline void SetEnableNewLayoutOnly(bool enable_new_layout_only) {
    enable_new_layout_only_ = enable_new_layout_only;
  }
  inline bool GetEnableNewLayoutOnly() const { return enable_new_layout_only_; }

  inline void SetEnableReactOnlyPropsId(bool enable_react_only_props_id) {
    enable_react_only_props_id_ = enable_react_only_props_id;
  }
  inline bool GetEnableReactOnlyPropsId() const {
    return enable_react_only_props_id_;
  }

  inline void SetEnableGlobalComponentMap(bool enable_global_component_map) {
    enable_global_component_map_ = enable_global_component_map;
  }
  inline bool GetEnableGlobalComponentMap() const {
    return enable_global_component_map_;
  }

  inline void SetEnableTextRefactor(bool enable_text_refactor) {
    enable_text_refactor_ = enable_text_refactor;
  }
  inline bool GetEnableTextRefactor() const { return enable_text_refactor_; }

  inline void SetEnableTextOverflow(bool enable_text_overflow) {
    enable_text_overflow_ = enable_text_overflow;
  }
  inline bool GetEnableTextOverflow() const { return enable_text_overflow_; }

  inline void SetEnableNewClipMode(bool enable_new_clip_mode) {
    enable_new_clip_mode_ = enable_new_clip_mode;
  }
  inline bool GetEnableNewClipMode() const { return enable_new_clip_mode_; }

  inline void SetGlobalAutoResumeAnimation(bool auto_resume_animation) {
    auto_resume_animation_ = auto_resume_animation;
  }
  inline bool GetGlobalAutoResumeAnimation() const {
    return auto_resume_animation_;
  }

  inline void SetGlobalEnableNewTransformOrigin(
      bool enable_new_transform_origin) {
    enable_new_transform_origin_ = enable_new_transform_origin;
  }
  inline bool GetGlobalEnableNewTransformOrigin() const {
    return enable_new_transform_origin_;
  }

  inline void SetGlobalCircularDataCheck(bool enable_circular_data_check) {
    enable_circular_data_check_ = enable_circular_data_check;
  }
  inline bool GetGlobalCircularDataCheck() const {
    return enable_circular_data_check_;
  }

  inline void SetEnableReduceInitDataCopy(bool enable_reduce_init_data_copy) {
    enable_reduce_init_data_copy_ = enable_reduce_init_data_copy;
  }
  inline bool GetEnableReduceInitDataCopy() const {
    return enable_reduce_init_data_copy_;
  }

  inline void SetEnableSimultaneousTap(bool enable_simultaneous_tap) {
    enable_simultaneous_tap_ = enable_simultaneous_tap;
  }
  inline bool GetEnableSimultaneousTap() const {
    return enable_simultaneous_tap_;
  }

  inline void SetEnableComponentLayoutOnly(bool enable_component_layout_only) {
    enable_component_layout_only_ = enable_component_layout_only;
  }
  inline bool GetEnableComponentLayoutOnly() const {
    return enable_component_layout_only_;
  }

  inline void SetEnableExtendedLayoutOpt(bool extended_layout_only_opt) {
    extended_layout_only_opt_ = extended_layout_only_opt;
  }
  inline bool GetEnableExtendedLayoutOpt() const {
    return extended_layout_only_opt_;
  }

  inline void SetEnableTouchRefactor(bool enable_touch_refactor) {
    enable_touch_refactor_ = enable_touch_refactor;
  }
  inline bool GetEnableTouchRefactor() const { return enable_touch_refactor_; }

  inline void SetEnableEndGestureAtLastFingerUp(
      bool enable_end_gesture_at_last_finger_up) {
    enable_end_gesture_at_last_finger_up_ =
        enable_end_gesture_at_last_finger_up;
  }
  inline bool GetEnableEndGestureAtLastFingerUp() const {
    return enable_end_gesture_at_last_finger_up_;
  }

  inline void SetDisableLongpressAfterScroll(
      bool disable_longpress_after_scroll) {
    disable_longpress_after_scroll_ = disable_longpress_after_scroll;
  }
  inline bool GetDisableLongpressAfterScroll() const {
    return disable_longpress_after_scroll_;
  }

  inline void SetKeyboardCallbackUseRelativeHeight(
      bool keyboard_callback_pass_relative_height) {
    keyboard_callback_pass_relative_height_ =
        keyboard_callback_pass_relative_height;
  }
  inline bool GetKeyboardCallbackUseRelativeHeight() const {
    return keyboard_callback_pass_relative_height_;
  }

  inline void SetEnableCheckDataWhenUpdatePage(
      bool enable_check_data_when_update_page) {
    enable_check_data_when_update_page_ = enable_check_data_when_update_page;
  }
  inline bool GetEnableCheckDataWhenUpdatePage() const {
    return enable_check_data_when_update_page_;
  }

  inline void SetEnableBackgroundShapeLayer(
      bool enable_background_shape_layer) {
    enable_background_shape_layer_ = enable_background_shape_layer;
  }
  inline bool GetEnableBackgroundShapeLayer() const {
    return enable_background_shape_layer_;
  }

  inline void SetCompileRender(bool compile_render) {
    compile_render_ = compile_render;
  }
  inline bool GetCompileRender() const { return compile_render_; }

  inline void SetEnableTextLanguageAlignment(
      bool enable_text_language_alignment) {
    enable_text_language_alignment_ = enable_text_language_alignment;
  }
  inline bool GetEnableTextLanguageAlignment() const {
    return enable_text_language_alignment_;
  }

  inline void SetEnableXTextLayoutReused(bool enable_x_text_layout_reused) {
    enable_x_text_layout_reused_ = enable_x_text_layout_reused;
  }
  inline bool GetEnableXTextLayoutReused() const {
    return enable_x_text_layout_reused_;
  }

  inline void SetEnableRemoveComponentExtraData(
      bool enable_remove_component_extra_data) {
    enable_remove_component_extra_data_ = enable_remove_component_extra_data;
  }
  inline bool GetEnableRemoveComponentExtraData() const {
    return enable_remove_component_extra_data_;
  }

  inline void SetEnableExposureUIMargin(bool enable_exposure_ui_margin) {
    enable_exposure_ui_margin_ = enable_exposure_ui_margin;
  }
  inline bool GetEnableExposureUIMargin() const {
    return enable_exposure_ui_margin_;
  }

  inline void SetEnableNewGesture(bool enable_new_gesture) {
    enable_new_gesture_ = enable_new_gesture;
  }
  inline bool GetEnableNewGesture() const { return enable_new_gesture_; }

  inline void SetEnablePlatformGesture(bool enable_platform_gesture) {
    enable_platform_gesture_ = enable_platform_gesture;
  }
  inline bool GetEnablePlatformGesture() const {
    return enable_platform_gesture_;
  }

  inline void SetEnableHarmonyNewOverlay(bool enable_harmony_new_overlay) {
    enable_harmony_new_overlay_ = enable_harmony_new_overlay;
  }
  inline bool GetEnableHarmonyNewOverlay() const {
    return enable_harmony_new_overlay_;
  }

  inline void SetEnableCheckLocalImage(bool enable_check_local_image) {
    enable_check_local_image_ = enable_check_local_image;
  }
  inline bool GetEnableCheckLocalImage() const {
    return enable_check_local_image_;
  }

  inline void SetEnableAsyncRequestImage(bool enable_async_request_image) {
    enable_async_request_image_ = enable_async_request_image;
  }
  inline bool GetEnableAsyncRequestImage() const {
    return enable_async_request_image_;
  }

  inline void SetEnableComponentNullProp(bool enable_component_null_prop) {
    enable_component_null_prop_ = enable_component_null_prop;
  }
  inline bool GetEnableComponentNullProp() const {
    return enable_component_null_prop_;
  }

  inline void SetEnableCascadePseudo(bool enable_cascade_pseudo) {
    enable_cascade_pseudo_ = enable_cascade_pseudo;
  }
  inline bool GetEnableCascadePseudo() const { return enable_cascade_pseudo_; }

  inline void SetAutoExpose(bool enable_auto_show_hide) {
    enable_auto_show_hide_ = enable_auto_show_hide;
  }
  inline bool GetAutoExpose() const { return enable_auto_show_hide_; }

  inline void SetDisableQuickTracingGC(bool disable_quick_tracing_gc) {
    disable_quick_tracing_gc_ = disable_quick_tracing_gc;
  }
  inline bool GetDisableQuickTracingGC() const {
    return disable_quick_tracing_gc_;
  }

  inline void SetFixCSSImportRuleOrder(bool fix_css_import_rule_order) {
    fix_css_import_rule_order_ = fix_css_import_rule_order;
  }
  inline bool GetFixCSSImportRuleOrder() const {
    return fix_css_import_rule_order_;
  }

  inline void SetEnableReloadLifecycle(bool enable_reload_lifecycle) {
    enable_reload_lifecycle_ = enable_reload_lifecycle;
  }
  inline bool GetEnableReloadLifecycle() const {
    return enable_reload_lifecycle_;
  }

  inline void SetEnableA11y(bool enable_a11y) { enable_a11y_ = enable_a11y; }
  inline bool GetEnableA11y() const { return enable_a11y_; }

  inline void SetEnableA11yIDMutationObserver(
      bool enable_a11y_mutation_observer) {
    enable_a11y_mutation_observer_ = enable_a11y_mutation_observer;
  }
  inline bool GetEnableA11yIDMutationObserver() const {
    return enable_a11y_mutation_observer_;
  }

  inline void SetEnableCheckExposureOptimize(
      bool enable_check_exposure_optimize) {
    enable_check_exposure_optimize_ = enable_check_exposure_optimize;
  }
  inline bool GetEnableCheckExposureOptimize() const {
    return enable_check_exposure_optimize_;
  }

  inline void SetEnableDisexposureWhenLynxHidden(
      bool enable_disexposure_when_lynx_hidden) {
    enable_disexposure_when_lynx_hidden_ = enable_disexposure_when_lynx_hidden;
  }
  inline bool GetEnableDisexposureWhenLynxHidden() const {
    return enable_disexposure_when_lynx_hidden_;
  }

  inline void SetEnableExposureWhenLayout(bool enable_exposure_when_layout) {
    enable_exposure_when_layout_ = enable_exposure_when_layout;
  }
  inline bool GetEnableExposureWhenLayout() const {
    return enable_exposure_when_layout_;
  }

  inline void SetEnableExposureWhenReload(bool enable_exposure_when_reload) {
    enable_exposure_when_reload_ = enable_exposure_when_reload;
  }
  inline bool GetEnableExposureWhenReload() const {
    return enable_exposure_when_reload_;
  }

  inline void SetEnableAirDetectRemovedKeysWhenUpdateData(
      bool enable_air_detect_removed_keys_when_update_data) {
    enable_air_detect_removed_keys_when_update_data_ =
        enable_air_detect_removed_keys_when_update_data;
  }
  inline bool GetEnableAirDetectRemovedKeysWhenUpdateData() const {
    return enable_air_detect_removed_keys_when_update_data_;
  }

  inline void SetEnableDataProcessorOnJs(bool enable_data_processor_on_js) {
    enable_data_processor_on_js_ = enable_data_processor_on_js;
  }
  inline bool GetEnableDataProcessorOnJs() const {
    return enable_data_processor_on_js_;
  }

  inline void SetEnableJsBindingApiThrowException(
      bool enable_js_binding_api_throw_exception) {
    enable_js_binding_api_throw_exception_ =
        enable_js_binding_api_throw_exception;
  }
  inline bool GetEnableJsBindingApiThrowException() const {
    return enable_js_binding_api_throw_exception_;
  }

  inline void SetEnableBindICU(bool enable_bind_icu) {
    enable_bind_icu_ = enable_bind_icu;
  }
  inline bool GetEnableBindICU() const { return enable_bind_icu_; }

  inline void SetEnableQueryComponentSync(bool enable_query_component_sync) {
    enable_query_component_sync_ = enable_query_component_sync;
  }
  inline bool GetEnableQueryComponentSync() const {
    return enable_query_component_sync_;
  }

  inline void SetEnableAsyncResolveSubtree(
      TernaryBool enable_async_resolve_subtree) {
    enable_async_resolve_subtree_ = enable_async_resolve_subtree;
  }
  inline TernaryBool GetEnableAsyncResolveSubtree() const {
    return enable_async_resolve_subtree_;
  }

  inline void SetAbsoluteInContentBound(bool absolute_in_content_bound) {
    layout_configs_.is_absolute_in_content_bound_ = absolute_in_content_bound;
  }
  inline bool GetAbsoluteInContentBound() const {
    return layout_configs_.is_absolute_in_content_bound_;
  }

  inline void SetEnableFixedNew(bool enable_fixed_new) {
    layout_configs_.enable_fixed_new_ = enable_fixed_new;
  }
  inline bool GetEnableFixedNew() const {
    return layout_configs_.enable_fixed_new_;
  }

  inline void SetEnableCSSInheritance(bool enable_css_inheritance) {
    css_configs_.enable_css_inheritance_ = enable_css_inheritance;
  }
  inline bool GetEnableCSSInheritance() const {
    return css_configs_.enable_css_inheritance_;
  }

  inline void SetUnifyVWVH(bool unify_vwvh_behavior) {
    css_configs_.unify_vw_vh_behavior_ = unify_vwvh_behavior;
  }
  inline bool GetUnifyVWVH() const {
    return css_configs_.unify_vw_vh_behavior_;
  }

  inline void SetFontScaleSpOnly(bool font_scale_effective_only_on_sp) {
    layout_configs_.font_scale_sp_only_ = font_scale_effective_only_on_sp;
  }
  inline bool GetFontScaleSpOnly() const {
    return layout_configs_.font_scale_sp_only_;
  }

  inline void SetEnableNewIntersectionObserver(
      bool enable_new_intersection_observer) {
    enable_new_intersection_observer_ = enable_new_intersection_observer;
  }
  inline bool GetEnableNewIntersectionObserver() const {
    return enable_new_intersection_observer_;
  }

  inline void SetForceCalcNewStyle(bool force_calc_new_style) {
    force_calc_new_style_ = force_calc_new_style;
  }
  inline bool GetForceCalcNewStyle() const { return force_calc_new_style_; }

  inline void SetRemoveDescendantSelectorScope(
      bool remove_descendant_selector_scope) {
    remove_descendant_selector_scope_ = remove_descendant_selector_scope;
  }
  inline bool GetRemoveDescendantSelectorScope() const {
    return remove_descendant_selector_scope_;
  }

  inline void SetEnableMultiTouch(bool enable_multi_touch) {
    enable_multi_touch_ = enable_multi_touch;
  }
  inline bool GetEnableMultiTouch() const { return enable_multi_touch_; }

  inline void SetEnableMultiTouchParamsCompatible(
      bool enable_multi_touch_params_compatible) {
    enable_multi_touch_params_compatible_ =
        enable_multi_touch_params_compatible;
  }
  inline bool GetEnableMultiTouchParamsCompatible() const {
    return enable_multi_touch_params_compatible_;
  }

  inline void SetEnableHarmonyVisibleAreaChangeForExposure(
      bool enable_harmony_visible_area_change_for_exposure) {
    enable_harmony_visible_area_change_for_exposure_ =
        enable_harmony_visible_area_change_for_exposure;
  }
  inline bool GetEnableHarmonyVisibleAreaChangeForExposure() const {
    return enable_harmony_visible_area_change_for_exposure_;
  }

  inline void SetEnableTextGradientOpt(TernaryBool enable_text_gradient_opt) {
    enable_text_gradient_opt_ = enable_text_gradient_opt;
  }
  inline TernaryBool GetEnableTextGradientOpt() const {
    return enable_text_gradient_opt_;
  }

  inline void SetEnableEventHandleRefactor(bool enable_event_handle_refactor) {
    enable_event_handle_refactor_ = enable_event_handle_refactor;
  }
  inline bool GetEnableEventHandleRefactor() const {
    return enable_event_handle_refactor_;
  }

  inline void SetEnableReuseLoadScriptExports(
      bool enable_reuse_load_script_exports) {
    enable_reuse_load_script_exports_ = enable_reuse_load_script_exports;
  }
  inline bool GetEnableReuseLoadScriptExports() const {
    return enable_reuse_load_script_exports_;
  }

  inline void SetEnableCSSInlineVariables(bool enable_css_inline_variables) {
    css_configs_.enable_css_inline_variables_ = enable_css_inline_variables;
  }
  inline bool GetEnableCSSInlineVariables() const {
    return css_configs_.enable_css_inline_variables_;
  }

  inline void SetEnableMTSPreExecute(bool enable_mts_pre_execute) {
    enable_mts_pre_execute_ = enable_mts_pre_execute;
  }
  inline bool GetEnableMTSPreExecute() const { return enable_mts_pre_execute_; }

  inline void SetEnablePropertyBasedSimpleStyle(
      bool enable_property_based_simple_style) {
    enable_property_based_simple_style_ = enable_property_based_simple_style;
  }
  inline bool GetEnablePropertyBasedSimpleStyle() const {
    return enable_property_based_simple_style_;
  }

  inline void SetEnableUnifyFixedBehavior(bool enable_unify_fixed_behavior) {
    layout_configs_.enable_unify_fixed_behavior_ = enable_unify_fixed_behavior;
  }
  inline bool GetEnableUnifyFixedBehavior() const {
    return layout_configs_.enable_unify_fixed_behavior_;
  }

  inline void SetEnableTransformedTouchPosition(
      bool enable_transformed_touch_position) {
    enable_transformed_touch_position_ = enable_transformed_touch_position;
  }
  inline bool GetEnableTransformedTouchPosition() const {
    return enable_transformed_touch_position_;
  }

  inline void SetEnableBatchLayoutTaskWithSyncLayout(
      bool enable_batch_layout_task_with_sync_layout) {
    enable_batch_layout_task_with_sync_layout_ =
        enable_batch_layout_task_with_sync_layout;
  }
  inline bool GetEnableBatchLayoutTaskWithSyncLayout() const {
    return enable_batch_layout_task_with_sync_layout_;
  }

  inline void SetEnableiOSAnimationLayerForExposure(
      bool enablei_os_animation_layer_for_exposure) {
    enablei_os_animation_layer_for_exposure_ =
        enablei_os_animation_layer_for_exposure;
  }
  inline bool GetEnableiOSAnimationLayerForExposure() const {
    return enablei_os_animation_layer_for_exposure_;
  }

  inline void SetEnableFetchAPIStandardStreaming(
      TernaryBool enable_fetch_api_standard_streaming) {
    enable_fetch_api_standard_streaming_ = enable_fetch_api_standard_streaming;
  }
  inline TernaryBool GetEnableFetchAPIStandardStreaming() const {
    return enable_fetch_api_standard_streaming_;
  }

  void DecodePageConfigFromJsonStringWhileUndefined(
      const std::string& config_json_string);

 protected:
  tasm::DynamicCSSConfigs css_configs_{};
  CSSParserConfigs css_parser_configs_;
  lepus::Value extra_info_{};
  std::string page_version_{""};
  std::string cli_version_{""};
  std::string react_version_{""};
  std::string custom_data_{""};
  std::string tap_slop_{"50px"};
  std::string preferred_fps_{"auto"};
  double enable_scroll_fluency_monitor_{-1};
  int64_t lepus_gc_threshold_{256};
  uint64_t pipeline_scheduler_config_{0};
  uint32_t log_box_image_size_warning_threshold_{1000000};
  uint32_t lepus_quickjs_stack_size_{0};
  int32_t observer_frame_rate_{20};
  int32_t long_press_duration_{-1};
  TernaryBool use_new_image_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_text_boring_layout_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_text_layer_render_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_use_map_buffer_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_opt_push_style_to_bundle_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_text_layout_cache_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_unified_pipeline_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_use_context_pool_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_css_lazy_import_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_new_animator_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_component_async_decode_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_signal_api_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_native_schedule_create_view_async_{
      TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_native_list_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool trail_new_image_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool async_redirect_url_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_ui_operation_optimize_{TernaryBool::UNDEFINE_VALUE};
  TernaryBool enable_microtask_promise_polyfill_{TernaryBool::UNDEFINE_VALUE};
  uint8_t map_container_type_{0};
  bool page_flatten_{true};
  bool page_implicit_{true};
  bool enable_lepus_strict_check_{false};
  bool enable_lepus_null_prop_as_undef_{false};
  bool data_strict_mode_{true};
  bool enable_async_display_{true};
  bool enable_image_downsampling_{false};
  bool enable_new_image_{true};
  bool enable_text_non_contiguous_layout_{true};
  bool enable_view_receive_touch_{false};
  bool enable_event_through_{false};
  bool need_remove_component_element_{false};
  bool strict_prop_type_{false};
  bool sync_image_attach_{true};
  bool use_image_post_processor_{false};
  bool use_new_swiper_{true};
  bool async_init_tt_video_engine_{false};
  bool enable_component_lifecycle_align_webview_{false};
  bool list_new_architecture_{false};
  bool enable_new_list_container_{false};
  bool list_enable_plug_{false};
  bool list_enable_move_operation_{false};
  bool enable_create_view_async_{true};
  bool enable_vsync_aligned_flush_{false};
  bool enable_accessibility_element_{true};
  bool enable_overlap_for_accessibility_element_{true};
  bool enable_new_accessibility_{false};
  bool enable_new_layout_only_{true};
  bool enable_react_only_props_id_{false};
  bool enable_global_component_map_{false};
  bool enable_text_refactor_{false};
  bool enable_text_overflow_{false};
  bool enable_new_clip_mode_{true};
  bool auto_resume_animation_{true};
  bool enable_new_transform_origin_{true};
  bool enable_circular_data_check_{true};
  bool enable_reduce_init_data_copy_{false};
  bool enable_simultaneous_tap_{false};
  bool enable_component_layout_only_{false};
  bool extended_layout_only_opt_{false};
  bool enable_touch_refactor_{true};
  bool enable_end_gesture_at_last_finger_up_{false};
  bool disable_longpress_after_scroll_{false};
  bool keyboard_callback_pass_relative_height_{false};
  bool enable_check_data_when_update_page_{true};
  bool enable_background_shape_layer_{true};
  bool compile_render_{false};
  bool enable_text_language_alignment_{false};
  bool enable_x_text_layout_reused_{false};
  bool enable_remove_component_extra_data_{false};
  bool enable_exposure_ui_margin_{false};
  bool enable_new_gesture_{false};
  bool enable_platform_gesture_{false};
  bool enable_harmony_new_overlay_{false};
  bool enable_check_local_image_{true};
  bool enable_async_request_image_{false};
  bool enable_component_null_prop_{false};
  bool enable_cascade_pseudo_{false};
  bool enable_auto_show_hide_{true};
  bool disable_quick_tracing_gc_{false};
  bool fix_css_import_rule_order_{true};
  bool enable_reload_lifecycle_{false};
  bool enable_a11y_{false};
  bool enable_a11y_mutation_observer_{false};
  bool enable_check_exposure_optimize_{false};
  bool enable_disexposure_when_lynx_hidden_{true};
  bool enable_exposure_when_layout_{false};
  bool enable_exposure_when_reload_{false};
  bool enable_air_detect_removed_keys_when_update_data_{false};
  bool enable_data_processor_on_js_{false};
  bool enable_js_binding_api_throw_exception_{false};
  bool enable_bind_icu_{false};
  bool enable_query_component_sync_{false};
  TernaryBool enable_async_resolve_subtree_{TernaryBool::UNDEFINE_VALUE};
  bool css_align_with_legacy_w3c_{false};
  bool enable_new_intersection_observer_{false};
  bool force_calc_new_style_{true};
  bool remove_descendant_selector_scope_{true};
  bool enable_multi_touch_{false};
  bool enable_multi_touch_params_compatible_{false};
  bool enable_harmony_visible_area_change_for_exposure_{false};
  TernaryBool enable_text_gradient_opt_{TernaryBool::UNDEFINE_VALUE};
  bool enable_event_handle_refactor_{false};
  bool enable_reuse_load_script_exports_{false};
  bool enable_mts_pre_execute_{false};
  bool enable_property_based_simple_style_{false};
  bool enable_transformed_touch_position_{false};
  bool enable_batch_layout_task_with_sync_layout_{false};
  bool enablei_os_animation_layer_for_exposure_{false};
  TernaryBool enable_fetch_api_standard_streaming_{TernaryBool::UNDEFINE_VALUE};
  /**
   * Not a config but a marker to indicate whether the page config needs to be
   * posted to platform layer. In PreDecode, PageConfig will be set to platform
   * layer before `LoadBundle`, so that it does not need to be posted to
   * platform layer again, which can reduce the overhead of posting. This
   * optimization is only valid for Android now.
   * TODO(zhoupeng.z): Apply this optimization to all platforms.
   */
  bool need_post_to_platform_{true};
};
}  // namespace tasm
}  // namespace lynx

#endif  // CORE_TEMPLATE_BUNDLE_TEMPLATE_CODEC_BINARY_DECODER_LYNX_CONFIG_H_
