'use state'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createExpense } from "@/lib/expense.actions";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type CreateExpenseProps = {
  refreshData: () => Promise<void>;
  id: string;
  budgetAmount: number;
  totalExpenses: number;
};

function AddExpense({ id, refreshData, budgetAmount, totalExpenses }: CreateExpenseProps) {
  const path = usePathname();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>("");

  const categories = ["Food", "Transportation", "Entertainment", "Utilities","House Holds", "Other"];

  const handleExpenseCreation = async () => {
    setLoading(true)
    try {
      if (!category) {
        toast.error("Please select a category.");
        return;
      }

      const result = await createExpense(id, name, amount, category, path, budgetAmount, totalExpenses);
      if (result) {
        toast.success("Expense added successfully!");

        // Reset the states
        setAmount(0);
        setCategory('');
        setName('');

        // Refresh the data after expense is added
        await refreshData();
      }
    } catch (error: any) {
      toast.error(`Failed to add expense. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="w-full gap-y-3 sm:gap-1 py-4 px-4 text-sm lg:text-base stats_card rounded-md">
        <div>
          <h3 className="text-gray-200 font-medium mb-1">Expense Name</h3>
          <Input
            value={name} // Controlled input
            placeholder="e.g Groceries"
            className="border-none bg-secondary bg-opacity-30 text-gray-200"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <h3 className="text-gray-200 font-medium mb-1">Expense Amount</h3>
          <Input
            type="number"
            className="border-none bg-secondary bg-opacity-30 text-gray-200"
            value={amount} // Controlled input
            placeholder="e.g 5000"
            onChange={(e) => {
              const value = Number(e.target.value);
              // Prevent negative or zero values
              if (value > 0) {
                setAmount(value);
              } else {
                setAmount(0); // Reset to 0 for invalid values
              }
            }}
          />
        </div>
        <div>
          <h3 className="text-gray-200 font-medium mb-1">Category</h3>
          <select
            value={category} // Controlled input
            onChange={(e) => setCategory(e.target.value)}
            className="border-none bg-secondary bg-opacity-30 text-gray-200 p-3 rounded-md"
          >
            <option value="" className="bg-backgroundDark1">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-backgroundDark1">
                {cat}
              </option>
            ))}
          </select>
        </div>
        <Button
          disabled={!(name && amount && category) && !loading}
          className="mt-5 btn_class text-white hover:bg-secondaryhover"
          onClick={handleExpenseCreation}
        >
          {loading ? <Loader2 className="text-secondary" /> : "Submit"}
        </Button>
      </div>
    </div>
  );
}

export default AddExpense;
