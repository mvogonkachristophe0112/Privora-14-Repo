# 🌐 Local Network Deployment Guide

## Quick Start

Run this single command to deploy on your local network:

```bash
START_LAN.bat
```

This will:
1. Auto-detect your IP address
2. Configure backend and frontend for LAN access
3. Start both servers bound to 0.0.0.0
4. Display the access URL for other devices

---

## Access from Other Devices

### Your Server IP
The script will display your IP address (e.g., `192.168.1.100`)

### Access URLs
- **Frontend**: `http://YOUR_IP:3000`
- **Backend**: `http://YOUR_IP:5000`

### Example
If your IP is `192.168.1.100`:
- Open `http://192.168.1.100:3000` on any device connected to the same Wi-Fi

---

## Configuration Details

### Backend (Already Configured)
- Binds to `0.0.0.0:5000` (accessible from network)
- CORS allows all local network origins
- Socket.IO accessible from LAN

### Frontend
- Runs with `-H 0.0.0.0` flag
- Environment variables set to use host IP
- API and Socket URLs configured for LAN

---

## Firewall Configuration (Windows)

If devices can't connect, open the required ports:

```cmd
netsh advfirewall firewall add rule name="Privora Frontend" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="Privora Backend" dir=in action=allow protocol=TCP localport=5000
```

Or use Windows Defender Firewall GUI:
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → TCP → Specific ports: `3000,5000`
5. Allow the connection
6. Apply to all profiles
7. Name it "Privora"

---

## Testing Cross-Device File Transfer

### Test Plan

#### Test 1: Network Access
- [ ] Open `http://YOUR_IP:3000` from phone
- [ ] Verify page loads correctly
- [ ] Check no CORS errors in console

#### Test 2: Multi-Device Login
- [ ] Create account on Laptop A
- [ ] Create different account on Phone B
- [ ] Both should login successfully

#### Test 3: Real-time Presence
- [ ] Login on both devices
- [ ] Check "Online Users" page
- [ ] Verify both users appear with green dots
- [ ] Logout from one device
- [ ] Verify user disappears from list

#### Test 4: File Transfer
- [ ] On Laptop A: Go to "Send File"
- [ ] Upload a file (image/PDF)
- [ ] Select Phone B user as recipient
- [ ] Click "Encrypt & Send"
- [ ] Save the encryption key

#### Test 5: Receive Notification
- [ ] On Phone B: Check for toast notification
- [ ] Go to "Receive" page
- [ ] Verify file appears in list
- [ ] Status should be "pending"

#### Test 6: Decrypt File
- [ ] On Phone B: Enter decryption key
- [ ] Click "Decrypt & Download"
- [ ] Verify file downloads/previews correctly
- [ ] Status should change to "decrypted"

#### Test 7: History
- [ ] On Laptop A: Check "History" → "Sent"
- [ ] Verify transfer appears
- [ ] On Phone B: Check "History" → "Received"
- [ ] Verify transfer appears
- [ ] Both should show "decrypted" status

#### Test 8: Different File Types
- [ ] Test with image (.jpg, .png)
- [ ] Test with PDF (.pdf)
- [ ] Test with text (.txt)
- [ ] Test with small video (.mp4) if supported

---

## Troubleshooting

### Can't Connect from Other Devices

**Check 1: Same Wi-Fi Network**
- Ensure all devices are on the same Wi-Fi network
- Check Wi-Fi name on both devices

**Check 2: Firewall**
- Run firewall commands above
- Or temporarily disable firewall to test

**Check 3: IP Address**
- Verify IP address is correct
- Run `ipconfig` to check current IP
- IP might change if router assigns new address

**Check 4: Ports**
- Verify ports 3000 and 5000 are not blocked
- Check if other apps are using these ports

### CORS Errors

The backend is configured to allow all origins for local network deployment. If you still see CORS errors:
1. Check backend logs for errors
2. Verify backend is running on 0.0.0.0
3. Restart both servers

### Socket.IO Not Connecting

1. Check `NEXT_PUBLIC_SOCKET_URL` in `frontend/.env.local`
2. Should be `http://YOUR_IP:5000`
3. Restart frontend after changing

### File Transfer Fails

1. Check backend logs for errors
2. Verify encryption key format (key:iv)
3. Check file size (max 100MB)
4. Verify both users are logged in

---

## Manual Configuration

If you prefer manual setup:

### 1. Get Your IP Address
```cmd
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

### 2. Update Backend `.env`
```env
PORT=5000
HOST=0.0.0.0
CORS_ORIGIN=http://YOUR_IP:3000
FRONTEND_URL=http://YOUR_IP:3000
```

### 3. Update Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://YOUR_IP:5000
NEXT_PUBLIC_SOCKET_URL=http://YOUR_IP:5000
NEXT_PUBLIC_HOST_IP=YOUR_IP
```

### 4. Start Servers
```cmd
# Backend
cd backend && npm run dev

# Frontend (in new terminal)
cd frontend && npm run dev -- -H 0.0.0.0
```

---

## Security Notes

### For Local Network Use
- CORS is open to allow LAN access
- Only use on trusted networks (home/office Wi-Fi)
- Don't expose to public internet

### For Production
- Use proper CORS configuration
- Enable HTTPS
- Use environment-specific settings
- Follow [`VERCEL_DEPLOYMENT.md`](VERCEL_DEPLOYMENT.md)

---

## Features on LAN

All features work across devices:
✅ Authentication
✅ Real-time presence
✅ File encryption/decryption
✅ File transfers
✅ Notifications
✅ History tracking
✅ File management

---

## UI Features

### Server Info Card (Dashboard)
- Shows your server IP
- Shows access URL
- Copy button for easy sharing
- LAN mode indicator

### Online Users
- Shows all connected devices
- Green dot = online
- Device name/username
- Send file button

---

## Performance Tips

### For Better LAN Performance
1. Use 5GHz Wi-Fi if available
2. Keep devices close to router
3. Minimize network traffic
4. Use wired connection for host machine

### File Size Limits
- Maximum: 100MB per file
- Larger files take longer to encrypt/decrypt
- Consider splitting very large files

---

## Next Steps

1. Run `START_LAN.bat`
2. Note your IP address
3. Share URL with other devices
4. Test file transfer
5. Enjoy secure file sharing on your network!

---

**Status**: ✅ CONFIGURED FOR LOCAL NETWORK
**Script**: [`START_LAN.bat`](START_LAN.bat)
**Access**: `http://YOUR_IP:3000`
