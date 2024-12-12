'use server'
import { Budgetlist, ExpenseList } from "@/constants/constant";
// budget.actions.ts

import { db } from "@/db"; // Import the db instance
import { Budgets, Expenses } from "@/db/schema"; // Import the schema for Budgets
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export async function createExpense(
  id: string,
  name: string,
  amount: number,
  category: string,
  path: string,
  budgetAmount: number,
  totalExpenses: number
) {
  if (budgetAmount > 0) {
    const remaining_balance = budgetAmount - totalExpenses;
    if (amount > remaining_balance) {
      // Custom error message
      throw new Error(
        `Expense exceeds the budget! Remaining balance is Rs ${remaining_balance.toLocaleString()}, but you tried to add Rs ${amount.toLocaleString()}.`
      );
    }
  }

  try {
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        category: category,
        budgetId: id,
      })
      .returning({ Expense: Expenses.id });

    if (result) {
      revalidatePath(path); // Trigger revalidation for the path
      return { success: true, message: "Expense added successfully!" };
    } else {
      return { success: false, message: "Failed to add expense. Please try again later." };
    }
  } catch (error: any) {
    console.error("Error creating expense:", error.message);

    // Send sanitized error message
    return {
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Failed to add expense due to a server error. Please try again later."
          : error.message,
    };
  }
}



export const getExpenseList = async (budgetId: string, createdBy: string) => {
    try {
        const result = await db
            .select({
              expenseId: Expenses.id,
                name: Expenses.name,
                expenseAmount: Expenses.amount,
                createdAt : Expenses.createdAt,
                category : Expenses.category
            })
            .from(Expenses)
            .innerJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
            .where(
                and(
                    eq(Expenses.budgetId, budgetId), // Filter by budgetId
                    eq(Budgets.createdBy, createdBy) // Ensure budget belongs to the user
                )
            );
        return result;
    } catch (error: any) {
        console.error(`Error fetching expenses: ${error.message}`);
        throw new Error("Failed to fetch expenses");
    }
};

export async function getAllExpensesOfUser(createdBy: string) {
  try {
    const expenses = await db
        .select({
          expenseAmount: Expenses.amount,
          category: Expenses.category,
          name : Expenses.name,
          createdAt : Expenses.createdAt,
          expenseId : Expenses.id
        })
        .from(Expenses)
        .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
        .where(eq(Budgets.createdBy, createdBy));

        return expenses;
  } catch (error) {
      console.error("Error fetching all expenses of user", error);
  }
}


export async function deleteExpenseById(id:string) {
    try {
      const result = await db
        .delete(Expenses)
        .where(eq(Expenses.id,id))
        .returning();
      if (result) {
        return { success: true, message: "Expense Deleted Successfully"};
      }
    } catch (error:any) {
      return { success: true, message: `Failed to deleted Expense ${error.message}`};
    }
  }




  export async function getDashboardStats(userEmail: string) {
    try {
      // Fetch budgets created by the user
      const budgets = await db
        .select({
          budgetAmount: Budgets.amount,
        })
        .from(Budgets)
        .where(eq(Budgets.createdBy, userEmail));
  
      // Calculate total budgets amount and count
      const totalBudgetsAmount = budgets.reduce(
        (acc, budget) => acc + budget.budgetAmount,
        0
      );
      const totalBudgetsCount = budgets.length;
  
      // Fetch expenses associated with budgets created by the user
      const expenses = await db
        .select({
          expenseAmount: Expenses.amount,
          category: Expenses.category,
        })
        .from(Expenses)
        .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id)) // Join to filter by createdBy
        .where(eq(Budgets.createdBy, userEmail));
  
      // Calculate total expenses amount and count
      const totalExpensesAmount = expenses.reduce(
        (acc, expense) => acc + expense.expenseAmount,
        0
      );
      const totalExpensesCount = expenses.length;
  
      // Calculate total spend by category
      const expensesByCategory = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = 0;
        }
        acc[expense.category] += expense.expenseAmount;
        return acc;
      }, {} as Record<string, number>);
  
      // Return aggregated stats
      return {
        totalBudgetsAmount: totalBudgetsAmount || 0,
        totalExpensesAmount: totalExpensesAmount || 0,
        totalBudgetsCount: totalBudgetsCount || 0,
        totalExpensesCount: totalExpensesCount || 0,
        expensesByCategory, // Include category-wise spending
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error("Unable to fetch dashboard stats");
    }
  }
  