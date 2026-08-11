"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createOrderSchema, type CreateOrderInput } from "@/lib/validations/order";
import { formatCurrency } from "@/lib/utils";

interface Service {
  _id: string;
  name: string;
  description: string;
  pricePerUnit: number;
  minQuantity: number;
  maxQuantity: number;
  estimatedDeliveryHours: number;
}

export function CreateOrderForm({ service, walletBalance }: { service: Service; walletBalance: number }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: { serviceId: service._id, quantity: service.minQuantity },
  });

  const quantity = watch("quantity") || 0;
  const charge = (quantity / 1000) * service.pricePerUnit;
  const canAfford = walletBalance >= charge;

  async function onSubmit(data: CreateOrderInput) {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) {
      toast.error(body.error ?? "Failed to place order.");
      return;
    }
    toast.success("Order placed successfully!");
    router.push("/dashboard/orders");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register("serviceId")} />

      <Card>
        <CardHeader>
          <CardTitle>Service details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="font-medium text-foreground">{service.name}</p>
          <p className="text-sm text-muted-foreground">{service.description}</p>
          <div className="flex gap-4 pt-2 text-sm">
            <span className="text-muted-foreground">
              Rate: <strong className="text-foreground">{formatCurrency(service.pricePerUnit * 1000)} per 1,000</strong>
            </span>
            <span className="text-muted-foreground">
              Min: <strong className="text-foreground">{service.minQuantity.toLocaleString()}</strong>
            </span>
            <span className="text-muted-foreground">
              Max: <strong className="text-foreground">{service.maxQuantity.toLocaleString()}</strong>
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Link" htmlFor="link" error={errors.link?.message} required
            hint="Paste the full URL of the post, profile or video.">
            <Input id="link" type="url" placeholder="https://..." error={!!errors.link} {...register("link")} />
          </FormField>

          <FormField label="Quantity" htmlFor="quantity" error={errors.quantity?.message} required>
            <Input
              id="quantity"
              type="number"
              min={service.minQuantity}
              max={service.maxQuantity}
              error={!!errors.quantity}
              {...register("quantity", { valueAsNumber: true })}
            />
          </FormField>

          <FormField label="Coupon code" htmlFor="coupon" error={errors.couponCode?.message}>
            <Input id="coupon" placeholder="Optional" {...register("couponCode")} />
          </FormField>

          <FormField label="Notes" htmlFor="notes" error={errors.notes?.message}>
            <Textarea id="notes" placeholder="Any special instructions (optional)" {...register("notes")} />
          </FormField>
        </CardContent>
      </Card>

      {/* Order summary */}
      <Card className={!canAfford ? "border-destructive" : ""}>
        <CardContent className="p-6">
          <p className="font-semibold text-foreground mb-4">Order summary</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity</span>
              <span>{quantity.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate per 1,000</span>
              <span>{formatCurrency(service.pricePerUnit * 1000)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total charge</span>
              <span className="text-primary">{formatCurrency(charge)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Wallet balance</span>
              <span className={canAfford ? "text-emerald-600" : "text-destructive"}>
                {formatCurrency(walletBalance)}
              </span>
            </div>
          </div>
          {!canAfford && (
            <p className="mt-3 text-xs text-destructive">
              Insufficient balance. Please fund your wallet before placing this order.
            </p>
          )}
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={!canAfford} loading={isSubmitting} size="lg">
        Place order — {formatCurrency(charge)}
      </Button>
    </form>
  );
}
