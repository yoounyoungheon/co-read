'use client'
import { ItemType } from "@/app/business/domain/item";
import { Card, CardTitle } from "@/app/ui/components/view/molecule/card/card";
import Form from "@/app/ui/components/view/molecule/form";
import { FormNumberInput } from "@/app/ui/components/view/molecule/form/form-number-input";
import { FormState } from "@/app/ui/components/view/molecule/form/form-root";
import { FormSubmitButton } from "@/app/ui/components/view/molecule/form/form-submit-button";
import { FormTextInput } from "@/app/ui/components/view/molecule/form/form-textinput";
import { useRouter } from "next/navigation";

interface ManageProductDialogProps{
  item: ItemType
}

export function ManageProductDialog({item}:ManageProductDialogProps){
  const router = useRouter()
  
  // TO-DO: 비즈니스 로직 분리 및 api 연동 시 비동기 처리
  function updateAction(prevState: FormState, formData: FormData):FormState{
    console.log(formData.get("update-name"))
    console.log(formData.get("update-price"))
    console.log(formData.get("update-description"))
    return {
      isSuccess: true,
      isFailure: false,
      validationError: {},
      message: '회원가입에 성공했습니다.'
    }
  }

  return(
    <main>
      <Card className="border-none shadow-none justify-items-center overflow-y-auto">
        <CardTitle>수정하기</CardTitle>
        <Form id={"update-action"} action={updateAction} onSuccess={()=>{ router.push("/manager-board"); alert("성공적으로 업데이트되었습니다!");}} failMessageControl={"alert"}>
          <div className="space-y-2">
            <FormTextInput label={""} id={"update-name"} placeholder={item.title}/>
            <FormNumberInput label={""} id={"update-price"} placeholder={`${item.price}`}/>
            <textarea className="items-center rounded-lg border outline-none transition duration-100 shadow-sm w-60 h-32" id={"update-description"}/>
            <FormSubmitButton label={"업데이트하기"} position="center"/>
          </div>
        </Form>
      </Card>
    </main>
  )
}
