import type {
    SteamRawSearchItem,
    SteamRawAppDetailsData,
    NormalizedGameSearchResult,
    NormalizedGameDetails,
} from "./steam.types.js"

// O QUE ISSO FAZ:
// Converte centavos da Steam (ex: 22990) em valor decimal real (ex: 229.90)
export function parseSteamPrice(cents: number | undefined): number {
    if (!cents || cents <= 0) return 0
    return Number((cents / 100).toFixed(2))
}

// O QUE ISSO FAZ:
// Normaliza um item retornado da busca da Steam
export function mapSteamSearchItem(
    rawItem: SteamRawSearchItem,
): NormalizedGameSearchResult {
    return {
        externalId: String(rawItem.id),
        title: rawItem.name,
        imageUrl: rawItem.tiny_image,
        currency: rawItem.price?.currency || "BRL",
        initialPrice: parseSteamPrice(rawItem.price?.initial),
        finalPrice: parseSteamPrice(rawItem.price?.final),
        discountPercent: rawItem.price?.discount_percent || 0,
    }
}

// O QUE ISSO FAZ:
// Normaliza os dados completos de um jogo a partir da API de detalhes
export function mapSteamGameDetails(
    appId: string,
    rawData: SteamRawAppDetailsData,
): NormalizedGameDetails {
    const isFree = rawData.is_free || false
    const price = rawData.price_overview

    return {
        externalId: String(rawData.steam_appid || appId),
        title: rawData.name,
        imageUrl: rawData.header_image,
        storeUrl: `https://store.steampowered.com/app/${appId}`,
        currency: price?.currency || "BRL",
        initialPrice: isFree ? 0 : parseSteamPrice(price?.initial),
        finalPrice: isFree ? 0 : parseSteamPrice(price?.final),
        discountPercent: isFree ? 0 : price?.discount_percent || 0,
        isFree,
    }
}