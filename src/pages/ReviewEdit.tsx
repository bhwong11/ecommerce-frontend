import React,{useState,useEffect} from 'react';
import { useParams,Link,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";


  const GET_REVIEW = gql`
  query review($id:ID!) {
      review(id:$id,) {
      _id,
      title,
      content,
      product{
          _id
      },
      user{
          username,
          _id
      }
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
    mutation deleteReview($id:ID!) {
        deleteReview(id:$id) {
        _id,
        title,
        content,
        product,
        user
        }
    }
`

const ReviewEdit:React.FC=()=>{
    const navigate = useNavigate()
    const {reviewId} = useParams()
    const {user:currentUser, isLoggedIn:isLoggedIn} = useSelector((state: any)=>state.auth)
    const [title,setTitle]=useState<string>('')
    const [content,setContent] = useState<string>('')
    const [error,setError]=useState<string>('')
    const [success,setSuccess]=useState<string>('')
    const [deleteConfirmation,setDeleteConfirmation] = useState<boolean>(false)
    const { data:reviewData, loading:reviewLoading,error:reviewError} = useQuery(GET_REVIEW,{ 
        variables: { id:reviewId},
        onCompleted({review}){
            setTitle(review.title)
            setContent(review.content)
        } 
        })

    const [editReviewMutation, { data:editReviewMutationData, loading:editReviewLoadingMutation, error:editReviewErrorMutation }] = useMutation(EDIT_REVIEW,{
        onCompleted({review}){
          console.log(review)
        }})

    const [deleteReviewMutation, { data:deleteReviewMutationData, loading:deleteReviewLoadingMutation, error:deleteReviewErrorMutation }] = useMutation(DELETE_REVIEW,{
                onCompleted({review}){
                console.log(review)
                }})   


    const editReview = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setSuccess('')
        setError('')
        try{
            if(reviewData){
                await editReviewMutation({ variables: { id:reviewId,title,content,product:reviewData.review.product._id,user:currentUser._id} })
                setSuccess('successfully edited review')
            }
        }catch(err){
            console.log(err)
            setError('500 error try again later')
        }
    }

    const deleteCategoryHandler=async(e:React.MouseEvent<HTMLElement>)=>{
        e.preventDefault()
        setSuccess('')
        setError('')
        try{
            await deleteReviewMutation({ variables: { id:reviewId} })
            navigate(`/product/${reviewData.review.product._id}`)
        }catch(err){
            setError('500 server error on delete')
        }
    }

    return(
        <div>
            Review Edit Page
            {error}
            {success}
            <form onSubmit={editReview}>
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
                <button>Edit Review</button>
                </div>
            </form>
            <button onClick={()=>setDeleteConfirmation(true)}>Delete Review</button>
            {deleteConfirmation?
            <div>
                <div>Are you sure you want to delete this category?</div>
                <button onClick={deleteCategoryHandler}>Delete</button>
                <button onClick={()=>setDeleteConfirmation(false)}>Cancel</button>
            </div>:<></>}
        </div>
    )
}

export default ReviewEdit