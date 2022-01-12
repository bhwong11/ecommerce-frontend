import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const GET_STRIPE_SK = gql`
query stripeKey{
    stripeKey
  }
`

const stripePromise = loadStripe('pk_test_51K8pRALPWjzsx1Z55vhwprkiC1sybJI3sJphKq8F61p8Y0U5xa7PcoldNYTnc2fbi9fd5YgCMD1FaRQZtNQN6o1s00FQvkqATt');
type props = {
    amount:number
}

const StripeWrapper= ({amount}:props)=> {
    let key = ''
    const options = {
        // passing the client secret obtained from the server
        clientSecret: key,
    };
   const { data:stripeData, loading:stripeLoading,error:stripeError} = useQuery(GET_STRIPE_SK,{ 
        onCompleted({stripeKey}){
            console.log(stripeKey)
            options.clientSecret = stripeKey.toString()
            } 
        })

  return (
    <div>
    {stripeData?
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount}/>
    </Elements>:<></>
    }
    </div>
  );
};

export default StripeWrapper;