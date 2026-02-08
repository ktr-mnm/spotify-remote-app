export type LogItem = {
  id: number;
  message: string;
  type: "info" | "success" | "error";
  time: string;
};
