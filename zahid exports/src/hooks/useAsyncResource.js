import { useEffect, useState } from 'react'
import { resolveResource, resourceView } from '../data/asyncResource'

export default function useAsyncResource(key, load) {
  const [snapshot, setSnapshot] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    void resolveResource(key, load, controller.signal, setSnapshot)
    return () => controller.abort()
  }, [key, load, attempt])

  const retry = () => {
    setSnapshot(null)
    setAttempt((current) => current + 1)
  }
  return { ...resourceView(snapshot, key), retry }
}
