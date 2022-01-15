import React,{useState,useEffect} from 'react';
import { useParams,Link,useNavigate } from "react-router-dom";
import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const GET_CATEGORY = gql`
query category($id:ID!){
    category(id:$id){
      name,
      _id
    }
  }
`;

const EDIT_CATEGORY = gql`
  mutation updateCategory($id:ID!,$name:String!) {
    updateCategory(id:$id,name:$name) {
      _id,
      name
    }
  }
  `
const DELETE_CATEGORY = gql`
  mutation deleteCategory($id:ID!) {
    deleteCategory(id:$id) {
      _id,
      name
    }
  }
  `

const EditCategory:React.FC=()=>{
    const navigate = useNavigate();
    const [categoryName,setCategoryName] =useState<string>('')
    const [deleteConfirmation,setDeleteConfirmation] = useState<boolean>(false)
    const [success,setSuccess] = useState<string>('')
    const [error,setError] = useState<string>('')
    const { categoryId } = useParams();
    const { data:categoryData, loading:loadingCategoryData,error:errorCategoryData,refetch:refetchCategoryData} = useQuery(GET_CATEGORY,{ 
        variables: { id:categoryId},
        onCompleted({category}){
            setCategoryName(category.name)
        } 
        })
    const [editCategoryMutation, { data:editCategoryMutationData, loading:editCategoryLoadingMutation, error:editCategoryErrorMutation }] = useMutation(EDIT_CATEGORY,{
      onCompleted({category}){
        console.log(category)
      }})
    const [deleteCategoryMutation, { data:deleteCategoryMutationData, loading:deleteCategoryLoadingMutation, error:deleteCategoryErrorMutation }] = useMutation(DELETE_CATEGORY,{
      onCompleted({category}){
        console.log(category)
      }})

    const editCategoryHandler =async(e:any)=>{
        e.preventDefault()
        setSuccess('')
        setError('')
        try{
            await editCategoryMutation({ variables: { id:categoryId,name:categoryName} })
            setSuccess('category successfully edited')
            refetchCategoryData()
        }catch(err){
            setError('500 Server Error on Edit, try again later')
        }
    }

    const deleteCategoryHandler=async(e:any)=>{
        e.preventDefault()
        setSuccess('')
        setError('')
        try{
            await deleteCategoryMutation({ variables: { id:categoryId,name:categoryName} })
            navigate('/')
        }catch(err){
            setError('500 server error on delete')
        }
    }
    return(
        <div>
            Edit Category
            <div>{success}</div>
            <div>{error}</div>
            {categoryData?
            <div>
                <div>Name: {categoryData.category.name}</div>
                <form onSubmit={editCategoryHandler}>
                    <input value={categoryName} onChange={(e)=>setCategoryName(e.target.value)}/>
                    <button>edit category</button>
                </form>
                <button onClick={()=>setDeleteConfirmation(true)}>Delete Category</button>
                {deleteConfirmation?
                <div>
                    <div>Are you sure you want to delete this category?</div>
                    <button onClick={deleteCategoryHandler}>Delete</button>
                    <button onClick={()=>setDeleteConfirmation(false)}>Cancel</button>
                </div>:<></>}
            </div>:<>loading category...</>}
        </div>
    )
}

export default EditCategory;