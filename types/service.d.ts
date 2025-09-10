import { IDuration } from './duration'

interface IService {
    id: string
    name: string
    price: number
    quantity: number
}

interface ISelectedService {
    id: string
    quantity: number
    price: number
    name: string
}

interface IGetServicesProps {
    filter: string
    duration?: string
    page?: number
    limit?: number
}

interface ISettingServiceDesktopProps {
    className: string
    changeFilterHandler: (e: React.KeyboardEvent<HTMLInputElement>) => void
    isLoadingData: boolean
    data: ISerivice[]
    isLast: boolean
    isFirst: boolean
    pageSize: number
    prev: (val: Source) => void
    next: (val: Source) => void
    deleteHandler: (val: string) => void
    refetchData: () => void
}

interface IServiceDetailDialogProps {
    counter: number
    id: string
    dataChanged: () => void
}

interface IServiceDetail {
    durations: IDuration[]
    id: string
    name: string
    unit: string
}

// Duration Form
interface IDurationFormProps {
    visible: boolean
    data: IDurationFormData
    onSubmit: (data: IDurationFormData) => void
    onClose: () => void
}

interface IDurationFormData {
    duration: string
    price: number
}
