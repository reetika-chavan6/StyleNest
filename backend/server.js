const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");

require("dotenv").config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("StyleNest server is running!");
});

// Create an order

app.post("/api/orders", async (req, res) => {
  console.log("Place order API reached!");
  console.log("Request body:", req.body);

  let connection;

  try {
    connection = await pool.getConnection();
    console.log("MySQL connection acquired!");

    const { customer, items } = req.body;

    if (
      !customer ||
      !customer.name?.trim() ||
      !customer.email?.trim() ||
      !customer.phone?.trim() ||
      !customer.address?.trim() ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Customer details or cart items are missing."
      });
    }

    const total = items.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.quantity),
      0
    );

    const orderReference =
      "SN-" + Date.now().toString().slice(-8);

    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      `INSERT INTO orders
       (order_reference, customer_name, email, phone, address, total_amount)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        orderReference,
        customer.name.trim(),
        customer.email.trim(),
        customer.phone.trim(),
        customer.address.trim(),
        total
      ]
    );

    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items
         (order_id, product_id, product_name, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderResult.insertId,
          Number(item.id),
          String(item.name),
          Number(item.quantity),
          Number(item.price)
        ]
      );
    }

    await connection.commit();
    
try {
  const productList = items.map((item) => `
    <li>
      ${item.name} — Qty: ${item.quantity}
      — ₹${Number(item.price) * Number(item.quantity)}
    </li>
  `).join("");

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: customer.email,
    subject: `StyleNest Order Confirmation - ${orderReference}`,
    text: `Hi ${customer.name},

Thank you for shopping with StyleNest!

Your order has been placed successfully.

Order Reference: ${orderReference}

Products:
${items.map(item =>
  `${item.name} x ${item.quantity}`
).join("\n")}

Total Amount: ₹${total}

Thank you for shopping with us!
Team StyleNest`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#333">
        <h1 style="color:#806447">StyleNest</h1>
        <h2>Thank you, ${customer.name}!</h2>
        <p>Your order has been placed successfully.</p>
        <p><strong>Order Reference:</strong> ${orderReference}</p>
        <h3>Order Summary</h3>
        <ul>${productList}</ul>
        <h2>Total: ₹${total}</h2>
        <p>Thank you for shopping with StyleNest!</p>
      </div>
    `
  });

  console.log("Confirmation email sent to:", customer.email);
} catch (emailError) {
  console.error("Order saved, but email failed:", emailError.message);
}

    console.log("Order saved successfully:", orderReference);

    return res.status(201).json({
      message: "Order placed successfully!",
      orderReference,
      items,
      total
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Order creation failed:", error.message);

    return res.status(500).json({
      message: "Unable to place your order.",
      error: error.message
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

