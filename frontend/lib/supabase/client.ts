import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createSupabaseClientComponent = () => {
  return createClientComponentClient();
};
