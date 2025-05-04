import "server-only";
 
// You can use plain JSON Schema objects or libraries like Zod to define parameters
 
/**
 * Example Schema for generating multiple blog post ideas.
 * Used with OpenAI function calling.
 */
export const postsSchema = {
  name: "generatePosts", // Function name OpenAI will "call"
  description:
    "Generate at least 3 blog post ideas based on the provided topic.",
  parameters: {
    // JSON Schema definition
    type: "object",
    required: ["posts"],
    properties: {
      posts: {
        type: "array",
        description: "List of generated blog post ideas.",
        items: {
          type: "object",
          required: ["title", "summary"],
          properties: {
            title: {
              type: "string",
              description: "Catchy title for the blog post.",
            },
            summary: {
              type: "string",
              description: "A brief summary of the blog post content.",
            },
          },
        },
      },
    },
    additionalProperties: false, // Disallow extra properties
  },
};

/**
 * Schema for generating topic ideas based on user input and GSC queries.
 */
export const topicIdeasSchema = {
  name: "generateTopicIdeas",
  description: "Generate SEO-optimized topic ideas based on user input and search queries.",
  parameters: {
    type: "object",
    required: ["topics"],
    properties: {
      topics: {
        type: "array",
        description: "List of generated topic ideas with keywords.",
        items: {
          type: "object",
          required: ["title", "description", "keywords"],
          properties: {
            title: {
              type: "string",
              description: "Catchy, SEO-optimized title for the topic.",
            },
            description: {
              type: "string",
              description: "A brief description of what the topic covers and why it's valuable.",
            },
            keywords: {
              type: "array",
              description: "List of relevant keywords for this topic.",
              items: {
                type: "string",
              },
            },
            searchIntent: {
              type: "string",
              description: "The primary search intent this topic addresses (informational, transactional, navigational).",
            },
          },
        },
      },
    },
    additionalProperties: false,
  },
};

/**
 * Schema for generating full blog post content in markdown format.
 */
export const contentGenerationSchema = {
  name: "generateContent",
  description: "Generate a full blog post in markdown format based on the topic and keywords.",
  parameters: {
    type: "object",
    required: ["content"],
    properties: {
      content: {
        type: "object",
        required: ["title", "markdown", "meta"],
        properties: {
          title: {
            type: "string",
            description: "The final title for the blog post.",
          },
          markdown: {
            type: "string",
            description: "The full blog post content in markdown format.",
          },
          meta: {
            type: "object",
            description: "Metadata for the blog post.",
            properties: {
              description: {
                type: "string",
                description: "SEO meta description for the post.",
              },
              keywords: {
                type: "array",
                description: "Primary keywords used in the content.",
                items: {
                  type: "string",
                },
              },
              estimatedReadTime: {
                type: "number",
                description: "Estimated read time in minutes.",
              },
              wordCount: {
                type: "number",
                description: "Approximate word count of the content.",
              },
            },
          },
        },
      },
    },
    additionalProperties: false,
  },
};
