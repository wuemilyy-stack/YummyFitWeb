import { createSupabaseHandler } from '../../../server/supabase-handler.mjs';
Deno.serve(createSupabaseHandler({
  url: Deno.env.get('SUPABASE_URL'),
  serviceKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
  origins: (Deno.env.get('YUMMYFIT_WEB_ORIGINS') || 'https://wuemilyy-stack.github.io').split(',').map(value => value.trim()).filter(Boolean),
}));
