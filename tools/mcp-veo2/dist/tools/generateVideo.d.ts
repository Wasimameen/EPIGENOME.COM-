import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
/**
 * Tool for generating a video from a text prompt
 *
 * @param args The tool arguments
 * @returns The tool result
 */
export declare function generateVideoFromText(args: {
    prompt: string;
    aspectRatio?: '16:9' | '9:16';
    personGeneration?: 'dont_allow' | 'allow_adult';
    numberOfVideos?: 1 | 2;
    durationSeconds?: number;
    enhancePrompt?: boolean | string;
    negativePrompt?: string;
    includeFullData?: boolean | string;
    autoDownload?: boolean | string;
}): Promise<CallToolResult>;
/**
 * Tool for generating a video from an image
 *
 * @param args The tool arguments
 * @returns The tool result
 */
export declare function generateVideoFromImage(args: {
    image: string | {
        type: 'image';
        mimeType: string;
        data: string;
    };
    prompt?: string;
    aspectRatio?: '16:9' | '9:16';
    numberOfVideos?: 1 | 2;
    durationSeconds?: number;
    enhancePrompt?: boolean | string;
    negativePrompt?: string;
    includeFullData?: boolean | string;
    autoDownload?: boolean | string;
}): Promise<CallToolResult>;
/**
 * Tool for generating an image from a text prompt
 *
 * @param args The tool arguments
 * @returns The tool result with generated image
 */
export declare function generateImage(args: {
    prompt: string;
    numberOfImages?: number;
    includeFullData?: boolean | string;
}): Promise<CallToolResult>;
/**
 * Tool for generating a video from a generated image
 *
 * @param args The tool arguments
 * @returns The tool result
 */
export declare function generateVideoFromGeneratedImage(args: {
    prompt: string;
    videoPrompt?: string;
    numberOfImages?: number;
    aspectRatio?: '16:9' | '9:16';
    personGeneration?: 'dont_allow' | 'allow_adult';
    numberOfVideos?: 1 | 2;
    durationSeconds?: number;
    enhancePrompt?: boolean | string;
    negativePrompt?: string;
    includeFullData?: boolean | string;
    autoDownload?: boolean | string;
}): Promise<CallToolResult>;
/**
 * Tool for getting an image by ID
 *
 * @param args The tool arguments
 * @returns The tool result
 */
export declare function getImage(args: {
    id: string;
    includeFullData?: boolean | string;
}): Promise<CallToolResult>;
/**
 * Tool for listing all generated images
 *
 * @returns The tool result
 */
export declare function listGeneratedImages(): Promise<CallToolResult>;
/**
 * Tool for listing all generated videos
 *
 * @returns The tool result
 */
export declare function listGeneratedVideos(): Promise<CallToolResult>;
