import { authClient } from "@/src/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { subscriptionKeys } from "./keys";

export async function getSubscriptionList() {
  const { data, error } = await authClient.subscription.list();
  if (error) throw new Error(error.message);

  return data;
}
export type SubscriptionListData = Awaited<
  ReturnType<typeof getSubscriptionList>
>;

export const useSubscriptionListQuery = () => {
  return useQuery({
    queryKey: subscriptionKeys.list(),
    queryFn: getSubscriptionList,
  });
};
