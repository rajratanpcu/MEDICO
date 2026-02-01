import { useState, useEffect } from 'react'
import apiClient from '../services/api'

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get(url, options)
        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err.message || 'Failed to fetch data')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    if (url) {
      fetchData()
    }
  }, [url, options])

  const refetch = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get(url, options)
      setData(response.data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}

export default useFetch
