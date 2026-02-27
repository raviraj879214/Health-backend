


// export function brazilianCurrency(amount) {
//     if (amount === null || amount === undefined || isNaN(Number(amount))) {
//         return "₹ 0.00";
//     }

//     return new Intl.NumberFormat("en-IN", {
//         style: "currency",
//         currency: "INR",
//     }).format(Number(amount));
// }


export function brazilianCurrency(amount) {
    if (amount === null || amount === undefined || isNaN(Number(amount))) {
        return "$0.00";
    }

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(amount));
}