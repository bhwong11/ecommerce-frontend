import React,{useEffect,useState} from 'react';
import { useParams,Link,useNavigate } from "react-router-dom";
import {
    useQuery,
    useLazyQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const GET_CATEGORY = gql`
query category($id:ID!){
    category(id:$id){
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
  }
`;
  

const Category:React.FC=()=>{
    const { categoryId } = useParams();
    console.log('cat id',categoryId)
    const { data, loading,error} = useQuery(GET_CATEGORY,{ 
        variables: { id:categoryId} 
        })
    return(
        <div>
            Category Page
            {error?<>{error.toString()}</>:<></>}
            {
                data?
                <>
                    Category: {data.category.name}
                    {data.category.products?
                    data.category.products.map((product:any)=>{
                        return(
                            <>
                            <div>
                                {product.name}
                            </div>
                            <div>
                                {product._id}
                            </div>
                            </>
                        )
                    }):<div>loading...</div>}
                </>:
                <>
                    loading categories...
                </>
            }
            
        </div>
    )
}

export default Category