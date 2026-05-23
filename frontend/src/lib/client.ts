import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://jflfuyrftbuhxdatmifg.supabase.co",
    "sb_publishable_l64PSF_DaL-VBZUvVGlN9w_9wERG3ZG"
  )
}
