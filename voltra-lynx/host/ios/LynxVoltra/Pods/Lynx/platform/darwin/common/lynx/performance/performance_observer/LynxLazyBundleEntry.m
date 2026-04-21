// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxLazyBundleEntry.h"
#import "LynxPerformanceEntryConverter.h"

@implementation LynxLazyBundleEntry

- (instancetype)initWithDictionary:(NSDictionary*)dictionary {
    self = [super initWithDictionary:dictionary];
    if (self) {
        self.componentUrl = [LynxPerformanceEntryConverter getStringObject:dictionary name:@"componentUrl" defaultValue:@""];
        self.mode = [LynxPerformanceEntryConverter getStringObject:dictionary name:@"mode" defaultValue:@""];
        self.size = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"size" defaultValue:@(-1)];
        self.sync = [LynxPerformanceEntryConverter getBooleanObject:dictionary name:@"sync" defaultValue:NO];
        self.loadSuccess = [LynxPerformanceEntryConverter getBooleanObject:dictionary name:@"loadSuccess" defaultValue:NO];
        self.requireStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"requireStart" defaultValue:@(-1)];
        self.requireEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"requireEnd" defaultValue:@(-1)];
        self.decodeStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"decodeStart" defaultValue:@(-1)];
        self.decodeEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"decodeEnd" defaultValue:@(-1)];
    }
    return self;
}

@end
