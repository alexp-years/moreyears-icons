import { PageHeader } from "@/components/docs/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomeDocumentationPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="Documentation"
        description="How to install and use @moreyears/icons in React, plus the local CDN sync workflow used by this project."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Install</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Install the package from npm:</p>
            <pre className="overflow-x-auto rounded-xl border border-border/70 bg-muted/30 p-4 text-xs text-foreground">
{`npm i @moreyears/icons`}
            </pre>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>React usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Use the React component exported from the root package:</p>
            <pre className="overflow-x-auto rounded-xl border border-border/70 bg-muted/30 p-4 text-xs text-foreground">
{`import { Icon } from "@moreyears/icons";

<Icon name="mailbox" />
<Icon name="mailbox" weight="bold" size={32} color="#333" />
<Icon name="mailbox" weight="linear" strokeWidth={1.5} />`}
            </pre>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Helpers and manifest</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Runtime helpers and manifest imports:</p>
            <pre className="overflow-x-auto rounded-xl border border-border/70 bg-muted/30 p-4 text-xs text-foreground">
{`import {
  getIconSvg,
  getIconInfo,
  getAllIcons,
  getIconsByCategory,
  getCategories,
} from "@moreyears/icons";

import manifest from "@moreyears/icons/manifest";`}
            </pre>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Available weights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><code>broken</code></p>
            <p><code>line-duotone</code></p>
            <p><code>linear</code></p>
            <p><code>outline</code></p>
            <p><code>bold</code></p>
            <p><code>bold-duotone</code></p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Local CDN sync for this project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            This docs app serves icons from <code>/icons/&lt;weight&gt;/&lt;id&gt;.svg</code>. Run the
            sync script after package updates:
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border/70 bg-muted/30 p-4 text-xs text-foreground">
{`npm i @moreyears/icons@latest
npm run icons:build
npm run dev`}
          </pre>
          <p>
            The sync command updates both <code>public/icons</code> and <code>packages/icons/dist</code>
            from the published npm package.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
