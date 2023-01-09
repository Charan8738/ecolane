import React, { useState, createContext } from "react";
import { beverageCardData } from "./BeverageData";

export const BeverageContext = createContext();

export const ProductContextProvider = (props) => {
  const [data, setData] = useState(beverageCardData);

  return <BeverageContext.Provider value={{ contextData: [data, setData] }}>{props.children}</BeverageContext.Provider>;
};
