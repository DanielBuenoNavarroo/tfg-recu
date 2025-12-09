"use client";

import ColumnHeader from "@/components/admin/ColumnHeader";
import ConfirmAlert from "@/components/admin/ConfirmAlert";
import DataTable from "@/components/admin/DataTable";
import EditUserSheet, {
  UpdateUserFormType,
} from "@/components/admin/sheets/EditUserSheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, getInitials } from "@/lib/utils";
import { User } from "@/types/index";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AddUserSheet, {
  AddUserFormType,
} from "@/components/admin/sheets/AddUserSheet";

type AlertType = "delete";

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>();
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [openAddUserSheet, setOpenAddUserSheet] = useState(false);
  const [openEditUserSheet, setOpenEditUserSheet] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/v1/users");
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "avatar",
        header: ({ column }) => (
          <ColumnHeader column={column} title={"Avatar"} />
        ),
        enableSorting: false,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <Avatar>
              <AvatarFallback>
                {getInitials(user.fullName || "IN")}
              </AvatarFallback>
            </Avatar>
          );
        },
      },
      {
        header: ({ column }) => (
          <ColumnHeader column={column} title={"Full Name"} />
        ),
        accessorKey: "fullName",
      },
      {
        header: ({ column }) => (
          <ColumnHeader column={column} title={"Email"} />
        ),
        accessorKey: "email",
      },
      {
        id: "role",
        header: ({ column }) => <ColumnHeader column={column} title="Role" />,
        accessorKey: "role",
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div>
              {user.role === "ADMIN"
                ? "Admin"
                : user.role === "AUTHOR"
                ? "Author"
                : "Default"}
            </div>
          );
        },
      },
      {
        id: "status",
        header: ({ column }) => <ColumnHeader column={column} title="Status" />,
        accessorKey: "status",
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div
              className={cn(
                "inline-block px-2 py-0.5 rounded-md",
                user.status === "BLOCKED"
                  ? "bg-orange-100 text-orange-700"
                  : user.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-200 text-black"
              )}
            >
              {user.status === "BLOCKED"
                ? "Blocked"
                : user.status === "APPROVED"
                ? "Approved"
                : "Pending"}
            </div>
          );
        },
      },

      {
        id: "actions",
        header: ({ column }) => (
          <ColumnHeader column={column} title={"Actions"} />
        ),
        enableSorting: false,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(user);
                    setOpenEditUserSheet(true);
                  }}
                >
                  <Edit />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => presentAlert(user, "delete")}>
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const presentAlert = (user: User, type: AlertType) => {
    setOpenAlert(true);
    setSelectedUser(user);
    setAlertType(type);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`/api/v1/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
      toast.success("User deleted succesfully");
      setSelectedUser(undefined);
    } catch (e) {
      toast.error("Failed to delete user");
      console.error(e);
    }
  };

  const handleUpdateUser = async ({
    name: fullName,
    email,
    status,
    role,
  }: UpdateUserFormType) => {
    if (!selectedUser) return false;
    try {
      const res = await fetch(`/api/v1/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          status,
          role,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data: User = await res.json();

      setUsers((prev) =>
        prev.map((user) => (user.id === selectedUser.id ? data : user))
      );
      toast.success("User updated succesfully");
      setSelectedUser(undefined);
      return true;
    } catch (e) {
      toast.error("Failed to update user");
      console.error(e);
      return false;
    }
  };

  const handleAddUser = async ({
    name: fullName,
    email,
    password,
    status,
    role,
  }: AddUserFormType) => {
    try {
      const res = await fetch(`/api/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          status,
          role,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data: User = await res.json();
      setUsers((prev) => [...prev, data]);
      toast.success("User added succesfully");

      return true;
    } catch (e) {
      toast.error("Failed to add user");
      console.error(e);
      return false;
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="w-full rounded-2xl bg-slate-900/40 p-7">
        <div className="flex justify-between mb-5 items-end">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="font-medium text-sm text-slate-500">
              Users accounts management
            </p>
          </div>
          <Button
            onClick={() => {
              setOpenAddUserSheet(true);
            }}
          >
            Create New
          </Button>
        </div>

        <DataTable data={users} columns={columns} />

        <ConfirmAlert
          title={`Confirm ${alertType}`}
          message={`Are you sure you want to ${alertType}?`}
          open={openAlert}
          onOpenChange={setOpenAlert}
          onConfrim={alertType === "delete" ? handleDelete : () => {}}
        />

        <AddUserSheet
          open={openAddUserSheet}
          onOpenChange={setOpenAddUserSheet}
          handleAddUser={handleAddUser}
        />

        {selectedUser && openEditUserSheet && (
          <EditUserSheet
            open={openEditUserSheet}
            onOpenChange={(openState) => {
              setOpenEditUserSheet(openState);
              setSelectedUser(undefined);
            }}
            handleUpdateUser={handleUpdateUser}
            selected={selectedUser}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
