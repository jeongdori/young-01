const cleanupTasks: (() => Promise<void> | void)[] = [];

function registerCleanup(fn: () => Promise<void> | void) {
    cleanupTasks.push(fn);
}

export async function runAllCleanup() {
    for (const fn of cleanupTasks) {
        try {
            await fn();
        } catch (e) {
            console.error('❌ Cleanup error:', e);
        }
    }
}

/**
 *
 */
// const nativeSetInterval = global.setInterval as (
//     callback: TimerHandler,
//     ms?: number,
//     ...args: any[]
// ) => NodeJS.Timeout;

// const nativeSetTimeout = global.setTimeout as (
//     callback: TimerHandler,
//     ms?: number,
//     ...args: any[]
// ) => NodeJS.Timeout;

// // 오버라이드
// global.setInterval = function (
//     callback: TimerHandler,
//     ms?: number | undefined,
//     ...args: any[]
// ): NodeJS.Timeout {
//     const handle = nativeSetInterval(callback, ms, ...args);
//     registerCleanup(() => clearInterval(handle));
//     return handle;
// };

// global.setTimeout = function (
//     callback: (...args: any[]) => void,
//     ms?: number,
//     ...args: any[]
// ): NodeJS.Timeout {
//     const handle = nativeSetTimeout(callback, ms, ...args);
//     registerCleanup(() => clearTimeout(handle));
//     return handle;
// };

/**
 *
 */
// import Bull from 'bull';

// export function createQueue<T>(name: string, opts?: Bull.QueueOptions) {
//   const q = new Bull<T>(name, opts);
//   registerCleanup(async () => {
//     await q.close();
//   });
//   return q;
// }

/**
 *
 *
 */
// import { EventEmitter } from 'events';

// export function subscribe<T>(
//     ee: EventEmitter,
//     event: string | symbol,
//     listener: (...args: any[]) => void,
// ) {
//     ee.on(event, listener);
//     registerCleanup(() => ee.off(event, listener));
// }
