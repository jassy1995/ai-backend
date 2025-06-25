import toolSchemas from "./schema";
import ToolFunction from "./functions";

export const toolsSchema = toolSchemas;

export const functionHandlers = async (name: string, args: any) => {
  if (name === "get_current_weather") {
    return ToolFunction.getWeather(args);
  }
  if (name === "get_person") {
    return ToolFunction.getPerson(args);
  }
  if (name === "get_time") {
    return ToolFunction.getTime(args);
  }
  if (name === "get_stock_price") {
    return ToolFunction.getStockPrice(args);
  }
};
