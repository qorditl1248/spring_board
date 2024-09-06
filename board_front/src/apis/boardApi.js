import { instance } from "./util/instance"

export const boardApi = async(board) => {
  let boardData = {
    isSuccess: false,
    fieldErrors: [{
      field: "",
      defaultMessage: ""
    }],
  }

  try {
    const response = await instance.post("/board", board);
    boardData = {
      isSuccess: true
    }
  } catch(error) {
    const response = error.response;
    boardData = {
      isSuceess: false,
      fieldErrors: response.data.map(fieldError => ({ 
        field: fieldError.field, 
        defaultMessage: fieldError.defaultMessage
      }))
    }
  }
  return boardData;
}