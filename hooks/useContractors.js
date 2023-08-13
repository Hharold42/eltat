import fetcher from "@/utils/fetcher";
import useSWR from "swr";

function useContractors() {
  const { data, error, isLoading } = useSWR("api/getContractor", fetcher);

  return {
    contrs: data,
    contrsIsLoading: isLoading,
    contrsIsError: error,
  };
}

export default useContractors;
