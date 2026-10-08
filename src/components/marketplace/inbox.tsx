"use client"; // Authenticated inbox with visibility-aware polling and message pagination.
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useLocale } from "next-intl";
import { MessageCircle, Send, ArrowUpRight, RefreshCw } from "lucide-react";
import { clientAuth } from "@/lib/firebase-client";
import {
  getThreads,
  getThreadMessages,
  sendThreadMessage,
} from "@/actions/inbox/threads";
import {
  getMyAdminMessages,
  type AdminMessage,
} from "@/actions/messages/get-my-admin-messages";
import type { ThreadSummary, ThreadMessage } from "@/lib/inbox/types";
import { Link, useRouter } from "@/i18n/navigation";
import { isDemoMode } from "@/lib/runtime";
import { copy as c } from "@/lib/copy";
import { DemoNotice } from "./demo-notice";
export function Inbox({ initialThread }: { initialThread?: string }) {
  const l = useLocale();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [selected, setSelected] = useState(initialThread ?? "");
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [admin, setAdmin] = useState<AdminMessage[]>([]);
  const [older, setOlder] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const nonce = useRef<string | null>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isDemoMode) return;
    let mounted = true;
    const off = onAuthStateChanged(clientAuth, (u) => {
      if (!mounted) return;
      setUser(u);
      if (!u) {
        setThreads([]);
        setMessages([]);
        router.replace("/login?next=/messages");
      }
    });
    return () => {
      mounted = false;
      off();
    };
  }, [router]);
  useEffect(() => {
    if (!user) return;
    let active = true;
    const load = async () => {
      try {
        const idToken = await user.getIdToken();
        const [rows, notices] = await Promise.all([
          getThreads({ idToken }),
          getMyAdminMessages({ idToken }),
        ]);
        if (!active) return;
        setThreads(rows);
        setAdmin(notices);
        setSelected((prev) => prev || rows[0]?.id || "");
      } catch {
        if (active)
          setError(
            c(
              l,
              "Could not load the inbox. Try refreshing.",
              "Mesaj kutusu yüklenemedi. Yenilemeyi deneyin.",
            ),
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    const timer = setInterval(() => {
      if (!document.hidden) void load();
    }, 20000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [user, l]);
  useEffect(() => {
    if (!user || !selected) return;
    let active = true;
    let firstLoad = true;
    setMessages([]);
    setOlder(null);
    setDraft("");
    nonce.current = null;
    const load = async () => {
      try {
        const page = await getThreadMessages({
          idToken: await user.getIdToken(),
          threadId: selected,
        });
        if (active) {
          setMessages((prev) => {
            const latest = new Set(page.messages.map((m) => m.id));
            return [
              ...prev.filter(
                (m) =>
                  !latest.has(m.id) &&
                  m.createdAt < (page.messages[0]?.createdAt ?? 0),
              ),
              ...page.messages,
            ];
          });
          if (firstLoad) {
            setOlder(page.olderCursor);
            firstLoad = false;
          }
        }
      } catch {
        if (active)
          setError(
            c(
              l,
              "This conversation could not be loaded.",
              "Bu sohbet yüklenemedi.",
            ),
          );
      }
    };
    void load();
    const timer = setInterval(() => {
      if (!document.hidden) void load();
    }, 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [user, selected, l]);
  const lastMessage = messages.at(-1)?.id;
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [lastMessage]);
  const current = threads.find((t) => t.id === selected);
  if (isDemoMode) return <DemoNotice locale={l} />;
  if (loading)
    return (
      <p className="feedback">
        {c(l, "Loading your conversations…", "Sohbetleriniz yükleniyor…")}
      </p>
    );
  return (
    <>
      {error && (
        <p className="feedback error" role="alert">
          {error}
        </p>
      )}
      <div className="inbox">
        <aside className="thread-list">
          <h2>
            <MessageCircle size={18} />
            {c(l, "Conversations", "Sohbetler")} <small>{threads.length}</small>
          </h2>
          {threads.length === 0 && (
            <p className="thread-empty">
              {c(
                l,
                "Message a host from a home’s page to get started.",
                "Başlamak için ilan sayfasından ev sahibine mesaj gönderin.",
              )}
            </p>
          )}
          {threads.map((t) => (
            <button
              key={t.id}
              className={selected === t.id ? "thread active" : "thread"}
              disabled={busy}
              onClick={() => {
                setSelected(t.id);
                setError("");
              }}
            >
              <span className="avatar">
                {t.otherName.slice(0, 1).toUpperCase()}
              </span>
              <span>
                <b>{t.otherName}</b>
                <span>{l === "tr" ? t.titleTr : t.titleEn}</span>
                <small>
                  {t.lastText ||
                    c(l, "Start the conversation", "Sohbeti başlatın")}
                </small>
              </span>
            </button>
          ))}
        </aside>
        <section className="message-pane">
          {current ? (
            <>
              <div className="conversation-heading">
                <div>
                  <b>{current.otherName}</b>
                  <p>{l === "tr" ? current.titleTr : current.titleEn}</p>
                </div>
                <Link
                  href={`/listings/${current.listingId}`}
                  aria-label={c(l, "View home", "Evi gör")}
                >
                  <ArrowUpRight size={20} />
                </Link>
              </div>
              <div
                className="message-scroll"
                role="log"
                aria-label={c(l, "Conversation messages", "Sohbet mesajları")}
                aria-live="polite"
              >
                {older && (
                  <button
                    className="text-link"
                    onClick={async () => {
                      if (!user || busy) return;
                      setBusy(true);
                      try {
                        const page = await getThreadMessages({
                          idToken: await user.getIdToken(),
                          threadId: selected,
                          before: older,
                        });
                        setMessages((prev) => [
                          ...page.messages.filter(
                            (m) => !prev.some((p) => p.id === m.id),
                          ),
                          ...prev,
                        ]);
                        setOlder(page.olderCursor);
                      } catch {
                        setError(
                          c(
                            l,
                            "Could not load older messages.",
                            "Eski mesajlar yüklenemedi.",
                          ),
                        );
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    {c(l, "Load earlier messages", "Önceki mesajları yükle")}
                  </button>
                )}
                {messages.length === 0 && (
                  <p className="conversation-tip">
                    {c(
                      l,
                      "Say hello. Ask about availability, monthly costs or arranging a viewing.",
                      "Merhaba deyin. Müsaitliği, aylık masrafları veya evi görmeyi sorun.",
                    )}
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    className={`message-bubble ${m.senderUid === user?.uid ? "mine" : ""}`}
                    key={m.id}
                  >
                    <p>{m.text}</p>
                    <time>
                      {new Date(m.createdAt).toLocaleString(l, {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Europe/Istanbul",
                      })}
                    </time>
                  </div>
                ))}
                <div ref={end} />
              </div>
              <form
                className="message-compose"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!user || !draft.trim() || busy) return;
                  setBusy(true);
                  setError("");
                  const threadId = selected;
                  let sent = false;
                  try {
                    nonce.current ??= crypto.randomUUID();
                    await sendThreadMessage({
                      idToken: await user.getIdToken(),
                      threadId,
                      text: draft,
                      messageId: nonce.current,
                    });
                    sent = true;
                    const delivered = {
                      id: nonce.current,
                      senderUid: user.uid,
                      text: draft.trim(),
                      createdAt: Date.now(),
                    };
                    setMessages((prev) =>
                      prev.some((m) => m.id === delivered.id)
                        ? prev
                        : [...prev, delivered],
                    );
                    nonce.current = null;
                    setDraft("");
                    const page = await getThreadMessages({
                      idToken: await user.getIdToken(),
                      threadId,
                    });
                    setMessages((prev) => {
                      const latest = new Set(page.messages.map((m) => m.id));
                      return [
                        ...prev.filter(
                          (m) =>
                            !latest.has(m.id) &&
                            m.createdAt < (page.messages[0]?.createdAt ?? 0),
                        ),
                        ...page.messages,
                      ];
                    });
                  } catch {
                    // A failed refresh must not present a successful send as a failure.
                    // The delivered message stays visible and polling retries the refresh.
                    if (!sent)
                      setError(
                        c(
                          l,
                          "Message not sent. Please try again.",
                          "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
                        ),
                      );
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                <textarea
                  aria-label={c(l, "Your message", "Mesajınız")}
                  placeholder={c(l, "Write a message…", "Mesaj yazın…")}
                  value={draft}
                  disabled={busy}
                  maxLength={3000}
                  required
                  onChange={(e) => {
                    setDraft(e.target.value);
                    nonce.current = null;
                  }}
                />
                <button
                  className="button"
                  disabled={busy || !draft.trim()}
                  aria-label={c(l, "Send message", "Mesaj gönder")}
                >
                  {busy ? <RefreshCw size={18} /> : <Send size={18} />}
                </button>
              </form>
              <p className="inbox-footnote">
                {c(
                  l,
                  "Keep payments and sensitive documents out of chat. Messages refresh automatically.",
                  "Ödemeleri ve hassas belgeleri sohbet dışında tutun. Mesajlar otomatik yenilenir.",
                )}
              </p>
            </>
          ) : (
            <div className="empty-state">
              <MessageCircle size={35} />
              <h3>
                {c(
                  l,
                  "A good home starts with hello.",
                  "Güzel bir ev merhaba ile başlar.",
                )}
              </h3>
              <Link className="button" href="/search">
                {c(l, "Explore homes", "Evleri keşfet")}
              </Link>
            </div>
          )}
        </section>
      </div>
      {admin.length > 0 && (
        <section className="prose-section">
          <h2>{c(l, "From WeShareCozy", "WeShareCozy’den")}</h2>
          {admin.map((m) => (
            <p key={m.id} className="feedback mb-3">
              {m.text}
            </p>
          ))}
        </section>
      )}
    </>
  );
}
