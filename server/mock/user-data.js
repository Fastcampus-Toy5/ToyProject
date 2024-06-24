const mockUsers = [];

const crew_id = [
  "kimisadev27",
  "kimpra2989",
  "lovelace",
  "seonahsong",
  "Panda-raccoon",
];
const crew_name = ["김성현", "강호연", "김동영", "송선아", "이연지"];

for (let i = 1; i <= 30; i++) {
  mockUsers.push({
    userId: i <= 5 ? crew_id[i - 1] : `user${i}`,
    password: `password${i}`,
    email: `user${i}@example.com`,
    name: i <= 5 ? crew_name[i - 1] : `User ${i}`,
    team: `Team ${i % 5}`, // 5개 팀으로 나누기
    position: `Position ${i % 3}`, // 3개 포지션으로 나누기
    imgUrl: `http://example.com/user${i}.jpg`,
  });
}

export default mockUsers;
