import React,{useState,useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const GET_CART = gql`
query cart($id:ID!){
    cart(id:$id){
      _id,
      products{
          title,
          price,
          image,
          description,
          category
        }
    }
  }
`

const REMOVE_FROM_CART = gql`
    mutation removeFromCart($id:ID!,$product:ID!) {
        removeFromCart(id:$id,product:$product) {
        _id,
        user,
        products
        }
    }
`
const CLEAR_CART = gql`
    mutation clearCart($id:ID!) {
            clearCart(id:$id) {
            _id,
            user,
            products
            }
        }
`

const Cart = (props:any)=>{
    const {user:currentUser} = useSelector((state:any)=>state.auth)
    const { data:cartData, loading:cartLoading,error:cartError} = useQuery(GET_CART,{ 
        variables: { id:currentUser.cart} 
        })

    const [removeFromCartMutation, { data:removeFromMutationData, loading:removeFromLoadingMutation, error:removeFromErrorMutation }] = useMutation(REMOVE_FROM_CART,{
      onCompleted({cart}){
        console.log(cart)
      }})

    const [clearCartMutation, { data:clearMutationData, loading:clearLoadingMutation, error:clearErrorMutation }] = useMutation(CLEAR_CART,{
      onCompleted({cart}){
        console.log(cart)
      }})

    return(
        <div>
        {cartData?
        cartData.cart.product.map((product:any)=>{
            <div>
                <div>title: {product.title}</div>
                <div>description: {product.description}</div>
                <div>price: {product.price}</div>
                <div>category: {product.category}</div>
                <div>category: {product.category}</div>
            </div>
        }):<>loading cart data...</>}
        </div>
    )
}

export default Cart;