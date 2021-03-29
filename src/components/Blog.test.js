import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

describe('renders content', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen'
    }
  }

  const user = {
    username: 'mluukkai'
  }


  let component
  beforeEach(() => {
    component = render(<Blog blog={blog} user={user}/>)
  })

  test('renders title and author', () => {
    component.debug()

    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).toHaveTextContent(blog.author)
  })

  test('at start url and likes are not visible', () => {
    const div = component.container.querySelector('.togglableDetail')
    expect(div).toHaveStyle('display: none')
  })

  test('at start url is not visible', () => {
    const urlElement = component.getByText(blog.url)
    const urlParentNode = urlElement.parentElement

    console.log('urls parent node', prettyDOM(urlParentNode))

    expect(urlParentNode).toHaveStyle('display: none')
  })

  test('at start likes are not visible', () => {
    const likeButtonElement = component.getByText('likes 7')
    expect(likeButtonElement).not.toBeVisible()
  })

  // Some other ways to check if like button are visible
  /*
  test('at start like button is not visible (1)', () => {
    const likeButtonElement = component.getByRole('button', { hidden: true, name: 'like' })
    expect(likeButtonElement).not.toBeVisible()
  })

  test('at start like button is not visible (2)', () => {
    const likeButtonElement = component.queryByRole('button', { name: 'like' })
    expect(likeButtonElement).toBeFalsy()
  })
  */

  test('after clicking the view button, blogs url and number of likes are displayed', () => {
    const button = component.getByText(/view/i)
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableDetail')
    expect(div).not.toHaveStyle('display: none')
  })
})

describe('event handlers', () => {
  test('clicking the like button twice calls event handler twice', () => {
    const blog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      user: {
        username: 'mluukkai',
        name: 'Matti Luukkainen'
      }
    }

    const user = {
      username: 'mluukkai'
    }

    const mockHandler = jest.fn()

    const component = render(<Blog blog={blog} user={user} updateBlog={mockHandler}/>)

    // not nessary but client must do
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})

