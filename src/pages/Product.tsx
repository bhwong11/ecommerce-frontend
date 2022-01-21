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
            setTitle('')
            setContent('')
        }catch(err){
            setReviewError('unable to create reivew at this time, try again later')
        }
        
    }

    return(
        <div className="flex flex-col items-center">
        {productData?
        <div>
            <div className="flex flex-col items-center border-2 border-cyan-200 rounded-md text-cyan-200 py-3">   
                <div className="text-xl">Product: {productData.product.title}</div>
                <div><img className="w-80" src={productData.product.image}/></div>
                <div>Price: ${productData.product.price}.00</div>
                <div>description:</div>
                <div>{productData.product.description}</div>
                <div className="text-lime-400">{addToCartSuccess}</div>
                {currentUser?
                <button className="border-2 border-cyan-200 rounded-md bg-stone-800 p-2 mt-2 hover:bg-cyan-200 hover:text-slate-600 transition:ease-in-out" onClick={()=>addToCart(productData.product._id)}>
                    add to cart
                </button>:
                <></>
                }
            </div>
                <div className="flex flex-col items-center text-cyan-200 pt-2">
                    <div>Reviews</div>
                    <form onSubmit={createReview}>
                        <label>
                            <div>Title:</div>
                            <input className="w-80 rounded text-black p-1" value={title} onChange={(e)=>setTitle(e.target.value)}></input>
                        </label>
                        <label>
                            <div>Content:</div>
                            <textarea  className="w-80 rounded text-black p-1" value={content} onChange={(e)=>setContent(e.target.value)}>
                            </textarea>
                        </label>
                        <div className="flex justify-center">
                        <button
                        className="border-2 border-cyan-200 rounded-md hover:bg-cyan-200 hover:text-slate-600 transition:ease-in-out p-2"
                        >Create Review</button>
                        </div>
                    </form>
                    {reviewsData?[...reviewsData.reviewsProductSearch].reverse().map((review:any)=>{
                        return(
                            <div className="rounded bg-stone-800 w-80 p-2 m-2">
                                <div><span className="italic">Review:</span> {review.title}</div>
                                <div className="break-all">{review.content}</div>
                                <div><span className="italic">Left By:</span>{review.user.username}</div>
                                {review.user._id===currentUser._id?
                                <Link to={`/review/${review._id}/edit`}><div className="text-stone-200">Edit Review</div></Link>:<></>}
                            </div>
                        )
                    }):<>loading reviews...</>}
                </div>
                {currentUser.admin?<div>
                <Link to={`/product/${productData.product._id}/edit`}>
                    <div className="flex justify-center bg-stone-200 text-slate-600 rounded p-2 m-2">
                    Edit Product
                    </div>
                    </Link>
                </div>:<></>}
        </div>:
        <div className="flex justify-center text-cyan-200">loading product...</div>
        }
        </div>
    )
}

export default Product;