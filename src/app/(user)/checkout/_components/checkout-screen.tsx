"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { BackLink, Title } from "@/components/user-navigation/shared-ui";
import { useCreateOrderMutation } from "@/data/api/order/order.hooks";
import { usePlansQuery } from "@/data/api/plan/plan.hooks";
import { usePlotQuery } from "@/data/api/plot/plot.hooks";
import { formatVnd, getPlanPrice } from "@/lib/helpers/customer-catalog.helper";
import { useAuthStore } from "@/stores/auth-store";

export function CheckoutScreen(){
  const searchParams=useSearchParams();const router=useRouter();
  const plotId=searchParams.get("plotId")??"";const planId=searchParams.get("planId")??"";
  const plotQuery=usePlotQuery(plotId);const plansQuery=usePlansQuery();
  const createOrder=useCreateOrderMutation();
  const user=useAuthStore((state)=>state.user);
  const[name,setName]=useState("");const[phone,setPhone]=useState("");const[address,setAddress]=useState("");
  const plan=plansQuery.data?.find((item)=>item.id===planId);
  const submit = () => {
    if (!plotQuery.data || !plan || typeof user?.userId !== "string") return;
    createOrder.mutate({ customerId: user.userId, plotId, planId, fulfillmentMethod: "HOME_DELIVERY", recipientName: name, recipientPhone: phone, shippingAddress: address }, { onSuccess: () => router.push("/orders") });
  };
  if (!plotId || !planId) return <section className="vn-narrow"><BackLink href="/explore">Chọn cây và gói mùa vụ</BackLink></section>;
  if(plotQuery.isPending||plansQuery.isPending)return <div className="vn-checkout min-h-[60vh] animate-pulse bg-[#e8eadf]"/>;
  if(!plotQuery.data||!plan)return <section className="vn-narrow"><Title eyebrow="THIẾU THÔNG TIN" title="Không tìm thấy cây hoặc gói mùa vụ"/></section>;
  const total=getPlanPrice(plotQuery.data,plan);
  return <div className="vn-checkout"><section><BackLink href={`/plans?plotId=${plotId}`}>Quay lại chọn gói</BackLink><Title eyebrow="BƯỚC CUỐI CÙNG" title="Đặt cây theo mùa vụ" sub={`Hoàn tất để ${plotQuery.data.cropType} chính thức thuộc về mùa vườn của bạn.`}/><h3>Thông tin người nhận</h3><div className="vn-form"><label>Họ và tên<input value={name} onChange={(event)=>setName(event.target.value)}/></label><label>Số điện thoại<input value={phone} onChange={(event)=>setPhone(event.target.value)}/></label><label>Địa chỉ nhận nông sản<input value={address} onChange={(event)=>setAddress(event.target.value)}/></label></div><PaymentMethods /></section><aside className="vn-order-summary"><h3>Thông tin mùa vụ</h3><article>🌱 <span><small>{plotQuery.data.cropType.toUpperCase()}</small><b>{plotQuery.data.id} · {plan.name}</b><em>Mùa {plotQuery.data.season}</em></span></article><p>Gói nhận nuôi <b>{formatVnd(total)}</b></p><p>Phí nền tảng <b>Miễn phí</b></p><p className="total">Tổng thanh toán <b>{formatVnd(total)}</b></p><button className="vn-btn w-full" disabled={createOrder.isPending||typeof user?.userId !== "string"||!name.trim()||!phone.trim()||!address.trim()} onClick={submit}>{createOrder.isPending?"Đang xử lý...":"Tạo đơn giữ chỗ"}</button><small>Đơn sẽ ở trạng thái chờ thanh toán.</small>{typeof user?.userId !== "string" && <BackLink href="/login">Đăng nhập để đặt cây</BackLink>}</aside></div>}

const paymentMethods = [
  { id: "momo", label: "Ví MoMo", detail: "Thanh toán qua ví điện tử" },
  { id: "vnpay", label: "VNPay", detail: "Thanh toán qua cổng VNPay" },
  { id: "bank", label: "Mobile Banking", detail: "Thanh toán bằng ứng dụng ngân hàng" },
] as const;

function PaymentMethods() {
  return (
    <fieldset className="mt-6 space-y-2" aria-describedby="payment-availability">
      <legend className="mb-2 font-bold">Phương thức thanh toán</legend>
      {paymentMethods.map(({ id, label, detail }) => (
        <label key={id} className="flex cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 has-[:checked]:border-[#286c4e] has-[:checked]:bg-[#edf5e7]">
          <Image src={`/payments/${id}.svg`} alt="" width={64} height={40} className="shrink-0" />
          <span className="min-w-0 flex-1">
            <strong className="block">{label}</strong>
            <small className="block">{detail}</small>
          </span>
          <input type="radio" name="payment-method" value={id} className="size-5 shrink-0 accent-[#286c4e]" />
        </label>
      ))}
      <p id="payment-availability" className="text-sm">Cổng thanh toán sandbox chưa được kết nối. Hiện bạn có thể tạo đơn giữ chỗ.</p>
    </fieldset>
  );
}
