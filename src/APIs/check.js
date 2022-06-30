export function check(currentAccount) {
    fetch('/scripts/check.php', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account: currentAccount }),
    }).then(r => {
        return r.json()
    }).then(r => {
        const detail = JSON.parse(r.data);
        detail.account = currentAccount;
        let connected = new CustomEvent('connected', { detail });
        window.dispatchEvent(connected);
    })
}