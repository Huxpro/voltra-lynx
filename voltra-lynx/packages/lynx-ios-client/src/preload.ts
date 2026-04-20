import { isIOS } from '@voltra-lynx/bridge'

import type { PreloadImageOptions, PreloadImagesResult } from './types.js'
import VoltraModule from './VoltraModule.js'

export type { PreloadImageOptions, PreloadImagesResult } from './types.js'

function assertIOS(name: string): boolean {
  const ios = isIOS()
  if (!ios) console.error(`${name} is only available on iOS`)
  return ios
}

export async function preloadImages(images: PreloadImageOptions[]): Promise<PreloadImagesResult> {
  if (!assertIOS('preloadImages')) {
    return { succeeded: [], failed: images.map((img) => ({ key: img.key, error: 'Not available on this platform' })) }
  }

  try {
    return await VoltraModule.preloadImages(images)
  } catch (error) {
    return {
      succeeded: [],
      failed: images.map((img) => ({
        key: img.key,
        error: error instanceof Error ? error.message : 'Unknown error',
      })),
    }
  }
}

export async function reloadLiveActivities(activityNames?: string[]): Promise<void> {
  if (!assertIOS('reloadLiveActivities')) return

  try {
    await VoltraModule.reloadLiveActivities(activityNames ?? null)
  } catch (error) {
    console.error('Failed to reload Live Activities:', error)
  }
}

export async function clearPreloadedImages(keys?: string[]): Promise<void> {
  if (!assertIOS('clearPreloadedImages')) return

  try {
    await VoltraModule.clearPreloadedImages(keys ?? null)
  } catch (error) {
    console.error('Failed to clear preloaded images:', error)
  }
}
