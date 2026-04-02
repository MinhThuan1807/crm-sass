import { axiosInstance } from "@/lib/api";
import {
  Activity,
  CreateActivityBodyType,
  GetActivitiesResType,
} from "@/lib/validations/activities.scheme";

export const activitiesService = {
  // POST /contacts/:contactId/activities
  create: async (
    contactId: string,
    data: CreateActivityBodyType,
  ): Promise<Activity> => {
    const response = await axiosInstance.post(
      `/contacts/${contactId}/activities`,
      data,
    );
    return response.data;
  },

  // GET /contacts/:contactId/activities — unwrap { data: [...] } từ BE
  getByContact: async (contactId: string): Promise<GetActivitiesResType> => {
    const response = await axiosInstance.get(
      `/contacts/${contactId}/activities`,
    );
    return response.data.data;
  },
};
