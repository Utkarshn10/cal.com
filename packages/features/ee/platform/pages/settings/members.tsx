"use client";

import { checkAdminOrOwner } from "@calcom/features/auth/lib/checkAdminOrOwner";
import { CTA_CONTAINER_CLASS_NAME } from "@calcom/features/data-table/lib/utils";
import Shell from "@calcom/features/shell/Shell";
import { UserListTable } from "@calcom/features/users/components/UserTable/UserListTable";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Button } from "@calcom/ui/components/button";
import NoPlatformPlan from "@calcom/web/components/settings/platform/dashboard/NoPlatformPlan";
import { useGetUserAttributes } from "@calcom/web/components/settings/platform/hooks/useGetUserAttributes";
import { PlatformPricing } from "@calcom/web/components/settings/platform/pricing/platform-pricing/index";

const PlatformMembersView = () => {
  const { t } = useLocale();
  const { isUserLoading, isUserBillingDataLoading, isPlatformUser, isPaidUser, userBillingData, userOrgId } =
    useGetUserAttributes();
  const { data: currentOrg, isPending } = trpc.viewer.organizations.listCurrent.useQuery();

  const isOrgAdminOrOwner = currentOrg && checkAdminOrOwner(currentOrg.user.role);

  const canLoggedInUserSeeMembers =
    (currentOrg?.isPrivate && isOrgAdminOrOwner) || isOrgAdminOrOwner || !currentOrg?.isPrivate;

  if (isUserLoading || (isUserBillingDataLoading && !userBillingData)) {
    return <div className="m-5">Loading...</div>;
  }

  if (isPlatformUser && !isPaidUser)
    return (
      <PlatformPricing
        teamId={userOrgId}
        heading={
          <div className="mb-5 text-center text-2xl font-semibold">
            <h1>Subscribe to Platform</h1>
          </div>
        }
      />
    );

  if (!isPlatformUser)
    return (
      <div>
        <Shell isPlatformUser={true} withoutMain={false} SidebarContainer={<></>}>
          <NoPlatformPlan />
        </Shell>
      </div>
    );

  return (
    <Shell
      heading={
        <div className="flex">
          <h1>Member management</h1>
          <Button
            tooltip="Only teammates invited as admins can create OAuth clients while teammates invited as members have read only access"
            tooltipSide="right"
            className="mx-2 hover:bg-transparent"
            color="minimal"
            variant="icon"
            StartIcon="info"
          />
        </div>
      }
      title={t("platform_members")}
      subtitle={t("platform_members_description")}
      withoutMain={false}
      isPlatformUser={true}
      actions={<div className={CTA_CONTAINER_CLASS_NAME} />}>
      <div>{!isPending && canLoggedInUserSeeMembers && <UserListTable />}</div>
    </Shell>
  );
};

export default PlatformMembersView;
