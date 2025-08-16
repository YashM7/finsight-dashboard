import { useEffect, useState } from "react";
import axios from "axios";

// Base URL from .env file
const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

interface CategoryEarning {
  categoryName: string;
  totalAmount: number;
}

export default function CategoryEarningCard() {
  const [data, setData] = useState<CategoryEarning[]>([]);
  const [loading, setLoading] = useState(true);

  // Colors for each category (optional fallback)
  const colors = [
  "#6366F1", // Indigo
  "#38BDF8", // Sky Blue
  "#A5F3FC", // Light Cyan
  "#E0E7FF", // Very Light Indigo
  "#8B5CF6", // Violet
  "#F87171", // Soft Red
  "#60A5FA", // Blue-400
  "#C084FC", // Purple-400
  "#F9A8D4", // Pink-300
  "#67E8F9", // Cyan-300
  "#FCD34D", // Yellow-300
  "#FCA5A5", // Red-300
  "#DDD6FE", // Purple-200
  "#93C5FD", // Blue-300
  "#A78BFA", // Violet-400
  "#E879F9", // Fuchsia-400
];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          `${BASE_URL}/transactions/income/earning-by-category`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching earnings data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const total = data.reduce((sum, item) => sum + item.totalAmount, 0);

  const formatCurrency = (num: number) =>
    `$${num.toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

  if (loading) {
    return <div className="p-4 text-gray-500">Loading earnings data...</div>;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        Earning by Category
      </h2>

      <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors[idx % colors.length] }}
            />
            <span className="flex-1 dark:text-white">{item.categoryName}</span>
            <span className="text-gray-800 dark:text-white">
              {((item.totalAmount / total) * 100).toFixed(0)}% (
              {formatCurrency(item.totalAmount)})
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-md text-gray-800 dark:text-white">
        Total: {formatCurrency(total)}
      </div>
    </div>
  );
}
