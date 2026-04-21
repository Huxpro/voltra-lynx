#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "LynxServiceLogProtocol.h"
#import "LynxServiceProtocol.h"
#import "LynxServiceTraceProtocol.h"
#import "LynxServiceTrailProtocol.h"
#import "ServiceAPI.h"
#import "ServiceLazyLoad.h"

FOUNDATION_EXPORT double LynxServiceAPIVersionNumber;
FOUNDATION_EXPORT const unsigned char LynxServiceAPIVersionString[];

