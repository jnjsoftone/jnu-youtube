import { By } from 'selenium-webdriver';
import { Chrome } from 'jnu-web';

const MAX_SCROLLS = 10;
// const YOUTUBE_DEFAULT_USER_ID = 'bigwhitekmc';
// const YOUTUBE_DEFAULT_USER_EMAIL = 'bigwhitekmc@gmail.com';

const extractVideoId = (url: string) => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?(?:live\/)?(?:@[\w.-]+\/)?(?:video\/)?(?:playlist\?list=)?([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// * 페이지 이동
const goToUrl = async (url: string, { email = '', userDataDir = '', headless = true }) => {
  // * 초기화
  const chrome = new Chrome({
    headless: headless ? true : false, // Chrome 최신 버전 헤드리스 모드 사용
    email,
    userDataDir,
    arguments: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1920,1080'],
  });

  try {
    await chrome.goto(url);
    await chrome.getFullSize(); // auto scroll
    return chrome;
  } catch (error) {
    console.error('Chrome 초기화 중 오류 발생:', error);
    await chrome.close();
    throw error;
  }
};

// * 요소 추출
const _getElements = async (url = '', css = '', { email = '', userDataDir = '', headless = false }) => {
  let chrome;
  try {
    chrome = await goToUrl(url, { email, userDataDir, headless });
    const driver = chrome.driver;
    const elements = await driver.findElements(By.css(css));
    return { chrome, elements };
  } catch (error) {
    if (chrome) {
      await chrome.close();
    }
    throw error;
  }
};

// * 나중에 볼 동영상 추출
const watchLaterVideoIds = async (userId = '') => {
  const email = `${userId}@gmail.com`;
  const { chrome, elements } = await _getElements(
    'https://www.youtube.com/playlist?list=WL',
    'ytd-playlist-video-renderer',
    { email }
  );

  console.log(elements, elements.length);

  const videos: { videoUrl: string }[] = [];
  for (const element of elements) {
    const titleElement = await element.findElement(By.css('#video-title'));
    const videoUrl = await titleElement.getAttribute('href');
    if (videoUrl) {
      videos.push({ videoUrl });
    }
  }

  chrome.close();

  return videos.map((video) => extractVideoId(video.videoUrl));
};

const historyVideoIds = async (userId = '') => {
  const email = `${userId}@gmail.com`;
  const { chrome, elements } = await _getElements('https://www.youtube.com/feed/history', 'ytd-video-renderer', {
    email,
  });

  console.log(elements, elements.length);
  const videos: { videoUrl: string }[] = [];
  for (const element of elements) {
    const titleElement = await element.findElement(By.css('#video-title'));
    const videoUrl = await titleElement.getAttribute('href');
    if (videoUrl) {
      videos.push({ videoUrl });
    }
  }

  chrome.close();
  return videos.map((video) => extractVideoId(video.videoUrl));
};

const shortsVideoIdsByChannelId = async (channelId = 'UCUpJs89fSBXNolQGOYKn0YQ') => {
  const { chrome, elements } = await _getElements(
    `https://www.youtube.com/channel/${channelId}/shorts`,
    'ytd-rich-item-renderer',
    {}
  );

  const videos: { videoUrl: string }[] = [];

  for (const element of elements) {
    const titleElement = element.findElement(By.css('a'));
    const videoUrl = await titleElement.getAttribute('href');
    if (videoUrl) {
      videos.push({ videoUrl });
    }
  }

  chrome.close();
  return videos.map((video) => extractVideoId(video.videoUrl));
};

export { watchLaterVideoIds, historyVideoIds, shortsVideoIdsByChannelId };
