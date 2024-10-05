import { inter } from "@/app/ui/components/util/fonts";

// page.tsx에서 렌더링한 파일들을 보냄
export default function Layout({children}:{children: React.ReactNode;}){
  return (
    <div>
      {children}
    </div>
  );
}
