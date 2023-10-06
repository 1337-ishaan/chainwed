import { createClient } from '@supabase/supabase-js';

const pubKey = '';

const supabaseUrl = '';
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLIC_KEY!;

export const supabase = createClient(supabaseUrl, pubKey);
