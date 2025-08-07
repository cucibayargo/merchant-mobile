import { useContext, useEffect, useState } from 'react'
import { BreadcrumbContext } from '@/context/breadcrumb'

const SettingDuration = () => {
    const { setTitle, setShowBackIcon, setPrevPath, setShowTitle } =
        useContext(BreadcrumbContext)
    const navigate = useNavigate()
    const [selectedId, setSelectedId] = useState<string>('')
    const [filter, setFilter] = useState<string>('')
    const limit: number = 10
    const [page, setPage] = useState(1)
    const { data, isLoading, refetch } = useGetDuration({ filter, page, limit })
    const { mutateAsync: deleteDuration, isSuccess: isDeleteDurationSuccess } =
        useDeleteDuration()
    const [loadingMore, setLoadingMore] = useState<boolean>(false)
    const [isLastPage, setIsLastPage] = useState<boolean>(false)
    const [durations, setDurations] = useState<IDuration[]>([])
    const [isFirstPage, setIsFirstPage] = useState<boolean>(true)
    const [counter, setCounter] = useState<number>(0)
    const { screenMode } = useContext(ScreenContext)
    const [isFetchedMore, setIsFetchedMore] = useState<boolean>(false)

    useEffect(() => {
        setShowTitle(true)
        setTitle('Durasi')
        setShowBackIcon(true)
        setPrevPath('settings')
    }, [])

    useEffect(() => {
        if (data) {
            setDurations(
                isFetchedMore
                    ? [...durations, ...data.data.durations]
                    : data.data.durations
            )
            setLoadingMore(false)
            setIsLastPage(data.data.isLastPage)
            setIsFirstPage(data.data.isFirstPage)

            if (!isFetchedMore) {
                window.scrollTo(0, 0)
            }
        }
    }, [data])

    useEffect(() => {
        if (isDeleteDurationSuccess) {
            refetch()
        }
    }, [isDeleteDurationSuccess])

    const createDuration = () => {
        navigate('create')
    }

    const cardClickHandler = (id: string, e: any) => {
        const deleteBtn = document.getElementById('delete-btn')!

        if (deleteBtn.className === e.target.className) {
            setCounter(counter + 1)
            setSelectedId(id)
        } else {
            navigate(`/settings/duration/${id}`)
        }
    }

    const changeFilterHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || (e.target as HTMLInputElement).value === '') {
            setFilter((e.target as HTMLInputElement).value)
            setPage(1)
            setIsFetchedMore(false)
        }
    }

    const fetchMoreData = (screen: string) => {
        if (isLastPage || loadingMore) return

        setLoadingMore(true)
        setPage(page + 1)
        setIsFetchedMore(screen === 'mobile')
    }

    const prevPage = () => {
        if (isFirstPage || loadingMore) return

        setLoadingMore(true)
        setPage(page - 1)
        setIsFetchedMore(false)
    }

    const deleteFromDesktop = (id: string) => {
        setSelectedId(id)
        setCounter(counter + 1)
    }

    const deleteDurationHandler = (invoice: string): void => {
        setPage(1)
        setFilter('')
        setIsFetchedMore(false)
        deleteDuration(invoice)
    }

    return (
        <>
            {screenMode === 'desktop' ? (
                <SettingDurationDesktop
                    className="hidden sm:block"
                    changeFilterHandler={changeFilterHandler}
                    isLoadingData={isLoading}
                    data={data?.data.durations}
                    pageSize={limit}
                    isFirst={isFirstPage}
                    isLast={isLastPage}
                    prev={prevPage}
                    next={() => fetchMoreData('desktop')}
                    deleteHandler={deleteFromDesktop}
                    refechData={refetch}
                />
            ) : (
                <div className="sm:hidden">
                    <div className="mx-4">
                        <div className="bg-white fixed w-[93%] top-[115px] mb-6 pt-2">
                            <Input
                                data-id="search-field"
                                placeholder="Pencarian"
                                type="text"
                                onKeyUp={changeFilterHandler}
                            />
                        </div>

                        {isLoading && page === 1 ? (
                            <Loading />
                        ) : durations.length === 0 ? (
                            <p className="flex justify-center mt-16">
                                Tidak Ada Durasi
                            </p>
                        ) : (
                            <InfiniteScroll
                                dataLength={durations.length}
                                next={() => fetchMoreData('mobile')}
                                hasMore={!isLastPage}
                                loader={<h4>Loading...</h4>}
                                className="mt-16"
                            >
                                {durations.map(
                                    (duration: IDuration, index: number) => (
                                        <div
                                            className="flex justify-between py-3 px-2 border rounded-sm cursor-pointer mb-2"
                                            data-id={`duration-card-${index + 1}`}
                                            key={duration.id}
                                            onClick={($event) =>
                                                cardClickHandler(
                                                    duration.id,
                                                    $event
                                                )
                                            }
                                        >
                                            <div className="">
                                                <p
                                                    className="font-bold"
                                                    data-id={`duration-name-${index + 1}`}
                                                >
                                                    {duration.name}
                                                </p>
                                                <p
                                                    className="text-[10px]"
                                                    data-id={`duration-duration-${index + 1}`}
                                                >
                                                    {duration.duration}{' '}
                                                    {duration.type}
                                                </p>
                                            </div>
                                            <img
                                                className="cursor-pointer w-[1.438rem]"
                                                src={trashIcon}
                                                alt="trash"
                                                id="delete-btn"
                                                data-id={`button-delete-${index + 1}`}
                                                // onClick={() => setSelectedId(duration.id)}
                                            />
                                        </div>
                                    )
                                )}
                            </InfiniteScroll>
                        )}
                    </div>

                    <div className="sm:w-[480px] px-4 fixed flex justify-end bottom-[6rem] right-3">
                        <img
                            className="cursor-pointer w-12"
                            src={addIcon}
                            alt=""
                            data-id="button-add"
                            onClick={createDuration}
                        />
                    </div>
                </div>
            )}

            <DeleteDialog
                counter={counter}
                message="Hapus Durasi?"
                id={selectedId}
                onDelete={deleteDurationHandler}
            />
        </>
    )
}

export default SettingDuration
