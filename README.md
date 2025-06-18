# Namecheap Dynamic DNS Server

A lightweight Dynamic DNS updater for Namecheap domains using Deno.

## Setup

1. **Get your Dynamic DNS password** from Namecheap:
   - Log into your Namecheap account
   - Go to Domain List → Manage → Advanced DNS
   - Enable Dynamic DNS and copy the password

2. **Store your password** in a file named `ddns-password.txt`

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `HOSTS` | Comma-separated hostnames to update | `www,@` or `subdomain` |
| `DOMAIN` | Your domain name | `example.com` |
| `PASSWORD_FILE` | Path to password file | `./ddns-password.txt` |
| `CRON` | Update schedule (optional) | `0 * * * *` (hourly) |

## Running

### With Deno
```bash
deno task dev    # Development with .env file
deno task start  # Production
```

### With Docker
```bash
docker build -t namecheap-ddns .
docker run -d --name ddns --env-file .env -v $(pwd)/ddns-password.txt:/app/ddns-password.txt namecheap-ddns
```

### With Docker Compose
```bash
# Edit docker-compose.yml with your values
docker-compose up -d
```

## Exit Codes

- `0`: Success
- `1`: Missing configuration
- `2`: Failed to fetch public IP
- `3`: DNS update failed

## Troubleshooting

- **Check logs**: `docker logs namecheap-ddns`
- **Verify environment variables** are set correctly
- **Ensure password file** is accessible and contains valid password
- **Test manually** with `deno task dev`

