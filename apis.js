'use strict'

module.exports = (Mozaik, configFile, config) => {
    Mozaik.registerApi('json', require('@mozaik/ext-json/client'))
}
