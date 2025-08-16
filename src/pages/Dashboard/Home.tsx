import PageMeta from "../../components/common/PageMeta";
import BalanceCard from "../../components/ecommerce/BalanceCard";
import RecentTransactionsCard from "../../components/ecommerce/RecentTransactionsCard";
import BarChart from "../../components/charts/BarChart";
import CategorySpendingCard from "../../components/ecommerce/CategorySpendingCard";
import CategoryEarningCard from "../../components/ecommerce/CategoryEarningCard";

export default function Home() {
  return (
    <>
      <PageMeta
        title="FinSight Dashboard"
        description="FinSight Dashboard"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <BalanceCard />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <RecentTransactionsCard />
        </div>

        <div className="col-span-12 space-y-6">
          <BarChart />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <CategoryEarningCard />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <CategorySpendingCard />
        </div>
      </div>
    </>
  );
}
