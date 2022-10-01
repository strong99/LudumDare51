export type JSONValueTypes = number | boolean | string | null;
export type JSONArray = Array<JSONValueTypes>;
export type JSONObject = { [key: string]: JSONValueTypes };
export type JSONTypes = JSONValueTypes | JSONArray | JSONObject;

export interface JSONSaveable {
    serialize(): JSONTypes;
}