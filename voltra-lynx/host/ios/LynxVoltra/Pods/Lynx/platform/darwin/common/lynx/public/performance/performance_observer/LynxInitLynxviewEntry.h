// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxPerformanceEntry.h"

NS_ASSUME_NONNULL_BEGIN

/// Deprecated: LoadBundleEntry and ReloadBundleEntry contain all properties of InitLynxviewEntry
__attribute__((deprecated("LoadBundleEntry and ReloadBundleEntry contain all properties of InitLynxviewEntry")))
@interface LynxInitLynxviewEntry : LynxPerformanceEntry
@property(nonatomic, strong) NSNumber* createLynxStart;
@property(nonatomic, strong) NSNumber* createLynxEnd;
- (instancetype)initWithDictionary:(NSDictionary*)dictionary;
@end

NS_ASSUME_NONNULL_END
