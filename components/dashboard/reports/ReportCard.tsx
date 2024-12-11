"use client";
import { ReportCardProps } from "@/constants/constant";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const ReportCard: React.FC<ReportCardProps> = ({ budget }) => {
  const formatCurrency = (value: number) => `Rs ${value.toLocaleString()}`;
  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const chartData = [
    { name: "Expenses", value: budget.totalSpend },
    { name: "Remaining", value: budget.totalAmount - budget.totalSpend },
  ];

  const COLORS = ["#940616", "#8a71ad"];

  return (
    <Link href={`reports/${budget?.id}`}>
      <div className="p-5  rounded-lg shadow-md stats_card text-gray-100 hover:scale-[1.02] transition_class">
        {/* Icon and Header */}
        <div className="flex items-center space-x-4 mb-3 ">
          <div className="bg-secondary bg-opacity-30 rounded-full text-4xl h-[50px] w-[50px] flex items-center justify-center">
            {budget.icon || "📊"}
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {budget.name.length > 10
                ? `${budget.name.slice(0, 10)}...`
                : budget.name}
            </h2>
            <p className="text-sm text-secondary">{budget.timeFrame} Budget</p>
          </div>
        </div>

        {/* Semi-Circle Chart */}
        <div className="flex justify-center mb-4">
          <PieChart width={200} height={110}>
            <Pie
              isAnimationActive={false}
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="100%"
              innerRadius={20}
              outerRadius={95}
              startAngle={180}
              endAngle={0}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#a49bb0ac", // Dark background
                color: "#fff", // Text color
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </PieChart>
        </div>

        {/* Main Info */}
        <div className="text-sm space-y-2 flex flex-col items-center justify-center">
          <div className="report_stats rounded-lg p-1 px-2">
            Total Budget: {formatCurrency(budget.totalAmount)}
          </div>
          <div className="report_stats rounded-lg p-1 px-2">
            Remaining Balance: {formatCurrency(budget.remainingBalance)}
          </div>
          <div className="report_stats rounded-lg p-1 px-2">
            Total Spendings: {formatCurrency(budget.totalSpend)}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-xs text-gray-400">
          <p>
            Created:{" "}
            <span className="text-secondary">
              {formatDate(budget.createdAt)}
            </span>
          </p>
          <p className="flex justify-between">
           <p> Last Updated:{" "}
            <span className="text-secondary">
              {formatDate(budget.updatedAt)}
            </span></p>
              <SquareArrowOutUpRight size={16}/>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ReportCard;
