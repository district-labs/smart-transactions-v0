import util from "util";

export function logPretty(obj: any) {
  console.log(util.inspect(obj, false, null, true /* enable colors */));
}
