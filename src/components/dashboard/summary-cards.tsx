import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, ArrowLeftRight, TrendingUp } from "lucide-react";

interface SummaryCardsProps {
  totalItems: number;
  lowStockCount: number;
  totalTransactions: number;
}

const cards = [
  {
    title: "Total Items",
    icon: Package,
    key: "totalItems" as const,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Low Stock Items",
    icon: AlertTriangle,
    key: "lowStockCount" as const,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Total Transactions",
    icon: ArrowLeftRight,
    key: "totalTransactions" as const,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

export function SummaryCards({ totalItems, lowStockCount, totalTransactions }: SummaryCardsProps) {
  const values = { totalItems, lowStockCount, totalTransactions };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${card.bg}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{values[card.key]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
