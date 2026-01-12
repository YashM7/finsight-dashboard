import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import DatePicker from "../../components/form/date-picker.tsx";

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_API_BASE_URL;


type CategoryType = "INCOME" | "EXPENSE";
type AddTransactionRequest = {
  merchant: string;
  amount: number;
  category: {
    name: string;
    type: CategoryType;
  };
  description: string;
  transactionDate: string;
};

export default function AddExpense() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AddTransactionRequest>({
    merchant: "",
    amount: 0,
    category: {
      name: "",
      type: "EXPENSE",
    },
    description: "",
    transactionDate: new Date().toISOString().split("T")[0],
  });

  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get<string[]>(`${BACKEND_URL}/transactions/expense-categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setCategoryOptions(response.data);
      } catch (error) {
        console.error("Error fetching balance:", error);
        toast.error("You have been logged out because of inactivity.");
        setTimeout(function() {
            window.location.href = `${FRONTEND_URL}/signin`;
        }, 4000);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "categoryName") {
      setFormData((prev) => ({
        ...prev,
        category: {
          ...prev.category,
          name: value,
        },
      }));
    } else if (name === "categoryType") {
      setFormData((prev) => ({
        ...prev,
        category: {
          ...prev.category,
          type: value as CategoryType,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "amount" ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use newCategoryName if "Add New Category" is selected
    const finalCategoryName =
      formData.category.name === "ADD_NEW" ? newCategoryName : formData.category.name;

    const finalFormData: AddTransactionRequest = {
      ...formData,
      category: {
        name: finalCategoryName,
        type: formData.category.type,
      },
    };

    console.log(finalFormData);
    try {
      const token = localStorage.getItem("authToken");
      setIsSubmitting(true);
      const postPromise = axios.post(`${BACKEND_URL}/transactions`, finalFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.promise(
        postPromise,
        {
          loading: "Adding transaction...",
          success: "Transaction added successfully!",
          error: "Failed to add transaction.",
        },
        {
          duration: 5000,
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      })
      setFormData({
        merchant: "",
        amount: 0,
        category: {
          name: "",
          type: "EXPENSE",
        },
        description: "",
        transactionDate: new Date().toISOString().split("T")[0],
      });
      setNewCategoryName("");
    } catch (error) {
      toast.error((error as AxiosError)?.message || "Failed to fetch traansactions");
    }
  };

  return (
    <div>
      <PageMeta
        title="Add Expense"
        description="This is FinSight Add Expense page"
      />
      <PageBreadcrumb pageTitle="Add Expense" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Merchant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Merchant
              </label>
              <input
                type="text"
                name="merchant"
                value={formData.merchant}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Transaction Date
              </label>
              <DatePicker
                id="date-picker"
                placeholder="Select a date"
                onChange={(dates) => {
                  if (dates && dates.length > 0) {
                    setFormData((prev) => ({
                      ...prev,
                      transactionDate: dates[0].toISOString().split("T")[0],
                    }));
                  }
                }}
              />
            </div>

            {/* Category Name Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Name
              </label>
              <select
                name="categoryName"
                value={formData.category.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="ADD_NEW">+ Add New Category</option>
              </select>
            </div>

            {/* Conditionally Rendered Input for New Category */}
            {formData.category.name === "ADD_NEW" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Add New Category
                </label>
                <input
                  type="text"
                  name="newCategoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    isSubmitting
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                {isSubmitting ? "Adding..." : "Add Expense"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
