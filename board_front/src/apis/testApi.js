import { instance } from "./util/instance"

export const testApi = async(inputValue) => {
  let testData = {
    isSuccess: false,
    fieldErrors: [{
      fieldError: "",
      defaultMessage: ""
    }]
  }

  try{ 
    const response = await instance.post("/test", inputValue)
    testData = {
      isSuccess: true
    }
  } catch(error) {
    const response = error.response;
    testData = {
      isSuccess: false,
      fieldErrors: response.data.map((fieldError) => ({
        fieldError: fieldError.field,
        defaultMessage: fieldError.defaultMessage
      }))
    }
  }
  return testData;
}