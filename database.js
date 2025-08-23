import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 🔑 Your Supabase credentials (from Supabase dashboard → Project Settings → API → anon key)
const supabaseUrl = 'https://ojglexoyixyrmsbzzuhz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qZ2xleG95aXh5cm1zYnp6dWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3ODU4MDEsImV4cCI6MjA3MTM2MTgwMX0.Rcvh92exD6tyglbRJ9mXdkQSkbOcN7ops9R2fUnDoW0'; // your anon public key

// ✅ Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// ➕ Add a record into SHREE_SHYAM_LOGISTIC table
export async function addRecord(name, email, subject, message) {
  const { data, error } = await supabase
    .from("SHREE_SHYAM_LOGISTIC")
    .insert([
      {
        NAME: name,             // ✅ exact match with Supabase column
        Email: email,           // ✅ exact match
        Subject: subject,       // ✅ exact match
        Description: message,  // ✅ exact match
        
      }
    ])
    .select();

  if (error) {
    console.error("Insert error:", error);
    return { success: false, error };
  }

  console.log("Inserted record:", data);
  return { success: true, data };
}


// 📥 Fetch all records
export async function fetchRecords() {
  const { data, error } = await supabase
    .from('SHREE_SHYAM_LOGISTIC')
    .select('*');

  if (error) {
    console.error('Fetch error:', error);
    return { success: false, error };
  }

  console.log('Fetched records:', data);
  return { success: true, data };
}

// 🔍 Example: Fetch records by email
export async function fetchByEmail(email) {
  const { data, error } = await supabase
    .from('SHREE_SHYAM_LOGISTIC')
    .select('*')
    .eq('Email', email);

  if (error) {
    console.error('Fetch error:', error);
    return { success: false, error };
  }

  console.log(`Fetched records for ${email}:`, data);
  return { success: true, data };
}
