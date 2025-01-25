"use client";

import { deleteProject } from "@/actions/project";
import ErrorToast from "@/components/error-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserColumn } from "./columns";
import { updateProjectTransactionStatus } from "@/actions/financial-transaction";
import {
  projectTransactionsCategories,
  statusArray,
  userRolesArray,
} from "@/lib/translate";
import { projectsTransactions, users } from "@/db/schema";
import { useViewData, ViewDataStructure } from "@/hooks/use-view-data";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { status } from "@/lib/translate";
import { deleteUser, updateUserPermission } from "@/actions/user";

interface UserActionProps {
  data: UserColumn;
}

export function UserCellAction({ data }: UserActionProps) {
  const onPermissionChange = async (
    id: string,
    role: typeof users.$inferSelect.role
  ) => {
    const promis = updateUserPermission(id, role);
    toast.promise(promis, {
      loading: "جاري تحديث الصلاحية",
      success: "تم التحديث بنجاح",
      error: (error: Error) => {
        return <ErrorToast message={error.message} />;
      },
    });
  };

  const onDelete = async () => {
    const promise = deleteUser(data.id);
    toast.promise(promise, {
      loading: "جاري حذف المستخدم",
      success: "تم حذف الحركة المستخدم",
      error: (error: Error) => {
        return <ErrorToast message={error.message} />;
      },
    });
  };

  return (
    <div className="w-fit mr-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <span className="sr-only">Open menu</span>
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>الخيارات</DropdownMenuLabel>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>الصلاحية</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup>
                {userRolesArray.map((role) => (
                  <DropdownMenuRadioItem
                    onClick={() => onPermissionChange(data.id, role.value)}
                    key={role.value}
                    value={role.value || ""}
                  >
                    {role.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <AlertModal onConfirm={onDelete}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-gray-700   flex justify-start h-8 p-0 pr-3"
              >
                حذف
              </Button>
            </AlertModal>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
