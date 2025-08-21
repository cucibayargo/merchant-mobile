export const generateUrlWithParams = (url: string, params: any) => {
    for (const key in params) {
        if (url.slice(-1) === '?') {
            url += `${key}=${params[key]}`
        } else {
            url += `&${key}=${params[key]}`
        }
    }

    return url
}
