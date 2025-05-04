import {
    createBrowserRouter,

} from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home";
import Adoption from "../Pages/adoption/adoption";
// import Accessories from "../Pages/Accessories/Accessories";
// import Medical from "../Pages/Medical/Medical";
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
import { VetProfiles } from "../Pages/Medical/VetProfiles";
import BookAppointment from "../Pages/Medical/BookAppointment";
import VideoCall from "../Pages/Medical/VideoCall";
import VetBot from "../Pages/Medical/VetBot";
import Medical from "../Pages/Medical/Landing";
import ProductAdmin from "../Pages/Dashboard/AdminProduct/AdminProduct.jsx";
import Shop from "../Pages/Shop/Shop.jsx";
import Rescue from "../Pages/Rescue/Rescue.jsx";
import UserRescuePost from "../Pages/Dashboard/UserRescuePost/UserRescuePost.jsx";
import AdoptForm from "../Pages/AdoptForm/AdoptForm.jsx";
import AdoptionApproval from "../Pages/Dashboard/AdoptionApproval/AdoptionApproval.jsx";
import AdoptedPets from "../Pages/Dashboard/AdoptedPets/AdoptedPets.jsx";
import MissingPets from "../Pages/Dashboard/MissingPets/MissingPets.jsx";





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
                path: '/rescue',
                element: <PrivateRoutes><Rescue></Rescue></PrivateRoutes>
            },
            {
                path: '/Shop',
                element: <PrivateRoutes><Shop></Shop></PrivateRoutes>
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
                path: '/adopt/:id',
                element: <AdoptForm></AdoptForm>
            },
            {
                path: '/vet-profiles',
                element: <VetProfiles></VetProfiles>
            },
            {
                path: '/book-appointment',
                element: <BookAppointment></BookAppointment>
            },
            {
                path: '/video-call',
                element: <VideoCall></VideoCall>
            },
            {
                path: '/vet-bot',
                element: <VetBot></VetBot>
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
                path: 'userRescue',
                element: <PrivateRoutes><UserRescuePost></UserRescuePost></PrivateRoutes>,
            },
            {
                path: 'favourite',
                element: ''
            },
            {
                path: 'adopted',
                element: <PrivateRoutes><AdoptedPets></AdoptedPets></PrivateRoutes>,
            },
            {
                path: 'addreview',
                element: '',

            },
            {
                path: 'missingPets',
                element: <PrivateRoutes><MissingPets></MissingPets></PrivateRoutes>
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
                path: 'manageProducts',
                element: <AdminRoutes><ProductAdmin></ProductAdmin></AdminRoutes>
            },
            {
                path: 'approval',
                element: <AdminRoutes><AdoptionApproval></AdoptionApproval></AdminRoutes>
            },
            



        ]
    }
]);