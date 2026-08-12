"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type UserRole = "user" | "admin" | "superadmin";

interface UserActionsProps {
  userId: string;
  role: UserRole;
  isActive: boolean;
  viewerId: string;
  viewerRole: UserRole;
}

export function UserActions({
  userId,
  role,
  isActive,
  viewerId,
  viewerRole,
}: UserActionsProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>(role);
  const [currentActive, setCurrentActive] = useState(isActive);
  const [saving, setSaving] = useState(false);

  const isSelf = userId === viewerId;
  const isSuperadminViewer = viewerRole === "superadmin";
  const targetIsSuperadmin = currentRole === "superadmin";
  // Admins can manage user/admin accounts; only superadmins can touch superadmins.
  const canManage = !isSelf && (isSuperadminViewer || !targetIsSuperadmin);

  async function save(patch: { role?: UserRole; isActive?: boolean }) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error ?? "Failed to update user.");
        // Revert local state on failure
        setCurrentRole(role);
        setCurrentActive(isActive);
        return;
      }
      toast.success("User updated.");
    } catch {
      toast.error("Failed to update user.");
      setCurrentRole(role);
      setCurrentActive(isActive);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Select
        value={currentRole}
        disabled={saving || !canManage}
        onValueChange={(value) => {
          setCurrentRole(value as UserRole);
          void save({ role: value as UserRole });
        }}
      >
        <SelectTrigger className="h-8 w-[130px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">user</SelectItem>
          <SelectItem value="admin">admin</SelectItem>
          {isSuperadminViewer && <SelectItem value="superadmin">superadmin</SelectItem>}
        </SelectContent>
      </Select>

      <Switch
        checked={currentActive}
        disabled={saving || !canManage}
        onCheckedChange={(checked) => {
          setCurrentActive(checked);
          void save({ isActive: checked });
        }}
        aria-label={currentActive ? "Suspend user" : "Activate user"}
      />
    </div>
  );
}
