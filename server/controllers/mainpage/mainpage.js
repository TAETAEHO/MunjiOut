require("dotenv").config();
const axios = require("axios");
const db = require("../../models");
const { isAuthorized } = require("../tokenFunctions");

const apiKey = process.env.API_KEY;
const rowNum = 1;

module.exports = async (req, res) => {
  const accessTokenData = isAuthorized(req);
  if (!accessTokenData) {
    // 로그인 상태가 아닌 경우
    // 이 경우에는 유저 전용 메인페이지가 아니라 검색기능만 가능한 홈페이지으로 리다이렉트 되면 좋을 것 같습니다
    return res.status(403).json({ message: "you are not logged in" });
  }
  const stations = [];

  let locationData = await db.UserLocation.findAll({
    include: [
      {
        model: db.Location,
        attributes: ["id", "location_name"],
      },
    ],
    where: { userId: accessTokenData.id },
  });

  if (locationData.length > 0) {
    locationData.map((el) => {
      stations.push(el.Location.location_name);
    });
    // console.log(stations);
    const fetchStationInfo = async () => {
      const stationInfo = stations.map(async (station) => {
        const stationData = station;
        station = station.split(" ")[1];
        const encodedLocation = encodeURIComponent(station);
        const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?stationName=${encodedLocation}&dataTerm=month&pageNo=1&numOfRows=${rowNum}&returnType=json&serviceKey=${apiKey}`;

        const response = await axios({
          method: "GET",
          url: url,
        });

        const locationInfo = await db.Location.findOne({
          where: {
            location_name: stationData,
          },
        });

        const howManyLikes = await db.UserLocation.findAll({
          where: {
            locationId: locationInfo.id,
          },
        });

        console.log("나와라 :", response.data.response);
        if (response.data.response === undefined) {
          return res.status(400).json({ message: "OpenAPI server error" });
        } else if (response.data.response.body.items[0].pm10Value === "-") {
          return {
            stationName: stationData,
            lastUpdated: response.data.response.body.items[0].dataTime,
            pm10_value: "the station is currently under inspection.",
            likes: howManyLikes.length,
          };
        }
        return {
          stationName: stationData,
          lastUpdated: response.data.response.body.items[0].dataTime,
          pm10_value: Number(response.data.response.body.items[0].pm10Value),
          likes: howManyLikes.length,
        };
      });

      const results = await Promise.all(stationInfo);
      res.status(200).send(results);
    };
    fetchStationInfo();
  } else {
    return res
      .status(404)
      .json({ data: null, message: "please choose your preferred locations" });
  }
  return res.status(400);
};
