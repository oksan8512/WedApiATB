
```
docker build -t api-npd421-api .

docker run -d --restart=always -v /volumes/npd421-api/images:/app/images --name npd421-api_container -p 3089:8080 api-npd421-api

```
