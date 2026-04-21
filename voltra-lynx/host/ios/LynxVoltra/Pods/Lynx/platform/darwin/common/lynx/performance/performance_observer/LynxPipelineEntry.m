// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxPipelineEntry.h"
#import "LynxPerformanceEntryConverter.h"
#import "LynxHostPlatformTiming.h"
#import "LynxPerformanceMetric.h"

@implementation LynxPipelineEntry

- (instancetype)initWithDictionary:(NSDictionary*)dictionary {
    self = [super initWithDictionary:dictionary];
    if (self) {
        self.identifier = [LynxPerformanceEntryConverter getStringObject:dictionary name:@"identifier" defaultValue:@""];
        self.pipelineStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"pipelineStart" defaultValue:@(-1)];
        self.pipelineEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"pipelineEnd" defaultValue:@(-1)];
        self.mtsRenderStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"mtsRenderStart" defaultValue:@(-1)];
        self.mtsRenderEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"mtsRenderEnd" defaultValue:@(-1)];
        self.resolveStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"resolveStart" defaultValue:@(-1)];
        self.resolveEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"resolveEnd" defaultValue:@(-1)];
        self.layoutStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"layoutStart" defaultValue:@(-1)];
        self.layoutEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"layoutEnd" defaultValue:@(-1)];
        self.paintingUiOperationExecuteStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"paintingUiOperationExecuteStart" defaultValue:@(-1)];
        self.paintingUiOperationExecuteEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"paintingUiOperationExecuteEnd" defaultValue:@(-1)];
        self.layoutUiOperationExecuteStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"layoutUiOperationExecuteStart" defaultValue:@(-1)];
        self.layoutUiOperationExecuteEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"layoutUiOperationExecuteEnd" defaultValue:@(-1)];
        self.paintEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"paintEnd" defaultValue:@(-1)];
        self.frameworkRenderingTiming = dictionary[@"frameworkRenderingTiming"]?: @{};
        self.hostPlatformTiming = dictionary[@"hostPlatformTiming"] ? [[LynxHostPlatformTiming alloc] initWithDictionary:dictionary[@"hostPlatformTiming"]] : [[LynxHostPlatformTiming alloc] initWithDictionary:@{}];
        self.actualFmp = dictionary[@"actualFmp"] ? [[LynxPerformanceMetric alloc] initWithDictionary:dictionary[@"actualFmp"]] : [[LynxPerformanceMetric alloc] initWithDictionary:@{}];
        self.lynxActualFmp = dictionary[@"lynxActualFmp"] ? [[LynxPerformanceMetric alloc] initWithDictionary:dictionary[@"lynxActualFmp"]] : [[LynxPerformanceMetric alloc] initWithDictionary:@{}];
        self.totalActualFmp = dictionary[@"totalActualFmp"] ? [[LynxPerformanceMetric alloc] initWithDictionary:dictionary[@"totalActualFmp"]] : [[LynxPerformanceMetric alloc] initWithDictionary:@{}];
    }
    return self;
}

@end
