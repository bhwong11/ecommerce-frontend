import React,{useState,useEffect} from 'react';
import { ApolloConsumer } from '@apollo/client';
import './App.css';

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    useSubscription,
    gql,
    useMutation,
  } from "@apollo/client";


const GET_REVIEWS = gql`
  query{
    reviews{
      title,
      _id,
      product{
        title
      },
      user{
        username
      }
    }
  }`;

function App() {
  const [reviews,setReviews] = useState<any>(null)
  const {loading,data} = useQuery<any>(GET_REVIEWS)
  console.log(data)
  
  return (
    <>
    {data?<div>{data.reviews[0].title}</div>:<div>loading</div>}
    <div>
      hello world
    </div>
    </>
  );
}

export default App;
