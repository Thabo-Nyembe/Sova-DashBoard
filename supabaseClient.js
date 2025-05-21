import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wmwzrwvfydqbiroxlxgz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indtd3pyd3ZmeWRxYmlyb3hseGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYzMTc0MzgsImV4cCI6MjAzMTg5MzQzOH0.2Qg8aOxkQW80gBhnqyMPDuDv5WNb4-50arVlykyqoXA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
