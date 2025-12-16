import { AppShell } from "@/components/layout/AppShell";

export default function AccountPage() {
  return (
    <AppShell
      activePath="/account"
      title="Account"
      description="Profile, notifications, and data controls will live here. No authentication is wired yet."
    >
      <section className="card space-y-2 p-5">
        <p className="type-body">
          This space will manage your profile, notification preferences, and exports. Everything
          stays server-side with clear consent.
        </p>
      </section>
    </AppShell>
  );
}
