import { useRef, useState } from 'react';
import { apiBase } from '@/config/site';
import { POLICY_VERSION } from '../../shared/contracts';
export function useSignup(endpoint: 'intakes' | 'newsletter') {
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const attempt = useRef<{ body: string; key: string }>();
  async function submit(payload: Record<string, unknown>) {
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setError(null);
    const body = JSON.stringify({ ...payload, policyVersion: POLICY_VERSION });
    if (attempt.current?.body !== body) attempt.current = { body, key: crypto.randomUUID() };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${apiBase}/${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': attempt.current.key },
        body, signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || 'We could not save your signup. Please try again.');
      if (typeof result.id !== 'string' || result.status !== 'accepted') throw new Error('We could not confirm your signup. Please try again.');
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== 'AbortError' ? cause.message : 'The request timed out. Please try again.');
    } finally {
      clearTimeout(timeout);
      inFlight.current = false;
      setPending(false);
    }
  }
  return { pending, saved, error, submit };
}
