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
  const {loading,data} = useQuery<any>(GET_REVIEWS,{
    onCompleted({reviews}){
        setReviews(reviews);
    }})
  console.log(data)
  
  return (
    <>
    {data?<div>{data.reviews[0].title}</div>:<div>loading</div>}
    {reviews?<>{reviews[0].user.username}</>:<>None</>}
    <div>
      hello world
    </div>
    <Products/>
    </>
  );
}

export default App;
