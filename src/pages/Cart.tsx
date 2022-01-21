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
    const [amount,setAmount] = useState<number>(0)
    const { data:cartData, loading:cartLoading,error:cartError} = useQuery(GET_CART,{ 
        variables: { id:currentUser.cart},
        pollInterval: 500,
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
            <div className="mx-10">
            {products.map((product:any)=>{
            return(
            <div className="border-2 rounded border-cyan-200 text-cyan-200 bg-stone-800 mt-2 p-2">
                <div>title: {product.title}</div>
                <div>description: {product.description}</div>
                <div>price: {product.price}</div>
                <button className="border-2 border-cyan-200 rounded-md bg-slate-600 p-2 text-cyan-200 mt-2 hover:bg-cyan-200 hover:text-slate-600 transition:ease-in-out" onClick={(e:any)=>onRemove(currentUser.cart,product._id)}>Remove From Cart</button>
            </div>)
        })}
        <div className="bg-stone-200 text-slate-600 mt-4 p-2 rounded">
        {products.length>0?<StripeWrapper setProducts={setProducts} cartId={currentUser.cart} amount={products&&products.length>0?products.map((product:any)=>product.price).reduce((a:any,c:any)=>a+c):0}/>:<div>Add Products to get started!</div>}
        </div>
        
        </div>:<>loading cart data...</>}
        </div>
        
    )
}

export default Cart;