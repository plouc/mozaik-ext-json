'use strict'

const chalk = require('chalk')

module.exports = mozaik => {
    return {
        request: ({ url, headers }) => {
            const options = {
                uri: url,
                json: true,
                headers,
            }

            mozaik.logger.info(
                chalk.yellow(`[json] calling ${url} - ${Object.keys(headers).length} header(s)`)
            )

            return mozaik.request(options)
        },
    }
}
