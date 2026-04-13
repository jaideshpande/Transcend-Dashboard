"use client";

import { useEffect, useState } from "react";
import type { Customer } from "@/lib/customer-data";
import { expenses } from "@/lib/customer-data";
import {
  X,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

type CostBasis = "lifetime" | "recent" | "monthly";

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

const pipelineStatusConfig = {
  none: { label: "No Active Pipeline", color: "bg-slate-500" },
  early: { label: "Early Stage", color: "bg-amber-500" },
  negotiating: { label: "Negotiating", color: "bg-violet-500" },
  closing: { label: "Closing Soon", color: "bg-emerald-500" },
};

export function CustomerDetailModal({ customer, onClose }: CustomerDetailModalProps) {
  const [costBasis, setCostBasis] = useState<CostBasis>("lifetime");
  const [headcountOpen, setHeadcountOpen] = useState(false);

  useEffect(() => {
    setCostBasis("lifetime");
    setHeadcountOpen(false);
  }, [customer.id]);

  const profit = customer.monthlyRevenue - customer.monthlyCosts;
  const profitMargin = ((profit / customer.monthlyRevenue) * 100).toFixed(1);
  const customerExpenses = expenses.filter((e) => e.customerId === customer.id);
  const totalCustomerExpenses = customerExpenses.reduce((sum, e) => sum + e.amount, 0);

  const costDisplay =
    costBasis === "lifetime"
      ? customer.cumulativeCostsSinceInception
      : costBasis === "recent"
        ? customer.mostRecentProjectCost
        : customer.monthlyCosts;

  const costCaption =
    costBasis === "lifetime"
      ? "Cumulative delivery cost since this customer relationship began."
      : costBasis === "recent"
        ? "Attributed to the most recently completed project phase."
        : "Average monthly run rate (mock).";

  const usPct = customer.headcount > 0 ? Math.round((customer.headcountUS / customer.headcount) * 100) : 0;
  const inPct = customer.headcount > 0 ? Math.round((customer.headcountIndia / customer.headcount) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a87] p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{customer.name}</h2>
              <p className="text-blue-200 mt-1">
                {customer.sector}
                <span className="text-white/50 mx-2">·</span>
                <span className="text-blue-100/90">{customer.industry}</span>
              </p>
              <p className="mt-2">
                <span
                  className={`inline-flex text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                    customer.accountStatus === "active"
                      ? "bg-emerald-500/25 text-emerald-100"
                      : "bg-white/15 text-slate-200"
                  }`}
                >
                  {customer.accountStatus === "active" ? "Active account" : "Inactive account"}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {customer.pipelineStatus !== "none" && (
            <div className="mt-4">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${pipelineStatusConfig[customer.pipelineStatus].color}`}
              >
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                {pipelineStatusConfig[customer.pipelineStatus].label}
                {customer.pipelineValue > 0 && (
                  <span className="text-white/80">• {formatCurrency(customer.pipelineValue)}</span>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setHeadcountOpen((o) => !o)}
              className={`bg-slate-50 rounded-lg p-4 text-left ring-2 transition-all hover:bg-slate-100/80 focus:outline-none focus-visible:ring-[#1e3a5f] ${
                headcountOpen ? "ring-[#1e3a5f]/40 bg-slate-100/80" : "ring-transparent"
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-slate-500 mb-1">
                <span className="flex items-center gap-2 text-xs font-medium">
                  <Users className="w-4 h-4" />
                  Headcount
                </span>
                {headcountOpen ? (
                  <ChevronDown className="w-4 h-4 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 shrink-0" />
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{customer.headcount}</p>
              <p className="text-[11px] text-slate-500 mt-1">Click to see US / India on this project</p>
            </button>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Revenue</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(customer.monthlyRevenue)}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Monthly</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Profit</span>
              </div>
              <p className={`text-2xl font-bold ${profit > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {formatCurrency(profit)}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Monthly</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 col-span-2 md:col-span-3">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs font-medium">Cost</span>
              </div>
              <ToggleGroup
                type="single"
                value={costBasis}
                onValueChange={(v) => v && setCostBasis(v as CostBasis)}
                variant="outline"
                size="sm"
                className="w-full max-w-xl justify-stretch mb-2"
              >
                <ToggleGroupItem value="lifetime" className="text-xs px-2">
                  Since inception
                </ToggleGroupItem>
                <ToggleGroupItem value="recent" className="text-xs px-2">
                  Last project
                </ToggleGroupItem>
                <ToggleGroupItem value="monthly" className="text-xs px-2">
                  Avg / month
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="text-2xl font-bold text-rose-600 tabular-nums">{formatCurrency(costDisplay)}</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug max-w-xl">{costCaption}</p>
            </div>
          </div>

          {headcountOpen && (
            <div className="mb-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-800 mb-1">Project staffing by region</p>
              <p className="text-xs text-slate-500 mb-4">Mock allocation for delivery roles on the active engagement.</p>
              <div className="flex h-3 rounded-full overflow-hidden bg-slate-200/80 mb-4">
                <div
                  className="h-full bg-[#1e3a5f] transition-all"
                  style={{ width: `${usPct}%` }}
                  title={`United States: ${customer.headcountUS}`}
                />
                <div
                  className="h-full bg-[#0d9488]"
                  style={{ width: `${inPct}%` }}
                  title={`India: ${customer.headcountIndia}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1e3a5f]" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">United States</p>
                    <p className="text-2xl font-bold text-[#1e3a5f] tabular-nums">{customer.headcountUS}</p>
                    <p className="text-xs text-slate-500">{usPct}% of project</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0d9488]" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">India</p>
                    <p className="text-2xl font-bold text-[#0d9488] tabular-nums">{customer.headcountIndia}</p>
                    <p className="text-xs text-slate-500">{inPct}% of project</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-5 mb-6">
            <h3 className="text-white font-semibold mb-3">Profitability Analysis</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Profit Margin</p>
                <p className="text-3xl font-bold text-white">{profitMargin}%</p>
              </div>
              <div className="text-right">
                <p className="text-slate-300 text-sm">Annual Projected Profit</p>
                <p className={`text-2xl font-bold ${profit > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {formatCurrency(profit * 12)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
                <div
                  className={`h-full ${profit > 0 ? "bg-emerald-500" : "bg-rose-500"}`}
                  style={{ width: `${Math.min(Math.abs(Number(profitMargin)), 100)}%` }}
                />
              </div>
            </div>
          </div>

          {customerExpenses.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Customer-Specific Expenses</h3>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg overflow-hidden">
                <div className="divide-y divide-orange-200">
                  {customerExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3">
                      <div>
                        <p className="font-medium text-slate-900">{expense.description}</p>
                        <p className="text-sm text-slate-500">{expense.category}</p>
                      </div>
                      <span className="font-semibold text-orange-600">{formatCurrency(expense.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-orange-100 p-3 flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Total Customer Expenses</span>
                  <span className="font-bold text-orange-700">{formatCurrency(totalCustomerExpenses)}</span>
                </div>
              </div>
            </div>
          )}

          {customer.pipelineValue > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Pipeline Opportunity</h3>
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-600">Pipeline Value</span>
                  <span className="text-xl font-bold text-violet-600">{formatCurrency(customer.pipelineValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium text-white ${pipelineStatusConfig[customer.pipelineStatus].color}`}
                  >
                    {pipelineStatusConfig[customer.pipelineStatus].label}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-3">
                  {customer.pipelineStatus === "early" &&
                    "Initial discussions underway. Opportunity identified but not yet qualified."}
                  {customer.pipelineStatus === "negotiating" &&
                    "Active negotiations in progress. Terms being discussed."}
                  {customer.pipelineStatus === "closing" && "Deal near completion. Final approvals pending."}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#1e3a5f] hover:bg-[#2d5a87] text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
