import React,{useState,useEffect} from 'react';
import {ElementsConsumer,useStripe, useElements,PaymentElement,CardElement} from '@stripe/react-stripe-js';

import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const GET_STRIPE_SK = gql`
query stripeKey($amount:Int!){
    stripeKey(amount:$amount)
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

type props = {
    amount:number
    setProducts:(value: any) => void
    cartId:string
}

const CheckoutForm = ({amount,cartId,setProducts}:props) => {
  const [billingError,setBillingError] = useState<string>('');
  const [name,setName]= useState<string>('');
  const [email,setEmail]= useState<string>('');
  const [city,setCity]= useState<string>('');
  const [line1,setLine1]= useState<string>('');
  const [state,setState]= useState<string>('');
  const [postalCode,setPostalCode]= useState<string>('');

  const { data:stripeData, loading:stripeLoading,error:stripeError,refetch:stripeRefetch} = useQuery(GET_STRIPE_SK,{ 
        variables: { amount:(amount*100)},
        onCompleted({stripeKey}){
            console.log('STRIPE KEY',stripeKey)
            } 
        })
  const [clearCartMutation, { data:clearMutationData, loading:clearLoadingMutation, error:clearErrorMutation }] = useMutation(CLEAR_CART,{
    onCompleted({cart}){
      console.log(cart)
    }})
  const stripe = useStripe();
  let elements = useElements();

  const handleSubmit = async (event:React.SyntheticEvent) => {
    setBillingError('')
    event.preventDefault();

    const cardElement:any = elements?elements.getElement("card"):null;
    if(!cardElement || !stripe){
      return
    }

    const billingDetails = {
      name: name,
      email: email,
      address: {
        city: city,
        line1: line1,
        state: state,
        postal_code: postalCode
      }
    };

    const clientSecret = stripeData.stripeKey
  
    const paymentMethodReq:any = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: billingDetails
      });
    console.log('payment method',paymentMethodReq)
    if(!paymentMethodReq){
      return
    }
    if(paymentMethodReq.error){
      setBillingError(paymentMethodReq.error.message)
      return
    }
    
    const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq.paymentMethod.id
      });
    
    console.log('CONFIRM RESULT',result)
    if(result.error){
      setBillingError(result.error.message+"Try again later." || '')
      return
    }

    setProducts([])
    clearCartMutation({ 
      variables: { id:cartId},
      onCompleted({cart}){
          console.log('CART',cart)
          } 
      })

  };
  return (
    <form onSubmit={handleSubmit}>
      {billingError}
      <div className="border-2 border-slate-600 rounded p-2">
      <CardElement/>
      </div>
      <div className="py-2">Billing Information</div>
      <div>
        <div className="flex flex-wrap">
          <div className="m-1">
          <label>
            Name:
            <input className="rounded" type="text" value={name} onChange={(e)=>setName(e.target.value)} />
          </label>
          </div>
          <div className="m-1">
          <label>
            Email:
            <input className="rounded" type="text" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </label>
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="m-1">
          <label>
            Address Line 1:
            <input className="rounded" type="text" value={line1} onChange={(e)=>setLine1(e.target.value)} />
          </label>
          </div>
          <div className="m-1">
          <label>
            Address Line 2:
            <input className="rounded" type="text" />
          </label>
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="m-1">
          <label>
            City: 
            <input className="rounded" type="text" value={city} onChange={(e)=>setCity(e.target.value)} />
          </label>
          </div>
          <div className="m-1">
          <label>
            Postal Code: 
            <input className="rounded" type="text" value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} />
          </label>
          </div>
        </div>
      </div>
      <button className="border-2 border-stone-800 rounded bg-stone-800 text-stone-200 p-2 mt-2" disabled={!stripe}>Confirm Order</button>
    </form>
  );
};

export default CheckoutForm;