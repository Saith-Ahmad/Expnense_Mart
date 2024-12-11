"use client";
import React, { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import { useUser } from "@clerk/nextjs";
import { Budgetlist } from "@/constants/constant";
import BudgetItem from "./BudgetItem";
import { Skeleton } from "@/components/ui/skeleton";
import { getBudgetListForUser } from "@/lib/budget.actions";

function BudgetList() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState<Budgetlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return;
    }

    setLoading(true);

    try {
      const result = await getBudgetListForUser(
        user.primaryEmailAddress?.emailAddress
      );
      if (result) {
        setBudgetList(result?.message);
        setLoading(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <CreateBudget refreshData={() => getBudgetList()} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading ? (
          [1, 2, 3, 4, 5].map((data, key) => (
            <div key={key} className="w-full rounded-lg animate-pulse my-6">
              <div className="flex flex-col">
                <Skeleton className="h-[160px] w-full rounded-xl loading_card" />
                <div className="flex flex-col gap-2 mt-1 ms-1">
                  <Skeleton className="h-[10px] w-[250px] loading_card" />
                  <Skeleton className="h-[10px] w-[200px] loading_card" />
                </div>
              </div>
            </div>
          ))
        ) : budgetList.length > 0 ? (
            budgetList.map((budget, index) => (
              <BudgetItem budget={budget} key={index} />
            ))
        ) : (
          // If no budgets found, show a message
          <div className="w-full text-center text-white loading_card py-10 rounded-lg mt-3">
            No budget found
          </div>
        )}
      </div>
    </div>
  );
}

export default BudgetList;
