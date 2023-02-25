import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Home from "./routes/home";
import Login from "./routes/login";
import OrderList from "./routes/orderList";
import PrivateRoute from "./routes/privateRoute";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard",
    element: <Navigate to="/" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/order",
    element: (
      <PrivateRoute>
        <OrderList />
      </PrivateRoute>
    ),
  },
  {
    path: "/orders",
    element: <Navigate to="/order" />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
