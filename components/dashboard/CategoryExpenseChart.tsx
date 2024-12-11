'use client'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  function CategoryExpensesAreaChart({
    expensesByCategory,
  }: {
    expensesByCategory: Record<string, number>;
  }) {
    const data = Object.keys(expensesByCategory).map((category) => ({
      category,
      amount: expensesByCategory[category],
    }));
  
    return (
      <div className="w-full h-[400px] md:py-10">
        <h2 className="text-center mb-4 text-white">Expense-Category Graph</h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#333", // Dark background
                color: "#fff", // Text color
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              fill="#8884d8"
              name="Amount Spent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  export default CategoryExpensesAreaChart;
  