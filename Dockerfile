FROM denoland/deno:2.3.3

WORKDIR /app

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
COPY ./main.ts ./main.ts
COPY ./deno.json ./deno.json

CMD ["task", "start"]
