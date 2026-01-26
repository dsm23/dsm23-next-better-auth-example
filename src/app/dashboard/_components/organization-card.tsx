"use client";

import { useState } from "react";
import { CreateOrganizationForm } from "@/src/components/forms/create-organization-form";
import { InviteMemberForm } from "@/src/components/forms/invite-member-form";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import CopyButton from "@/src/components/ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Label } from "@/src/components/ui/label";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useInvitationCancelMutation } from "@/src/data/organization/invitation-cancel-mutation";
import { useMemberRemoveMutation } from "@/src/data/organization/member-remove-mutation";
import { useOrganizationActiveMutation } from "@/src/data/organization/organization-active-mutation";
import { useOrganizationDetailQuery } from "@/src/data/organization/organization-detail-query";
import { useOrganizationListQuery } from "@/src/data/organization/organization-list-query";
import { useSessionQuery } from "@/src/data/user/session-query";
import { ChevronDownIcon, PlusIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MailPlus } from "lucide-react";
import type { OrganizationRole, Session } from "@/src/lib/auth";

const ORGANIZATION_ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const satisfies Record<string, OrganizationRole>;

const OrganizationCard = (props: { session: Session | null }) => {
  const { data: sessionData } = useSessionQuery();
  const { data: organizations } = useOrganizationListQuery();
  const { data: activeOrganization, isFetching: isOrganizationFetching } =
    useOrganizationDetailQuery();
  const setActiveMutation = useOrganizationActiveMutation();
  const cancelInvitationMutation = useInvitationCancelMutation();
  const removeMemberMutation = useMemberRemoveMutation();

  const session = sessionData || props.session;
  const currentMember = activeOrganization?.members?.find(
    (member) => member.userId === session?.user.id,
  );

  if (isOrganizationFetching) {
    return <OrganizationCardSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
        <div className="flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-1">
                <p className="text-sm">
                  <span className="font-bold"></span>{" "}
                  {activeOrganization?.name || "Personal"}
                </p>

                <ChevronDownIcon />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                className="py-1"
                onClick={() => {
                  setActiveMutation.mutate({ organizationId: null });
                }}
              >
                <p className="sm text-sm">Personal</p>
              </DropdownMenuItem>
              {organizations?.map((org) => (
                <DropdownMenuItem
                  className="py-1"
                  key={org.id}
                  onClick={() => {
                    if (org.id === activeOrganization?.id) {
                      return;
                    }
                    setActiveMutation.mutate({ organizationId: org.id });
                  }}
                >
                  <p className="sm text-sm">{org.name}</p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div>
            <CreateOrganizationDialog />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="rounded-none">
            <AvatarImage
              className="h-full w-full rounded-none object-cover"
              src={activeOrganization?.logo || undefined}
            />
            <AvatarFallback className="rounded-none">
              {activeOrganization?.name?.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{activeOrganization?.name || "Personal"}</p>
            <p className="text-muted-foreground text-xs">
              {activeOrganization?.members?.length || 1} members
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex grow flex-col gap-2">
            <p className="border-b-foreground/10 border-b-2 font-medium">
              Members
            </p>
            <div className="flex flex-col gap-2">
              {activeOrganization?.members?.map((member) => {
                const isRemoving =
                  removeMemberMutation.isPending &&
                  removeMemberMutation.variables?.memberIdOrEmail === member.id;

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-9 w-9 sm:flex">
                        <AvatarImage
                          src={member.user.image || undefined}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {member.user.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">{member.user.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    {member.role !== ORGANIZATION_ROLES.OWNER &&
                      (currentMember?.role === ORGANIZATION_ROLES.OWNER ||
                        currentMember?.role === ORGANIZATION_ROLES.ADMIN) && (
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isRemoving}
                          onClick={() => {
                            removeMemberMutation.mutate({
                              memberIdOrEmail: member.id,
                            });
                          }}
                        >
                          {isRemoving ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : currentMember?.id === member.id ? (
                            "Leave"
                          ) : (
                            "Remove"
                          )}
                        </Button>
                      )}
                  </div>
                );
              })}
              {!activeOrganization?.id && (
                <div>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={session?.user.image || undefined} />
                      <AvatarFallback>
                        {session?.user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{session?.user.name}</p>
                      <p className="text-muted-foreground text-xs">Owner</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex grow flex-col gap-2">
            <p className="border-b-foreground/10 border-b-2 font-medium">
              Invites
            </p>
            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {activeOrganization?.invitations
                  ?.filter((invitation) => invitation.status === "pending")
                  .map((invitation) => {
                    const isCanceling =
                      cancelInvitationMutation.isPending &&
                      cancelInvitationMutation.variables?.invitationId ===
                        invitation.id;

                    return (
                      <motion.div
                        key={invitation.id}
                        className="flex items-center justify-between"
                        variants={{
                          hidden: { opacity: 0, height: 0 },
                          visible: { opacity: 1, height: "auto" },
                          exit: { opacity: 0, height: 0 },
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                      >
                        <div>
                          <p className="text-sm">{invitation.email}</p>
                          <p className="text-muted-foreground text-xs">
                            {invitation.role}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            disabled={isCanceling}
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              cancelInvitationMutation.mutate({
                                invitationId: invitation.id,
                              });
                            }}
                          >
                            {isCanceling ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              "Revoke"
                            )}
                          </Button>
                          <div>
                            <CopyButton
                              textToCopy={`${window.location.origin}/accept-invitation/${invitation.id}`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
              {activeOrganization?.invitations?.filter(
                (invitation) => invitation.status === "pending",
              ).length === 0 && (
                <motion.p
                  className="text-muted-foreground text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  No Active Invitations
                </motion.p>
              )}
              {!activeOrganization?.id && (
                <Label className="text-muted-foreground text-xs">
                  You can&apos;t invite members to your personal workspace.
                </Label>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex w-full justify-end">
          <div>
            <div>{activeOrganization?.id && <InviteMemberDialog />}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default OrganizationCard;

function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full gap-2" variant="default">
          <PlusIcon />
          <p>New Organization</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to collaborate with your team.
          </DialogDescription>
        </DialogHeader>
        <CreateOrganizationForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function InviteMemberDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full gap-2" variant="outline">
          <MailPlus size={16} />
          <p>Invite Member</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite a member to your organization.
          </DialogDescription>
        </DialogHeader>
        <InviteMemberForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function OrganizationCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization</CardTitle>
        <div className="mt-2 flex justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-none" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex grow flex-col gap-2">
            <p className="border-b-foreground/10 border-b-2 font-medium">
              Members
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex grow flex-col gap-2">
            <p className="border-b-foreground/10 border-b-2 font-medium">
              Invites
            </p>
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
