import React,(useEffect,useState) from 'react';
import { useParams,Link,useNavigate } from "react-router-dom";
const { categoryId } = useParams();
import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const GET_CATEGORY = gql`
  query{
    categories{
      name,
      _id,
      products{
        _id,
        title,
        price,
        image,
        description,
        user,
        category,
      }
    }
  }`;

const Category:React.FC=()=>{
    
    return(
        <>
            Category Page
        </>
    )
}

export default Category