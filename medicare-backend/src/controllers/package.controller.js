const Package = require("../models/Package");

exports.createPackage = async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json(pkg);
  } catch {
    res.status(500).json({ msg: "Failed to create package" });
  }
};

exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch {
    res.status(500).json({ msg: "Failed to fetch packages" });
  }
};
