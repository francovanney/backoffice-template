import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
import { BANNERS_KEY } from "@/const/queryKeys";
import { API_BANNERS_URL } from "@/const/apiUrls";
import { fetchGet } from "@/lib/fetch";
import { Banner } from "@/services/types/banners";

interface IPaginatedBanners {
  data: Banner[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const fetchBannersPage = async (
    searchTerm: string | null,
    pageNum: number,
    size: number
  ): Promise<IPaginatedBanners> => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    params.append("page", pageNum.toString());
    params.append("pageSize", size.toString());
  
    const queryString = params.toString();
    const res = await fetchGet(
      `${API_BANNERS_URL}${queryString ? `?${queryString}` : ""}`
    );
  
    return res as IPaginatedBanners;
  };

export function useBannersQuery(
  search?: string | null,
  page: number = 1,
  pageSize: number = 15
) {
  const query = useInfiniteQuery({
    queryKey: [BANNERS_KEY, { search, pageSize }],
    queryFn: ({ pageParam = 1 }) =>
      fetchBannersPage(search || null, pageParam, pageSize),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.page > 1 ? firstPage.page - 1 : undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    initialPageParam: 1,
  });

  const currentPageData = query.data?.pages.find(
    (pageData) => pageData.page === page
  );
  const totalPages = query.data?.pages[0]?.totalPages || 0;
  const total = query.data?.pages[0]?.total || 0;

  if (
    currentPageData === undefined &&
    !query.isFetching &&
    (page <= totalPages || totalPages === 0)
  ) {
    const hasAnyPage = (query.data?.pages.length || 0) > 0;
    if (
      !hasAnyPage ||
      page > (query.data?.pages[query.data.pages.length - 1]?.page || 0)
    ) {
      query.fetchNextPage();
    }
  }

  return {
    ...query,
    data: {
      data: currentPageData?.data || [],
      page,
      pageSize,
      total,
      totalPages,
    },
    isCurrentPageLoading: currentPageData === undefined && query.isFetching,
  };
}

export const invalidateBannersCache = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: [BANNERS_KEY] });
};

export const updateBannersCache = (
  queryClient: QueryClient,
  updatedBanner: Banner,
  action: "create" | "update" | "delete"
) => {
  if (action === "update") {
    queryClient.setQueriesData(
      { queryKey: [BANNERS_KEY] },
      (oldData: IPaginatedBanners | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((banner) =>
            banner.id === updatedBanner.id ? updatedBanner : banner
          ),
        };
      }
    );
  } else {
    queryClient.invalidateQueries({ queryKey: [BANNERS_KEY] });
  }
};
