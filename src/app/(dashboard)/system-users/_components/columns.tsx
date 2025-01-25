"use client";

import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { users } from "@/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { UserCellAction } from "./cell-action";

export type UserColumn = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  password: string | null;
  role: typeof users.$inferSelect.role;
};

export const UsersColumns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="الاسم" />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="البريد الإلكتروني" />
    ),
  },

  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="الصلاحيات" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <UserCellAction data={row.original} />,
  },
];
