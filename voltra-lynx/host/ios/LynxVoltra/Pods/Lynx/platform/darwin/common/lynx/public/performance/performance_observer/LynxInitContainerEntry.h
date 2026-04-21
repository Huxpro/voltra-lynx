// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxPerformanceEntry.h"

NS_ASSUME_NONNULL_BEGIN

/// Deprecated: LoadBundleEntry and ReloadBundleEntry contain all properties of InitContainerEntry
__attribute__((deprecated("LoadBundleEntry and ReloadBundleEntry contain all properties of InitContainerEntry")))
@interface LynxInitContainerEntry : LynxPerformanceEntry
@property(nonatomic, strong) NSNumber* openTime;
@property(nonatomic, strong) NSNumber* containerInitStart;
@property(nonatomic, strong) NSNumber* containerInitEnd;
@property(nonatomic, strong) NSNumber* prepareTemplateStart;
@property(nonatomic, strong) NSNumber* prepareTemplateEnd;
@property(nonatomic, strong) NSDictionary<NSString*, NSNumber*>* extraTiming;
- (instancetype)initWithDictionary:(NSDictionary*)dictionary;
@end

NS_ASSUME_NONNULL_END
