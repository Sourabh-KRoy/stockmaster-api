import PurchaseOrder from "../model/purchaseOrderModel.js";
import Product from "../model/productModel.js";
import Supplier from "../model/supplierModel.js";

const purchseFromSupplier = async (req, res) => {
  try {
    const { supplier, store, products } = req.body;

    if (!supplier || !store || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Supplier, store, and product list are required." });
    }

    const existingSupplier = await Supplier.findById(supplier);
    if(!existingSupplier){
        return res.status(404).json({message:"supplier not found."})
    }

    //calculating total cost price
    let totalCost = 0;
    for (const item of products) {
      if (!item.product || typeof item.quantity !== "number" || item.quantity <= 0) {
        return res.status(400).json({ message: "Invalid product entry." });
      }
      totalCost += item.quantity * (item.costPrice || 0);
    }

    // Create the purchase order (status defaults to "Pending")
    const newOrder = new PurchaseOrder({
      supplier,
      store,
      products,
      totalCost,
      createdBy: req.user?.id 
    });

    await newOrder.save();

    res.status(201).json({
      message: "Purchase order created successfully.",
      status: newOrder.status, 
      orderId: newOrder._id
    });
  } catch (err) {
    console.error("Error creating purchase order:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

const receivePurchaseOrder = async (req, res) => {
  try {
    const { purchaseOrderId } = req.body;

    if (!purchaseOrderId) {
      return res.status(400).json({ message: "Purchase Order ID is required." });
    }

    const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId).populate("products.product");

    if (!purchaseOrder) {
      return res.status(404).json({ message: "Purchase order not found." });
    }

    if (purchaseOrder.status === "Received") {
      return res.status(400).json({ message: "Purchase order already marked as received." });
    }

    // Update product stock
    for (const item of purchaseOrder.products) {
      const { product, quantity, costPrice } = item;

      const dbProduct = await Product.findById(product._id);
      if (!dbProduct) continue;

      dbProduct.quantityInStock += quantity;

      // update cost price
      if (costPrice) dbProduct.costPrice = costPrice;

      await dbProduct.save();
    }

    // Update purchase order status
    purchaseOrder.status = "Received";
    purchaseOrder.receivedDate = new Date();
    await purchaseOrder.save();

    return res.status(200).json({ message: "Purchase order marked as received.", orderId: purchaseOrder._id });

  } catch (err) {
    console.error("Error receiving purchase order:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export default {purchseFromSupplier,receivePurchaseOrder};
