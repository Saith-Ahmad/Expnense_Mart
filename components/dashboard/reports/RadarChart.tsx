import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from "recharts";

// Sample data: This will be passed dynamically from props
const RadarChartComponent = ({ spendingData }: { spendingData: { category: string; amount: number }[] }) => {
  // Define a color array, this can be expanded depending on the number of categories
  const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#FF5C8D", "#C8C8C8"];

  return (
    <div className="w-full h-[400px] flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold mb-4 text-white">
        Data Statistics
      </h2>
      <div className="w-full h-full">
        <ResponsiveContainer>
          <RadarChart outerRadius="80%" width={500} height={500} data={spendingData}>
            {/* Polar Grid */}
            <PolarGrid />
            
            {/* Angle Axis for Categories */}
            <PolarAngleAxis dataKey="category" />
            
            {/* Radius Axis for Amount */}
            <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} />
            
            {/* Radar chart to represent the data */}
            {spendingData.map((entry, index) => (
              <Radar
                key={index}
                name={entry.category}
                dataKey="amount"
                stroke={COLORS[index % COLORS.length]} // Dynamically assigning color for each category
                fill={COLORS[index % COLORS.length]} // Dynamically assigning color for each category
                fillOpacity={0.6}
              />
            ))}

            {/* Tooltip */}
            <Tooltip formatter={(value: number) => `Rs ${value.toLocaleString()}`} contentStyle={{
                backgroundColor: "#0e0e0e", // Dark background
                color: "#fff", // Text color
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}/>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarChartComponent;
