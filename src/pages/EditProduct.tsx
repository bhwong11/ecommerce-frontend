import React,{useState,useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,useParams } from 'react-router-dom';

import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const EDIT_PRODUCT = gql`
  mutation updateProduct($id:ID!,$title:String!,$price:Int!,$image:String!,$description:String!,$user:ID!,$category:ID!) {
    updateProduct(id:$id,title:$title,price:$price,image:$image,description:$description,user:$user,category:$category) {
      _id,
      title,
      image,
      price,
      category,
      description
    }
  }
  `
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
          name,
          _id
      }
    }
  }
`;

const GET_CATEGORIES = gql`
  query{
    categories{
      name,
      _id
    }
  }`;

const DELETE_PRODUCT = gql`
  mutation deleteProduct($id:ID!) {
    deleteProduct(id:$id) {
      _id,
      title
    }
  }
  `

const EditProduct:React.FC=()=>{
    const navigate = useNavigate();
    const { productId } = useParams();
    const {user:currentUser} = useSelector((state:any)=>state.auth)
    const [title,setTitle] = useState<string>('')
    const [price,setPrice] = useState<number>(0)
    const [image,setImage] = useState<string>('')
    const [categoryId,setCategoryId] = useState<string>('')
    const [description,setDescription] = useState<string>('')
    const [success,setSuccess] = useState<string>('')
    const [error,setError] = useState<string>('')
    const [deleteConfirmation,setDeleteConfirmation] = useState<boolean>(false)
    const [updateProductMutation, { data:updateProductMutationData, loading:updateProductLoadingMutation, error:updateProductErrorMutation }] = useMutation(EDIT_PRODUCT,{
      onCompleted({product}){
        console.log(product)
      }})

    const {loading:loadingCategoriesQuery, data:categoriesData} = useQuery(GET_CATEGORIES,{
        onCompleted({categories}){
            console.log(categories)
        }})

    const { data:productData, loading:productLoading,error:productError, refetch:refetchProductData} = useQuery(GET_PRODUCT,{ 
        variables: { id:productId},
        onCompleted({product}){
            console.log('PRODUCT',product)
            setTitle(product.title)
            setPrice(product.price)
            setImage(product.image)
            setCategoryId(product.category._id)
            setDescription(product.description)
        } 
        })
    
    const [deleteProductMutation, { data:deleteProductMutationData, loading:deleteProductLoadingMutation, error:deleteProductErrorMutation }] = useMutation(DELETE_PRODUCT,{
      onCompleted({Product}){
        console.log(Product)
      }})

    const editProductHandler=async(e:React.SyntheticEvent)=>{
        e.preventDefault()
        try{
          await updateProductMutation({ variables: { id:productId,title,price,image,description,user:currentUser._id,category:categoryId} })
          setSuccess('successfully Edited Product')
          refetchProductData()
        }catch(err){
          setError('500 server error on product edit, try again later')
        }
        
    }

    const deleteProductHandler=async(e:React.MouseEvent<HTMLElement>)=>{
        e.preventDefault()
        setSuccess('')
        setError('')
        try{
            await deleteProductMutation({ variables: { id:productId }})
            navigate('/')
        }catch(err){
            setError('500 server error on delete')
        }
    }

    return(
        <div className="flex flex-col items-center text-stone-200">
            <div className="text-2xl m-2">Edit Product</div>

            <div className="text-lime-400">{success}</div>
            <div className="text-red-400">{error}</div>
            <div>Edit {productData?<>{productData.product.title}</>:<></>}</div>
            <form className="border-2 border-stone-200 rounded p-6" onSubmit={editProductHandler}>
            <div>
                <label>
                <div>Title:</div>
                <input className="rounded p-1 text-stone-800 w-80" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                <div>Price:</div>
                <input className="rounded p-1 text-stone-800 w-80" type='text' pattern="[0-9]*" value={price} onChange={(e)=>setPrice(parseInt(e.target.value) || 0)}/>
                </label>
            </div>
            <div>
                <label>
                <div>Image:</div>
                <input className="rounded p-1 text-stone-800 w-80" value={image} onChange={(e)=>setImage(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                <div>Category:</div>
                <select className="rounded p-1 text-stone-800 w-80" value={categoryId} onChange={(e)=>setCategoryId(e.target.value)}>
                {categoriesData?categoriesData.categories.map((category:any)=>{
                    return <option value={category._id}>{category.name}</option>
                }):<></>}            
                </select>
                </label>
            </div>
            <div>
                <label>
                <div>description:</div>
                <input className="rounded p-1 text-stone-800 w-80" value={description} onChange={(e)=>setDescription(e.target.value)}/>
                </label>
            </div>
            <div className="flex justify-center mt-2">
              <button className="border-2 border-stone-200 bg-stone-200 rounded text-slate-600 p-2 m-2 hover:border-stone-200 hover:text-stone-200 hover:bg-slate-600  transition:ease-in-out">Edit Product</button>
            </div>
            </form>
            <div>
            <div className="flex justify-center mt-2">
              <button className="border-2 border-stone-200 bg-stone-200 rounded text-slate-600 p-2 m-2 hover:border-stone-200 hover:text-stone-200 hover:bg-slate-600 transition:ease-in-out" onClick={()=>setDeleteConfirmation(true)}>Delete Product</button>
            </div>
                {deleteConfirmation?
                <div>
                    <div>Are you sure you want to delete this product?</div>
                    <button className="border-2 border-red-400 bg-red-400 rounded text-slate-600 p-2 m-2 hover:border-red-400 hover:bg-slate-600 hover:text-red-400 transition:ease-in-out" onClick={deleteProductHandler}>Delete</button>
                    <button className="border-2 border-stone-200 bg-stone-200 rounded text-slate-600 p-2 m-2 hover:border-stone-200 hover:bg-slate-600 hover:text-stone-200 transition:ease-in-out" onClick={()=>setDeleteConfirmation(false)}>Cancel</button>
                </div>:<></>}
            </div>
        </div>
    )
}

export default EditProduct;