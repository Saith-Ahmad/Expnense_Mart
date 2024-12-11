"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpenseList } from "@/constants/constant";
import { getAllExpensesOfUser } from "@/lib/expense.actions";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import SingleBudget from "./SingleBudget";

function AllExpences() {
  const { user } = useUser();
  const [allExpences, setAllExpenses] = useState<ExpenseList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getAllUserExpences();
    }
  }, [user]);

  const getAllUserExpences = async () => {
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return;
    }
    setLoading(true);
    try {
      const result = await getAllExpensesOfUser(
        user.primaryEmailAddress.emailAddress
      );
      if (result) {
        setAllExpenses(result);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-backgroundDark2">
      {loading ? (
        [1, 2, 3, 4, 5, 6].map((data, key) => (
          <div key={key} className="p-3 w-full">
            <div className="flex flex-col space-y-1">
              <Skeleton className="h-[60px] w-full rounded-xl loading_card"/>
              <div className="">
                <Skeleton className="h-[10px] w-[250px] loading_card"/>
              </div>
            </div>
          </div>
        )) 
      ) : allExpences.length > 0 ? (
        <div className="flex flex-col gap-2">
          {allExpences.map((budget, index) => (
            <SingleBudget key={index} data={budget} refreshData={getAllUserExpences}/>
          ))}
        </div>
      ) : (
        <div className="w-full text-center text-white stats_card py-10 rounded-lg ">
          <p className="text-xl">No Expenses found</p>
        </div>
      )}
    </div>
  );
}

export default AllExpences;
