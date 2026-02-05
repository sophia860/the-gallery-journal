# PayPal Configuration

## Account Information

**PayPal Business Account Email**: sophiamaybea@gmail.com

## Configuration Status

⚠️ **Action Required**: The PayPal Client ID needs to be configured in `index.html`

### Current Configuration
- **File**: `index.html` (line ~1420)
- **Status**: Placeholder `YOUR_PAYPAL_CLIENT_ID` needs to be replaced
- **Account**: sophiamaybea@gmail.com

## How to Get Your Client ID

1. **Log in to PayPal Developer**
   - Visit: https://developer.paypal.com/
   - Sign in with: sophiamaybea@gmail.com

2. **Navigate to Apps & Credentials**
   - Click on **Dashboard** → **My Apps & Credentials**

3. **Get Client ID**
   
   **For Testing (Sandbox Mode)**:
   - Under the **Sandbox** tab
   - Look for an existing app or click **Create App**
   - App name suggestion: "The Gallery Submissions"
   - Copy the **Sandbox Client ID**
   
   **For Production (Live Mode)**:
   - Under the **Live** tab
   - Look for an existing app or click **Create App**
   - App name suggestion: "The Gallery Submissions - Live"
   - Copy the **Live Client ID**

4. **Update index.html**
   - Replace `YOUR_PAYPAL_CLIENT_ID` with your Client ID
   - For testing, use Sandbox Client ID
   - For production, use Live Client ID

## Example

**Before** (Current):
```html
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD"></script>
```

**After** (Testing):
```html
<script src="https://www.paypal.com/sdk/js?client-id=AaB1bC2cD3dE4eF5fG6gH7hI8i-SANDBOX-ID&currency=USD"></script>
```

**After** (Production):
```html
<script src="https://www.paypal.com/sdk/js?client-id=AaB1bC2cD3dE4eF5fG6gH7hI8i-LIVE-ID&currency=USD"></script>
```

## Security Note

- **Client ID is PUBLIC**: Safe to include in frontend code
- **Secret Key is PRIVATE**: Never include in frontend code (not needed for this integration)

## Testing

After configuring:
1. Open the site in a browser
2. Log in as a writer
3. Submit a poem
4. The PayPal payment modal should appear with working PayPal buttons
5. Complete a test transaction (in Sandbox mode)
6. Verify the payment appears in your PayPal Sandbox account

## Support

For detailed setup instructions, see [PAYPAL_SETUP.md](./PAYPAL_SETUP.md)
