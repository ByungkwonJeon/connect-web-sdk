# **Connect Web SDK**

A lightweight and modular JavaScript SDK for embedding and managing secure authentication and payment sessions via iframes and popups.

---

## **📌 Features**
✅ **Iframe & Popup Support** – Easily integrate authentication flows.  
✅ **Modular & Maintainable** – Cleanly structured with reusable components.  
✅ **Secure Communication** – Uses `postMessage` with origin validation.  
✅ **Custom Event Handling** – Handle authentication success, cancellation, and errors.  
✅ **Dynamic Theming** – Supports customizable UI themes.  
✅ **Performance Optimized** – Uses debounced messaging and lazy initialization.  
✅ **Lightweight** – Optimized with tree-shaking and minified builds.  

---

## **📦 Installation**
### **Using npm**
```sh
npm install connect-web-sdk
```

### **Using a CDN**
```html
<script type="module" src="https://cdn.example.com/connect-web-sdk.min.js"></script>
```

---

## **🚀 Quick Start**
### **1. Basic Usage**
```html
<script type="module">
  import { Connect } from './dist/index.js';

  Connect.launch('https://example.com', {
    onDone: (data) => console.log('Done:', data),
    onError: (error) => console.error('Error:', error),
  });
</script>
```

---

### **2. Advanced Configuration**
#### **Popup Mode**
```js
Connect.launch('https://example.com', {
  onDone: (data) => console.log('Authentication Successful', data),
  onCancel: () => console.log('User Cancelled'),
  onError: (error) => console.error('Error:', error),
}, { popup: true });
```

#### **Iframe Mode**
```js
Connect.launch('https://example.com', {
  onDone: (data) => console.log('Done:', data),
  onError: (error) => console.error('Error:', error),
}, { popup: false });
```

#### **Custom Styling & Themes**
```js
Connect.launch('https://example.com', {
  onDone: (data) => console.log('Done:', data),
  onError: (error) => console.error('Error:', error),
}, { theme: 'dark' });
```

#### **Destroy Session**
```js
Connect.destroy();
```

---

## **📖 API Reference**
### **`Connect.launch(url, eventHandlers, options?)`**
| Parameter      | Type                  | Default  | Description  |
|---------------|-----------------------|----------|--------------|
| `url`         | `string`               | *None*   | The authentication or payment session URL. |
| `eventHandlers` | `ConnectEventHandlers` | *None*   | Event handlers for different session events. |
| `options`     | `ConnectOptions`       | `{}`      | Optional settings like `popup`, `theme`, etc. |

### **`Connect.destroy()`**
Destroys the active iframe or popup session.

---

## **🎯 Event Handlers**
### **`onDone(event: ConnectDoneEvent)`**
Triggered when the user completes authentication.
```js
{
  code: 200,
  reason: 'Success',
  reportData: [{ portfolioId: '1234', type: 'KYC', reportId: '5678' }]
}
```

### **`onCancel(event: ConnectCancelEvent)`**
Triggered when the user cancels the session.
```js
{
  code: 400,
  reason: 'User cancelled'
}
```

### **`onError(event: ConnectErrorEvent)`**
Triggered when an error occurs.
```js
{
  code: 500,
  reason: 'Session expired'
}
```

---

## **⚙️ Options**
| Option       | Type      | Default | Description |
|-------------|----------|---------|-------------|
| `popup`     | `boolean` | `false` | Opens session in a popup. |
| `theme`     | `'light' \| 'dark'` | `'light'` | Sets the UI theme. |

---

## **🛠 Development**
### **1. Clone the Repository**
```sh
git clone https://github.com/your-repo/connect-web-sdk.git
cd connect-web-sdk
npm install
```

### **2. Run the Development Server**
```sh
npm run dev
```

### **3. Build for Production**
```sh
npm run build
```

---

## **🧪 Testing**
```sh
npm test
```

---

## **📜 License**
MIT License. See `LICENSE` for details.

---

## **📩 Need Help?**
📧 Email: `support@example.com`  
🐦 Twitter: [@example_support](https://twitter.com/example_support)  
🚀 Open an issue on GitHub!

