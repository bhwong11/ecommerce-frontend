import React,{useState,useEffect} from 'react';
import './App.css';

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

import Products from './pages/Products';
import { useDispatch, useSelector } from "react-redux";
import { login } from "./actions/auth";
import RoutesNav from './config/routes';


const App:React.FC=()=> {  
  return (
    <>
    <RoutesNav/>
    </>
  );
}

export default App;
