'use client'
import { useSlideStore } from '@/store/useSlideStore'
import React from 'react'

type Props = {}

const Page = (props: Props) => {
    const {} = useSlideStore();
  return (
    <div>Page</div>
  )
}

export default Page