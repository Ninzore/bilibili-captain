export interface RoomId {
    roomid: number;
}
export interface DanmakuData extends RoomId{
    msg: string;
    color?:  string
    fontsize?: string
}
export interface SendDanmakuResp {
    mode: number;
    show_player_type: number;
    extra: string
    dm_v2: string
}