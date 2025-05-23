interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="peer-[.header-fixed]/header:mt-16 mb-7">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="font-heading text-2xl font-extrabold">{heading}</h1>
          {text && <p className="text-base text-muted-foreground">{text}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
