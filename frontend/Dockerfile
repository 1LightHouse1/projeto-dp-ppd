FROM nginx:alpine
COPY public /usr/share/nginx/html
COPY src/main.js /usr/share/nginx/html/main.js
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN apk add --no-cache dos2unix >/dev/null \
 && dos2unix /etc/nginx/conf.d/default.conf >/dev/null 2>&1 || true
EXPOSE 8080
