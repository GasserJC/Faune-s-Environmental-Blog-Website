const express = require('express')
const path = require('path');
const fs = require('fs');
require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});
const app = express()
const port = process.env.PORT || 3000;

app.set("view engine", "pug")
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'files')));

app.get('/', (req, res) => {
  res.render('Current.pug')
})

app.get('/About', (req, res) => {
  res.render('About.pug')
})

app.get('/OldPost/:title', (req, res) => {
  title = req.params['title']
  post_path = ("src/files/posts/" + title + '.txt')
  fs.readFile(post_path, 'utf-8', (err,data) => {
    content = (data)
    JSONcontent = {
      post: content
    }
   res.render('OldPost.pug', JSONcontent)
  }) 
})

app.get('/Archives', async (req, res) => {
  try{
  var files = await fs.readdirSync(path.join(__dirname, 'files/posts'));
  InputData = "{ ";
  counter = 0
  files.forEach( (title) => {
    stringTitle = title.toString()
    if(stringTitle != 'template.txt'){
      if(0 == counter){
        InputData += '"titles":' + `["${stringTitle.slice(0, -4)}" ,`
      } else if( files.length-counter-1 == 1) {
        InputData += `"${stringTitle.slice(0, -4)}"] }`
      }
      else { 
        InputData += `"${stringTitle.slice(0, -4)}",`
      }
    }
    counter++
  })
  InputData = JSON.parse(InputData)
  res.render('Archives.pug', InputData)
 } catch{
  res.render('Other.pug')
 }
})

app.get('/Other', (req, res) => {
  res.render('Other.pug')
})

app.get('/Contact', (req, res) => {
  res.render('Contact.pug')
})

app.get('/*', (req, res) => {
  res.render('Error.pug')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//(style="background-color:#abc4c4")