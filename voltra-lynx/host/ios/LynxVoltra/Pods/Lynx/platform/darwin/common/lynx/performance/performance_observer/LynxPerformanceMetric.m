// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxPerformanceMetric.h"
#import "LynxPerformanceEntryConverter.h"

@implementation LynxPerformanceMetric

- (instancetype)initWithDictionary:(NSDictionary*)dictionary {
    self = [super init];
    if (self) {
        self.name = [LynxPerformanceEntryConverter getStringObject:dictionary name:@"name" defaultValue:@""];
        self.duration = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"duration" defaultValue:@(-1)];
        self.startTimestampName = [LynxPerformanceEntryConverter getStringObject:dictionary name:@"startTimestampName" defaultValue:@""];
        self.startTimestamp = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"startTimestamp" defaultValue:@(-1)];
        self.endTimestampName = [LynxPerformanceEntryConverter getStringObject:dictionary name:@"endTimestampName" defaultValue:@""];
        self.endTimestamp = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"endTimestamp" defaultValue:@(-1)];
    }
    return self;
}

@end
