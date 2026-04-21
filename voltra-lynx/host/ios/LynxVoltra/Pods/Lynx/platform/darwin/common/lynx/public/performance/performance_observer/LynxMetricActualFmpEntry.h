// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxPerformanceEntry.h"
#import "LynxPerformanceMetric.h"

NS_ASSUME_NONNULL_BEGIN

/// Deprecated: PipelineEntry contain all properties of MetricActualFmpEntry
__attribute__((deprecated("PipelineEntry contain all properties of MetricActualFmpEntry")))
@interface LynxMetricActualFmpEntry : LynxPerformanceEntry
@property(nonatomic, strong) LynxPerformanceMetric* actualFmp;
@property(nonatomic, strong) LynxPerformanceMetric* lynxActualFmp;
@property(nonatomic, strong) LynxPerformanceMetric* totalActualFmp;
- (instancetype)initWithDictionary:(NSDictionary*)dictionary;
@end

NS_ASSUME_NONNULL_END
