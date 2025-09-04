import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { IGetDurationsListParams } from "../../types/duration";
import { generateUrlWithParams } from "../../lib/generateUrlWithParams";

const useGetDurationList = (props: IGetDurationsListParams) => {
  let url: string = `/duration/all?`;
  url = generateUrlWithParams(url, props);

  return useQuery({
    queryKey: ["durationsList", { props }],
    queryFn: async () => axiosInstance.get(url),
    staleTime: Infinity,
  });
};

export default useGetDurationList;
