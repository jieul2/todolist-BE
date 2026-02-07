const User = require("../model/User");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const userController = {};

// 색상 랜덤 생성 함수
// const generatePastelColor = () => {
//   const r = Math.floor(Math.random() * 127 + 128); // 128 ~ 255 사이 (밝은 톤)
//   const g = Math.floor(Math.random() * 127 + 128);
//   const b = Math.floor(Math.random() * 127 + 128);

//   return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
// };

userController.createUser = async (req, res) => {
  try {
    const { email, name, password, color } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("이미 가입된 유저입니다.");
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    // const userColor = color || generatePastelColor();

    // const newUser = new User({ email, name, password: hash, color: userColor });
    const newUser = new User({ email, name, password: hash });
    await newUser.save();
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err.message || err,
    });
  }
};

userController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }, "-createdAt -updatedAt -__v");
    if (user) {
      const isMath = bcrypt.compareSync(password, user.password);
      if (isMath) {
        const token = user.generateToken();
        return res.status(200).json({ status: "success", user, token });
      }
    }
    throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
  } catch (err) {
    res.status(400).json({ status: "fail", error: err.message || err });
  }
};

module.exports = userController;
