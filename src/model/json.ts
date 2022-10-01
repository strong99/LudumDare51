export type JSONValueTypes = number | boolean | string | null;
export type JSONArray = Array<JSONValueTypes|JSONObject|JSONArray>;
export type JSONObject = { [key: string]: JSONTypes };
export type JSONTypes = JSONValueTypes | JSONArray | JSONObject;
