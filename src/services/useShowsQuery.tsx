import { useInfiniteQuery, QueryClient } from "@tanstack/react-query";
import { SHOWS_KEY } from "@/const/queryKeys";
import { API_SHOWS_URL } from "@/const/apiUrls";
import { fetchGet } from "@/lib/fetch";
import { Event } from "@/services/types/event";

interface IPaginatedShows {
  data: Event[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const fetchShowsPage = async (
  searchTerm: string | null,
  pageNum: number,
  size: number
): Promise<IPaginatedShows> => {
  const params = new URLSearchParams();
  if (searchTerm) params.append("search", searchTerm);
  params.append("page", pageNum.toString());
  params.append("pageSize", size.toString());

  const queryString = params.toString();
  const res = await fetchGet(
    `${API_SHOWS_URL}${queryString ? `?${queryString}` : ""}`
  );

  return res as IPaginatedShows;
};

export function useShowsQuery(
  search?: string | null,
  page: number = 1,
  pageSize: number = 15
) {
  const query = useInfiniteQuery({
    queryKey: [SHOWS_KEY, { search, pageSize }],
    queryFn: ({ pageParam = 1 }) =>
      fetchShowsPage(search || null, pageParam, pageSize),
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

export const invalidateShowsCache = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: [SHOWS_KEY] });
};

export const updateShowsCache = (
  queryClient: QueryClient,
  updatedShow: Event,
  action: "create" | "update" | "delete"
) => {
  if (action === "update") {
    queryClient.setQueriesData(
      { queryKey: [SHOWS_KEY] },
      (oldData: IPaginatedShows | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((show) =>
            show.show_id === updatedShow.show_id ? updatedShow : show
          ),
        };
      }
    );
  } else {
    queryClient.invalidateQueries({ queryKey: [SHOWS_KEY] });
  }
};
