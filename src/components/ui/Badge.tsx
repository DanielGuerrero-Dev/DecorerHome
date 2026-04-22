import { ReactNode } from "react"

export const Badge = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border border-current/10 ${className}`}>
      {children}
    </span>
  )
}
