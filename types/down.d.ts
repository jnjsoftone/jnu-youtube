declare const downloadYoutubeSubtitles: (videoId: string, { languages, formatType, outputDir }?: {
    languages?: string | undefined;
    formatType?: string | undefined;
    outputDir?: string | undefined;
}) => Promise<string[]>;
declare const downloadYoutubeVideo: (videoId: string, { resolution, bitrate, outputDir }?: {
    resolution?: string | undefined;
    bitrate?: string | undefined;
    outputDir?: string | undefined;
}) => Promise<string>;
interface DownloadItem {
    subtitles?: string;
    video?: string;
}
declare const downloadYoutubeAll: (videoIds: string, { resolution, bitrate, languages, formatType, outputDir, downType, key, }: {
    resolution?: string | undefined;
    bitrate?: string | undefined;
    languages?: string | undefined;
    formatType?: string | undefined;
    outputDir?: string | undefined;
    downType?: string | undefined;
    key?: string | undefined;
}) => Promise<never[] | {
    resolution: string;
    bitrate: string;
    languages: string;
    formatType: string;
    outputDir: string;
    downs: DownloadItem[];
}>;
declare const downloadYoutubePlaylist: (playlistId: string, { resolution, bitrate, languages, formatType, outputDir, downType, key, maxItems, }?: {
    resolution?: string | undefined;
    bitrate?: string | undefined;
    languages?: string | undefined;
    formatType?: string | undefined;
    outputDir?: string | undefined;
    downType?: string | undefined;
    key?: string | undefined;
    maxItems?: number | undefined;
}) => Promise<never[] | {
    resolution: string;
    bitrate: string;
    languages: string;
    formatType: string;
    outputDir: string;
    downs: DownloadItem[];
}>;
export { downloadYoutubeSubtitles, downloadYoutubeVideo, downloadYoutubeAll, downloadYoutubePlaylist };
//# sourceMappingURL=down.d.ts.map