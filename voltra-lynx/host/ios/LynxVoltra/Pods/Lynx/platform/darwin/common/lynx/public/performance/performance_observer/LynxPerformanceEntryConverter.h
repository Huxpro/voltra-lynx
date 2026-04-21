// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxPerformanceEntry.h"

@interface LynxPerformanceEntryConverter : NSObject
+ (LynxPerformanceEntry *)makePerformanceEntry:(NSDictionary *)dict;
+ (NSNumber *)getNumberObject:(NSDictionary *)dict name:(NSString *)name defaultValue:(NSNumber *)defaultValue;
+ (NSString *)getStringObject:(NSDictionary *)dict name:(NSString *)name defaultValue:(NSString *)defaultValue;
+ (BOOL)getBooleanObject:(NSDictionary *)dict name:(NSString *)name defaultValue:(BOOL)defaultValue;
+ (NSDictionary *)getDictionaryObject:(NSDictionary *)dict name:(NSString *)name defaultValue:(NSDictionary *)defaultValue;
@end
