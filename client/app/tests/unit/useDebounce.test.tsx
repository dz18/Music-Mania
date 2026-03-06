import { renderHook, act } from '@testing-library/react'
import useDebounce from '../../hooks/debounce'

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500))
    expect(result.current).toBe('hello')
  })

  it('does not update the value before the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 500 } }
    )

    rerender({ value: 'world', delay: 500 })
    act(() => { jest.advanceTimersByTime(300) })

    expect(result.current).toBe('hello')
  })

  it('updates the value after the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 500 } }
    )

    rerender({ value: 'world', delay: 500 })
    act(() => { jest.advanceTimersByTime(500) })

    expect(result.current).toBe('world')
  })

  it('resets the timer when the value changes before delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 500 } }
    )

    rerender({ value: 'wor', delay: 500 })
    act(() => { jest.advanceTimersByTime(300) }) // 300ms in — timer resets on next change

    rerender({ value: 'world', delay: 500 })
    act(() => { jest.advanceTimersByTime(300) }) // 300ms from last change — not yet debounced

    expect(result.current).toBe('hello')

    act(() => { jest.advanceTimersByTime(200) }) // now 500ms from last change

    expect(result.current).toBe('world')
  })

  it('respects a custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 1000 } }
    )

    rerender({ value: 'b', delay: 1000 })
    act(() => { jest.advanceTimersByTime(999) })
    expect(result.current).toBe('a')

    act(() => { jest.advanceTimersByTime(1) })
    expect(result.current).toBe('b')
  })
})
