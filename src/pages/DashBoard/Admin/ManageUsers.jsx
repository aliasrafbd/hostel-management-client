import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaUsers } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';



const ManageUsers = () => {

    const axiosSecure = useAxiosSecure();

    const { data: users = [], isLoading, error, refetch } = useQuery({
        queryKey: ['users'], // Unique key for caching
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    const handleMakeAdmin = (user) => {
        axiosSecure.patch(`/users/admin/${user._id}`)
            .then(res => {
                console.log(res.data);
                if (res.data.modifiedCount > 0) {
                    refetch();
                    Swal.fire({
                        title: "Sucess!",
                        text: `${user?.name} is an Admin`,
                        icon: "success"
                    });
                }
            })
    }

    const handleUserDelete = (user) => {

        console.log("Delete a food");

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/users/${user._id}`)
                    .then(res => {
                        console.log(res.data)
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "A user is deleted.",
                                icon: "success"
                            });
                        }
                    })
            }
        });
    }


    return (
        <>
            <h2 className='text-xl font-extrabold'>Total Users: {users?.length}</h2>
            <div>
                Manage Users
            </div>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users?.map((user, index) => <tr key={user._id}>
                                <th>{index + 1}</th>
                                <td>{user?.name}</td>
                                <td>{user?.email}</td>
                                <td>
                                    {
                                        user?.role == "admin" ?
                                            "Admin"
                                            :
                                            <button className='btn btn-error'
                                                onClick={() => handleMakeAdmin(user)}
                                            ><FaUsers className='text-xl'></FaUsers></button>

                                    }
                                </td>
                                <td><button onClick={() => handleUserDelete(user)} className=''><MdDelete className='text-red-700 text-xl'></MdDelete></button></td>
                                <td>Not Premium</td>
                            </tr>)
                        }

                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ManageUsers;