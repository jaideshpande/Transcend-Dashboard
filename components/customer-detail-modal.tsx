"use client";

import type { Customer } from "@/lib/customer-data";
import { expenses } from "@/lib/customer-data";
import { X, Users, TrendingUp, TrendingDown, DollarSign, Briefcase } from "lucide-react";

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

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
  const profit = customer.monthlyRevenue - customer.monthlyCosts;
  const profitMargin = ((profit / customer.monthlyRevenue) * 100).toFixed(1);
  const customerExpenses = expenses.filter((e) => e.customerId === customer.id);
  const totalCustomerExpenses = customerExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a87] p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{customer.name}</h2>
              <p className="text-blue-200 mt-1">{customer.industry}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pipeline Status Badge */}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Headcount</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{customer.headcount}</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Revenue</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(customer.monthlyRevenue)}</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-xs font-medium">Costs</span>
              </div>
              <p className="text-2xl font-bold text-rose-600">{formatCurrency(customer.monthlyCosts)}</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Profit</span>
              </div>
              <p className={`text-2xl font-bold ${profit > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {formatCurrency(profit)}
              </p>
            </div>
          </div>

          {/* Profitability Analysis */}
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

            {/* Profit Bar */}
            <div className="mt-4">
              <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
                <div
                  className={`h-full ${profit > 0 ? "bg-emerald-500" : "bg-rose-500"}`}
                  style={{ width: `${Math.min(Math.abs(Number(profitMargin)), 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Customer-Specific Expenses */}
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

          {/* Pipeline Details */}
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
                  {customer.pipelineStatus === "early" && "Initial discussions underway. Opportunity identified but not yet qualified."}
                  {customer.pipelineStatus === "negotiating" && "Active negotiations in progress. Terms being discussed."}
                  {customer.pipelineStatus === "closing" && "Deal near completion. Final approvals pending."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <button
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
