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

    const editProductHandler=async(e:any)=>{
        e.preventDefault()
        try{
          await updateProductMutation({ variables: { id:productId,title,price,image,description,user:currentUser._id,category:categoryId} })
          setSuccess('successfully Edited Product')
          refetchProductData()
        }catch(err){
          setError('500 server error on product edit, try again later')
        }
        
    }

    const deleteProductHandler=async(e:any)=>{
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
        <div>
            <div>Edit Product</div>

            <div>{success}</div>
            <div>{error}</div>
            <div>Edit {productData?<>{productData.product.title}</>:<></>}</div>
            <form onSubmit={editProductHandler}>
            <div>
                <label>
                Title:
                <input value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                Price:
                <input type='text' pattern="[0-9]*" value={price} onChange={(e)=>setPrice(parseInt(e.target.value) || 0)}/>
                </label>
            </div>
            <div>
                <label>
                Image:
                <input value={image} onChange={(e)=>setImage(e.target.value)}/>
                </label>
            </div>
            <div>
                <label>
                Category:
                <select value={categoryId} onChange={(e)=>setCategoryId(e.target.value)}>
                {console.log('CATEOGRY DATA',categoriesData)}
                {categoriesData?categoriesData.categories.map((category:any)=>{
                    return <option value={category._id}>{category.name}</option>
                }):<></>}            
                </select>
                </label>
            </div>
            <div>
                <label>
                description:
                <input value={description} onChange={(e)=>setDescription(e.target.value)}/>
                </label>
            </div>
            <button>Edit Product</button>
            </form>
            <button onClick={()=>setDeleteConfirmation(true)}>Delete Product</button>
                {deleteConfirmation?
                <div>
                    <div>Are you sure you want to delete this product?</div>
                    <button onClick={deleteProductHandler}>Delete</button>
                    <button onClick={()=>setDeleteConfirmation(false)}>Cancel</button>
                </div>:<></>}
        </div>
    )
}

export default EditProduct;