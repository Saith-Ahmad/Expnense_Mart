"use client";
import React, { useEffect, useState } from "react";
import { getBudgetListForUserReports } from "@/lib/budget.actions";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import ReportCard from "@/components/dashboard/reports/ReportCard";
import { Skeleton } from "@/components/ui/skeleton";
import PieChartReport from "@/components/dashboard/reports/PieChartReport";
import DonutChart from "@/components/dashboard/reports/DonutChart";
import RadarChartComponent from "@/components/dashboard/reports/RadarChart";

function Page() {
  const params = useParams<{ id: string; item: string }>();
  const [budgetData, setBudgetData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress && params?.id) {
      getBudgetData();
    }
  }, [user, params?.id]);
  const getBudgetData = async () => {
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      

      return;
    }

    setLoading(true); // Start loading

    try {
      const result = await getBudgetListForUserReports(
        user.primaryEmailAddress?.emailAddress
      );

      if (result?.data) {
        const selectedBudget = result.data.find(
          (budget) => budget.id === params.id
        );

        if (selectedBudget) {
          setBudgetData(selectedBudget);
        } else {
          setBudgetData(null);
        }
      } else {
        setBudgetData(null);
      }
    } catch (error) {
      setBudgetData(null); // Set empty state on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ">
      {loading ? (
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-[220px] w-full rounded-xl loading_card" />
          <div className="">
            <Skeleton className="h-[10px] w-full loading_card" />
          </div>
        </div>
      ) : budgetData ? (
        <>
          {/* My Differnt Charts for Different Info will Go Here */}
          <div className="flex gap-2 flex-col md:flex-row mb-10">
            <div className="md:w-1/2 w-full  model_card p-5 rounded-lg bg-opacity-50 backdrop-blur-lg">
              <RadarChartComponent
                spendingData={budgetData?.spendingByCategory}
              />
            </div>
            <div className="md:w-1/2 w-full model_card p-5 rounded-lg bg-opacity-50 backdrop-blur-lg">
              <DonutChart
                spend={budgetData?.totalSpend}
                amount={budgetData?.totalAmount}
              />
            </div>
          </div>
          <div className="w-full model_card p-5 rounded-lg bg-opacity-50 backdrop-blur-lg mt-10">
            <PieChartReport data={budgetData?.spendingByCategory} />
          </div>
        </>
      ) : (
        <div className="text-center text-red-500">
          <p className="text-center">
            Failed to fetch report.
            <br /> Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}

export default Page;
