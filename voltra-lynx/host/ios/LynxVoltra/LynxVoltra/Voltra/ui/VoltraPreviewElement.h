#import <Lynx/LynxUI.h>

NS_ASSUME_NONNULL_BEGIN

/// Custom Lynx element that renders Voltra SwiftUI content inline.
/// Usage in ReactLynx: <voltra-preview payload={jsonString} view-id={id} />
@interface VoltraPreviewElement : LynxUI<UIView *>
@end

NS_ASSUME_NONNULL_END
