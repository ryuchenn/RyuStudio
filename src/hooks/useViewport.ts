import { MOBILE_BREAKPOINT } from "@/helpers/constants"
import { useState, useEffect } from "react"

export default function useViewport() {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    function onWindowResize() {
      setIsMobile(window?.innerWidth <= MOBILE_BREAKPOINT)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", onWindowResize)
      onWindowResize()
      return () => {
        window.removeEventListener("resize", onWindowResize)
      }
    }
  }, [])

  return { isMobile }
}
