const IMAGES_FOLDER = 'avatar/small';
const IMAGE_NAMES = [
'ade.jpg',
'chris.jpg',
'christian.jpg',
'daniel.jpg',
'elliot.jpg',
'helen.jpg',
'jenny.jpg',
'joe.jpg',
'justen.jpg',
'laura.jpg',
'lena.png',
'lindsay.png',
'mark.png',
'matt.jpg',
'matthew.png',
'molly.png',
'nan.jpg',
'nom.jpg',
'rachel.png',
'steve.jpg',
'stevie.jpg',
'tom.jpg',
'veronika.jpg',
'zoe.jpg'
];

const imageLinks = IMAGE_NAMES.map(name => {
  return [process.env.PUBLIC_URL, IMAGES_FOLDER, name].join('/');
});

const getHash = (input) => {
  // @see https://stackoverflow.com/a/7616484/2620998
  let hash = 0, i, chr;
  if (input.length === 0) return hash;
  for (i = 0; i < input.length; i++) {
    chr   = input.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

export const getImageUrl = (username) => {
  // Assign a random avatar picture to a user
  const index = getHash(username) % imageLinks.length;
  return imageLinks[Math.abs(index)];
};
