import React,(useEffect,useState) from 'react';
import { useParams,Link,useNavigate } from "react-router-dom";
import {
    useQuery,
    gql,
    useMutation,
  } from "@apollo/client";

const GET_CATEGORY = gql`
  query category($id:string){
    category(id:$id){
      name,
      _id,
      products{
        _id,
        title,
        price,
        image,
        description,
        user,
        category,
      }
    }
  }`;
  
const { categoryId } = useParams();

const Category:React.FC=()=>{
    const [category,setCategory] = useState<any>('');
    const {loading,data} = useQuery(GET_CATEGORY,{
    variables: { id:categoryId },
  },{
    onCompleted({category}){
        setCategory(category);
    }})
    return(
        <div>
            Category Page
            Category: {category.name}
            {category.products?
            (category.products.length>1?
            category.products.map((product)=>{
                return(
                    <div>
                        {product.name}
                    </div>
                    <div>
                        {product._id}
                    </div>
                )
            }):<div>No Products</div>):<div>loading...</div>}
        </div>
    )
}

export default Category