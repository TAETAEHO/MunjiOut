import React, { useState } from "react";
import logo from "../MunjioutLogo.png";
import axios from "axios";
import Modal from "../components/Modal";
import styled from "styled-components";
import { media } from "../components/utils/_media-queries";
import { fonts, colors } from "../components/utils/_var";
require("dotenv").config();

const Wrapper = styled.div`
  * {
    box-sizing: border-box;
    color: ${colors.darkGray};
  }
  .Logo {
    ${media.laptop`margin-top: 50px; margin-bottom: 50px; width: 250px;`}
    ${media.tablet`margin-top: 60px; margin-bottom: 60px; width: 220px;`}
    margin-top: 50px;
    margin-bottom: 50px;
    width: 275px;
    cursor: pointer;
  }
  .Login_info {
    ${media.laptop`font-size: 18px;`}
    ${media.tablet`margin-top: 15px;`}
    ${media.largeMobile`font-size: 16px; margin-left: 10px`}
    font-size: 20px;
    font-family: ${fonts.jua}, sans-serif;
    text-align: left;
    padding-left: 6px;
  }
  .Login {
    text-align: center;
    background-color: #f8f8f8;
    height: 100vh;
  }
  .Login_container {
    width: 310px;
    margin-left: auto;
    margin-right: auto;
  }
  .Login_btn {
    ${media.largeMobile`width: 225px`}
    background-color: ${colors.yellow};
    font-family: ${fonts.dohyun}, sans-serif;
    font-size: 1rem;
    width: 240px;
    height: 40px;
    letter-spacing: 3px;
    border-radius: 20px;
    margin-top: 12px;
    transition: 0.5s ease-in-out;
  }
  .Login_btn:hover {
    background-color: gray;
    width: 300px;
    border: none;
    border-radius: 0;
    color: white;
    cursor: pointer;
  }
  .Login_input {
    ${media.largeMobile`width: 280px;`}
    width: 300px;
    height: 25px;
    margin-bottom: 20px;
    padding: 5px;
    border-color: rgb(255, 255, 255);
    border-width: 0.2px;
  }
  .Login_input:focus {
    outline: none;
  }
  .alert-box {
    color: red;
    font-family: ${fonts.ibm}, sans-serif;
    font-weight: 500;
    ${media.laptop`font-size: 14px;`}
    font-size: 16px;
    border-color: #f5c6cb;
    position: relative;
    padding: 0.75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
  }
`;

function Login({ handleLogin }) {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState();

  const handleInputValue = (key) => (e) => {
    setLoginInfo({ ...loginInfo, [key]: e.target.value });
  };
  const handleReplace = () => {
    window.location.replace("/");
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const handleLoginRequest = () => {
    if (loginInfo.email === "" && loginInfo.password === "") {
      setErrorMsg("???????????? ??????????????? ??????????????????");
    } else {
      axios
        .post(process.env.REACT_APP_API_URL + "/login", loginInfo, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
          handleLogin();
          setIsOpen(true);
          setPage("??????????????????");
          setMessage("???????????????!");
          return res.data.accessToken;
        })
        .then((token) => {
          axios
            .get(process.env.REACT_APP_API_URL + "/userinfo", {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            })
            .then((res) => {
              localStorage.setItem("userinfo", JSON.stringify(res.data.data));
            })
            .catch((err) => {
              console.log("userinfo error :", err.response);
            });
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response.status === 404) {
            setErrorMsg("???????????? ?????? ???????????????");
          } else if (err.response.status === 400) {
            setErrorMsg("??????????????? ??????????????????");
          }
        });
    }
  };

  const enter = (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
      handleLoginRequest();
    }
  };

  return (
    <Wrapper>
      <div className="Login">
        <img
          src={logo}
          className="Logo"
          onClick={handleReplace}
          alt={logo}
        ></img>
        <div className="Login_container">
          <div>
            <div className="Login_info">?????????</div>
            <input
              className="Login_input"
              onChange={handleInputValue("email")}
              onKeyPress={(e) => {
                enter(e);
              }}
            ></input>
          </div>
          {isOpen ? (
            <Modal
              message={message}
              onClick={handleReplace}
              page={page}
              close={handleModalClose}
            />
          ) : null}
          <div>
            <div className="Login_info">????????????</div>
            <input
              className="Login_input"
              type="password"
              onChange={handleInputValue("password")}
              onKeyPress={(e) => {
                enter(e);
              }}
            ></input>
          </div>
          <button className="Login_btn" onClick={handleLoginRequest}>
            ?????????
          </button>
          <div className="alert-box">{errorMsg}</div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Login;
