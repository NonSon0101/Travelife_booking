import api, { handleError } from "API"
import { get } from "lodash"

const EXPORT_URL = '/api/v1/export'

export async function exportItinerary(tourId: string) {
    try {
        const url = `${EXPORT_URL}/itinerary/${tourId}`
        const response = await api.get(url, {
            responseType: 'blob'
        })
        
        const file = new Blob([response.data], { type: 'application/pdf' })
        const fileURL = window.URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = fileURL
        link.setAttribute('download', `itinerary-${tourId}.pdf`)
        document.body.appendChild(link)
        link.click()
        
        link.parentNode?.removeChild(link)
        window.URL.revokeObjectURL(fileURL)
    } catch (error) {
        handleError(error as Error, 'API/export', 'exportPDF')
        const errorMessage: string = get(error, 'data.error.message', '') || JSON.stringify(error)
        throw new Error(errorMessage)
    }
}