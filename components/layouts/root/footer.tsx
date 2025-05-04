import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Logo from "@/components/ui/custom/logo";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "FAQ", href: "#faq" },
  ],
  company: [{ name: "Contact", href: "/" }],
  legal: [
    { name: "Privacy", href: "/privacy-policy" },
    { name: "Terms", href: "/tos" },
  ],
};

export default function Footer() {
  return (
    <footer className="pt-12 md:pt-20 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="px-10 py-10 rounded-lg md:py-0 bg-accent/20 border border-accent">
          <div className="flex flex-col md:py-12">
            <div className="flex flex-col gap-6 md:flex-row md:justify-between">
              <div className="space-y-2">
                <Logo />
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  Track your traffic efficiently and save valuable time with our
                  intuitive platform.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                <div className="space-y-3">
                  <h4 className="text-base font-semibold text-muted-foreground">
                    PRODUCT
                  </h4>
                  <ul className="space-y-2">
                    {footerLinks.product.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-base font-semibold text-muted-foreground">
                    LINKS
                  </h4>
                  <ul className="space-y-2">
                    {footerLinks.company.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-base font-semibold text-muted-foreground">
                    LEGAL
                  </h4>
                  <ul className="space-y-2">
                    {footerLinks.legal.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <Separator className="my-8 bg-accent" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                © 2025 Template Docs. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <Link
                  href="https://www.linkedin.com/in/hasnainaqa/"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Linkedin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
