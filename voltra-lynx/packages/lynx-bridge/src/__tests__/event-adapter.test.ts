import { createEventAdapter } from '../event-adapter';
import type { LynxGlobalEventEmitter } from '../event-adapter';

function createMockEmitter(): LynxGlobalEventEmitter & { _listeners: Map<string, Set<Function>> } {
  const listeners = new Map<string, Set<Function>>();
  return {
    _listeners: listeners,
    addListener(event: string, listener: (...args: any[]) => void) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(listener);
      return {
        remove: () => {
          listeners.get(event)?.delete(listener);
        },
      };
    },
    removeListener(event: string, listener: (...args: any[]) => void) {
      listeners.get(event)?.delete(listener);
    },
  };
}

async function runTests() {
  // Test 1: Event name mapping — "stateChange" → "voltra:stateChange"
  const emitter = createMockEmitter();
  const adapter = createEventAdapter(emitter);

  const received: any[] = [];
  const sub = adapter.addListener('stateChange', (e) => received.push(e));

  // Verify the emitter received the prefixed event name
  console.assert(emitter._listeners.has('voltra:stateChange'), 'Should register with voltra: prefix');
  console.assert(!emitter._listeners.has('stateChange'), 'Should NOT register without prefix');

  // Simulate native event
  const eventData = { type: 'stateChange', activityState: 'active' };
  emitter._listeners.get('voltra:stateChange')!.forEach((fn) => fn(eventData));

  console.assert(received.length === 1, 'Listener should receive event');
  console.assert(received[0].activityState === 'active', 'Event data should be correct');

  // Test 2: Subscription removal
  sub.remove();
  console.assert(
    (emitter._listeners.get('voltra:stateChange')?.size ?? 0) === 0,
    'Listener should be removed after sub.remove()'
  );

  console.log('All event-adapter tests passed!');
}

runTests().catch(console.error);
