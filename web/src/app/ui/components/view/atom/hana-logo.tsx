import Image from "next/image";
import HanaLogoImage from '@/app/utils/public/HanaLogoImage.png';

export default function HanaLogo() {
  return (
    <div className="flex items-center justify-center leading-none text-emerald-600 min-w-[200px] md:min-w-[202px]">
      <Image
        src={HanaLogoImage}
        alt="None"
        width={50}
        height={50}
      />
      <p className="ml-2 text-[24px] font-medium md:text-[28px] lg:text-[28px]">Bank Hana</p>
    </div>
  );
}