import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosPublic from "./useAxiosPublic";

const usePremiumMember = () => {
    const {user} = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    const {data: isPremiumMember, isPending: isMemberLoading } = useQuery({
        queryKey: [user?.email, "isPremiumMember"],
        queryFn: async() => {
            const res = await axiosPublic.get(`users/premium/${user.email}`)
            console.log(res.data);
            return res?.data?.premiumMember;
        }
    })
    return [isPremiumMember, isMemberLoading];
};

export default usePremiumMember;