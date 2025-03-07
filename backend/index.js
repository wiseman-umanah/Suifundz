// Express server to handle OPay API integration
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// Environment variables for OPay API
const OPAY_API_KEY = process.env.OPAY_API_KEY;
const OPAY_MERCHANT_ID = process.env.OPAY_MERCHANT_ID;
const OPAY_BASE_URL =
  process.env.OPAY_BASE_URL || "https://sandbox.opaycheckout.com"; // Using sandbox for testnet

// Endpoint to handle transfers to OPay
app.post("/api/transfer-to-opay", async (req, res) => {
  const { suiTransactionId, amount, opayAccountNumber } = req.body;

  // Validate inputs
  if (!suiTransactionId || !amount || !opayAccountNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    // 1. Verify the SUI transaction (would be implemented based on Sui SDK)
    // For MVP, we'll assume the transaction is valid

    // 2. Generate a reference ID for the transfer
    const reference = `SUI_TRANSFER_${Date.now()}`;

    // 3. Make request to OPay API
    const response = await axios.post(
      `${OPAY_BASE_URL}/api/v1/transfer`,
      {
        amount: amount,
        currency: "NGN",
        country: "NG",
        reference: reference,
        receiver: {
          type: "ACCOUNT",
          account: opayAccountNumber,
        },
        reason: "SUI to Naira conversion",
      },
      {
        headers: {
          Authorization: `Bearer ${OPAY_API_KEY}`,
          MerchantId: OPAY_MERCHANT_ID,
          "Content-Type": "application/json",
        },
      }
    );

    // 4. Store transaction details in database (for a full implementation)
    // This would include the SUI transaction ID, OPay reference, status, etc.

    // 5. Return response to client
    if (response.data && response.data.code === "00000") {
      return res.json({
        success: true,
        message: "Transfer successful",
        data: {
          reference: reference,
          opayReference: response.data.data.reference,
        },
      });
    } else {
      return res.json({
        success: false,
        message: `Transfer failed: ${response.data.message || "Unknown error"}`,
        data: response.data,
      });
    }
  } catch (error) {
    console.error("Error processing OPay transfer:", error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || "Server error",
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
