const axios = require('axios');

/**
 * Send order notification email to admin via Brevo REST API.
 */
async function sendOrderEmail(order) {
    try {
        if (!process.env.BREVO_API_KEY) {
            console.warn('⚠️  BREVO_API_KEY not set. Skipping order email.');
            return;
        }

        const {
            orderId,
            customerName,
            customerPhone,
            deliveryAddress,
            deliveryCity,
            orderItems = [],
            totalAmount
        } = order;

        const itemRows = orderItems.map(item =>
            `<tr>
                <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${item.productName}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:center;">${item.quantity}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;">Rs. ${(item.unitPrice || 0).toLocaleString()}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;">Rs. ${((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}</td>
            </tr>`
        ).join('');

        const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:20px;">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:28px 32px;">
      <h1 style="color:#fff;margin:0;font-size:22px;">🛒 New Order Received</h1>
      <p style="color:#bfdbfe;margin:6px 0 0;font-size:14px;">Swift Sales Healthcare</p>
    </div>
    <div style="padding:24px 32px;border-bottom:1px solid #e2e8f0;">
      <p style="margin:0 0 8px;"><strong>Order ID:</strong> <code style="background:#f1f5f9;padding:2px 8px;border-radius:4px;font-size:13px;">${orderId}</code></p>
      <p style="margin:0 0 8px;"><strong>Customer:</strong> ${customerName || 'Guest'}</p>
      <p style="margin:0 0 8px;"><strong>Phone:</strong> ${customerPhone}</p>
      <p style="margin:0;"><strong>Address:</strong> ${deliveryAddress}${deliveryCity && deliveryCity !== 'Not specified' ? ', ' + deliveryCity : ''}</p>
    </div>
    <div style="padding:24px 32px;">
      <h3 style="margin:0 0 16px;color:#1e293b;">Order Items</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="padding:10px 12px;text-align:left;color:#64748b;font-weight:600;">Product</th>
            <th style="padding:10px 12px;text-align:center;color:#64748b;font-weight:600;">Qty</th>
            <th style="padding:10px 12px;text-align:right;color:#64748b;font-weight:600;">Unit Price</th>
            <th style="padding:10px 12px;text-align:right;color:#64748b;font-weight:600;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr style="background:#eff6ff;">
            <td colspan="3" style="padding:12px;font-weight:700;color:#1e40af;text-align:right;">Total Amount:</td>
            <td style="padding:12px;font-weight:700;color:#1e40af;text-align:right;">Rs. ${(totalAmount || 0).toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div style="padding:20px 32px;background:#f8fafc;text-align:center;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">Swift Sales Healthcare · Sardar Colony, Rahim Yar Khan · 03008607811</p>
    </div>
  </div>
</body>
</html>`;

        await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: {
                name: 'SwiftBot Orders',
                email: process.env.BREVO_SENDER_EMAIL
            },
            to: [{ email: process.env.BREVO_RECEIVER_EMAIL, name: 'Swift Sales Admin' }],
            subject: `🛒 New Order: ${orderId} | Rs. ${(totalAmount || 0).toLocaleString()} | ${customerName || 'Guest'}`,
            htmlContent
        }, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log(`✅ Order email sent successfully for ${orderId}`);
    } catch (err) {
        const errMsg = err?.response?.data?.message || err.message;
        console.error('❌ Failed to send order email:', errMsg);
    }
}

module.exports = { sendOrderEmail };
