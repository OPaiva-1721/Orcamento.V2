#!/bin/sh
set -eu

: "${DOMAIN:?DOMAIN env var is required}"

# Renderiza template substituindo apenas variáveis conhecidas
# (evita conflito com $host, $remote_addr, etc. do próprio Nginx)
envsubst '${DOMAIN}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
