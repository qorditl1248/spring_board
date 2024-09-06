import { instance } from "./util/instance"

// 회원가입 api (user 정보들 들고 요청날림)
// export const signupApi = async (user) => {
//   let response = null;
//   try { 
//     response = await instance.post("/auth/signup", user);
//   } catch(error) {
//     response = error.response;
//   }
//   return response; 
// }

export const signupApi = async (user) => {
  
  let signupData = {
    isSuceess: false,
    ok: { // 백엔드에서 resp에 message랑 user
      message: "",
      user: null
    },
    fieldErrors: [{
      field: "",
      defaultMessage: ""
    }],
  }

  try { 
    const response = await instance.post("/auth/signup", user);
    signupData = {
      isSuceess: true,
      ok: response.data
    }
  } catch(error) {
    const response = error.response;
    signupData = {
      isSuceess: false,
      fieldErrors: response.data.map(fieldError => ({ // error가 배열 (map 돌려서 필요한 error만 꺼냄)
        field: fieldError.field, 
        defaultMessage: fieldError.defaultMessage 
      }))
    }
  }
  return signupData; 

}