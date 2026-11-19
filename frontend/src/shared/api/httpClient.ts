export type HttpResponse = {
    status: number
    body: unknown
}

export async function getJson(url: string): Promise<HttpResponse> {
    const response = await fetch(url, {
        headers: { Accept: 'application/json' },
    })
    const body: unknown = await response.json()

    return { status: response.status, body }
}