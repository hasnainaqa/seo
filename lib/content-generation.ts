"use server";

import { generateResponse } from "@/lib/openai/client";
import { topicIdeasSchema, contentGenerationSchema } from "@/lib/openai/openai-schemas";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/db";

/**
 * Generate topic ideas based on keywords and description
 */
export async function generateTopicIdeas({
  keywords,
  description,
  count = 5,
}: {
  keywords: string[];
  description: string;
  count?: number;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized", topics: [] };
  }

  try {
    // Validate inputs
    if (!keywords.length) {
      return { error: "At least one keyword is required", topics: [] };
    }

    if (count < 1 || count > 10) {
      return { error: "Count must be between 1 and 10", topics: [] };
    }

    // Prepare the prompt with user description and keywords
    const prompt = `
      Generate SEO-optimized topic ideas for blog posts based on the following:
      
      USER DESCRIPTION:
      ${description}
      
      KEYWORDS: ${keywords.join(', ')}
      
      Generate ${count} topic ideas that would be valuable for the target audience and have good SEO potential.
      Each topic should have a catchy title, brief description, and relevant keywords.
      Focus on topics that align with the keywords but also expand on them in valuable ways.
    `;

    // Call OpenAI API with the topic ideas schema
    const response = await generateResponse({
      prompt,
      schema: topicIdeasSchema,
    });

    if (response.error) {
      console.error("Error generating topic ideas:", response.error);
      return { error: response.error, topics: [] };
    }

    // Access the structured data
    const topics = response.data?.topics || [];
    console.log("Generated Topics:", topics);

    // Save topics to database if they don't already exist
    if (topics.length > 0) {
      try {
        // Check if the topic model exists in the prisma schema
        if (!prisma.topic) {
          console.error("Topic model not found in Prisma schema");
          return { error: "Topic model not available", topics };
        }
        
        // Save each topic to the database
        const savedTopics = await Promise.all(
          topics.map(async (topic) => {
            const existingTopic = await prisma.topic.findFirst({
              where: {
                userId: user.id,
                title: topic.title,
              },
            });

            if (existingTopic) {
              return existingTopic;
            }

            return await prisma.topic.create({
              data: {
                userId: user.id,
                title: topic.title,
                description: topic.description,
                keywords: topic.keywords,
                searchIntent: topic.searchIntent,
              },
            });
          })
        );

        return { topics: savedTopics };
      } catch (error) {
        console.error("Error saving topics to database:", error);
        return { error: "Failed to save topics", topics };
      }
    }

    return { topics };
  } catch (error) {
    console.error("Error generating topics:", error);
    return { error: "Failed to generate topics", topics: [] };
  }
}

/**
 * Generate full blog post content based on a topic and keywords
 */
export async function generateContent({
  topicId,
  title,
  keywords,
  websiteId,
}: {
  topicId?: string;
  title: string;
  keywords: string[];
  websiteId?: string;
}) {
  console.log(`Generating content for topic: ${title}`);
  
  // Get the current user
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized", content: null };
  }

  // Get topic details if topicId is provided
  let topicDetails = null;
  if (topicId) {
    topicDetails = await prisma.topic.findUnique({
      where: {
        id: topicId,
        userId: user.id,
      },
    });

    if (!topicDetails) {
      return { error: "Topic not found", content: null };
    }
  }

  // Prepare the prompt with topic title and keywords
  const prompt = `
    Generate a comprehensive, well-structured blog post on the following topic:
    
    TITLE: ${title}
    
    KEYWORDS: ${keywords.join(', ')}
    
    ${topicDetails?.description ? `DESCRIPTION: ${topicDetails.description}` : ''}
    
    Please create a high-quality, SEO-optimized blog post in markdown format that:
    1. Has a compelling introduction that hooks the reader
    2. Contains well-structured sections with appropriate headings (H2, H3)
    3. Includes practical examples, tips, or actionable advice
    4. Naturally incorporates the keywords without keyword stuffing
    5. Has a conclusion that summarizes key points and includes a call to action
    6. Is between 1000-1500 words in length
    
    Format the content in markdown with proper headings, bullet points, and emphasis where appropriate.
  `;

  // Call OpenAI API with the content generation schema
  const response = await generateResponse({
    prompt,
    schema: contentGenerationSchema,
    temperature: 0.7, // Slightly higher temperature for more creative content
  });

  if (response.error) {
    console.error("Error generating content:", response.error);
    return { error: response.error, content: null };
  }

  // Access the structured data
  const content = response.data?.content || null;
  console.log("Generated Content Title:", content?.title);

  // Save content to database
  if (content) {
    try {
      // Check if the post model exists in the prisma schema
      if (!prisma.post) {
        console.error("Post model not found in Prisma schema");
        return { error: "Post model not available", content };
      }
      
      const post = await prisma.post.create({
        data: {
          userId: user.id,
          topicId: topicId,
          websiteId: websiteId,
          title: content.title,
          content: content.markdown,
          metaDescription: content.meta?.description,
          keywords: content.meta?.keywords || keywords,
          estimatedReadTime: content.meta?.estimatedReadTime,
          wordCount: content.meta?.wordCount,
        },
      });

      return { content, post };
    } catch (error) {
      console.error("Error saving content to database:", error);
      return { error: "Failed to save content", content };
    }
  }

  return { content };
}

/**
 * Get all saved topics for the current user
 */
export async function getSavedTopics() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized", topics: [] };
  }

  try {
    // Check if the topic model exists in the prisma schema
    if (!prisma.topic) {
      console.error("Topic model not found in Prisma schema");
      return { error: "Topic model not available", topics: [] };
    }

    const topics = await prisma.topic.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        website: {
          select: {
            id: true,
            siteUrl: true,
            name: true,
          },
        },
      },
    });

    return { topics };
  } catch (error) {
    console.error("Error fetching saved topics:", error);
    return { error: "Failed to fetch topics", topics: [] };
  }
}

/**
 * Get all saved posts for the current user
 */
export async function getSavedPosts() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized", posts: [] };
  }

  try {
    // Check if the post model exists in the prisma schema
    if (!prisma.post) {
      console.error("Post model not found in Prisma schema");
      return { error: "Post model not available", posts: [] };
    }
    
    const posts = await prisma.post.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        topic: true,
        website: {
          select: {
            id: true,
            siteUrl: true,
            name: true,
          },
        },
      },
    });

    return { posts };
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return { error: "Failed to fetch posts", posts: [] };
  }
}

/**
 * Delete a topic
 */
export async function deleteTopic(topicId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized", success: false };
  }

  try {
    // Check if the topic model exists in the prisma schema
    if (!prisma.topic) {
      console.error("Topic model not found in Prisma schema");
      return { error: "Topic model not available", success: false };
    }
    
    await prisma.topic.delete({
      where: {
        id: topicId,
        userId: user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting topic:", error);
    return { error: "Failed to delete topic", success: false };
  }
}

/**
 * Delete a post
 */
export async function deletePost(postId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized", success: false };
  }

  try {
    // Check if the post model exists in the prisma schema
    if (!prisma.post) {
      console.error("Post model not found in Prisma schema");
      return { error: "Post model not available", success: false };
    }
    
    await prisma.post.delete({
      where: {
        id: postId,
        userId: user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { error: "Failed to delete post", success: false };
  }
}
