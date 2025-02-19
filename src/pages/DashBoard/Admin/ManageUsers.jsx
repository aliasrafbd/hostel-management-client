import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaUsers } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');

    const { data: users = [], isLoading, error, refetch } = useQuery({
        queryKey: ['users', searchName, searchEmail], 
        queryFn: async () => {
            const params = {};
            if (searchName) params.name = searchName;
            if (searchEmail) params.email = searchEmail;

            const res = await axiosSecure.get('/users', { params});
            return res.data;
        },
    });

    const handleMakeAdmin = (user) => {
        axiosSecure.patch(`/users/admin/${user._id}`)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    refetch();
                    Swal.fire({
                        title: "Success!",
                        text: `${user?.name} is now an Admin.`,
                        icon: "success"
                    });
                }
            });
    };

    const handleUserDelete = (user) => {
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
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "The user has been deleted.",
                                icon: "success"
                            });
                        }
                    });
            }
        });
    };

    return (
        <div className="manage-users my-6">
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="input input-bordered"
                />
                <input
                    type="text"
                    placeholder="Search by Email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="input input-bordered"
                />
                <button
                    onClick={refetch}
                    className="btn btn-primary"
                >
                    Search
                </button>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <Loading></Loading>
                ) : error ? (
                    <p className="text-red-500">{error.message}</p>
                ) : (users?.length==0) ? <p className='my-28 text-red-900 font-extrabold text-3xl'>No data</p>
                : (
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Action</th>
                                <th>Badge</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.role === "admin" ? (
                                            "Admin"
                                        ) : (
                                            <button
                                                className="btn btn-error"
                                                onClick={() => handleMakeAdmin(user)}
                                            >
                                                <FaUsers />
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleUserDelete(user)}
                                            className="btn btn-danger"
                                        >
                                            <MdDelete />
                                        </button>
                                    </td>
                                    <td>{user.badge || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;