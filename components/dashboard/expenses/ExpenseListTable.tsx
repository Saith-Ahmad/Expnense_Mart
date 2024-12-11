import { ExpenseList } from '@/constants/constant';
import { db } from '@/db';
import { Expenses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Trash } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

function ExpenseListTable({ expenseList }: { expenseList: ExpenseList[] }) { // Correct destructuring

    const deleteExpense =async (expense:ExpenseList) => {
       try {
        const deleteExpense = await db.delete(Expenses)
        .where(eq(Expenses.id, expense.expenseId))
        .returning()

        toast("Expense Delete Successfully")
       } catch (error) {
        toast("Error in Expense Delete")
       }

    }
  return (
    <>
      {expenseList.map((expense, index) => (
        <div key={index} className='mt-10 cursor-pointer'>
          <p>{expense.name}</p>
          <p>{expense.expenseAmount}</p>
          <Trash onClick={()=>deleteExpense(expense)}/>
        </div>
      ))}
    </>
  );
}

export default ExpenseListTable;
