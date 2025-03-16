import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not Authroized Login Again" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.body.userId = tokenDecode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
