import { useState } from 'react'
import { Project } from '../utils/types'

const usePagination = (data: Project[] | undefined, itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1)
  if (data) {

      const maxPage = Math.ceil(data.length / itemsPerPage)
      
      const currentData = () => {
          const begin = (currentPage - 1) * itemsPerPage
          const end = begin + itemsPerPage
          return data?.slice(begin, end)
        }
        
        const next = () => {
            setCurrentPage(Math.min(currentPage + 1, maxPage))
        }
        
        const prev = () => {
            setCurrentPage(currentPage => Math.max(currentPage - 1, 1))
        }
        
        const jump = (page: number) => {
            const pageNumber = Math.max(1, page)
            setCurrentPage(Math.min(pageNumber, maxPage))
        }
        
        return { next, prev, jump, currentData, currentPage, maxPage }
    }
}

export default usePagination