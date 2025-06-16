# Namecheap ddns server

Store your api secret in a file named `ddns-password.txt`.

And then set the required env variables:

```env
HOST=<YOUR HOST>
DOMAIN=<YOUR DOMAIN>
PASSWORD_FILE=<PATH TO ddns-password.txt>
```


Lastly run the application either via deno, the `Dockerfile` or the `docker-compose.yml`

