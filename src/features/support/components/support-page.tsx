"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTicketSchema, type CreateTicketInput } from "@/lib/validations/support";
import { formatRelativeTime } from "@/lib/utils";

interface Ticket {
  _id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline" | "success"> = {
  open: "default", in_progress: "warning" as "default", resolved: "success", closed: "secondary",
};

export function SupportPage({ tickets }: { tickets: Ticket[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: { priority: "medium" },
  });

  async function onSubmit(data: CreateTicketInput) {
    const res = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) { toast.error(body.error ?? "Failed to create ticket."); return; }
    toast.success("Ticket created successfully.");
    reset();
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Support</h1>
          <p className="mt-1 text-sm text-muted-foreground">Get help from our team 24/7.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
          New ticket
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {tickets.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground mb-4">No support tickets yet.</p>
              <Button onClick={() => setOpen(true)}>Open a ticket</Button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {tickets.map((t) => (
                <li key={t._id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">{t.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Updated {formatRelativeTime(t.updatedAt)} · Priority: <span className="capitalize">{t.priority}</span>
                    </p>
                  </div>
                  <Badge variant={statusVariant[t.status] ?? "outline"} className="capitalize shrink-0">
                    {t.status.replace("_", " ")}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Open a support ticket</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField label="Subject" htmlFor="subject" error={errors.subject?.message} required>
              <Input id="subject" placeholder="Briefly describe your issue" error={!!errors.subject} {...register("subject")} />
            </FormField>
            <FormField label="Priority" error={errors.priority?.message}>
              <Select defaultValue="medium" onValueChange={(v) => setValue("priority", v as CreateTicketInput["priority"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["low", "medium", "high"].map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Message" htmlFor="message" error={errors.message?.message} required>
              <Textarea id="message" placeholder="Describe your issue in detail..." className="min-h-[120px]" error={!!errors.message} {...register("message")} />
            </FormField>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1" loading={isSubmitting}>Submit ticket</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
