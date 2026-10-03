import { createSupabaseHandler } from '../../../server/supabase-handler.mjs';
import { gmailWorker } from '../_shared/email.ts';
Deno.serve(createSupabaseHandler({
  url: Deno.env.get('SUPABASE_URL'),
  serviceKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
  origins: (Deno.env.get('YUMMYFIT_WEB_ORIGINS') || 'https://wuemilyy-stack.github.io').split(',').map(value => value.trim()).filter(Boolean),
  onCapture: () => {
    if (!Deno.env.get('GMAIL_APP_PASSWORD')) return;
    EdgeRuntime.waitUntil(gmailWorker()().catch(() => console.error(JSON.stringify({event:'email_dispatch_unavailable'}))));
  },
}));
