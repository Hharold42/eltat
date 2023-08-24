import useSWR from "swr";
import fetcher from "@/utils/fetcher";

export default function ContractorById({ id, cn }) {
  const { data } = useSWR(`api/getContractor?id=${id}`, fetcher);

  if (!data) {
    return <td className={cn}>Загрузка</td>;
  }

  return <td className={cn}>{data.name}</td>;
}
