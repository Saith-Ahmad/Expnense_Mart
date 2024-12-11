'use client'
import { Budgetlist } from "@/constants/constant";
import Link from "next/link";
import React from "react";

function BudgetItem({ budget }: { budget: Budgetlist }) {
  const calculateProgressPerc = () => {
    if (budget.totalSpend !== null) {
      const perc: number = (budget.totalSpend / Number(budget.amount)) * 100;
      return perc.toFixed(2); // returns the percentage as a string with two decimal points
    }
    return "0"; // Return 0 if there is no spend yet
  };

  // Format the createdAt date to a readable format (optional)
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",  // Use "numeric" for the year (e.g., "2024")
      month: "short",   // Use "short" for the month (e.g., "Dec")
      day: "numeric",   // Use "numeric" for the day (e.g., "8")
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  
  return (
    <Link href={`/dashboard/expenses/${budget?.id}`}>
      <div className="p-5 rounded-lg shadow-md stats_card text-gray-100 hover:scale-[1.02] transition_class">
      <div className="bg-secondary bg-opacity-30 rounded-full text-4xl h-[50px] w-[50px] flex flex-col items-center justify-center mb-2">
          {budget.icon || "🪙"} 
      </div>
      
      <div className="flex items-center space-x-4">
        
        {/* Budget Info */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">{budget.name.length > 10 ? `${budget.name.slice(0, 12)}...` : budget.name}</h2>
          <p className="text-sm text-secondary">{budget.timeFrame} - {budget.period}</p>
          <p className="text-[12px] text-gray-300"><span className="text-gray-500">Created on : </span> {formatDate(budget.createdAt)}</p>
        </div>

        {/* Amount */}
        <div className="ml-auto">
          <p className="text-md font-semibold text-secondary">Rs {budget.amount}</p>
        </div>
      </div>

      <div className="mt-4">
        {/* Expenses Count */}
        <p className="text-sm text-gray-400">{budget.totalCount} Expense{budget.totalCount> 1 && "s"}</p>

        {/* Progress Bar */}
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-1">Progress</p>
          <div className="w-full bg-gray-400 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{ width: `${calculateProgressPerc()}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Spent: Rs <span className="text-secondary font-medium">{budget.totalSpend ? budget.totalSpend : 0}</span></span>
            <span>Remaining: Rs <span className="text-secondary font-medium">{budget.totalSpend ? (Number(budget.amount) - budget.totalSpend) : budget.amount}</span></span>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
}

export default BudgetItem;
