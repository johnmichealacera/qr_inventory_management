"use client";

import { format } from "date-fns";
import {
  CONSUMABLE_REQUEST_STATUS_LABELS,
  PERSON_TYPE_LABELS,
  type ConsumableRequestStatusName,
  type PersonTypeName,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

type PurchaseRequest = {
  id: string;
  requestNumber: string;
  quantity: number;
  notes: string | null;
  customItemName: string | null;
  customDescription: string | null;
  status: string;
  reviewNotes: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  item: { name: string } | null;
  user: { name: string };
  borrower: {
    fullName: string;
    idNumber: string;
    personType: string;
    department: string;
    officeUnit: string | null;
    contactPhone: string | null;
  };
  reviewedBy: { name: string } | null;
};

function itemDescription(request: PurchaseRequest) {
  if (request.item) return request.item.name;
  return request.customItemName ?? "—";
}

export function PurchaseRequestPrint({ request }: { request: PurchaseRequest }) {
  const statusLabel =
    CONSUMABLE_REQUEST_STATUS_LABELS[request.status as ConsumableRequestStatusName] ??
    request.status;
  const personLabel =
    PERSON_TYPE_LABELS[request.borrower.personType as PersonTypeName] ??
    request.borrower.personType;

  return (
    <div className="mx-auto max-w-[210mm] p-8 print:p-6">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Button onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" />
          Print purchase request
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>

      <article className="space-y-6 border border-black/20 p-8 print:border-black print:p-6">
        <header className="border-b border-black pb-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-black/70">
            General Supplies Office
          </p>
          <h1 className="mt-1 text-xl font-bold uppercase tracking-wide">
            Purchase Request Form
          </h1>
          <p className="mt-2 text-sm font-medium">{request.requestNumber}</p>
        </header>

        <section className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase text-black/60">Date requested</p>
            <p className="mt-0.5 font-medium">
              {format(new Date(request.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-black/60">Status</p>
            <p className="mt-0.5 font-medium">{statusLabel}</p>
          </div>
        </section>

        <section className="rounded border border-black/30 p-4 text-sm">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wide">Requester</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <dt className="text-black/60">Name</dt>
              <dd className="font-medium">{request.borrower.fullName}</dd>
            </div>
            <div>
              <dt className="text-black/60">ID number</dt>
              <dd className="font-medium">{request.borrower.idNumber}</dd>
            </div>
            <div>
              <dt className="text-black/60">Type</dt>
              <dd className="font-medium">{personLabel}</dd>
            </div>
            <div>
              <dt className="text-black/60">Department</dt>
              <dd className="font-medium">{request.borrower.department}</dd>
            </div>
            {request.borrower.officeUnit && (
              <div>
                <dt className="text-black/60">Office / unit</dt>
                <dd className="font-medium">{request.borrower.officeUnit}</dd>
              </div>
            )}
            {request.borrower.contactPhone && (
              <div>
                <dt className="text-black/60">Contact</dt>
                <dd className="font-medium">{request.borrower.contactPhone}</dd>
              </div>
            )}
          </dl>
        </section>

        <section>
          <table className="w-full border-collapse border border-black text-sm">
            <thead>
              <tr className="bg-black/5">
                <th className="border border-black px-3 py-2 text-left font-semibold">
                  Item / description
                </th>
                <th className="w-24 border border-black px-3 py-2 text-center font-semibold">
                  Qty
                </th>
                <th className="w-28 border border-black px-3 py-2 text-left font-semibold">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black px-3 py-3 align-top">
                  <p className="font-medium">{itemDescription(request)}</p>
                  {request.customDescription && (
                    <p className="mt-1 text-black/70">{request.customDescription}</p>
                  )}
                  {!request.item && (
                    <p className="mt-1 text-xs uppercase text-black/50">Off-catalog item</p>
                  )}
                </td>
                <td className="border border-black px-3 py-3 text-center align-top font-medium">
                  {request.quantity}
                </td>
                <td className="border border-black px-3 py-3 align-top text-black/80">
                  {request.notes ?? "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {request.reviewNotes && (
          <section className="text-sm">
            <p className="text-xs font-semibold uppercase text-black/60">GSO remarks</p>
            <p className="mt-1 rounded border border-black/20 bg-black/5 p-3">
              {request.reviewNotes}
            </p>
            {request.reviewedBy && request.reviewedAt && (
              <p className="mt-2 text-xs text-black/60">
                — {request.reviewedBy.name},{" "}
                {format(new Date(request.reviewedAt), "MMM d, yyyy")}
              </p>
            )}
          </section>
        )}

        <section className="grid grid-cols-3 gap-6 pt-8 text-sm">
          <div className="text-center">
            <div className="mb-12 border-b border-black" />
            <p className="font-medium">{request.borrower.fullName}</p>
            <p className="text-xs text-black/60">Requested by</p>
          </div>
          <div className="text-center">
            <div className="mb-12 border-b border-black" />
            <p className="font-medium">GSO Officer</p>
            <p className="text-xs text-black/60">Processed by</p>
          </div>
          <div className="text-center">
            <div className="mb-12 border-b border-black" />
            <p className="font-medium">Authorized signatory</p>
            <p className="text-xs text-black/60">Approved by</p>
          </div>
        </section>

        <footer className="border-t border-black/20 pt-4 text-center text-[10px] text-black/50">
          QR Inventory Management System · General Supplies Office ·{" "}
          {format(new Date(), "yyyy")}
        </footer>
      </article>
    </div>
  );
}
