# Namecheap ddns server

Set the required env variables:

```env
HOSTS=<YOUR HOST AS COMMA SEPERATED VALUES>
DOMAIN=<YOUR DOMAIN>
PASSWORD=<YOUR API SECRET>
CRON=<CRON SCHEDULE> # defaults to 0 * * * *
```


Lastly run the application either via deno, the `Dockerfile` or the `docker-compose.yml`

