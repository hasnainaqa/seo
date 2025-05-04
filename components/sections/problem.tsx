import { Search, BarChart, MapPin, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/ui/custom/section-headers";

const featuresData = [
  {
    title: "Keyword Tracking",
    description:
      "Track keyword rankings, impressions, and clicks directly from Google Search Console to monitor SEO performance.",
    icon: Search,
  },
  {
    title: "Page Traffic Monitoring",
    description:
      "Analyze which pages attract the most visitors and identify top-performing content based on traffic trends.",
    icon: BarChart,
  },
  {
    title: "Location Traffic Insights",
    description:
      "Discover where your audience is coming from by analyzing traffic based on geographical location.",
    icon: MapPin,
  },
  {
    title: "Growth & Decline Detection",
    description:
      "Easily spot growing and decaying pages to update or optimize your SEO strategy in real-time.",
    icon: TrendingUp,
  },
];

export default function Problem2() {
  return (
    <SectionHeader>
      <SectionHeader.HeaderContent>
        <SectionHeader.Badge>PROBLEM</SectionHeader.Badge>
        <SectionHeader.Heading>
          Challenges in SEO Management
        </SectionHeader.Heading>
        <SectionHeader.Text>
          SEO professionals and website owners often struggle with inefficient
          keyword tracking, lack of actionable insights, and complex data
          integration. Our platform is here to solve that.
        </SectionHeader.Text>
      </SectionHeader.HeaderContent>
      <SectionHeader.Content>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="relative flex items-center gap-3 rounded-lg border-dashed md:block md:border-l md:p-5"
            >
              <span className="md:mb-8 flex h-10 min-w-10 items-center justify-center rounded bg-primary/10 md:h-12 md:w-12">
                <feature.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </span>
              <div>
                <h3 className="text-lg md:text-xl font-semibold">
                  {feature.title}
                  <span className="absolute -left-px h-6 hidden w-px bg-primary md:inline-block"></span>
                </h3>
                <p className="text-sm text-muted-foreground md:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionHeader.Content>
    </SectionHeader>
  );
}
