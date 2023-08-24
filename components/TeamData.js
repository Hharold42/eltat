import useSWR from "swr";
import fetcher from "@/utils/fetcher";

export default function TeamByIds({ ids, cn }) {
  const { data, isLoading } = useSWR(`api/getPerformers?ids=${ids}`, fetcher);

  if (isLoading) {
    return <td className={cn}>Загрузка</td>;
  }

  return (
    <td className={cn}>
      {data.map((perf) => (
        <div key={`${perf.id}perf`}>
          {perf.lname} {perf.name}
        </div>
      ))}
    </td>
  );
}
