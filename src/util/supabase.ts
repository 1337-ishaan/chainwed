import { createClient } from '@supabase/supabase-js';

const pubKey = process.env.REACT_APP_SUPABASE_PUBLIC_KEY
  ? process.env.REACT_APP_SUPABASE_PUBLIC_KEY
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZHJwd3ZscXJzZ2V2eXpmc3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY1Mzg3MDgsImV4cCI6MjAxMjExNDcwOH0.e3GyjH6iS52TmIYK8HiFR8_8Z-iF-nLSa3BO6WTBoOg';

const supabaseUrl = 'https://godrpwvlqrsgevyzfsxz.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_PUBLIC_KEY!;

export const supabase = createClient(supabaseUrl, pubKey);
