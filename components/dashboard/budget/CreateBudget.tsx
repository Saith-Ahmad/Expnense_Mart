"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useState } from "react";
import { toast } from "sonner";
import { createBudget } from "@/lib/budget.actions";
import { Loader2 } from "lucide-react";

// Helper function to generate year options
const generateYearOptions = (startYear: number, endYear: number) => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};

type CreateBudgetProps = {
  refreshData: () => Promise<void>;
};

function CreateBudget({ refreshData }: CreateBudgetProps) {
  const [emoji, setEmoji] = useState("😊");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [timeFrame, setTimeFrame] = useState<"Monthly" | "Yearly">("Monthly");
  const [month, setMonth] = useState<string>("01"); // Default month to January
  const [year, setYear] = useState<number>(2024); // Default year to 2024
  const [period, setPeriod] = useState(""); // This will store the period as "month-year" for monthly or "year" for yearly
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useUser();

  // Handler for budget creation
  const handleBudgetCreation = async () => {
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return;
    }

    const periodString =
      timeFrame === "Monthly" ? `${month}-${year}` : `${year}`;
    setLoading(true);
    try {
      // Call the server-side function
      const result = await createBudget(
        name,
        amount,
        emoji,
        timeFrame,
        periodString,
        user.primaryEmailAddress.emailAddress
      );

      if (result.success) {
        toast.success(result.message); // Display success toast
        setIsDialogOpen(false); // Close the dialog
        refreshData();
      } else {
        toast.error(result.message); // Display error toast
      }
    } catch (error) {
      toast.error("Failed to create budget.");
    } finally {
      setLoading(false);
    }
  };

  // Conditional rendering for the period input based on time frame
  const renderPeriodInput = () => {
    if (timeFrame === "Monthly") {
      const currentYear = new Date().getFullYear();
      const years = generateYearOptions(currentYear - 5, currentYear + 5); // Show years from 5 years ago to 5 years in the future
      return (
        <div className="">
          <div className="flex gap-3">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border-none bg-secondary bg-opacity-30 text-gray-200 p-2 rounded-md"
            >
              {/* Generate month options */}
              {[
                "01",
                "02",
                "03",
                "04",
                "05",
                "06",
                "07",
                "08",
                "09",
                "10",
                "11",
                "12",
              ].map((monthValue) => (
                <option
                  key={monthValue}
                  value={monthValue}
                  className="bg-backgroundDark1"
                >
                  {new Date(0, parseInt(monthValue) - 1).toLocaleString(
                    "default",
                    { month: "long" }
                  )}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border-none bg-secondary bg-opacity-30 text-gray-200 p-2 rounded-md"
            >
              {/* Generate year options */}
              {years.map((yearOption) => (
                <option
                  key={yearOption}
                  value={yearOption}
                  className="bg-backgroundDark1"
                >
                  {yearOption}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    } else if (timeFrame === "Yearly") {
      const currentYear = new Date().getFullYear();
      const years = generateYearOptions(currentYear - 5, currentYear + 5); // Show years from 5 years ago to 5 years in the future
      return (
        <div>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border-none bg-secondary bg-opacity-30 text-gray-200 p-2 rounded-md"
          >
            {/* Generate year options */}
            {years.map((yearOption) => (
              <option
                key={yearOption}
                value={yearOption}
                className="bg-backgroundDark1"
              >
                {yearOption}
              </option>
            ))}
          </select>
        </div>
      );
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div
            onClick={() => setIsDialogOpen(true)}
            className="stats_card h-[140px] mb-5 p-10 rounded-md flex items-center justify-center flex-col cursor-pointer hover:shadow-md"
          >
            <h2 className="text-4xl text-white">+</h2>
            <h2 className="text-gray-200">Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent className="bg-black rounded-lg border-none text-gray-200 bg-opacity-60 backdrop-blur-lg model_card">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              <Button
                className="text-2xl model_card border-[1px] border-[#ffffff69]"
                variant={"outline"}
                onClick={() => setOpenEmojiPicker((prev) => !prev)}
              >
                {emoji}
              </Button>
              <div className="absolute z-10">
                <EmojiPicker
                  theme={Theme.DARK}
                  open={openEmojiPicker}
                  onEmojiClick={(e) => {
                    setEmoji(e.emoji);
                    setOpenEmojiPicker(false);
                  }}
                />
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <div>
                  <h3 className="text-gray-200 font-medium mb-1">
                    Budget Name
                  </h3>
                  <Input
                    placeholder="e.g Home Decor"
                    className="border-none bg-secondary bg-opacity-30 text-gray-200"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <h3 className="text-gray-200 font-medium mb-1">
                    Budget Amount
                  </h3>
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
                  <div className="flex flex-row justify-start items-center gap-3">
                    <select
                      value={timeFrame}
                      onChange={(e) =>
                        setTimeFrame(e.target.value as "Monthly" | "Yearly")
                      }
                      className="border-none bg-secondary bg-opacity-30 text-gray-200 p-2 rounded-md"
                    >
                      <option value="Monthly" className="bg-backgroundDark1">
                        Monthly
                      </option>
                      <option value="Yearly" className="bg-backgroundDark1">
                        Yearly
                      </option>
                    </select>
                    <div>{renderPeriodInput()}</div>
                  </div>
                </div>
                <Button
                  disabled={!(name && amount && !loading)}
                  className="mt-5 btn_class text-white hover:bg-secondaryhover"
                  onClick={handleBudgetCreation}
                >
                  {loading ? <Loader2 className="text-secondary" /> : "Submit"}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              className="bg-gray-400 hover:bg-gray-500  w-full text-black"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateBudget;
