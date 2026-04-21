// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxHostPlatformTiming.h"
#import "LynxPerformanceEntryConverter.h"

@implementation LynxHostPlatformTiming

- (instancetype)initWithDictionary:(NSDictionary*)dictionary {
    self = [super init];
    if (self) {
        self.hostPlatformType = [LynxPerformanceEntryConverter getStringObject:dictionary name:@"hostPlatformType" defaultValue:@""];
    }
    return self;
}

@end
