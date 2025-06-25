const toolSchema = [
  {
    type: "function",
    function: {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: {
            type: ["string", "null"],
            enum: ["celsius", "fahrenheit"],
          },
        },
        required: ["location"],
        // additionalProperties: false,
      },
      // strict: false,
    },
  },
  {
    type: "function",
    function: {
      name: "get_time",
      description: "Get the current server time",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        // additionalProperties: false,
      },
      // strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "get_person",
      description: "Get personal information about a person",
      parameters: {
        type: "object",
        properties: {
          userId: {
            type: "number",
            description: "The id of the user",
          },
        },
        required: [],
        // additionalProperties: false,
      },
      // strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "get_stock_price",
      description: "Get the current price of a stock",
      parameters: {
        type: "object",
        properties: {
          symbol: {
            type: "string",
            description: "The stock symbol, e.g. AAPL for Apple",
          },
        },
        required: [],
        // additionalProperties: false,
      },
      // strict: true,
    },
  },
];

export default toolSchema;
