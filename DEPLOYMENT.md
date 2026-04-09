# Payload CMS 部署报告

## 📋 版本历史

| 版本 | 日期 | 状态 | 备注 |
|------|------|------|------|
| v1.0.0 | 2026-04-03 | 🔄 待部署 | Markdown 编辑器定版 |
| v0.1.0 | 2026-04-01 | ✅ 运行中 | 初始部署 |

---

## ✅ 当前生产环境

**部署时间：** 2026-04-01 10:56  
**服务器：** amd.cmkk.fun (Ubuntu 22.04, ARM64)  
**域名：** b.cmkk.fun  
**状态：** ✅ 运行中

---

## 🆕 v1.0.0 待部署

**定版日期：** 2026-04-03 14:54  
**修复内容：** Markdown 编辑器完整修复

### 主要变更
1. ✅ 修复 `autoSave` 字段配置错误
2. ✅ 使用 `useField` Hook 实现自定义编辑器
3. ✅ 支持 Markdown 输入和预览
4. ✅ 内容正确保存到数据库

### 测试状态
- ✅ 本地测试完全通过
- ⏳ 等待生产环境部署

### 部署步骤
详见：[DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)

---

---

## 📦 服务信息

| 项目 | 值 |
|------|-----|
| **容器名称** | clawd-diary-cms-payload-1 |
| **运行端口** | 3001 (内部 3000) |
| **网络模式** | host (直接访问 localhost) |
| **数据库** | MongoDB (1Panel 部署) |
| **数据库地址** | localhost:27017 |
| **数据库用户** | mongo_s3YApn |

---

## 🌐 访问地址

| 页面 | URL |
|------|-----|
| **首页** | http://amd.cmkk.fun:3001/ |
| **文章列表** | http://amd.cmkk.fun:3001/articles |
| **管理后台** | http://amd.cmkk.fun:3001/admin |
| **API** | http://amd.cmkk.fun:3001/api/articles |

---

## ⚠️ 待完成：配置 1Panel 反向代理

### 方案 A：通过 1Panel 面板配置（推荐）

1. 登录 1Panel 管理后台
2. 进入 **网站** → **创建网站** → **反向代理**
3. 填写以下信息：
   - **域名：** `b.cmkk.fun`
   - **代理地址：** `http://127.0.0.1:3001`
   - **SSL 证书：** 选择已有的 CF 证书
4. 点击创建

### 方案 B：手动配置 Nginx

在 1Panel 中创建网站配置文件：
```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name b.cmkk.fun;

    # SSL 证书配置（使用 1Panel 自动管理的证书）
    ssl_certificate /opt/1panel/ssl/certificate.pem;
    ssl_certificate_key /opt/1panel/ssl/private.key;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## 📝 环境变量

```bash
DATABASE_URL=mongodb://mongo_s3YApn:mongo_zRCnrT@localhost:27017/payload?authSource=admin
SERVER_URL=https://b.cmkk.fun
NEXT_PUBLIC_SERVER_URL=https://b.cmkk.fun
```

---

## 🔧 常用命令

```bash
# 查看容器状态
docker compose -f docker-compose.prod.yml ps

# 查看日志
docker compose -f docker-compose.prod.yml logs -f payload

# 重启服务
docker compose -f docker-compose.prod.yml restart

# 停止服务
docker compose -f docker-compose.prod.yml down

# 重新构建
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📂 项目位置

**服务器路径：** `/opt/clawd-diary-cms/`

**关键文件：**
- `docker-compose.prod.yml` - Docker Compose 配置
- `.env` - 环境变量
- `src/` - 源代码

---

## ✅ 下一步

1. **配置 1Panel 反向代理**（域名 b.cmkk.fun → localhost:3001）
2. **测试 HTTPS 访问**
3. **创建管理员账户**（访问 /admin）
4. **测试文章发布功能**
5. **配置 Cron 定时任务**（金融晚报自动发布）

---

*部署完成时间：2026-04-01 10:56 CST*
