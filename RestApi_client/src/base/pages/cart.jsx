import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../context/Store";
import "../styles/cart.css";
import { MdOutlineDelete } from "react-icons/md";
import Footer from "./footer";

export default function CartPage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };
  console.log(cartItems);
  return (
    <div className="global__background h-screen flex flex-col gap-2 justify-between">
      <Helmet>
        <title>Cart-Bid&Won</title>
      </Helmet>
      <main className="lg:max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className=" text-3xl text-white font-bold flex justify-center">
          Shopping Cart
        </h1>
      </main>
      <div className=" container lg:max-w-7xl mx-auto w-full flex flex-col gap-5">
        <div className="">
          {cartItems.length === 0 ? (
            <div className="p-4 border rounded-md bg-gray-100 text-gray-700">
              It is empty. &nbsp;
              <Link to="/auction" className="text-cyan-600 font-bold">
                Go to Bid&Won
              </Link>
            </div>
          ) : (
            <div className="bg-white border-b border-gray-200 sm:rounded-lg hover:transform hover:scale-105 backface-hidden shadow-lg duration-500">
              <div className="overflow-x-auto max-w-full">
                <div className="flex text-2xl  w-full justify-center pb-5 pt-2">
                  All products
                </div>
                <table className="min-w-full divide-y divide-gray-200 ">
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {cartItems.map((item) => (
                      <tr className="flex justify-between" key={item._id}>
                        <td className="whitespace-nowrap px-6 py-4 md:px-2 md:py-3">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 whitespace-normal">
                                <Link to={`/auctions/${item.id}`}>
                                  {item.title}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ${item.currentBid.toLocaleString("en-IN")}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeItemHandler(item)}
                          >
                            <MdOutlineDelete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="">
          <div className="bg-white shadow-lg sm:rounded-lg md:-mt-3">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="mb-4 text-lg font-medium items-center flex justify-center text-gray-900">
                Check order summary
              </h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Items:</span>
                <span className="text-gray-900 font-medium">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-500">Total:</span>
                <span className="text-gray-900 font-medium">
                  $
                  {cartItems
                    .reduce(
                      (acc, item) => acc + item.quantity * item.currentBid,
                      0
                    )
                    .toLocaleString("en-IN")}
                </span>
              </div>
              <button
                className={`w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded ${
                  cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
