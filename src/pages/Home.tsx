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

type Category={
  name:string;
  _id:string;
}


const Home:React.FC=()=>{
    const {user:currentUser, isLoggedIn:isLoggedIn} = useSelector((state: any)=>state.auth)
    const [categories,setCategories] = useState<Category[] | null>(null)
    const {loading,data} = useQuery(GET_CATEGORIES,{
    onCompleted({categories}){
        setCategories(categories);
    }})
    return(
        <div>
            <div className="flex justify-center text-stone-200 text-4xl">CATEGORIES</div>
            <div className="flex justify-center text-cyan-200">Product Categories</div>
            {categories?categories.map((category:Category)=>{
                return(
                  <Link to={`/category/${category._id}`}><div className="flex justify-center border-2 rounded-md border-cyan-200 border-solid p-2 text-cyan-200 mx-12 my-2 hover:scale-125 hover:bg-stone-800 transition ease-in-out">
                    <div>{category.name}</div>
                    </div>
                    </Link>
                )
            }):<div className="flex justify-center text-cyan-200">Loading...</div>}
            {currentUser.admin?
            <div className="flex flex-col items-center">
              <div className="text-slate-600 bg-stone-200 rounded p-2"><Link to="/category/create">Create Category</Link></div>
              <div className="text-slate-600 bg-stone-200 rounded p-2 mt-2"><Link to="/Product/create">Create Product</Link></div>
            </div>:<></>}
        </div>
    )
}

export default Home;