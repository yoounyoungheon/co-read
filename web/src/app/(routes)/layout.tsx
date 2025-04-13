export default function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <div>
      <div className="p-4">{children}</div>
    </div>
  );
}