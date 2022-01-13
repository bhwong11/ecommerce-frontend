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
  console.log('AMOUNT',amount)
  const { data:stripeData, loading:stripeLoading,error:stripeError,refetch:stripeRefetch} = useQuery(GET_STRIPE_SK,{ 
        variables: { amount},
        onCompleted({stripeKey}){
            console.log('STRIPE KEY',stripeKey)
            } 
        })
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event:any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    const cardElement:any = elements?elements.getElement("card"):null;
    if(!cardElement || !stripe){
      return
    }

    const billingDetails = {
      name: 'test name',
      email: 'test email',
      address: {
        city: 'test city',
        line1: 'test line 1',
        state: 'test state',
        postal_code: '42424'
      }
    };

    const paymentMethodReq:any = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: billingDetails
      });
    if(!paymentMethodReq){
      return
    }

    const clientSecret = stripeData.data.stripeKey
    console.log('Client Secret',clientSecret)
    console.log(paymentMethodReq.paymentMethod)
    
    const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq.paymentMethod.id
      });



    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardElement/>
      <button disabled={!stripe}>Submit</button>
    </form>
  );
};

export default CheckoutForm;