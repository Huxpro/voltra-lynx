<script setup lang="ts">
import { ref } from 'vue-lynx';

import './App.css';
import {
  startLiveActivity,
  stopLiveActivity,
  endAllLiveActivities,
} from '@use-voltra/lynx/ios-client';
import {
  makeBasicLiveActivityVariants,
  makeMusicPlayerVariants,
} from './voltra-payloads';

type Demo = {
  key: string;
  title: string;
  description: string;
  activityName: string;
  makeVariants: () => ReturnType<typeof makeBasicLiveActivityVariants>;
};

const DEMOS: Demo[] = [
  {
    key: 'basic',
    title: 'Basic Live Activity',
    description: 'Stacks, labels, and the Voltra icon — rendered from a Vue host.',
    activityName: 'vue-basic',
    makeVariants: () => makeBasicLiveActivityVariants(),
  },
  {
    key: 'music',
    title: 'Music Player',
    description: 'Now-playing card with a Dynamic Island play/pause glyph.',
    activityName: 'vue-music',
    makeVariants: () => makeMusicPlayerVariants(true),
  },
];

// Map each demo to the Live Activity id returned by the native bridge so we can
// stop the right one. Off-Apple (e.g. web preview) the bridge returns '' and
// these calls become no-ops — the UI still updates so the wiring is visible.
const activeIds = ref<Record<string, string>>({});
const status = ref('Tap a demo to start a Live Activity.');

async function start(demo: Demo) {
  try {
    const id = await startLiveActivity(demo.makeVariants(), { activityName: demo.activityName });
    activeIds.value = { ...activeIds.value, [demo.key]: id };
    status.value = id
      ? `Started "${demo.title}" (id: ${id}).`
      : `"${demo.title}" payload built — bridge inactive on this platform.`;
  } catch (err) {
    status.value = `Failed to start "${demo.title}": ${String(err)}`;
  }
}

async function stop(demo: Demo) {
  const id = activeIds.value[demo.key];
  if (!id) {
    status.value = `"${demo.title}" is not running.`;
    return;
  }
  await stopLiveActivity(id);
  const next = { ...activeIds.value };
  delete next[demo.key];
  activeIds.value = next;
  status.value = `Ended "${demo.title}".`;
}

async function endAll() {
  await endAllLiveActivities();
  activeIds.value = {};
  status.value = 'Ended all Live Activities.';
}
</script>

<template>
  <view class="Screen">
    <scroll-view scroll-orientation="vertical" class="Scroll">
      <view class="Content">
        <view class="Header">
          <text class="Title">Voltra × Vue Lynx</text>
          <text class="Subtitle">
            iOS Live Activities driven by a Vue 3 host. Same Voltra payload
            pipeline as the React example — only the UI framework changed.
          </text>
        </view>

        <view
          v-for="demo in DEMOS"
          :key="demo.key"
          class="Card"
        >
          <view class="CardHead">
            <text class="CardTitle">{{ demo.title }}</text>
            <text
              v-if="activeIds[demo.key]"
              class="Badge"
            >LIVE</text>
          </view>
          <text class="CardDesc">{{ demo.description }}</text>
          <view class="Row">
            <view class="Btn BtnPrimary" @tap="start(demo)">
              <text class="BtnText">Start</text>
            </view>
            <view class="Btn BtnGhost" @tap="stop(demo)">
              <text class="BtnText">End</text>
            </view>
          </view>
        </view>

        <view class="Btn BtnDanger" @tap="endAll">
          <text class="BtnText">End all Live Activities</text>
        </view>

        <text class="Status">{{ status }}</text>
      </view>
    </scroll-view>
  </view>
</template>
