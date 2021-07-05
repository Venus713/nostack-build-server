
# Build-Server
## Pre-requsite
- Node
- Serverless

## Project Setup
```
- git clone --recurse-submodules https://Venus713@bitbucket.org/Venus713/build-server.git
- cd build-server
- cp src/actions/export/server/env.json.example src/actions/export/server/env.json
- npm install
```

## Env Config
```
cp .env.example .env
```
Edit .env file
```
REGION=us-east-1
AWS_ACCESS_KEY=AKI***
AWS_SECRET_KEY=8fE***
DB_URI=neo4j+s://***.databases.neo4j.io
DB_USER=neo4j
DB_PASSWORD=g_ale***
EXPORT_API_URL=http://3.82.238.88/api/v1/export

```

## Deploy
```
- sls offline start
or 
- sls deploy
```
 
## Endpoints

Plese use this [endpoint](https://85fzmy4e0d.execute-api.us-east-1.amazonaws.com/dev/graphql)

### Graphql query
1. verify email
- query
```
mutation VefiryEmail($awsInfo: AwsInfoInput!, $email: String!, $unrestricted: Boolean){
  verifyEmail(awsInfo:$awsInfo, email: $email, unrestricted: $unrestricted)
}
```
- query variables
```
{
  "awsInfo": {
    "REGION": "us-east-1",
    "AWS_ACCESS_KEY": "***",
    "AWS_SECRET_KEY": "***"
  },
  "email": "***@mail.com",
  "unrestricted": true
}
```
- query
```
mutation Export($awsInfo:AwsInfoInput!, $stackName: String!, $mailgunKey: String!, $mailgunDomain: String!, $replyTo:String, $senderEmail:String, $unrestricted:Boolean){
  export(awsInfo:$awsInfo, stackName:$stackName, mailgunKey:$mailgunKey, mailgunDomain:$mailgunDomain, replyTo:$replyTo, senderEmail:$senderEmail, unrestricted:$unrestricted)
}
```
- query variables
```
{
  "awsInfo": {
    "REGION": "us-east-1",
    "AWS_ACCESS_KEY": "AK***",
    "AWS_SECRET_KEY": "+cpQ****"
  },
  "stackName": "***",
  "mailgunKey": "key-***",
  "mailgunDomain": "mail.zmanenu.com",
  "replyTo": "***@gmail.com",
  "senderEmail": "**@gmail.com",
  "unrestricted": true
}
```
- http headers
```
{
    "jwt": <token>
}
```
### curl commands
- createStack:
```
curl 'http://localhost:3000/dev/graphql' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Origin: http://localhost:3000' -H 'jwt: ***' --data-binary '{"query":"mutation CreateStack($stackName:String!, $modName:String!, $modEmail:String!, $modPassword:String!, $licenseId:String, $termsAndConds:Boolean, $unrestricted:Boolean){\n  createStack(stackName:$stackName, modName:$modName, modEmail:$modEmail, modPassword:$modPassword, licenseId:$licenseId, termsAndConds:$termsAndConds, unrestricted:$unrestricted)\n}","variables":{"stackName":"***","modName":"***","modEmail":"***","modPassword":"***","licenseId":"***","termsAndConds":true,"unrestricted":true}}' --compressed
```
- export:
```
curl 'http://localhost:3000/dev/graphql' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Origin: http://localhost:3000' -H 'jwt:******' --data-binary '{"query":"mutation Export ($awsInfo: AwsInfoInput!, $mailgunKey:String!, $mailgunDomain:String!, $replyTo: String!, $senderEmail: String!, $stackName: String!, $unrestricted: Boolean){\n  export(awsInfo:$awsInfo, mailgunKey: $mailgunKey, mailgunDomain: $mailgunDomain, replyTo: $replyTo, senderEmail:$senderEmail, stackName:$stackName, unrestricted:$unrestricted)\n}","variables":{"awsInfo":{"REGION":"us-east-*","AWS_ACCESS_KEY":"******","AWS_SECRET_KEY":"******"},"stackName":"******","mailgunKey":"******","mailgunDomain":"******","replyTo":"******","senderEmail":"***","unrestricted":false}}' --compressed
```

## Test UI
Please use this [link](http://export-test-ui.s3-website-us-east-1.amazonaws.com/export-server)
