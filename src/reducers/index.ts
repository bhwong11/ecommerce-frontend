import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";

const rootReducer= combineReducers({
  auth,
  message,
});

export default rootReducer

export type RootState = ReturnType<typeof rootReducer>