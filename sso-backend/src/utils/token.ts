import { customAlphabet } from 'nanoid/async';

const nanoid = customAlphabet('123456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVW', 10);
const nanoidSharing = customAlphabet('123456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVW', 7);
const nanoidShortUrl = customAlphabet('123456789abcdefghjkmnopqrstuvwxyz', 8);

const generateOneAsync = async () => {
  const id = await nanoid();
  return id;
};

const generateOneAsyncForSharing = async () => {
  const id = await nanoidSharing();
  return id;
};

const generateOneAsyncForShortUrl = async () => {
  const id = await nanoidShortUrl();
  return id;
};

export default {
  generateOneAsync,
  generateOneAsyncForSharing,
  generateOneAsyncForShortUrl,
};
