
import React from "react";
import { Trash2 } from "lucide-react";
import { ExpenseList } from "@/constants/constant";
import { toast } from "sonner";
import { deleteExpenseById } from "@/lib/expense.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

type ExpenseListProps = {
  refreshData: () => Promise<void>;
  data: ExpenseList;
};

const SingleBudget = ({ data, refreshData }: ExpenseListProps) => {
  const deleteExpense = async (id: string) => {
    try {
      const result = await deleteExpenseById(id);
      if (result?.success) {
        toast("Expense Deleted Successfully");
        await refreshData();
      } else {
        throw new Error("Error Occurred in deleting Expense");
      }
    } catch (error: any) {
      toast(error.message);
    }
  };

  return (
    <div className="w-full gap-y-3 sm:gap-0 flex flex-wrap justify-between items-center py-2 px-4 text-sm lg:text-base stats_card rounded-md">
      <div className="w-1/5 text-gray-200 truncate capitalize min-w-[80px]">
        {data.name}
      </div>
      <div className="w-1/5 text-secondary truncate min-w-[80px]">
        {data.category}
      </div>
      <div className="w-1/5 text-gray-200 font-light min-w-[80px]">
        Rs.{" "}{data.expenseAmount.toFixed(1)}
      </div>
      <div className="w-1/5 text-gray-400 min-w-[80px]">
        {data?.createdAt && new Date(data.createdAt).toLocaleDateString()}
      </div>
      <div className="w-1/5 text-right">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="text-red-700 hover:bg-primary hover:bg-opacity-30 rounded-full p-2 transition"
              aria-label="Delete Expense"
            >
              <Trash2 size={20} strokeWidth={3} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="p-5 fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="stats_card rounded-lg shadow-lg p-6 w-full max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-bold text-gray-200">
                  Are you sure you want to delete this expense?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-300">
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex justify-end mt-4 space-x-2">
                <AlertDialogCancel className="px-4 py-2 my-2 bg-gray-200 rounded-md text-black hover:bg-gray-300">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteExpense(data?.expenseId)}
                  className="px-4 py-2 my-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SingleBudget;
