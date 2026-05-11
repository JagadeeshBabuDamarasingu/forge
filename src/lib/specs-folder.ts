import { useState, useEffect, useCallback } from 'react'

// IndexedDB helpers for persisting FileSystemDirectoryHandle across page loads.
// Browsers allow storing handles in IDB; permission must be re-granted each session.

const DB_NAME = 'forge-specs'
const STORE_NAME = 'folder-handles'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE_NAME)) {
        req.result.createObjectStore(STORE_NAME)
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function saveHandle(key: string, handle: FileSystemDirectoryHandle): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(handle, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function loadHandle(key: string): Promise<FileSystemDirectoryHandle | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(key)
    req.onsuccess = () => resolve((req.result as FileSystemDirectoryHandle) ?? null)
    req.onerror = () => reject(req.error)
  })
}

async function removeHandle(key: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export interface SpecsFolderHook {
  handle: FileSystemDirectoryHandle | null
  folderName: string | null
  isSupported: boolean
  isLoading: boolean
  permissionState: PermissionState | null
  selectFolder: () => Promise<void>
  clearFolder: () => Promise<void>
  requestPermission: () => Promise<boolean>
  writeFile: (filename: string, content: string) => Promise<boolean>
  fileExists: (filename: string) => Promise<boolean>
  downloadFile: (filename: string, content: string) => void
}

export function useSpecsFolder(projectId: string): SpecsFolderHook {
  const [handle, setHandle] = useState<FileSystemDirectoryHandle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null)

  const isSupported =
    typeof window !== 'undefined' && 'showDirectoryPicker' in window

  // Load persisted handle on mount and check permission
  useEffect(() => {
    if (!isSupported) {
      setIsLoading(false)
      return
    }
    let cancelled = false
    loadHandle(`project-specs-${projectId}`)
      .then(async (h) => {
        if (cancelled || !h) return
        const state = await (h as unknown as {
          queryPermission: (opts: { mode: string }) => Promise<PermissionState>
        }).queryPermission({ mode: 'readwrite' })
        if (!cancelled) {
          setHandle(h)
          setPermissionState(state)
        }
      })
      .catch(() => {/* IDB not available */})
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [projectId, isSupported])

  const selectFolder = useCallback(async () => {
    if (!isSupported) return
    try {
            // showDirectoryPicker is not in the standard TS lib yet
      const h = await (window as unknown as {
        showDirectoryPicker: (opts?: { mode?: string; startIn?: string }) => Promise<FileSystemDirectoryHandle>
      }).showDirectoryPicker({ mode: 'readwrite' })
      const state = await (h as unknown as {
        queryPermission: (opts: { mode: string }) => Promise<PermissionState>
      }).queryPermission({ mode: 'readwrite' })
      await saveHandle(`project-specs-${projectId}`, h)
      setHandle(h)
      setPermissionState(state)
    } catch {
      // User cancelled the picker — do nothing
    }
  }, [projectId, isSupported])

  const clearFolder = useCallback(async () => {
    await removeHandle(`project-specs-${projectId}`)
    setHandle(null)
    setPermissionState(null)
  }, [projectId])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!handle) return false
    try {
      const state = await (handle as FileSystemDirectoryHandle & {
        requestPermission: (opts: { mode: string }) => Promise<PermissionState>
      }).requestPermission({ mode: 'readwrite' })
      setPermissionState(state)
      return state === 'granted'
    } catch {
      return false
    }
  }, [handle])

  const writeFile = useCallback(async (filename: string, content: string): Promise<boolean> => {
    if (!handle) return false
    try {
      type HandleExt = { queryPermission: (o: { mode: string }) => Promise<PermissionState>; requestPermission: (o: { mode: string }) => Promise<PermissionState> }
      let state = await (handle as unknown as HandleExt).queryPermission({ mode: 'readwrite' })
      if (state !== 'granted') {
        state = await (handle as unknown as HandleExt).requestPermission({ mode: 'readwrite' })
        setPermissionState(state)
      }
      if (state !== 'granted') return false

      const fileHandle = await handle.getFileHandle(filename, { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write(content)
      await writable.close()
      return true
    } catch {
      return false
    }
  }, [handle])

  const fileExists = useCallback(async (filename: string): Promise<boolean> => {
    if (!handle) return false
    try {
      await handle.getFileHandle(filename)
      return true
    } catch {
      return false
    }
  }, [handle])

  // Fallback: trigger a browser download when File System Access API is unavailable
  const downloadFile = useCallback((filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  return {
    handle,
    folderName: handle?.name ?? null,
    isSupported,
    isLoading,
    permissionState,
    selectFolder,
    clearFolder,
    requestPermission,
    writeFile,
    fileExists,
    downloadFile,
  }
}
