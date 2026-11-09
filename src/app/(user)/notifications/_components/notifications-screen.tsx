import Link from "next/link";
import { BellRing, ChevronRight, Droplets, PackageCheck, Video } from "lucide-react";
import { Title } from "@/components/user-navigation/shared-ui";

const notifications = [[BellRing,"Cây A12 vừa có cập nhật","Đợt hoa đầu đã nở đều.","/journal"],[Video,"Livestream sau 15 phút","Cùng chú Bảy kiểm tra vườn.","/livestream"],[PackageCheck,"Đơn OCOP đang được giao","Dự kiến giao trong hôm nay.","/orders"],[Droplets,"Độ ẩm đã về mức lý tưởng","Hệ thống tưới hoàn tất.","/journal"]] as const;

export function NotificationsScreen(){return <section className="vn-narrow"><Title eyebrow="CÓ 3 TIN MỚI" title="Thông báo" sub="Cập nhật từ cây, nhà vườn và đơn hàng."/><div className="vn-tabs"><button>Tất cả</button><button>Cây của tôi</button><button>Đơn hàng</button></div><div className="vn-notices">{notifications.map(([Icon,title,description,href],index)=><Link className={index<3?"new":""} key={title} href={href}><i><Icon/></i><span><b>{title}</b><small>{description}</small><em>{index===0?"2 giờ trước":"Hôm qua"}</em></span><ChevronRight/></Link>)}</div></section>}
