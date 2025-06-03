/* supabase.js  –  tiny helper layer around the Supabase JavaScript client
   Make **one** change:  plug in your own Supabase URL and anon key. */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL  = "https://rtbwncmgfkwjjohnxbot.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0YnduY21nZmt3ampvaG54Ym90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3OTc3MDcsImV4cCI6MjA2NDM3MzcwN30.JFvNArIYDrfMftQIwNJLlzPd0LVYNPFQklGwZjR9idM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

/* ========= CRUD wrappers used by index.html ========= */

export async function listPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("date", { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function createPost(p) {
  const { error } = await supabase.from("posts").insert(p);
  if (error) console.error(error);
}

export async function updatePost(p) {
  const { error } = await supabase.from("posts").update(p).eq("id", p.id);
  if (error) console.error(error);
}

export async function deletePost(id) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) console.error(error);
}

/* (optional) upload to Supabase Storage so images aren’t huge base-64 strings */
export async function uploadImage(file) {
  const bucket = "images";
  const filename = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(filename, file);
  if (error) {
    console.error(error);
    alert("Image upload failed: " + error.message);
    return "";
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;                     // URL we store in posts.imageData
}

/* Expose helpers for the in-browser Babel code */
window.supabaseHelpers = {
  listPosts,
  createPost,
  updatePost,
  deletePost,
  uploadImage,
};
