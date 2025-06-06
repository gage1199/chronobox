import { useState, useRef } from 'react'
import Image from 'next/image'

interface AvatarUploaderProps {
  currentAvatarUrl?: string
  onAvatarUpdate: (avatarUrl: string) => void
  disabled?: boolean
}

export default function AvatarUploader({ 
  currentAvatarUrl, 
  onAvatarUpdate, 
  disabled = false 
}: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Only JPEG and PNG files are allowed')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    try {
      setUploading(true)
      setError(null)

      // Get presigned URL
      const presignResponse = await fetch('/api/profile/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        })
      })

      if (!presignResponse.ok) {
        const errorData = await presignResponse.json()
        throw new Error(errorData.error || 'Failed to get upload URL')
      }

      const { uploadUrl, finalUrl } = await presignResponse.json()

      // Upload file to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      // Update profile with new avatar URL
      onAvatarUpdate(finalUrl)
      setPreviewUrl(null) // Clear preview since we now have the final URL

    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
      setPreviewUrl(null)
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const displayUrl = previewUrl || currentAvatarUrl

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 border-4 border-white dark:border-slate-600 shadow-lg">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt="Profile Avatar"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Upload Progress Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-xs">Uploading...</p>
            </div>
          </div>
        )}

        {/* Change Avatar Button */}
        <button
          onClick={triggerFileSelect}
          disabled={disabled || uploading}
          className="absolute bottom-0 right-0 w-10 h-10 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-400 rounded-full border-4 border-white dark:border-slate-800 shadow-lg flex items-center justify-center transition-colors duration-200"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Upload Button */}
      <button
        onClick={triggerFileSelect}
        disabled={disabled || uploading}
        className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 rounded-lg transition-colors duration-200 text-sm font-medium"
      >
        {uploading ? 'Uploading...' : currentAvatarUrl ? 'Change Avatar' : 'Upload Avatar'}
      </button>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm text-center max-w-xs">
          {error}
        </p>
      )}

      {/* File Requirements */}
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs">
        JPEG or PNG files only. Maximum size: 5MB.
      </p>
    </div>
  )
} 