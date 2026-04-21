// Copyright 2025 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

#include <string>

#include "core/template_bundle/template_codec/binary_decoder/lynx_config_auto_gen.h"
#include "core/template_bundle/template_codec/binary_decoder/lynx_config_constant_auto_gen.h"

namespace lynx {
namespace tasm {
void LynxConfig::DecodePageConfigFromJsonStringWhileUndefined(
    const std::string& config_json_string) {
  rapidjson::Document doc;

  if (!doc.Parse(config_json_string.c_str()).HasParseError()) {
    if (doc.HasMember(config::kPipelineSchedulerConfig) &&
        doc[config::kPipelineSchedulerConfig].IsUint64()) {
      SetPipelineSchedulerConfig(
          doc[config::kPipelineSchedulerConfig].GetUint64());
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kEnableUseMapBuffer) &&
        doc[config::kEnableUseMapBuffer].IsBool()) {
      if (GetEnableUseMapBuffer() == TernaryBool::UNDEFINE_VALUE) {
        SetEnableUseMapBuffer(doc[config::kEnableUseMapBuffer].GetBool()
                                  ? TernaryBool::TRUE_VALUE
                                  : TernaryBool::FALSE_VALUE);
      }
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kEnableOptPushStyleToBundle) &&
        doc[config::kEnableOptPushStyleToBundle].IsBool()) {
      if (GetEnableOptPushStyleToBundle() == TernaryBool::UNDEFINE_VALUE) {
        SetEnableOptPushStyleToBundle(
            doc[config::kEnableOptPushStyleToBundle].GetBool()
                ? TernaryBool::TRUE_VALUE
                : TernaryBool::FALSE_VALUE);
      }
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kEnableUnifiedPipeline) &&
        doc[config::kEnableUnifiedPipeline].IsBool()) {
      if (GetEnableUnifiedPipeline() == TernaryBool::UNDEFINE_VALUE) {
        SetEnableUnifiedPipeline(doc[config::kEnableUnifiedPipeline].GetBool()
                                     ? TernaryBool::TRUE_VALUE
                                     : TernaryBool::FALSE_VALUE);
      }
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kEnableSignalAPI) &&
        doc[config::kEnableSignalAPI].IsBool()) {
      if (GetEnableSignalAPI() == TernaryBool::UNDEFINE_VALUE) {
        SetEnableSignalAPI(doc[config::kEnableSignalAPI].GetBool()
                               ? TernaryBool::TRUE_VALUE
                               : TernaryBool::FALSE_VALUE);
      }
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kEnableNativeScheduleCreateViewAsync) &&
        doc[config::kEnableNativeScheduleCreateViewAsync].IsBool()) {
      if (GetEnableNativeScheduleCreateViewAsync() ==
          TernaryBool::UNDEFINE_VALUE) {
        SetEnableNativeScheduleCreateViewAsync(
            doc[config::kEnableNativeScheduleCreateViewAsync].GetBool()
                ? TernaryBool::TRUE_VALUE
                : TernaryBool::FALSE_VALUE);
      }
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kEnableNativeList) &&
        doc[config::kEnableNativeList].IsBool()) {
      if (GetEnableNativeList() == TernaryBool::UNDEFINE_VALUE) {
        SetEnableNativeList(doc[config::kEnableNativeList].GetBool()
                                ? TernaryBool::TRUE_VALUE
                                : TernaryBool::FALSE_VALUE);
      }
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kTrailNewImage) &&
        doc[config::kTrailNewImage].IsBool()) {
      if (GetTrailNewImage() == TernaryBool::UNDEFINE_VALUE) {
        SetTrailNewImage(doc[config::kTrailNewImage].GetBool()
                             ? TernaryBool::TRUE_VALUE
                             : TernaryBool::FALSE_VALUE);
      }
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kAsyncRedirect) &&
        doc[config::kAsyncRedirect].IsBool()) {
      if (GetAsyncRedirectUrl() == TernaryBool::UNDEFINE_VALUE) {
        SetAsyncRedirectUrl(doc[config::kAsyncRedirect].GetBool()
                                ? TernaryBool::TRUE_VALUE
                                : TernaryBool::FALSE_VALUE);
      }
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kEnableUIOperationOptimize) &&
        doc[config::kEnableUIOperationOptimize].IsBool()) {
      if (GetEnableUIOperationOptimize() == TernaryBool::UNDEFINE_VALUE) {
        SetEnableUIOperationOptimize(
            doc[config::kEnableUIOperationOptimize].GetBool()
                ? TernaryBool::TRUE_VALUE
                : TernaryBool::FALSE_VALUE);
      }
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kEnableMicrotaskPromisePolyfill) &&
        doc[config::kEnableMicrotaskPromisePolyfill].IsBool()) {
      if (GetEnableMicrotaskPromisePolyfill() == TernaryBool::UNDEFINE_VALUE) {
        SetEnableMicrotaskPromisePolyfill(
            doc[config::kEnableMicrotaskPromisePolyfill].GetBool()
                ? TernaryBool::TRUE_VALUE
                : TernaryBool::FALSE_VALUE);
      }
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kEnableTextGradientOpt) &&
        doc[config::kEnableTextGradientOpt].IsBool()) {
      if (GetEnableTextGradientOpt() == TernaryBool::UNDEFINE_VALUE) {
        SetEnableTextGradientOpt(doc[config::kEnableTextGradientOpt].GetBool()
                                     ? TernaryBool::TRUE_VALUE
                                     : TernaryBool::FALSE_VALUE);
      }
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kEnableCSSInlineVariables) &&
        doc[config::kEnableCSSInlineVariables].IsBool()) {
      SetEnableCSSInlineVariables(
          doc[config::kEnableCSSInlineVariables].GetBool());
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kEnableUnifyFixedBehavior) &&
        doc[config::kEnableUnifyFixedBehavior].IsBool()) {
      SetEnableUnifyFixedBehavior(
          doc[config::kEnableUnifyFixedBehavior].GetBool());
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kEnableBatchLayoutTaskWithSyncLayout) &&
        doc[config::kEnableBatchLayoutTaskWithSyncLayout].IsBool()) {
      SetEnableBatchLayoutTaskWithSyncLayout(
          doc[config::kEnableBatchLayoutTaskWithSyncLayout].GetBool());
      need_post_to_platform_ = true;
    }
    if (doc.HasMember(config::kEnableFetchAPIStandardStreaming) &&
        doc[config::kEnableFetchAPIStandardStreaming].IsBool()) {
      if (GetEnableFetchAPIStandardStreaming() == TernaryBool::UNDEFINE_VALUE) {
        SetEnableFetchAPIStandardStreaming(
            doc[config::kEnableFetchAPIStandardStreaming].GetBool()
                ? TernaryBool::TRUE_VALUE
                : TernaryBool::FALSE_VALUE);
      }
      need_post_to_platform_ = true;
    }
  }
}
}  // namespace tasm
}  // namespace lynx
