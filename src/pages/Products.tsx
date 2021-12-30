import React,{useState,useEffect} from 'react';

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

  const GET_CATEGORIES = gql`
  query{
    categories{
      name,
      _id
    }
  }`;

  const GET_PRODUCTS = gql`
  query{
    products{
      _id,
      title,
      price,
      image,
      description,
      user{
        username,
        _id
      },
      category{
        name,
        _id
      }
    }
  }`;

  type User = {
    username:string;
    _id:string;
  }

  type Category={
    _id:string;
    name:string;
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

  const Products = ()=>{
      const [categories, setCategories] = useState<Category[] | null>(null)
      const [products,setProducts] = useState<Product[] | null>(null)
      const {loading:loadingCategoriesQuery, data:categoriesQuery} = useQuery(GET_CATEGORIES,{
        onCompleted({categories}){
            setCategories(categories);
        }})
      const {loading:loadingProductsQuery, data:productsQuery} = useQuery(GET_PRODUCTS,{
        onCompleted({products}){
            setProducts(products);
        }})
      return(
        <>
        Categories
        {categories?<>{categories.map(cat=>{
          return (
            <div>
              {cat.name}
              {cat._id}
              {console.log(products)}
              {products?<div>
                {products.filter(product=>product.category._id===cat._id).map(product=>{
                  return(
                  <div key={product._id}>
                    {product.title}
                  </div>)
                })}
              </div>:<div>loading products...</div>}
            </div>
          )
          })}</>:<>loading cats...</>}
        </>
      )
  }

  export default Products