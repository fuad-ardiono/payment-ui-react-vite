export async function getPaymentList(customerId, page, pageSize, paymentTypeName = null) {
    const requestInit = {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*'
        },
    }

    const base = `http://localhost:8080/api/payment?page=${page}&pageSize=${pageSize}&customerId=${customerId}`;
    let url;

    if (paymentTypeName) {
        url = `${base}&typeName=${paymentTypeName}`
    } else {
        url = base;
    }

    return fetch(url, requestInit)
        .then(async (response) => {
            const responseJson = await response.json()

            if (!response.ok) {
                throw new Error(responseJson.message)
            } else {
                return responseJson.data
            }
        })
}