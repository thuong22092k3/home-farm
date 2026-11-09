import Link from "next/link";
import { Bell, ShoppingBag } from "lucide-react";
import { Logo } from "./shared-ui";
import { userHeaderLinks } from "@/config/user-navigation";

export function UserHeader() {
  return <header className="vn-top"><div className="vn-top-logo"><Logo /></div><nav>{userHeaderLinks.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><div><Link href="/notifications"><Bell /><i>3</i></Link><Link href="/products/mat-ong-hoa-ca-phe"><ShoppingBag /><i>2</i></Link><Link className="vn-avatar" href="/account">MA</Link></div></header>;
}
