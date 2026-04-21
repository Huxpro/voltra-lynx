// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxMemoryUsageItem.h"
#import "LynxPerformanceEntryConverter.h"

@implementation LynxMemoryUsageItem

- (instancetype)initWithDictionary:(NSDictionary*)dictionary {
    self = [super init];
    if (self) {
        self.category = [LynxPerformanceEntryConverter getStringObject:dictionary name:@"category" defaultValue:@""];
        self.sizeBytes = [LynxPerformanceEntryConverter getNumberObject:dictionary name:@"sizeBytes" defaultValue:@(-1)];
        self.detail = dictionary[@"detail"]?: @{};
    }
    return self;
}

@end
