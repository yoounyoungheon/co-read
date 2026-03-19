export interface Profile {
  id: string;

  userId: string;

  introduce: string;

  words: string[];

  gitUrl: string;

  blogUrl: string;
}

export const createProfileDomain = (
  id: string, 
  userId:string, 
  introduce: string, 
  words: string[], 
  gitUrl: string, 
  blogUrl:string
):Profile=>{
  const profile: Profile = { id, userId, introduce, words, gitUrl, blogUrl }; 
  return profile
}