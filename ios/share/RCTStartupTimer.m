#import "RCTStartupTimer.h"

@implementation RCTStartupTimer

+ (void)start {
  NSLog(@"[StartupTimer] Metric tracing disabled in App Extension");
}

RCT_EXPORT_METHOD(stop)
{
  NSLog(@"[StartupTimer] Metric tracing disabled in App Extension");
}

// To export a module named StartupTimer
RCT_EXPORT_MODULE(StartupTimer);

@end
