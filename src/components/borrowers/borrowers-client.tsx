"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBorrowerSchema, type CreateBorrowerInput } from "@/lib/validations";
import {
  createBorrower,
  updateBorrower,
  // deleteBorrower,
} from "@/server/borrowers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, /* Trash2, */ Loader2, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { PERSON_TYPE_LABELS, PERSON_TYPES } from "@/lib/constants";
import type { PersonTypeName } from "@/lib/constants";

interface Borrower {
  id: string;
  fullName: string;
  studentId: string;
  personType: string;
  department: string;
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
                Register requester
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register requester</DialogTitle>
              <DialogDescription>
                Students, staff, or faculty — used for borrow and consumable release tracking
              </DialogDescription>
            </DialogHeader>
            <BorrowerForm
              onSubmit={async (data) => {
                await createBorrower(data);
                toast.success("Requester registered");
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
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No requesters registered yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">ID number</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">Department</th>
                <th className="p-3 font-medium">Program / section</th>
                <th className="p-3 font-medium">Contact</th>
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {initialBorrowers.map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{b.fullName}</td>
                  <td className="p-3 text-muted-foreground">{b.studentId}</td>
                  <td className="p-3 text-muted-foreground">
                    {PERSON_TYPE_LABELS[b.personType as PersonTypeName] ?? b.personType}
                  </td>
                  <td className="p-3 text-muted-foreground">{b.department}</td>
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
                            <DialogTitle>Edit requester</DialogTitle>
                            <DialogDescription>Update requester information</DialogDescription>
                          </DialogHeader>
                          <BorrowerForm
                            defaultValues={{
                              fullName: b.fullName,
                              studentId: b.studentId,
                              personType: b.personType as CreateBorrowerInput["personType"],
                              department: b.department,
                              programSection: b.programSection ?? "",
                              contactPhone: b.contactPhone ?? "",
                            }}
                            submitLabel="Save"
                            onSubmit={async (data) => {
                              await updateBorrower(b.id, data);
                              toast.success("Requester updated");
                              setEditing(null);
                              router.refresh();
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      {/* Panel feedback: delete button hidden — revisit later if activation is needed */}
                      {/* {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={async () => {
                            if (!confirm(`Remove "${b.fullName}" from the registry?`)) return;
                            try {
                              await deleteBorrower(b.id);
                              toast.success("Requester removed");
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
                      )} */}
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
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateBorrowerInput>({
    resolver: zodResolver(createBorrowerSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      studentId: defaultValues?.studentId ?? "",
      personType: defaultValues?.personType ?? PERSON_TYPES.STUDENT,
      department: defaultValues?.department ?? "",
      programSection: defaultValues?.programSection ?? "",
      contactPhone: defaultValues?.contactPhone ?? "",
    },
  });

  const personType = watch("personType");

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
        <Label htmlFor="personType">Person type</Label>
        <Select
          value={personType}
          onValueChange={(val) =>
            val && setValue("personType", val as CreateBorrowerInput["personType"])
          }
        >
          <SelectTrigger id="personType">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PERSON_TYPES.STUDENT}>
              {PERSON_TYPE_LABELS.STUDENT}
            </SelectItem>
            <SelectItem value={PERSON_TYPES.STAFF}>{PERSON_TYPE_LABELS.STAFF}</SelectItem>
            <SelectItem value={PERSON_TYPES.FACULTY}>
              {PERSON_TYPE_LABELS.FACULTY}
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.personType && (
          <p className="text-xs text-destructive">{errors.personType.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="studentId">ID number</Label>
        <Input
          id="studentId"
          placeholder={
            personType === PERSON_TYPES.STUDENT ? "2024-00001" : "EMP-00123"
          }
          {...register("studentId")}
        />
        {errors.studentId && (
          <p className="text-xs text-destructive">{errors.studentId.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          placeholder="College of Criminology"
          {...register("department")}
        />
        {errors.department && (
          <p className="text-xs text-destructive">{errors.department.message}</p>
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
