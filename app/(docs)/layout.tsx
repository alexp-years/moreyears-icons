import { Sidebar } from "@/components/docs/Sidebar";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <div className="grid min-h-screen md:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="px-6 py-8 md:px-10 lg:px-12">
          <main className="mx-auto flex w-full max-w-5xl flex-col gap-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
