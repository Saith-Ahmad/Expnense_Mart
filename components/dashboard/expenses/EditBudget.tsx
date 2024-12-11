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
import { Budgetlist } from "@/constants/constant";
import { updateBudget } from "@/lib/budget.actions";
import { useUser } from "@clerk/nextjs";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type UpdateBudgetProps = {
  refreshData: () => Promise<void>;
  data: Budgetlist | undefined;
};

function EditBudget({ data, refreshData }: UpdateBudgetProps) {
  const [emoji, setEmoji] = useState<string>(data?.icon || ""); // Ensure default value is string
  const [name, setName] = useState(data?.name || ""); // Default value check
  const [amount, setAmount] = useState<number>(data?.amount || 0); // Ensure default is a valid number
  const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog open state
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleBudgetUpdation = async () => {
    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return;
    }

    if (!data?.id) {
      toast.error("Budget ID is missing.");
      return; // Prevent update if ID is missing
    }
    setLoading(true);
    try {
      const result = await updateBudget(name, amount, emoji, data.id); // data.id is now guaranteed to be a string
      if (result) {
        toast.success("Budget Updated successfully!");
        setIsDialogOpen(false);
        await refreshData(); // Ensure data is refreshed after update
      }
    } catch (error: any) {
      toast.error("Failed to update budget.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="btn_class_primary text-white hover:bg-primaryhover"
          >
            Edit Budget
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-black rounded-lg border-none text-gray-200 bg-opacity-60 backdrop-blur-lg model_card">
          <DialogHeader>
            <DialogTitle className="">Edit Budget</DialogTitle>
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
                    value={name} // Use value instead of defaultValue
                    className="border-none bg-secondary bg-opacity-30 text-gray-200 "
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

                <Button
                  disabled={(!name || !amount || !emoji) && !loading} // Disable if fields are not filled
                  className="mt-5 btn_class text-white hover:bg-secondaryhover"
                  onClick={handleBudgetUpdation}
                >
                  {loading ? <Loader2 className="text-secondary" /> : "Submit"}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
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

export default EditBudget;
