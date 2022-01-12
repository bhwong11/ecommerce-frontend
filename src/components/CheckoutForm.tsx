import React,{useState,useEffect} from 'react';
import {ElementsConsumer,useStripe, useElements,PaymentElement,CardElement} from '@stripe/react-stripe-js';

import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const GET_STRIPE_SK = gql`
query stripeKey($amount:Int!){
    stripeKey($amount)
  }
`

type props = {
    amount:number
}

const CheckoutForm = ({amount}:props) => {
  const { data:stripeData, loading:stripeLoading,error:stripeError} = useQuery(GET_STRIPE_SK,{ 
        variables: { amount},
        onCompleted({stripeKey}){
            console.log(stripeKey)
            } 
        })
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event:any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://my-site.com/order/123/complete",
      },
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
    <form>
      <CardElement/>
      <button disabled={!stripe}>Submit</button>
    </form>
  );
};

export default CheckoutForm;