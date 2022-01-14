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

type props = {
    amount:number
}

const CheckoutForm = ({amount}:props) => {
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
  const stripe = useStripe();
  let elements = useElements();

  const handleSubmit = async (event:any) => {
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

  };
  return (
    <form onSubmit={handleSubmit}>
      {billingError}
      <CardElement/>
      <div>Billing Information</div>
      <div>
        <div>
        <label>
          Name:
          <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
        </label>
        </div>
        <div>
        <label>
          Email:
          <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </label>
        </div>
        <div>
        <label>
          City:
          <input type="text" value={city} onChange={(e)=>setCity(e.target.value)} />
        </label>
        </div>
        <div>
        <label>
          Address Line 1:
          <input type="text" value={line1} onChange={(e)=>setLine1(e.target.value)} />
        </label>
        </div>
        <div>
        <label>
          Postal Code:
          <input type="text" value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} />
        </label>
        </div>
      </div>
      <button disabled={!stripe}>Submit</button>
    </form>
  );
};

export default CheckoutForm;