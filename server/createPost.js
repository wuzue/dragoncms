const fs = require("fs")

const newPost = {
  title: "sexto post",
  content: "++++++++",
  author: "çççççççççççç"
}

fs.readFile('./posts.json', (error, data) => {
  if(error){
    console.error('error reading file ', error);
  } else {
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