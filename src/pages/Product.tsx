import React,{useEffect,useState} from 'react';
import { useParams,Link,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const GET_PRODUCT = gql`
query product($id:ID!){
    product(id:$id){
      _id,
      title,
      price,
      image,
      description,
      user{
          username
      },
      category{
          name
      }
    }
  }
`;

const GET_REVIEWS = gql`
query reviewsProductSearch($id:ID!){
    reviewsProductSearch(id:$id){
      _id,
      title,
      content,
      product{
          _id,
          title
      },
      user{
          username,
          email
      }
    }
  }
`;

const ADD_TO_CART = gql`
    mutation addToCart($id:ID!,$product:ID!) {
        addToCart(id:$id,product:$product) {
        _id,
        user,
        products
        }
    }
`

const Product:React.FC = ()=>{
    const {productId} = useParams()
    const {user:currentUser, isLoggedIn:isLoggedIn} = useSelector((state: any)=>state.auth)
    const { data:productData, loading:productLoading,error:productError} = useQuery(GET_PRODUCT,{ 
        variables: { id:productId} 
        })
    const { data:reviewsData, loading:reviewsLoading,error:reviewsError} = useQuery(GET_REVIEWS,{ 
        variables: { id:productId} 
        })
    const [addToCartMutation, { data:addToCartMutationData, loading:addToCartLoadingMutation, error:addToCartErrorMutation }] = useMutation(ADD_TO_CART,{
      onCompleted({cart}){
        console.log(cart)
        setAddToCartSuccess('successfully added product to cart')
      }})
    
    const [addToCartSuccess,setAddToCartSuccess] =useState<string>('')

    const addToCart = async (id:string)=>{
        try{
            await addToCartMutation({ variables: { id:currentUser.cart,product:id} })
        }catch(err){
            setAddToCartSuccess('500 error failed to add to cart')
        }
    }

    return(
        <div>
        Product Page{productData?
        <div>
                <div>Product: {productData.product.title}</div>
                <div>Product id: {productData.product._id}</div>
                <div>Price: {productData.product.price}</div>
                <div>Image: {productData.product.image}</div>
                <div>description: {productData.product.description}</div>
                {addToCartSuccess}
                {currentUser?
                <button onClick={()=>addToCart(productData.product._id)}>
                    add to cart
                </button>:
                <></>
                }
                
                <div>
                    <div>Reviews</div>
                    {reviewsData?reviewsData.reviewsProductSearch.map((review:any)=>{
                        return(
                            <div>
                                <div>review: {review.title}</div>
                                <div>content:{review.content}</div>
                                <div>user:{review.user.username}</div>
                            </div>
                        )
                    }):<>loading reviews...</>}
                </div>
                {currentUser.admin?<div>
                <Link to={`/product/${productData.product._id}/edit`}>Edit Product</Link>
                </div>:<></>}
        </div>:
        <>loading product...</>
        }
        </div>
    )
}

export default Product;