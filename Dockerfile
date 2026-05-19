FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/.git /usr/share/nginx/html/.omc /usr/share/nginx/html/scratch /usr/share/nginx/html/nginx.conf
EXPOSE 80
