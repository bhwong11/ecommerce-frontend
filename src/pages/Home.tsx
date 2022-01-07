import React,{useEffect,useState} from 'react';
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
            {categories?categories.map((category)=>{
                return(
                    <>
                    {category.name}
                    <Link to={`/category/${category._id}`}>
                    </>
                )
            }):<div>Loading</div>}
        </div>
    )
}

export default Home;