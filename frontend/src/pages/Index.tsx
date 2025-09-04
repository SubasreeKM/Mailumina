import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Email = {
  id: number;
  sender: string;
  subject: string;
  body: string;
  received_at: string;
  extracted: any;
  sentiment: { label: string; score: number };
  priority_score: number;
  status: string;
  draft: string | null;
};

export default function IndexPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null); // track per-email loading

  const normalizeSentiment = (s: any) =>
    typeof s === "object" && s !== null
      ? {
          label: (s as any).label ?? "N/A",
          score: (s as any).score ?? 0,
        }
      : { label: "N/A", score: 0 };

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .order("priority_score", { ascending: false });

      if (error) {
        console.error("❌ Error fetching emails:", error.message);
      } else {
        setEmails((data || []).map((item) => ({ ...item, sentiment: normalizeSentiment(item.sentiment) })));
      }
      setLoading(false);
    };

    fetchEmails();

    // realtime updates
    const channel = supabase
      .channel("emails-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "emails" }, (payload) => {
        const newEmail: Email = { ...(payload.new as Email), sentiment: normalizeSentiment(payload.new.sentiment) };
        setEmails((prev) => [newEmail, ...prev].sort((a, b) => b.priority_score - a.priority_score));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "emails" }, (payload) => {
        const updatedEmail: Email = { ...(payload.new as Email), sentiment: normalizeSentiment(payload.new.sentiment) };
        setEmails((prev) =>
          prev
            .map((e) =>
              (e as Email).id === updatedEmail.id
                ? updatedEmail
                : e
            )
            .sort((a, b) => b.priority_score - a.priority_score)
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔘 Trigger backend to fetch new emails
  const handleFetchEmails = async () => {
    setActionLoading(-1);
    try {
      await fetch("http://127.0.0.1:8000/fetch-emails", { method: "POST" });
    } catch (err) {
      console.error("❌ Failed to fetch emails:", err);
    }
    setActionLoading(null);
  };

  // ✉️ Send reply
const handleSendReply = async (id: number) => {
  setActionLoading(id);
  try {
    await fetch(`http://127.0.0.1:8000/send-reply/${id}`, { method: "POST" });
  } catch (err) {
    console.error("❌ Failed to send reply:", err);
  }
  setActionLoading(null);
};


  // ✏️ Generate AI draft reply
  const handleGenerateDraft = async (id: number) => {
    setActionLoading(id);
    try {
      await fetch(`http://127.0.0.1:8000/generate-draft/${id}`, { method: "POST" });
    } catch (err) {
      console.error("❌ Failed to generate draft:", err);
    }
    setActionLoading(null);
  };

  // ✅ Mark as resolved
  const handleMarkResolved = async (id: number) => {
    setActionLoading(id);
    try {
      const { error } = await supabase.from("emails").update({ status: "resolved" }).eq("id", id);
      if (error) console.error("❌ Failed to mark resolved:", error.message);
    } catch (err) {
      console.error("❌ Error:", err);
    }
    setActionLoading(null);
  };

  if (loading) {
    return <p className="p-4 text-lg">Loading emails...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📧 Support Emails Dashboard</h1>

      {/* Global Fetch Button */}
      <button
        onClick={handleFetchEmails}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={actionLoading === -1}
      >
        {actionLoading === -1 ? "Fetching..." : "🔄 Fetch Latest Emails"}
      </button>

      {emails.length === 0 ? (
        <p className="text-gray-500">No emails found.</p>
      ) : (
        <div className="space-y-4">
          {emails.map((email) => (
            <div key={email.id} className="border border-gray-200 rounded-lg shadow-sm p-4 bg-white">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{email.subject}</h2>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    email.priority_score > 3 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}
                >
                  {email.priority_score > 3 ? "Urgent" : "Normal"}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                <b>From:</b> {email.sender}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <b>Sentiment:</b> {email.sentiment?.label || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <b>Status:</b> {email.status}
              </p>
              <p className="text-gray-700 mt-2">{email.body}</p>

              {email.draft && (
                <div className="bg-gray-50 border border-gray-200 mt-3 p-3 rounded">
                  <b>AI Draft Reply:</b>
                  <p className="mt-1 text-gray-700">{email.draft}</p>
                </div>
              )}


              

              {/* Action buttons */}
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleGenerateDraft(email.id)}
                  className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                  disabled={actionLoading === email.id}
                >
                  {actionLoading === email.id ? "Generating..." : "🤖 Generate Draft"}
                </button>

                <button
                  onClick={() => handleMarkResolved(email.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={actionLoading === email.id}
                >
                  {actionLoading === email.id ? "Updating..." : "✅ Mark Resolved"}
                </button>
                <button
                onClick={() => handleSendReply(email.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={actionLoading === email.id}
              >
                {actionLoading === email.id ? "Sending..." : "✉️ Send Reply"}
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
