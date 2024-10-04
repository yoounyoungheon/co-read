interface TitleProps{
  content: string
};

export default function Title({content}:TitleProps){
  return (
  <h1 className="text-2xl">
    {content}
  </h1>
  )
};