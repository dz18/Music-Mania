import { renderHook, act } from '@testing-library/react'
import useDropdown from '../../hooks/useSearchDropdown'

describe('useDropdown', () => {
  it('initialises with open as false', () => {
    const { result } = renderHook(() => useDropdown())
    expect(result.current.open).toBe(false)
  })

  it('openDropdown sets open to true', () => {
    const { result } = renderHook(() => useDropdown())
    act(() => { result.current.openDropdown() })
    expect(result.current.open).toBe(true)
  })

  it('closeDropdown sets open to false', () => {
    const { result } = renderHook(() => useDropdown())
    act(() => { result.current.openDropdown() })
    act(() => { result.current.closeDropdown() })
    expect(result.current.open).toBe(false)
  })

  it('closeDropdown is a no-op when already closed', () => {
    const { result } = renderHook(() => useDropdown())
    act(() => { result.current.closeDropdown() })
    expect(result.current.open).toBe(false)
  })

  it('toggleDropdown opens when closed', () => {
    const { result } = renderHook(() => useDropdown())
    act(() => { result.current.toggleDropdown() })
    expect(result.current.open).toBe(true)
  })

  it('toggleDropdown closes when open', () => {
    const { result } = renderHook(() => useDropdown())
    act(() => { result.current.openDropdown() })
    act(() => { result.current.toggleDropdown() })
    expect(result.current.open).toBe(false)
  })

  it('toggleDropdown alternates state on repeated calls', () => {
    const { result } = renderHook(() => useDropdown())
    act(() => { result.current.toggleDropdown() })
    act(() => { result.current.toggleDropdown() })
    act(() => { result.current.toggleDropdown() })
    expect(result.current.open).toBe(true)
  })

  it('setOpen directly sets open to true', () => {
    const { result } = renderHook(() => useDropdown())
    act(() => { result.current.setOpen(true) })
    expect(result.current.open).toBe(true)
  })

  it('setOpen directly sets open to false', () => {
    const { result } = renderHook(() => useDropdown())
    act(() => { result.current.openDropdown() })
    act(() => { result.current.setOpen(false) })
    expect(result.current.open).toBe(false)
  })
})
