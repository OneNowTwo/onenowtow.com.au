import type { Metadata } from "next";
import { UploadFlow } from "@/components/upload/UploadFlow";
import { searchHostels } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Upload a Looksee",
  description:
    "Share a short, unfiltered hostel walkthrough so other travellers can see the truth.",
};

export default async function UploadPage() {
  const initialHostels = await searchHostels("");

  return <UploadFlow initialHostels={initialHostels.slice(0, 12)} />;
}
