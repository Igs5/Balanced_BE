// const Debt=require("../models/DebtModel");
// const User=require("../models/UserModel");

// // Create a new debt
// const createDebt = async (req, res) => {
//     try {
//       const { creditorId, debtorId, amount, description } = req.body;
  
//       const debt = new Debt({
//         creditor: creditorId,
//         debtor: debtorId,
//         amount,
//         description
//       });
  
//       await debt.save();
  
//       await User.findByIdAndUpdate(creditorId, { $push: { debts: debt._id } });
//       await User.findByIdAndUpdate(debtorId, { $push: { debts: debt._id } });
  
//       res.status(201).json(debt);
//     } catch (error) {
//       res.status(500).json({ message: 'Error creating debt', error });
//     }
//   };
  
//   // Update a debt (mark as paid or confirm payment)
//   const updateDebt = async (req, res) => {
//     try {
//       const { debtId } = req.params;
//       const { action } = req.body;
  
//       const debt = await Debt.findById(debtId);
//       if (!debt) {
//         return res.status(404).json({ message: 'Debt not found' });
//       }
  
//       if (action === 'markAsPaid') {
//         debt.payed = true;
//       } else if (action === 'confirmPayment') {
//         debt.payedConfirmation = true;
//       }
  
//       if (debt.payed && debt.payedConfirmation) {
//         debt.amount = 0; // Debt is settled, set amount to 0
//       }
  
//       debt.updatedAt = Date.now();
//       await debt.save();
  
//       res.json(debt);
//     } catch (error) {
//       res.status(500).json({ message: 'Error updating debt', error });
//     }
//   };
  
//   // Get all debts for a user
//   const getUserDebts = async (req, res) => {
//     try {
//       const user = await User.findById(req.params.userId).populate('debts');
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       res.json(user.debts);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching user debts', error });
//     }
//   };
  
//   module.exports = { createDebt, updateDebt, getUserDebts };
