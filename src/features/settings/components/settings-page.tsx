"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validations/auth";

interface Props {
  user: { name?: string | null; email?: string | null; id: string };
}

export function SettingsPage({ user }: Props) {
  const router = useRouter();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  async function onChangePassword(data: ChangePasswordInput) {
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) { toast.error(body.error ?? "Failed to change password."); return; }
    toast.success("Password changed successfully.");
    reset();
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account preferences.</p>
      </div>

      {/* Account info */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{user.name}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-mono text-xs text-muted-foreground">{user.id}</span>
          </div>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
            <FormField label="Current password" htmlFor="cur" error={errors.currentPassword?.message} required>
              <Input id="cur" type="password" autoComplete="current-password" error={!!errors.currentPassword} {...register("currentPassword")} />
            </FormField>
            <FormField label="New password" htmlFor="new" error={errors.newPassword?.message} required>
              <Input id="new" type="password" autoComplete="new-password" error={!!errors.newPassword} {...register("newPassword")} />
            </FormField>
            <FormField label="Confirm new password" htmlFor="conf" error={errors.confirmNewPassword?.message} required>
              <Input id="conf" type="password" autoComplete="new-password" error={!!errors.confirmNewPassword} {...register("confirmNewPassword")} />
            </FormField>
            <Button type="submit" loading={isSubmitting}>Update password</Button>
          </form>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what you want to be notified about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Email notifications", hint: "Receive emails for important account activity", value: emailNotifs, onChange: setEmailNotifs },
            { label: "Order updates", hint: "Get notified when your order status changes", value: orderUpdates, onChange: setOrderUpdates },
          ].map(({ label, hint, value, onChange }) => (
            <div key={label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
              <Switch checked={value} onCheckedChange={onChange} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Irreversible account actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account and all data.</p>
            </div>
            <Button variant="destructive" size="sm" disabled>Delete account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
