import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';
/**
 * Resource template for accessing generated images
 */
export declare const imageResourceTemplate: ResourceTemplate;
/**
 * Resource handler for accessing a specific image
 *
 * @param uri The resource URI
 * @param variables The URI template variables
 * @returns The image resource contents
 */
export declare function readImageResource(uri: URL, variables: Record<string, string | string[]>): Promise<ReadResourceResult>;
/**
 * Resource for accessing example image prompts
 */
export declare const imagePromptsResource: {
    uri: string;
    name: string;
    description: string;
    read(): Promise<ReadResourceResult>;
};
