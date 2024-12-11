"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import BudgetItem from "@/components/dashboard/budget/BudgetItem";
import AddExpense from "@/components/dashboard/expenses/AddExpense";
import { Skeleton } from "@/components/ui/skeleton";
import { Budgetlist, ExpenseList } from "@/constants/constant";

import { deleteBudgetById, getSingleBudgetObject } from "@/lib/budget.actions";
import { deleteExpenseById, getExpenseList } from "@/lib/expense.actions";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import EditBudget from "@/components/dashboard/expenses/EditBudget";
import SingleBudget from "@/components/dashboard/expenses/SingleBudget";

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string; item: string }>();
  const [budgetObject, setBudgetObject] = useState<Budgetlist>();
  const [loading, setLoading] = useState(false);
  const [expenseList, setExpenseList] = useState<ExpenseList[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && params?.id) {
      getBudget();
    }
  }, [user, params?.id]);

  const getBudget = async () => {
    if (!user || !user.primaryEmailAddress?.emailAddress || !params?.id) {
      return;
    }

    setLoading(true);
    try {
      const result = await getSingleBudgetObject(
        user.primaryEmailAddress.emailAddress,
        params?.id
      );
      setBudgetObject(result?.message[0]);
      fetchExpenseList();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenseList = async () => {
    if (!user?.primaryEmailAddress?.emailAddress || !params?.id) {
      return;
    }
    try {
      const result = await getExpenseList(
        params.id,
        user.primaryEmailAddress.emailAddress
      );
      setExpenseList(result);
    } catch (error) {
    }
  };

  const deleteBudget = async () => {
    try {
      const result = await deleteBudgetById(params?.id);
      if (result?.success) {
        toast.success(result.message);
        router.push("/dashboard/budgets"); // Navigate after successful deletion
      } else {
        toast.error("Failed to delete budget");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the budget");
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const result = await deleteExpenseById(id);
      if (result?.success) {
        toast.success(result.message);
        getBudget();
      } else {
        toast.error("Failed to delete expense");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the expense");
    }
  };

  return (
    <div className="min-h-screen">
      {loading ? (
        <div className="p-3 w-full">
          <div className="flex flex-col space-y-1">
            <Skeleton className="h-[160px] w-full rounded-xl loading_card" />
            <div className="">
              <Skeleton className="h-[10px] w-[250px] loading_card" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {budgetObject ? (
            <div className="flex flex-col w-full">
              <BudgetItem budget={budgetObject} />
              <div className="flex justify-between p-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="btn_class text-white hover:bg-secondaryhover">
                      Delete This Budget
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="stats_card rounded-lg shadow-lg p-6 w-full max-w-md border-none">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-lg font-bold text-gray-200">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-sm text-gray-300">
                        This action cannot be undone. This will permanently
                        delete your budget and associates expences.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="btn_class_primary text-white hover:bg-primaryhover border-none">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={deleteBudget}
                        className="btn_class text-white hover:bg-secondaryhover"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <EditBudget data={budgetObject} refreshData={getBudget} />
              </div>
            </div>
          ) : (
            <div className="w-full text-center text-white stats_card py-10 rounded-lg ">
              <p className="text-xl">Budget Not found</p>
            </div>
          )}
        </>
      )}


      {!loading && (
        <div className="flex flex-col md:flex-row gap-2 my-12">
          <div className="md:w-[70%] w-full">
            {expenseList.length > 0 ? (
              <div className="flex flex-col gap-1">
                {expenseList.map((budget, index) => (
                  <SingleBudget
                    key={index}
                    data={budget}
                    refreshData={getBudget}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full text-center text-white stats_card py-10 rounded-lg ">
                <p className="text-xl">No Expenses found</p>
              </div>
            )}
          </div>

          <div className="md:w-[30%] w-full">
            <AddExpense
              id={params?.id}
              budgetAmount={budgetObject?.amount ?? 0}
              totalExpenses={budgetObject?.totalSpend ?? 0}
              refreshData={getBudget}
            />
          </div>
        </div>
      )}
    </div>
  );
}
