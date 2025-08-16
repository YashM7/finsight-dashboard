import PageBreadcrumb from "../common/PageBreadCrumb";
import UserInfoCard from "./UserInfoCard";
import PageMeta from "../common/PageMeta";

export default function UserProfiles() {


  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <UserInfoCard />
        </div>
      </div>
    </>
  );
}
