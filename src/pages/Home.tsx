import React,{useEffect,useState} from 'react';
import { useParams,Link,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const GET_CATEGORIES = gql`
  query{
    categories{
      name,
      _id
    }
  }`;


const Home:React.FC=()=>{
    const {user:currentUser, isLoggedIn:isLoggedIn} = useSelector((state: any)=>state.auth)
    const [categories,setCategories] = useState<any>(null)
    const {loading,data} = useQuery(GET_CATEGORIES,{
    onCompleted({categories}){
        setCategories(categories);
    }})
    return(
        <div>
            test HOMEPAGE
            {categories?categories.map((category:any)=>{
                return(
                    <>
                    {category.name}
                    <Link to={`/category/${category._id}`}>Link</Link>
                    </>
                )
            }):<div>Loading</div>}
            {currentUser.admin?<div>
            <Link to="/category/create">Create Category</Link>
            </div>:<></>}
        </div>
    )
}

export default Home;