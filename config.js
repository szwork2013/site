/**
 * SiteManager
 * Copyright(c) 2012 xiatian <xtpython@sina.com>
 * MIT Licensed
 */

exports.config = {
  name: '云平台站点管理系统',
  description: '站点管理工具 By Node.js',
  host: '127.0.0.1',
  port: 8000,
  db: 'mongodb://127.0.0.1/sites',
  session: {key: 'sid', secret: 'cHenG!Du'},
  admin: {username: 'admin', password: '123'},
  wwwroot: '/web/wwwroot',
  logpath: '/var/log/nginx',
  nginx: {sbin: 'nginx', pid: '/var/log/nginx/nginx.pid', conf: '/etc/nginx/conf/vhosts'}
};
