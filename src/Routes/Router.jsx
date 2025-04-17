import {
    createBrowserRouter,

} from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import Adoption from "../Pages/adoption/adoption";
import Accessories from "../Pages/Accessories/Accessories";
import Medical from "../Pages/Medical/Medical";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Login from "../Pages/Login/Login";
import Registration from "../Pages/Registration/Registration";


import PrivateRoutes from "./PrivateRoutes";
import UserDashboard from "../Pages/Dashboard/UserDashboard/UserDashboard.jsx";
import AdminRoutes from "./AdminRoutes.jsx";
import ManageUser from "../Pages/Dashboard/ManageUser/ManageUser.jsx";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard/AdminDashboard.jsx";
import PostAdoption from "../Pages/Dashboard/PostAddoption/PostAdoption.jsx";
import MissingFeed from "../Pages/Home/MissingFeed/MissingFeed.jsx";





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
                element: <PrivateRoutes><Adoption></Adoption></PrivateRoutes>
            },
            {
                path: '/accessories',
                element: <PrivateRoutes><Accessories></Accessories></PrivateRoutes>
            },
            {
                path: '/medical',
                element: <Medical></Medical>
            },
            {
                path: '/missingfeed',
                element: <PrivateRoutes><MissingFeed></MissingFeed></PrivateRoutes>
            },
            {
                path: '/medical',
                element: <Medical></Medical>
            },
            {
                path: '/login',
                element: <Login></Login>
            },
            {
                path: '/register',
                element: <Registration></Registration>
            },

        ]
    },
    {
        path: 'dashboard',
        element: <PrivateRoutes><Dashboard></Dashboard></PrivateRoutes>,
        children: [

            {
                path: 'addPost',
                element: <PostAdoption></PostAdoption>,
            },
            {
                path: 'viewData',
                element: '',
            },
            {
                path: 'favourite',
                element: ''
            },
            {
                path: 'contact',
                element: '',
            },
            {
                path: 'addreview',
                element: '',

            },
            {
                path: 'user',
                element: <PrivateRoutes><UserDashboard></UserDashboard></PrivateRoutes>,

            },


            {
                path: 'adminDashboard',
                element: <AdminRoutes><AdminDashboard></AdminDashboard></AdminRoutes>
            },
            {
                path: 'manageUsers',
                element: <AdminRoutes><ManageUser></ManageUser></AdminRoutes>
            },
            {
                path: 'approveStatus',
                element: ''
            },

            

        ]
    }
]);