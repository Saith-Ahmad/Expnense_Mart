import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Define Colors for Sections
const COLORS = ["#FF8042", "#0088FE"];

const DonutChart = ({ spend, amount }: { spend: number; amount: number }) => {
  const data = [
    { name: "Total Spend", value: spend },
    { name: "Remaining Balance", value: amount - spend },
  ];

  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold mb-4 text-white">Remaining Balance vs Total Spend</h2>
      <div className="w-full h-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="80%"
              fill="#8884d8"
              label={({ name, value }) => `${name}: Rs ${value.toLocaleString()}`} // Add labels
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            {/* Tooltip */}
            <Tooltip formatter={(value: number) => `Rs ${value.toLocaleString()}`} contentStyle={{
                backgroundColor: "#a49bb0", // Dark background
                color: "#fff", // Text color
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DonutChart;
