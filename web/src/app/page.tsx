
import { Card } from "@/app/ui/components/view/molecule/card/card";
import { Dialog, DialogContent, DialogTrigger } from "@/app/ui/components/view/molecule/dialog/dialog";
import OfficeImage from "../app/assets/officeimage.png";

export default function MainPage() {

  return (
    <main>
      <div className="p-10 text-center text-3xl text-blue-950 font-bold">{`Younghun's Portfolio`}</div>
      <div className="px-5 grid grid-cols-1 gap-5">
        <Card className="p-10 text-center">{`안녕하세요 개발자 윤영헌의 포트폴리오입니다.`}</Card>
        <div className="grid grid-cols-3 gap-5">
        <Dialog>
            <DialogTrigger asChild>
              <Card
                className="relative p-10 border-none text-center shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 bg-cover bg-center"
                style={{ backgroundImage: `url(${OfficeImage.src})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
                <div className="relative flex items-center justify-center space-x-2 text-white text-xl font-semibold">
                  <span>About Me</span>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent>
              
            </DialogContent>
          </Dialog>
          
          <div>
            <Card
              className="relative p-10 border-none text-center shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 bg-cover bg-center"
              style={{ backgroundImage: `url(${OfficeImage.src})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
              <div className="relative flex items-center justify-center space-x-2 text-white text-xl font-semibold">
                <span>Project</span>
              </div>
            </Card>
          </div>

          <div>
            <Card
              className="relative p-10 border-none text-center shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 bg-cover bg-center"
              style={{ backgroundImage: `url(${OfficeImage.src})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
              <div className="relative flex items-center justify-center space-x-2 text-white text-xl font-semibold">
                <span>Article</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
