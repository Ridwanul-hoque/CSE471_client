import { useQuery } from '@tanstack/react-query';
import useAuth from './useAuth';
import useSecure from './useSecure';


const useDoctor = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useSecure();

  const { data: isDoctor, isLoading: isDoctorLoading } = useQuery({
    enabled: !loading && !!user?.email,
    queryKey: ['isDoctor', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/doctor/${user.email}`);
      return res.data.doctor;
    }
  });

  return [isDoctor, isDoctorLoading];
};

export default useDoctor;
