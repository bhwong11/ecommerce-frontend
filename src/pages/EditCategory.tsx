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

    const editCategoryHandler =async(e: React.FormEvent<HTMLFormElement>)=>{
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

    const deleteCategoryHandler=async(e:React.MouseEvent<HTMLElement>)=>{
        e.preventDefault()
        setSuccess('')
        setError('')
        try{
            await deleteCategoryMutation({ variables: { id:categoryId} })
            navigate('/')
        }catch(err){
            setError('500 server error on delete')
        }
    }
    return(
        <div className="flex flex-col items-center text-stone-200">
            <div className="text-2xl">Edit Category</div>
            <div className="text-lime-400">{success}</div>
            <div className="text-red-400">{error}</div>
            {categoryData?
            <div className="flex flex-col items-center border-2 border-stone-200 rounded p-4 m-2">
                <div>Name: {categoryData.category.name}</div>
                <form onSubmit={editCategoryHandler}>
                    <input className="rounded text-stone-800 p-2" value={categoryName} onChange={(e)=>setCategoryName(e.target.value)}/>
                    <div className="flex justify-center">
                      <button className="border-2 border-stone-200 bg-stone-200 rounded text-slate-600 p-2 m-2 hover:border-stone-200 hover:bg-slate-600 hover:text-stone-200 transition:ease-in-out">Edit Category</button>
                    </div>
                </form>
                <div className="flex justify-center">
                  <button className="border-2 border-stone-200 bg-stone-200 rounded text-slate-600 p-2 m-2 hover:border-stone-200 hover:text-stone-200 hover:bg-slate-600  transition:ease-in-out" onClick={()=>setDeleteConfirmation(true)}>Delete Category</button>
                </div>
                {deleteConfirmation?
                <div>
                    <div>Are you sure you want to delete this category?</div>
                    <button className="border-2 border-red-400 bg-red-400 rounded text-slate-600 p-2 m-2 hover:border-red-400 hover:bg-slate-600 hover:text-red-400 transition:ease-in-out" onClick={deleteCategoryHandler}>Delete</button>
                    <button className="border-2 border-stone-200 bg-stone-200 rounded text-slate-600 p-2 m-2 hover:border-stone-200 hover:bg-slate-600 hover:text-stone-200 transition:ease-in-out" onClick={()=>setDeleteConfirmation(false)}>Cancel</button>
                </div>:<></>}
            </div>:<>loading category...</>}
        </div>
    )
}

export default EditCategory;