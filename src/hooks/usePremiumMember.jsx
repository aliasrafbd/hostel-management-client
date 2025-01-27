import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosPublic from "./useAxiosPublic";

const usePremiumMember = () => {
    const {user} = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    const {data:PremiumMember=[], isLoading} = useQuery({
        queryKey: [user?.email, "isPremiumMember"],
        queryFn: async() => {
            const res = await axiosPublic.get(`users/premium/${user.email}`)
            return res?.data;
        }
    })
    return {PremiumMember, isLoading};
};

export default usePremiumMember;