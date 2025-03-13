import {
    createBrowserRouter,
    
} from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import Adoption from "../Pages/adoption/adoption";
import Accessories from "../Pages/Accessories/Accessories";
import Medical from "../Pages/Medical/Medical";
import Dashboard from "../Pages/Dashboard/Dashboard";





export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/adoption',
                element: <Adoption></Adoption>
            },
            {
                path: '/accessories',
                element: <Accessories></Accessories>
            },
            {
                path: '/medical',
                element: <Medical></Medical>
            },
            {
                path: '/dashboard',
                element: <Dashboard></Dashboard>
                
            }
        ]
    },
]);