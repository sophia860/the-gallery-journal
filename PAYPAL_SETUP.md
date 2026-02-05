# PayPal Integration Setup Guide

This guide will help you set up PayPal payment integration for The Gallery's Writer Studio submission system.

**PayPal Account**: This integration is configured to use the PayPal Business account: **sophiamaybea@gmail.com**

## Overview

The Gallery now includes an optional PayPal payment integration that allows writers to make contributions when submitting their work. This is designed as a **voluntary contribution system**, not a mandatory submission fee.

### Features

- **Optional Payments**: Writers can choose to contribute or skip and submit for free
- **Multiple Payment Tiers**: Pre-configured amounts ($5, $10, $25, $50)
- **PayPal Integration**: Secure payment processing via PayPal
- **Payment Tracking**: Payment details are stored with submissions
- **Seamless Flow**: Payment modal appears after submission, before final processing

## Setup Instructions

### 1. Access Your PayPal Business Account

**Account Email**: sophiamaybea@gmail.com

1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Sign in with **sophiamaybea@gmail.com**
3. Navigate to **Dashboard** → **My Apps & Credentials**

### 2. Get Your Client ID

#### For Testing (Sandbox):
1. Under **Sandbox**, click **Create App**
2. Enter an app name (e.g., "The Gallery Submissions")
3. Copy your **Sandbox Client ID**

#### For Production (Live):
1. Under **Live**, click **Create App**
2. Enter an app name (e.g., "The Gallery Submissions")
3. Copy your **Live Client ID**

### 3. Configure the Application

⚠️ **IMPORTANT**: The file currently contains a placeholder `YOUR_PAYPAL_CLIENT_ID` that **must be replaced** before deployment.

Open `index.html` and find this line near the top (around line 1420):

```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD"></script>
```

Replace `YOUR_PAYPAL_CLIENT_ID` with your actual PayPal Client ID:

**For Testing:**
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_SANDBOX_CLIENT_ID&currency=USD"></script>
```

**For Production:**
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_LIVE_CLIENT_ID&currency=USD"></script>
```

### 4. Test the Integration

1. Open your site in a browser
2. Log in as a writer
3. Create and submit a poem
4. The PayPal payment modal should appear
5. Complete a test payment (in sandbox mode) or skip payment

### 5. Verify Payments

#### Sandbox Testing:
1. Go to [PayPal Sandbox](https://sandbox.paypal.com)
2. Log in with your sandbox business account
3. Check transaction history

#### Production:
1. Go to [PayPal.com](https://paypal.com)
2. Log in to your business account
3. Check transaction history in **Activity**

## Customization

### Change Payment Amounts

Edit the payment options in `index.html` (around line 1757):

```html
<div class="payment-options">
    <div class="payment-option" onclick="selectPaymentAmount(5)">
        <div class="amount">$5</div>
        <div class="label">Coffee</div>
    </div>
    <div class="payment-option selected" onclick="selectPaymentAmount(10)">
        <div class="amount">$10</div>
        <div class="label">Standard</div>
    </div>
    <!-- Add more options as needed -->
</div>
```

### Change Default Amount

The default selected amount is $10. To change it, modify line 3263:

```javascript
let selectedPaymentAmount = 10; // Change this value
```

### Change Currency

To use a different currency, modify the PayPal SDK URL:

```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=EUR"></script>
```

Supported currencies: USD, EUR, GBP, CAD, AUD, JPY, and [more](https://developer.paypal.com/docs/reports/reference/paypal-supported-currencies/).

### Customize Modal Text

Edit the modal content in `index.html` (around line 1753):

```html
<h3>Support The Gallery</h3>
<p>Help us keep The Gallery running by making an optional contribution...</p>
```

## Payment Data Storage

Payment information is stored with each submission:

```javascript
{
    paymentAmount: 10,           // Amount paid (0 if skipped)
    paymentId: "PAYPAL-TXN-ID",  // PayPal transaction ID
    paymentStatus: "completed"    // "completed" or "skipped"
}
```

### Accessing Payment Data

In the Strapi backend, you can add these fields to the Submission content type:

1. Go to **Content-Type Builder** → **Submission**
2. Add fields:
   - `paymentAmount` (Number)
   - `paymentId` (Text)
   - `paymentStatus` (Enumeration: completed, skipped)

## Security Considerations

### Client ID vs Secret

- **Client ID**: Safe to include in frontend code (public)
- **Secret**: NEVER include in frontend code (keep private)

The PayPal SDK integration only requires the Client ID, which is safe for client-side use.

### Payment Verification

For production use, consider implementing server-side payment verification:

1. Store PayPal transaction IDs with submissions
2. Use PayPal's Orders API on your backend to verify transactions
3. Check transaction status before approving submissions

## Troubleshooting

### PayPal Button Not Rendering

**Problem**: "PayPal is not configured" message appears

**Solution**: 
- Ensure PayPal SDK script is loaded correctly
- Check browser console for errors
- Verify Client ID is correct

### Payments Not Processing

**Problem**: Payment fails or shows error

**Solution**:
- For sandbox: Ensure you're using sandbox credentials
- For production: Verify live credentials are active
- Check PayPal account status
- Review PayPal developer console for errors

### Submission Not Completing After Payment

**Problem**: Payment succeeds but submission doesn't save

**Solution**:
- Check browser console for JavaScript errors
- Verify Strapi backend is accessible
- Check local storage if backend is unavailable

## Going Live

When ready to accept real payments:

1. Replace sandbox Client ID with live Client ID
2. Test with a small real transaction
3. Verify funds appear in your PayPal business account
4. Monitor transactions regularly
5. Consider implementing webhook notifications for payment confirmations

## Support

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal SDK Integration Guide](https://developer.paypal.com/sdk/js/)
- [PayPal API Reference](https://developer.paypal.com/api/rest/)

## Disabling PayPal

To disable PayPal integration:

1. Comment out or remove the PayPal SDK script
2. The payment modal will show "PayPal is not configured" 
3. Users can still skip payment and submit for free

Or modify submission functions to bypass PayPal modal entirely by calling `completeSubmission()` directly instead of `showPayPalModal()`.

---

**Note**: This integration is designed for voluntary contributions. If you plan to implement mandatory submission fees, ensure you comply with all applicable laws and payment processing regulations in your jurisdiction.
