import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { AtomId } from "~/domain/value";
import type { Atom } from "~/domain/entity";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import AtomDialogContent from "~/components/AtomDialogContent";
import React from "react";
import type { CheckedState } from "@radix-ui/react-checkbox";

interface ColumnProps {
  onAtomDelete: (id: AtomId) => void;
  onAtomChange: (atom: Atom) => void;
  onAtomSelectChange: (id: AtomId, value: boolean) => void;
}

function columns({
  onAtomDelete,
  onAtomChange,
  onAtomSelectChange,
}: ColumnProps): ColumnDef<Atom>[] {
  return [
    {
      id: "select",
      header: ({ table }) => {
        const rows = table.getCoreRowModel().rows;

        const onCheckedChange = (value: CheckedState) => {
          table.toggleAllPageRowsSelected(!!value);
          rows.forEach((row) => {
            onAtomSelectChange(row.original.id, !!value);
          });
        };

        return (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={onCheckedChange}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => {
        const onSelect = (value: CheckedState) => {
          onAtomSelectChange(row.original.id, !!value);
          row.toggleSelected(!!value);
        };

        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={onSelect}
            aria-label="Select row"
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name: string = row.getValue("name");
        return <div className="font-medium">{name}</div>;
      },
    },
    {
      accessorKey: "mass",
      header: "Mass",
      cell: ({ row }) => {
        const mass: number = row.getValue("mass");
        // Format the mass to 2 decimal places
        return <div className="font-medium">{mass.toFixed(2)}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const id: AtomId = row.original.id;

        return (
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onAtomDelete(id)}>Delete</DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AtomDialogContent onSubmit={onAtomChange} existingAtom={row.original} />
          </Dialog>
        );
      },
    },
  ];
}

interface AtomTableProps extends ColumnProps {
  atoms: Atom[];
}

export default function AtomTable({
  atoms,
  onAtomDelete,
  onAtomChange,
  onAtomSelectChange,
}: AtomTableProps) {
  const cols = columns({ onAtomDelete, onAtomChange, onAtomSelectChange });

  return (
    <div>
      <DataTable columns={cols} data={atoms} />
    </div>
  );
}
