const Bill = require("../models/Bill");
const Package = require("../models/Package");
const Patient = require("../models/Patient");
const { sendPaymentEmail } = require("../utils/email");

const discountMap = {
  NONE: 0,
  SILVER: 0.05,
  GOLD: 0.1,
  PLATINUM: 0.15,
};

const PatientPackage = require("../models/PatientPackage");

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

    // Create bill
    const bill = await Bill.create({
      patient,
      package: packageId,
      membership,
      baseAmount,
      discount,
      tax,
      totalAmount,
      createdBy: req.user.id,
      status: "UNPAID",
    });

    // Assign package to patient
    await PatientPackage.create({
      patient,
      package: packageId,
      remainingSessions: pkg.sessions,
    });

    res.status(201).json(bill);
  } catch (err) {
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

exports.getIncomeSummary = async (req, res) => {
  const summary = await Bill.aggregate([
    {
      $group: {
        _id: "$package",
        totalIncome: { $sum: "$totalAmount" },
      },
    },
  ]);

  const populated = await Package.populate(summary, {
    path: "_id",
    select: "name",
  });

  res.json(populated);
};

exports.markAsPaid = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { status: "PAID" },
      { new: true }
    );

    res.json(bill);
  } catch {
    res.status(500).json({ msg: "Failed to update payment status" });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate("patient", "fullName email")
      .populate("package", "name");

    if (!bill) {
      return res.status(404).json({ msg: "Bill not found" });
    }

    if (bill.status === "PAID") {
      return res.json({ msg: "Already paid" });
    }

    bill.status = "PAID";
    await bill.save();

    // Send email
    if (bill.patient?.email) {
      await sendPaymentEmail({
        to: bill.patient.email,
        name: bill.patient.fullName,
        packageName: bill.package.name,
        amount: bill.totalAmount,
      });
    }

    res.json(bill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update payment status" });
  }
};
