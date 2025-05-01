import { createContext, useContext, useState } from "react"

export const FileUploadContext = createContext<any>(null)

export const useFileUploadContext = () => {
    const context = useContext(FileUploadContext)
    if (!context) {
        throw new Error("useFileUploadContext must be used within a FileUploadProvider")
    }
    return context
}

export const FileUploadProvider = ({ children }: { children: React.ReactNode }) => {
    const [files, setFiles] = useState<File[]>([])

    const value = {
        acceptedFiles: files,
        setAcceptedFiles: setFiles
    }

    return (
        <FileUploadContext.Provider value={value}>
            {children}
        </FileUploadContext.Provider>
    )
} 