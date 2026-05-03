import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .limit(5);

  if (error) {
    console.error(error);
    return;
  }

  console.log(JSON.stringify(data, null, 2));
}

checkDb();
