import Link from "next/link";
import { Rocket } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      {/* if using image uncommet it and remove the icon */}
      {/* <Image src="/logo.png" width={32} height={32} alt="Logo" /> */}
      <Rocket className="size-6 text-primary" strokeWidth={2.8} />
      <span className="text-[22px] font-extrabold">SEO Analytics</span>
    </Link>
  );
}
