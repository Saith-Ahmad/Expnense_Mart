'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ComparisonLineChart({
  data,
}: {
  data: { period: string; expenses: number; budgets: number }[];
}) {
  return (
    <div className="w-full h-[400px] md:py-10">
      <h2 className="text-center mb-4 text-white">Expenses vs Budgets Comparison</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "#222", // Tooltip background
              color: "#fff",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ff4d4f"
            strokeWidth={2}
            name="Expenses"
          />
          <Line
            type="monotone"
            dataKey="budgets"
            stroke="#4caf50"
            strokeWidth={2}
            name="Budgets"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComparisonLineChart;
