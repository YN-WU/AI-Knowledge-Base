FROM nginx:alpine
COPY . /usr/share/nginx/html
RUN rm -rf /usr/share/nginx/html/.git /usr/share/nginx/html/.omc /usr/share/nginx/html/scratch
EXPOSE 80
