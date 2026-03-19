import { Card } from "@/app/shared/ui/molecule/card";
import SnapCarousel from "./SnapCarousel";

export const WineRecommendView = () => {
  const items = [
    { title: "레드", desc: "설명 A", img: "/sample/carrot4.jpeg" },
    { title: "화이트", desc: "설명 B", img: "/sample/carrot4.jpeg" },
    { title: "로제", desc: "설명 C", img: "/sample/carrot4.jpeg" },
    { title: "스파클링", desc: "설명 A", img: "/sample/carrot4.jpeg" },
    { title: "꼬냑", desc: "설명 B", img: "/sample/carrot4.jpeg" },
    { title: "기타", desc: "설명 C", img: "/sample/carrot4.jpeg" },
  ];
  return (
    <Card className="my-2 pb-2 w-full flex flex-col gap-1 p-3 max-w-[420px]">
      <div className="flex font-semibold">{`이 음식에는 이런 와인이 잘 어울려요`}</div>
      <div className="flex text-xs text-mysom-darkgray">{`와인 종류를 눌러보면 추천 메뉴를 볼 수 있어요.`}</div>
      <SnapCarousel items={items} />
      <div className="text-sm">
        {`실제 음식과 와인의 페어링은 개인의 취향에 따라 다를 수 있으니 참고용으로만 봐주세요! 실제 음식과 와인의 페어링은 개인의 취향에 따라 다를 수 있으니 참고용으로만 봐주세요! 실제 음식과 와인의 페어링은 개인의 취향에 따라 다를 수 있으니 참고용으로만 봐주세요!`}
      </div>
    </Card>
  );
};
