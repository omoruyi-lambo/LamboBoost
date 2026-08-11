import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { Service, Wallet } from "@/lib/db/models";
import { CreateOrderForm } from "@/features/orders/components/create-order-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "New Order" };

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ serviceId?: string }>;
}) {
  const { serviceId } = await searchParams;
  if (!serviceId) notFound();

  const session = await auth();
  await connectDB();

  const [service, wallet] = await Promise.all([
    Service.findById(serviceId).lean(),
    Wallet.findOne({ userId: session!.user.id }).lean(),
  ]);

  if (!service || !service.isActive) notFound();

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link href="/services"><FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" /></Link>
        </Button>
        <h1 className="font-display text-xl font-bold text-navy-900">Place Order</h1>
      </div>
      <CreateOrderForm
        service={JSON.parse(JSON.stringify(service))}
        walletBalance={wallet?.balance ?? 0}
      />
    </div>
  );
}
