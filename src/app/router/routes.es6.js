import Frontpage from './handlers/Frontpage';

export default [
  ['/', Frontpage],
  ['/r/:subredditName', Frontpage],
];
