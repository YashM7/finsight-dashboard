import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import axios from "axios";

// Base URL from .env file
const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

export default function BarChart() {
  const [dataByYear, setDataByYear] = useState<
    Record<number, { income: number[]; expense: number[] }>
  >({});
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  

  // Fetch all chart data from backend
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const res = await axios.get(
          `${BASE_URL}/transactions/barchart`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDataByYear(res.data);

        const years = Object.keys(res.data).map(Number).sort();
        if (years.length > 0) {
          setSelectedYear(years[years.length - 1]); // Default to first year
        }
      } catch (err) {
        console.error("Error fetching chart data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartOptions: ApexOptions = {
    colors: ["#22c55e", "#ef4444"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 300,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: { show: true, position: "top", horizontalAlign: "left" },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val: number) => `$${val.toFixed(2)}` },
    },
  };

  const chartSeries =
    selectedYear && dataByYear[selectedYear]
      ? [
          { name: "Income", data: dataByYear[selectedYear].income },
          { name: "Expense", data: dataByYear[selectedYear].expense },
        ]
      : [
          { name: "Income", data: Array(12).fill(0) },
          { name: "Expense", data: Array(12).fill(0) },
        ];

  if (loading) {
    return (
      <div className="p-5 text-center text-gray-500">Loading chart data...</div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Statistics
          </h3>

          <div>
            <label className="mr-2 font-medium text-gray-700 dark:text-gray-200">
              Filter by Year:
            </label>
            <select
              value={selectedYear ?? ""}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              {Object.keys(dataByYear)
                .map(Number)
                .sort()
                .map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Chart */}
        <div id="incomeExpenseChart" className="min-w-[1000px]">
          <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />
        </div>
      </div>
    </div>
  );
}
