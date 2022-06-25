export function requestAmount(account, amount) {
    return fetch('/scripts/request-amount.php', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account, amount }),
    }).then(r => {
        return r.json()
    }).then(r=>{
        const data = JSON.parse(r.data);
        return data;
    })
}