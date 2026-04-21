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

#import "LynxBaseDefines.h"
#import "LynxBaseEnv.h"
#import "LynxLog.h"
#import "LynxBaseTrace.h"

FOUNDATION_EXPORT double LynxBaseVersionNumber;
FOUNDATION_EXPORT const unsigned char LynxBaseVersionString[];

