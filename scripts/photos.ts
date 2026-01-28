export const photos = {
  ad: {
    filename: 'photos/wes-straight-on.jpg',
    PREFIX: 'wes-big',
    X_STEPS: 11,
    Y_STEPS: 11,
  },
};

export type Photo = typeof photos[keyof typeof photos];