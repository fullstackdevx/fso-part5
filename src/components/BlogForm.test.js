import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('when form is submited the event handler receives the right details', () => {
  const mockHandler = jest.fn()

  const component = render(<BlogForm  createBlog={mockHandler} />)

  const titleInput = component.getByRole('textbox', { name: 'title' })
  const authorInput = component.getByRole('textbox', { name: 'author' })
  const urlInput = component.getByRole('textbox', { name: 'url' })
  const form = component.container.querySelector('form')

  fireEvent.change(titleInput, {
    target: { value: 'React patterns' }
  })
  fireEvent.change(authorInput, {
    target: { value: 'Michael Chan' }
  })
  fireEvent.change(urlInput, {
    target: { value: 'https://reactpatterns.com/' }
  })
  fireEvent.submit(form)

  expect(mockHandler).toHaveBeenCalledTimes(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('React patterns')
  expect(mockHandler.mock.calls[0][0].author).toBe('Michael Chan')
  expect(mockHandler.mock.calls[0][0].url).toBe('https://reactpatterns.com/')
})
