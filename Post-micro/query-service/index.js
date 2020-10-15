const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get("/posts/", (req, res) => {

});


app.post('/events', (req, res)=> {
  console.log('event received', req.body.type);
  res.send({})
})

app.listen(4002, () => console.log("listening on query service 4002"));

//

