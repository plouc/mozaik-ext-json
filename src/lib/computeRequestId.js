export default (url, headers) => {
    let headersHash = ''
    for (let header in headers) {
        headersHash += `${header}:${headers[header]}`
    }

    return `json.request.${url}.${headersHash}`
}
