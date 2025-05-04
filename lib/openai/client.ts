import "server-only";

import OpenAI from "openai";
import { appConfig } from "../app-config"; // Assuming appConfig exists for model name
import { auth } from "@/lib/auth"; // Assuming auth setup exists

export interface OpenAIResponse {
  data?: any; // For parsed JSON data
  error?: string;
  text?: string; // For plain text response
  tokens?: number; // Tokens used
}

export interface OpenAIRequestOptions {
  prompt: string;
  schema?: any; // Optional schema for JSON output (function calling)
  parser?: "json" | "text"; // Deprecated: Parser is now inferred from schema presence
  temperature?: number;
}

class OpenAIClient {
  private openai: OpenAI;
  public model: string;

  constructor() {
    if (!process.env.OPENAI_API_KEY || !appConfig.openai.model) {
      console.group(" OpenAI Configuration Missing");
      console.error(
        "OPENAI_API_KEY in .env and appConfig.openai.model are required."
      );
      console.error(
        "If you don't need OpenAI, remove the code from the /lib/openai folder."
      );
      console.groupEnd();
      // Consider throwing an error or handling this more gracefully depending on requirements
      throw new Error("OpenAI configuration missing.");
    }
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.model = appConfig.openai.model; // e.g., "gpt-4-turbo"
  }

  /**
   * Generate a response from OpenAI, handling JSON or text parsing.
   * @param options Request options including prompt, schema, temperature.
   * @returns A response object with data, text, tokens,  or error.
   */
  async generateResponse(
    options: OpenAIRequestOptions
  ): Promise<OpenAIResponse> {
    try {
      const { prompt, schema, temperature = 0.7 } = options;

      // Build the request payload
      const requestPayload: OpenAI.Chat.ChatCompletionCreateParams = {
        model: this.model,
        temperature,
        messages: [{ role: "user", content: prompt }],
      };

      // Use function calling if schema is provided for structured JSON output
      if (schema) {
        requestPayload.tools = [
          {
            type: "function",
            function: {
              name: schema.name, // e.g., "generatePosts"
              description: schema.description,
              parameters: schema.parameters, // Zod or JSON schema object
            },
          },
        ];
        // Optionally force the model to use the function
        // requestPayload.tool_choice = { type: "function", function: { name: schema.name } };
      }

      // Make the API call
      const response =
        await this.openai.chat.completions.create(requestPayload);

      // Track token usage
      const tokensUsed = response?.usage?.total_tokens || 0;
      console.log(`Tokens used: ${tokensUsed}`);
      // Parse the response (JSON via tool_calls or Text via content)
      let result: OpenAIResponse;
      const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];

      if (toolCall && toolCall.function?.arguments) {
        // We requested a function call (schema provided) and got one
        result = this.parseFunctionCallResponse(toolCall.function.arguments);
      } else {
        // No function call requested or received, parse as text
        result = this.parseTextResponse(response);
      }

      // Add token information
      result.tokens = tokensUsed;
      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("OpenAI API Error:", errorMessage);
      return { error: errorMessage };
    }
  }

  /**
   * Parse a function call response (JSON data)
   * @param argumentsString The function arguments as a string
   * @returns Parsed response with data
   */
  private parseFunctionCallResponse(argumentsString: string): OpenAIResponse {
    try {
      const data = JSON.parse(argumentsString);
      return { data };
    } catch (error) {
      console.error("Error parsing function call response:", error);
      return {
        error: "Failed to parse JSON response from OpenAI function call",
      };
    }
  }

  /**
   * Parse a text response
   * @param response The OpenAI API response
   * @returns Parsed response with text
   */
  private parseTextResponse(
    response: OpenAI.Chat.ChatCompletion
  ): OpenAIResponse {
    const text = response.choices?.[0]?.message?.content || "";
    return { text };
  }
}

// Create a singleton instance to reuse the client
const openaiClient = new OpenAIClient();

/**
 * Generate a response using the OpenAI client.
 * @param options Request options including prompt, schema, etc.
 * @returns A response object with data, text, or error.
 */
export async function generateResponse(
  options: OpenAIRequestOptions
): Promise<OpenAIResponse> {
  return openaiClient.generateResponse(options);
}

/**
 * Get the OpenAI client instance (useful for specific configurations if needed).
 * @returns The OpenAI client instance.
 */
export function getClient(): OpenAIClient {
  return openaiClient;
}
