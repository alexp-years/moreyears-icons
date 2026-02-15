import { Sidebar } from "@/components/docs/Sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 items-center border-b border-border/70 bg-background/92 px-4 backdrop-blur md:hidden">
            <SidebarTrigger />
            <p className="ml-2 font-display text-lg text-primary">MoreYears CDN</p>
          </header>
          <div className="px-6 py-8 md:px-12 md:py-10 lg:px-16 lg:py-12">
            <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-11">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
