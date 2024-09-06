import { instance } from "./util/instance";

// user 이미지 업데이트 api 
export const updateProfileImgApi = async (img) => {
    let response = null;
    try {
      response = await instance.patch("/user/img", {img});
    } catch(error) {
      console.error(error);
      response = error.response;
    }
  return response;
}