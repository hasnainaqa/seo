import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowUpRight,
  Zap,
  BarChart3,
  Rocket,
  Globe,
  Lock,
  Shield,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/custom/section-headers";
import Image from "next/image";

export default function BentoGrid() {
  return (
    <SectionHeader>
      <div className="mx-auto flex flex-col justify-center gap-y-12">
        {/* Title Section */}
        <SectionHeader.HeaderContent>
          <SectionHeader.Badge>SEO INSIGHTS</SectionHeader.Badge>
          <SectionHeader.Heading>
            Unlock Powerful SEO Analytics
          </SectionHeader.Heading>
          <SectionHeader.Text>
            Monitor keyword rankings, page traffic, and location-based
            performance with real-time SEO insights built for growth-focused
            teams.
          </SectionHeader.Text>
        </SectionHeader.HeaderContent>

        {/* Feature Cards - Enhanced Layout */}
        <SectionHeader.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative">
            {/* Feature 1 - Main Feature */}
            <Card className="col-span-1 lg:col-span-2 overflow-visible group relative border border-primary/10 bg-background/60 backdrop-blur-xs hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="absolute -right-2 top-1/2 w-1 h-20 bg-primary/20 rounded transform -translate-y-1/2 group-hover:h-40 group-hover:bg-primary/30 transition-all duration-500"></div>
              <CardContent className="p-8 h-full">
                <div className="absolute -top-6 -left-2 bg-primary text-primary-foreground p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Rocket className="h-6 w-6" />
                </div>
                <div className="pt-6 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    Keyword Tracking & Optimization
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Track keyword rankings across search engines in real time.
                    Easily optimize content for
                    <span className="font-semibold">
                      better visibility
                    </span> and{" "}
                    <span className="font-semibold">
                      higher conversion rates
                    </span>{" "}
                    with actionable insights.
                  </p>
                  <div className="mt-auto flex justify-between items-end">
                    <span className="text-sm font-medium text-muted-foreground">
                      01
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </CardContent>
              <div className="absolute -bottom-4 -right-4 w-72 h-40 rounded-2xl overflow-hidden rotate-6 shadow-xl opacity-90">
                <Image
                  alt="Feature visualization"
                  src="/dummy-image-black.svg"
                  className=" object-cover"
                  width={400}
                  height={400}
                />
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="group relative border-0 bg-linear-to-br from-primary/90 to-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
              <div className="absolute h-full w-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_70%)]"></div>
              <CardContent className="p-8 h-full">
                <div className="absolute -top-6 -left-2 bg-background text-foreground p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div className="pt-6 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-3">
                    Page Traffic Analysis
                  </h3>
                  <p className="text-primary-foreground/90 mb-6">
                    Gain insights into your website's traffic patterns. Track
                    visitor behavior, page views, and conversion rates across
                    different channels.
                  </p>
                  <div className="mt-auto flex justify-between items-end">
                    <span className="text-sm font-medium text-primary-foreground/70">
                      02
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-background opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group relative border border-secondary/20 bg-secondary/10 backdrop-blur-xs hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300">
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-secondary/5 rounded blur-xl"></div>
              <CardContent className="p-8 h-full">
                <div className="absolute -top-6 -left-2 bg-secondary text-secondary-foreground p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="pt-6 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-secondary transition-colors">
                    Location Traffic Tracking
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Monitor traffic from different geographical locations.
                    Understand where your visitors are coming from and tailor
                    your content to different regions.
                  </p>
                  <div className="mt-auto flex justify-between items-end">
                    <span className="text-sm font-medium text-muted-foreground">
                      03
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-secondary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="group relative border-0 bg-linear-to-br from-secondary/90 to-secondary text-secondary-foreground hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300">
              <CardContent className="p-8 h-full">
                <div className="absolute -top-6 -left-2 bg-background text-foreground p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6" />
                </div>
                <div className="pt-6 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-3">
                    Speed Optimization
                  </h3>
                  <p className="text-secondary-foreground/90 mb-6">
                    Enhance website performance by reducing load times and
                    improving user experience. Optimized resources ensure smooth
                    interaction across devices.
                  </p>
                  <div className="mt-auto flex justify-between items-end">
                    <span className="text-sm font-medium text-secondary-foreground/70">
                      04
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-background opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 5 - Content Groups */}
            <Card className="group relative border border-primary/10 bg-background/60 backdrop-blur-xs hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="absolute top-0 left-0 w-16 h-16 bg-primary/5 rounded blur-xl"></div>
              <CardContent className="p-8 h-full">
                <div className="absolute -top-6 -left-2 bg-primary/90 text-primary-foreground p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                  <Globe className="h-6 w-6" />
                </div>
                <div className="pt-6 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    Content Groups
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Content Groups allow you to organize your keywords into
                    clusters, enabling more efficient targeting and improved
                    content strategy. By categorizing related terms together,
                    you can enhance SEO efforts, streamline content creation,
                    and improve user experience.
                  </p>
                  <div className="mt-auto flex justify-between items-end">
                    <span className="text-sm font-medium text-muted-foreground">
                      05
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 6 - Easy Authentication, Fast and Secure */}
            <Card className="col-span-1 lg:col-span-3 group relative border border-primary/20 bg-linear-to-br from-primary/10 to-secondary/10 backdrop-blur-xs hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-primary/5 to-secondary/5 rounded blur-3xl opacity-70"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-linear-to-tr from-secondary/5 to-primary/5 rounded blur-3xl opacity-70"></div>
              <CardContent className="p-8 md:p-10 h-full relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-linear-to-r from-primary/10 to-secondary/10 p-2 rounded-lg mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors">
                      Easy Authentication, Fast and Secure
                    </h3>
                    <p className="text-muted-foreground max-w-xl">
                      Experience the perfect balance between simplicity and
                      security with our easy-to-use authentication system. Enjoy
                      a seamless login process with minimal friction, while
                      benefiting from advanced encryption and security measures.
                      Whether it’s single sign-on or two-factor authentication,
                      your data remains secure while ensuring that users can
                      access their accounts swiftly and safely.
                    </p>
                  </div>
                  <div className="relative shrink-0 w-full max-w-xs md:w-1/3">
                    <div className="aspect-square rounded-2xl overflow-hidden rotate-3 shadow-xl group-hover:rotate-0 transition-transform duration-300">
                      <Image
                        alt="Authentication Process"
                        src="/dummy-image-black.svg"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent opacity-60 group-hover:opacity-0 transition-opacity"></div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded blur-xl"></div>
                    <div className="absolute -top-2 -left-2 w-16 h-16 bg-secondary/10 rounded blur-lg"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </SectionHeader.Content>
      </div>
    </SectionHeader>
  );
}
