# BasicService Frontend
basic service服务的前端实现。作为主页提供用户、App列表、管理员服务。

## update log
### v0.1.1
* 添加token刷新机制。
* router更改至history模式。
* 将element-ui更改至部分引入，优化编译。

## build & run
在开始编译之前，编辑`src/config.ts`配置文件，指定合适的配置。
```typescript
{
    'SERVER_URL': 'http://basic-service:8000',  //后端服务器地址
    'STORAGE_PREFIX': 'basic-service',          //local storage的前缀
    'CASE_NUMBER': '京ICP备12345678号',          //备案号
    'CASE_URL': 'http://www.beian.miit.gov.cn'  //备案号的链接地址
}
```
```bash
npm run build
```