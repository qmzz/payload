import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  size?: 'sm' | 'md' | 'lg'
}

export const Logo = (props: Props) => {
  const { className, size = 'md' } = props

  const sizeClasses = {
    sm: 'h-16 w-auto',  // 64px
    md: 'h-24 w-auto',  // 96px
    lg: 'h-32 w-auto',  // 128px
  }

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <img
        src="/media/CyberEmpire-logo.png"
        alt="赛博帝国 Logo"
        className={clsx('object-contain', sizeClasses[size])}
        loading={props.loading}
      />
      <span className="text-xl font-bold text-white">赛博帝国</span>
    </div>
  )
}
