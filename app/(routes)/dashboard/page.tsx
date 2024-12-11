"use client";
import CategoryExpensesChart from "@/components/dashboard/CategoryExpenseChart";
import ComparisonLineChart from "@/components/dashboard/ComparisonLineChart";
import TotalStats from "@/components/dashboard/TotalStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Stats } from "@/constants/constant";
import { getBudgetListForUser } from "@/lib/budget.actions";
import { getDashboardStats } from "@/lib/expense.actions";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user?.primaryEmailAddress?.emailAddress) {
          const result = await getBudgetListForUser(
            user.primaryEmailAddress.emailAddress
          );
          if (!result) {
            router.push("/dashboard/budgets");
            return;
          }
          const stats = await getDashboardStats(
            user.primaryEmailAddress.emailAddress
          );
          setStats(stats);
        }
      } catch (error: any) {
        console.error("Error in Dashboard component:", error.message);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const generateComparisonData = (stats: Stats) => {
    const categories = Object.keys(stats.expensesByCategory || {});
    
    return categories.map((category) => ({
      period: category, // Renamed for compatibility
      expenses: stats.expensesByCategory[category],
      budgets: stats.totalBudgetsAmount / categories.length, // Example logic
    }));
  };
  
  

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen">
      {loading
        ? [...Array(4)].map((_, index) => (
            <div key={index} className="p-3 ms-3 w-full">
              <div className="flex flex-col space-y-3">
                <Skeleton className="h-[100px] w-full rounded-xl loading_card"/>
                <div className="space-y-2">
                  <Skeleton className="h-2 w-[250px] loading_card" />
                </div>
              </div>
            </div>
          ))
        : stats && <TotalStats stats={stats} />}
      <div className="my-3">
        {!loading && stats?.expensesByCategory && (
          <CategoryExpensesChart expensesByCategory={stats.expensesByCategory} />
        )}
      </div>
      <div className="my-10">
        {!loading && stats && (
          <ComparisonLineChart data={generateComparisonData(stats)} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
