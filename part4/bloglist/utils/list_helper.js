const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0
  return blogs.reduce((sum, next) => sum + next.likes, 0)
}

const favoriteBlog = (blogs) => {
  let max = blogs[0]
  for(let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > max.likes) max = blogs[i]
  }
  return max
}

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const countObjects = (blogs) => {
  const countAuthors = {}

  blogs.forEach(blog => {
    const name = blog.author
    if (countAuthors[name] === undefined ) {
      countAuthors[name] = 1
    } else {
      countAuthors[name]++
    }
  })
  return countAuthors
}
 
const mostBlogs = (blogs) => {
  let maxBlog = {
    author: '',
    blogs: 0
  }
  // Counts the number of blogs each author has
  const countAuthors = countObjects(blogs)
  // counts the maximum number of blogs each author has
  const keys = Object.keys(countAuthors)
  keys.forEach(key => {
    const blogs = countAuthors[key]
    if (maxBlog.blogs < blogs) {
      maxBlog.author = key
      maxBlog.blogs = blogs
    }
  })
  return maxBlog
}

const mostLikes = (blogs) => {
  const authors = {}
  blogs.forEach(blog => {
    const author = blog.author
    if (authors[author] === undefined) {
      authors[author] = blog.likes
    } else {
      authors[author] += blog.likes
    }
  })

  const keys = Object.keys(authors)
  
  const mostLikedAuthor = {
    author: '',
    likes: 0
  }

  keys.forEach(key => {
    if (mostLikedAuthor.likes < authors[key]) {
      mostLikedAuthor.author = key,
      mostLikedAuthor.likes = authors[key]
    }
  })
  return mostLikedAuthor
}
module.exports = { 
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}