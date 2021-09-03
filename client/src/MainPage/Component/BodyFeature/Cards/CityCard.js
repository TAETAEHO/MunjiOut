import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDizzy,
  faSmile,
  faMeh,
  faFrown,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

import styled from 'styled-components';
import { fonts, colors } from '../../../../components/utils/_var';

const Wrapper = styled.div`
  .cityCard,
  .cityCard_isLoading {
    min-width: 340px;
    margin: 10px 10px 23px 10px;
    height: 200px;
    text-align: center;
    border-radius: 0px;
    box-shadow: 3px 3px 3px rgba(19, 19, 19, 0.4);
    background-color: white;
    font-size: 16px;
  }
  .cityCard_isLoading {
    text-align: justify;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.3;
    border-radius: 20px;
  }
  .cityCard:hover {
    background-color: cornsilk;
    transition: all 0.5s;
  }
  .pic {
    display: flex;
    margin-top: 5px;
    /* border: 1px solid black; */
  }
  .pic_stared,
  .pic_searched {
    position: relative;
    /* top: 10px;
    padding: 2px; */
    /* background-color: gold; */
    font-size: 14px;
    /* border-radius: 20px; */
    width: 50px;
    left: 270px;
    color: ${colors.yellow};
    margin-top: 5px;
    /* border: 1px solid black; */
    text-align: center;
  }
  .pic_stared {
    /* color: goldenrod; */
    font-weight: bold;
    /* border-radius: 20px; */
  }
  .pic_searched {
    color: gray;
  }
  .pic_stared:hover,
  .pic_searched:hover {
    /* background-color: rgb(255, 230, 89); */
    cursor: pointer;
    transition: all 0.5s;
  }
  .container {
    display: flex;
    justify-content: space-between;
  }
  .location {
    margin-top: 12px;
    position: relative;
    font-family: ${fonts.jua};
    /* border: 1px solid black; */
    text-align: center;
    font-size: 20px;
    padding-left: 75px;
  }
  .icon {
    position: relative;
    font-weight: bold;
    /* border: 1px solid black; */
    padding-left: 30px;
    text-align: center;
  }
  .values {
    position: relative;
    margin-top: 2px;
  }
  .value {
    position: relative;
    /* font-weight: bold; */
    text-align: center;
    font-family: ${fonts.dohyun};
    /* border: 1px solid black; */
    padding-right: 45px;
    margin-top: 10px;
    font-size: 17px;
  }
  .time {
    position: relative;
    font-weight: normal;
    /* border: 1px solid black; */
    text-align: center;
    font-family: ${fonts.ibm};
    margin-top: 20px;
    font-size: 14px;
    color: #666666;
    /* width: 80%;
    top: 175px; */
  }
  .likes {
    /* border: 1px solid black; */
    text-align: center;
    padding-right: 30px;
    margin-top: 10px;
    font-size: 17px;
    color: #444444;
    font-family: ${fonts.noto}, sans-serif;
  }
`

export default function CityCard({
  isLogin,
  data,
  stared,
  idx,
  handleIsStaredDelete,
  handleIsSearched,
  isLoading,
  isStaredLoading
}) {
  const { stationName, lastUpdated, pm10_value, likes } = data;

  return (
    <Wrapper>
    <div className={(isLoading && idx === 0) || (isStaredLoading && stared) ? "cityCard_isLoading" : "cityCard"}>
      {(isLoading && idx === 0) || (isStaredLoading && stared) ? 
          (<FadeLoader />) 
          : (
          <div>
            <div className="pic">
              {isLogin && stared ? (
                <span
                  className="pic_stared"
                  value={idx}
                  onClick={handleIsStaredDelete}
                >
                  <FontAwesomeIcon icon={faStar} size="2x" />
                </span>
              ) : null}
              {isLogin && !stared ? (
                <span
                  className="pic_searched"
                  value={idx}
                  onClick={handleIsSearched}
                >
                  <FontAwesomeIcon icon={faStar} size="2x" />
                </span>
              ) : null}
              <span className="location">{stationName}</span>
            </div>
            <div className="container">
              <span className="icon">
                {pm10_value === undefined ? "🚫 N/A" : null}
                {pm10_value <= 30 ? (
                  <FontAwesomeIcon icon={faSmile} size="7x" color="#0da2ff" />
                ) : null}
                {30 < pm10_value && pm10_value <= 80 ? (
                  <FontAwesomeIcon icon={faMeh} size="7x" color="#03c04a" />
                ) : null}
                {80 < pm10_value && pm10_value <= 150 ? (
                  <FontAwesomeIcon icon={faFrown} size="7x" color="#ffa500" />
                ) : null}
                {150 < pm10_value ? (
                  <FontAwesomeIcon icon={faDizzy} size="7x" color="#ff000" />
                ) : null}
              </span>
              <span className="values">
                <div className="value">
                  {" "}
                  {pm10_value === undefined ? "🚫 N/A" : null}
                  {pm10_value <= 30 ? "좋음" : null}
                  {30 < pm10_value && pm10_value <= 80 ? "보통" : null}
                  {80 < pm10_value && pm10_value <= 150 ? "나쁨" : null}
                  {150 < pm10_value ? "매우나쁨" : null}
                </div>
                <div className="value">미세먼지: {pm10_value}</div>
                <div className="likes">⭐ {likes} </div>
              </span>
            </div>
            <div className="time">Updated: {lastUpdated}</div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}