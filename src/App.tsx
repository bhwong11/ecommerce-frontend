import React,{useState,useEffect} from 'react';
import './App.css';
import Test from "./Test";

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    useSubscription,
    gql,
    useMutation,
  } from "@apollo/client";

const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache()
  });

const GET_REVIEWS = gql`
  query{
      reviews{
          _id
          user{
            username
          }
          product{
            name
            price
          }
          content
      }
  }`;

function App() {
  const [reviews,setReviews] = useState<any>(null)
  const {loading,data} = useQuery<any>(GET_REVIEWS)
  //useEffect(()=>{
  //  setReviews(queryReviews)
  //})
  return (
    <Test/>
  );
}

export default App;
