"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  Gift,
  ShieldCheck,
  Sprout,
  Sun,
} from "lucide-react";
import { Button, Title } from "@/components/user-navigation/shared-ui";
import { usePlansQuery } from "@/data/api/plan/plan.hooks";
import { usePlotQuery } from "@/data/api/plot/plot.hooks";
import { formatVnd, getPlanPrice } from "@/lib/helpers/customer-catalog.helper";

const planIcons = {
  SEASONAL: Sprout,
  GUARANTEED: ShieldCheck,
  GIFT: Gift,
  EXPERIENCE: Sun,
} as const;
const descriptions: Record<string, string> = {
  SEASONAL: "Nhận toàn bộ sản lượng thực tế",
  GUARANTEED: "Đảm bảo sản lượng tối thiểu",
  GIFT: "Chứng nhận, thiệp và hộp quà",
  EXPERIENCE: "Cả nhà về vườn tự thu hoạch",
};

export function PackageScreen() {
  const searchParams = useSearchParams();
  const plotId = searchParams.get("plotId") ?? "";
  const plotQuery = usePlotQuery(plotId);
  const plansQuery = usePlansQuery();
  const [pick, setPick] = useState(0);
  if (plansQuery.isPending)
    return (
      <section
        className="vn-narrow"
        aria-busy="true"
        aria-label="Đang tải gói mùa vụ"
      >
        <div
          aria-hidden="true"
          className="min-h-[60vh] rounded-xl bg-[#e8eadf] motion-safe:animate-pulse"
        />
      </section>
    );
  const plans = plansQuery.data?.data ?? [];
  if (plansQuery.isError || plans.length === 0)
    return (
      <section className="vn-narrow">
        <Title
          eyebrow="KHÔNG THỂ TẢI"
          title="Chưa có gói mùa vụ"
          sub="Vui lòng quay lại và thử lại sau."
        />
      </section>
    );
  const plot = plotQuery.data;
  const selectedIndex = Math.min(pick, plans.length - 1);
  const selected = plans[selectedIndex];
  return (
    <section className="vn-narrow">
      <FlowSteps />
      <Title
        eyebrow={plot ? `${plot.cropType.toUpperCase()} · ${plot.id}` : "NHẬN NUÔI CÂY"}
        title="Chọn cách bạn muốn đồng hành"
        sub={
          plot
            ? "So sánh các gói trước khi thanh toán."
            : plotId && plotQuery.isPending
              ? "Đang tải thông tin lô để tính giá."
              : "Chọn lô để xem giá và tiếp tục thanh toán."
        }
      />
      <div className="vn-package-list">
        {plans.map((plan, index) => {
          const Icon = planIcons[plan.type as keyof typeof planIcons] ?? Sprout;
          return (
            <button
              className={selectedIndex === index ? "active" : ""}
              onClick={() => setPick(index)}
              key={plan.id}
            >
              <i>
                <Icon />
              </i>
              <span>
                <b>{plan.name}</b>
                <small>
                  {descriptions[plan.type] ??
                    `${plan.durationMonths} tháng đồng hành cùng nhà vườn`}
                </small>
              </span>
              <strong>
                {plot ? formatVnd(getPlanPrice(plot, plan)) : `${plan.durationMonths} tháng`}
                {plot && <small>/ vụ</small>}
              </strong>
              <em>{selectedIndex === index && <Check />}</em>
            </button>
          );
        })}
      </div>
      <div className="vn-summary">
        {plot ? (
          <>
            <span>
              <small>Tổng thanh toán</small>
              <b>{formatVnd(getPlanPrice(plot, selected))}</b>
            </span>
            <Button href={`/checkout?plotId=${plot.id}&planId=${selected.id}`}>
              Tiếp tục thanh toán <ArrowRight />
            </Button>
          </>
        ) : plotId && plotQuery.isPending ? null : (
          <Button href="/explore">
            Chọn lô <ArrowRight />
          </Button>
        )}
      </div>
    </section>
  );
}

function FlowSteps() {
  return (
    <div className="vn-steps">
      <span className="done">
        <i>
          <Check />
        </i>
        Chọn cây
      </span>
      <b />
      <span className="active">
        <i>2</i>Chọn gói
      </span>
      <b />
      <span>
        <i>3</i>Thanh toán
      </span>
    </div>
  );
}
