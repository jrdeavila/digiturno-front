import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
  className = "container mx-auto max-w-7xl px-6 flex-grow pt-16",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative flex flex-col h-screen  bg-blue-500">
      <Navbar />
      <main className={className}>
        {children}
      </main>
    </div>
  );
}
