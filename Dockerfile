FROM harbor.gaf.net.cn/library/nginx:1.17.10-alpine

MAINTAINER gafci "gaf@supermap.com"

COPY dist.zip /

COPY default.conf /etc/nginx/conf.d

RUN unzip /dist.zip -d / && \
    cp -r /dist /usr/share/nginx/html/apps-bzgis

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]