import fetcher from "@/utils/fetcher";
import useSWR from "swr";

function useProjects() {
  const { data, error, isLoading } = useSWR("api/getProject", fetcher);

  return {
    proj: data,
    projIsLoading: isLoading,
    projIsError: error,
  };
}

export default useProjects;
