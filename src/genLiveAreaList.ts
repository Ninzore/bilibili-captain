import * as path from "path";
import * as fs from "fs-extra";
import { Request } from "./request";

async function autoGenAreaIdsType() {
    const idList = await Request
        .get("https://api.live.bilibili.com/room/v1/Area/getList")
        .then(res => res.data);
    const areaList = ["export enum AreaIds {"];
    idList.forEach((item: any) => {
        item.list.forEach((area: any) => {
            areaList.push(`    "${area.name}" = ${area.id},`);
        });
    });

    const areaIdTyps = areaList.join(" \n") + "\n}";
    fs.writeFile(path.join(__dirname, "types", "areaList.ts"), areaIdTyps);
}
autoGenAreaIdsType();
