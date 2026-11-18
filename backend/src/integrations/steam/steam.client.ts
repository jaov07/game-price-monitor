import { createAppError } from "../../shared/errors/app-error.js"
import {
    mapSteamSearchItem,
    mapSteamGameDetails,
} from "./steam.mapper.js"
import type {
    SteamRawSearchResponse,
    SteamRawAppDetailsResponse,
    NormalizedGameSearchResult,
    NormalizedGameDetails,
} from "./steam.types.js"

// URLs oficiais da Steam Web API
const STEAM_SEARCH_URL = "https://store.steampowered.com/api/storesearch/"
const STEAM_DETAILS_URL = "https://store.steampowered.com/api/appdetails"

// O QUE ISSO FAZ:
// Pesquisa jogos na Steam pelo nome em tempo real
export async function searchSteamGames(
    term: string,
): Promise<NormalizedGameSearchResult[]> {
    if (!term || term.trim().length === 0) {
        return []
    }

    const queryParams = new URLSearchParams({
        term: term.trim(),
        cc: "br",           // Região Brasil (moeda R$)
        l: "brazilian",     // Idioma português brasileiro
    })

    try {
        const response = await fetch(`${STEAM_SEARCH_URL}?${queryParams.toString()}`, {
            signal: AbortSignal.timeout(5000), // Cancela após 5 segundos se a Steam travar
        })

        if (!response.ok) {
            throw createAppError(`Steam search failed with status ${response.status}`, 502)
        }

        const data = (await response.json()) as SteamRawSearchResponse

        if (!data.items || !Array.isArray(data.items)) {
            return []
        }

        return data.items.map(mapSteamSearchItem)
    } catch (error) {
        if (error instanceof Error && error.name === "TimeoutError") {
            throw createAppError("Steam API timed out. Try again later.", 504)
        }
        throw error
    }
}


export async function getSteamGameDetails(
    appId: string,
): Promise<NormalizedGameDetails | null> {
    const queryParams = new URLSearchParams({
        appids: appId,
        cc: "br",
        l: "brazilian",
    })

    try {
        const response = await fetch(`${STEAM_DETAILS_URL}?${queryParams.toString()}`, {
            signal: AbortSignal.timeout(5000),
        })

        if (!response.ok) {
            throw createAppError(`Steam details failed with status ${response.status}`, 502)
        }

        const data = (await response.json()) as SteamRawAppDetailsResponse
        const appEntry = data[appId]

        // Se a Steam não encontrar o AppID ou success for falso
        if (!appEntry || !appEntry.success || !appEntry.data) {
            return null
        }

        return mapSteamGameDetails(appId, appEntry.data)
    } catch (error) {
        if (error instanceof Error && error.name === "TimeoutError") {
            throw createAppError("Steam API timed out. Try again later.", 504)
        }
        throw error
    }
}