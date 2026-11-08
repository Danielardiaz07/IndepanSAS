import { About } from "@/components/sections/about";
import { Departments } from "@/components/sections/departments";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Location } from "@/components/sections/location";
import { getAllProducts, getDepartments } from "@/lib/catalog";

export default function HomePage() {
  const departments = getDepartments();
  const productCount = getAllProducts().length;
  return (
    <>
      <Hero departments={departments} />
      <Departments departments={departments} />
      <HowItWorks />
      <About productCount={productCount} />
      <Location />
    </>
  );
}
