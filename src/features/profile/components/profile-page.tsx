"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations/profile";
import { getInitials, formatDate } from "@/lib/utils";

interface Props {
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
  };
}

export function ProfilePage({ user }: Props) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user.name, image: user.image ?? "" },
  });

  async function onSubmit(data: UpdateProfileInput) {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) { toast.error(body.error ?? "Failed to update profile."); return; }
    toast.success("Profile updated.");
    router.refresh();
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account information.</p>
      </div>

      {/* Avatar + info */}
      <Card>
        <CardContent className="p-6 flex items-center gap-5">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-blue-50 text-blue-700 text-xl font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-navy-900 text-lg">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="capitalize text-xs">{user.role}</Badge>
              {user.isEmailVerified
                ? <Badge variant="success" className="text-xs">Verified</Badge>
                : <Badge variant="warning" className="text-xs">Unverified</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit form */}
      <Card>
        <CardHeader><CardTitle>Personal information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Full name" htmlFor="name" error={errors.name?.message} required>
              <Input id="name" error={!!errors.name} {...register("name")} />
            </FormField>
            <FormField label="Email" htmlFor="email">
              <Input id="email" value={user.email} disabled className="bg-muted" />
            </FormField>
            <FormField label="Profile image URL" htmlFor="image" error={errors.image?.message} hint="Must be a valid HTTPS URL">
              <Input id="image" type="url" placeholder="https://..." {...register("image")} />
            </FormField>
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">Member since {formatDate(user.createdAt)}</p>
              <Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
