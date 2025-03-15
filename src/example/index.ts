import { ClnkSDK } from "../index";

// Example of using the SDK

async function main() {
  // Initialize the SDK with required API key
  const sdk = new ClnkSDK({
    apiUrl: "http://localhost:8000/graphql",
    apiKey: "",
  });

  try {
    // Login to get access token
    const authData = await sdk.login({
      email: "miracleficient@gmail.com",
      password: "Pass1234",
    });

    console.log("Logged in successfully:", authData.user?.name);

    // Create a short URL
    const newUrl = await sdk.createUrl({
      url: "https://example.com/very-long-url-that-needs-shortening",
      shorten: true,
    });

    console.log("Short URL created:", newUrl.shortUrl);

    // Generate QR code for the short URL
    const qrCodeUrl = sdk.generateQRCodeUrl(newUrl.shortUrl);
    console.log("QR Code URL:", qrCodeUrl);

    // Get all URLs for the current user
    const urls = await sdk.getUrls({
      pagination: { page: 1, limit: 10 },
    });

    console.log("User URLs:", urls.data?.length);

    // Update a URL
    if (urls.data && urls.data.length > 0) {
      const urlToUpdate = urls.data[0];
      if (!urlToUpdate) {
        console.error("URL not found");
        return;
      }
      const updatedUrl = await sdk.updateUrl({
        id: urlToUpdate?.id,
        url: urlToUpdate?.url,
        shortUrl: "custom-short-code",
      });

      console.log("Updated URL:", updatedUrl.shortUrl);
    }

    // Generate API key for programmatic access
    const apiKey = await sdk.generateApiKey();
    console.log("New API Key:", apiKey.key);

    // Get current user info
    const me = await sdk.getCurrentUser();
    console.log("Current user:", me.name);
  } catch (error) {
    console.error("Error using SDK:", error);
  }
}

// Usage with async/await in a React component or Node.js application
main().catch(console.error);

// Alternatively, create a utility function for short URLs and QR codes
async function createShortUrlAndQR(longUrl: string, accessToken: string) {
  const sdk = new ClnkSDK({
    apiKey: "your-api-key-here",
    accessToken: accessToken, // If you already have a token
  });

  return sdk
    .createUrl({
      url: longUrl,
      shorten: true,
    })
    .then((url) => {
      return {
        shortUrl: url.shortUrl,
        qrCodeUrl: sdk.generateQRCodeUrl(url.shortUrl),
      };
    });
}

// Example usage in browser
// document.getElementById('shortenButton').addEventListener('click', () => {
//   const longUrl = document.getElementById('urlInput').value;
//   const accessToken = localStorage.getItem('accessToken');

//   createShortUrlAndQR(longUrl, accessToken)
//     .then(result => {
//       document.getElementById('shortUrl').textContent = result.shortUrl;
//       document.getElementById('qrCode').src = result.qrCodeUrl;
//     })
//     .catch(err => {
//       alert('Error creating short URL: ' + err.message);
//     });
// });
