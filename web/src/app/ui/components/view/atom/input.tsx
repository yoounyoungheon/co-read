interface InputProps {
  input: string
  onChange: ()=>void;
}
export function Input({input, onChange}:InputProps){
  return (
    <input 
      type={input}
      className="p-2.5 px-5 rounded-full w-full
        text-base cursor-pointer 
        bg-blue-100 text-black 
        hover:opacity-80 border-none" 
      onChange={onChange}
      placeholder={input}
      required
    />
  )
}

export function SubmitInput(){
    return (
      <input 
        type='submit'
        className="p-2.5 px-5 rounded-full w-full
          text-base cursor-pointer 
          bg-blue-500 text-white 
          hover:opacity-80 border-none" 
        required
      />
    )
  }