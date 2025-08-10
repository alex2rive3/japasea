import { useRef, useEffect } from 'react'

export function useAutoScroll(dependency?: any) {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [dependency])

  return {
    messagesContainerRef,
    scrollToBottom
  }
}
