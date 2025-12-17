import { ResourceType, LocalResourceKind } from "@prisma/client";

type Resource =
  | {
      id?: string;
      type?: ResourceType;
      label: string;
      description?: string;
      url?: string;
      phone?: string;
      addressText?: string;
      source?: string;
      stateCode?: string | null;
    }
  | {
      id?: string;
      kind: LocalResourceKind;
      label: string;
      url?: string | null;
      phone?: string | null;
      addressText?: string | null;
      source?: string;
    };

export function ResourceList({ resources }: { resources: Resource[] }) {
  if (!resources.length) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] px-3 py-2 text-sm text-[color:var(--color-text-muted)]">
        No resources yet. Generate and verify with local sources.
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {resources.map((res, idx) => {
        const title = "label" in res ? res.label : res.label;
        const description = "description" in res ? res.description : undefined;
        const pill =
          "type" in res && res.type
            ? res.type
            : "kind" in res
              ? res.kind
              : undefined;

        return (
          <div
            key={res?.id ?? `${title}-${idx}`}
            className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 shadow-[var(--shadow-subtle)]"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-[color:var(--color-text)]">{title}</p>
              {pill ? (
                <span className="rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-muted)] px-2 py-1 text-xs font-semibold text-[color:var(--color-text-muted)]">
                  {String(pill)}
                </span>
              ) : null}
            </div>
            {description ? (
              <p className="text-sm text-[color:var(--color-text-muted)]">{description}</p>
            ) : null}
            <div className="flex flex-wrap gap-2 text-sm">
              {"url" in res && res.url ? (
                <a
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-[color:var(--color-border)] px-3 py-1 text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]"
                >
                  Link
                </a>
              ) : null}
              {"phone" in res && res.phone ? (
                <a
                  href={`tel:${res.phone}`}
                  className="inline-flex items-center gap-1 rounded-full border border-[color:var(--color-border)] px-3 py-1 text-[color:var(--color-text)] hover:border-[color:var(--color-border-strong)]"
                >
                  Call {res.phone}
                </a>
              ) : null}
              {"addressText" in res && res.addressText ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--color-border)] px-3 py-1 text-[color:var(--color-text)]">
                  {res.addressText}
                </span>
              ) : null}
            </div>
            <p className="text-xs text-[color:var(--color-text-muted)]">
              Suggested only — verify details with official sources.
            </p>
          </div>
        );
      })}
    </div>
  );
}
