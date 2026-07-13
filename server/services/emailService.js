const axios = require('axios');

/**
 * Send order notification email to admin via Brevo REST API.
 *
 * Deliverability best-practices applied:
 *  - Plain-text fallback (textContent) — spam filters penalise HTML-only emails
 *  - No emoji in the subject line (common spam trigger)
 *  - Sender name matches the business name
 *  - Reply-To set to the sender so replies thread correctly
 *  - Headers: X-Priority, X-Mailer, X-Entity-Ref-ID for classification
 *  - Preheader text hidden inside HTML (improves preview text in Gmail/Outlook)
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

        const city = (deliveryCity && deliveryCity !== 'Not specified') ? `, ${deliveryCity}` : '';
        const totalFormatted = `Rs. ${(totalAmount || 0).toLocaleString()}`;

        // ── Plain text version (critical for spam avoidance) ──────────────────
        const itemsText = orderItems.map(item => {
            const subtotal = (item.quantity || 0) * (item.unitPrice || 0);
            return `  - ${item.productName} x${item.quantity}  @ Rs. ${(item.unitPrice || 0).toLocaleString()} = Rs. ${subtotal.toLocaleString()}`;
        }).join('\n');

        const textContent = `
NEW ORDER RECEIVED — Swift Sales Healthcare
===========================================

Order ID : ${orderId}
Customer : ${customerName || 'Guest'}
Phone    : ${customerPhone}
Address  : ${deliveryAddress}${city}

ORDER ITEMS
-----------
${itemsText}

Total : ${totalFormatted}

---
Swift Sales Healthcare | Sardar Colony, Rahim Yar Khan | 03008607811
`.trim();

        // ── HTML rows ─────────────────────────────────────────────────────────
        const itemRows = orderItems.map(item => {
            const subtotal = ((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString();
            const unitPrice = (item.unitPrice || 0).toLocaleString();
            return `
            <tr>
                <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#1e293b;">${item.productName}</td>
                <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:center;color:#475569;">${item.quantity}</td>
                <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:right;color:#475569;">Rs. ${unitPrice}</td>
                <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;color:#1e293b;">Rs. ${subtotal}</td>
            </tr>`;
        }).join('');

        // ── HTML content ──────────────────────────────────────────────────────
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Order ${orderId} — Swift Sales Healthcare</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">

  <!--[preheader: hidden preview text for email clients]-->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    Order ${orderId} from ${customerName || 'Guest'} — ${totalFormatted} — ${customerPhone}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1e40af;padding:28px 32px;">
            <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">New Order Received</p>
            <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;">Swift Sales Healthcare · Order Notification</p>
          </td>
        </tr>

        <!-- Order meta -->
        <tr>
          <td style="padding:24px 32px;border-bottom:1px solid #e2e8f0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:8px;color:#64748b;font-size:13px;width:110px;">Order ID</td>
                <td style="padding-bottom:8px;font-size:13px;font-weight:700;color:#1e293b;font-family:monospace;">${orderId}</td>
              </tr>
              <tr>
                <td style="padding-bottom:8px;color:#64748b;font-size:13px;">Customer</td>
                <td style="padding-bottom:8px;font-size:14px;color:#1e293b;">${customerName || 'Guest'}</td>
              </tr>
              <tr>
                <td style="padding-bottom:8px;color:#64748b;font-size:13px;">Phone</td>
                <td style="padding-bottom:8px;font-size:14px;color:#1e293b;">${customerPhone}</td>
              </tr>
              <tr>
                <td style="color:#64748b;font-size:13px;">Address</td>
                <td style="font-size:14px;color:#1e293b;">${deliveryAddress}${city}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Items -->
        <tr>
          <td style="padding:24px 32px;">
            <p style="margin:0 0 14px;font-size:15px;font-weight:700;color:#1e293b;">Order Items</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;border-collapse:collapse;">
              <thead>
                <tr style="background:#f8fafc;">
                  <th style="padding:10px 14px;text-align:left;color:#64748b;font-weight:600;border-bottom:2px solid #e2e8f0;">Product</th>
                  <th style="padding:10px 14px;text-align:center;color:#64748b;font-weight:600;border-bottom:2px solid #e2e8f0;">Qty</th>
                  <th style="padding:10px 14px;text-align:right;color:#64748b;font-weight:600;border-bottom:2px solid #e2e8f0;">Unit Price</th>
                  <th style="padding:10px 14px;text-align:right;color:#64748b;font-weight:600;border-bottom:2px solid #e2e8f0;">Subtotal</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
              <tfoot>
                <tr style="background:#eff6ff;">
                  <td colspan="3" style="padding:12px 14px;font-weight:700;color:#1e40af;text-align:right;font-size:14px;">Total Amount</td>
                  <td style="padding:12px 14px;font-weight:700;color:#1e40af;text-align:right;font-size:14px;">${totalFormatted}</td>
                </tr>
              </tfoot>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:18px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
              Swift Sales Healthcare &nbsp;|&nbsp; Sardar Colony, Rahim Yar Khan &nbsp;|&nbsp; 03008607811
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

        // ── Send via Brevo ────────────────────────────────────────────────────
        await axios.post('https://api.brevo.com/v3/smtp/email', {
            sender: {
                name: 'Swift Sales Healthcare',
                email: process.env.BREVO_SENDER_EMAIL
            },
            to: [{ email: process.env.BREVO_RECEIVER_EMAIL, name: 'Swift Sales Admin' }],
            replyTo: {
                email: process.env.BREVO_SENDER_EMAIL,
                name: 'Swift Sales Healthcare'
            },
            // Clean subject — no emoji, no excessive punctuation (common spam triggers)
            subject: `Order ${orderId} | ${customerName || 'Guest'} | ${totalFormatted}`,
            textContent,   // Plain-text fallback — critical for deliverability
            htmlContent,
            headers: {
                'X-Priority': '1',
                'X-Mailer': 'SwiftSalesBot/1.0',
                // Unique message ID prevents duplicate-detection spam flags
                'X-Entity-Ref-ID': orderId
            },
            // Brevo tags for filtering in the dashboard
            tags: ['order-notification', 'transactional']
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
