import {
  createBrowserRouter,
  Outlet,
} from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import MealDetails from "../pages/MealDetails";
import DashBoard from "../Layout/DashBoard";
import RequestedMeals from "../pages/DashBoard/User/RequestedMeals";
import PaymentHistory from "../pages/DashBoard/User/PaymentHistory";
import MyReviews from "../pages/DashBoard/User/MyReviews";
import AddMeal from "../pages/DashBoard/Admin/AddMeal";
import AdminProfile from "../pages/DashBoard/Admin/AdminProfile";
import AllMeals from "../pages/DashBoard/Admin/AllMeals";
import AllReviews from "../pages/DashBoard/Admin/AllReviews";
import ManageUsers from "../pages/DashBoard/Admin/ManageUsers";
import ServeMeals from "../pages/DashBoard/Admin/ServeMeals";
import UpcomingMeals from "../pages/DashBoard/Admin/UpcomingMeals";
import MyProfile from "../pages/DashBoard/User/MyProfile";
import AdminRoute from "./AdminRoute";
import Checkout from "../components/Checkout";
import PrivateRoute from "./PrivateRoute";
import UpdateMeal from "../pages/DashBoard/Admin/UpdateMeal";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: '/',
        element: <Home></Home>,
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/register',
        element: <Register></Register>
      },
      {
        path: '/meals',
        element: <AllMeals></AllMeals>
      },
      {
        path: '/meal/:id',
        element: <MealDetails></MealDetails>,
        loader: ({ params }) => fetch(`https://hostel-management-server-orcin.vercel.app/meals`)
      },
      {
        path: '/upcomingmeals',
        element: <UpcomingMeals></UpcomingMeals>
      },
      {
        path: '/checkout/:packageName',
        element: <PrivateRoute><Checkout></Checkout></PrivateRoute>,
      },
    ]
  },
  {
    path: "dashboard",
    element: <DashBoard></DashBoard>,
    children: [

      // user Routes 
      {
        path: "/dashboard",
        element: <div className="text-center text-green-500 text-5xl my-32">Welcome to the Dashboard <br /> of <br /> <span className="font-extrabold">Hostel Management System</span></div>
      },
      {
        path: "myprofile",
        element: <PrivateRoute><MyProfile></MyProfile></PrivateRoute>,
      },
      
      {
        path: "paymenthistory",
        element: <PrivateRoute><PaymentHistory></PaymentHistory></PrivateRoute>,
      },
      {
        path: "requestedmeals",
        element: <PrivateRoute><RequestedMeals></RequestedMeals></PrivateRoute>
      },
      {
        path: "myreviews",
        element: <PrivateRoute><MyReviews></MyReviews></PrivateRoute>,
      },

      // Admin Routes 
      {
        path: "addmeal",
        element: <AdminRoute><AddMeal></AddMeal></AdminRoute>,
      },
      {
        path: "adminprofile",
        element: <AdminRoute><AdminProfile></AdminProfile></AdminRoute>,
      },
      {
        path: "allmeals",
        element: <AdminRoute><AllMeals></AllMeals></AdminRoute>,
        loader: () => fetch('https://hostel-management-server-orcin.vercel.app/mealscount'),
      },
      {
        path: "/dashboard/meals/:id",
        element: <AdminRoute><UpdateMeal></UpdateMeal></AdminRoute>,
        loader: ({ params }) => fetch(`https://hostel-management-server-orcin.vercel.app/meals`)
        
      },
      {
        path: "allreviews",
        element: <AdminRoute><AllReviews></AllReviews></AdminRoute>,
        loader: () => fetch('https://hostel-management-server-orcin.vercel.app/mealscount'),
      },
      {
        path: "manageusers",
        element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>,
      },
      {
        path: "servemeals",
        element: <AdminRoute><ServeMeals></ServeMeals></AdminRoute>,
        loader: () => fetch('https://hostel-management-server-orcin.vercel.app/servemealscount'),
      },
      {
        path: "upcomingmeals",
        element: <AdminRoute><UpcomingMeals></UpcomingMeals></AdminRoute>,
        loader: () => fetch('https://hostel-management-server-orcin.vercel.app/upcomingmealscount'),
      },

    ]
  }
]);