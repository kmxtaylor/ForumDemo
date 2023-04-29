/* requires the static images b/c idiosyncratically you can't require them dynamically */
const avatars = {
  amyrobson: require('./image-amyrobson.png'),
  juliusomo: require('./image-juliusomo.png'),
  maxblagun: require('./image-maxblagun.png'),
  ramsesmiron: require('./image-ramsesmiron.png'),
};

const avatarStyles = {
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
};

export { avatars, avatarStyles };
export default avatars;