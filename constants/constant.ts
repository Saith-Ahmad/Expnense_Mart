import { CircleGauge, HandCoins,  PiggyBank, ReceiptText } from "lucide-react";

export const menuList = [
  {
    id: 1,
    name: "Dashboard",
    icon: CircleGauge,
    path: "/dashboard",
  },
  {
    id: 2,
    name: "Budgets",
    icon: PiggyBank,
    path: "/dashboard/budgets",
  },
  {
    id: 3,
    name: "Expenses",
    icon: HandCoins,
    path: "/dashboard/expenses",
  },
  {
    id: 4,
    name: "Reports",
    icon: ReceiptText,
    path: "/dashboard/reports",
  },
];

export interface Budgetlist {
  id: string; // ID is a string (UUID format in your example)
  amount: number; // Amount is a string (formatted as "2000.00")
  createdBy: string; // Created by is the user's email
  icon: string | null; // Icon is a string or null
  name: string; // Name of the budget
  period: string; // Period is a string (e.g., "01-2024")
  timeFrame: "Monthly" | "Yearly"; // Time frame can be "Monthly" or "Yearly"
  totalCount: number; // Total count (number of related expenses)
  totalSpend: number | null; // Total spend (sum of expenses or null if no expenses)
  createdAt: Date; // Created date
  updatedAt: Date; // Updated date
}

export interface ReportCardProps {
  budget: {
    id: string;
    name: string;
    totalAmount: number;
    remainingBalance: number;
    totalSpend: number;
    spendingByCategory: { category: string; amount: number }[];
    highestExpenseCategory: string;
    createdAt: Date;
    updatedAt: Date;
    totalExpenseCount: number;
    icon: string | null;
    timeFrame: string;
  };
}



export interface ExpenseList {
  expenseAmount: number;
  expenseId: string; // Change from string to number
  name? : string,
  createdAt? :Date,
  category? : string
}


export interface Stats {
  totalBudgetsAmount: number;
  totalBudgetsCount: number;
  totalExpensesAmount: number;
  totalExpensesCount: number;
  expensesByCategory: Record<string, number>; // Key is category name, value is total spend
}
