import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      reject(new Error("Something is not right!"))
    }
    document.body.appendChild(script);
  })
}
const PlaceOrder = () => {
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };


  const placeRazorpayOrder = async (orderData) => {
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        alert("Razorpay SDK failed to load");
        return;
      }



      const response = await axios.post(
        backendUrl + "/api/order/razorpay",
        orderData,
        { headers: { token } }
      );

      const { order, key } = response.data;

      if (!order?.id) {
        alert("Order creation failed");
        return;
      }

      const options = {
        key,
        amount: order.amount,      // paise
        currency: order.currency,
        order_id: order.id,
        image: orderData?.items.length === 1 ? orderData?.items?.[0]?.image?.[0] : null,
        name: "Buysho",
        description: "Order Payment",

        handler: function () {
          // ❌ don't confirm order here
          toast.success("Payment processing...");
          setTimeout(()=>{
            navigate("/orders")
          },3000)
        },

        method: {
          upi: true,
        },
        prefill: {
          vpa: "success@razorpay", // test upi
        },
        notes: {
          orderType: "product",
        },

        theme: {
          color: "#d62d90",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function () {
        toast.error("Payment failed or cancelled");
        
      });

      rzp.open();

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };



  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };



      switch (method) {
        //api calls for cod method
        case "cod":
          const res = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (res.data.success) {
            setCartItems({});
            navigate("/orders");
            toast.success(res.data.message);
          } else {
            toast.error(res.data.message);
          }
          break;
        case "stripe":
          const resStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );
          if (resStripe.data.success) {
            const { session_url } = resStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error(resStripe.data.message);
          }
          break;
        case "razorpay":
          console.log("hoii");

          placeRazorpayOrder(orderData);
          break;

        default:
          break;
      }
    } catch (error) { }
  };
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col justify-between sm:flex-row  gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* ---------------left side-------------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            type="text"
            placeholder="First name"
            className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            type="text"
            placeholder="Last name"
            className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          type="email"
          placeholder="Email address"
          className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          type="text"
          placeholder="Street"
          className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            type="text"
            placeholder="State"
            className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            type="number"
            placeholder="Zipcode"
            className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          type="text"
          placeholder="Phone"
          className="border border-gray-300 rounded  py-1.5 px-3.5 w-full"
        />
      </div>

      {/* -----------------Right Side --------------------- */}
      <div className="mt-8">
        <div className="mt-12 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* ----------payment method selection */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-3 border border-gray-300 pb-3 p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3 h-3.5 border border-gray-50 rounded-full ${method === "stripe" ? "bg-green-400" : ""
                  }`}
              ></p>
              <img src={assets.stripe_logo} className="h-5 mx-4" />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-3 border border-gray-300 pb-3 p-2 px-3 cursor-pointer "
            >
              <p
                className={`min-w-3 h-3.5 border border-gray-50 rounded-full ${method === "razorpay" ? "bg-green-400" : ""
                  }`}
              ></p>
              <img src={assets.razorpay_logo} className="h-5 mx-4" />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-3 border border-gray-300 p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3 h-3.5 border border-gray-50 rounded-full ${method === "cod" ? "bg-green-400" : ""
                  }`}
              ></p>
              <p className="text-gray-500 text-sm font-mediummx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white py-3 px-16 text-sm cursor-pointer"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
