FROM nginx:alpine

COPY frontend/lab1_2/dist /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /uploads && chmod 777 /uploads

VOLUME /uploads

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]