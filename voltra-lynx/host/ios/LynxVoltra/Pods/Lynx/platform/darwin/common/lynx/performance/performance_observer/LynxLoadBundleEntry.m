// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxLoadBundleEntry.h"
#import "LynxPerformanceEntryConverter.h"
#import "LynxPerformanceMetric.h"

@implementation LynxLoadBundleEntry

- (instancetype)initWithDictionary:(NSDictionary*)dictionary {
    self = [super initWithDictionary:dictionary];
    if (self) {
        self.loadBundleStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"loadBundleStart" defaultValue:@(-1)];
        self.loadBundleEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"loadBundleEnd" defaultValue:@(-1)];
        self.parseStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"parseStart" defaultValue:@(-1)];
        self.parseEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"parseEnd" defaultValue:@(-1)];
        self.loadBackgroundStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"loadBackgroundStart" defaultValue:@(-1)];
        self.loadBackgroundEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"loadBackgroundEnd" defaultValue:@(-1)];
        self.verifyTasmStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"verifyTasmStart" defaultValue:@(-1)];
        self.verifyTasmEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"verifyTasmEnd" defaultValue:@(-1)];
        self.ffiStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"ffiStart" defaultValue:@(-1)];
        self.ffiEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"ffiEnd" defaultValue:@(-1)];
        self.createLynxStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"createLynxStart" defaultValue:@(-1)];
        self.createLynxEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"createLynxEnd" defaultValue:@(-1)];
        self.loadCoreStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"loadCoreStart" defaultValue:@(-1)];
        self.loadCoreEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"loadCoreEnd" defaultValue:@(-1)];
        self.openTime = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"openTime" defaultValue:@(-1)];
        self.containerInitStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"containerInitStart" defaultValue:@(-1)];
        self.containerInitEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"containerInitEnd" defaultValue:@(-1)];
        self.prepareTemplateStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"prepareTemplateStart" defaultValue:@(-1)];
        self.prepareTemplateEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"prepareTemplateEnd" defaultValue:@(-1)];
        self.fcp = dictionary[@"fcp"] ? [[LynxPerformanceMetric alloc] initWithDictionary:dictionary[@"fcp"]] : [[LynxPerformanceMetric alloc] initWithDictionary:@{}];
        self.lynxFcp = dictionary[@"lynxFcp"] ? [[LynxPerformanceMetric alloc] initWithDictionary:dictionary[@"lynxFcp"]] : [[LynxPerformanceMetric alloc] initWithDictionary:@{}];
        self.totalFcp = dictionary[@"totalFcp"] ? [[LynxPerformanceMetric alloc] initWithDictionary:dictionary[@"totalFcp"]] : [[LynxPerformanceMetric alloc] initWithDictionary:@{}];
    }
    return self;
}

@end
