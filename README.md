# 登录iconfont

进入这个[地址](https://www.iconfont.cn/)，然后注册或登录账号。
# 收藏图标

找到自己想用的图标，然后收藏。
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2cceac5d4a0403bbffe24f52653ea22~tplv-k3u1fbpfcp-watermark.image?)

# 使用F12打开开发者控制台，在network中随便找一个接口，右键复制cookie。然后在vscode设置中搜索`iconfont.cookie`，把刚复制的cookie放进去。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29059920ee4f42608a5bb29e1b5987d6~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8783c51c261412fb40b3b5d3e1ce3fe~tplv-k3u1fbpfcp-watermark.image?)

# 安装依赖 
因为项目中使用了antd icons组件，所以需要先安装依赖才能使用。react项目安装`@ant-design/icons`依赖，vue项目安装`@ant-design/icons-vue`依赖。
# 设置alias
因为自动导入的时候，需要使用绝对路径，所以建议大家设置alias，把`@`指向`src`目录。插件也支持自定义目录，在设置中搜索iconfont.importPath，然后改成自己想要的。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5aeafbb5081340229c242ecc92b6211c~tplv-k3u1fbpfcp-watermark.image?)
# 修改存放icon的目录
默认是放在`src/assets/icons`目录下，这个可以自己去改。在vscode设置中搜索`iconfont.dirPath`，然后改成自己想要的。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e4e02cf3af24929b0f4b5b3fed23edc~tplv-k3u1fbpfcp-watermark.image?)
# 使用
在你需要使用icon的地方，右键(插入iconfont图标)或使用快捷键(cmd+shift+i)打开图标预览页面，然后选中一个，就行了。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/437460019c4e4baba27d5e5182ed8fab~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dacf3bab492d4a23964587ad7a755811~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f087476c997a44529b75c6d6bcd08504~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/727ae71256e34152a76a2099ab05b002~tplv-k3u1fbpfcp-watermark.image?)