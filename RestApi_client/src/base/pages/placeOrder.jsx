import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/checkoutSteps";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Loading from "../components/loading";
import { toast } from "react-toastify";
import { getError } from "../helpers/utils";
import { Store } from "../context/Store";
import "../styles/placeOrder.css";
import Footer from "./footer";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };

    default:
      return state;
  }
};

export default function PlaceOrder() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce(
      (acc, item) => acc + item.quantity * item.currentBid,
      0
    )
  );

  cart.shippingPrice = cart.itemsPrice > 10000 ? round2(0) : round2(500);

  cart.taxPrice = 0;
  console.log("Cart_____", cart);
  cart.totalPrice = cart.itemsPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);
  return (
    <div className="global__background h-screen">
      <Helmet>
        <title>Place Order-Bid&Won</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8 flex  h-5/6">
        <div className="flex flex-col justify-evenly w-full">
          <h1 className="text-2xl font-semibold text-white items-center justify-center flex  mb-4">
            Last Preview Order
          </h1>
          <div className="grid lg:grid-cols-3 grid-cols-1">
            <div className="flex flex-col justify-between border-orange-600 border-2 hover:border-5 hover:scale-110  bg-white border-orange-600 border-2  rounded-lg shadow-md p-4 mb-4 mx-4">
              <div>
                <h2 className="text-lg borderColor font-semibold text-gray-800 mb-4 flex justify-center">
                  Shipping
                </h2>
                <p className="text-gray-700 mb-2 flex justify-between">
                  <strong>Name: </strong>
                  {cart.shippingAddress.fullName}{" "}
                </p>
                <p className="text-gray-700 mb-4 flex justify-between">
                  <strong>Address: </strong> {cart.shippingAddress.address},
                  {cart.shippingAddress.city}, {cart.shippingAddress.pinCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </div>
              <Link
                to="/shipping"
                className="text-cyan-500 hover:text-cyan-600 flex justify-center"
              >
                Click here to edit all shipping details!
              </Link>
            </div>

            {/* Payment Card */}
            <div className="flex flex-col justify-between border-orange-600 border-2 hover:border-5 hover:scale-110  hover:border-orange-800 bg-white rounded-lg shadow-md p-4 mb-4 mx-4">
              <div>
                <h2 className="text-lg borderColor font-semibold text-gray-800 mb-4 flex justify-center">
                  Payment
                </h2>
                <p className="text-gray-700 mb-2 flex justify-between">
                  <strong>Method: </strong>
                  {cart.paymentMethod}
                </p>
              </div>
              <a
                flex
                justify-between
                href="/payment"
                className="text-cyan-500 hover:text-cyan-600 flex justify-center"
              >
                Click here to edit all payment details!
              </a>
            </div>

            {/* Order Summary Card */}
            <div className=" flex flex-col justify-between border-orange-600 border-2 hover:border-5 hover:scale-110 bg-white rounded-lg shadow-md p-4 mb-4 mx-4">
              <h2 className="text-lg borderColor font-semibold text-gray-800 mb-4 flex justify-center">
                Order Summary
              </h2>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-700">Items</p>
                  <p className="text-gray-700">
                    {cart.itemsPrice.toLocaleString("en-IN")}
                  </p>
                </div>
                <hr />
                <div className="flex justify-between">
                  <p className="text-gray-700">Shipping</p>
                  <p className="text-gray-700">
                    {cart.shippingPrice.toLocaleString("en-IN")}
                  </p>
                </div>
                <hr />
                <div className="flex justify-between">
                  <p className="text-gray-700">Tax</p>
                  <p className="text-gray-700">
                    {cart.taxPrice.toLocaleString("en-IN")}
                  </p>
                </div>
                <hr />
                <div className="flex justify-between">
                  <p className="text-lg font-semibold">Order Total</p>
                  <p className="text-lg font-semibold">
                    <small>$</small>
                    {cart.totalPrice.toFixed(2).toLocaleString("en-IN")}
                  </p>
                </div>

                {loading && <Loading />}
              </div>
            </div>
          </div>
          <button
            className=" border-orange-500 border-2 bg-orange-500 hover:bg-transparent hover:scale-105 text-white px-4 py-2 rounded mt-4"
            onClick={placeOrderHandler}
            disabled={cart.cartItems.length === 0}
          >
            Order now with Bid&Won
          </button>
        </div>
      </div>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="pt-6">
        <Footer />
      </div>
    </div>
  );
}
