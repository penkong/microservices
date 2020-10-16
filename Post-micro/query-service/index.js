const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// {'fdsfds': { id : 'fdsfdsfsd', title: 'post title', comments": [ {id: 'fs645645654f', content : 'commnet!!'}]}}
const posts = {};

const handleEvent = (type, data) => {
  if(type == 'PostCreated') {
    const {id, title} = data;
    posts[id] = {id, title, comments: []};
  }

  if(type == 'CommentCreated') {
    const {id, content, postId, status} = data;
    const post = posts[postId]
    post.comments.push({id, content, status})
  }

  if(type == 'CommentUpdated') {
    const {id ,content, status,postId} = data;
    const post = posts[postId];
    const comment = post.comments.find(c => c.id === id);
    comment.status = status;
    comment.content = content;
  }
}

app.get("/posts", (req, res) => {

  res.send(posts)
});


app.post('/events', (req, res)=> {

  const {type , data} = req.body;

  handleEvent(type, data);
  
  console.log(posts);

  res.send({})
})

app.listen(4002, async () =>{
  console.log("listening on query service 4002")
  const res = await axios.get('http://event-bus-srv:4005/events');
  for(let event of res.data) {
    console.log('processing event');
    handleEvent(event.type, event.data);
  }
});

//

