# 将node作为父镜像
FROM node

#将容器的工作目录设置为/app（当前目录，如果/app不存在，WORKDIT会创建/app文件）
WORKDIR /app
# 将当前文件夹中的所有内容，复制到容器的/app中
COPY . /app

# 安装node包
RUN webpack --watch

# 容器对外暴露88端口
EXPOSE 88

# 环境变量
# ENV NAME=World

#容器启动是运行app.js
CMD [ "npm", "run" "dev" ]