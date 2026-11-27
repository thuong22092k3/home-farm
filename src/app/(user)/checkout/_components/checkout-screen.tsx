"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getFarmAPI } from "@/data/api/farm/farm.api";
import { sendGardenMessageAPI } from "@/data/api/message/message.api";
import { API_BASE_URL } from "@/data/api/apiClient";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constant";
import { useCreatePaymentIntentMutation } from "@/data/api/payment/payment.hooks";
import type { PaymentProvider } from "@/data/api/payment/payment.req";
import type { Order } from "@/data/api/order/order.res";
import { BackLink, Title } from "@/components/user-navigation/shared-ui";
import { useCreateOrderMutation, useOrderQuery } from "@/data/api/order/order.hooks";
import { usePlansQuery } from "@/data/api/plan/plan.hooks";
import { usePlotQuery } from "@/data/api/plot/plot.hooks";
import { formatVnd, getPlanPrice } from "@/lib/helpers/customer-catalog.helper";
import { useAuthStore } from "@/stores/auth-store";

export function CheckoutScreen(){
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [summaryOpen, setSummaryOpen] = useState(false);
  const missingFieldFocus = useRef<HTMLElement | null>(null);
  const user = useAuthStore((state) => state.user);
  const customerId = typeof user?.userId === "string" ? user.userId : undefined;
  const [reservation, setReservation] = useState<Order>();
  const [sessionExpiry, setSessionExpiry] = useState<number>();
  const [provider, setProvider] = useState<PaymentProvider>("VNPAY");
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const loginHref = `/login?redirect=${encodeURIComponent(`/checkout?${searchParams.toString()}`)}`;
  const sendMessage = useMutation({
    retry: false,
    mutationFn: async ({ farmId, senderId, content }: { farmId: string; senderId: string; content: string }) => {
      const farm = await getFarmAPI(farmId);
      if (!farm.farmerId) throw new Error("Chưa xác định được chủ vườn của lô này.");
      return sendGardenMessageAPI({ senderId, recipientId: farm.farmerId, content });
    },
    onSuccess: () => {
      setMessage("");
      setMessageOpen(false);
      toast.success("Đã gửi tin nhắn cho chủ vườn.");
    },
  });
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const [secondsLeft, setSecondsLeft] = useState<number>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showRecipientErrors, setShowRecipientErrors] = useState(false);
  const orderId = searchParams.get("orderId") ?? reservation?.id ?? "";
  const orderQuery = useOrderQuery(orderId, customerId);
  const loadedOrder = orderQuery.data?.id === orderId
    ? orderQuery.data : reservation?.id === orderId ? reservation : undefined;
  const order = loadedOrder?.customerId === customerId ? loadedOrder : undefined;
  const plotId = order?.plotId ?? searchParams.get("plotId") ?? "";
  const planId = order?.planId ?? searchParams.get("planId") ?? "";
  const plotQuery = usePlotQuery(plotId);
  const plansQuery = usePlansQuery();
  const createOrder = useCreateOrderMutation();
  const createPayment = useCreatePaymentIntentMutation();
  const plan = plansQuery.data?.data?.find((item) => item.id === planId);
  const expiry = sessionExpiry ?? order?.paymentExpiresAt;
  const pending = order?.status === "PENDING_PAYMENT";

  useEffect(() => {
    if (!orderId || !customerId) return;
    const refreshOnRestore = (event: PageTransitionEvent) => {
      if (event.persisted) {
        void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      }
    };
    window.addEventListener("pageshow", refreshOnRestore);
    return () => window.removeEventListener("pageshow", refreshOnRestore);
  }, [orderId, customerId, queryClient]);

  useEffect(() => {
    if (!pending || expiry === undefined) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        window.clearInterval(timer);
        void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
        void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLOTS] });
      }
    };
    const timer = window.setInterval(tick, 1000);
    tick();
    return () => window.clearInterval(timer);
  }, [expiry, pending, queryClient]);

  const recipientFields = [
    { id: "recipient-name", label: "Họ và tên", value: name, savedValue: order?.recipientName, setValue: setName, type: "text", autoComplete: "name" },
    { id: "recipient-phone", label: "Số điện thoại", value: phone, savedValue: order?.recipientPhone, setValue: setPhone, type: "tel", autoComplete: "tel" },
    { id: "recipient-address", label: "Địa chỉ nhận nông sản", value: address, savedValue: order?.shippingAddress, setValue: setAddress, type: "text", autoComplete: "street-address" },
  ];

  const submit = async () => {
    if (submitting.current || !customerId || (orderId && !order)) return;
    if (order && (!pending || !expiry || expiry <= Date.now())) return;
    if (!order) {
      const firstMissingField = recipientFields.find(({ value }) => !value.trim());
      if (firstMissingField) {
        setShowRecipientErrors(true);
        const field = document.getElementById(firstMissingField.id);
        if (isMobile && summaryOpen) {
          missingFieldFocus.current = field;
          setSummaryOpen(false);
        } else {
          field?.focus();
        }
        toast.error("Vui lòng điền đầy đủ thông tin người nhận.");
        return;
      }
      if (!plotId || !plan) return;
    }
    submitting.current = true;
    setBusy(true);
    try {
      const heldOrder = order ?? await createOrder.mutateAsync({
        customerId, plotId, planId, fulfillmentMethod: "HOME_DELIVERY",
        recipientName: name.trim(), recipientPhone: phone.trim(), shippingAddress: address.trim(),
      });
      setReservation(heldOrder);
      const returnPage = new URL(window.location.href);
      returnPage.searchParams.set("orderId", heldOrder.id);
      window.history.replaceState(null, "", returnPage);
      const intent = await createPayment.mutateAsync({ orderId: heldOrder.id, provider });
      setSessionExpiry(intent.expiresAt);
      const origin = new URL(API_BASE_URL).origin;
      const sandbox = new URL(intent.checkoutUrl, origin);
      if (intent.mode !== "SANDBOX" || sandbox.origin !== origin ||
        !sandbox.pathname.startsWith("/api/v1/payments/sandbox/")) {
        toast.error("Phiên thanh toán không đúng địa chỉ sandbox.");
        return;
      }
      window.location.assign(sandbox.href);
    } catch {
      // TanStack Query reports the error. The order ID remains available for retry.
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  if (orderId && (!customerId || orderQuery.isError || !order || !pending || secondsLeft === 0)) {
    const paid = order?.status === "PAID" || order?.paymentStatus === "PAID";
    return (
      <section className="vn-narrow">
        <h1 className="text-xl font-bold">{!customerId ? "Đăng nhập để xem đơn" :
          paid ? "Đã thanh toán" : orderQuery.isPending && !orderQuery.isError ? "Đang kiểm tra đơn hàng…" :
          secondsLeft === 0 || order?.status === "EXPIRED" ? "Đơn giữ chỗ đã hết hạn" :
          order ? "Đơn không còn chờ thanh toán" : "Không thể tải đơn hàng"}</h1>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="vn-btn" href={!customerId ? loginHref : paid ? "/orders" : "/explore"}>
            {!customerId ? "Đăng nhập" : paid ? "Xem đơn hàng" : "Quay lại chọn lô"}
          </Link>
          {customerId && orderQuery.isError && <button type="button" onClick={() => void orderQuery.refetch()}>Tải lại</button>}
        </div>
      </section>
    );
  }
  if (!plotId || !planId) return <section className="vn-narrow"><BackLink href="/explore">Chọn cây và gói mùa vụ</BackLink></section>;
  if(plotQuery.isPending||plansQuery.isPending)return <div className="vn-checkout min-h-[60vh] animate-pulse bg-[#e8eadf]"/>;
  if(!plotQuery.data||!plan)return <section className="vn-narrow"><Title eyebrow="THIẾU THÔNG TIN" title="Không tìm thấy cây hoặc gói mùa vụ"/></section>;
  const total = order?.total ?? getPlanPrice(plotQuery.data, plan);
  const details = (<>
    <h3>Thông tin mùa vụ</h3>
    <article>🌱 <span>
    <small>{plotQuery.data.cropType.toUpperCase()}</small>
    <b>{plotQuery.data.id} · {plan.name}</b><em>Mùa {plotQuery.data.season}</em></span></article><p>Gói nhận nuôi <b>{formatVnd(total)}</b></p><p>Phí nền tảng <b>Miễn phí</b></p>
  </>);
  const totalRow = <p className="total">Tổng thanh toán <b>{formatVnd(total)}</b></p>;
  const actions = (<>
  {customerId ? <button type="button" className="vn-btn w-full" disabled={busy || Boolean(order && !expiry)} onClick={submit}>{busy ? "Đang xử lý…" : order ? "Tiếp tục thanh toán demo" : "Đặt đơn và thanh toán demo"}</button> : <Link className="vn-btn w-full" href={loginHref}>Đăng nhập để đặt đơn</Link>}
  {order && <small>Chờ thanh toán{secondsLeft !== undefined && ` · Còn ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`}</small>}
  {customerId ? (
    <button type="button" className="vn-btn light" aria-expanded={messageOpen && (!isMobile || summaryOpen)}
      disabled={sendMessage.isPending} onClick={() => {
        if (isMobile && !summaryOpen) {
          setMessageOpen(true);
          setSummaryOpen(true);
          return;
        }
        setMessageOpen(!messageOpen);
      }}>
      Nhắn chủ vườn
    </button>
  ) : <Link className="vn-btn light" href={loginHref}>Đăng nhập để nhắn chủ vườn</Link>}
    </>);
  const messageForm = customerId && messageOpen && (
    <form className="mt-3" onSubmit={(event) => {
      event.preventDefault();
      if (!message.trim() || !plotQuery.data || sendMessage.isPending) return;
      sendMessage.mutate({ farmId: plotQuery.data.farmId, senderId: customerId, content: message.trim() });
    }}>
      <label className="block">
        Nội dung tin nhắn
        <textarea className="mt-1 w-full rounded-md border p-2" value={message} required maxLength={1000}
          onChange={(event) => setMessage(event.target.value)} disabled={sendMessage.isPending} />
      </label>
      <button type="submit" className="vn-btn" disabled={!message.trim() || sendMessage.isPending}>
        {sendMessage.isPending ? "Đang gửi…" : "Gửi tin nhắn"}
      </button>
    </form>
  );
  return <div className="vn-checkout"><section className={isMobile ? "mb-[calc(11rem+env(safe-area-inset-bottom))]" : undefined}><BackLink href={`/plans?plotId=${plotId}`}>Quay lại chọn gói</BackLink><Title eyebrow="BƯỚC CUỐI CÙNG" title="Đặt cây theo mùa vụ" sub={`Hoàn tất để ${plotQuery.data.cropType} chính thức thuộc về mùa vườn của bạn.`}/><h3>Thông tin người nhận</h3><div className="vn-form">
        {recipientFields.map(({ id, label, value, savedValue, setValue, type, autoComplete }) => {
          const invalid = !order && showRecipientErrors && !value.trim();
          return (
            <label key={id} htmlFor={id}>
              {label}
              <input
                id={id}
                type={type}
                autoComplete={autoComplete}
                required
                disabled={Boolean(order) || busy}
                value={savedValue ?? value}
                onChange={(event) => setValue(event.target.value)}
                aria-invalid={invalid}
                aria-describedby={invalid ? `${id}-error` : undefined}
                className="aria-invalid:border-red-600! scroll-mt-28"
              />
              {invalid && (
                <span id={`${id}-error`} className="font-normal text-red-700">
                  Vui lòng nhập {label.toLocaleLowerCase("vi-VN")}.
                </span>
              )}
            </label>
          );
        })}
      </div><PaymentMethods provider={provider} onChange={setProvider} disabled={busy} /></section>{isMobile ? (
        <Sheet open={summaryOpen} onOpenChange={setSummaryOpen}>
          <div className="vn-order-summary fixed! inset-x-0 bottom-0 top-auto! z-40 rounded-t-2xl border-t px-4! pt-3! pb-[calc(0.75rem+env(safe-area-inset-bottom))]! shadow-[0_-8px_30px_#153f301a] [&_.vn-btn]:mt-2!">
            <SheetTrigger className="flex w-full items-center justify-between gap-2 py-1 text-left">
              <span className="text-sm">Tổng thanh toán</span>
              <span className="flex items-center gap-2">
                <strong className="text-lg">{formatVnd(total)}</strong>
                <span className="flex items-center gap-0.5 text-xs font-semibold">
                  Mở rộng <ChevronUp aria-hidden="true" className="size-4" />
                </span>
              </span>
            </SheetTrigger>
            {actions}
          </div>
          <SheetContent
            side="bottom"
            className="max-h-[90dvh] gap-0 overflow-y-auto overscroll-contain rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)]"
            finalFocus={() => {
              const field = missingFieldFocus.current;
              missingFieldFocus.current = null;
              return field ?? true;
            }}
          >
            <SheetTitle className="px-6 pt-5 pr-12 font-semibold">Tóm tắt đơn hàng</SheetTitle>
            <div className="vn-order-summary static!">{details}{totalRow}{actions}{messageForm}</div>
          </SheetContent>
        </Sheet>
      ) : (
        <aside className="vn-order-summary">{details}{totalRow}{actions}{messageForm}</aside>
      )}
    </div>;
}


const paymentMethods = [
  { id: "vnpay", provider: "VNPAY", label: "VNPay" },
  { id: "bank", provider: "MOBILE_BANKING", label: "Mobile Banking" },
  { id: "momo", provider: "MOMO", label: "MoMo" },
] as const;

function PaymentMethods({ provider, onChange, disabled }: {
  provider: PaymentProvider;
  onChange: (provider: PaymentProvider) => void;
  disabled: boolean;
}) {
  return (
    <fieldset disabled={disabled} className="mt-6 space-y-2" aria-describedby="payment-availability">
      <legend className="mb-2 font-bold">Phương thức thanh toán</legend>
      {paymentMethods.map(({ id, label, provider: value }) => (
        <label key={id} className="flex cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 has-[:checked]:border-[#286c4e] has-[:checked]:bg-[#edf5e7]">
          <Image src={`/payments/${id}.svg`} alt="" width={64} height={40} className="shrink-0" />
          <span className="min-w-0 flex-1">
            <strong className="block">{label}</strong>
          </span>
          <input type="radio" name="payment-method" value={value} checked={provider === value} onChange={() => onChange(value)} className="size-5 shrink-0 accent-[#286c4e]" />
        </label>
      ))}
      <p id="payment-availability" className="text-sm">Thanh toán mô phỏng. Quét QR hoặc tiếp tục trên thiết bị tại trang sandbox. Không cần thông tin thẻ, đăng nhập ngân hàng hay chuyển tiền.</p>
    </fieldset>
  );
}
