'use client';

import React, { useEffect, useState } from 'react';
import { getBudgetListForUserReports } from '@/lib/budget.actions';
import { useUser } from '@clerk/nextjs';

import ReportCard from './ReportCard';
import { Skeleton } from '@/components/ui/skeleton';

function ReportList() {
  const [budgetList, setBudgetList] = useState<any[]>([]);
  const [filteredBudgets, setFilteredBudgets] = useState<any[]>([]); // Filtered list to display
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All'); // State to store selected filter
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      console.log('User is not authenticated or missing an email address');
      return;
    }

    setLoading(true); // Start loading

    try {
      const result = await getBudgetListForUserReports(user.primaryEmailAddress?.emailAddress);

      if (result?.data) {
        setBudgetList(result.data); // Set the budget list only if result.data is defined
        setFilteredBudgets(result.data); // Initialize filteredBudgets
      } else {
        setBudgetList([]); // If no data is found, set empty array
        setFilteredBudgets([]);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setBudgetList([]); // Set empty array on error
      setFilteredBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (selectedFilter: string) => {
    setFilter(selectedFilter);

    if (selectedFilter === 'All') {
      setFilteredBudgets(budgetList); // Show all budgets
    } else {
      const filtered = budgetList.filter((budget) => budget.timeFrame === selectedFilter);
      setFilteredBudgets(filtered); // Show filtered budgets
    }
  };

  return (
    <div className="min-h-screen">
      {/* Filter Buttons */}
      <div className="flex justify-start space-x-2 mb-5">
        {['All', 'Monthly', 'Yearly'].map((option) => (
          <button
            key={option}
            onClick={() => handleFilterChange(option)}
            className={`py-1 px-5 rounded-full  ${
              filter === option
                ? 'filter_class text-white'
                : 'btn_class text-white'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {loading ? (
        // Loading Skeletons
        [1, 2, 3].map((data, key) => (
          <div key={key} className="p-3 w-full">
            <div className="flex flex-col space-y-1">
              <Skeleton className="h-[160px] w-full rounded-xl loading_card" />
              <div className="">
                <Skeleton className="h-[10px] w-[250px] loading_card" />
              </div>
            </div>
          </div>
        ))
      ) : filteredBudgets.length > 0 ? (
        // Display Filtered Budgets
        <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
          {filteredBudgets.map((budget, index) => (
            <ReportCard key={index} budget={budget} />
          ))}
        </div>
      ) : (
        // No Results Message
        <div className="w-full text-center text-white stats_card py-10 rounded-lg">
          <p className="text-xl">
            No reports found for the selected filter. <br />
            Try a different filter.
          </p>
        </div>
      )}
    </div>
  );
}

export default ReportList;
