import Header from "@/components/layouts/root/header";
import Footer from "@/components/layouts/root/footer";
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
