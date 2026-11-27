"use client";
import { Title } from "@/components/user-navigation/shared-ui";
import { useNotificationsQuery, useReadNotificationMutation } from "@/data/api/notification/notification.hooks";
import { useAuthStore } from "@/stores/auth-store";

export function NotificationsScreen() {
  const id = useAuthStore((state) => state.user?.userId);
  const notifications = useNotificationsQuery(typeof id === "string" ? id : undefined);
  const markRead = useReadNotificationMutation();
  return <section className="vn-narrow">
    <Title eyebrow="CẬP NHẬT TỪ NHÀ VƯỜN" title="Thông báo" />
    {typeof id !== "string" ? <p>Vui lòng đăng nhập để xem thông báo.</p> :
      notifications.isPending ? <p>Đang tải thông báo…</p> :
      notifications.isError ? <p>Không tải được thông báo.</p> :
      !notifications.data?.data.length ? <p>Bạn chưa có thông báo.</p> :
      notifications.data?.data.map((item) => <article key={item.id} className="my-4 border-b pb-4">
        <p>{item.title}</p>
        {!item.readAt && <button type="button" disabled={markRead.isPending} onClick={() => markRead.mutate(item.id)}>Đánh dấu đã đọc</button>}
      </article>)}
  </section>;
}
