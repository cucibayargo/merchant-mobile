interface IDuration {
    created_at: string
    duration: number
    id: string
    name: string
    type: string
}

interface IGetDurationsParams {
    filter?: string
    limit?: number
    page?: number
}

interface IGetDurationsListParams {
    filter?: string
    hasService?: boolean
}

interface IDurationResponse {
    id: string
    name: number
}

interface IDurationDropdown {
    label: string
    value: string
}

interface ISettingDurationDesktopProps {
    className: string
    changeFilterHandler: (e: React.KeyboardEvent<HTMLInputElement>) => void
    isLoadingData: boolean
    data: IDuration[]
    pageSize: number
    prev: () => void
    next: () => void
    isFirst: boolean
    isLast: boolean
    deleteHandler: (val: string) => void
    refechData: () => void
}

interface IDurationDetailDialogProps {
    id: string
    counter: number
    dataChanged: () => void
}
