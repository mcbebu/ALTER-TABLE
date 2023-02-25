import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'

import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";

import Home from './routes/home'
import Login from './routes/login';
import OrderList from './routes/orderList'
import PrivateRoute from './routes/privateRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
    ,
  },
  {
    path: "/dashboard",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/order",
    element: <OrderList />,
  },
  {
    path: "/orders",
    element: <OrderList />,
  },
  {
    path: "*",
    element: <Navigate to='/' />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
)
