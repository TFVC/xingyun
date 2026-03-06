import { UpdatesPageClient } from "@/components/UpdatesPageClient";
import { getUpdates } from "@/lib/dataLoader";

export const dynamic = 'force-dynamic';

export default function UpdatesPage() {
  const updates = getUpdates();

  return <UpdatesPageClient updates={updates} />;
}
