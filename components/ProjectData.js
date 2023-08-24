import useSWR from "swr";
import fetcher from "@/utils/fetcher";

export default function ProjectById({ id, cn }) {
  const { data } = useSWR(`/api/getProject?id=${id}`, fetcher);

  if (!data) {
    return <td className={cn}>Загрузка</td>;
  }

  return <td className={cn}>{data.name}</td>;
}
