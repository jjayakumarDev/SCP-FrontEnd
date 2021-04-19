import json
import boto3
from datetime import date

s3 = boto3.resource('s3')


def lambda_handler(event, context):
    bucket = 'file-upload-lambda-nci'
    today = date.today()
    currentDate = today.strftime("%m-%d-%Y")
    filename = currentDate + '.html'
    obj = s3.Object(bucket, filename)
    body = obj.get()['Body'].read()
    print('read completed',body)
    
    return {
        'statusCode': 200,
        'headers': { 
          'Content-Type': 'application/json',
          "Access-Control-Allow-Headers" : "*",
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': body
    }

