import Post from './models/post'

const newPost = new Post({
  title: 'My First Post',
  content: 'This is the content of my first post',
  author: 'Dragonren'
});

console.log(newPost);


newPost.save((error: Error) => {
  if (error) {
    console.log('Error saving post:', error);
  } else {
    console.log('Post saved successfully');
  }
});