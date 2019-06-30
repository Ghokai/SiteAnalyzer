# SiteAnalyzer
## Web Crawler with Angular 8, Expressjs and Redis

You can simple run redis, server and client in docker containers with docker compose


    docker-compose up 

docker-compose terminal
------------------------    
![image](https://user-images.githubusercontent.com/11095906/60393436-4bf61300-9aca-11e9-89c9-7c7e8554b559.png)

analyzer server runs in http://localhost:3000
---------------------------------------------   
![image](https://user-images.githubusercontent.com/11095906/60393468-d0e12c80-9aca-11e9-8f45-73f173096766.png)

analyzer client runs in http://localhost:4200
---------------------------------------------
![image](https://user-images.githubusercontent.com/11095906/60393495-2b7a8880-9acb-11e9-9d5d-8c94a273484f.png)

![image](https://user-images.githubusercontent.com/11095906/60393511-6a104300-9acb-11e9-95b1-8da33b4d4974.png)

redis cache runs on redis:6379 in container
---------------------------------------------
![image](https://user-images.githubusercontent.com/11095906/60393536-c8d5bc80-9acb-11e9-9f58-e7cfd4176e46.png)


> User goes to analyzer-client(htttp://localhost:4200) and enters sitename(url) for getting analyze results of site and click button.

> Analyzer-client make post request to analyzer-server(http://localhost:3000/analyze) with sitename parameter

> Analyzer-server check redis cache if analyze result calculated before in 24 hours server will be return analyze result immediately from cache.

> If analyze result not found in cache. Analyzer server will make request to site and load its content. And will make some web crawling process for extracting information from document content.

> After analyze result gathered. result will be storing in the cache server for later usage with 1 day expiration time.

> Analyzer server will be return analyze results to analyzer-client and analyzer client shows analyze results to user. 
---------------------------------------------


