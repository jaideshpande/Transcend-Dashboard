"use client";

import { useState } from "react";
import { Search, Users, DollarSign, TrendingUp, PieChart, Filter } from "lucide-react";
import { BubbleChart } from "@/components/bubble-chart";
import { ExpensesPanel } from "@/components/expenses-panel";
import { CustomerDetailModal } from "@/components/customer-detail-modal";
import {
  customers,
  getTotalHeadcount,
  getTotalRevenue,
  getTotalCosts,
  getTotalPipeline,
  SECTORS,
  type Customer,
  type Sector,
} from "@/lib/customer-data";

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

const pipelineLegend = [
  { status: "none", label: "Profitable Customer", color: "#1e3a5f" },
  { status: "unprofitable", label: "Unprofitable", color: "#dc2626" },
  { status: "early", label: "Early Stage Deal", color: "#f59e0b" },
  { status: "negotiating", label: "Negotiating", color: "#8b5cf6" },
  { status: "closing", label: "Closing Soon", color: "#10b981" },
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState<"all" | "active" | "inactive">("all");
  const [sectorFilter, setSectorFilter] = useState<"all" | Sector>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showExpenses, setShowExpenses] = useState(false);

  const totalHeadcount = getTotalHeadcount();
  const totalRevenue = getTotalRevenue();
  const totalCosts = getTotalCosts();
  const totalProfit = totalRevenue - totalCosts;
  const totalPipeline = getTotalPipeline();
  const activePipelineDeals = customers.filter((c) => c.pipelineValue > 0).length;
  const unprofitableCustomers = customers.filter((c) => c.monthlyCosts > c.monthlyRevenue);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a87] text-white">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/transcend-logo.png"
              alt="Transcend Logo"
              className="h-10 w-auto"
            />
            <div className="border-l border-white/20 pl-4">
              <p className="text-blue-200 text-sm">Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-blue-200">Chief Administrative Officer View</span>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className={`flex-1 p-6 ${showExpenses ? "mr-80" : ""} transition-all duration-300`}>
          {/* Summary Cards - Compact row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-slate-500">Total Headcount</span>
              </div>
              <p className="text-3xl font-bold text-[#1e3a5f]">{totalHeadcount}</p>
              <p className="text-xs text-slate-500 mt-1">across {customers.length} customers</p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm text-slate-500">Monthly Revenue</span>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-slate-500 mt-1">total customer revenue</p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-rose-600" />
                </div>
                <span className="text-sm text-slate-500">Monthly Costs</span>
              </div>
              <p className="text-3xl font-bold text-rose-600">{formatCurrency(totalCosts)}</p>
              <p className="text-xs text-slate-500 mt-1">service delivery costs</p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-violet-600" />
                </div>
                <span className="text-sm text-slate-500">Monthly Profit</span>
              </div>
              <p className={`text-3xl font-bold ${totalProfit > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {formatCurrency(totalProfit)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {((totalProfit / totalRevenue) * 100).toFixed(1)}% margin
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a87] rounded-xl p-5 shadow-sm text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-blue-200">Pipeline Value</span>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(totalPipeline)}</p>
              <p className="text-xs text-blue-200 mt-1">{activePipelineDeals} active deals</p>
            </div>
          </div>

          {/* Visualization Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Visualization Header */}
            <div className="p-5 border-b border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Customer Portfolio Overview</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Visualizing {customers.length} customers. Bubble size reflects project headcount; soft columns group Insurance,
                    Asset Management, and Sell-Side. Outer ring indicates pipeline (or loss-making accounts). Inactive
                    accounts appear muted with a dashed ring.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
                    />
                  </div>

                  {/* Toggle Expenses */}
                  <button
                    onClick={() => setShowExpenses(!showExpenses)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      showExpenses
                        ? "bg-[#1e3a5f] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    Expenses
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="mt-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  {[
                    { value: "all", label: "All Customers" },
                    { value: "pipeline", label: "Pipeline Deals" },
                    { value: "profitable", label: "High Profit" },
                    { value: "unprofitable", label: "Unprofitable" },
                    { value: "highheadcount", label: "Large Teams (20+)" },
                  ].map((filterOption) => (
                    <button
                      key={filterOption.value}
                      type="button"
                      onClick={() => setFilter(filterOption.value)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        filter === filterOption.value
                          ? "bg-[#1e3a5f] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {filterOption.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-6">
                  <span className="text-xs font-medium text-slate-500 w-full sm:w-auto sm:mr-1">Account</span>
                  {(
                    [
                      { value: "all" as const, label: "All" },
                      { value: "active" as const, label: "Active" },
                      { value: "inactive" as const, label: "Inactive" },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setActivityFilter(opt.value)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        activityFilter === opt.value
                          ? "bg-emerald-700 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 pl-0 sm:pl-6">
                  <span className="text-xs font-medium text-slate-500 w-full sm:w-auto sm:mr-1">Sector</span>
                  <button
                    type="button"
                    onClick={() => setSectorFilter("all")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      sectorFilter === "all"
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    All sectors
                  </button>
                  {SECTORS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSectorFilter(s)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        sectorFilter === s
                          ? "bg-slate-800 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-6">
                  <span className="text-xs text-slate-500 font-medium">Pipeline Status:</span>
                  {pipelineLegend.map((item) => (
                    <div key={item.status} className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-slate-600">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <span className="text-xs text-slate-500 font-medium">Account:</span>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#1e3a5f] opacity-90 border-2 border-white shadow-sm" />
                    <span className="text-xs text-slate-600">Active (full color)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border-2 border-dashed border-slate-400 bg-slate-300/80"
                      style={{ opacity: 0.85 }}
                    />
                    <span className="text-xs text-slate-600">Inactive (muted + dashed ring)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bubble Chart */}
            <div className="h-[700px] bg-gradient-to-br from-slate-50 to-slate-100">
              <BubbleChart
                customers={customers}
                onCustomerSelect={setSelectedCustomer}
                selectedCustomer={selectedCustomer}
                filter={filter}
                searchQuery={searchQuery}
                activityFilter={activityFilter}
                sectorFilter={sectorFilter}
              />
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-500 mb-3">Top Revenue Customers</h3>
              <div className="space-y-3">
                {customers
                  .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
                  .slice(0, 5)
                  .map((customer, idx) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-slate-700">{customer.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">
                        {formatCurrency(customer.monthlyRevenue)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-500 mb-3">Largest Teams</h3>
              <div className="space-y-3">
                {customers
                  .sort((a, b) => b.headcount - a.headcount)
                  .slice(0, 5)
                  .map((customer, idx) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-slate-700">{customer.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        {customer.headcount} staff
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-500 mb-3">Hot Pipeline Deals</h3>
              <div className="space-y-3">
                {customers
                  .filter((c) => c.pipelineStatus === "closing" || c.pipelineStatus === "negotiating")
                  .sort((a, b) => b.pipelineValue - a.pipelineValue)
                  .slice(0, 5)
                  .map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            customer.pipelineStatus === "closing" ? "bg-emerald-500" : "bg-violet-500"
                          }`}
                        />
                        <span className="text-sm text-slate-700">{customer.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-violet-600">
                        {formatCurrency(customer.pipelineValue)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-rose-200">
              <h3 className="text-sm font-semibold text-rose-500 mb-3">Unprofitable Customers</h3>
              <div className="space-y-3">
                {unprofitableCustomers
                  .sort((a, b) => (a.monthlyRevenue - a.monthlyCosts) - (b.monthlyRevenue - b.monthlyCosts))
                  .slice(0, 5)
                  .map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-sm text-slate-700">{customer.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-rose-600">
                        {formatCurrency(customer.monthlyRevenue - customer.monthlyCosts)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>

        {/* Expenses Side Panel */}
        {showExpenses && (
          <aside className="fixed right-0 top-[72px] bottom-0 w-80 z-40">
            <ExpensesPanel selectedCustomerId={selectedCustomer?.id} />
          </aside>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}
