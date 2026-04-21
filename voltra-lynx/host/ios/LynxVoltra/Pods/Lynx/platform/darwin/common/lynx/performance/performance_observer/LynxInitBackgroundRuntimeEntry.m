// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxInitBackgroundRuntimeEntry.h"
#import "LynxPerformanceEntryConverter.h"

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-implementations"
@implementation LynxInitBackgroundRuntimeEntry

- (instancetype)initWithDictionary:(NSDictionary*)dictionary {
    self = [super initWithDictionary:dictionary];
    if (self) {
        self.loadCoreStart = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"loadCoreStart" defaultValue:@(-1)];
        self.loadCoreEnd = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"loadCoreEnd" defaultValue:@(-1)];
    }
    return self;
}

@end

#pragma clang diagnostic pop
