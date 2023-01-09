import React from "react";
import { Helmet } from "react-helmet";

const Head = ({ ...props }) => {
  return (
    <Helmet>
      <title>Zig Admin Panel</title>
      {props.children}
    </Helmet>
  );
};
export default Head;
