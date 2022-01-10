import React,{useEffect,useState} from 'react';
import { useParams,Link,useNavigate } from "react-router-dom";
import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const GET_CATEGORY = gql`
query category($id:ID!){
    category(id:$id){
      name,
      _id
    }
  }
`;

const GET_PRODUCTS = gql`
query productsCategorySearch($id:ID!){
    productsCategorySearch(id:$id){
        _id,
        title,
        price,
        image,
        description,
        user{
          username,
          email
        },
        category{
          name
        },
    }
  }
`;
  

const Category:React.FC=()=>{
    const { categoryId } = useParams();
    console.log('cat id',categoryId)
    const { data:categoryData, loading:loadingData,error:errorData} = useQuery(GET_CATEGORY,{ 
        variables: { id:categoryId} 
        })
    const { data:productsData, loading:productsLoading,error:productsError} = useQuery(GET_PRODUCTS,{ 
        variables: { id:categoryId} 
        })
    return(
        <div>
            <div>Category Page</div>
            {console.log(categoryData)}
            {
                categoryData?
                <>
                    Category: {categoryData.category.name}
                </>:
                <>
                    loading categories...
                </>
            }

            {productsData?
                productsData.productsCategorySearch.map((product:any)=>{
                    return(
                        <>
                        <div>
                            {product.title}
                        </div>
                        <div>
                            {product._id}
                            info: <Link to={`/product/${product._id}`}>Link</Link>
                        </div>
                        </>
                    )
                }):<div>No Products</div>}
            
        </div>
    )
}

export default Category