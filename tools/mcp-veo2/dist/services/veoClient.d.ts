interface VideoConfig {
    aspectRatio?: '16:9' | '9:16';
    personGeneration?: 'dont_allow' | 'allow_adult';
    numberOfVideos?: 1 | 2;
    durationSeconds?: number;
    negativePrompt?: string;
}
interface VideoGenerationOptions {
    autoDownload?: boolean;
    includeFullData?: boolean;
}
interface StoredVideoMetadata {
    id: string;
    createdAt: string;
    prompt?: string;
    config: {
        aspectRatio: '16:9' | '9:16';
        personGeneration: 'dont_allow' | 'allow_adult';
        durationSeconds: number;
    };
    mimeType: string;
    size: number;
    filepath: string;
    videoUrl?: string;
}
/**
 * Client for interacting with Google's Veo2 video generation API
 */
export declare class VeoClient {
    private client;
    private model;
    private storageDir;
    /**
     * Creates a new VeoClient instance
     */
    constructor();
    /**
     * Ensures the storage directory exists
     */
    private ensureStorageDir;
    /**
     * Processes an image input which can be base64 data, a file path, or a URL
     *
     * @param image The image input (base64 data, file path, or URL)
     * @param mimeType The MIME type of the image (optional, detected for files and URLs)
     * @returns The image bytes and MIME type
     */
    private processImageInput;
    /**
     * Generates a video from a text prompt
     *
     * @param prompt The text prompt for video generation
     * @param config Optional configuration for video generation
     * @param options Optional generation options
     * @returns Metadata for the generated video and optionally the video data
     */
    generateFromText(prompt: string, config?: VideoConfig, options?: VideoGenerationOptions): Promise<StoredVideoMetadata & {
        videoData?: string;
        videoUrl?: string;
    }>;
    /**
     * Generates a video from an image
     *
     * @param image The image input (base64 data, file path, or URL)
     * @param prompt Optional text prompt for video generation
     * @param config Optional configuration for video generation
     * @param options Optional generation options
     * @param mimeType The MIME type of the image (optional, detected for files and URLs)
     * @returns Metadata for the generated video and optionally the video data
     */
    generateFromImage(image: string, prompt?: string, config?: VideoConfig, options?: VideoGenerationOptions, mimeType?: string): Promise<StoredVideoMetadata & {
        videoData?: string;
        videoUrl?: string;
    }>;
    /**
     * Saves a video buffer to disk
     *
     * @param videoBuffer The video buffer to save
     * @param prompt The prompt used for generation
     * @param config The configuration used for generation
     * @param id The ID to use for the video
     * @returns Metadata for the saved video
     */
    private saveVideoBuffer;
    /**
     * Saves video metadata to disk
     *
     * @param id The video ID
     * @param metadata The video metadata
     */
    private saveMetadata;
    /**
     * Gets a video by ID
     *
     * @param id The video ID
     * @param options Optional options for getting the video
     * @returns The video data and metadata
     */
    getVideo(id: string, options?: {
        includeFullData?: boolean;
    }): Promise<{
        data?: Buffer;
        metadata: StoredVideoMetadata;
        videoData?: string;
    }>;
    /**
     * Gets video metadata by ID
     *
     * @param id The video ID
     * @returns The video metadata
     */
    getMetadata(id: string): Promise<StoredVideoMetadata>;
    /**
     * Lists all generated videos
     *
     * @returns Array of video metadata
     */
    listVideos(): Promise<StoredVideoMetadata[]>;
}
export declare const veoClient: VeoClient;
export {};
