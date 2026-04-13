"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { Customer, Sector } from "@/lib/customer-data";

interface BubbleChartProps {
  customers: Customer[];
  onCustomerSelect: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
  filter: string;
  searchQuery: string;
  activityFilter: "all" | "active" | "inactive";
  sectorFilter: "all" | Sector;
}

const pipelineColors = {
  none: "#1e3a5f",
  early: "#f59e0b",
  negotiating: "#8b5cf6",
  closing: "#10b981",
};

const pipelineRingColors = {
  none: "rgba(30, 58, 95, 0.3)",
  early: "rgba(245, 158, 11, 0.5)",
  negotiating: "rgba(139, 92, 246, 0.5)",
  closing: "rgba(16, 185, 129, 0.5)",
};

const unprofitableColor = "#dc2626";
const unprofitableRingColor = "rgba(220, 38, 38, 0.4)";

const sectorCenters = (width: number): Record<Sector, number> => ({
  Insurance: width * 0.24,
  "Asset Management": width * 0.5,
  "Sell-Side": width * 0.76,
});

function getCustomerColor(customer: Customer): string {
  const isUnprofitable = customer.monthlyCosts > customer.monthlyRevenue;
  if (isUnprofitable) return unprofitableColor;
  return pipelineColors[customer.pipelineStatus];
}

function getCustomerRingColor(customer: Customer): string {
  const isUnprofitable = customer.monthlyCosts > customer.monthlyRevenue;
  if (isUnprofitable) return unprofitableRingColor;
  return pipelineRingColors[customer.pipelineStatus];
}

function getBubbleFill(customer: Customer): string {
  const base = getCustomerColor(customer);
  if (customer.accountStatus === "inactive") {
    const hsl = d3.hsl(base);
    hsl.s = Math.max(0, hsl.s * 0.4);
    hsl.l = Math.min(0.82, hsl.l + 0.2);
    return hsl.formatHex();
  }
  return base;
}

type BubbleSimulationNode = Customer & {
  radius: number;
  ringRadius: number;
  x: number;
  y: number;
};

export function BubbleChart({
  customers,
  onCustomerSelect,
  selectedCustomer,
  filter,
  searchQuery,
  activityFilter,
  sectorFilter,
}: BubbleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    customer: Customer | null;
  }>({ show: false, x: 0, y: 0, customer: null });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: Math.max(width, 400), height: Math.max(height, 400) });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    let filteredCustomers = customers.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const isUnprofitable = c.monthlyCosts > c.monthlyRevenue;
      const matchesActivity =
        activityFilter === "all" || c.accountStatus === activityFilter;
      const matchesSector = sectorFilter === "all" || c.sector === sectorFilter;

      if (!matchesSearch || !matchesActivity || !matchesSector) return false;

      if (filter === "all") return true;
      if (filter === "pipeline") return c.pipelineValue > 0;
      if (filter === "profitable") return c.monthlyRevenue - c.monthlyCosts > 500000;
      if (filter === "unprofitable") return isUnprofitable;
      if (filter === "highheadcount") return c.headcount >= 20;
      return true;
    });

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    if (filteredCustomers.length === 0) {
      svg
        .append("text")
        .attr("x", centerX)
        .attr("y", centerY)
        .attr("text-anchor", "middle")
        .attr("fill", "#64748b")
        .attr("font-size", 15)
        .text("No customers match the current filters.");
      return;
    }

    const headcountExtent = d3.extent(filteredCustomers, (d) => d.headcount);
    const domain: [number, number] =
      headcountExtent[0] == null || headcountExtent[1] == null
        ? [0, 1]
        : [headcountExtent[0], headcountExtent[1]];
    const radiusScale = d3.scaleSqrt().domain(domain).range([20, 70]);

    const pipelineExtent = d3.extent(customers, (d) => d.pipelineValue) as [number, number];
    const ringScale = d3
      .scaleLinear()
      .domain([0, pipelineExtent[1] || 1])
      .range([0, 15]);

    const centers = sectorCenters(width);
    const sectorStrength = sectorFilter === "all" ? 0.075 : 0.04;

    const nodes: BubbleSimulationNode[] = filteredCustomers.map((customer) => ({
      ...customer,
      radius: radiusScale(customer.headcount),
      ringRadius: customer.pipelineValue > 0 ? ringScale(customer.pipelineValue) : 0,
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY + (Math.random() - 0.5) * 100,
    }));

    const simulation = d3
      .forceSimulation<BubbleSimulationNode>(nodes)
      .force("center", d3.forceCenter(centerX, centerY))
      .force("charge", d3.forceManyBody().strength(-5))
      .force(
        "collision",
        d3.forceCollide<BubbleSimulationNode>().radius((d) => {
          const isUnprofitable = d.monthlyCosts > d.monthlyRevenue;
          const extraRing = isUnprofitable ? 8 : d.ringRadius;
          return d.radius + extraRing + 4;
        })
      )
      .force("sectorX", d3.forceX<BubbleSimulationNode>((d) => centers[d.sector]).strength(sectorStrength))
      .force("x", d3.forceX(centerX).strength(0.03))
      .force("y", d3.forceY(centerY).strength(0.05));

    const bubbleGroups = svg
      .selectAll("g.bubble")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "bubble")
      .attr("cursor", "pointer")
      .on("click", (_, d) => {
        const customer = customers.find((c) => c.id === d.id);
        if (customer) onCustomerSelect(customer);
      })
      .on("mouseenter", function (event, d) {
        const customer = customers.find((c) => c.id === d.id);
        if (customer) {
          const rect = containerRef.current?.getBoundingClientRect();
          setTooltip({
            show: true,
            x: event.clientX - (rect?.left || 0),
            y: event.clientY - (rect?.top || 0),
            customer,
          });
        }
      })
      .on("mouseleave", () => {
        setTooltip({ show: false, x: 0, y: 0, customer: null });
      });

    bubbleGroups
      .filter((d) => d.pipelineValue > 0 || d.monthlyCosts > d.monthlyRevenue)
      .append("circle")
      .attr("class", "pipeline-ring")
      .attr("r", (d) => {
        const isUnprofitable = d.monthlyCosts > d.monthlyRevenue;
        return d.radius + (isUnprofitable ? 8 : d.ringRadius);
      })
      .attr("fill", (d) => getCustomerRingColor(d))
      .attr("stroke", (d) => getCustomerColor(d))
      .attr("stroke-width", (d) => (d.accountStatus === "inactive" ? 1.5 : 2))
      .attr("stroke-dasharray", (d) => {
        const isUnprofitable = d.monthlyCosts > d.monthlyRevenue;
        if (d.accountStatus === "inactive") return "5,4";
        if (isUnprofitable) return "6,3";
        return d.pipelineStatus === "early" ? "4,4" : "none";
      })
      .attr("opacity", (d) => (d.accountStatus === "inactive" ? 0.65 : 1));

    bubbleGroups
      .append("circle")
      .attr("class", "main-bubble")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => getBubbleFill(d))
      .attr("stroke", (d) => {
        if (selectedCustomer?.id === d.id) return "#0f172a";
        return d.accountStatus === "inactive" ? "#94a3b8" : "#fff";
      })
      .attr("stroke-width", (d) => (selectedCustomer?.id === d.id ? 3.5 : 2))
      .attr("opacity", (d) => (d.accountStatus === "inactive" ? 0.72 : 0.92));

    bubbleGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("fill", "#fff")
      .attr("font-size", (d) => Math.max(10, d.radius / 4))
      .attr("font-weight", "500")
      .attr("opacity", (d) => (d.accountStatus === "inactive" ? 0.85 : 1))
      .text((d) => {
        const maxChars = Math.floor(d.radius / 5);
        return d.name.length > maxChars ? d.name.slice(0, maxChars) + "..." : d.name;
      });

    bubbleGroups
      .filter((d) => d.radius > 30)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.8em")
      .attr("fill", "rgba(255,255,255,0.82)")
      .attr("font-size", (d) => Math.max(8, d.radius / 5))
      .text((d) => `${d.headcount} staff`);

    simulation.on("tick", () => {
      bubbleGroups.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [
    customers,
    dimensions,
    filter,
    searchQuery,
    onCustomerSelect,
    activityFilter,
    sectorFilter,
    selectedCustomer,
  ]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[500px]">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />

      {tooltip.show && tooltip.customer && (
        <div
          className="absolute z-50 bg-slate-900 text-white p-4 rounded-lg shadow-xl border border-slate-700 pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            maxWidth: 280,
          }}
        >
          <h4 className="font-bold text-lg mb-2">{tooltip.customer.name}</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-slate-400">Sector:</span> {tooltip.customer.sector}
            </p>
            <p>
              <span className="text-slate-400">Account:</span>{" "}
              <span
                className={
                  tooltip.customer.accountStatus === "active" ? "text-emerald-300" : "text-slate-400"
                }
              >
                {tooltip.customer.accountStatus === "active" ? "Active" : "Inactive"}
              </span>
            </p>
            <p>
              <span className="text-slate-400">Headcount:</span> {tooltip.customer.headcount} on project
            </p>
            <p>
              <span className="text-slate-400">Monthly Revenue:</span> $
              {(tooltip.customer.monthlyRevenue / 1000000).toFixed(2)}M
            </p>
            <p>
              <span className="text-slate-400">Monthly Costs:</span> $
              {(tooltip.customer.monthlyCosts / 1000000).toFixed(2)}M
            </p>
            <p>
              <span className="text-slate-400">Profit:</span>{" "}
              <span
                className={
                  tooltip.customer.monthlyRevenue - tooltip.customer.monthlyCosts > 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                ${((tooltip.customer.monthlyRevenue - tooltip.customer.monthlyCosts) / 1000000).toFixed(2)}M
              </span>
            </p>
            {tooltip.customer.pipelineValue > 0 && (
              <>
                <p>
                  <span className="text-slate-400">Pipeline Value:</span> $
                  {(tooltip.customer.pipelineValue / 1000000).toFixed(2)}M
                </p>
                <p>
                  <span className="text-slate-400">Pipeline Status:</span>{" "}
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: pipelineColors[tooltip.customer.pipelineStatus] }}
                  >
                    {tooltip.customer.pipelineStatus === "early" && "Early Stage"}
                    {tooltip.customer.pipelineStatus === "negotiating" && "Negotiating"}
                    {tooltip.customer.pipelineStatus === "closing" && "Closing Soon"}
                  </span>
                </p>
              </>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2">Click for details</p>
        </div>
      )}
    </div>
  );
}
