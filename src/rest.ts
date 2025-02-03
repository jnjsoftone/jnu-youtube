// [API Reference](https://developers.google.com/youtube/v3/docs?hl=ko)
import axios from 'axios';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// * REST API용 함수
// YouTube API 응답을 가져오는 함수
const getResponse = async (slug: string, params: Record<string, any> = {}, key: string = '') => {
  try {
    const response = await axios.get(`${YOUTUBE_API_URL}/${slug}`, {
      params: {
        ...params,
        key,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`YouTube API 오류 (${slug}):`, error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    throw new Error(`YouTube API 요청 중 오류가 발생했습니다: ${errorMessage}`);
  }
};

// 모든 응답을 가져오는 함수
interface YouTubeApiResponse {
  items: any[];
  nextPageToken?: string;
}

const getAllResponses = async (
  slug: string,
  params: Record<string, any> = {},
  key: string = '',
  maxItems = Infinity
) => {
  let results: any[] = [];
  let nextPageToken: string | undefined = undefined;

  do {
    const data: YouTubeApiResponse = await getResponse(
      slug,
      {
        ...params,
        pageToken: nextPageToken,
        maxResults: Math.min(50, maxItems - results.length),
      },
      key
    );

    results = results.concat(data.items);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken && results.length < maxItems);

  // Trim excess items if we've exceeded maxItems
  if (results.length > maxItems) {
    results = results.slice(0, maxItems);
  }

  return results;
};

// * Utils
// https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails,id,liveStreamingDetails,localizations,player, recordingDetails,snippet,statistics,status,topicDetails&id=qQPxP9TZEO8,D4nZW4wk3gQ&key=AIzaSyBHsLKBGbPRGi11o2m7i7e_TZU3efYsWag
const videosFromVideoIds = async (
  videoIds: string[],
  key: string = '',
  part = 'contentDetails,id,liveStreamingDetails,localizations,player,recordingDetails,snippet,statistics,status,topicDetails'
) => {
  const videos: any[] = [];
  for (const id of videoIds) {
    const query = { part, id };
    const video = await getAllResponses('videos', query, key);
    videos.push(video[0]);
  }
  return videos;
};

// YouTube API 응답을 가져오는 함수
const getChannelIdByCustomUrl = async (customUrl: string, key: string = '') => {
  try {
    if (!customUrl) {
      return '';
    }
    customUrl = customUrl.startsWith('@') ? customUrl.slice(1) : customUrl;
    const searchResponse = await getResponse('search', {
      part: 'id',
      type: 'channel',
      q: customUrl,
      maxResults: 1,
    });

    if (searchResponse.items && searchResponse.items.length > 0) {
      return searchResponse.items[0].id.channelId;
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
};

// // ! 쇼츠 여부 판단이 불완전함(추후 수정 필요, 60S 이하여도 쇼츠가 아닐 수 있음)
// const isShorts = (video) => {
//   const duration = video.contentDetails.duration;
//   return duration.includes('PT') && !duration.includes('M');
// };

const isShorts = async (videoId: string) => {
  const url = `https://www.youtube.com/shorts/${videoId}`;
  try {
    const response = await axios.get(url, {
      maxRedirects: 5,
      validateStatus: function (status) {
        return status >= 200 && status < 300; // 리디렉션 상태 코드도 허용
      },
    });
    // 최종 URL이 '/shorts/'를 포함하는지 확인
    return response.request.res.responseUrl.includes('/shorts/');
  } catch (error: any) {
    console.error('Error:', error.message);
    return false;
  }
};

// ** videoId 배열 가져오기

// * 인기 동영상
const mostPopularVideoIds = async (key: string = '', maxItems = 50) => {
  const videos = await getAllResponses(
    'videos',
    {
      part: 'id',
      chart: 'mostPopular',
    },
    key,
    maxItems
  );
  return videos.map((video) => video.id);
};

const getVideoTitle = async (videoId: string, key: string = '') => {
  const video = await getResponse('videos', { part: 'snippet', id: videoId }, key);
  return video.items[0].snippet.title;
};

const getPlaylistTitle = async (playlistId: string) => {
  const playlist = await getResponse('playlists', {
    part: 'snippet',
    id: playlistId,
  });
  return playlist.items[0].snippet.title;
};

export {
  getAllResponses,
  getResponse,
  getChannelIdByCustomUrl,
  videosFromVideoIds,
  isShorts,
  mostPopularVideoIds,
  getVideoTitle,
  getPlaylistTitle,
};
