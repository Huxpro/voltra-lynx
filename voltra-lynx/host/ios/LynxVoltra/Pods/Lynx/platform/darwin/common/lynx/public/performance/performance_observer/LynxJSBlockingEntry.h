// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxPerformanceEntry.h"

NS_ASSUME_NONNULL_BEGIN

@interface LynxJSBlockingEntry : LynxPerformanceEntry
@property(nonatomic, strong) NSString* stage;
@property(nonatomic, strong) NSNumber* total_blocking_time;
@property(nonatomic, strong) NSNumber* total_blocking_count;
@property(nonatomic, strong) NSNumber* total_duration;
@property(nonatomic, strong) NSNumber* blocking_ratio;
@property(nonatomic, strong) NSNumber* avg_blocking_time;
@property(nonatomic, strong) NSNumber* time_after_fcp;
- (instancetype)initWithDictionary:(NSDictionary*)dictionary;
@end

NS_ASSUME_NONNULL_END
