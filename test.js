import { getStarList } from "./main.js";
import parse from "parse-link-header";

async function test() {
  const res = await getStarList({ per_page: 100 });
}
test();
// test action