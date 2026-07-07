export const PANGRAMS = [
  "தமிழுக்கும் அமுதென்று பேர்",
  "எங்கள் வாழ்வும் எங்கள் வளமும் மங்காத தமிழென்று சங்கே முழங்கு!",
  "எங்கள் பகைவர் எங்கோ மறைந்தார் இங்குள்ள தமிழர்கள் ஒன்றாதல் கண்டே!",
  "திங்களொடும் செழும்பரிதி தன்னோடும் விண்ணோடும் உடுக்களோடும் மங்குல் கடல் இவற்றோடும் பிறந்த தமிழுடன் பிறந்தோம் நாங்கள்",
  "யாதும் ஊரே யாவரும் கேளிர்"
];

export function getRandomPangram() {
  const index = Math.floor(Math.random() * PANGRAMS.length);
  return PANGRAMS[index];
}

export function getRandomParagraph(count = 3) {
  const shuffled = [...PANGRAMS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(' ');
}
