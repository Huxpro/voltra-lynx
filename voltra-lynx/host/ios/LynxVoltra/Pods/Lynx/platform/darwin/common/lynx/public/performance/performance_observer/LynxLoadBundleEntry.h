// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxPipelineEntry.h"
#import "LynxPerformanceMetric.h"

NS_ASSUME_NONNULL_BEGIN

@interface LynxLoadBundleEntry : LynxPipelineEntry
@property(nonatomic, strong) NSNumber* loadBundleStart;
@property(nonatomic, strong) NSNumber* loadBundleEnd;
@property(nonatomic, strong) NSNumber* parseStart;
@property(nonatomic, strong) NSNumber* parseEnd;
@property(nonatomic, strong) NSNumber* loadBackgroundStart;
@property(nonatomic, strong) NSNumber* loadBackgroundEnd;
@property(nonatomic, strong) NSNumber* verifyTasmStart;
@property(nonatomic, strong) NSNumber* verifyTasmEnd;
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
