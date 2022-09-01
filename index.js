import request from "./request.js";
import fs from "fs";

// 获取star列表
async function getStarList(data, options) {
  const res = await request.get(
    `https://api.github.com/users/wangrongding/starred`,
    {
      data,
      ...options,
    }
  );
  return res;
}

// 写入文件
async function writeFile(list) {
  list.forEach((item) => {
    const str = `| [${item.name}](${item.html_url}) | ${item.description} | stars:${item.stargazers_count}⭐️ | \n`;
    fs.appendFile("./README.md", str, (err) => {
      if (err) {
        console.log("出错");
      }
    });
  });
}

async function getStarPages() {
  const res = await getStarList({ per_page: 1 });
  for (let i in res) {
    console.log(i);
  }

  const total = res.headers.link
    .split('>; rel="last"')[0]
    .split("per_page=1&page=")[2];

  const pages = Math.ceil(total / 100);
  console.log("🚀🚀🚀 / pages", pages);
  console.log("🚀🚀🚀 / res", res.headers.link);

  let starList = [];
  for (let i = 0; i < pages; i++) {
    const tempRes = await getStarList({ per_page: 100, page: i + 1 });
    console.log(`page${i}✅`);
    starList = starList.concat(tempRes.data);
  }
  console.log("🚀🚀🚀 / starList", starList.length);
  await writeFile(starList);
}

// 复制文件内容到README
function copyToReadme() {
  fs.copyFileSync("./TEMPLATE.md", "./README.md");
}

copyToReadme();
getStarPages();
