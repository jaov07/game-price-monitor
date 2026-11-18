export interface SteamRawSearchItem {
    id: number
    name: string
    tiny_image: string
    price?: {
        currency: string
        initial: number
        final: number
        discount_percent: number
    }
}

export interface SteamRawSearchResponse {
    total: number
    items: SteamRawSearchItem[]
}

export interface SteamRawPriceOverview {
    currency: string
    initial: number
    final: number
    discount_percent: number
    initial_formatted: string
    final_formatted: string
}

export interface SteamRawAppDetailsData {
    type: string
    name: string
    steam_appid: number
    is_free: boolean
    header_image: string
    price_overview?: SteamRawPriceOverview
}

export interface SteamRawAppDetailsResponse {
    [appId: string]: {
        success: boolean
        data?: SteamRawAppDetailsData
    }
}

export interface NormalizedGameSearchResult {
    externalId: string
    title: string
    imageUrl: string
    currency: string
    initialPrice: number
    finalPrice: number
    discountPercent: number
}

export interface NormalizedGameDetails {
    externalId: string
    title: string
    imageUrl: string
    storeUrl: string
    currency: string
    initialPrice: number
    finalPrice: number
    discountPercent: number
    isFree: boolean
}


