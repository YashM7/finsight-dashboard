import { useState, useEffect} from "react";
import axios from "axios";
import toast from "react-hot-toast";


const BACKEND_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_API_BASE_URL;

export default function BalanceCard() {

    const [balance, setBalance] = useState<number | null>(null);
    const [income, setIncome] = useState<number | null>(null);
    const [expense, setExpense] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
    const token = localStorage.getItem("authToken");
    
    axios
      .get(`${BACKEND_URL}/transactions/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBalance(response.data.balance);
        setIncome(response.data.income);
        setExpense(response.data.expense);
      })
      .catch((error) => {
        console.error("Error fetching balance:", error);
        toast.error("You have been logged out because of inactivity.");
        setTimeout(function() {
            window.location.href = `${FRONTEND_URL}/signin`;
        }, 4000);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

    return (
    <>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Available Balance
            </h3>
            <br />
        </div>

        <div className="max-w-full">
            <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
                {loading ? (
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Loading...</h3>
                ) : (
                    <>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        $ {balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h4>
                    <br />
                    </>
                  )
                }
            </div>
        </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Income
            </h3>
            {loading ? (
              <h3 className="mt-2 font-bold text-title-sm text-green-500">Loading...</h3>
            ) : (
                <>
                  <h4 className="mt-2 font-bold text-title-sm text-green-500">
                    {`${income?.toLocaleString(undefined, {
                          style: "currency",
                          currency: "USD",    
                        })}`}
                  </h4>
                </>
              )}
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Expense
            </h3>
            {loading ? (
              <h3 className="mt-2 font-bold text-title-sm text-red-500">Loading...</h3>
            ) : (
              <>
                <h4 className="mt-2 font-bold text-title-sm text-red-500">
                  {`${expense?.toLocaleString(undefined, {
                        style: "currency",
                        currency: "USD",    
                      })}`}
                </h4>
              </>
            )}
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
    </>
  );
}