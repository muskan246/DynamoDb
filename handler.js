'use strict';
const AWS = require('aws-sdk')

module.exports = {
  create: async(event,context)=> {
    let bodyObj = {};
    try{
      bodyObj = JSON.parse(event.body)
    } catch(jsonError){
      console.log("There was an error parsing the body : ",jsonError)
      return {
        statusCode: 400
      }
    }
    if( typeof bodyObj.name  === 'undefined' || typeof bodyObj.age  === 'undefined'){
      console.log("missing parameters")
      return{
        statusCode: 400
      }
    }
    let putParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE,
      Item: {
        name:  bodyObj.name,
        age: bodyObj.age
      }
    }
    let putResult = {}
    try {
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      putResult = await dynamodb.put(putParams).promise()
      console.log("newww: ",putResult)
    } catch(putError){
      console.log("there was a problem putting the params: ",putError)
      console.log(":params:",putParams)
      return {
        statusCode:500
      }
    }

    return{
      statusCode:201
    }
  },

  list: async(event,context)=> {
    let scanParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE
    }
    
    let scanResult = {}
    try{
      let dynamodb = new AWS.DynamoDB.DocumentClient();
      scanResult = await dynamodb.scan(scanParams).promise()
      
    } catch(scanError){
      console.log("there was a problem scanning the kittens: ",scanError)
      return {
        statusCode:500
      }
    }

    if(scanResult.Items === null || !Array.isArray(scanResult.Items) || scanResult.Items.length === 0){
      return {
        statusCode:404
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(scanResult.Items.map(kitten => {
        return{
          name: kitten.name,
          age: kitten.age
        }
      }))
    }

  },

  // get: async(event, context)=>{
  //   let getParams = {
  //     TableName = process.env.DYNAMODB_KITTEN_TABLE,
  //     Key:{
  //       name: event.pathParameters.name
  //     }

  //   }
  //   let getResult = {}
  //   try{
  //     let dynamodb = new AWS.DynamoDB.DocumentClient(); 
  //     getResult = dynamodb.get(getParams).promise()

  //   }catch(getError){
  //     console.log("there was a problem scanning the kittens: ",getError)
  //     return{
  //       statusCode: 500
  //     }
  //   }
  //   if(getResult.Items === null){
  //     return{
  //       statusCode:404
  //     }
  //   }
  //   return{
  //     statusCode: 200,
  //     body: JSON.stringify({
  //       name: getResult.Items.name,
  //       age: getResult.Items.age
  //     })
  //   }

  // },
  update: async(event,context)=>{
    let bodyObj = {}
    try{
      bodyObj = JSON.parse(event.body)
    } catch(jsonError){
      console.log("There was an error parsing the body : ",jsonError)
      return {
        statusCode: 400
      }
    }
    if(typeof bodyObj.age === 'undefined'){
      console.log("missing parameters")
      return{
        statusCode: 400
      }
    }
    console.log("event value : ",event)
    console.log("body obj : ",bodyObj)
    console.log("path parametrs: ", event.pathParameters.name)
    let updateParams = {
      TableName: process.env.DYNAMODB_KITTEN_TABLE,
      Key: {
        name: event.pathParameters.name
      },
      UpdateExpression: 'set #age = :age',
      
      ExpressionAttributeValues:{
        ':age': bodyObj.age
      },
      ReturnValues:"UPDATED_NEW"
    }
    let updateResult = {}
    try{
      let dynamodb = new AWS.DynamoDB.DocumentClient()
      updateResult = dynamodb.update(updateParams).promise()
      console.log("update result: ",updateResult)
    }catch(updateError){
      console.log("there was a problem updating the kittens: ",updateError)
      return{
        statusCode: 500
      }
    }
    return{
      statusCode: 200
    }

  }

  // delete: async(event,context)=>{
  //   let deleteParams = {
  //     TableName = process.env.DYNAMODB_KITTEN_TABLE,
  //     Key:{
  //       name:event.pathParameters.name
  //     }
  //   }
  //   let deleteResult = {}
  //   try{
  //     let dynamodb = new AWS.DynamoDB.DocumentClient()
  //     deleteResult = dynamodb.delete(deleteParams).promise()

  //   }catch(deleteError){
  //     console.log("there was a problem updating the kittens: ",updateError)
  //     return{
  //       statusCode: 500
  //     }
  //   }
  //   return{
  //     statusCode: 200
  //   }
    
  // }
}