import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import auth from "./auth";
import message from "./message";

const rootReducer= combineReducers({
  auth:persistReducer(
      {
        key: "form", // key for localStorage key, will be: "persist:form"
        storage,
        debug: true,
      },
      auth),
  message,
});

export default rootReducer

export type RootState = ReturnType<typeof rootReducer>