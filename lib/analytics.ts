"use client";
import posthog from 'posthog-js';

export function captureEvent(event: string, properties?: Record<string, any>) {
  try {
    posthog.capture(event, properties);
  } catch {}
}
