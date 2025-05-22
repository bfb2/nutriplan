import express from 'express'
import jwt from 'jsonwebtoken'
import path from 'path'
import cors from 'cors'
import bodyParser from "body-parser";
import bcrypt from 'bcrypt'
import { fileURLToPath } from "url";
import { MongoClient, ServerApiVersion } from "mongodb";
/* import { insertDocument } from "./crud-mongo.js"; */
import cookieParser from "cookie-parser";
import { configDotenv } from 'dotenv';

configDotenv()
const app =  express()
let jsonParser = bodyParser.json()
let urlencodedParser = bodyParser.urlencoded({extended:true})
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



app.use(cors({
    origin: 'https://bfb2.github.io/', // Specify your frontend origin
    credentials: true,  // Allow credentials
  }));
app.use(bodyParser.urlencoded({
    extended: true
 }))
app.use(express.json());
app.use(cookieParser(process.env.COOKIEKEY));

const client = new MongoClient(process.env.URI, {
    serverApi:{
        version:ServerApiVersion.v1,
        strict:true,
        deprecationErrors:true
    }
})

const mongoDB = client.db('nutrition').collection('users')

const hashPW = async (password) => {
    let salt = await bcrypt.genSalt()
    let hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword
}

app.post('/signup', async (req, res) => {
    let {username, password} = req.body
    let hashedPassword = await hashPW(password)
    try {
        await client.db('nutrition').collection('users').insertOne({
            _id:username, 
            password:hashedPassword, 
            recipe:{},
            meal:{},
            food:{},
            diary:{},
            nutrientRDA:{},
            dashboardDisplay:{}
        })
        res.send({success:true})
    } catch (error) {
        res.send({success:false, errorCode:error.code || 'generic'})
        
    }
})

app.post('/logout', (req, res)=>{
  res.clearCookie('auth', {
    httpOnly:true,
    sameSite:'strict',
    secure:false,
    path:'/'
  })
  res.clearCookie('loggedInToken', {
    httpOnly:false,
    path:'/'
  })
  res.end()
})

app.post('/login', async (req, res) => {
    let {password:clientPassword, username} = req.body
    const returnedData = await client.db('nutrition').collection('users').findOne({_id:username})
    
    if(returnedData == null){
        return res.send({success:false, errorCode:0})
    }
     
    let match = await bcrypt.compare(clientPassword, returnedData.password)

    if(!match)
        return res.send({success:false, errorCode:1})

    const token = jwt.sign({username},process.env.SECRETKEY,{expiresIn:'12h'})

    res.cookie('auth',token,{
        httpOnly:true,
        secure:false,
        sameSite:'strict',
        maxAge:43200000,
        path:'/',
        signed:true
    })
    res.cookie('loggedInToken', true, {
      httpOnly:false,
      maxAge:43200000,
      path:'/'
    })
    
    const {recipe, meal, food, nutrientRDA, dashboardDisplay, diary} = returnedData
    res.send({success:true, recipe, meal, food, nutrientRDA, dashboardDisplay, diary})
})

app.post('/save-custom-item', async (req, res) => {
    const { data, itemType} = req.body    
    const userName = retrieveUserName(req.signedCookies.auth)
    if(!userName|| !data ||!itemType)
      return
    mongoDB.updateOne({_id:userName}, {$set:{[`${[itemType]}.${data.id}`]:data}} )
    
})

app.post('/save-diary-entry', (req, res) =>{
    const userName = retrieveUserName(req.signedCookies.auth)
    const {data,date, username} = req.body
    mongoDB.updateOne({_id:userName}, {$push:{
        [`diary.${date}`]:data
    }}, {upsert:true})
})

app.delete('/remove-diary-item', (req, res) => {
  const userName = retrieveUserName(req.signedCookies.auth)
    const {date, index} = req.body
    if(!userName || !date || !index)
      return
    mongoDB.updateOne({
        _id: userName
      },
      [
        {
          $set: {
            [`diary.${date}`]: {
              $concatArrays: [
                {
                  $slice: [
                    `$diary.${date}`,
                    index
                  ]
                },
                {
                  $slice: [
                    `$diary.${date}`,
                    {
                      $add: [
                        1,
                        index
                      ]
                    },
                    {
                      $size: `$diary.${date}`
                    }
                  ]
                }
              ]
            }
          }
        }
      ])
})

app.delete('/delete-custom-item', (req, res) => {
  const { id, db} = req.body
  const userName = retrieveUserName(req.signedCookies.auth)
  if(!userName || !id|| !db)
    return
  
  mongoDB.updateOne({_id:userName}, {$unset:{[`${db}.${id}`]:1}})
})

app.patch('/update-reference', (req, res) =>{
  const userName = retrieveUserName(req.signedCookies.auth)
  const {db, id, reference, increment} =req.body
  if(!db || !id || !reference || !userName || !increment)
    return
  mongoDB.updateOne({_id:userName}, {$inc:{[`${db}.${id}.referencedBy.${reference}`]: increment ? 1 : -1}})
})

app.post('/update-rda', (req, res) => {
  const userName = retrieveUserName(req.signedCookies.auth)
  const {nutrient, value} = req.body
  if(!userName || !nutrient || !value)
    return
    
    mongoDB.updateOne({_id:userName}, {$set:{[`nutrientRDA.${nutrient}`]:value}})
})

app.post('/update-dashboard', (req, res) =>{
  const { nutrient, value} = req.body
  const userName = retrieveUserName(req.signedCookies.auth)
    if(!userName || !nutrient || !value)
      return
    mongoDB.updateOne({_id:userName}, {$set:{[`dashboardDisplay.${nutrient}`]:value}})
})

const retrieveUserName = (token) => {
  
  const username = jwt.verify(token, process.env.SECRETKEY).username
  if(username)
    return username
}

const port = process.env.PORT || 5000;
app.listen(port);

