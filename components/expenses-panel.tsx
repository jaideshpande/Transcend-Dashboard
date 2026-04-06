"use client";

import { expenses, getCompanyExpenses, getCustomerExpenses, customers } from "@/lib/customer-data";
import { Building2, Users, DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

interface ExpensesPanelProps {
  selectedCustomerId?: string | null;
}

export function ExpensesPanel({ selectedCustomerId }: ExpensesPanelProps) {
  const [companyExpanded, setCompanyExpanded] = useState(true);
  const [customerExpanded, setCustomerExpanded] = useState(true);

  const companyExpenses = expenses.filter((e) => e.type === "company");
  const customerSpecificExpenses = expenses.filter((e) => e.type === "customer");

  // Group company expenses by category
  const companyByCategory = companyExpenses.reduce(
    (acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = [];
      }
      acc[expense.category].push(expense);
      return acc;
    },
    {} as Record<string, typeof companyExpenses>
  );

  // Get customer name helper
  const getCustomerName = (customerId: string) => {
    return customers.find((c) => c.id === customerId)?.name || "Unknown";
  };

  // Filter customer expenses if a customer is selected
  const filteredCustomerExpenses = selectedCustomerId
    ? customerSpecificExpenses.filter((e) => e.customerId === selectedCustomerId)
    : customerSpecificExpenses;

  return (
    <div className="h-full flex flex-col bg-slate-50 border-l border-slate-200">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">Expense Overview</h2>
        <p className="text-sm text-slate-500">Monthly expense breakdown</p>
      </div>

      {/* Summary Cards */}
      <div className="p-4 space-y-3">
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Company Expenses</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(getCompanyExpenses())}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Customer-Specific</p>
              <p className="text-xl font-bold text-slate-900">{formatCurrency(getCustomerExpenses())}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-300">Total Expenses</p>
              <p className="text-xl font-bold text-white">
                {formatCurrency(getCompanyExpenses() + getCustomerExpenses())}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Lists */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Company Expenses */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <button
            onClick={() => setCompanyExpanded(!companyExpanded)}
            className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="font-semibold text-slate-900">Company Expenses</span>
            {companyExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>
          {companyExpanded && (
            <div className="p-3 space-y-4">
              {Object.entries(companyByCategory).map(([category, categoryExpenses]) => (
                <div key={category}>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {categoryExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between text-sm py-1.5 px-2 rounded hover:bg-slate-50"
                      >
                        <span className="text-slate-700">{expense.description}</span>
                        <span className="font-medium text-slate-900">{formatCurrency(expense.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer-Specific Expenses */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <button
            onClick={() => setCustomerExpanded(!customerExpanded)}
            className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="font-semibold text-slate-900">
              Customer Expenses
              {selectedCustomerId && (
                <span className="ml-2 text-sm font-normal text-slate-500">
                  (Filtered: {getCustomerName(selectedCustomerId)})
                </span>
              )}
            </span>
            {customerExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>
          {customerExpanded && (
            <div className="p-3 space-y-2">
              {filteredCustomerExpenses.length === 0 ? (
                <p className="text-sm text-slate-500 py-2">No expenses for this customer</p>
              ) : (
                filteredCustomerExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-start justify-between text-sm py-2 px-2 rounded hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-slate-700">{expense.description}</p>
                      <p className="text-xs text-slate-500">
                        {getCustomerName(expense.customerId!)} • {expense.category}
                      </p>
                    </div>
                    <span className="font-medium text-slate-900 whitespace-nowrap">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
