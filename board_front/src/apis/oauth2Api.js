import { instance } from "./util/instance";

// oauth 통합 api
export const oauth2MergeApi = async(mergeUser) => {

  let mergeData = {
    isSuceess: false,
    fieldErrors: [{
      field: "",
      defaultMessage: ""
    }],
  }

  try { 
    const response = await instance.post("/auth/oauth2/merge", mergeUser);
    mergeData = {
      isSuceess: true
    }
  } catch(error) {
    const response = error.response;
    mergeData = {
      isSuceess: false
    }

    if(typeof(response.data) === 'string') {
      mergeData['errorStatus'] = "loginError";
      mergeData['error'] = response.data;
    } else {
      mergeData['errorStatus'] = "fieldError";
      mergeData['error'] = response.data.map(fieldError => ({
        field: fieldError.field, 
        defaultMessage: fieldError.defaultMessage
      }));
    }
  }
  return mergeData;
} 

// oauth2 회원가입 api
export const oauth2JoinApi = async (user) => {

  let joinData = {
    isSuceess: false,
    ok: { 
      message: "",
      user: null
    },
    fieldErrors: [{
      field: "",
      defaultMessage: ""
    }],
  }

  try { 
    const response = await instance.post("/auth/oauth2/signup", user);
    joinData = {
      isSuceess: true,
      ok: response.data
    }
  } catch(error) {
    const response = error.response;
    joinData = {
      isSuceess: false,
      fieldErrors: response.data.map(fieldError => ({ 
        field: fieldError.field, 
        defaultMessage: fieldError.defaultMessage
      }))
    }
  }
  return joinData; 
}