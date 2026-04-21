// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxInitContainerEntry.h"
#import "LynxPerformanceEntryConverter.h"

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-implementations"
@implementation LynxInitContainerEntry

- (instancetype)initWithDictionary:(NSDictionary*)dictionary {
    self = [super initWithDictionary:dictionary];
    if (self) {
        self.openTime = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"openTime" defaultValue:@(-1)];
        self.containerInitStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"containerInitStart" defaultValue:@(-1)];
        self.containerInitEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"containerInitEnd" defaultValue:@(-1)];
        self.prepareTemplateStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"prepareTemplateStart" defaultValue:@(-1)];
        self.prepareTemplateEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"prepareTemplateEnd" defaultValue:@(-1)];
        self.extraTiming = dictionary[@"extraTiming"]?: @{};
    }
    return self;
}

@end

#pragma clang diagnostic pop
