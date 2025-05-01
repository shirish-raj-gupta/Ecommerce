import React, { useState, createContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import axios from "axios";


export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [showSearch, setShowSearch] = useState(true);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const addToCart = async(itemId,size)=>{

    if(!size){
      toast.error("Please select a size");
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
      
    }
    else{
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

      
  }

  const getCartCount = ()=>{
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try{
          if(cartItems[items][item]>0){
            totalCount += cartItems[items][item];
          } 

        }catch(error){
        }
        
      } 
  }

  return totalCount;
  }

  const updateQuantity= async(itemId, size , quantity)=>{
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  }

  const getCartAmount = () =>{
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product)=> product._id === items);
      for (const item in cartItems[items]) {
        try{
          if(cartItems[items][item]>0){
            totalAmount += itemInfo.price * cartItems[items][item];
          } 

        }catch(error){
        }
        
      }
  }
  return totalAmount;
}

const getProductsData = async () => {
  try{
    const response = await axios.get(backendUrl + "/api/product/list");
    if(response.status === 200) {
      setProducts(response.data);
    }
    else{
      toast.error(response.data.message);
    }

  }catch(error){
    console.log(error);
  }
}

useEffect(() => {
  getProductsData();
},[])

useEffect(()=>{
  if(!token && localStorage.getItem('token')){
    setToken(localStorage.getItem('token'))

  }
},[])

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token, 
    setToken
    
    
    


    };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
