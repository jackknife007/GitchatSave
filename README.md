# GitchatSave

保存Gitchat专栏到本地

使用selenium配合插件singleFile，保存成`html`到本地。将每一篇专栏的所有内容归置到用以文件夹下。

并修改了保存下来的`html`文件中的上一章、下一章的跳转链接，可以直接本地查看。

#### 1. 安装selenium

```
pip install selenium
```

#### 2. 下载webdriver

推荐使用Edge，占用资源小，安装插件方便。 [下载地址](https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/)

- 下载对应的`webdriver`
- 下载后复制到`python`安装目录下的`scripts`文件夹下。
- 将程序名修改为`MicrosoftWebDriver.exe`

#### 3. 运行程序

运行`app.py`

#### 4. 将`js`文件夹复制到专栏文件夹的同级目录
