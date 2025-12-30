import { pool } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <h1>Invalid paste ID</h1>;
  }

  const { rows } = await pool.query(
    `
    SELECT content
    FROM pastes
    WHERE id = $1
      AND (expires_at IS NULL OR expires_at > NOW())
      AND (max_views IS NULL OR view_count < max_views)
    `,
    [id]
  );

  if (rows.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-red-600">Paste not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F3EE] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold text-green-700 mb-4">
          📄 DropText
        </h1>

        <pre className="bg-green-50 border border-green-200 rounded-lg p-4 font-mono whitespace-pre-wrap break-words">
          {rows[0].content}
        </pre>
      </div>
    </main>
  );
}
