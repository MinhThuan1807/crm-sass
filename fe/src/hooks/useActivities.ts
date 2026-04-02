"use client";
import { CreateActivityBodyType } from "@/lib/validations/activities.scheme";
import { activitiesService } from "@/services/activities.service";
import { ApiError } from "@/types/error.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ─────────────────────────────────────────
// QUERY KEYS
// ─────────────────────────────────────────
export const activityKeys = {
  all: ["activities"] as const,
  byContact: (contactId: string) =>
    [...activityKeys.all, "contact", contactId] as const,
};

// ─────────────────────────────────────────
// GET BY CONTACT
// ─────────────────────────────────────────
export const useGetActivitiesByContact = (contactId: string) => {
  return useQuery({
    queryKey: activityKeys.byContact(contactId),
    queryFn: () => activitiesService.getByContact(contactId),
    enabled: !!contactId,
    });
};

// ─────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────
export const useCreateActivity = (contactId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActivityBodyType) =>
      activitiesService.create(contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: activityKeys.byContact(contactId),
      });
      toast.success("Tạo hoạt động thành công");
    },
    onError: (error: ApiError) => {
      const message = error.response?.data.message || "Tạo hoạt động thất bại";
      toast.error(message);
    },
  });
};
