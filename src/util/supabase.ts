import { createClient } from '@supabase/supabase-js';

const pubKey = process.env.REACT_APP_SUPABASE_PUBLIC_KEY ? process.env.REACT_APP_SUPABASE_PUBLIC_KEY : '';

const supabaseUrl = 'https://godrpwvlqrsgevyzfsxz.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLIC_KEY!;

export const supabase = createClient(supabaseUrl, pubKey);
