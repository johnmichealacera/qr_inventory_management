"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBorrowerSchema, type CreateBorrowerInput } from "@/lib/validations";
import {
  createBorrower,
  updateBorrower,
  deleteBorrower,
} from "@/server/borrowers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, GraduationCap } from "lucide-react";
import { useSession } from "next-auth/react";

interface Borrower {
  id: string;
  fullName: string;
  studentId: string;
  programSection: string | null;
  contactPhone: string | null;
}

export function BorrowersClient({ initialBorrowers }: { initialBorrowers: Borrower[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Borrower | null>(null);
  const isAdmin = session?.user?.role === "Admin";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Register borrower
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register student / borrower</DialogTitle>
              <DialogDescription>
                College of Criminology — for issuance and return tracking
              </DialogDescription>
            </DialogHeader>
            <BorrowerForm
              onSubmit={async (data) => {
                await createBorrower(data);
                toast.success("Borrower registered");
                setIsCreateOpen(false);
                router.refresh();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {initialBorrowers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No borrowers registered yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Student ID</th>
                <th className="p-3 font-medium">Program / Section</th>
                <th className="p-3 font-medium">Contact</th>
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialBorrowers.map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{b.fullName}</td>
                  <td className="p-3 text-muted-foreground">{b.studentId}</td>
                  <td className="p-3 text-muted-foreground">{b.programSection ?? "—"}</td>
                  <td className="p-3 text-muted-foreground">{b.contactPhone ?? "—"}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Dialog
                        open={editing?.id === b.id}
                        onOpenChange={(open) => !open && setEditing(null)}
                      >
                        <DialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditing(b)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                          }
                        />
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit borrower</DialogTitle>
                            <DialogDescription>Update student information</DialogDescription>
                          </DialogHeader>
                          <BorrowerForm
                            defaultValues={{
                              fullName: b.fullName,
                              studentId: b.studentId,
                              programSection: b.programSection ?? "",
                              contactPhone: b.contactPhone ?? "",
                            }}
                            submitLabel="Save"
                            onSubmit={async (data) => {
                              await updateBorrower(b.id, data);
                              toast.success("Borrower updated");
                              setEditing(null);
                              router.refresh();
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={async () => {
                            if (!confirm(`Remove "${b.fullName}" from the registry?`)) return;
                            try {
                              await deleteBorrower(b.id);
                              toast.success("Borrower removed");
                              router.refresh();
                            } catch (error) {
                              toast.error(
                                error instanceof Error ? error.message : "Failed to delete"
                              );
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BorrowerForm({
  defaultValues,
  submitLabel = "Register",
  onSubmit,
}: {
  defaultValues?: Partial<CreateBorrowerInput>;
  submitLabel?: string;
  onSubmit: (data: CreateBorrowerInput) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateBorrowerInput>({
    resolver: zodResolver(createBorrowerSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      studentId: defaultValues?.studentId ?? "",
      programSection: defaultValues?.programSection ?? "",
      contactPhone: defaultValues?.contactPhone ?? "",
    },
  });

  async function onFormSubmit(data: CreateBorrowerInput) {
    try {
      await onSubmit(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" placeholder="Juan Dela Cruz" {...register("fullName")} />
        {errors.fullName && (
          <p className="text-xs text-destructive">{errors.fullName.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="studentId">Student ID</Label>
        <Input id="studentId" placeholder="2024-00001" {...register("studentId")} />
        {errors.studentId && (
          <p className="text-xs text-destructive">{errors.studentId.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="programSection">Program / section (optional)</Label>
        <Input
          id="programSection"
          placeholder="BS Criminology - Section A"
          {...register("programSection")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactPhone">Contact phone (optional)</Label>
        <Input id="contactPhone" placeholder="09xx xxx xxxx" {...register("contactPhone")} />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
