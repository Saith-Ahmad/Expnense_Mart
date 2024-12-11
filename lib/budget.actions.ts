'use server'
import { Budgetlist } from "@/constants/constant";
// budget.actions.ts

import { db } from "@/db"; // Import the db instance
import { Budgets, Expenses } from "@/db/schema"; // Import the schema for Budgets
import { and, eq, getTableColumns, sql } from "drizzle-orm";

// Helper function to create a new budget
export async function createBudget(
  name: string,
  amount: number,
  emoji: string,
  timeFrame: "Monthly" | "Yearly",
  period: string,
  createdBy: string
) {
  try {
    // Insert the new budget into the database
    const result = await db
      .insert(Budgets)
      .values({
        name,
        amount,
        createdBy,
        icon: emoji,
        timeFrame,
        period,
      })
      .returning({ Budget: Budgets.id });

    if (result) {
      return { success: true, message: "Budget created successfully!" };
    } else {
      return { success: false, message: "Failed to create budget." };
    }
  } catch (error: any) {
    console.log("Error adding budget:", error.message);
    return { success: false, message: "Failed to create budget." };
  }
}

export async function updateBudget(
  name: string,
  amount: number,
  emoji: string,
  id: string
): Promise<{ success: boolean, message: string }> { // Explicit return type
  try {
    const result = await db
      .update(Budgets)
      .set({
        name: name,
        amount: amount,
        icon: emoji,
        updatedAt: new Date()
      })
      .where(eq(Budgets.id, id))
      .returning({ Budget: Budgets.id });

    if (result.length > 0) {
      return { success: true, message: "Budget Updated successfully!" };
    } else {
      return { success: false, message: "Failed to update budget." };
    }
  } catch (error: any) {
    console.error("Error updating budget:", error); // Log the full error object
    return { success: false, message: "Failed to update budget." };
  }
}



export async function getSingleBudgetObject(email: string, id: string) {
  try {
    const result: any = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalCount: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(
        and(
          eq(Budgets.id, id),
          eq(Budgets.createdBy, email)
        )
      )
      .groupBy(Budgets.id)
      .limit(1)
    if (result) {
      return { success: true, message: result };
    } else {
      return { success: false, message: "Failed to fetch budget against id" };
    }

  } catch (error: any) {
    console.log("Error fetching budget:", error.message);
  }

}


export async function getBudgetListForUser(email: string) {
  try {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalCount: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .groupBy(Budgets.id)
      .where(eq(Budgets.createdBy, email));

    const formattedResult: Budgetlist[] = result.map((item) => ({
      ...item,
      totalSpend: item.totalSpend ?? 0,
      totalCount: item.totalCount || 0,
      timeFrame:
        item.timeFrame === "Monthly" || item.timeFrame === "Yearly"
          ? item.timeFrame
          : "Monthly",
    }));

    if (formattedResult) {
      return { success: true, message: formattedResult };
    }
  } catch (error: any) {
    console.log("Error fetching budget for user", error.message);
  }
}


export async function deleteBudgetById(id: string) {
  try {
    const result = await db
      .delete(Budgets)
      .where(eq(Budgets.id, id))
      .returning();
    if (result) {
      return { success: true, message: "Budget Deleted Successfully" };
    }
  } catch (error: any) {
    return { success: true, message: `Failed to deleted Budget ${error.message}` };
  }
}




export async function getBudgetListForUserReports(email: string) {
  try {
    // Step 1: Fetch all budgets for the user, including createdAt, updatedAt, and timeFrame
    const budgets = await db
      .select({
        id: Budgets.id,
        name: Budgets.name,
        amount: Budgets.amount,
        timeFrame: Budgets.timeFrame,
        createdAt: Budgets.createdAt,
        updatedAt: Budgets.updatedAt,
        icon: Budgets.icon, // Assuming 'icon' is stored in the Budget table
      })
      .from(Budgets)
      .where(eq(Budgets.createdBy, email));

    if (budgets.length === 0) {
      throw new Error("No budgets found for the user.");
    }

    // Step 2: Fetch expenses grouped by budgetId and category
    const expenses = await db
      .select({
        budgetId: Expenses.budgetId,
        category: Expenses.category,
        totalAmount: sql`SUM(${Expenses.amount})`.mapWith(Number),
      })
      .from(Expenses)
      .groupBy(Expenses.budgetId, Expenses.category);

    // Step 3: Aggregate data per budget
    const reports = budgets.map((budget) => {
      // Filter expenses belonging to the current budget
      const budgetExpenses = expenses.filter(
        (expense) => expense.budgetId === budget.id
      );

      // Calculate total spending for the budget
      const totalSpend = budgetExpenses.reduce(
        (sum, expense) => sum + (expense.totalAmount || 0),
        0
      );

      // Calculate spending by category
      const spendingByCategory = budgetExpenses.map((expense) => ({
        category: expense.category || "Uncategorized",
        amount: expense.totalAmount || 0,
      }));

      // Find the highest expense category
      const highestExpenseCategory = spendingByCategory.reduce(
        (maxCategory, categoryData) =>
          categoryData.amount > (maxCategory.amount || 0)
            ? categoryData
            : maxCategory,
        { category: "", amount: 0 }
      );

      // Calculate total expense count
      const totalExpenseCount = budgetExpenses.reduce(
        (count, expense) => count + (expense.totalAmount > 0 ? 1 : 0),
        0
      );

      // Prepare the final report object for the current budget
      return {
        id: budget.id,
        name: budget.name,
        totalAmount: budget.amount,
        remainingBalance: budget.amount - totalSpend,
        totalSpend,
        spendingByCategory,
        highestExpenseCategory: highestExpenseCategory.category,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
        totalExpenseCount,
        icon: budget.icon, // Assuming budget has an icon field
        timeFrame: budget.timeFrame, // For monthly/yearly filtering
      };
    });

    return {
      success: true,
      message: "Budgets and reports fetched successfully.",
      data: reports,
    };
  } catch (error: any) {
    console.error("Error generating reports:", error.message);
    return {
      success: false,
      message: `Failed to fetch reports: ${error.message}`,
    };
  }
}

