export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900 sm:px-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-2xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Chatsworth, Georgia
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Tracks and Champagne
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-700">
          A unique wedding venue where railroad charm, rolling hills, and
          affordable packages meet. Preview tours open May 1.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 p-5">
            <h2 className="text-lg font-semibold">Venue Highlights</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-700">
              <li>Gazebo ceremony space for up to 40 guests</li>
              <li>Train-depot styled 3 bed / 2 bath house</li>
              <li>17-acre property with ATV trails and game stations</li>
              <li>Parking for up to 25 cars</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200 p-5">
            <h2 className="text-lg font-semibold">Booking Preview</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-zinc-700">
              <li>Tour scheduling calendar (coming next)</li>
              <li>Online deposit checkout (coming next)</li>
              <li>Optional catering and wedding manager add-ons</li>
              <li>Curfew starts at 11:00 PM EST</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
