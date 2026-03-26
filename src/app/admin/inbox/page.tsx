import { redirect } from "next/navigation";
import { venuePackages } from "@/lib/packages";

import { getPrismaClient } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { createOwnerInvoice, sendOwnerReply } from "./actions";

export default async function OwnerInboxPage() {
  const prisma = getPrismaClient();
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/sign-in?next=/admin/inbox");
  }

  if (user.role !== "OWNER") {
    redirect("/account");
  }


  const threads = await prisma.messageThread.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      guest: {
        select: {
          email: true,
          name: true,
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          body: true,
          senderRole: true,
          recipientRole: true,
          readAt: true,
          createdAt: true,
        },
      },
    },
  });
  const totalUnread = threads.reduce(
    (count, thread) =>
      count +
      thread.messages.filter(
        (message) => message.recipientRole === "OWNER" && !message.readAt,
      ).length,
    0,
  );
  if (totalUnread > 0) {
    await prisma.message.updateMany({
      where: {
        recipientRole: "OWNER",
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Owner Inbox</h1>
        <p className="mt-2 text-sm text-zinc-600">
          View all guest conversations and reply from here.
        </p>
        {totalUnread > 0 ? (
          <p className="mt-2 text-sm font-medium text-zinc-900">
            {totalUnread} unread messages
          </p>
        ) : null}

        <form action={createOwnerInvoice} className="mt-6 grid gap-3 rounded-lg border border-zinc-200 p-4">
          <h2 className="font-semibold">Create invoice for guest</h2>
          <input
            required
            name="guestEmail"
            type="email"
            placeholder="Guest email"
            className="rounded border border-zinc-300 px-3 py-2 text-sm"
          />
          <input
            required
            name="description"
            placeholder="Invoice description"
            className="rounded border border-zinc-300 px-3 py-2 text-sm"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              required
              name="amountDollars"
              type="number"
              min="1"
              step="0.01"
              placeholder="Amount ($)"
              className="rounded border border-zinc-300 px-3 py-2 text-sm"
            />
            <input
              required
              name="dueDate"
              type="date"
              className="rounded border border-zinc-300 px-3 py-2 text-sm"
            />
            <select
              name="packageTier"
              className="rounded border border-zinc-300 px-3 py-2 text-sm"
              defaultValue=""
            >
              <option value="">No package link</option>
              {venuePackages.map((pkg) => (
                <option key={pkg.key} value={pkg.key}>
                  {pkg.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-fit rounded bg-zinc-900 px-3 py-2 text-sm text-white">
            Create invoice
          </button>
        </form>

        {threads.length === 0 ? (
          <p className="mt-6 text-sm text-zinc-600">No active threads yet.</p>
        ) : (
          <div className="mt-6 space-y-5">
            {threads.map((thread) => (
              <article key={thread.id} className="rounded-lg border border-zinc-200 p-4">
                <h2 className="font-semibold">{thread.subject}</h2>
                {thread.messages.some(
                  (message) => message.recipientRole === "OWNER" && !message.readAt,
                ) ? (
                  <p className="mt-1 text-xs font-medium text-zinc-900">Unread in this thread</p>
                ) : null}
                <p className="text-sm text-zinc-600">
                  Guest: {thread.guest.name || "Guest"} ({thread.guest.email})
                </p>
                <div className="mt-3 space-y-2">
                  {thread.messages.map((message) => (
                    <div key={message.id} className="rounded bg-zinc-50 p-3 text-sm">
                      <p className="font-medium">{message.senderRole}</p>
                      <p className="mt-1">{message.body}</p>
                    </div>
                  ))}
                </div>
                <form action={sendOwnerReply} className="mt-3 grid gap-2">
                  <input type="hidden" name="threadId" value={thread.id} />
                  <textarea
                    required
                    name="body"
                    rows={2}
                    placeholder="Reply to guest..."
                    className="rounded border border-zinc-300 px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="w-fit rounded bg-zinc-900 px-3 py-1 text-sm text-white"
                  >
                    Send reply
                  </button>
                </form>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
