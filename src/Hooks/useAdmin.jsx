import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import axios from "axios";
import useSecure from "./useSecure";



const useAdmin = () => {
    const {user, loading} = useAuth()
    const axiosSecure = useSecure()
    const {data: isAdmin, isPending: isAdminLoading} =useQuery({
        queryKey: [user?.email, 'isAdmin'],
        enabled: !loading,
        queryFn: async() => {
            const res = await axiosSecure.get(`/users/admin/${user.email}`)
            // console.log(res.data)
            return res.data?.admin
            

        }
    })
    return [isAdmin, isAdminLoading]
    
};

export default useAdmin;