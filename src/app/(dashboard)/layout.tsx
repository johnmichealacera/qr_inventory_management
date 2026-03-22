import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="container mx-auto max-w-7xl p-6 pt-20 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
