# token-hub 原生部署（无 Docker）

本文以 Ubuntu/Debian、PostgreSQL、Redis、systemd 和 Nginx 为例。应用配置全部写入 YAML 文件；环境变量和 `.env` 仅作为缺少对应 YAML 值时的补充。

## 1. DNS 与证书

在 DNS 服务商处添加两条指向服务器公网 IP 的记录：

```text
A    token-hub.io      SERVER_IP
A    *.token-hub.io    SERVER_IP
```

二级代理使用动态子域名，因此 TLS 证书必须同时覆盖 `token-hub.io` 和 `*.token-hub.io`。通配符证书需要 DNS-01 验证；使用 Certbot 对应的 DNS 插件或其他 ACME 客户端签发，并将证书安装到：

```text
/etc/letsencrypt/live/token-hub.io/fullchain.pem
/etc/letsencrypt/live/token-hub.io/privkey.pem
```

## 2. 安装系统服务

```bash
sudo apt update
sudo apt install -y git nginx postgresql redis-server ca-certificates curl
sudo systemctl enable --now postgresql redis-server nginx
```

安装 Go 1.25.1 或与 `go.mod` 相容的更高版本，并安装 Bun。确认：

```bash
go version
bun --version
```

## 3. 创建数据库

交互式创建数据库用户并设置强密码：

```bash
sudo -u postgres createuser --pwprompt token_hub
sudo -u postgres createdb --owner=token_hub token_hub
```

## 4. 构建应用

```bash
git clone YOUR_REPOSITORY_URL /tmp/token-hub-src
cd /tmp/token-hub-src/web
bun install
bun run build
cd ..
go build -trimpath -o token-hub .
```

创建专用用户和目录，再安装二进制：

```bash
sudo useradd --system --home /var/lib/token-hub --shell /usr/sbin/nologin token-hub
sudo install -d -o token-hub -g token-hub -m 750 /var/lib/token-hub/data /var/lib/token-hub/logs
sudo install -d -o root -g token-hub -m 750 /etc/token-hub
sudo install -d -o root -g root -m 755 /opt/token-hub
sudo install -o root -g root -m 755 token-hub /opt/token-hub/token-hub
```

## 5. 配置 YAML

```bash
sudo install -o token-hub -g token-hub -m 600 config.example.yaml /etc/token-hub/config.yaml
sudo editor /etc/token-hub/config.yaml
```

至少修改：

- `database.dsn` 中的数据库密码；密码包含保留字符时需要 URL 编码。
- `security.session_secret` 和 `security.crypto_secret`，两者应分别使用 `openssl rand -hex 32` 生成。
- `security.session_trusted_origins` 中实际允许调用登录刷新接口的 HTTPS Origin。
- `security.trusted_proxies`；Nginx 与应用在同一台机器时保留回环地址即可。

结构化字段优先于同文件的 `parameters`，YAML 又优先于环境变量和 `.env`。未在结构化区域提供的旧启动参数，都可以放在 `parameters` 中，不需要环境变量。`options` 可覆盖数据库管理的应用选项，但不会回写数据库。

## 6. 安装 systemd 服务

```bash
sudo install -o root -g root -m 644 deploy/systemd/token-hub.service /etc/systemd/system/token-hub.service
sudo systemctl daemon-reload
sudo systemctl enable --now token-hub
sudo systemctl status token-hub
sudo journalctl -u token-hub -n 100 --no-pager
```

修改 `/etc/token-hub/config.yaml` 后重启应用使配置生效：

```bash
sudo systemctl restart token-hub
```

## 7. 安装 Nginx 配置

确认证书已经签发后执行：

```bash
sudo install -o root -g root -m 644 deploy/nginx/token-hub-native.conf /etc/nginx/sites-available/token-hub.conf
sudo ln -s /etc/nginx/sites-available/token-hub.conf /etc/nginx/sites-enabled/token-hub.conf
sudo nginx -t
sudo systemctl reload nginx
```

如站点已存在同名链接，不要重复运行 `ln -s`。随后验证：

```bash
curl -I https://token-hub.io
curl -I https://ab.token-hub.io
```

## 8. 更新版本

```bash
cd /tmp/token-hub-src
git pull --ff-only
cd web
bun install
bun run build
cd ..
go test ./...
go build -trimpath -o token-hub .
sudo systemctl stop token-hub
sudo install -o root -g root -m 755 token-hub /opt/token-hub/token-hub
sudo systemctl start token-hub
sudo systemctl status token-hub
```

部署过程不需要 Docker，也不需要 systemd `EnvironmentFile`。
