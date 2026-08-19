"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2, Trash } from "lucide-react";
import { useDeleteMany } from "@refinedev/core";

type Props = {
  table: any;
  resource: string;
};

export const DeleteSelectedButton: React.FC<Props> = ({ table, resource }) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const selected = table?.reactTable?.getSelectedRowModel?.()?.flatRows ?? [];
  const ids = selected.map((r: any) => r.original?.id).filter(Boolean);

  const isDisabled = ids.length === 0 || loading;

  const { mutateAsync: deleteMany } = useDeleteMany();

  const handleConfirm = async () => {
    if (!ids.length) return;
    setLoading(true);
    try {
      await deleteMany({
        resource, // e.g. "users"
        ids, // array of ids
      });

      try {
        await table?.refineCore?.tableQuery?.refetch?.();
      } catch {
        try {
          await table?.refineCore?.refetch?.();
        } catch {}
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span>
          <Button variant="destructive" size="sm" disabled={isDisabled}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </span>
      </PopoverTrigger>

      <PopoverContent className="w-auto" align="start">
        <div className="flex flex-col gap-2">
          <p className="text-sm">
            Delete selected items? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={loading}
              onClick={handleConfirm}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteSelectedButton;
