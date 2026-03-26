import Link from "next/link";
import { redirect } from "next/navigation";

import { clearSession, getSessionUser } from "@/lib/auth/session";
import { formatUsd } from "@/lib/packages";
import { getPrismaClient } from "@/lib/prisma";

import { sendGuestMessage, startInvoiceCheckout } from "./actions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    billingError?: string;
  }>;
};

function getBillingErrorMessage(code: string | undefined): string | null {
  if (!code) return null;
  if (code === "missing-invoice") return "Invoice id is missing.";
  if (code === "invoice-not-found") return "Invoice not found or already paid.";
  if (code === "missing-checkout-url") return "Stripe did not return a checkout URL.";
  if (code === "checkout-setup-failed")
    return "Stripe checkout setup failed. Verify APP_URL and STRIPE_SECRET_KEY.";
  return "Could not start checkout.";
}

export default async function AccountPage({ searchParams }: PageProps) {
  const prisma = getPrismaClient();
  const user = await getSessionUser();
  const params = await searchParams;

  if (!user) {
    redirect("/auth/sign-in?next=/account");
  }

  const [invoices, threads] = await Promise.all([
    prisma.invoice.findMany({
      where: { guestId: user.id },
      orderBy: { dueDate: "asc" },
    }),
    prisma.messageThread.findMany({
      where: { guestId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
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
    }),
  ]);

  const outstanding = invoices
    .filter((invoice) => invoice.status === "DUE")
    .reduce((sum, invoice) => sum + invoice.amountCents, 0);

  const unreadCount = threads.reduce(
    (count, thread) =>
      count +
      thread.messages.filter(
        (message) => message.recipientRole === "GUEST" && !message.readAt,
      ).length,
    0,
  );

  const billingError = getBillingErrorMessage(params.billingError);

  if (unreadCount > 0) {
    await prisma.message.updateMany({
      where: {
        thread: { guestId: user.id },
        recipientRole: "GUEST",
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  return (
    <main className="px-6 py-14 sm:px-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="space-y-4 rounded-2xl bg-white p-7 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Your account</h1>
              <p className="mt-1 text-sm text-zinc-600">{user.email}</p>
            </div>
            <form
              action={async () => {
                "use server";
                await clearSession();
                redirect("/");
              }}
            >
              <button type="submit" className="rounded border border-zinc-300 px-3 py-1 text-sm">
                Sign out
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm text-zinc-600">Outstanding balance</p>
            <p className="text-2xl font-semibold">{formatUsd(outstanding)}</p>
          </div>

          {billingError ? (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {billingError}
            </p>
          ) : null}

          <h2 className="text-lg font-semibold">Invoices</h2>
          {invoices.length === 0 ? (
            <p className="text-sm text-zinc-600">No invoices yet.</p>
          ) : (
            <div className="grid gap-3">
              {invoices.map((invoice) => (
                <article key={invoice.id} className="rounded-lg border border-zinc-200 p-4">
                  <p className="font-medium">{invoice.description}</p>
                  <p className="text-sm text-zinc-600">
                    Due {invoice.dueDate.toISOString().slice(0, 10)}
                  </p>
                  <p className="mt-1 text-sm">
                    Amount: <span className="font-medium">{formatUsd(invoice.amountCents)}</span>
                  </p>
                  <p className="text-sm">Status: {invoice.status}</p>
                  {invoice.status === "DUE" ? (
                    <form action={startInvoiceCheckout} className="mt-3">
                      <input type="hidden" name="invoiceId" value={invoice.id} />
                      <button
                        type="submit"
                        className="rounded bg-zinc-900 px-3 py-1 text-sm text-white"
                      >
                        Pay now
                      </button>
                    </form>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4 rounded-2xl bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Inbox</h2>
            {unreadCount > 0 ? (
              <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white">
                {unreadCount} unread
              </span>
            ) : null}
            {user.role === "OWNER" ? (
              <div className="flex flex-wrap gap-3">
                <Link href="/admin/inbox" className="text-sm font-medium text-zinc-900 hover:underline">
                  Owner inbox
                </Link>
                <Link href="/admin/tours" className="text-sm font-medium text-zinc-900 hover:underline">
                  Tour requests
                </Link>
                <Link href="/admin/reservations" className="text-sm font-medium text-zinc-900 hover:underline">
                  Reservations
                </Link>
                <Link href="/admin/availability" className="text-sm font-medium text-zinc-900 hover:underline">
                  Availability
                </Link>
              </div>
            ) : null}
          </div>

          <form action={sendGuestMessage} className="grid gap-2 rounded-lg border border-zinc-200 p-4">
            <p className="text-sm font-medium">Start a new thread</p>
            <input
              name="subject"
              placeholder="Subject"
              className="rounded border border-zinc-300 px-3 py-2 text-sm"
            />
            <textarea
              required
              name="body"
              rows={3}
              placeholder="Message to venue team"
              className="rounded border border-zinc-300 px-3 py-2 text-sm"
            />
            <button type="submit" className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">
              Send
            </button>
          </form>

          {threads.length === 0 ? (
            <p className="text-sm text-zinc-600">No messages yet.</p>
          ) : (
            <div className="space-y-4">
              {threads.map((thread) => (
                <article key={thread.id} className="rounded-lg border border-zinc-200 p-4">
                  <h3 className="font-medium">{thread.subject}</h3>
                  <div className="mt-3 space-y-2">
                    {thread.messages.map((message) => (
                      <div key={message.id} className="rounded bg-zinc-50 p-3 text-sm">
                        <p className="font-medium">{message.senderRole}</p>
                        <p className="mt-1">{message.body}</p>
                      </div>
                    ))}
                  </div>
                  <form action={sendGuestMessage} className="mt-3 grid gap-2">
                    <input type="hidden" name="threadId" value={thread.id} />
                    <textarea
                      required
                      name="body"
                      rows={2}
                      placeholder="Reply..."
                      className="rounded border border-zinc-300 px-3 py-2 text-sm"
                    />
                    <button
                      type="submit"
                      className="w-fit rounded bg-zinc-900 px-3 py-1 text-sm text-white"
                    >
                      Reply
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
