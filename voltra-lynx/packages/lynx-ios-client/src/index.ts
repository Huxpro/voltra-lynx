// @voltra-lynx/ios-client — iOS client APIs for Lynx
export { default as VoltraModule } from './VoltraModule';
export type { StartVoltraOptions, UpdateVoltraOptions, EndVoltraOptions } from './VoltraModule';
export { addVoltraListener } from './events';
export type {
  BasicVoltraEvent,
  VoltraActivityState,
  VoltraActivityTokenReceivedEvent,
  VoltraActivityPushToStartTokenReceivedEvent,
  VoltraActivityUpdateEvent,
  VoltraInteractionEvent,
  VoltraEventMap,
} from './events';
export { default as assertRunningOnApple } from './utils/assertRunningOnApple';
