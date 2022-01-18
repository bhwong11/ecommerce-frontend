import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient,ApolloLink, ApolloProvider, InMemoryCache } from '@apollo/client';
import configureStore from './store';
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {createUploadLink} from 'apollo-upload-client';

const {store,persistor} = configureStore();

const link = createUploadLink({
  uri:'http://localhost:4000/',
})

const client = new ApolloClient({
  link:(link as unknown) as ApolloLink,
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem('token') || '',
  }
});

ReactDOM.render(
  <Provider store = {store}>
  <PersistGate persistor={persistor}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
  </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
