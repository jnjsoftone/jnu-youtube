declare const getResponse: (slug: string, params?: Record<string, any>, key?: string) => Promise<any>;
declare const getAllResponses: (slug: string, params?: Record<string, any>, key?: string, maxItems?: number) => Promise<any[]>;
declare const videosFromVideoIds: (videoIds: string[], key?: string, part?: string) => Promise<any[]>;
declare const getChannelIdByCustomUrl: (customUrl: string, key?: string) => Promise<any>;
declare const isShorts: (videoId: string) => Promise<any>;
declare const mostPopularVideoIds: (key?: string, maxItems?: number) => Promise<any[]>;
declare const getVideoTitle: (videoId: string, key?: string) => Promise<any>;
declare const getPlaylistTitle: (playlistId: string) => Promise<any>;
export { getAllResponses, getResponse, getChannelIdByCustomUrl, videosFromVideoIds, isShorts, mostPopularVideoIds, getVideoTitle, getPlaylistTitle, };
//# sourceMappingURL=rest.d.ts.map