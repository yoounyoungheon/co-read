import { Nav } from "../ui/components/view/nav/nav";

export default function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <div>
      <Nav/>
      <div className="p-4">{children}</div>
    </div>
  );
}