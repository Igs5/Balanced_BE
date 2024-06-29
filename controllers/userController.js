const User=require("../models/UserModel")

const updateUserDebt = async (req, res) => {
    try {
        const { debts } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userDebtUpdated = await User.findByIdAndUpdate(
            req.params.id, 
            { debts }, 
            { new: true }
        );

        res.json(userDebtUpdated);
    } catch (error) {
        res.status(500).json({ message: "Error updating user debt", error });
    }
};

module.exports = { updateUserDebt };


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