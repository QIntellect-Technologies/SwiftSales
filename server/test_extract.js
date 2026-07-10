const q = 'xyz,453-7654,babdbsbbsb,,ryk,64200';
const context = { cart: [1] };

const parts = q.split(',').map(p => p.trim()).filter(Boolean);
console.log('parts:', parts);
if (parts.length >= 3 && !context.customer_name) {
    if (parts[0] && !/\d{4,}/.test(parts[0])) {
        context.customer_name = parts[0];
    }
    const phonePart = parts.find(p => /[\d\-]{7,}/.test(p));
    if (phonePart && !context.customer_phone) {
        context.customer_phone = phonePart;
    }
    const addrParts = parts.filter(p => p !== parts[0] && p !== phonePart);
    if (addrParts.length > 0 && !context.delivery_address) {
        context.delivery_address = addrParts.join(', ');
    }
}
console.log('Resulting context:', context);
