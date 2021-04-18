import json
import logging
import boto3
from botocore.exceptions import ClientError


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
        
        
     
def get_an_item(region, table_name, key):
        try:
            dynamodb_resource = boto3.resource("dynamodb", region_name=region)
            table = dynamodb_resource.Table(table_name)
            response = table.get_item(Key=key)
            item = response['Item']
            print(item)
        
        except ClientError as e:
            logging.error(e)
            return False
        return True
   
    
def lambda_handler(event, context):
    
    if event["httpMethod"] == 'POST':
        print(event["httpMethod"])
        
    if event["httpMethod"] == 'GET':
        print(event["httpMethod"])
    
    
    region = 'us-east-1'
    
    table_name="music"
    
    key_schema=[
        {
            "AttributeName": "artist",
            "KeyType": "HASH"
        },
        {
            'AttributeName': 'song',
            'KeyType': 'RANGE'
        }
    ]
    
    attribute_definitions=[
        {
            "AttributeName": "artist",
            "AttributeType": "S"
        },
        {
            "AttributeName": "song",
            "AttributeType": "S"
        }
        
    ]
    provisioned_throughput={
        "ReadCapacityUnits": 1,
        "WriteCapacityUnits": 1
    }
    
    #create_table(table_name, key_schema, attribute_definitions,provisioned_throughput, region)
   
    
    item = {
        "artist": "Pink Floyd",
        "song": "Us and Them",
        "album": "The Dark Side of the Moon",
        "year": 1973
    }
    
    #store_an_item(region, table_name, item)
    
    item = {
        "artist": "Michael Jackson",
        "song": "Billie Jean",
        "album": "Thriller",
        "length_seconds": 294 
    }
    
    #store_an_item(region, table_name, item)
    
    key_info={
        "artist": "Pink Floyd",
        "song": "Us and Them",
    }
    
    #data = get_an_item(region, table_name, key_info)
    body = event["body"]

    return {
        'statusCode': 200,
        'headers': { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body)
    }
