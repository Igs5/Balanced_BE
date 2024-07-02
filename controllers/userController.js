const User=require("../models/UserModel")

//CHAT GPT REVIEW
const updateUserDebt = async (req, res) => {
    try {
      const { debts } = req.body;
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.debts = debts; // Update the debts array
      await user.save();
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error updating user debt", error });
    }
  };
  
  // Settle Debt
  const settleDebt = async (req, res) => {
    try {
      const { debtId } = req.params;
      const { action } = req.body;
  
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const debt = user.debts.id(debtId);
      if (!debt) {
        return res.status(404).json({ message: 'Debt not found' });
      }
  
      if (action === 'markAsPaid') {
        debt.payed = true;
      } else if (action === 'confirmPayment') {
        debt.payedConfirmation = true;
      }
  
      if (debt.payed && debt.payedConfirmation) {
        debt.moneyOwed = 0; // Debt is settled, set money owed to 0
      }
  
      await user.save();
  
      res.json(debt);
    } catch (error) {
      res.status(500).json({ message: 'Error settling debt', error });
    }
  };
  
  module.exports = { updateUserDebt, settleDebt };


// const updateUserDebt = async (req, res) => {
//     try {
//       const { debtId, action } = req.body;
//       const userId = req.params.id;
  
//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       const debt = user.debts.id(debtId);
//       if (!debt) {
//         return res.status(404).json({ message: 'Debt not found' });
//       }
  
//       if (action === 'markAsPaid') {
//         debt.payed = true;
//       } else if (action === 'confirmPayment') {
//         debt.payedConfirmation = true;
//       }
  
//       await user.save();
  
//       if (debt.payed && debt.payedConfirmation) {
//         const owedUser = await User.findById(debt.userOwed._id);
//         if (owedUser) {
//           const owedUserDebt = owedUser.debts.find(d => d._id.equals(debtId));
//           if (owedUserDebt) {
//             owedUserDebt.moneyOwed = 0;
//             owedUserDebt.payed = true;
//             owedUserDebt.payedConfirmation = true;
//             await owedUser.save();
//           }
//         }
  
//         user.debts.id(debtId).remove();
//         await user.save();
//       }
  
//       res.json(user);
//     } catch (error) {
//       res.status(500).json({ message: 'Error updating user debt', error });
//     }
//   };
  
//   module.exports = { updateUserDebt };



// //MARIA APPROACH
// const updateUserDebt = async (req, res) => {
//     try {
//         const { debts } = req.body;
//         const user = await User.findById(req.params.id);
        
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const userDebtUpdated = await User.findByIdAndUpdate(
//             req.params.id, 
//             req.body,
//             // { debts }, 
//             { new: true }
//         );

//         res.json(userDebtUpdated);
//     } catch (error) {
//         res.status(500).json({ message: "Error updating user debt", error });
//     }
// };

// module.exports = { updateUserDebt };

//PREVIOUS APPROACH
// const updateUserDebt=async(req,res)=>{
//     try{
//      const {debts}=req.body
//      const user=User.findById(req.params.id);
//      if(!user) res.status(404).json({message:"user not found"})
//      const userDebtUpdated= User.findByIdAndUpdate(req.params.id, {...user, debts})
//      res.json(userDebtUpdated)
//     }catch(error){
//         if (error)throw error;
//     }
// }
// module.exports={updateUserDebt}