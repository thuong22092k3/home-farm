"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Logo, Title } from "@/components/user-navigation/shared-ui";
import { useAuthStore } from "@/stores/auth-store";

export type AuthScreenKind = "login" | "signup" | "forgot-password" | "change-password" | "find-id" | "find-password";

const content: Record<AuthScreenKind, { eyebrow: string; title: string; description: string; submit: string }> = {
  login: { eyebrow: "CHÀO MỪNG TRỞ LẠI", title: "Bắt đầu hành trình xanh", description: "Đăng nhập để tiếp tục chăm cây cùng nhà vườn.", submit: "Đăng nhập" },
  signup: { eyebrow: "TẠO TÀI KHOẢN", title: "Gia nhập Vườn Nhà", description: "Tạo tài khoản để nhận nuôi cây và theo dõi mùa vụ.", submit: "Đăng ký" },
  "forgot-password": { eyebrow: "KHÔI PHỤC TÀI KHOẢN", title: "Bạn quên mật khẩu?", description: "Nhập email để nhận hướng dẫn đặt lại mật khẩu.", submit: "Gửi hướng dẫn" },
  "change-password": { eyebrow: "BẢO MẬT TÀI KHOẢN", title: "Đổi mật khẩu", description: "Sử dụng mật khẩu mạnh mà bạn chưa dùng trước đây.", submit: "Cập nhật mật khẩu" },
  "find-id": { eyebrow: "TÌM TÀI KHOẢN", title: "Tìm ID đăng nhập", description: "Xác minh số điện thoại để tìm lại ID tài khoản.", submit: "Tìm ID" },
  "find-password": { eyebrow: "TÌM MẬT KHẨU", title: "Xác minh tài khoản", description: "Nhập ID và email để nhận liên kết đặt lại mật khẩu.", submit: "Gửi liên kết" },
};

export function AuthScreen({ kind }: { kind: AuthScreenKind }) {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [message, setMessage] = useState("");
  const copy = content[kind];
  const needsPassword = kind === "login" || kind === "signup" || kind === "change-password";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (kind === "login") {
      signIn({ identifier: String(form.get("identifier") ?? ""), remember });
      router.push("/");
      return;
    }
    setMessage(kind === "signup" ? "Tài khoản đã được tạo. Bạn có thể đăng nhập ngay." : "Yêu cầu đã được ghi nhận. Vui lòng kiểm tra email của bạn.");
  }

  return <div className="vn-login">
    <div className="vn-login-image"><Image src="/background.png" alt="Nông trại xanh" fill priority/><div><p>THEO DÕI CÂY THẬT · NHẬN QUẢ THẬT</p><h1>Mang một mùa vườn về nhà.</h1><span>Chọn cây từ nhà vườn uy tín và theo dõi từng ngày lớn lên.</span></div></div>
    <form className="vn-login-form" onSubmit={handleSubmit}>
      <Logo/><Title eyebrow={copy.eyebrow} title={copy.title} sub={copy.description}/>
      {(kind === "login" || kind === "signup") && <><button type="button" className="flex h-12 items-center justify-center gap-3 rounded-xl border border-[#dce2d5] bg-white text-sm font-bold transition-colors hover:bg-[#f7f9ff]"><Image src="/FacebookLogo.svg" alt="" width={24} height={24} className="size-6" />{kind === "signup" ? "Đăng ký" : "Tiếp tục"} với Facebook</button><button type="button" className="flex h-12 items-center justify-center gap-3 rounded-xl border border-[#dce2d5] bg-white text-sm font-bold transition-colors hover:bg-[#fafafa]"><Image src="/GoogleLogo.svg" alt="" width={24} height={24} className="size-6" />{kind === "signup" ? "Đăng ký" : "Tiếp tục"} với Google</button><div className="vn-or">hoặc tiếp tục bằng tài khoản</div></>}
      {kind === "signup" && <label>Họ và tên<input name="name" required placeholder="Mai Anh"/></label>}
      {kind === "find-id" ? <label>Số điện thoại<input name="phone" required inputMode="tel" placeholder="090 123 4567"/></label> : <label>{kind === "find-password" ? "ID đăng nhập" : "Email hoặc số điện thoại"}<input name="identifier" required placeholder="mai.anh@email.com"/></label>}
      {kind === "find-password" && <label>Email đã đăng ký<input name="email" type="email" required placeholder="mai.anh@email.com"/></label>}
      {needsPassword && <label>{kind === "change-password" ? "Mật khẩu mới" : "Mật khẩu"}<span className="relative"><input className="w-full pr-11" name="password" required minLength={8} type={showPassword ? "text" : "password"} placeholder="••••••••"/><button type="button" className="absolute inset-y-0 right-0 grid w-11 place-items-center" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>{showPassword ? <EyeOff/> : <Eye/>}</button></span></label>}
      {kind === "change-password" && <label>Xác nhận mật khẩu<input name="confirmPassword" required minLength={8} type="password" placeholder="••••••••"/></label>}
      {kind === "login" && <div className="flex items-center justify-between text-[10px]"><label className="flex items-center gap-2"><input className="size-4" type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)}/>Ghi nhớ đăng nhập</label><Link href="/forgot-password">Quên mật khẩu?</Link></div>}
      <button className="vn-btn" type="submit">{copy.submit}<ArrowRight/></button>
      {message && <p className="text-sm text-[#397958]">{message}</p>}
      {kind === "login" ? <small>Chưa có tài khoản? <Link href="/signup"><b>Đăng ký miễn phí</b></Link></small> : <small><Link href="/login">Quay lại đăng nhập</Link></small>}
      <div className="flex justify-center gap-4 text-[10px] text-[#6c7e74]"><Link href="/find-id">Tìm ID</Link><Link href="/find-password">Tìm mật khẩu</Link><Link href="/change-password">Đổi mật khẩu</Link></div>
    </form>
  </div>;
}
