import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample Data Format: Replace or pass this as props
const sampleData = [
  { category: "Food", amount: 12000 },
  { category: "Utilities", amount: 8000 },
  { category: "Entertainment", amount: 5000 },
  { category: "Transportation", amount: 3000 },
  { category: "Other", amount: 2000 },
];

// Define Colors for Categories
const COLORS = [
  "#bcc44b",
  "#00ae9e",
  "#FF8042",
  "#ac8dd8",
  "#91d5f2",
  "#552da6",
];

const PieChartReport = ({
  data = sampleData,
}: {
  data: { category: string; amount: number }[];
}) => {
  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Spending by Category
      </h2>
      <div className="w-full h-full">
        <ResponsiveContainer>
          <PieChart>
            {/* Pie Chart */}
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              fill="#8884d8"
              label={(entry) =>
                `${entry.category}: ${(
                  (entry.amount /
                    data.reduce((acc, cur) => acc + cur.amount, 0)) *
                  100
                ).toFixed(1)}%`
              } // Show percentages
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* Tooltip and Legend */}
            <Tooltip
              formatter={(value: number) => `Rs ${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "#a49bb0", // Dark background
                color: "#fff", // Text color
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartReport;
