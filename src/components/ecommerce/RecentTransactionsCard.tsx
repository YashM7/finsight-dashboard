import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

type Transaction = {
    merchant: string;
    categoryName: string;
    transactionType: string;
    amount: number;
    transactionDate: [number, number, number];
}

const formatDate = (dateArr: [number, number, number]) => {
    const [year, month, day] = dateArr;
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
};

export default function RecentTransactionsCard() {

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get<Transaction[]>(`${BACKEND_URL}/transactions/top-three`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(response.data.slice(0, 3));
    } catch (err) {
      console.log(err);
    }
  };

  fetchTransactions();
}, []);
  


  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Transactions
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <a href="/transactions">See all</a>
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Merchant
              </TableCell>

              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Amount
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Date
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {transactions.map((t, index) => (
              <TableRow key={index} className="">

                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {t.merchant}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className={`py-3 text-theme-sm ${
                    t.transactionType === "EXPENSE" ? "text-red-500" : "text-green-500"
                }`}>
                  {`${t.transactionType === "EXPENSE" ? "-" : "+"} ${t.amount.toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD",    
                  })}`}
                </TableCell>

                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {formatDate(t.transactionDate)}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
