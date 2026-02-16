import { Badge } from "@/components/ui/badge";

export default function HomeDocumentationPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col gap-2 border-b border-[var(--years-purple-300)] pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[clamp(2.5rem,5vw,3rem)] leading-none text-foreground">
            Documentation
          </h1>
          <p className="max-w-[58rem] text-[clamp(1.1rem,2vw,1.25rem)] leading-snug text-foreground">
            How to install and use @moreyears/icons in React, plus the local CDN
            sync workflow used by this project.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["npm package", "React component", "CDN URLs"].map((label) => (
            <Badge
              key={label}
              className="rounded-full border-[var(--years-gray-200)] bg-[var(--years-gray-100)] px-3 py-1 text-sm font-normal text-[var(--years-gray-700)]"
              variant="secondary"
            >
              {label}
            </Badge>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="flex flex-col gap-4 pt-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-[var(--years-purple-100)] p-8">
            <h2 className="font-display text-2xl leading-tight text-[var(--years-purple-800)]">
              Install
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--years-purple-800)]">
              Install the package from npm:
            </p>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-[var(--years-purple-200)] p-4 text-xs text-[var(--years-purple-900)]">
{`npm i @moreyears/icons`}
            </pre>
          </div>

          <div className="rounded-2xl bg-[var(--years-purple-100)] p-8">
            <h2 className="font-display text-2xl leading-tight text-[var(--years-purple-800)]">
              React usage
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--years-purple-800)]">
              Use the React component exported from the root package:
            </p>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-[var(--years-purple-200)] p-4 text-xs text-[var(--years-purple-900)]">
{`import { Icon } from "@moreyears/icons";

<Icon name="mailbox" />
<Icon name="mailbox" weight="bold" size={32} color="#333" />
<Icon name="mailbox" weight="linear" strokeWidth={1.5} />`}
            </pre>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-[var(--years-purple-100)] p-8">
            <h2 className="font-display text-2xl leading-tight text-[var(--years-purple-800)]">
              Helpers and manifest
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--years-purple-800)]">
              Runtime helpers and manifest imports:
            </p>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-[var(--years-purple-200)] p-4 text-xs text-[var(--years-purple-900)]">
{`import {
  getIconSvg,
  getIconInfo,
  getAllIcons,
  getIconsByCategory,
  getCategories,
} from "@moreyears/icons";

import manifest from "@moreyears/icons/manifest";`}
            </pre>
          </div>

          <div className="rounded-2xl bg-[var(--years-purple-100)] p-8">
            <h2 className="font-display text-2xl leading-tight text-[var(--years-purple-800)]">
              Available weights
            </h2>
            <div className="mt-3 flex flex-col gap-2 text-sm text-[var(--years-purple-800)]">
              <p><code className="rounded bg-[var(--years-purple-200)] px-2 py-0.5 text-xs">broken</code></p>
              <p><code className="rounded bg-[var(--years-purple-200)] px-2 py-0.5 text-xs">line-duotone</code></p>
              <p><code className="rounded bg-[var(--years-purple-200)] px-2 py-0.5 text-xs">linear</code></p>
              <p><code className="rounded bg-[var(--years-purple-200)] px-2 py-0.5 text-xs">outline</code></p>
              <p><code className="rounded bg-[var(--years-purple-200)] px-2 py-0.5 text-xs">bold</code></p>
              <p><code className="rounded bg-[var(--years-purple-200)] px-2 py-0.5 text-xs">bold-duotone</code></p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--years-purple-100)] p-8">
          <h2 className="font-display text-2xl leading-tight text-[var(--years-purple-800)]">
            Local CDN sync for this project
          </h2>
          <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-[var(--years-purple-800)]">
            <p>
              This docs app serves icons from{" "}
              <code className="rounded bg-[var(--years-purple-200)] px-2 py-0.5 text-xs">
                /icons/&lt;weight&gt;/&lt;id&gt;.svg
              </code>
              . Run the sync script after package updates:
            </p>
            <pre className="overflow-x-auto rounded-xl bg-[var(--years-purple-200)] p-4 text-xs text-[var(--years-purple-900)]">
{`npm i @moreyears/icons@latest
npm run icons:build
npm run dev`}
            </pre>
            <p>
              The sync command updates both{" "}
              <code className="rounded bg-[var(--years-purple-200)] px-2 py-0.5 text-xs">public/icons</code> and{" "}
              <code className="rounded bg-[var(--years-purple-200)] px-2 py-0.5 text-xs">packages/icons/dist</code>{" "}
              from the published npm package.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
