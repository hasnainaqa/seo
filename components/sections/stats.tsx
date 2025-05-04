import { SectionHeader } from "../ui/custom/section-headers";

export default function Stats() {
  const stats = [
    { label: "Tracked Keywords", value: "12k+" },
    { label: "Active Users", value: "1.5k+" },
    { label: "Websites Monitored", value: "850+" },
    { label: "Integrations", value: "3+" },
  ];

  return (
    <SectionHeader>
      <SectionHeader.HeaderContent>
        <SectionHeader.Badge>STATS</SectionHeader.Badge>
        <SectionHeader.Heading>
          Empowering SEO with Data-Driven Insights
        </SectionHeader.Heading>
        <SectionHeader.Text>
          Our platform is built to scale, analyze, and empower SEO strategies
          with comprehensive keyword tracking, site monitoring, and seamless
          integrations.
        </SectionHeader.Text>
      </SectionHeader.HeaderContent>

      <SectionHeader.Content>
        <dl className="mg-6 grid grid-cols-1 gap-4 divide-y divide-primary/40 sm:mt-8 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col px-4 py-8 text-center">
              <dt className="order-last text-lg font-medium">{stat.label}</dt>
              <dd className="text-4xl font-extrabold text-primary md:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </SectionHeader.Content>
    </SectionHeader>
  );
}
