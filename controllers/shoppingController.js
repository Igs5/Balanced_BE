const ShoppingItem =require("../models/ShoppingItemModel");
const BoughtItem = require("../models/BoughtItemModel");
const { updateBalances } = require('./balanceController');
const History=require("../models/HistoryModel")
const Debt=require("../models/DebtModel")

// Add item to shopping list
const addItem = async (req, res) => {
  try {
    const { name } = req.body;
    const item = new ShoppingItem({
      name,
      household_id: req.user.household_id,
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get items from shopping list
const getItems = async (req, res) => {
  try {
    const items = await ShoppingItem.find({ household_id: req.user.household_id });
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get bought items
const getBoughtItems = async (req, res) => {
  try {
    const items = await BoughtItem.find({ household_id: req.user.household_id }).populate('buyer', 'username');
    res.json(items);
  } catch (error) {
    console.error("Error fetching bought items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Buy item from shopping list
const buyItem = async (req, res) => {
  try {
    const { itemId, cost } = req.body;
    const item = await ShoppingItem.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const boughtItem = new BoughtItem({
      name: item.name,
      cost,
      buyer: req.user.id,
      household_id: req.user.household_id,
    });

    await boughtItem.save();
    await ShoppingItem.deleteOne({ _id: itemId });


    // Update balances
    await updateBalances(req.user.household_id, req.user._id, cost);

    // Record the purchase in history
    const historyEntry = new History({
      household_id: req.user.household_id,
      items: [{ name: item.name, cost, buyer: req.user.id }],
      totalCost: cost,
    });

    await historyEntry.save();

    // Fetch updated bought items and return
    const updatedBoughtItems = await BoughtItem.find({ household_id: req.user.household_id }).populate('buyer', 'username');
    res.status(201).json(updatedBoughtItems);
  } catch (error) {
    console.error("Error buying item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete item from shopping list
const deleteItem = async (req, res) => {
  try {
    const item = await ShoppingItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete bought item from list
const deleteBoughtItem = async (req, res) => {
  try {
    const item = await BoughtItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Bought item not found" });
    }
    res.json({ message: "Bought item deleted" });
  } catch (error) {
    console.error("Error deleting bought item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addItem, getItems, getBoughtItems, buyItem, deleteItem, deleteBoughtItem };


// //prevous approach without DEBT OBJECT creation
// //ADDING, RETRIEVING AND MOVING ITEMS from one list to the other

// const addItem = async (req, res) => {
//     try {
//       const { name } = req.body;
//       const item = new ShoppingItem({
//         name,
//         household_id: req.user.household_id,
//       });
//       await item.save();
//       res.status(201).json(item);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   };
  
//   const getItems = async (req, res) => {
//     try {
//       const items = await ShoppingItem.find({ household_id: req.user.household_id });//elong to the household of the authenticated user.
//       res.json(items);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   };
  
//   const getBoughtItems = async (req, res) => {
//     try {
//       const items = await BoughtItem.find({ household_id: req.user.household_id }).populate('buyer', 'username');// populates the buyer field with the username of the user who bought the item.
//       res.json(items);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   };
  
//   const buyItem = async (req, res) => {
//     try {
//       const { itemId, cost } = req.body;
//       const item = await ShoppingItem.findById(itemId);
  
//       if (!item) {
//         console.log(item);
//         return res.status(404).json({ message: 'Item not found' });
//       }
  
//       const boughtItem = new BoughtItem({
//         name: item.name,
//         cost,
//         buyer: req.user.id,
//         household_id: req.user.household_id,
//       });
  
//       await boughtItem.save();
//       await ShoppingItem.deleteOne({ _id: itemId }); 
      
    

//       // Update the balances of all users in the household
//       await updateBalances(req.user.household_id, req.user._id, cost);
     

//        // Record the purchase in history
//     const historyEntry = new History({
//       household_id: req.user.household_id,
//       items: [{ name: item.name, cost, buyer: req.user.id }],
//       totalCost: cost
//     });

//     await historyEntry.save();


//       const updatedBoughtItems = await BoughtItem.find({ household_id: req.user.household_id }).populate('buyer', 'username');
//       res.status(201).json(updatedBoughtItems);
//     } catch (error) {
//       console.error('Error in buyItem:', error);
//       res.status(500).json({ message: 'Server error' });
//     }

//     // Create a new Debt object
//     const debt = new Debt({
//       creditor: req.user.id,
//       debtor: item.owner, // Assuming item.owner is the ID of the user who sold the item
//       amount: cost,
//       description: `Debt for buying item '${item.name}'`,
//     });

//     // Save the Debt object
//     await debt.save();

//   };



//   //delete item from shopping list
//   const deleteItem=async(req,res)=>{
//     try {
//         const item = await ShoppingItem.findByIdAndDelete(req.params.id);
//         if (!item) {
//           return res.status(404).json({ message: 'Item not found' });
//         }
//         res.json({ message: 'Item deleted' });
//       } catch (error) {
     
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//       }
//   }

//   //Delete bought item button
//   const deleteBoughtItem = async (req, res) => {
//     try {
//       const item = await BoughtItem.findByIdAndDelete(req.params.id);
//       if (!item) {
//         return res.status(404).json({ message: 'Bought item not found' });
//       }
//       res.json({ message: 'Bought item deleted' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   }
  
//   module.exports = { addItem, getItems, getBoughtItems, buyItem,deleteItem, deleteBoughtItem  };