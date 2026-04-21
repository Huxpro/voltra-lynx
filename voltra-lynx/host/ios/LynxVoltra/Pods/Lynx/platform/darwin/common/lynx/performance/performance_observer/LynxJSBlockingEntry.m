// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxJSBlockingEntry.h"
#import "LynxPerformanceEntryConverter.h"

@implementation LynxJSBlockingEntry

- (instancetype)initWithDictionary:(NSDictionary*)dictionary {
    self = [super initWithDictionary:dictionary];
    if (self) {
        self.stage = [LynxPerformanceEntryConverter getStringObject:dictionary name:@"stage" defaultValue:@""];
        self.total_blocking_time = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"total_blocking_time" defaultValue:@(-1)];
        self.total_blocking_count = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"total_blocking_count" defaultValue:@(-1)];
        self.total_duration = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"total_duration" defaultValue:@(-1)];
        self.blocking_ratio = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"blocking_ratio" defaultValue:@(-1)];
        self.avg_blocking_time = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"avg_blocking_time" defaultValue:@(-1)];
        self.time_after_fcp = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"time_after_fcp" defaultValue:@(-1)];
    }
    return self;
}

@end
