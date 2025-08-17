import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

// Base URL from .env file
const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

// ✅ Define Transaction type
type Transaction = {
  merchant: string;
  categoryName: string;
  transactionType: "INCOME" | "EXPENSE";
  amount: number;
  transactionDate: [number, number, number]; // [year, month, day]
};

export default function Report() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);

  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(currentYear, 0, 1) // Jan 1
  );
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(currentYear, 11, 31) // Dec 31
  );
  const [type, setType] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get<Transaction[]>(
        `${BASE_URL}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Apply filters automatically when dependencies change
  useEffect(() => {
    applyFilters();
  }, [startDate, endDate, type, transactions]);

  const applyFilters = () => {
    let data = [...transactions];

    // Filter by date range
    if (startDate && endDate) {
      data = data.filter((t) => {
        const d = new Date(
          t.transactionDate[0],
          t.transactionDate[1] - 1,
          t.transactionDate[2]
        );
        return d >= startDate && d <= endDate;
      });
    }

    // Filter by type
    if (type !== "ALL") {
      data = data.filter((t) => t.transactionType === type);
    }

    setFiltered(data);
  };

  // ✅ Download Excel with formatted values
  const downloadExcel = () => {
    if (filtered.length === 0) return;

    const formatted = filtered.map((t) => ({
      Merchant: t.merchant,
      Category: t.categoryName,
      Type: t.transactionType,
      Amount: `${
        t.transactionType === "EXPENSE" ? "-" : "+"
      } ${t.amount.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
      })}`,
      Date: `${t.transactionDate[0]}-${String(t.transactionDate[1]).padStart(
        2,
        "0"
      )}-${String(t.transactionDate[2]).padStart(2, "0")}`,
    }));

    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  return (
    <div>
      <PageMeta title="Report" description="This is FinSight Report page" />
      <PageBreadcrumb pageTitle="Report" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[900px] text-center">
          <h3 className="mb-6 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Transaction Report
          </h3>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              From
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-white/[0.05] dark:text-white"
              placeholderText="Start Date"
            />

            <label className="text-sm text-gray-700 dark:text-gray-300">
              To
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || undefined}
              dateFormat="yyyy-MM-dd"
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-white/[0.05] dark:text-white"
              placeholderText="End Date"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value as "ALL" | "INCOME" | "EXPENSE")}
              className="w-full sm:w-auto border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-white/[0.05] dark:text-white"
            >
              <option value="ALL">All</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>

            <button
              onClick={downloadExcel}
              disabled={filtered.length === 0}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg transition ${
                filtered.length === 0
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Download Excel
            </button>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 dark:bg-white/[0.08]">
                <tr>
                  <th className="p-3 border dark:border-gray-700 text-sm dark:text-white/90">
                    Merchant
                  </th>
                  <th className="p-3 border dark:border-gray-700 text-sm dark:text-white/90">
                    Category
                  </th>
                  <th className="p-3 border dark:border-gray-700 text-sm dark:text-white/90">
                    Type
                  </th>
                  <th className="p-3 border dark:border-gray-700 text-sm dark:text-white/90">
                    Amount
                  </th>
                  <th className="p-3 border dark:border-gray-700 text-sm dark:text-white/90">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((t, i) => (
                    <tr
                      key={i}
                      className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                    >
                      <td className="p-3 text-sm dark:text-white/90">{t.merchant}</td>
                      <td className="p-3 text-sm dark:text-white/90">{t.categoryName}</td>
                      <td className="p-3 text-sm dark:text-white/90">{t.transactionType}</td>

                      <td
                        className={`p-3 text-sm ${
                          t.transactionType === "EXPENSE"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {`${
                          t.transactionType === "EXPENSE" ? "-" : "+"
                        } ${t.amount.toLocaleString(undefined, {
                          style: "currency",
                          currency: "USD",
                        })}`}
                      </td>

                      <td className="p-3 text-sm dark:text-white/90">
                        {`${t.transactionDate[0]}-${String(
                          t.transactionDate[1]
                        ).padStart(2, "0")}-${String(t.transactionDate[2]).padStart(
                          2,
                          "0"
                        )}`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-4 text-gray-500 dark:text-gray-400 text-sm"
                    >
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
