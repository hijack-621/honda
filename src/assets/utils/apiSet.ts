async function apiGet(proxy, url, type, params) {
    switch (type) {
        case 'get':
            const rec = await proxy.$http.get(url, params);
            return rec
            break;

        case 'post':

            break;
    }
}

export { apiGet }