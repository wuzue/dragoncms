  const fs = require("fs")

  const newPost = {
    title: "log",
    content: "log post",
    author: "log post"
  }

  fs.readFile('./posts.json', (error, data) => {
    if(error){
      console.error('error reading file ', error);
    } else {
      console.log('file loaded');
      let posts = []
      if(data.length > 0) {
        posts = JSON.parse(data)
      }
      posts.push(newPost)
      fs.writeFile('./posts.json', JSON.stringify(posts), (error) => {
        if(error){
          console.error('error writing file ', error);
        }else{
          console.log('post added to file!');
        }
      })
    }
  }) 