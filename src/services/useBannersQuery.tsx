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
    params.append("page", String(pageNum));
    params.append("pageSize", String(size));
  
    const url = `${API_BANNERS_URL}${params.toString() ? `?${params.toString()}` : ""}`;
    const res = await fetchGet(url);
  
    // Caso A: backend devuelve objeto paginado { data, total, totalPages, page?, pageSize? }
    if (res && Array.isArray(res.data)) {
      const total = typeof res.total === "number" ? res.total : res.data.length;
      const pageSize = typeof res.pageSize === "number" ? res.pageSize : size;
      const page = typeof res.page === "number" ? res.page : pageNum;
      const totalPages =
        typeof res.totalPages === "number" ? res.totalPages : Math.max(1, Math.ceil(total / pageSize));
      return { data: res.data, page, pageSize, total, totalPages };
    }
  
    // Caso B: backend devuelve array plano Banner[]
    if (Array.isArray(res)) {
      const filtered = searchTerm
        ? res.filter((b: Banner) =>
            (b.banner_name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.banner_url ?? "").toLowerCase().includes(searchTerm.toLowerCase())
          )
        : res;
  
      const total = filtered.length;
      const start = (pageNum - 1) * size;
      const end = start + size;
      const pageSlice = filtered.slice(start, end);
  
      return {
        data: pageSlice,
        page: pageNum,
        pageSize: size,
        total,
        totalPages: Math.max(1, Math.ceil(total / size)),
      };
    }
  
    // Caso C: backend devuelve { rows: Banner[] }
    if (res && Array.isArray(res.rows)) {
      const list = res.rows;
      const total = typeof res.total === "number" ? res.total : list.length;
      const pageSize = typeof res.pageSize === "number" ? res.pageSize : size;
      const page = typeof res.page === "number" ? res.page : pageNum;
      const totalPages =
        typeof res.totalPages === "number" ? res.totalPages : Math.max(1, Math.ceil(total / pageSize));
      return { data: list, page, pageSize, total, totalPages };
    }
  
    throw new Error("Respuesta inesperada del endpoint /banners");
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
