const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    console.log(req.body);
    if (!fullName || !email)
      return res.status(400).json({ error: "fullName and email required" });
    let user = await User.findOne({ email });
    if (user)
      return res.status(409).json({ error: "Email already registered" });
    user = new User({ fullName, email });
    await user.save();
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
