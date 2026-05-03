import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMetadata() {
  const { data: artworks, error } = await supabase
    .from('artworks')
    .select('collection, category');

  if (error) {
    console.error(error);
    return;
  }

  const collections = [...new Set(artworks.map(a => a.collection))].sort();
  const categories = [...new Set(artworks.map(a => a.category))].sort();

  console.log('Unique Collections in DB:', collections);
  console.log('Unique Categories in DB:', categories);
}

checkMetadata();
