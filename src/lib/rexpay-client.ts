
// class RexPayClient {
//     private baseUrl: string;
//     private credentials: { username: string; password: string };

//     constructor(mode: 'live' | 'test' = 'test') {
//         this.baseUrl = mode === 'live' 
//             ? 'https://pgs.globalaccelerex.com/api/'
//             : 'https://pgs-sandbox.globalaccelerex.com/api/';
        
//         // Use YOUR credentials from environment variables
//         this.credentials = {
//             username: process.env.REXPAY_USERNAME!,
//             password: process.env.REXPAY_SECRET_KEY!
//         };
//     }

//     private getAuthHeader(): string {
//         return 'Basic ' + btoa(`${this.credentials.username}:${this.credentials.password}`);
//     }

//     async initializePayment(paymentData: any) {
//         const response = await fetch(`${this.baseUrl}pgs/payment/v2/createPayment`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': this.getAuthHeader()
//             },
//             body: JSON.stringify(paymentData)
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         return await response.json();
//     }

//     async verifyPayment(reference: string) {
//         const response = await fetch(`${this.baseUrl}cps/v1/getTransactionStatus`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': this.getAuthHeader()
//             },
//             body: JSON.stringify({ transactionReference: reference })
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         return await response.json();
//     }
// }

// export default RexPayClient;

// lib/rexpay-client.ts
class RexPayClient {
    private baseUrl: string;
    private credentials: { username: string; password: string };
    private clientId: string;

    constructor(mode: 'live' | 'test' = 'test') {
        this.baseUrl = mode === 'live' 
            ? 'https://pgs.globalaccelerex.com/api/'
            : 'https://pgs-sandbox.globalaccelerex.com/api/';
        
        // Use YOUR credentials from environment variables
        this.credentials = {
            username: process.env.REXPAY_USERNAME!,
            password: process.env.REXPAY_SECRET_KEY!
        };
        
        this.clientId = process.env.REXPAY_CLIENT_ID!; // Your client ID
    }

    private getAuthHeader(): string {
        return 'Basic ' + btoa(`${this.credentials.username}:${this.credentials.password}`);
    }

    async initializePayment(paymentData: any) {
        // Complete payload with all required fields
        const completePayload = {
            reference: paymentData.reference,
            amount: paymentData.amount.toString(), // Ensure it's a string
            currency: paymentData.currency,
            userId: paymentData.userId,
            callbackUrl: paymentData.callbackUrl,
            clientId: this.clientId, // Add clientId
            metadata: paymentData.metadata || {},
            // Optional fields that might be required
            isV2: false, // Based on API documentation
            paymentChannel: paymentData.paymentChannel || 'DEFAULT', // Add payment channel
            country: paymentData.country || 'NGA', // Default to Nigeria
            feeBearer: paymentData.feeBearer || 'Merchant' // Who bears the fee
        };

        const response = await fetch(`${this.baseUrl}pgs/payment/v2/createPayment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getAuthHeader()
            },
            body: JSON.stringify(completePayload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    async verifyPayment(reference: string) {
        const response = await fetch(`${this.baseUrl}cps/v1/getTransactionStatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.getAuthHeader()
            },
            body: JSON.stringify({ transactionReference: reference })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
}

export default RexPayClient;