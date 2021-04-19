import json
import logging
import boto3
from botocore.exceptions import ClientError

client = boto3.client('dynamodb')


def lambda_handler(event, context):
    
    if event["httpMethod"] == 'GET':
        response = client.scan(TableName='face')
        items = response['Items']

    return {
        'statusCode': 200,
        'headers': { 
          'Content-Type': 'application/json',
          "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(items)
    }
