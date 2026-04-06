"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { Customer } from "@/lib/customer-data";

interface BubbleChartProps {
  customers: Customer[];
  onCustomerSelect: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
  filter: string;
  searchQuery: string;
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

// Color for unprofitable customers
const unprofitableColor = "#dc2626";
const unprofitableRingColor = "rgba(220, 38, 38, 0.4)";

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

export function BubbleChart({
  customers,
  onCustomerSelect,
  selectedCustomer,
  filter,
  searchQuery,
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
      
      if (filter === "all") return matchesSearch;
      if (filter === "pipeline") return matchesSearch && c.pipelineValue > 0;
      if (filter === "profitable") return matchesSearch && c.monthlyRevenue - c.monthlyCosts > 500000;
      if (filter === "unprofitable") return matchesSearch && isUnprofitable;
      if (filter === "highheadcount") return matchesSearch && c.headcount >= 20;
      return matchesSearch;
    });

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    // Scale for bubble sizes based on headcount
    const headcountExtent = d3.extent(filteredCustomers, (d) => d.headcount) as [number, number];
    const radiusScale = d3.scaleSqrt().domain(headcountExtent).range([20, 70]);

    // Scale for pipeline ring thickness
    const pipelineExtent = d3.extent(customers, (d) => d.pipelineValue) as [number, number];
    const ringScale = d3.scaleLinear().domain([0, pipelineExtent[1] || 1]).range([0, 15]);

    // Create nodes with initial positions
    const nodes = filteredCustomers.map((customer) => ({
      ...customer,
      radius: radiusScale(customer.headcount),
      ringRadius: customer.pipelineValue > 0 ? ringScale(customer.pipelineValue) : 0,
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY + (Math.random() - 0.5) * 100,
    }));

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force("center", d3.forceCenter(centerX, centerY))
      .force("charge", d3.forceManyBody().strength(-5))
      .force(
        "collision",
        d3.forceCollide<(typeof nodes)[0]>().radius((d) => {
          const isUnprofitable = d.monthlyCosts > d.monthlyRevenue;
          const extraRing = isUnprofitable ? 8 : d.ringRadius;
          return d.radius + extraRing + 4;
        })
      )
      .force("x", d3.forceX(centerX).strength(0.05))
      .force("y", d3.forceY(centerY).strength(0.05));

    // Create bubble groups
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

    // Add pipeline ring (outer ring) - for pipeline deals OR unprofitable customers
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
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", (d) => {
        const isUnprofitable = d.monthlyCosts > d.monthlyRevenue;
        if (isUnprofitable) return "6,3";
        return d.pipelineStatus === "early" ? "4,4" : "none";
      });

    // Add main bubble
    bubbleGroups
      .append("circle")
      .attr("class", "main-bubble")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => getCustomerColor(d))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("opacity", 0.9);

    // Add company name text
    bubbleGroups
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("fill", "#fff")
      .attr("font-size", (d) => Math.max(10, d.radius / 4))
      .attr("font-weight", "500")
      .text((d) => {
        const maxChars = Math.floor(d.radius / 5);
        return d.name.length > maxChars ? d.name.slice(0, maxChars) + "..." : d.name;
      });

    // Add headcount text
    bubbleGroups
      .filter((d) => d.radius > 30)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.8em")
      .attr("fill", "rgba(255,255,255,0.8)")
      .attr("font-size", (d) => Math.max(8, d.radius / 5))
      .text((d) => `${d.headcount} staff`);

    // Update positions on tick
    simulation.on("tick", () => {
      bubbleGroups.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [customers, dimensions, filter, searchQuery, onCustomerSelect]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[500px]">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
      
      {/* Tooltip */}
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
            <p><span className="text-slate-400">Industry:</span> {tooltip.customer.industry}</p>
            <p><span className="text-slate-400">Headcount:</span> {tooltip.customer.headcount} employees</p>
            <p><span className="text-slate-400">Monthly Revenue:</span> ${(tooltip.customer.monthlyRevenue / 1000000).toFixed(2)}M</p>
            <p><span className="text-slate-400">Monthly Costs:</span> ${(tooltip.customer.monthlyCosts / 1000000).toFixed(2)}M</p>
            <p>
              <span className="text-slate-400">Profit:</span>{" "}
              <span className={tooltip.customer.monthlyRevenue - tooltip.customer.monthlyCosts > 0 ? "text-green-400" : "text-red-400"}>
                ${((tooltip.customer.monthlyRevenue - tooltip.customer.monthlyCosts) / 1000000).toFixed(2)}M
              </span>
            </p>
            {tooltip.customer.pipelineValue > 0 && (
              <>
                <p><span className="text-slate-400">Pipeline Value:</span> ${(tooltip.customer.pipelineValue / 1000000).toFixed(2)}M</p>
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
