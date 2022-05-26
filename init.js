const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const mysql = require("mysql");
const { nanoid } = require("nanoid");
const net = require("net");

// 创建数据库
const initMysql = async () => {
  console.info("【开始创建数据库】......");
  return new Promise((resolve) => {
    const connection = mysql.createConnection({
      host: config.mysql.host,
      port: config.mysql.port,
      user: config.mysql.username,
      password: config.mysql.password,
    });

    connection.connect();
    connection.query(
      `CREATE DATABASE ${config.mysql.database} DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`,
      (error) => {
        if (error) {
          if (error.errno === 1007) {
            console.error(
              `【创建数据库】- 失败 数据库名'${config.mysql.database}'已存在,可以尝试修改后重试`
            );
          } else {
            console.error("【创建数据库】- 失败 ", error.message);
          }
          resolve(false);
        } else {
          resolve(true);
          console.info("【创建数据库】- 成功");
        }
      }
    );
    connection.end();
  });
};

// 初始化配置
const initConfig = () => {
  console.info("【开始初始化配置文件】......");
  const read = fs.readFileSync(
    path.join(__dirname, "server", "src", "config", "config.prod.ts.bak"),
    {
      encoding: "utf8",
    }
  );
  const wirteStr = read
    .replace("{mysql_host}", config.mysql.host)
    .replace("{mysql_port}", config.mysql.port)
    .replace("{mysql_username}", config.mysql.username)
    .replace("{mysql_password}", config.mysql.password)
    .replace("{mysql_database}", config.mysql.database)
    .replace("{mysql_synchronize}", config.mysql.synchronize)
    .replace("{jwt_key}", nanoid(16))
    .replace("{redis_port}", config.redis.client.port)
    .replace("{redis_host}", config.redis.client.host)
    .replace("{redis_password}", config.redis.client.password)
    .replace("{server_port}", config.serverPort);

  fs.writeFileSync(
    path.join(__dirname, "server", "src", "config", "config.prod.ts"),
    wirteStr
  );
  console.info("【初始化配置文件】结束");
};

// 初始化后台配置
const initAdminConfig = () => {
  console.info("【后台配置文件】......");
  const read = fs.readFileSync(
    path.join(__dirname, "admin", "nuxt.config.js.bak"),
    {
      encoding: "utf8",
    }
  );
  const wirteStr = read
    .replace("{server_port}", config.serverPort)
    .replace("{domain}", config.domain)
    .replace("{opName}", config.opName);
  fs.writeFileSync(path.join(__dirname, "admin", "nuxt.config.js"), wirteStr);
  console.info("【后台配置文件】完成！");
};

// 初始化小程序配置
const initMiniappConfig = () => {
  console.info("【小程序配置文件】......");
  const read = fs.readFileSync(
    path.join(__dirname, "miniapp", "pages.json.bak"),
    {
      encoding: "utf8",
    }
  );
  const wirteStr = read.replace("{name}", config.name);

  fs.writeFileSync(path.join(__dirname, "miniapp", "pages.json"), wirteStr);

  const read2 = fs.readFileSync(
    path.join(__dirname, "miniapp", "util", "constant.js.bak"),
    {
      encoding: "utf8",
    }
  );
  const wirteStr2 = read2
    .replace("{domain}", config.domain)
    .replace("{perfix}", config.perfix);

  fs.writeFileSync(
    path.join(__dirname, "miniapp", "util", "constant.js"),
    wirteStr2
  );
  console.info("【小程序配置文件】完成！");
};

// 初始化nginx配置
const initNginx = () => {
  console.info("【nginx配置文件】......");
  const read = fs.readFileSync(path.join(__dirname, "nginx.conf.bak"), {
    encoding: "utf8",
  });
  let wirteStr = read
    .replace(/{port}/g, config.serverPort)
    .replace(/{server_name}/g, config.domain)
    .replace(/{root_path}/g, path.join(__dirname, "admin", "dist"));

  const dir = fs.readdirSync(path.join(__dirname, "ssl"), { encoding: "utf8" });
  for (const item of dir) {
    const split = item.split(".");
    if (split[split.length - 1] === "key") {
      wirteStr = wirteStr.replace(
        "{ssl_certificate_key}",
        path.join(__dirname, "ssl", item)
      );
    }

    if (split[split.length - 1] === "crt") {
      wirteStr = wirteStr.replace(
        "{ssl_certificate}",
        path.join(__dirname, "ssl", item)
      );
    }
  }

  fs.writeFileSync(path.join(__dirname, "nginx.conf"), wirteStr);

  console.info(
    "【nginx配置文件】已生成,请手动将配置引入到nginx,并重启nginx即可访问您的网站",
    dir.length > 1 ? "" : "，由于ssl证书未配置，所以暂不可使用此配置"
  );
};

const init = async () => {
  initConfig();
  await initMysql();
  initAdminConfig();
  initNginx();
  initMiniappConfig();
};
init();
