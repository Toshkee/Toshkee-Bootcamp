"use client";

import type { RunResult } from "./harness";

/**
 * Pokreće program u zasebnom Web Worker-u: tvoj kod ne može da zamrzne stranicu,
 * a beskonačnu petlju prekidamo posle par sekundi.
 */
const WORKER_SOURCE = `self.onmessage = async (e) => {
  try {
    const fn = new Function(e.data);
    const result = await fn();
    self.postMessage({ ok: true, result });
  } catch (err) {
    self.postMessage({ ok: false, error: (err && err.name ? err.name + ": " : "") + (err && err.message ? err.message : String(err)) });
  }
};`;

export function runInWorker(program: string, timeoutMs = 4000): Promise<RunResult> {
  const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
  const worker = new Worker(url);
  return new Promise((resolve) => {
    const finish = (result: RunResult) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(result);
    };
    const timer = setTimeout(() => finish({ logs: [], tests: [], timedOut: true }), timeoutMs);
    worker.onmessage = (e: MessageEvent<{ ok: boolean; result?: RunResult; error?: string }>) =>
      finish(e.data.ok && e.data.result ? e.data.result : { logs: [], tests: [], runtimeError: e.data.error });
    worker.onerror = (e) => {
      e.preventDefault();
      finish({ logs: [], tests: [], runtimeError: e.message });
    };
    worker.postMessage(program);
  });
}
