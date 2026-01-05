




export class ClinicListingBusiness{

  
    
async patientcode(oldcode?: string | null) {
    const prefix = 'PQ';
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

    if (oldcode) {
        // Extract numeric part from the old code
        const numericPartMatch = oldcode.match(/\d+$/);
        const numericPart = numericPartMatch ? parseInt(numericPartMatch[0]) : 0;

        // Increment number
        const newNumber = numericPart + 1;

        // Preserve the same number of digits (leading zeros)
        const oldLength = numericPartMatch ? numericPartMatch[0].length : 4; // default 4 digits
        const newNumericPart = newNumber.toString().padStart(oldLength, '0');

        return `${prefix}-${datePart}-${newNumericPart}`;
    } else {
        // Start sequence at 0001
        return `${prefix}-${datePart}-0001`;
    }
}




}