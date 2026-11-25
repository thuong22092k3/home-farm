"use client";
import { Title } from "@/components/user-navigation/shared-ui";
import { useLivestreamsQuery } from "@/data/api/livestream/livestream.hooks";

export function LiveScreen() {
  const streams = useLivestreamsQuery();
  return <section className="vn-section">
    <Title eyebrow="TỪ NHÀ VƯỜN" title="Livestream" />
    {streams.isPending && <p>Đang tải lịch phát…</p>}
    {streams.isError && <p>Không tải được lịch phát.</p>}
    {streams.data?.length === 0 && <p>Chưa có buổi phát nào.</p>}
    {streams.data?.map((stream) => <article key={stream.id} className="my-4 border-b pb-4">
      <h2>{stream.title}</h2>
      <p>{stream.status} · {stream.viewerCount} lượt xem</p>
      {/^https?:\/\//i.test(stream.streamUrl) && <a href={stream.streamUrl} target="_blank" rel="noopener noreferrer">Mở buổi phát</a>}
    </article>)}
  </section>;
}
