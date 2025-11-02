import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import {  Link } from "react-router-dom";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/product/list");

      if (res.data.success) {
        setList(res.data.products);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const productRemove = async (id) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        await fetchList();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, [list]);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div>
        {/* -------List table title */}

        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-100 bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* --------Product List--------- */}

        {list && list.length > 0 ? (
          list.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border border-gray-100 text-sm my-2"
              key={index}
            >
              <img className="w-12" src={item.image[0]} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>
                {currency}
                {item.price}
              </p>
              <div
                className="flex justify-around cursor-pointer items-center"
                onClick={() => {
                  setPopUp(true), productUpdate(item._id);
                }}
              >
                <Link to={`/update/${item._id}`}>EDIT</Link>
                <p
                  onClick={() => productRemove(item._id)}
                  className="text-right md:text-center cursor-pointer text-lg"
                >
                  X
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <p>Product is Empty</p>
          </div>
        )}
      </div>
    </>
  );
};
export default List;
