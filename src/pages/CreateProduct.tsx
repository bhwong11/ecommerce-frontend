import React,{useEffect,useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const CREATE_PRODUCT = gql`
  mutation createProduct($title:String!,$price:Int!,$image:String!,$description:String!,$user:ID!,$category:ID!) {
    createProduct(title:$title,price:$price,image:$image,description:$description,user:$user,category:$category) {
      _id,
      title,
      price
    }
  }
  `
const GET_CATEGORIES = gql`
  query{
    categories{
      name,
      _id
    }
  }`;

const CreateProduct:React.FC =()=>{
    const navigate = useNavigate();
    const {user:currentUser} = useSelector((state:any)=>state.auth)
    const [title,setTitle] = useState<string>('')
    const [price,setPrice] = useState<number>(0)
    const [image,setImage] = useState<string >('')
    const [categoryId,setCategoryId] = useState<string>('')
    const [description,setDescription] = useState<string>('')
    const [success,setSuccess] = useState<string>('')
    const [error,setError] = useState<string>('')
    const [createProductMutation, { data:createProductMutationData, loading:createProductLoadingMutation, error:createProductErrorMutation }] = useMutation(CREATE_PRODUCT,{
      onCompleted({product}){
        console.log(product)
      }})
    const {loading:loadingCategoriesQuery, data:categoriesData} = useQuery(GET_CATEGORIES,{
        onCompleted({categories}){
            console.log(categories)
            setCategoryId(categories[0]._id)
        }})
    
    
    const createProductHandler=async(e:React.SyntheticEvent)=>{
        e.preventDefault()
        try{
          await createProductMutation({ variables: { title,price,image,description,user:currentUser._id,category:categoryId} })
          setSuccess('successfully created Product')
          setTitle('')
          setPrice(0)
          setImage('')
          setDescription('')
        }catch(err){
          setError('500 server error on product creation, try again later')
        }
        
    }

    return(
        <div className="flex flex-col items-center text-stone-200">
            <div className="text-2xl m-2">Create Product</div>
            <div className="text-lime-400">{success}</div>
            <div className="text-red-400">{error}</div>
            <form className="border-2 border-stone-200 rounded p-6" onSubmit={createProductHandler}>
            <div>
                <label>
                <div>Title:</div>
                <input className="rounded p-1 text-stone-800" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                <div>Price:</div>
                <input className="rounded p-1 text-stone-800" type='text' pattern="[0-9]*" value={price} onChange={(e)=>setPrice(parseInt(e.target.value) || 0)}/>
                </label>
            </div>
            <div>
                <label>
                <div>Image:</div>
                <input className="rounded p-1 text-stone-800" onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setImage(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                <div>Category:</div>
                <select className="rounded p-1 text-stone-800" value={categoryId} onChange={(e)=>setCategoryId(e.target.value)}>
                {console.log('CATEOGRY DATA',categoriesData)}
                {categoriesData?categoriesData.categories.map((category:any)=>{
                    return <option value={category._id}>{category.name}</option>
                }):<></>}            
                </select>
                </label>
            </div>
            <div>
                <label>
                <div>description:</div>
                <textarea className="rounded p-1 text-stone-800" value={description} onChange={(e)=>setDescription(e.target.value)}>
                  </textarea>
                </label>
            </div>
            <div className="flex justify-center">
              <button className="border-2 border-stone-200 bg-stone-200 rounded text-slate-600 p-2 m-2 hover:border-stone-200 hover:text-stone-200 hover:bg-slate-600  transition:ease-in-out">Create Product</button>
            </div>
            </form>
        </div>
    )
}

export default CreateProduct