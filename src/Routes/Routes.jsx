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
        loader: ({ params }) => fetch(`http://localhost:5000/meals`)
      },
      {
        path: '/upcomingmeals',
        element: <UpcomingMeals></UpcomingMeals>
      },
      {
        path: '/notifications',
        element: <div>Notifications</div>
      },
      {
        path: '/dashboard',
        element: <div>Dashboard</div>
      }
    ]
  },
  {
    path: "dashboard",
    element: <DashBoard></DashBoard>,
    children: [

      // user Routes 
      {
        path: "/dashboard",
        element: <AllReviews></AllReviews>
      },
      {
        path: "myprofile",
        element: <MyProfile></MyProfile>,
      },
      {
        path: "requestedmeals",
        element: <RequestedMeals></RequestedMeals>,
      },
      {
        path: "paymenthistory",
        element: <PaymentHistory></PaymentHistory>,
      },
      {
        path: "myreviews",
        element: <MyReviews></MyReviews>,
      },

      // Admin Routes 
      {
        path: "addmeal",
        element: <AddMeal></AddMeal>,
      },
      {
        path: "adminprofile",
        element: <AdminProfile></AdminProfile>,
      },
      {
        path: "allmeals",
        element: <AllMeals></AllMeals>,
      },
      {
        path: "allreviews",
        element: <AllReviews></AllReviews>,
      },
      {
        path: "manageusers",
        element: <ManageUsers></ManageUsers>,
      },
      {
        path: "servemeals",
        element: <ServeMeals></ServeMeals>,
      },
      {
        path: "upcomingmeals",
        element: <UpcomingMeals></UpcomingMeals>,
      },

    ]
  }
]);