import { AppShell } from "@/components/layout/AppShell";
import {
  getProfileSignals,
  requireUser,
  updateProfileSignals,
} from "@/lib/currentUser";
import type { AgeBand, HomeContext, IncomeBand } from "@/lib/profileSignals";

const ageBandOptions: { label: string; value: AgeBand }[] = [
  { label: "Teen", value: "teen" },
  { label: "20s", value: "20s" },
  { label: "30s", value: "30s" },
  { label: "40s", value: "40s" },
  { label: "50s", value: "50s" },
  { label: "60+", value: "60+" },
];

const homeContextOptions: { label: string; value: HomeContext }[] = [
  { label: "Solo", value: "solo" },
  { label: "Partner", value: "partner" },
  { label: "Kids", value: "kids" },
  { label: "Roommates", value: "roommates" },
  { label: "Caregiving", value: "caregiving" },
];

const incomeBandOptions: { label: string; value: IncomeBand }[] = [
  { label: "Tight", value: "tight" },
  { label: "Stable", value: "stable" },
  { label: "Comfortable", value: "comfortable" },
];

export default async function AccountPage() {
  await requireUser();
  const signals = await getProfileSignals();

  async function handleSave(formData: FormData) {
    "use server";
    const payload = {
      displayName: (formData.get("displayName") ?? "").toString(),
      ageBand: (formData.get("ageBand") ?? signals.ageBand) as AgeBand,
      homeContext: (formData.get("homeContext") ?? signals.homeContext) as HomeContext,
      location: (formData.get("location") ?? "").toString(),
      incomeBand: (formData.get("incomeBand") ?? "") as IncomeBand,
      preferences: signals.preferences,
    };

    await updateProfileSignals(payload);
  }

  return (
    <AppShell
      activePath="/account"
      title="Account"
      description="Profile signals help tailor pacing and resources. Calm, practical fields only."
    >
      <form action={handleSave} className="space-y-4">
        <section className="grid gap-4 md:grid-cols-2">
          <article className="card space-y-3 p-5">
            <div className="space-y-1">
              <p className="type-meta">Display name</p>
              <p className="type-body text-[color:var(--color-text-muted)]">
                What should we call you inside plans? Keep it short.
              </p>
            </div>
            <input
              name="displayName"
              defaultValue={signals.displayName}
              required
              maxLength={120}
              className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-[color:var(--color-text)] shadow-[var(--shadow-subtle)] focus:border-[color:var(--color-border-strong)] focus:outline-none"
            />
          </article>

          <article className="card space-y-3 p-5">
            <div className="space-y-1">
              <p className="type-meta">Age band</p>
              <p className="type-body text-[color:var(--color-text-muted)]">
                Helps set tone and resources. Exact birthdates are not needed.
              </p>
            </div>
            <select
              name="ageBand"
              defaultValue={signals.ageBand}
              className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] shadow-[var(--shadow-subtle)] focus:border-[color:var(--color-border-strong)] focus:outline-none"
            >
              {ageBandOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </article>

          <article className="card space-y-3 p-5">
            <div className="space-y-1">
              <p className="type-meta">Home context</p>
              <p className="type-body text-[color:var(--color-text-muted)]">
                We adjust tasks based on who shares your space.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {homeContextOptions.map((option) => (
                <label
                  key={option.value}
                  className={[
                    "flex cursor-pointer items-center justify-between rounded-[var(--radius-md)] border px-3 py-2 text-sm font-semibold shadow-[var(--shadow-subtle)]",
                    signals.homeContext === option.value
                      ? "border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-muted)]"
                      : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:border-[color:var(--color-border-strong)]",
                  ].join(" ")}
                >
                  <span>{option.label}</span>
                  <input
                    type="radio"
                    name="homeContext"
                    value={option.value}
                    defaultChecked={signals.homeContext === option.value}
                    className="h-4 w-4 accent-[color:var(--color-text)]"
                  />
                </label>
              ))}
            </div>
          </article>

          <article className="card space-y-3 p-5">
            <div className="space-y-1">
              <p className="type-meta">Location (city / state)</p>
              <p className="type-body text-[color:var(--color-text-muted)]">
                Rough location guides local benefits and timing. No precise addresses.
              </p>
            </div>
            <input
              name="location"
              defaultValue={signals.location}
              maxLength={160}
              placeholder="e.g., Denver, CO"
              className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] shadow-[var(--shadow-subtle)] focus:border-[color:var(--color-border-strong)] focus:outline-none"
            />
          </article>

          <article className="card space-y-3 p-5">
            <div className="space-y-1">
              <p className="type-meta">Income feel (optional)</p>
              <p className="type-body text-[color:var(--color-text-muted)]">
                Helps set pacing and cost sensitivity for resources.
              </p>
            </div>
            <select
              name="incomeBand"
              defaultValue={signals.incomeBand ?? ""}
              className="w-full rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] shadow-[var(--shadow-subtle)] focus:border-[color:var(--color-border-strong)] focus:outline-none"
            >
              <option value="">Prefer not to say</option>
              {incomeBandOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </article>

          <article className="card space-y-3 p-5">
            <div className="space-y-1">
              <p className="type-meta">Preferences</p>
              <p className="type-body text-[color:var(--color-text-muted)]">
                Reduced motion is respected automatically. More preferences will land here later.
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-sm text-[color:var(--color-text-muted)] shadow-[var(--shadow-subtle)]">
              Staying light — nothing to toggle yet.
            </div>
          </article>
        </section>

        <div className="flex items-center justify-end gap-3">
          <p className="text-sm text-[color:var(--color-text-muted)]">
            Signals stay server-side and tune recommendations.
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-text)] bg-[color:var(--color-text)] px-5 py-2 text-sm font-semibold text-[color:var(--color-surface)] shadow-[var(--shadow-subtle)] transition-colors duration-[var(--motion-fast)] ease-[var(--motion-ease-standard)] hover:opacity-90"
          >
            Save signals
          </button>
        </div>
      </form>
    </AppShell>
  );
}
