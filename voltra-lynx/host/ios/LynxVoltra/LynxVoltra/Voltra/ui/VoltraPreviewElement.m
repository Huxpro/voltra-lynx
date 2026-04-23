#import "VoltraPreviewElement.h"
#import <Lynx/LynxComponentRegistry.h>
#import <Lynx/LynxPropsProcessor.h>
#import "LynxVoltra-Swift.h"

@interface VoltraPreviewElement ()
@property(nonatomic, strong) VoltraPreviewHostView *hostView;
@end

@implementation VoltraPreviewElement

LYNX_LAZY_REGISTER_UI("voltra-preview")

- (UIView *)createView {
  VoltraPreviewHostView *view = [[VoltraPreviewHostView alloc] initWithFrame:CGRectZero];
  self.hostView = view;
  return view;
}

LYNX_PROP_SETTER("payload", setPayload, NSString *) {
  [self.hostView setPayload:value];
}

LYNX_PROP_SETTER("view-id", setViewId, NSString *) {
  [self.hostView setViewId:value];
}

@end
