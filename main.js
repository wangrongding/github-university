import request from "./request.js";
import fs from "fs";

let TOKEN = "";

// 获取star列表
export async function getStarList(data, options) {
  const res = await request.get(
    `https://api.github.com/users/wangrongding/starred`,
    {
      data,
      ...options,
      headers: {
        Authorization: `token ${TOKEN}`,
      },
    }
  );
  return res;
}

// 写入文件
export async function writeFile(list) {
  let content = ``;
  list.forEach((item) => {
    content += `| [${item.name}](${item.html_url}) | stars:${item.stargazers_count}⭐️ | ${item.description} | \n`;
  });
  // 追加内容
  fs.appendFile("./README.md", content, (err) => {
    if (err) {
      console.log("出错");
    }
  });
}

export async function getStarPages() {
  const res = await getStarList({ per_page: 1 });
  // 获取star总数
  const total = res.headers.link
    .split('>; rel="last"')[0]
    .split("per_page=1&page=")[2];
  // star总页数
  const pages = Math.ceil(total / 100);

  let starList = [];
  for (let i = 0; i < pages; i++) {
    const tempRes = await getStarList({ per_page: 100, page: i + 1 });
    console.log(`🚀🚀page${i}✅`);
    starList = starList.concat(tempRes.data);
  }
  // 总star数
  console.log("🚀🚀🚀 / starList", starList.length);
  return starList;
}

// 复制文件内容到README
export function copyToReadme() {
  fs.copyFileSync("./TEMPLATE.md", "./README.md");
}

// 开始执行
export async function start(token) {
  TOKEN = token;
  copyToReadme();
  const starList = await getStarPages();
  await writeFile(starList);
}
