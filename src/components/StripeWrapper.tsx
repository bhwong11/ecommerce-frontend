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
    setProducts:(value: any) => void
    cartId:string
}

const StripeWrapper= ({amount,setProducts,cartId}:props)=> {

  return (
    <div>
    <Elements stripe={stripePromise}>
      <div className="py-2">Card Information</div>
      <CheckoutForm amount={amount} cartId={cartId} setProducts={setProducts}/>
    </Elements>
    </div>
  );
};

export default StripeWrapper;