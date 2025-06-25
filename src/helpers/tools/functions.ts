import axios from "axios";

const ToolFunction = {
  async getWeather(args: { location: string; unit: string }) {
    if (!args.location) {
      return "Please provide a location.";
    }
    const { location, unit = "celsius" } = args;
    if (location.toLowerCase().includes("tokyo")) {
      return JSON.stringify({
        location: "Tokyo",
        temperature: "10",
        unit: unit,
      });
    } else if (location.toLowerCase().includes("san francisco")) {
      return JSON.stringify({
        location: "San Francisco",
        temperature: "32",
        unit: unit,
      });
    } else if (location.toLowerCase().includes("paris")) {
      return JSON.stringify({
        location: "Paris",
        temperature: "22",
        unit: unit,
      });
    } else {
      return "I could not find what you are looking for.";
    }
  },
  async getPerson(args: { userId: number }) {
    if (!args.userId) {
      return "Please provide a user id.";
    }
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${args.userId}`
      );
      if (!response) return `User with id ${args.userId} does not exist`;
      return JSON.stringify(response.data);
    } catch (error) {
      return "I could not find what you are looking for.";
    }
  },
  getTime(args: {}) {
    try {
      const timeNow = {
        currentTime: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      return JSON.stringify(timeNow);
    } catch (error) {
      return "I could not find what you are looking for.";
    }
  },
  getStockPrice(args: { symbol: string }) {
    try {
      const response = {
        symbol: args.symbol,
        price: (Math.random() * 500).toFixed(2),
        currency: "USD",
        lastUpdated: new Date().toISOString(),
      };
      return JSON.stringify(response);
    } catch (error) {
      return "I could not find what you are looking for.";
    }
  },
};

export default ToolFunction;
