import { supabase } from "./supabase.js";

export async function replaceImage(oldPath, newFile) {
  if (oldPath) await supabase.storage.from("images").remove([oldPath]);
  return await uploadImage(newFile);
}
