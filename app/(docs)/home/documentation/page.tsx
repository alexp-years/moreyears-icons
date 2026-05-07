import { cn } from "@/lib/utils";

type ReactPropRow = {
  prop: string;
  type: string;
  defaultValue: string;
  description: string;
};

type WeightRow = {
  weight: string;
  slug: string;
  description: string;
};

type AttributeRow = {
  attribute: string;
  defaultValue: string;
  description: string;
};

const sections = [
  { id: "getting-started", label: "Getting started" },
  { id: "react-component", label: "React component" },
  { id: "weights", label: "Weights" },
  { id: "cdn-web-component", label: "CDN / Web Component" },
  { id: "helper-functions", label: "Helper functions" },
  { id: "direct-svg-access", label: "Direct SVG access" },
  { id: "typescript", label: "TypeScript" },
  { id: "common-patterns", label: "Common patterns" },
  { id: "updating-library", label: "Updating the icon library" },
];

const reactProps: ReactPropRow[] = [
  {
    prop: "name",
    type: "string",
    defaultValue: "Required",
    description:
      'Icon name as slug ("mailbox"), display name ("Mailbox"), or full ID ("messages-conversation/mailbox").',
  },
  {
    prop: "weight",
    type: "string",
    defaultValue: '"linear"',
    description: "Icon weight variant.",
  },
  {
    prop: "size",
    type: "number | string",
    defaultValue: "24",
    description: "Width and height in pixels.",
  },
  {
    prop: "color",
    type: "string",
    defaultValue: '"currentColor"',
    description: "Any valid CSS color value.",
  },
  {
    prop: "strokeWidth",
    type: "number | string",
    defaultValue: "None",
    description:
      "Stroke width override. Most useful for linear and outline-like weights.",
  },
  {
    prop: "className",
    type: "string",
    defaultValue: "None",
    description: "Appended to the wrapper element class list.",
  },
];

const weights: WeightRow[] = [
  { weight: "Bold", slug: "bold", description: "Solid filled icons." },
  {
    weight: "Bold Duotone",
    slug: "bold-duotone",
    description: "Solid with a secondary tone layer.",
  },
  {
    weight: "Linear",
    slug: "linear",
    description: "Stroke-based outline (default).",
  },
  {
    weight: "Line Duotone",
    slug: "line-duotone",
    description: "Stroke-based with a secondary tone layer.",
  },
  { weight: "Outline", slug: "outline", description: "Lighter stroke outline." },
  {
    weight: "Broken",
    slug: "broken",
    description: "Outline with intentional gaps in the stroke.",
  },
];

const webAttributes: AttributeRow[] = [
  {
    attribute: "name",
    defaultValue: "Required",
    description: "Icon name (same naming rules as React component).",
  },
  {
    attribute: "weight",
    defaultValue: '"linear"',
    description: "Icon weight.",
  },
  {
    attribute: "size",
    defaultValue: '"24"',
    description: "Size in pixels.",
  },
  {
    attribute: "color",
    defaultValue: '"currentColor"',
    description: "Icon color.",
  },
  {
    attribute: "stroke-width",
    defaultValue: "None",
    description: "Stroke width override.",
  },
];

function DocsCodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  return (
    <div className="slice-card-tight overflow-hidden">
      <div className="bg-[var(--slice-code-header-bg)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--slice-code-header-fg)]">
        {language}
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-xs leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SoftTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="slice-card-tight overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">{children}</table>
      </div>
    </div>
  );
}

export default function HomeDocumentationPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="slice-eyebrow">Package documentation</p>
        <h1 className="font-display text-[clamp(2.25rem,5vw,3.25rem)] leading-none text-foreground">
          Icons
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          The Years icon library is available as{" "}
          <code className="slice-code-inline">@moreyears/icons</code>
          . It provides every icon in six weight variants, usable as React
          components or Web Components via CDN.
        </p>
      </header>

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_260px]">
        <article className="slice-prose space-y-10">
          <section id="getting-started" className="scroll-mt-24 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Getting started</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Install the package in your project:
            </p>
            <DocsCodeBlock
              language="bash"
              code={`npm install @moreyears/icons`}
            />
            <p className="text-sm leading-7 text-muted-foreground">
              Import the <code>Icon</code> component and use it in your JSX.
              Icons inherit <code>currentColor</code> by default.
            </p>
            <DocsCodeBlock
              language="jsx"
              code={`import { Icon } from '@moreyears/icons';

function Notification() {
  return (
    <div className="notification">
      <Icon name="mailbox" weight="bold" size={20} />
      <span>You have 3 new messages</span>
    </div>
  );
}`}
            />
          </section>

          <section id="react-component" className="scroll-mt-24 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">React component</h2>
            <h3 className="text-base font-semibold text-foreground">Basic usage</h3>
            <DocsCodeBlock
              language="jsx"
              code={`// Default weight (linear), size (24px), and color (currentColor)
<Icon name="mailbox" />

// Specify a weight and size
<Icon name="mailbox" weight="bold" size={32} />

// Set color explicitly
<Icon name="mailbox" weight="outline" color="#E5484D" />

// Adjust stroke width for linear or outline-like weights
<Icon name="mailbox" weight="linear" strokeWidth={1.5} />`}
            />

            <h3 className="pt-2 text-base font-semibold text-foreground">Props</h3>
            <SoftTable>
              <thead className="bg-[var(--slice-inset-bg)]">
                <tr className="text-left">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--years-purple-700)]">Prop</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--years-purple-700)]">Type</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--years-purple-700)]">Default</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--years-purple-700)]">Description</th>
                </tr>
              </thead>
              <tbody>
                {reactProps.map((row, i) => (
                  <tr
                    key={row.prop}
                    className={cn(
                      "align-top",
                      i % 2 === 1 && "bg-[var(--slice-inset-bg)]/60"
                    )}
                  >
                    <td className="px-4 py-3 text-foreground">
                      <code className="slice-code-inline">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.type}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.defaultValue}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </SoftTable>
            <p className="text-sm leading-7 text-muted-foreground">
              Any additional props (for example <code>onClick</code>,{" "}
              <code>aria-hidden</code>, and <code>data-*</code>) are passed
              through to the wrapper element.
            </p>

            <h3 className="pt-2 text-base font-semibold text-foreground">Naming</h3>
            <DocsCodeBlock
              language="jsx"
              code={`// By slug (most common)
<Icon name="mailbox" />

// By display name
<Icon name="Mailbox" />

// By full ID (category + slug)
<Icon name="messages-conversation/mailbox" />`}
            />
            <p className="text-sm leading-7 text-muted-foreground">
              If an icon cannot be found, the component renders nothing and logs
              a warning in development.
            </p>
          </section>

          <section id="weights" className="scroll-mt-24 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Weights</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Every icon supports up to six weight variants. Not all icons include
              every weight. If a requested weight is unavailable for a specific
              icon, the component returns <code>null</code>.
            </p>
            <SoftTable>
              <thead className="bg-[var(--slice-inset-bg)]">
                <tr className="text-left">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--years-purple-700)]">Weight</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--years-purple-700)]">Slug</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--years-purple-700)]">Description</th>
                </tr>
              </thead>
              <tbody>
                {weights.map((row, i) => (
                  <tr
                    key={row.slug}
                    className={cn(
                      "align-top",
                      i % 2 === 1 && "bg-[var(--slice-inset-bg)]/60"
                    )}
                  >
                    <td className="px-4 py-3 text-foreground">{row.weight}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <code className="slice-code-inline">{row.slug}</code>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </SoftTable>
            <p className="text-sm leading-7 text-muted-foreground">
              Use <strong>linear</strong> for most UI contexts. Use{" "}
              <strong>bold</strong> for emphasis. Use <strong>outline</strong> at
              larger sizes or for lighter visual weight.
            </p>
            <p className="text-sm leading-7 text-muted-foreground">
              <code>strokeWidth</code> only affects stroke-based weights (
              <code>linear</code>, <code>line-duotone</code>, <code>outline</code>,{" "}
              <code>broken</code>).
            </p>
          </section>

          <section id="cdn-web-component" className="scroll-mt-24 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              CDN / Web Component
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              For non-React projects, load the Web Component:
            </p>
            <DocsCodeBlock
              language="html"
              code={`<script src="https://cdn.jsdelivr.net/npm/@moreyears/icons/dist/web-component.js"></script>`}
            />
            <p className="text-sm leading-7 text-muted-foreground">
              Then use <code>{`<moreyears-icon>`}</code> anywhere in your HTML:
            </p>
            <DocsCodeBlock
              language="html"
              code={`<moreyears-icon name="mailbox" weight="bold" size="24" color="#333"></moreyears-icon>`}
            />
            <h3 className="pt-2 text-base font-semibold text-foreground">
              Attributes
            </h3>
            <SoftTable>
              <thead className="bg-[var(--slice-inset-bg)]">
                <tr className="text-left">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--years-purple-700)]">Attribute</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--years-purple-700)]">Default</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--years-purple-700)]">Description</th>
                </tr>
              </thead>
              <tbody>
                {webAttributes.map((row, i) => (
                  <tr
                    key={row.attribute}
                    className={cn(
                      "align-top",
                      i % 2 === 1 && "bg-[var(--slice-inset-bg)]/60"
                    )}
                  >
                    <td className="px-4 py-3 text-foreground">
                      <code className="slice-code-inline">{row.attribute}</code>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.defaultValue}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </SoftTable>
            <p className="text-sm leading-7 text-muted-foreground">
              Note: Web Component attributes use kebab-case (for example{" "}
              <code>stroke-width</code>) rather than camelCase (
              <code>strokeWidth</code>).
            </p>
            <DocsCodeBlock
              language="html"
              code={`<div class="feature-card">
  <moreyears-icon name="shield-check" weight="bold" size="32" color="#30A46C"></moreyears-icon>
  <h3>Secure checkout</h3>
  <p>All transactions are encrypted end to end.</p>
</div>`}
            />
          </section>

          <section id="helper-functions" className="scroll-mt-24 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Helper functions</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              The package exports utility functions for building icon tooling and
              search experiences.
            </p>
            <DocsCodeBlock
              language="jsx"
              code={`import {
  getAllIcons,
  getCategories,
  getIconsByCategory,
  getIconInfo,
  getIconSvg,
} from '@moreyears/icons';`}
            />
            <DocsCodeBlock
              language="jsx"
              code={`const icons = getAllIcons();
const categories = getCategories();
const byCategory = getIconsByCategory('messages-conversation');
const info = getIconInfo('mailbox');
const svg = getIconSvg('mailbox', 'bold');`}
            />
          </section>

          <section id="direct-svg-access" className="scroll-mt-24 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Direct SVG access
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Raw SVG files are available directly from the package:
            </p>
            <DocsCodeBlock
              language="path"
              code={`@moreyears/icons/svgs/{weight}/{category}/{icon-name}.svg`}
            />
            <DocsCodeBlock
              language="path"
              code={`@moreyears/icons/svgs/bold/messages-conversation/mailbox.svg
@moreyears/icons/svgs/linear/messages-conversation/mailbox.svg`}
            />
            <p className="text-sm leading-7 text-muted-foreground">
              You can also import the full manifest:
            </p>
            <DocsCodeBlock
              language="jsx"
              code={`import manifest from '@moreyears/icons/manifest';`}
            />
          </section>

          <section id="typescript" className="scroll-mt-24 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">TypeScript</h2>
            <p className="text-sm leading-7 text-muted-foreground">
              The package ships with full type definitions for component props and
              helper function signatures.
            </p>
            <DocsCodeBlock
              language="tsx"
              code={`import { Icon, type IconWeight, type IconEntry } from '@moreyears/icons';

const weight: IconWeight = 'bold';

<Icon name="mailbox" weight={weight} size={24} />`}
            />
            <DocsCodeBlock
              language="ts"
              code={`type IconWeight =
  | 'broken'
  | 'line-duotone'
  | 'linear'
  | 'outline'
  | 'bold'
  | 'bold-duotone';`}
            />
          </section>

          <section id="common-patterns" className="scroll-mt-24 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Common patterns
            </h2>
            <DocsCodeBlock
              language="jsx"
              code={`<button className="icon-button" aria-label="Send message">
  <Icon name="letter" weight="bold" size={18} />
</button>`}
            />
            <DocsCodeBlock
              language="jsx"
              code={`<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <Icon name="map-point" weight="bold" size={16} />
  <span>London, UK</span>
</div>`}
            />
            <DocsCodeBlock
              language="jsx"
              code={`function HoverIcon({ name, size = 24 }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon name={name} weight={hovered ? 'bold' : 'linear'} size={size} />
    </span>
  );
}`}
            />
            <DocsCodeBlock
              language="jsx"
              code={`<Icon name="heart" weight="bold" color="var(--color-primary)" size={20} />`}
            />
          </section>

          <section id="updating-library" className="scroll-mt-24 space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Updating the icon library
            </h2>
            <ol className="list-decimal space-y-2 pl-6 text-sm leading-7 text-muted-foreground">
              <li>Run the Icon Audit plugin to check naming issues.</li>
              <li>Run the Icon Merger plugin to organize variants.</li>
              <li>Run the Icon Exporter plugin to generate export JSON.</li>
              <li>Unpack the export into the <code>@moreyears/icons</code> repo.</li>
              <li>
                Run <code>npm run build</code>.
              </li>
              <li>Bump the version in package.json.</li>
              <li>
                Publish with <code>npm publish --access public</code>.
              </li>
            </ol>
            <p className="text-sm leading-7 text-muted-foreground">
              Consuming projects can then update with{" "}
              <code>npm update @moreyears/icons</code>.
            </p>
          </section>
        </article>

        <aside className="hidden xl:block">
          <div className="slice-card sticky top-20 p-5">
            <p className="slice-eyebrow mb-3">On this page</p>
            <nav className="space-y-0.5">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:bg-[var(--slice-inset-bg)] hover:text-foreground"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
