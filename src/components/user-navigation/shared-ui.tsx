import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function Logo() {
  return <Link href="/" className="vn-logo"><Image src="/avt.png" alt="Logo Trang Trại Tại Nhà" width={42} height={42} /><span>Trang Trại<br /><b>Tại Nhà</b></span></Link>;
}

export function Button({ children, href, light = false }: { children: ReactNode; href: string; light?: boolean }) {
  return <Link href={href} className={`vn-btn ${light ? "light" : ""}`}>{children}</Link>;
}

export function Title({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return <header className="vn-title"><p>{eyebrow}</p><h1>{title}</h1>{sub && <span>{sub}</span>}</header>;
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="vn-back" href={href}><ArrowLeft />{children}</Link>;
}

export function NextAction({ href, children }: { href: string; children: ReactNode }) {
  return <Button href={href}>{children}<ArrowRight /></Button>;
}
