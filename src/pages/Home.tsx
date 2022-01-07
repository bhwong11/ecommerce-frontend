import React,{useEffect,useState} from 'react';
import { useParams,Link,useNavigate } from "react-router-dom";
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
        </div>
    )
}

export default Home;