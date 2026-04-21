// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxMetricFspEntry.h"
#import "LynxPerformanceMetric.h"
#import "LynxPerformanceEntryConverter.h"

@implementation LynxMetricFspEntry

- (instancetype)initWithDictionary:(NSDictionary*)dictionary {
    self = [super initWithDictionary:dictionary];
    if (self) {
        self.fsp = dictionary[@"fsp"] ? [[LynxPerformanceMetric alloc] initWithDictionary:dictionary[@"fsp"]] : [[LynxPerformanceMetric alloc] initWithDictionary:@{}];
        self.lynxFsp = dictionary[@"lynxFsp"] ? [[LynxPerformanceMetric alloc] initWithDictionary:dictionary[@"lynxFsp"]] : [[LynxPerformanceMetric alloc] initWithDictionary:@{}];
        self.totalFsp = dictionary[@"totalFsp"] ? [[LynxPerformanceMetric alloc] initWithDictionary:dictionary[@"totalFsp"]] : [[LynxPerformanceMetric alloc] initWithDictionary:@{}];
        self.fspStatus = [LynxPerformanceEntryConverter getStringObject:dictionary name:@"fspStatus" defaultValue:@""];
        self.contentFillPercentageX = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"contentFillPercentageX" defaultValue:@(-1)];
        self.contentFillPercentageY = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"contentFillPercentageY" defaultValue:@(-1)];
        self.contentFillPercentageTotalArea = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"contentFillPercentageTotalArea" defaultValue:@(-1)];
        self.containerFillPercentageContainerArea = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"containerFillPercentageContainerArea" defaultValue:@(-1)];
    }
    return self;
}

@end
