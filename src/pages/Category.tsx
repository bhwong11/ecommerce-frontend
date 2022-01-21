import React,{useEffect,useState} from 'react';
import { useParams,Link,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  
type Category={
    name:string;
  }

type User = {
    username:string;
    email:string;
  }

type Product={
    _id:string;
    title:string;
    price:number;
    image:string;
    description:string;
    user:User;
    category:Category;
  }

const Category:React.FC=()=>{
    const { categoryId } = useParams();
    const {user:currentUser, isLoggedIn:isLoggedIn} = useSelector((state: any)=>state.auth)
    const { data:categoryData, loading:loadingData,error:errorData} = useQuery(GET_CATEGORY,{ 
        variables: { id:categoryId} 
        })
    const { data:productsData, loading:productsLoading,error:productsError} = useQuery(GET_PRODUCTS,{ 
        variables: { id:categoryId} 
        })
    return(
        <div>
            {
                categoryData?
                <div className="flex flex-col items-center m-6 text-stone-200 text-4xl">
                   <div> CATEGORY: </div>
                    <div className="text-cyan-200 text-2xl">{categoryData.category.name}</div>
                </div>:
                <>
                    loading categories...
                </>
            }

            {productsData?
              <div className="flex flex-wrap justify-evenly">
                {productsData.productsCategorySearch.map((product:Product)=>{
                    return(
                        <div className="flex flex-col items-center border-2 border-cyan-200 rounded-md py-4 text-cyan-200">
                        <div>
                            {product.title}
                        </div>
                        <div>
                            <img className="w-60" src={product.image} alt={`${product.title} image`}/>
                        </div>
                        <div>
                            ${product.price}.00
                        </div>
                        <div>
                            <Link to={`/product/${product._id}`}><button
                            className="border-2 border-cyan-200 rounded-md px-6
                            hover:bg-cyan-200 hover:text-slate-600 transition:ease-in-out"
                            >Info</button></Link>
                        </div>
                        </div>
                    )
                })}
                </div>:<div>No Products</div>}
            {currentUser?currentUser.admin?<div className="flex flex-col items-center py-3">
                <Link to={`/category/${categoryId}/edit`}><div className="text-slate-600 bg-stone-200 rounded p-2">Edit Category</div></Link>
                </div>:<></>:<></>}
        </div>
    )
}

export default Category