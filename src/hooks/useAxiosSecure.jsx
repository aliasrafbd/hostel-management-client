import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../providers/AuthProvider";

const axiosInstance = axios.create({
  baseURL: 'https://hostel-management-server-orcin.vercel.app',
  withCredentials: true
});

const useAxiosSecure = () => {
  const { logOut } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
      axiosInstance.interceptors.response.use(response => {
          return response;
      }, error => {
          console.log('api response error status', error.status);
          if (error.status === 401 || error.status === 403) {
            logOut()
                  .then(() => {
                      // redirect to the login page
                      console.log("you are not valid user, log out");
                      navigate('/login')
                  })
                  .catch(err => console.log(err))
          }
          return Promise.reject(error);
      })
  }, [])

  return axiosInstance;
};

export default useAxiosSecure;