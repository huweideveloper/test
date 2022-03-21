rm -rf dev

echo "dev文件已删除，准备打包"$1
webpack webpack.set.js
echo "打包成功，准备发版"



scp -r ./dev  ubuntu@106.75.215.100:/data/jy/pri_deploy/dev/mount/html
