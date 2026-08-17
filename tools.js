import { tavily } from "@tavily/core";
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function tavilyWebSearch(params) {
  const response = await tvly.search(params.query);
  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");
  return finalResult;
}

function calculator(expression) {
  return eval(expression);
}

export { tavilyWebSearch, calculator };
