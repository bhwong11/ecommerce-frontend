import React,{useState,useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import StripeWrapper from '../components/StripeWrapper';
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
          _id,
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
    const [error,setError]=useState<string>("")
    const [products,setProducts]=useState<any | null>(null)
    const { data:cartData, loading:cartLoading,error:cartError} = useQuery(GET_CART,{ 
        variables: { id:currentUser.cart},
        onCompleted({cart}){
            console.log(cart)
            setProducts(cart.products)
            } 
        })

    const [removeFromCartMutation, { data:removeFromMutationData, loading:removeFromLoadingMutation, error:removeFromErrorMutation }] = useMutation(REMOVE_FROM_CART,{
      onCompleted({cart}){
        console.log(cart)
      }})

    const [clearCartMutation, { data:clearMutationData, loading:clearLoadingMutation, error:clearErrorMutation }] = useMutation(CLEAR_CART,{
      onCompleted({cart}){
        console.log(cart)
      }})
    

    
    const onRemove = async (id:string,product:string)=>{
        try{
            setError('')
            await removeFromCartMutation({ variables: { id,product} })
            const productsCopy = [...products]
            const index = productsCopy.findIndex(e=>e._id===product)
            productsCopy.splice(index,1)
            console.log('Products copy',productsCopy)
            setProducts(productsCopy)
        }catch(err){
            setError('500 server error, try again later')
        }
    }

    if(!currentUser){
        return(
            <div>
                Login To See This Page
            </div>
        )
    }

    return(
        <div>
        {error}
        {products?
            <div>
            {products.map((product:any)=>{
            return(
            <div>
                <div>title: {product.title}</div>
                <div>description: {product.description}</div>
                <div>price: {product.price}</div>
                <div>category: {product.category}</div>
                <button onClick={(e:any)=>onRemove(currentUser.cart,product._id)}>Remove From Cart</button>
            </div>)
        })}
        <StripeWrapper amount={products?products.reduce((a:any,c:any)=>a.price+c.price):0}/>
        </div>:<>loading cart data...</>}
        </div>
        
    )
}

export default Cart;