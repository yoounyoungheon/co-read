import { inter } from "@/app/ui/components/util/fonts";

// page.tsx에서 렌더링한 파일들을 보냄
export default function RootLayout({children}:{children: React.ReactNode;}){
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
