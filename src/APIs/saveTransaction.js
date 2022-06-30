//save-transaction
export function saveTransaction(url, transaction) {
    return fetch('/scripts/save-transaction.php', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, transaction }),
    }).then(r => {
        return r.json()
    }).then(r=>{
        const data = r.data;
        return data;
    })
}