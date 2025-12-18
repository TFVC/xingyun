# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 删除默认的 nginx 静态文件
RUN rm -rf /usr/share/nginx/html/*

# 复制项目文件到容器中
COPY index.html /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY banner.png /usr/share/nginx/html/

# 创建自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]