import { useState } from "react";
import { Phone, Mail, Users, FileText, Clock } from "lucide-react";

import {
  ACTIVITIES_TYPES,
  Activity,
} from "@/lib/validations/activities.scheme";
import LogActivvityForm from "./LogActivityForm";
import { relativeTime } from "@/lib/helper";
import { useCreateActivity } from "@/hooks/useActivities";
import { CreateActivityBodyType } from "@/lib/validations/activities.scheme";

export type ActivityTab =
  | typeof ACTIVITIES_TYPES.CALL
  | typeof ACTIVITIES_TYPES.EMAIL
  | typeof ACTIVITIES_TYPES.MEETING
  | typeof ACTIVITIES_TYPES.NOTE;

interface TimelineItem {
  id: string;
  type:
    | typeof ACTIVITIES_TYPES.CALL
    | typeof ACTIVITIES_TYPES.EMAIL
    | typeof ACTIVITIES_TYPES.MEETING
    | typeof ACTIVITIES_TYPES.NOTE;
  timeLabel: string;
  title: string;
  body: string;
  date?: string;
  aiSuggestion?: string;
}
interface ActivityTimelineProps {
  contactId: string;
  activities: Activity[];
}
const TIMELINE: TimelineItem[] = [
  {
    id: "t1",
    type: ACTIVITIES_TYPES.MEETING,
    timeLabel: "Hôm nay 14:30",
    title: "Cuộc họp trực tiếp",
    body: "Đã gặp CEO tại văn phòng Tập đoàn DEF. Thảo luận về proposal hệ thống quản lý toàn diện. Khách hàng quan tâm đến module HR và tích hợp ERP. Yêu cầu demo kỹ thuật vào tuần sau.",
    aiSuggestion: "AI đã tạo 3 tasks từ note này",
  },
  {
    id: "t2",
    type: ACTIVITIES_TYPES.EMAIL,
    timeLabel: "Hôm qua 09:15",
    title: "Email theo dõi proposal",
    body: "Đã gửi email tóm tắt proposal với báo giá chi tiết và timeline triển khai. Đính kèm case study của 2 khách hàng tương tự trong ngành.",
  },
  {
    id: "t3",
    type: ACTIVITIES_TYPES.CALL,
    timeLabel: "5 ngày trước",
    title: "Cuộc gọi tư vấn kỹ thuật",
    body: "Trao đổi với đội IT về yêu cầu kỹ thuật và tích hợp với hệ thống hiện tại. Xác nhận nhu cầu API với phần mềm kế toán của bên thứ ba.",
    date: "24 phút",
  },
  {
    id: "t4",
    type: ACTIVITIES_TYPES.NOTE,
    timeLabel: "1 tuần trước",
    title: "Ghi chú nội bộ",
    body: "Khách hàng đang xem xét 2 vendor khác. Budget đã được phê duyệt Q1. Quyết định mua hàng dự kiến cuối tháng. Cần theo dõi chặt chẽ.",
  },
];

const TYPE_CONFIG: Record<
  TimelineItem["type"],
  { iconBg: string; iconColor: string; icon: typeof Phone; label: string }
> = {
  [ACTIVITIES_TYPES.MEETING]: {
    iconBg: "#FEF3E2",
    iconColor: "#854F0B",
    icon: Users,
    label: "Cuộc họp",
  },
  [ACTIVITIES_TYPES.EMAIL]: {
    iconBg: "#EEEDFE",
    iconColor: "#534AB7",
    icon: Mail,
    label: "Email",
  },
  [ACTIVITIES_TYPES.CALL]: {
    iconBg: "#E8F5E0",
    iconColor: "#3B6D11",
    icon: Phone,
    label: "Cuộc gọi",
  },
  [ACTIVITIES_TYPES.NOTE]: {
    iconBg: "#F1EFE8",
    iconColor: "#9B9B96",
    icon: FileText,
    label: "Ghi chú",
  },
};

export default function ActivityTimeline({
  contactId,
  activities,
}: ActivityTimelineProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const createActivity = useCreateActivity(contactId);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSubmit = (data: CreateActivityBodyType, reset: () => void) => {
    createActivity.mutate(data);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#F8F8F7]">
      {/* ── Log activity form ── */}
      <LogActivvityForm
        onSubmit={handleSubmit}
        isPending={createActivity.isPending}
      />

      {/* Timeline label */}
      <p
        className="px-6 pt-5 pb-2 text-muted-foreground uppercase"
        style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em" }}
      >
        Lịch sử hoạt động
      </p>

      {/* Timeline items */}
      <div className="px-6 pb-6 flex flex-col gap-0 relative">
        {activities.map((item, index) => {
          const config = TYPE_CONFIG[item.type];
          const Icon = config.icon;
          const isLast = index === TIMELINE.length - 1;
          const isExpanded = expanded[item.id];
          const bodyPreview =
            item.note.length > 100 && !isExpanded
              ? item.note.slice(0, 100) + "…"
              : item.note;

          return (
            <div key={item.id} className="flex gap-3 relative">
              {/* Connector line */}
              {!isLast && (
                <div className="absolute left-4 top-8 bottom-0 w-px bg-border z-0" />
              )}

              {/* Icon */}
              <div
                className="shrink-0 size-8 rounded-full border border-border flex items-center justify-center z-10 mt-0.5"
                style={{ background: config.iconBg }}
              >
                <Icon size={14} color={config.iconColor} strokeWidth={2} />
              </div>

              {/* Content card */}
              <div className="flex-1 bg-background rounded-[10px] border border-border px-3.5 py-3 mb-3">
                {/* Card header */}
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <p
                      className="text-foreground"
                      style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}
                    >
                      {item.title}
                    </p>
                    <div
                      className="flex items-center gap-1 text-muted-foreground"
                      style={{ fontSize: 11 }}
                    >
                      <Clock size={10} />
                      {relativeTime(item.date)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.date && (
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: "#3B6D11",
                          background: "#E8F5E0",
                        }}
                      >
                        {relativeTime(item.date)}
                      </span>
                    )}
                    <span
                      className="px-2 py-0.5 rounded-full"
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        color: config.iconColor,
                        background: config.iconBg,
                      }}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <p
                  className="text-muted-foreground"
                  style={{
                    fontSize: 12,
                    lineHeight: 1.65,
                    marginBottom: item.note.length > 100 ? 4 : 0,
                  }}
                >
                  {bodyPreview}
                </p>
                {item.note.length > 100 && (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="text-primary bg-transparent border-0 cursor-pointer p-0"
                    style={{ fontSize: 11, marginBottom: 0 }}
                  >
                    {isExpanded ? "Rút gọn" : "Xem thêm"}
                  </button>
                )}

                {/* AI suggestion */}
                {/* {item.aiSuggestion && (
                  <div className="mt-2.5 px-3 py-2 rounded-lg bg-[#F5F3FF] border border-[#C4BFF5] flex items-center gap-2">
                    <div className="size-[22px] rounded-md bg-secondary flex items-center justify-center shrink-0">
                      <Sparkles size={12} color="#534AB7" />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-primary"
                        style={{ fontSize: 11, fontWeight: 500, marginBottom: 1 }}
                      >
                        {item.aiSuggestion}
                      </p>
                      <p style={{ fontSize: 10, color: "#7B74C9" }}>
                        Tạo cuộc hẹn demo · Gửi tài liệu kỹ thuật · Cập nhật deal stage
                      </p>
                    </div>
                    <button
                      className="bg-background border border-[#C4BFF5] rounded-md text-primary cursor-pointer whitespace-nowrap px-2.5 py-1"
                      style={{ fontSize: 11, fontWeight: 500 }}
                    >
                      Xem tasks
                    </button>
                  </div>
                )} */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
