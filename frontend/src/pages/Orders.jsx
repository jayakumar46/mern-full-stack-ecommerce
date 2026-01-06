import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from 'react-toastify'

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
const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [tick, setTick] = useState(0);


  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const res = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        let allOrdersItem = [];
        res.data.orders.map((order) => {
          order.items.map((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              paymentExpiresAt: order.paymentExpiresAt, // ✅ ADD THIS
              razorpayOrderId: order.razorpayOrderId,
              orderId: order._id,
            });
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) { }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  console.log(orderData.razorpayOrderId);

  const retryPayment = async (orderData) => {

    const response = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!response) {
      alert("Razorpay SDK failed to load");
      return;
    }
    const res = await axios.post(backendUrl +
      `/api/order/retry/${orderData.razorpayOrderId}`, {}, { headers: { token } }
    );
    const { order, key } = res.data;
    const options = {
      key,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      image: orderData?.image?.[0],
      name: "Buysho",
      description: "Retry Payment",
      handler: () => {
        toast.success("Payment processing...");
        setTimeout(() => {
          navigate("/orders")
        }, 3000)
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
    rzp.open();
    rzp.on("payment.failed", function () {
      toast.error("Payment failed or cancelled");
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeMeta = (expiresAt) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return {
      label: `${minutes}:${seconds.toString().padStart(2, "0")}`,
      isExpired: false,
      isDanger: diff <= 30 * 1000,
    };
  };
  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orderData.map((item, index) => (
          <div
            key={index}
            className="py-4 border-b border-gray-100 text-gray-700 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] items-center gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img src={item.image[0]} className="w-16 sm:w-20" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p>
                    {currency} {item.price}
                  </p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size:{item.size}</p>
                </div>
                <p className="mt-1">
                  Date:{" "}
                  <span className="text-gray-400">
                    {new Date(item.date).toDateString()}
                  </span>{" "}
                </p>
                <p className="mt-1">
                  Payment:{" "}
                  <span className="text-gray-400">{item.paymentMethod}</span>{" "}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-start md:justify-center">
              <span
                className={`w-2 h-2 rounded-full ${item.status === "waiting_payment"
                  ? "bg-yellow-500"
                  : item.status === "confirmed" || item.status === "Order Placed"
                    ? "bg-green-500"
                    : "bg-red-500"
                  }`}
              />
              <span className="text-sm capitalize">
                {item.status.replace("_", " ")}
              </span>
            </div>
            {item.status !== "confirmed" && item.status === "waiting_payment" && item.paymentExpiresAt ? (
              <>
                <button
                  onClick={() => retryPayment(item)}
                  className="text-xs px-3 py-1 border border-green-400 text-green-700 rounded hover:bg-green-50 transition"
                >
                  Retry Payment
                </button>
                {item.status === "waiting_payment" && item.paymentExpiresAt && (() => {
                  const { label, isDanger } =
                    getTimeMeta(item.paymentExpiresAt);
                  return (
                    <p
                      key={tick}  // 🔥 force react to re-evaluate
                      className={`text-xs flex items-center gap-1 mt-1
                        ${isDanger
                          ? "text-red-500 animate-pulse"
                          : "text-gray-500"
                        }`}
                    >
                      ⏱ {label}
                    </p>
                  );
                })()}
              </>
            ) : (
              <div className="flex md:justify-end">
                <button
                  onClick={loadOrderData}
                  className="border border-gray-100 px-4 py-2 text-sm font-medium cursor-pointer"
                >
                  Track Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
