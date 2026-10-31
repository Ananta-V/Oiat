import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OiAI Admin Studio — Feedback & Management",
  description: "Administrative portal for customer feedback, ratings, and subscribers.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

