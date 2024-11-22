'use client'

import { ItemType } from "@/app/business/domain/item";
import { Card, CardTitle } from "@/app/ui/components/view/molecule/card/card"
import Form from "@/app/ui/components/view/molecule/form";
import { FormNumberInput } from "@/app/ui/components/view/molecule/form/form-number-input";
import { FormState } from "@/app/ui/components/view/molecule/form/form-root";
import { FormSubmitButton } from "@/app/ui/components/view/molecule/form/form-submit-button";
import { useRouter } from "next/navigation";

interface BookDialogProps{
  item: ItemType
}

export function BookDialog({item}:BookDialogProps){
  const router = useRouter();
  function bookAction(prevState: FormState, formData: FormData):FormState{
    console.log(formData.get("amount"))
    console.log(formData.get("phone-number"))
    return {
      isSuccess: true,
      isFailure: false,
      validationError: {},
      message: '회원가입에 성공했습니다.'
    }
  }
  
  return(
    <main>
      <Card className="border-none shadow-none">
        <CardTitle>{item.title} 예약하기</CardTitle>
        <Form id={"book-action"} action={bookAction} onSuccess={()=>{ router.push("/main-board"); alert("예약 되었습니다.");}} failMessageControl={"alert"}>
          <div className="space-y-2">
            <FormNumberInput label={""} id={"amount"} placeholder={"몇 그램 예약하시겠어요?"}/>
            <FormNumberInput label={""} id={"phone-number"} placeholder={"전화번호를 입력해주세요!"}/>
            <FormSubmitButton label={"예약"}/>
          </div>
        </Form>
      </Card>
    </main>
  )
}