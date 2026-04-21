// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
#import <Foundation/Foundation.h>
#import "LynxPerformanceEntryConverter.h"
#import "LynxPipelineEntry.h"
#import "LynxLoadBundleEntry.h"
#import "LynxInitContainerEntry.h"
#import "LynxInitLynxviewEntry.h"
#import "LynxInitBackgroundRuntimeEntry.h"
#import "LynxMetricFcpEntry.h"
#import "LynxMetricFspEntry.h"
#import "LynxMetricActualFmpEntry.h"
#import "LynxReloadBundleEntry.h"
#import "LynxMemoryUsageEntry.h"
#import "LynxLazyBundleEntry.h"
#import "LynxJSBlockingEntry.h"

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
@implementation LynxPerformanceEntryConverter
+ (NSNumber *)getNumberObject:(NSDictionary *)dict name:(NSString *)name defaultValue:(NSNumber *)defaultValue {
    id result = dict[name];
    if (!result) {
        return defaultValue;
    }
    if ([result isKindOfClass:[NSNumber class]]) {
        return (NSNumber *)result;
    }
    if ([result isKindOfClass:[NSString class]]) {
        NSNumberFormatter *formatter = [[NSNumberFormatter alloc] init];
        return [formatter numberFromString:(NSString *)result] ?: defaultValue;
    }
    if ([result isKindOfClass:[NSNumber class]]) {
        return (NSNumber *)result;
    }
    return defaultValue;
}
+ (NSString *)getStringObject:(NSDictionary *)dict name:(NSString *)name defaultValue:(NSString *)defaultValue {
    id result = dict[name];
    if (!result) {
        return defaultValue;
    }
    if ([result isKindOfClass:[NSString class]]) {
        return (NSString *)result;
    }
    return [result description];
}
+ (BOOL)getBooleanObject:(NSDictionary *)dict name:(NSString *)name defaultValue:(BOOL)defaultValue {
    id result = dict[name];
    if (!result) {
        return defaultValue;
    }
    if ([result isKindOfClass:[NSNumber class]]) {
        return [(NSNumber *)result boolValue];
    }
    if ([result isKindOfClass:[NSString class]]) {
        return [((NSString *)result) boolValue];
    }
    return defaultValue;
}
+ (NSDictionary *)getDictionaryObject:(NSDictionary *)dict name:(NSString *)name defaultValue:(NSDictionary *)defaultValue {
    id result = dict[name];
    if (!result) {
        return defaultValue;
    }
    if ([result isKindOfClass:[NSDictionary class]]) {
        return (NSDictionary *)result;
    }
    return defaultValue;
}
+ (LynxPerformanceEntry *)makePerformanceEntry:(NSDictionary *)dict {
    NSString *name = dict[@"name"];
    NSString *type = dict[@"entryType"];
    LynxPerformanceEntry *entry;
    if ([type isEqualToString:@"pipeline"] && [name isEqualToString:@"updateTriggeredByBts"]) {
        entry = [[LynxPipelineEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"pipeline"] && [name isEqualToString:@"updateTriggeredByNative"]) {
        entry = [[LynxPipelineEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"pipeline"] && [name isEqualToString:@"reactLynxHydrate"]) {
        entry = [[LynxPipelineEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"pipeline"] && [name isEqualToString:@"setNativeProps"]) {
        entry = [[LynxPipelineEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"pipeline"] && [name isEqualToString:@"updateGlobalProps"]) {
        entry = [[LynxPipelineEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"pipeline"] && [name isEqualToString:@"loadBundle"]) {
        entry = [[LynxLoadBundleEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"init"] && [name isEqualToString:@"container"]) {
        entry = [[LynxInitContainerEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"init"] && [name isEqualToString:@"lynxview"]) {
        entry = [[LynxInitLynxviewEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"init"] && [name isEqualToString:@"backgroundRuntime"]) {
        entry = [[LynxInitBackgroundRuntimeEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"metric"] && [name isEqualToString:@"fcp"]) {
        entry = [[LynxMetricFcpEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"metric"] && [name isEqualToString:@"fsp"]) {
        entry = [[LynxMetricFspEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"metric"] && [name isEqualToString:@"actualFmp"]) {
        entry = [[LynxMetricActualFmpEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"pipeline"] && [name isEqualToString:@"reloadBundleFromNative"]) {
        entry = [[LynxReloadBundleEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"pipeline"] && [name isEqualToString:@"reloadBundleFromBts"]) {
        entry = [[LynxReloadBundleEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"memory"] && [name isEqualToString:@"memory"]) {
        entry = [[LynxMemoryUsageEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"resource"] && [name isEqualToString:@"lazyBundle"]) {
        entry = [[LynxLazyBundleEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else if ([type isEqualToString:@"jsBlocking"] && [name isEqualToString:@"jsBlocking"]) {
        entry = [[LynxJSBlockingEntry alloc] initWithDictionary:dict];
        entry.typeResolved = YES;
    }
    else {
        entry = [[LynxPerformanceEntry alloc] initWithDictionary:dict];
        entry.typeResolved = NO;
    }
    return entry;
}
@end
#pragma clang diagnostic pop
