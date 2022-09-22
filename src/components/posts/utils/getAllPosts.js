import client from '../../../utils/client';
const moment = require('moment');

const secOneMin = 60;
const secOneHour = secOneMin * 60;
const secOneDay = secOneHour * 24;

export function formatTime(timeString) {
  const time = new Date(timeString);
  const now = new Date();
  const diff = (now - time) / 1000;
  const timeArr = time.toUTCString().split(' ');
  let formatted;

  if (time.getFullYear < now.getFullYear()) {
    formatted = timeArr.slice(1, 4).join(' ');
  } else if (diff >= secOneDay) {
    formatted = timeArr.slice(1, 3).join(' ');
  } else if (diff >= secOneHour) {
    const hoursPassed = Math.floor(diff / secOneHour);
    formatted = hoursPassed + ' hours ago';
  } else if (diff >= secOneMin) {
    const minutesPassed = Math.floor(diff / secOneMin);
    formatted = minutesPassed + ' minutes ago';
  } else if (diff < secOneMin) {
    formatted = 'less than one minutes ago';
  }

  return formatted;
}

async function getAllPosts() {
  const response = await client.get('/posts')
  return response.data.data
}

function getPostsWithin7Days(posts) {
  let lastWeek = moment().subtract(6, 'days').format('L')
  lastWeek = new Date(lastWeek)

  const postsInAWeek = posts.filter(post => new Date(post.createdAt) > lastWeek ? post : null)
  return postsInAWeek
}

function getPopularity(post) {
  return post.comments.length + post.likes.length
}

function getMostPopularPosts(posts) {
  let mostPopular = []
  posts.forEach((post, index) => {
    if (index === 0) {
      mostPopular.push(post)
    } else if (getPopularity(mostPopular[0]) < getPopularity(post)) {
      mostPopular = [post]
    } else if (getPopularity(mostPopular[0]) === getPopularity(post)) {
      mostPopular.push(post)
    }
  })

  return mostPopular
}

export async function renderPosts(setPosts, setPostsOfTheWeek) {
  const allPosts = await getAllPosts()
  console.log('all posts', allPosts)
  const mostPopular = getMostPopularPosts(getPostsWithin7Days(allPosts))
  console.log('mostPopular', mostPopular)
  setPostsOfTheWeek(mostPopular)

  const postsToRender = allPosts.filter(post => !mostPopular.includes(post))
  setPosts(postsToRender);
}