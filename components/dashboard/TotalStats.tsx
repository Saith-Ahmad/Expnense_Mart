import { Stats } from "@/constants/constant";
import React from "react";
import Image from "next/image";

function TotalStats({ stats }: { stats: Stats }) {
  const cards = [
    {
      title: "Total Budgets",
      value: stats.totalBudgetsAmount,
      icon: "/budget-in.png",
      textColor: "#01BF63", // Use hex color
    },
    {
      title: "Total Expenses",
      value: stats.totalExpensesAmount,
      icon: "/expense-out.png",
      textColor: "#FFBE59", // Use hex color
    },
    {
      title: "Total Expenses Count",
      value: stats.totalExpensesCount,
      icon: "/expense-count.png",
      textColor: "#EA2C2F", // Use hex color
    },
    {
      title: "Total Budgets Count",
      value: stats.totalBudgetsCount,
      icon: "/budget-count.png",
      textColor: "#004BAC", // Use hex color
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`flex flex-col items-center justify-center p-6 rounded-lg stats_card gap-2 bg-opacity-70 backdrop-blur-xl`}
        >
          <Image src={card.icon} alt={card.title} width={100} height={100} />
          <h3 className={`text-sm text-gray-100 text-center md:font-semibold font-medium mb-2`}>
            {card.title}
          </h3>
          <p
            className="text-2xl font-bold"
            style={{ color: card.textColor }} // Inline styles for dynamic color
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default TotalStats;
