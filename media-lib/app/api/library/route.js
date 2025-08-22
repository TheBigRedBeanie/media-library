import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import { supabase } from "../../../lib/supabaseClient";
export async function GET(req) {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 401 });

  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userData?.user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const userId = userData.user.id;

  const { data, error } = await supabaseAdmin
    .from("library")
    .select(`
      date_added,
      media:media_id (
        media_id,
        title,
        creator,
        media_type,
        release_date,
        description,
        format,
        created_at
      )
    `)
    .eq("library_id", userId)
    .order("date_added", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const items = (data || []).map(row => ({
    date_added: row.date_added,
    ...row.media,
  }));

  return NextResponse.json({ items });
}