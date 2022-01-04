import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import configureStore from './store'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

const {store,persistor} = configureStore();

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
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
