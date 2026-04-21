// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxPipelineEntry.h"
#import "LynxPerformanceMetric.h"

NS_ASSUME_NONNULL_BEGIN

@interface LynxReloadBundleEntry : LynxPipelineEntry
@property(nonatomic, strong) NSNumber* reloadBundleStart;
@property(nonatomic, strong) NSNumber* reloadBundleEnd;
@property(nonatomic, strong) NSNumber* reloadBackgroundStart;
@property(nonatomic, strong) NSNumber* reloadBackgroundEnd;
@property(nonatomic, strong) NSNumber* ffiStart;
@property(nonatomic, strong) NSNumber* ffiEnd;
@property(nonatomic, strong) NSNumber* createLynxStart;
@property(nonatomic, strong) NSNumber* createLynxEnd;
@property(nonatomic, strong) NSNumber* loadCoreStart;
@property(nonatomic, strong) NSNumber* loadCoreEnd;
@property(nonatomic, strong) NSNumber* openTime;
@property(nonatomic, strong) NSNumber* containerInitStart;
@property(nonatomic, strong) NSNumber* containerInitEnd;
@property(nonatomic, strong) NSNumber* prepareTemplateStart;
@property(nonatomic, strong) NSNumber* prepareTemplateEnd;
@property(nonatomic, strong, nullable) LynxPerformanceMetric* fcp;
@property(nonatomic, strong) LynxPerformanceMetric* lynxFcp;
@property(nonatomic, strong, nullable) LynxPerformanceMetric* totalFcp;
- (instancetype)initWithDictionary:(NSDictionary*)dictionary;
@end

NS_ASSUME_NONNULL_END
