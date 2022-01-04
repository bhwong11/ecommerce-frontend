import { createStore, applyMiddleware, combineReducers} from "redux";
import { useDispatch } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

//const persistConfig = {
//  key: 'root',
//  storage
//}
// 
//const persistedReducer = persistReducer(persistConfig, rootReducer)
//
//const store = createStore(
//  persistedReducer,
//  composeWithDevTools(applyMiddleware(thunk))
//);
//const persistor = persistStore(store);
//
//export {store,persistor}

function configureStore(initialState = {}) {
//  const reducer = combineReducers({
//    auth: () => ({ mock: true }),
//    form: persistReducer(
//      {
//        key: "form", // key for localStorage key, will be: "persist:form"
//        storage,
//        debug: true,
//      },
//      rootReducer
//    ),
//  });

  const store = createStore(persistReducer({
    key: "root",
    debug: true,
    storage,
    whitelist: ['user'],
  }, rootReducer), initialState,composeWithDevTools(applyMiddleware(thunk)));

  console.log("initialState", store.getState());

  const persistor = persistStore(store, null, () => {
    // if you want to get restoredState
    console.log("restoredState", store.getState());
  });

  return { store, persistor };
}

export default configureStore
