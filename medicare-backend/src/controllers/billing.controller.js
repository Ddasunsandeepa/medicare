const Bill = require("../models/Bill");
const Package = require("../models/Package");

const discountMap = {
  NONE: 0,
  SILVER: 0.05,
  GOLD: 0.1,
  PLATINUM: 0.15,
};

exports.generateBill = async (req, res) => {
  try {
    const { patient, packageId, membership } = req.body;

    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ msg: "Package not found" });

    const baseAmount = pkg.price;
    const discount = baseAmount * (discountMap[membership] || 0);
    const taxableAmount = baseAmount - discount;
    const tax = taxableAmount * 0.08;
    const totalAmount = taxableAmount + tax;

    const bill = await Bill.create({
      patient,
      package: packageId,
      membership,
      baseAmount,
      discount,
      tax,
      totalAmount,
      createdBy: req.user.id,
    });

    res.status(201).json(bill);
  } catch {
    res.status(500).json({ msg: "Failed to generate bill" });
  }
};

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("patient", "fullName")
      .populate("package", "name price");

    res.json(bills);
  } catch {
    res.status(500).json({ msg: "Failed to fetch bills" });
  }
};
