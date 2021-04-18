import json
import logging
import boto3
from botocore.exceptions import ClientError

client = boto3.client('dynamodb')


def create_table(table_name, key_schema, attribute_definitions, provisioned_throughput, region):
        
        try:
            dynamodb_resource = boto3.resource("dynamodb", region_name=region)
            table = dynamodb_resource.create_table(TableName=table_name, KeySchema=key_schema, AttributeDefinitions=attribute_definitions,
                ProvisionedThroughput=provisioned_throughput)

            # Wait until the table exists.
            table.meta.client.get_waiter('table_exists').wait(TableName=table_name)
            
        except ClientError as e:
            logging.error(e)
            return False
        return True

 
        

def store_an_item(region, table_name, item):
        try:
            dynamodb_resource = boto3.resource("dynamodb", region_name=region)
            table = dynamodb_resource.Table(table_name)
            table.put_item(Item=item)
        
        except ClientError as e:
            logging.error(e)
            return False
        return True
        
        
def get_item(table_name, key):
        try:
            response = client.get_item(TableName=table_name,Key={'id':{'S':key}})
            item = response['Item']
            print(response)
            
        
        except ClientError as e:
            logging.error(e)
            return False
        return item
        

def put_item(table_name, item):
        try:
            response = client.put_item(TableName=table_name,Item=item)
            print(item)
            
        
        except ClientError as e:
            logging.error(e)
            return False
        return True
     
    
def lambda_handler(event, context):
    
    region = 'us-east-1'
    
    table_name="face"
    
    key_schema=[
        {
            "AttributeName": "id",
            "KeyType": "HASH"
        },
        {
            'AttributeName': 'faceInfo',
            'KeyType': 'RANGE'
        }
    ]
    
    attribute_definitions=[
        {
            "AttributeName": "id",
            "AttributeType": "S"
        },
        {
            "AttributeName": "faceInfo",
            "AttributeType": "S"
        }
        
    ]
    provisioned_throughput={
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
    }
    
    #create_table(table_name, key_schema, attribute_definitions,provisioned_throughput, region)
    
    #item = {"faceInfo": {"eyeBlink":105, "distraction":5, "confidence":1},"id": "2"}
    
    #store_an_item(region, table_name, item)
    
    #data = get_an_item(region, table_name, key_info)
    if event["httpMethod"] == 'POST':
        item = json.loads(event["body"])
        result = put_item(table_name, item)
        
    if event["httpMethod"] == 'GET':
        #result = get_an_item(region, table_name, key_info)
        key = event["queryStringParameters"]["id"]
        result = get_item(table_name, key)
        print(result)

    return {
        'statusCode': 200,
        'headers': { 
          'Content-Type': 'application/json',
          "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(result)
    }
