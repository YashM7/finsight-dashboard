import PageBreadcrumb from "../common/PageBreadCrumb";
import UserInfoCard from "./UserInfoCard";
import PageMeta from "../common/PageMeta";

export default function UserProfiles() {


  return (
    <>
      <PageMeta
        title="User Profile"
        description="This is FinSight userprofile page"
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
