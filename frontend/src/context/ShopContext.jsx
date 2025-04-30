import React, { useState, createContext, useEffect } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";


export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [carItems, setCarItems] = useState({});
  const [showSearch, setShowSearch] = useState(true);

  const addToCart = async(itemId,size)=>{

    if(!size){
      toast.error("Please select a size");
      return;
    }

    let cartData = structuredClone(carItems);
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
    setCarItems(cartData);

      
  }

  const getCartCount = ()=>{
    let totalCount = 0;
    for (const items in carItems) {
      for (const item in carItems[items]) {
        try{
          if(carItems[items][item]>0){
            totalCount += carItems[items][item];
          } 

        }catch(error){
        }
        
      } 
  }

  return totalCount;
  }

  
 

  useEffect(()=>{
    console.log(carItems);
    
  },[carItems])

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    carItems,
    addToCart,
    getCartCount

    };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
