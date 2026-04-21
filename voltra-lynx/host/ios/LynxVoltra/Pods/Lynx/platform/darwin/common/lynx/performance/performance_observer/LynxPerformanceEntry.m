// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxPerformanceEntry.h"
#import "LynxPerformanceEntryConverter.h"

@implementation LynxPerformanceEntry

- (instancetype)initWithDictionary:(NSDictionary*)dictionary {
    self = [super init];
    if (self) {
        self.name = [LynxPerformanceEntryConverter getStringObject:dictionary name:@"name" defaultValue:@""];
        self.entryType = [LynxPerformanceEntryConverter getStringObject:dictionary name:@"entryType" defaultValue:@""];
        self.typeResolved = [LynxPerformanceEntryConverter getBooleanObject:dictionary name:@"typeResolved" defaultValue:YES];
        self.rawDictionary = dictionary;
    }
    return self;
}

- (NSDictionary *)toDictionary {
  return self.rawDictionary;
}
@end
