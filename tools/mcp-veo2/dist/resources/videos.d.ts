import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
/**
 * Resource template for accessing generated videos
 */
export declare const videoResourceTemplate: ResourceTemplate;
/**
 * Resource handler for accessing a specific video
 *
 * @param uri The resource URI
 * @param variables The URI template variables
 * @param query Optional query parameters
 * @returns The video resource contents
 */
export declare function readVideoResource(uri: URL, variables: Record<string, string | string[]>, query?: URLSearchParams): Promise<ReadResourceResult>;
/**
 * Resource for accessing example video prompts
 */
export declare const videoPromptsResource: {
    uri: string;
    name: string;
    description: string;
    read(): Promise<ReadResourceResult>;
};
