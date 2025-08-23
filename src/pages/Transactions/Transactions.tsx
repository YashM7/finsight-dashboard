import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table"

import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_API_BASE_URL;

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get<Transaction[]>(`${BACKEND_URL}/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching balance:", error);
        toast.error("You have been logged out because of inactivity.");
        setTimeout(function() {
            window.location.href = `${FRONTEND_URL}/signin`;
        }, 4000);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <>
      <PageMeta
        title="Transactions"
        description="This is FinSight Transactions"
      />
      <PageBreadcrumb pageTitle="Transactions" />
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              All Transactions
            </h3>
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
                  Price
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Category
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                    Getting all transactions...
                  </TableCell>
                </TableRow>
              ) : transactions.length > 0 ? (
                transactions.map((t, index) => (
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
                      {t.categoryName}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {formatDate(t.transactionDate)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
