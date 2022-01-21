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
          email,
          _id
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

const CREATE_REVIEW = gql`
    mutation createReview($title:String!,$content:String!,$product:ID!,$user:ID!) {
        createReview(title:$title,content:$content,product:$product,user:$user) {
        _id,
        title,
        content,
        product,
        user
        }
    }
`

const EDIT_REVIEW = gql`
    mutation updateReview($id:ID!,$title:String!,$content:String!,$product:ID!,$user:ID!) {
        updateReview(id:$id,title:$title,content:$content,product:$product,user:$user) {
        _id,
        title,
        content,
        product,
        user
        }
    }
`

const DELETE_REVIEW = gql`
    mutation deleteReview($id:ID!,$title:String!,$content:String!,$product:ID!,$user:ID!) {
        deleteReview(id:$id,title:$title,content:$content,product:$product,user:$user) {
        _id,
        title,
        content,
        product,
        user
        }
    }
`

const Product:React.FC = ()=>{
    const {productId} = useParams()
    const {user:currentUser, isLoggedIn:isLoggedIn} = useSelector((state: any)=>state.auth)
    const { data:productData, loading:productLoading,error:productError} = useQuery(GET_PRODUCT,{ 
        variables: { id:productId} 
        })
    const { data:reviewsData, loading:reviewsLoading,error:reviewsError} = useQuery(GET_REVIEWS,
        { 
        variables: { id:productId},
        pollInterval: 500 
        })
    const [addToCartMutation, { data:addToCartMutationData, loading:addToCartLoadingMutation, error:addToCartErrorMutation }] = useMutation(ADD_TO_CART,{
      onCompleted({cart}){
        console.log(cart)
        setAddToCartSuccess('successfully added product to cart')
      }})
    
    const [createReviewMutation, { data:createReviewMutationData, loading:createReviewLoadingMutation, error:createReviewErrorMutation }] = useMutation(CREATE_REVIEW,{
        onCompleted({createReview}){
          console.log('REVIew',createReview)
        }})
    
    const [editReviewMutation, { data:editReviewMutationData, loading:editReviewLoadingMutation, error:editReviewErrorMutation }] = useMutation(EDIT_REVIEW,{
            onCompleted({review}){
              console.log(review)
            }})
    
    const [deleteReviewMutation, { data:deleteReviewMutationData, loading:deleteReviewLoadingMutation, error:deleteReviewErrorMutation }] = useMutation(DELETE_REVIEW,{
                onCompleted({review}){
                  console.log(review)
                }})        
    
    const [addToCartSuccess,setAddToCartSuccess] =useState<string>('');
    const [reviewError,setReviewError] = useState<string>('');
    const [title,setTitle]=useState<string>('');
    const [content,setContent]=useState<string>('');

    const addToCart = async (id:string)=>{
        try{
            await addToCartMutation({ variables: { id:currentUser.cart,product:id} })
        }catch(err){
            setAddToCartSuccess('500 error failed to add to cart')
        }
    }

    const createReview=async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try{
            await createReviewMutation({ variables: { title,content,product:productId,user:currentUser._id} })
        }catch(err){
            setReviewError('unable to create reivew at this time, try again later')
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
                    <form onSubmit={createReview}>
                        <label>
                            <div>title:</div>
                            <input value={title} onChange={(e)=>setTitle(e.target.value)}></input>
                        </label>
                        <label>
                            <div>content:</div>
                            <textarea value={content} onChange={(e)=>setContent(e.target.value)}>
                            </textarea>
                        </label>
                        <div>
                        <button>Create Review</button>
                        </div>
                    </form>
                    {reviewsData?reviewsData.reviewsProductSearch.map((review:any)=>{
                        return(
                            <div>
                                <div>review: {review.title}</div>
                                <div>content:{review.content}</div>
                                <div>user:{review.user.username}</div>
                                {review.user._id===currentUser._id?
                                <Link to={`/review/${review._id}/edit`}>Edit Review</Link>:<></>}
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